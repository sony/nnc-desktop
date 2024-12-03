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
import json
from flask import request
from datetime import datetime

from conf import consts
from utils import common
from utils.file_utils import ProjectFile
from sqlite3db.models import Jobs, Tasks, Datasets

DEFAULT_NUM_ROWS = 10
DEFAULT_NUM_COLUMNS = 10


def get_evaluation_result(user_id: str, project_id: int, job_id: int):
    # get args
    row = int(request.args.get('row', 0))
    column = int(request.args.get('column', 0))
    num_rows = int(request.args.get('numrows', DEFAULT_NUM_ROWS))
    num_columns = int(request.args.get('numcolumns', DEFAULT_NUM_COLUMNS))
    temp_e_f = request.args.get("exclude_fields", None)
    exclude_fields = temp_e_f.replace(' ', '').split(',') if temp_e_f else None

    # response key
    metadata = {}
    evaluation_result = {}

    # Set offset and limit information
    exclude_fields_str = ','.join(exclude_fields) if exclude_fields else None
    metadata = common.make_metadata(
        row=row, column=column, numrows=num_rows,
        numcolumns = num_columns, exclude_fields=exclude_fields_str
    )

    # get job for next use
    job = common.find_job_with_validation(project_id, job_id)

    # get task info
    tasks = Tasks.select().where(
            Tasks.job_id == job_id, Tasks.type == Jobs._meta.EVALUATE
        ).order_by(Tasks.create_datetime.asc())
    if not tasks:
        raise Exception('Can not be referred')

    first_task = tasks[0]
    last_task = tasks[-1]
    if first_task.start_time is not None:
        evaluation_result['start_time'] = common.to_iso8601str(first_task.start_time)
    if last_task.data_num is not None:
        metadata['total'] = last_task.data_num
    if last_task.end_time is not None:
        evaluation_result['end_time'] = common.to_iso8601str(last_task.end_time)
    if last_task.header is not None:
        evaluation_result['csv_header'] = last_task.header
    
    # get dataset info
    dataset_id = last_task.dataset_id
    dataset = Datasets.select()\
        .where(Datasets.dataset_id == dataset_id, Datasets.deleted == False)\
        .first()
    if dataset is None:
        # raise Exception('This dataset can not be referenced')
        return {
            'code': 40014174,
            'error': 'NNCD_BAD_DATASET_ID',
            'message': 'This dataset can not be referenced'
        }, 400
    
    # status settings
    evaluation_result['status'] = job.status

    # get job log file and job status
    evaluation_result['logfile'] = common.get_log_from_file(project_id, job_id, Jobs._meta.EVALUATE)
    evaluation_result["evaluate_status"] = common.get_status_from_file(project_id, job_id, Jobs._meta.EVALUATE)

    if exclude_fields is None or 'confusion_matrix' not in exclude_fields:
        confusion_matrix_data = ProjectFile(
            'results', project_id, job_id, consts.CONFUSION_MATRIX).read()
        if confusion_matrix_data is not None:
            try:
                evaluation_result['confusion_matrix'] = json.loads(confusion_matrix_data)
            except ValueError:
                raise Exception(f'invalid format = {consts.CONFUSION_MATRIX}')
    
    # Set evaluation result to response
    if (last_task.data_num == 0 and last_task.column_num is None
            and column == 0 and row == 0):
        pass
    elif (last_task.data_num <= row or last_task.column_num <= column
            or row < 0 or column < 0):
        # raise Exception('Invalid row or column parameters')  
        pass

    elif last_task.end_time and last_task.start_time:
        evaluate_data_list = make_evaluation_result_by_row_column(
            project_id, job_id, row, column, last_task.start_time
        )
        if evaluate_data_list:
            evaluation_result['result'] = evaluate_data_list
    
    return {'metadata': metadata, 'evaluation_result': evaluation_result}


def make_evaluation_result_by_row_column(project_id: int, job_id: int, row: int,
                                         column: int, modified_since: datetime):
    name, _ = os.path.splitext(consts.OUTPUT_RESULT_CSV)
    file_name = f'page/{name}_{column}_{row}.cache.json'
    file_obj = ProjectFile('results', project_id, job_id, file_name)
    cache_str = file_obj.read()
    if cache_str is None:
        return None

    # only find json file before modification
    if os.path.getmtime(file_obj.full_path) < datetime.timestamp(modified_since):
        return None
    return json.loads(cache_str)

    
    