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
import json
from flask import request, url_for

from conf import consts
from utils import common, path_util, file_utils
from sqlite3db.models import Projects
from components.project_importer import project_importer


def create_project(user_id: str):
    user_id = 1

    project_name = request.json.get('project_name')
    configuration = request.json.get('configuration')
    configuration_format = request.json.get('configuration_format')
    tenant_id = request.json.get('tenant_id')
    file_size = request.json.get('file_size')

    project = Projects.create(
        name=project_name, tenant_id=tenant_id,
        owner_user_id=user_id, last_modified_uid=user_id
    )

    try:
        response = {
            'project_id': str(project.project_id),
            'async': False
        }
        
        # new project and upload sdcproj file
        if (configuration_format == 'sdcproj'
            or (not configuration and file_size is None)
            or configuration_format is None):
            common.put_configuration_to_file(
                configuration_format, configuration, project.project_id
            )

            return response
        
        # create nnp temp dir
        temp_nnp_dir_path = path_util.make_temp_nnp_dir_path(project.project_id)
        if not os.path.exists(temp_nnp_dir_path):
            os.makedirs(temp_nnp_dir_path)
        
        # .prototxt, .nnptxt
        if configuration:
            import_config_path = os.path.join(temp_nnp_dir_path, f'data.{configuration_format}')
            with open(import_config_path, 'w') as f:
                f.write(configuration)

        # create project configurations dir
        configuration_file_obj = file_utils.ProjectFile('sdcproj', project.project_id)
        if not os.path.exists(configuration_file_obj.file_dir_path):
            os.makedirs(configuration_file_obj.file_dir_path)

        # add import_status.json
        status_file_path =  path_util.make_import_status_json_path(project.project_id)
        json.dump({
            'import_status': consts.ImportStatus.READY,
            'import_sdcproj_status': consts.ImportStatus.READY,
            'import_error_msg': None,
        }, open(status_file_path, 'w'))

        if file_size is None:
       
            project_importer.handle(
                project_id=project.project_id,
                configuration_format=configuration_format,
                src_file_path=import_config_path,
                dst_configuration_file_path=configuration_file_obj.full_path,
                dst_nnp_dir_path=temp_nnp_dir_path
            )
            response['async'] = True
        else:
            response['async'] = True
            response['upload_url'] = _get_upload_project_url(
                user_id, project.project_id, configuration_format
            )
        return response
    except:
        project.delete().execute()
        raise


def _get_upload_project_url(user_id: int, project_id: int, configuration_format):
    return url_for(
        endpoint="project.upload_project",
        user_id=user_id, project_id=project_id,
        configuration_format=configuration_format
    )
