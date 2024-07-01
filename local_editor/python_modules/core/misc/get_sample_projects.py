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
from sqlite3db.models import Projects

DEFAULT_OFFSET = 0
DEFAULT_LIMIT = 500
DEFAULT_SORT_BY = 'create_datetime'


def get_sample_projects():
    offset = int(request.args.get("offset", DEFAULT_OFFSET))
    limit = int(request.args.get("limit", DEFAULT_LIMIT))
    keyword = request.args.get('keyword')
    sort_by = request.args.get("sort_by", DEFAULT_SORT_BY)

    db_sort_by = common.rename_sort_by_matched_db_column(Projects, sort_by)

    sample_project_list = Projects.select().where(
        Projects.owner_user_id == consts.SAMPLE_USER_ID,
        Projects.deleted == False
    )
    if keyword:
        sample_project_list = sample_project_list.where(Projects.name == keyword)
    sample_project_list = sample_project_list.order_by(db_sort_by).offset(offset).limit(limit)

    project_list = []
    for row in sample_project_list:
        project_list.append({
            'project_id': str(row.project_id),
            'tenant_id': str(row.tenant_id),
            'owner_user_id': str(row.owner_user_id),
            'project_name': str(row.name),
            'copy_count': int(row.copy_count),
            'star_count': int(row.star_count),
            'deleted': row.deleted,
            'create_datetime': common.to_iso8601str(row.create_datetime),
            'update_datetime': common.to_iso8601str(row.update_datetime)
        })
    
    # total
    total = Projects.select().where(
            Projects.owner_user_id == consts.SAMPLE_USER_ID,
            Projects.deleted == False
        ).count()

    # generate json data
    result_json = {
        'metadata': {
            'offset': offset,
            'limit': limit,
            'sort_by': sort_by,
            'total': total
        },
        "projects": project_list
    }

    return result_json
