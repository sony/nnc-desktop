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

from sqlite3db.models import Users, Tenants
from utils import common


def get_tenants(user_id: str):
    # just return the tenant of local user
    user_id = 1
    user = Users.select(Users.tenant_id).where(Users.user_id == user_id).first()
    tenant = Tenants.select().where(Tenants.tenant_id == user.tenant_id).first()

    tenants = [{
        "tenant_id": tenant.tenant_id,
        "nickname": tenant.name,
        "purpose": tenant.purpose,
        "role": tenant._meta.OWNER,
        "create_datetime": common.to_iso8601str(tenant.create_datetime)
    }]
    return {"tenants": tenants}
