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

from conf import consts
from utils import common
from utils.exception import NNcdException, CODE
from sqlite3db.models import db, Projects, ProjectMetadatas

def update_metadata(user_id: str, project_id: int, metadata_name: str):
    metadata_values = []
    value = request.json.get('value')
    if value:
        metadata_values.append(value)
    values = request.json.get('values')
    if values:
        metadata_values += values
    
    project = Projects.select().where(
            Projects.project_id == project_id, Projects.deleted == False
        ).first()
    if not project:
        raise NNcdException(CODE.NNCD_BAD_REQUEST, f'Not found project')
    
    if metadata_name in consts.SYSTEM_METADATA_NAMES:
        return 'This metadata is not writable'
    
    user_metadata_name = common.add_user_metadata_mark(metadata_name)
    with db.atomic():
        ProjectMetadatas.delete().where(
            ProjectMetadatas.item_name == user_metadata_name,
            ProjectMetadatas.project_id == project_id
        ).execute()
        for meta_data in metadata_values:
            if len(meta_data) == 0:
                continue
            common.merge_projectmetadata(
                project_id, user_metadata_name,
                ProjectMetadatas._meta.TEXT, meta_data
            )
    return {}


            
