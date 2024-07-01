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

from sqlite3db.models import Projects, ProjectMetadatas


class MetadataFormatter(object):
    def __init__(self):
        self.values = {}
    
    def add(self, meta_name: str, value: str):
        if meta_name in self.values:
            self.values[meta_name].append(value)
        else:
            self.values[meta_name] = [value]
    
    def to_dict(self):
        ret_val = {}
        for key, value in self.values.items():
            ret_val[key] = value if len(value) > 1 else value[0]
        return ret_val


def get_metadata(user_id: str, project_id: int):
    project = Projects.select().where(
            Projects.project_id == project_id, Projects.deleted == False
        ).first()
    if not project:
        return 'Project not found.'
    
    metadata_list = ProjectMetadatas.select()\
                    .where(ProjectMetadatas.project_id == project_id)
    meta_formatter = MetadataFormatter()
    for metadata in metadata_list:
        if not metadata.item_name.startswith('#'):
            continue
        name = metadata.item_name[1:]
        meta_formatter.add(name, metadata.text_value)
    
    return {
        'metadata': meta_formatter.to_dict()
    }
