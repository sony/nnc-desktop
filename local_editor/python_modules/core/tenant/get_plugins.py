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

from conf import consts
from sqlite3db.models import Plugins


def get_plugins(user_id: str, tenant_id: str):
    def to_parameter_form(in_params: dict):
        ret_params = {
            'name': in_params['name'],
            'direction': in_params['direction'],
            'description': in_params['description'],
            'format': in_params['format']
        }
        if in_params.get('default'):
            ret_params['default'] = in_params['default']
        if in_params.get('readonly'):
            ret_params['readonly'] = in_params['readonly']
        return ret_params

    def to_response_form(plugin):
        return {
            'owner_tenant_id': str(plugin.owner_tenant_id),
            'plugin_id': plugin.plugin_id,
            'plugin_name': plugin.plugin_name,
            'description': plugin.description,
            'parameters': [
                to_parameter_form(x) for x in plugin.parameters
            ]
        }

    plugins = Plugins.select().where(
            (Plugins.owner_tenant_id == tenant_id) |
            (Plugins.owner_tenant_id == consts.SAMPLE_TENANT_ID)
        ).order_by(Plugins.create_datetime.asc())
    plugins_as_dicts = [to_response_form(x) for x in plugins]

    return {
        'plugins': plugins_as_dicts
    }
