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
from core.project.get_projects import get_projects
from core.project.get_project import get_project
from core.project.copy_project import copy_project
from core.project.get_configuration import get_configuration
from core.project.update_configuration import update_configuration
from core.project.create_report import create_report
from core.project.get_report import get_report
from core.project.get_report_html import get_report_html
from core.project.update_project_name import update_project_name
from core.project.delete_project import delete_project
from core.project.create_project import create_project
from core.project.update_metadata import update_metadata
from core.project.get_metadata import get_metadata
from core.project.upload_project import upload_project

project_blueprint = Blueprint(
    "project",
    __name__,
    url_prefix="/v1/users/<string(minlength=0):user_id>/projects"
)

project_blueprint.add_url_rule(
    rule="/",
    endpoint='get_projects',
    view_func=get_projects,
    methods=['GET']
)

project_blueprint.add_url_rule(
    rule="",
    endpoint="create_project",
    view_func=create_project,
    methods=["POST"]
)

project_blueprint.add_url_rule(
    rule="/<int:project_id>",
    endpoint="get_project",
    view_func=get_project,
    methods=["GET"]
)

project_blueprint.add_url_rule(
    rule="/<int:project_id>",
    endpoint="delete_project",
    view_func=delete_project,
    methods=["DELETE"]
)

project_blueprint.add_url_rule(
    rule="/<int:project_id>/copy",
    endpoint="copy_project",
    view_func=copy_project,
    methods=["POST"]
)

project_blueprint.add_url_rule(
    rule="/<int:project_id>/configuration",
    endpoint="get_configuration",
    view_func=get_configuration,
    methods=["GET"]
)

project_blueprint.add_url_rule(
    rule="/<int:project_id>/configuration",
    endpoint="update_configuration",
    view_func=update_configuration,
    methods=["PUT"]
)

project_blueprint.add_url_rule(
    rule="/<int:project_id>/reports",
    endpoint="create_report",
    view_func=create_report,
    methods=["POST"]
)

project_blueprint.add_url_rule(
    rule="/<int:project_id>/reports/<int:report_id>",
    endpoint="get_report",
    view_func=get_report,
    methods=["GET"]
)

project_blueprint.add_url_rule(
    rule="/<int:project_id>/reports/<int:report_id>/report.html",
    endpoint="get_report_html",
    view_func=get_report_html,
    methods=["GET"]
)

project_blueprint.add_url_rule(
    rule="/<int:project_id>/project_name",
    endpoint="update_project_name",
    view_func=update_project_name,
    methods=["PUT"]
)

project_blueprint.add_url_rule(
    rule="/<int:project_id>/metadata",
    endpoint="get_metadata",
    view_func=get_metadata,
    methods=["GET"]
)

project_blueprint.add_url_rule(
    rule="/<int:project_id>/metadata/<string:metadata_name>",
    endpoint="update_metadata",
    view_func=update_metadata,
    methods=["PUT"]
)

project_blueprint.add_url_rule(
    rule="/<int:project_id>/<string:configuration_format>/project.data",
    endpoint="upload_project",
    view_func=upload_project,
    methods=["PUT"]
)

