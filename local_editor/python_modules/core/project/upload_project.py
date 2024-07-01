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
from flask import request

from conf import settings
from utils import path_util, file_utils
from utils.exception import NNcdException, CODE
from components.project_importer import project_importer


def upload_project(user_id: str, project_id: int, configuration_format: str):
    data = request.data
    if not data:
        raise NNcdException(CODE.NNCD_BAD_REQUEST, 'No data uploading project.')
    config_path = path_util.make_import_config_dir_path(project_id)
    with open(config_path, 'wb') as f:
        f.write(data)

    # convert nnp to sdcproj
    dst_configuration_path = file_utils.ProjectFile('sdcproj', project_id).full_path
    project_importer.handle(
        project_id=project_id,
        configuration_format=configuration_format,
        src_file_path=config_path,
        dst_configuration_file_path=dst_configuration_path,
        dst_nnp_dir_path=os.path.dirname(config_path)
    )


    return {
        'status': 'OK'
    }