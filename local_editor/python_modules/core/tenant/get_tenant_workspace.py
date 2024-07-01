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


from sqlite3db.models import Users, Datasets, Jobs, fn


def get_tenant_workspace(user_id: str, tenant_id: str):
    user_id = 1
    workspace_quota = Users.select(Users.workspace_quota)\
        .where(Users.user_id == user_id).scalar()

    job_workspace = Jobs.select(fn.SUM(Jobs.storage_used))\
        .where(Jobs.tenant_id == tenant_id, Jobs.deleted == False).scalar()

    dataset_workspace = Datasets.select(fn.SUM(Datasets.storage_used))\
        .where(Datasets.tenant_id == tenant_id, Datasets.deleted == False).scalar()

    return {
        "job_workspace_used": int(job_workspace or 0),
        "dataset_workspace_used": int(dataset_workspace or 0),
        "workspace_quota": workspace_quota
    }
