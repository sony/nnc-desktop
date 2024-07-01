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

from utils import common


def get_log(user_id: str, project_id: int, job_id: int, log_type: str):
    ext_path = request.args.get('ext_path') if log_type in ['plugin'] else None
    return common.get_log_from_file(project_id, job_id, log_type, ext_path=ext_path)

