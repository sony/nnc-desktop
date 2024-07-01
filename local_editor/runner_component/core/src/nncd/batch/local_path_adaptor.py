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

import os
import re

from local_util import consts


def make_local_dataset_path(path, tenant_id, dataset_id):
    if path.startswith(consts.LOCAL_MAPPING_DIR):
        bucket_name = os.path.dirname(path.replace(consts.LOCAL_MAPPING_DIR, ""))[1:]
        if bucket_name:
            return bucket_name

    return os.path.normpath('{tenant_id}/{dataset_id}/{data_path}'.format(
        tenant_id=tenant_id,
        dataset_id=dataset_id,
        data_path=path
    ))


def make_local_project_file_path(path, project_id, job_id):
    return os.path.normpath('{project_id}/results/{job_id}/{data_path}'.format(
        project_id=project_id,
        job_id=job_id,
        data_path=path
    ))

