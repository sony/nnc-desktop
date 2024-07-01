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
from core.tenant.get_tenants import get_tenants
from core.tenant.get_tenant_plan import get_tenant_plan
from core.tenant.get_tenant_workspace import get_tenant_workspace
from core.tenant.tenant_instance import get_tenant_instance, create_tenant_instance, delete_tenant_instance
from core.tenant.get_plugins import get_plugins

tenant_blueprint = Blueprint(
    'tenant',
    __name__,
    url_prefix="/v1/users/<string(minlength=0):user_id>/tenants"
)

tenant_blueprint.add_url_rule(
    rule="",
    endpoint="get_tenants",
    view_func=get_tenants,
    methods=["GET"]
)

tenant_blueprint.add_url_rule(
    rule="/<string:tenant_id>/plan",
    endpoint="get_tenant_plan",
    view_func=get_tenant_plan,
    methods=["GET"]
)

tenant_blueprint.add_url_rule(
    rule="/<string:tenant_id>/workspace",
    endpoint="get_tenant_worksapce",
    view_func=get_tenant_workspace,
    methods=["GET"]
)

tenant_blueprint.add_url_rule(
    rule="/<string:tenant_id>/instance",
    endpoint="get_tenant_instance",
    view_func=get_tenant_instance,
    methods=["GET"]
)

tenant_blueprint.add_url_rule(
    rule="/<string:tenant_id>/instance",
    endpoint="create_tenant_instance",
    view_func=create_tenant_instance,
    methods=["POST"]
)

tenant_blueprint.add_url_rule(
    rule="/<string:tenant_id>/instance",
    endpoint="delete_tenant_instance",
    view_func=delete_tenant_instance,
    methods=["DELETE"]
)

tenant_blueprint.add_url_rule(
    rule="/<string:tenant_id>/plugins",
    endpoint="get_plugins",
    view_func=get_plugins,
    methods=["GET"]
)
