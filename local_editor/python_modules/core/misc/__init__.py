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

from core.misc.get_sample_projects import get_sample_projects
from core.misc.get_info import get_info
from core.misc.post_log import post_log
from core.misc.get_plan_list import get_plan_list
from core.misc.nnablamdba import nnablamdba
from core.misc.get_download_formats import get_download_formats
from core.misc.export_network import export_network
from core.misc.env_info import get_env_info

misc_blueprint = Blueprint(
    "misc",
    __name__,
    url_prefix="/v1/misc"
)

misc_blueprint.add_url_rule(
    rule="/sample_projects",
    endpoint='get_sample_projects',
    view_func=get_sample_projects,
    methods=['GET']
)

misc_blueprint.add_url_rule(
    rule="/plans",
    endpoint='get_plan_list',
    view_func=get_plan_list,
    methods=['GET']
)

misc_blueprint.add_url_rule(
    rule="/info",
    endpoint='get_info',
    view_func=get_info,
    methods=['GET']
)

misc_blueprint.add_url_rule(
    rule="/log",
    endpoint='post_log',
    view_func=post_log,
    methods=['POST']
)

misc_blueprint.add_url_rule(
    rule="/nnablambda",
    endpoint="nnablambda",
    view_func=nnablamdba,
    methods=["POST"]
)

misc_blueprint.add_url_rule(
    rule="/download_formats",
    endpoint="get_download_formats",
    view_func=get_download_formats,
    methods=["GET"]
)

misc_blueprint.add_url_rule(
    rule="/status",
    endpoint="get_status",
    view_func=lambda: {'status': "OK"},
    methods=["GET"]
)

misc_blueprint.add_url_rule(
    rule="/export_network",
    endpoint="export_network",
    view_func=export_network,
    methods=["POST"]
)

misc_blueprint.add_url_rule(
    rule="/abci_use_rate",
    endpoint="get_abci_use_rate",
    view_func=lambda: {},
    methods=["GET"]
)

misc_blueprint.add_url_rule(
    rule="/env_info",
    endpoint="get_env_info",
    view_func=get_env_info,
    methods=["GET"]
)