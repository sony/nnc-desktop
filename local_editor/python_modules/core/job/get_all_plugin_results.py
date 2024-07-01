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
import re

from conf import consts
from utils import common
from utils.common import is_valid_uuid

PLUGIN_LOG_FILENAME = 'plugin_log.txt'


def get_all_plugin_results(user_id: str, project_id: int, job_id: int):
    # valid job
    common.find_job_with_validation(project_id, job_id)

    plugin_results = []
    plugins_folder = os.path.join(
        common.get_result_job_file_dir(project_id, job_id), 'plugins')
    for path in _get_relative_file_path(plugins_folder):
        (plugin_id, output_name, file_name) = _extract_plugin_id_and_output_name_and_file_name(path)
        if plugin_id is None or file_name is None or output_name is None:
            continue
        if file_name == PLUGIN_LOG_FILENAME:
            continue
        file_path = os.path.join(plugins_folder, path)
        plugin_results.append({
            'plugin_id': plugin_id,
            'name': output_name,
            'data_type': _get_data_type(file_name),
            'size': os.path.getsize(file_path),
            'update_datetime': os.path.getmtime(file_path)
        })

    return {
        'results': sorted(
            plugin_results,
            key=lambda x: x['update_datetime'],
            reverse=True
        )
    }

def _get_relative_file_path(dirctory):
    for dir_path, _, filenames in os.walk(dirctory):
        for filename in filenames:
            rel_dir = os.path.relpath(dir_path, dirctory)
            yield os.path.join(rel_dir, filename)

def _split_path_recursive(path):
    head, tail = os.path.split(path)
    if not head or head == path:
        return [tail] if tail else []
    return _split_path_recursive(head) + [tail]

def _extract_plugin_id_and_output_name_and_file_name(key: str):
    parts = _split_path_recursive(key)
    if len(parts) == 3 and is_valid_uuid(parts[0]):
        return parts
    return [None, None, None]

def _get_data_type(name):
    """infer data type from file name"""
    ext = os.path.splitext(name)[1]
    if ext.startswith("."):
        ext = ext[1:]
    if ext in consts.DATA_CONTENT_TYPE:
        return consts.DATA_CONTENT_TYPE[ext]
    return ext
