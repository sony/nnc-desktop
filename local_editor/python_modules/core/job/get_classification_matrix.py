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

import json

from utils import common
from utils.file_utils import ProjectFile
from sqlite3db.models import Jobs, Tasks
from utils.exception import NNcdException, CODE


def get_classification_matrix(user_id: str, project_id: int, job_id: int):
    job = common.find_job_with_validation(project_id, job_id)

    task = Tasks.select().where(
            Tasks.job_id == job.job_id, Tasks.type == Jobs._meta.EVALUATE
        ).order_by(Tasks.create_datetime.desc()).first()
    if task is None:
        raise NNcdException(CODE.NNCD_STATUS_INCORRECT, 'Project is not finished evaluation')
    
    result_json = ProjectFile('results', project_id, job_id, 'classification_matrix.json').read()

    if not result_json:
        raise NNcdException(CODE.NNCD_CLASSIFICATION_MATRIX_NOT_FOUND, 'classification_matrix not found')

    return json.loads(result_json)