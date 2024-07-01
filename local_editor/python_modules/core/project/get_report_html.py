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
from flask import send_file
from utils import common


def get_report_html(user_id: str, project_id: int, report_id: int):
    file_dir = common.get_reports_file_dir(project_id, report_id)
    file_path = os.path.join(file_dir, 'report.html')
    return send_file(file_path, as_attachment=True)    
