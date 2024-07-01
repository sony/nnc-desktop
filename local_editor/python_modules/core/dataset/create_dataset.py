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

from sqlite3db.models import Users


def create_dataset(user_id: str):
    user_id = 1
    tenant_id = request.args.get('tenant_id')
    if not tenant_id:
        user = Users.select().where(Users.user_id == user_id).first()
        tenant_id = user.tenant_id
    return {'encrypted_text': tenant_id}