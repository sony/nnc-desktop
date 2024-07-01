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

from flask import Blueprint

from core.star.star_project import star_project
from core.star.get_starred_project import get_starred_project
from core.star.delete_starred_project import delete_starred_project

star_blueprint = Blueprint(
    "star",
    __name__,
    url_prefix="/v1/users/<string(minlength=0):user_id>/stars/projects"
)

star_blueprint.add_url_rule(
    rule="/<int:project_id>",
    endpoint='star_project',
    view_func=star_project,
    methods=['PUT']
)

star_blueprint.add_url_rule(
    rule="",
    endpoint='get_starred_project',
    view_func=get_starred_project,
    methods=['GET']
)

star_blueprint.add_url_rule(
    rule="/<int:project_id>",
    endpoint='delete_starred_project',
    view_func=delete_starred_project,
    methods=['DELETE']
)

