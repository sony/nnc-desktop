# Copyright 2024 Sony Group Corporation.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import os
import csv
import base64
from flask import request

from conf import consts
from utils import common
from sqlite3db.models import Plugins
from utils.file_utils import ProjectFile
from utils.exception import NNcdException, CODE


def get_plugin_result(user_id: str, project_id: int, job_id: int, plugin_id: str):
    output_name = request.args.get("name")

    job = common.find_job_with_validation(project_id, job_id)
    plugin = Plugins.select().where(
            Plugins.owner_tenant_id == consts.SAMPLE_TENANT_ID, Plugins.plugin_id == plugin_id
        ).first()
    if not plugin:
        plugin = Plugins.select().where(
                Plugins.owner_tenant_id == job.tenant_id, Plugins.plugin_id == plugin_id
            ).first()
    if not plugin:
        raise NNcdException(CODE.NNCD_BAD_REQUEST, 'This plugin is not found')

    plugin_result_path = _get_plugin_result_path(
        project_id, job_id, plugin_id, output_name, plugin.parameters)
    if not os.path.exists(plugin_result_path):
        raise NNcdException(CODE.NNCD_PLUGIN_RESULT_NOT_FOUND, 'Failed to get plugin result')
    if os.path.getsize(plugin_result_path) == 0:
        raise NNcdException(CODE.NNCD_PLUGIN_RESULT_EMPTY, 'Failed to get plugin result case of empty')
    
    plugin_result = {}
    plugin_result['data_type'] = _get_data_type(plugin_result_path)
    if plugin_result['data_type'] == 'csv':
        plugin_result['csv_data'] = _to_2d_from_csv_file(plugin_result_path)
    else:
        plugin_result['b64_data'] = _to_base64_from_binary_file(plugin_result_path)
        
    return plugin_result


def _get_plugin_result_path(project_id, job_id, plugin_id, output_name, plugin_parameters: list) -> str:
    # add ext to output_name
    plugins_path = os.path.join(
        common.get_result_job_file_dir(project_id, job_id), 
        f"plugins/{plugin_id}/{output_name}")
    file_name = output_name
    for name in os.listdir(plugins_path):
        if name.startswith(output_name):
            file_name = name

    for parameter in plugin_parameters:
        if parameter.get('direction') != 'output':
            continue
        if parameter.get("extension"):
            file_name += '.{}'.format(parameter['extension'])
    return os.path.join(plugins_path, file_name)


def _get_data_type(name):
    """infer data type from file name"""
    ext = os.path.splitext(name)[1]
    if ext.startswith("."):
        ext = ext[1:]
    if ext in consts.DATA_CONTENT_TYPE:
        return consts.DATA_CONTENT_TYPE[ext]
    return ext


def _to_2d_from_csv_file(file_name: str):
    """convert to 2d array from csv file"""
    with open(file_name) as f:
        reader = csv.reader(f)
    return [row for row in reader]


def _to_base64_from_binary_file(file_name: str) -> str:
    """convert base64 string from binary file """
    with open(file_name, 'rb') as f:
        data = f.read()
    return base64.b64encode(data).decode("ascii")
