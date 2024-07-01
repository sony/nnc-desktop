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

from flask import request
import datetime

from conf import consts
from utils import common
from sqlite3db.models import Projects
from utils.exception import NNcdException, CODE


def update_configuration(user_id: str, project_id: int):
    user_id = 1

    configuration = request.json.get("configuration")
    configuration_format = request.json.get("configuration_format")

    project = Projects.select().where(
            Projects.project_id == project_id, Projects.deleted == False
        ).first()
    if not project:
        raise NNcdException(CODE.NNCD_BAD_REQUEST, f'Not found project')

    if not common.is_editable_project(project, user_id):
        return {
            "status": consts.UPDATE_CONFIG_STATUS_LOCKED,
            "last_modified_user_id": str(project.last_modified_uid)
        }

    # update project's update_datetime, last_modified_uid, last_modified_datetime
    project.update_datetime = datetime.datetime.utcnow()
    project.last_modified_uid = user_id
    project.last_modified_datetime = project.update_datetime
    project.save()

    # write to the configuration file
    common.put_configuration_to_file(
        configuration_format,
        configuration,
        project_id
    )

    return {
        "status": consts.UPDATE_CONFIG_STATUS_OK,
        "last_modified_user_id": str(project.last_modified_uid)
    }


