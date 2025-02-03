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
import json
from flask import request

from conf import settings
from utils import common
from sqlite3db.models import Datasets, Users, DatasetMetadatas
from utils.request_runner import start_uploading_dataset
from utils.file_utils import format_stock_file


def upload_dataset(user_id: str):
    user_id = 1

    tenant_id = request.args.get("tenant_id")
    path = request.args.get("path", "").strip()

    if not os.path.isfile(path):
        return {"status": "failed", "message": f"the file `{path}` do not exist."}
    if not tenant_id:
        user = Users.select().where(Users.user_id == user_id).first()
        tenant_id = user.tenant_id

    dataset_name = os.path.splitext(os.path.basename(path))[0]
    dataset = Datasets.select().where(
        Datasets.name == dataset_name, Datasets.deleted == False
    )
    if dataset:
        return {
            "status": "failed",
            "message": f"Duplicate dataset name {dataset_name}.",
        }

    # insert a data into Datasets table
    new_dataset = Datasets(
        tenant_id=tenant_id,
        owner_user_id=user_id,
        name=dataset_name,
        status=Datasets._meta.READY,
        description=None,
    )
    new_dataset.save()

    # create dataset and dataset_cache dir
    stock_filepath = prepare_dataset_stock(tenant_id, new_dataset.dataset_id, path)
    user_metadata_name = common.add_user_metadata_mark("index_file_path")
    DatasetMetadatas.create(
        dataset_id=new_dataset.dataset_id, item_name=user_metadata_name, text_value=path
    )

    # Run upload dataset docker
    upload_dataset_args = json.dumps(
        {
            "tenant_id": tenant_id,
            "dataset_id": new_dataset.dataset_id,
            "index_file_path": stock_filepath,
        }
    )
    start_uploading_dataset(new_dataset.dataset_id, upload_dataset_args)
    return {"status": "OK", "message": "Start uploading the dataset."}


def prepare_dataset_stock(tenant_id: str, dataset_id: int, filepath: str) -> str:
    dir_path = os.path.join(settings.DATASETS_DIR, tenant_id, str(dataset_id))
    os.makedirs(dir_path, exist_ok=True)
        
    stockfile = os.path.join(dir_path, "index.csv")

    format_stock_file(filepath, stockfile)
    
    return stockfile
