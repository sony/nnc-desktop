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
import subprocess
import json
from flask import request, url_for

from utils import common
from conf import consts, settings
from utils.output_result import OutputResult
from utils.file_utils import ProjectFile
from utils.exception import NNcdException, CODE
from components.thumbnail_generator.function import ThumbnailGenerator
from sqlite3db.models import Jobs, Tasks, Datasets
DEFAULT_OFFSET = 0
DEFAULT_LIMIT = 10


def get_classification_result(user_id: str, project_id: int, job_id: int):
    user_id = 1

    offset = int(request.args.get('offset', DEFAULT_OFFSET))
    limit = int(request.args.get('limit', DEFAULT_LIMIT))
    label = request.args.get('label')
    filter_text = request.args.get('filter')
    sort_by = request.args.get("sort_by")
    res_row = int(request.args.get('row', 0))
    res_column = int(request.args.get('column', 0))

    job_type = Jobs._meta.EVALUATE if "eval" in request.endpoint else Jobs._meta.INFERENCE

    job = common.find_job_with_validation(project_id, job_id)

    task = Tasks.select().where(
            Tasks.job_id == job.job_id, Tasks.type == job_type
        ).order_by(Tasks.create_datetime.desc()).first()
    if task is None:
        raise NNcdException(CODE.NNCD_STATUS_INCORRECT, 'Project is not finished evaluation')

    dataset_id = str(task.dataset_id)
    dataset = Datasets.select().where(
            Datasets.dataset_id == dataset_id, Datasets.deleted == False   
        ).first()
    if dataset:
        tenant_id_of_dataset = str(dataset.tenant_id)
    else:
        tenant_id_of_dataset = None

    # get job results dir
    job_results_dir = common.get_result_job_file_dir(project_id, job_id)

    if not OutputResult.verify_filter_text(filter_text):
        raise NNcdException(CODE.NNCD_BAD_REQUEST, 'filter is invalid format')
    db_file_path = os.path.join(
        job_results_dir, OutputResult.to_db_file_name(label_name=label, job_type=job_type)
    )
    output_result = OutputResult(db_file_path, offset, limit, filter_text, sort_by)
    results = output_result.result()
    result = {
        'metadata': {},
        'classification_result': []
    }
    sortable_columns = None
    for row in results:
        cr_row = _to_classification_result_row(row)
        _convert_image_path_for_classification_result(
            cr_row, user_id, project_id, job_id, 
            tenant_id_of_dataset, dataset_id, job_results_dir, job_type
        )
        result['classification_result'].append(cr_row)
        if sortable_columns is None:
            sortable_columns = [_is_sortable_coloumn(x['type']) for x in cr_row]
    total = output_result.get_total()
    result['header'] = _make_header(output_result.header, sortable_columns)
    # メタデータ設定
    result['metadata']['offset'] = offset
    result['metadata']['limit'] = limit
    result['metadata']['label'] = label
    result['metadata']['total'] = total
    if filter_text:
        result['metadata']['filter'] = filter_text
    if sort_by:
        result['metadata']['sort_by'] = sort_by
    return result

def _make_header(column_names: [], sortable_columns: []) -> dict:
    header = []
    if sortable_columns is None:
        return header
    for name, cell in zip(column_names, sortable_columns):
        header.append({
            'name': name,
            'sortable': cell
        })
    return header

def _to_classification_result_row(row: tuple) -> list:
    """example
    row: ('./data/000000000000_0.png', '7', '7', '0.9999336', '9', '4.7852678e-05', '3', '6.2546583e-06')
    response:
        [
            {'type': 'text/uri-list', 'data': 's3://preisigned-url/00000_0.png'},
            {'type': 'text/plain', 'data: '7'},
            ....
        ]
    """
    result = []
    for col in row:
        if _is_file_path(col):
            result.append({'type': 'text/uri-list', 'data': col})
        else:
            result.append({'type': 'text/plain', 'data': col})
    return result


def _convert_image_path_for_classification_result(rows: list, user_id:int, project_id: int, job_id: int,
                                                  tenant_id: str, dataset_id: str, job_results_dir: str,
                                                  job_type: str):
    for row in rows:
        if row['type'] != 'text/uri-list':
            continue
        file_name = os.path.basename(row['data'])
        if job_type == Jobs._meta.INFERENCE:
            file_path = row['data']
            row['path'] = row['data']
            thumb_path = os.path.join(settings.PROJECTS_DIR, str(project_id), 'thumbs', str(job_id), file_name)
        else:
            thumb_path = os.path.join(settings.DATASETS_DIR, tenant_id, 'thumbs', dataset_id, file_name)
            if re.match(r'(\.[/\\])*data[/\\].*', row['data']):
                if tenant_id is None or dataset_id is None:
                    row['data'] = ''
                    continue
                file_path = os.path.join(settings.DATASETS_DIR, tenant_id, dataset_id, row['data'])
            else:
                file_path = row['data'] if os.path.isabs(row['data']) else os.path.join(job_results_dir, file_name)

        _makedirs_if_not_exist(os.path.dirname(thumb_path))

        # file exists
        if not os.path.exists(thumb_path):
            if not os.path.exists(file_path):
                # the dataset file may be not exist.
                row['data'] = ''
                continue

            ThumbnailGenerator.handle_record(file_path, thumb_path)

        row['data'] = _get_classification_result_thumbs_url(
            user_id=user_id, project_id=project_id, job_id=job_id, path=thumb_path
        )

def _get_classification_result_thumbs_url(**kwargs):
    return url_for(
        endpoint="job.get_classification_result_thumbs",
        _external=True, **kwargs
    )


def _is_sortable_coloumn(column_type: str) ->bool:
    return column_type == 'text/plain'


def _is_file_path(text: str) -> str:
    if not isinstance(text, str):
        return False
    return text.split('.')[-1] in consts.DATA_CONTENT_TYPE


def _makedirs_if_not_exist(dir_path: str):
    os.umask(0)
    if not os.path.exists(dir_path):
        os.makedirs(dir_path, mode=0o777)
