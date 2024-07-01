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
from sqlite3db.models import DatasetMetadatas


def update_dataset_metadata(user_id: str, dataset_id: int, metadata_name: str):
    user_id = 1
    metadata_values = []
    value = request.json.get('value')
    if value:
        metadata_values.append(value)
    values = request.json.get('values')
    if values:
        metadata_values += values

    common.validate_available_dataset(user_id, dataset_id)
    user_metadata_name = common.add_user_metadata_mark(metadata_name)
    DatasetMetadatas.delete().where(
            DatasetMetadatas.item_name == user_metadata_name,
            DatasetMetadatas.dataset_id == dataset_id
        ).execute()

    # solve the problem that 
    # the metadata_id must be added by youself when insert data
    metadata_num = DatasetMetadatas.select(DatasetMetadatas.metadata_id)\
                   .order_by(DatasetMetadatas.metadata_id.desc())\
                   .limit(1).scalar()
    metadata_id = int(metadata_num) if metadata_num else 0
    for metadata in metadata_values:
        if len(metadata) == 0:
            continue
        metadata_id += 1
        DatasetMetadatas.create(
            metadata_id=metadata_id,
            dataset_id=dataset_id,
            item_name=user_metadata_name,
            text_value=metadata
        )
    
    return {}