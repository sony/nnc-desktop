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

from core.account.session import check_session
from core.account.tos_pp import get_tos_pp
from core.account.get_nickname import get_nickname
from core.account.update_nickname import update_nickname
from core.account.get_process_resource import get_process_resource
from core.account.get_settings import get_settings
from core.account.update_settings import update_settings

account_blueprint = Blueprint(
    'account',
    __name__,
    url_prefix="/v1"
)

account_blueprint.add_url_rule(
    rule="/session/<string(minlength=0):user_id>/check",
    endpoint="check_session",
    view_func=check_session,
    methods=["POST"]
)

account_blueprint.add_url_rule(
    rule="/tos_pp_agreements",
    endpoint="get_tos_pp",
    view_func=get_tos_pp,
    methods=["GET"]
)

account_blueprint.add_url_rule(
    rule="/users/<string(minlength=0):user_id>/account/nickname",
    endpoint="get_nickname",
    view_func=get_nickname,
    methods=["GET"]
)

account_blueprint.add_url_rule(
    rule="/users/<string(minlength=0):user_id>/account/nickname",
    endpoint="update_nickname",
    view_func=update_nickname,
    methods=["PUT"]
)

account_blueprint.add_url_rule(
    rule="/users/<string(minlength=0):user_id>/account/process_resource",
    endpoint="get_process_source",
    view_func=get_process_resource,
    methods=["GET"]
)

account_blueprint.add_url_rule(
    rule="/users/<string(minlength=0):user_id>/settings",
    endpoint="get_settings",
    view_func=get_settings,
    methods=["GET"]
)

account_blueprint.add_url_rule(
    rule="/users/<string(minlength=0):user_id>/settings",
    endpoint="update_settings",
    view_func=update_settings,
    methods=["PUT"]
)