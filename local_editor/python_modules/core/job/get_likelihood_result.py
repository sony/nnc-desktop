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
from flask import request
from contextlib import closing

from utils import common
from utils.logger import NNcdLogger
from sqlite3db.models import Jobs, Tasks
from utils.output_result import OutputResult
from utils.exception import NNcdException, CODE


DEFAULT_PARTITION = 20

class LikelihoodResult:
    def __init__(self, file_path: str, partition: int) -> None:
        self._file_path: str = file_path
        self._range_step: float = 1 / partition if partition else 0.05
        self._columns: [] = self._get_columns()

    def next(self) -> tuple:
        import sqlite3

        with closing(sqlite3.connect(self._file_path)) as conn:
            # parse columns
            _col_1st_value = [x for x in self._columns if '__1st_value' in x][0]
            _col_1st = _col_1st_value[:-6]
            _col_target_prefix = _col_1st[:-6]
            _col_target = [x for x in self._columns if _col_target_prefix in x and _col_1st not in x][0]

            c = conn.cursor()
            stmt = 'SELECT a as partition_index,'
            stmt += ' count(b=1 OR NULL) as true_count,'
            stmt += ' count(b=0 OR NULL) as false_count'
            stmt += ' FROM'
            stmt += f'  (SELECT CAST(CAST("{_col_1st_value}" AS DECIMAL) / ? AS INTEGER) as a,'
            stmt += f'     "{_col_target}"="{_col_1st}" as b'
            stmt += '   FROM outputs)'
            stmt += ' GROUP BY a ORDER BY a'
            NNcdLogger.debug(message=f'stmt = {stmt}')

            try:
                c.execute(stmt, (self._range_step,))

                for row in c.fetchall():
                    yield row
            except Exception as e:
                NNcdLogger.debug(message=f'Failed to query stmt={stmt}')
                raise NNcdException(CODE.NNCD_BAD_REQUEST, 'Invalid parameter')

    def _get_columns(self) -> []:
        import sqlite3

        with closing(sqlite3.connect(self._file_path)) as conn:
            c = conn.cursor()
            columns_stmt = 'SELECT * FROM outputs LIMIT 1'
            c.execute(columns_stmt)
            return [x[0] for x in c.description]


def get_likelihood_result(user_id: str, project_id: int, job_id: int):
    label = request.args.get('label')
    partition = int(request.args.get('partition', DEFAULT_PARTITION))

    job = common.find_job_with_validation(project_id, job_id)

    task = Tasks.select().where(
            Tasks.job_id == job.job_id, Tasks.type == Jobs._meta.EVALUATE
        ).order_by(Tasks.create_datetime.desc()).first()
    if task is None:
        raise NNcdException(CODE.NNCD_STATUS_INCORRECT, 'Project is not finished evaluation')

    result = {
        'metadata': {},
        'likelihood_result': []
    }
    job_results_dir = common.get_result_job_file_dir(project_id, job_id)
    db_file_path = os.path.join(
        job_results_dir, OutputResult.to_db_file_name(label_name=label))
    
    output_result = LikelihoodResult(db_file_path, partition)
    for row in output_result.next():
        result['likelihood_result'].append(
            {
                'partition_index': row[0],
                'true_count': row[1],
                'false_count': row[2]
            }
        )

    result['metadata']['label'] = label
    result['metadata']['partition'] = partition
    return result
