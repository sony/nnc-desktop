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

from utils import common
from utils.exception import NNcdException, CODE
from sqlite3db.models import Projects, ProjectStars


def get_project(user_id: str, project_id: int):
    project_id = int(project_id)

    project = Projects.select().where(
            Projects.project_id == project_id, Projects.deleted == False
        ).first()
    if not project:
        raise NNcdException(CODE.NNCD_BAD_REQUEST, f'Not found project')
    labels = common.find_project_labels(project_id)

    result_json = {
        "project_id": str(project.project_id),
        "tenant_id": str(project.tenant_id),
        "owner_user_id": str(project.owner_user_id),
        "project_name": project.name,
        "deleted": project.deleted,
        "create_datetime": common.to_iso8601str(project.create_datetime),
        "update_datetime": common.to_iso8601str(project.update_datetime),
        "labels": labels,
        "status": "completed",
        "progress": 100
    }
    return result_json
