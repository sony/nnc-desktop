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
import shutil
from flask import request

from conf import settings
from utils.exception import NNcdException, CODE
from sqlite3db.models import Datasets, DatasetMetadatas
from utils.request_runner import stop_uploading_dataset

def delete_dataset(user_id: str, dataset_id: int):
    user_id = 1

    dataset = Datasets.select().where(
            Datasets.owner_user_id == user_id,
            Datasets.dataset_id == dataset_id,
            Datasets.deleted == False
        ).first()
    if dataset:
        dataset.deleted = True
        dataset.save()
    else:
        raise NNcdException(CODE.NNCD_BAD_REQUEST, 'This dataset can not be deleted')
    
    # stop upload dataset if docker container is running.
    stop_uploading_dataset(dataset.dataset_id)

    # remove 
    DatasetMetadatas.delete().where(DatasetMetadatas.dataset_id == dataset_id).execute()
    
    # remove dataset files
    file_path_list = [
        os.path.join(settings.DATASETS_DIR, str(dataset.tenant_id), str(dataset_id)),
        os.path.join(settings.DATASET_CACHE_DIR, str(dataset.tenant_id), str(dataset_id))
    ]
    for file_path in file_path_list:
        if os.path.exists(file_path):
            shutil.rmtree(file_path, ignore_errors=True)

    return {}
