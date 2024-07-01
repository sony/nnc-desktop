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
from sqlite3db.models import Projects
from utils import project_utils
from conf import consts


def get_configuration(user_id: str, project_id: int):
    user_id = 1
    configuration_format = request.args.get("configuration_format")

    project = Projects.select().where(
            Projects.project_id == project_id, Projects.deleted == False
        ).first()
    
    new_configuration, configuration_format = project_utils.get_configuration_from_file(
        configuration_format, project_id
    )
    if new_configuration is None:
        new_configuration = ""
        configuration_format = "sdcproj"

    readonly_flag = False
    if str(user_id) != str(project.last_modified_uid):
        end_time_of_lock = (project.last_modified_datetime
                            + datetime.timedelta(seconds=consts.LOCK_DURATION_SEC))
        readonly_flag = datetime.datetime.utcnow() < end_time_of_lock

    # genarate json data
    result_json = {
        "configuration_format": configuration_format,
        "configuration": new_configuration,
        "readonly": readonly_flag,
        "last_modified_user_id": str(project.last_modified_uid)
    }
    return result_json


