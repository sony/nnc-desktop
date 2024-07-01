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
import sys
import shutil
import json
from flask import request

from conf import settings
from sqlite3db.models import Datasets, Users
from utils.request_runner import start_uploading_dataset


def upload_dataset(user_id: str):
    user_id = 1

    tenant_id = request.args.get('tenant_id')
    path = request.args.get('path', '').strip()

    orignal_path = os.path.join(settings.UPLOAD_DATASET_PATH, path)

    if path not in os.listdir(settings.UPLOAD_DATASET_PATH):
        return {
            'status': 'failed',
            'message': f'the folder `{path}` do not exist.'
        }
    if not tenant_id:
        user = Users.select().where(Users.user_id == user_id).first()
        tenant_id = user.tenant_id

    dataset_name = os.path.basename(orignal_path)
    dataset = Datasets.select().where(
        Datasets.name == dataset_name, Datasets.deleted == False
    )
    if dataset:
        return {
            'status': 'failed',
            'message': f'Duplicate dataset name {dataset_name}.'
        }
    # check whether index.csv file and data folder exist
    index_path = os.path.join(orignal_path, 'index.csv')
    data_path = os.path.join(orignal_path, 'data')
    if not (os.path.exists(index_path) and os.path.isdir(data_path)):
        return {
            'status': 'failed',
            'message': 'Not find the index.csv file or data folder.'
        }

    # insert a data into Datasets table
    new_dataset = Datasets(
        tenant_id=tenant_id,
        owner_user_id=user_id,
        name=dataset_name,
        status=Datasets._meta.READY,
        description=None
    )
    new_dataset.save()

    # create symbolic link to connect dataset floder
    create_symlink(tenant_id, new_dataset.dataset_id, index_path, data_path)

    # Run upload dataset docker
    upload_dataset_args = json.dumps({
        'tenant_id': tenant_id, 'dataset_id': new_dataset.dataset_id})
    start_uploading_dataset(new_dataset.dataset_id, upload_dataset_args)
    return {
        'status': 'OK',
        'message': 'Start uploading the dataset.'
    }


def create_symlink(tenant_id: str, dataset_id: int, index_path, data_path):
    for path in [settings.DATASET_CACHE_DIR, settings.DATASETS_DIR]:
        dir_path = os.path.join(path, tenant_id, str(dataset_id))
        os.makedirs(dir_path, exist_ok=True)

    if sys.platform == "win32":
        shutil.copyfile(index_path, os.path.join(dir_path, 'index.csv'))
        shutil.copytree(data_path, os.path.join(dir_path, 'data'))
    else:
        os.symlink(index_path, os.path.join(dir_path, 'index.csv'))
        os.symlink(data_path, os.path.join(dir_path, 'data'))
