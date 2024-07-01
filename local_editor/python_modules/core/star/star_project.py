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

from sqlite3db.models import Projects, ProjectStars


def star_project(user_id: str, project_id: int):
    user_id = 1

    starred_project = ProjectStars.select().filter(
            user_id=user_id, project_id=project_id).first()
    if not starred_project:
        ProjectStars.create(user_id=user_id, project_id=project_id)
        project = Projects.select().filter(
            project_id=project_id, deleted=False).first()
        project.star_count += 1
        project.save()
    
    return {}