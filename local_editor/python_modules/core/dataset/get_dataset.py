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
from flask import request

from utils import common, file_utils
from sqlite3db.models import Datasets
from utils.exception import NNcdException, CODE

DEFAULT_NUM_ROWS = 10
DEFAULT_NUM_COLUMNS = 10


def get_dataset(user_id: str, dataset_id: int):
    row = int(request.args.get("row", 0))
    numrows = int(request.args.get("numrows", DEFAULT_NUM_ROWS))
    column = int(request.args.get("column", 0))
    numcolumns = int(request.args.get("numcolumns", DEFAULT_NUM_COLUMNS))

    result = {
        "metadata": {},
        "dataset": {}
    }

    # get single dataset
    dataset = Datasets.select().where(
            Datasets.dataset_id == dataset_id,
            Datasets.deleted == False
        ).first()
    if not dataset:
        raise NNcdException(CODE.NNCD_BAD_DATASET_ID, 'Dataset not found')
    if dataset.status != Datasets._meta.COMPLETED:
        raise NNcdException(CODE.NNCD_STATUS_INCORRECT, 'There is no referable result')
    
    result["metadata"] = common.make_metadata(
        row=row, column=column, numcolumns=numcolumns,
        numrows=numrows, total=dataset.data_num
    )
    if dataset.header is not None:
        result['dataset']['csv_header'] = dataset.header

    # get dataset' index_column_row.cache.json
    if dataset.data_num == 0 and dataset.column_num is None and row == 0 and column == 0:
        dataset_result = ""
    elif dataset.data_num <= row or dataset.column_num <= column or row < 0 or column < 0:
        raise NNcdException(CODE.NNCD_INDEX_OUT_OF_RANGE, f'Invalid row or column parameters.')
    else:
        cache_obj = file_utils.DatasetFile(dataset.tenant_id, dataset_id, row, column)
        cache_str = cache_obj.read()
        if cache_str is None:
            raise NNcdException(CODE.NNCD_DATASET_CACHE_NOT_FOUND, 'Dataset cache not found')
        try:
            dataset_result = json.loads(cache_str)
        except json.JSONDecodeError:
            raise Exception(f"dataset cache {cache_obj.file_path} is not json file")
    result["dataset"]['result'] = dataset_result
    
    return result
