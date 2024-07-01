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

# get project
# _*_coding: utf-8_*_
import os
import re
import json
import datetime
from flask import request
from typing import Optional, Tuple
from peewee import Ordering, ModelSelect

from conf import consts
from utils import common, path_util
from sqlite3db.models import Projects, ProjectMetadatas, ProjectStars, Jobs, fn

DEFAULT_OFFSET = 0
DEFAULT_LIMIT = 500
DEFAULT_SORT_BY = 'create_datetime'
DEFAULT_DELETED = False


def get_projects(user_id: str):
    user_id = 1
    offset = int(request.args.get('offset', DEFAULT_OFFSET))
    limit = int(request.args.get('limit', DEFAULT_LIMIT))
    keyword = request.args.get('keyword')
    sort_by = request.args.get('sort_by', DEFAULT_SORT_BY)
    deleted = True if request.args.get('deleted') == 'true' else DEFAULT_DELETED
    tenant_id = request.args.get('tenant_id')
    uid_text = request.args.get('owner_user_id')
    owner_user_id = int(uid_text) if uid_text else None
    search_filter = request.args.get('filter')

    db_sort_by = common.rename_sort_by_matched_db_column(Projects, sort_by)
    try:
        metadata_filters = _make_project_metadata_filters(search_filter)
        flt_project_id = _pop_project_id_from_metadata_filters(metadata_filters)
        flt_parent_project_id = _pop_parent_project_id_from_metadata_filter(metadata_filters)
        # flt_access_scope = _pop_access_scope_from_metadata_filter(metadata_filters)
        op_and_copy_count = _pop_op_and_copy_count_from_metadata_filter(metadata_filters)

        project_rows = _find_project_list(
            user_id, offset, limit, keyword, db_sort_by, deleted, tenant_id, owner_user_id,
            project_id=flt_project_id, parent_project_id=flt_parent_project_id,
            metadata_filters=metadata_filters, op_and_copy_count=op_and_copy_count
        )

        project_list = []
        for row in project_rows:
            project = {
                'project_id': str(row.project_id),
                'tenant_id': str(row.tenant_id),
                'owner_user_id': str(row.owner_user_id),
                'project_name': str(row.name),
                'copy_count': int(row.copy_count),
                'start_count': int(row.star_count),
                'starred': _is_starred_projects(user_id, row.project_id),
                'labels': common.find_project_labels(row.project_id),
                'last_modified_user_id': str(row.last_modified_uid),

                # get status and progress from NOSQL db              
                "copy_progress": 100,
                "progress": 100,
                "copy_status": "completed",
                "status": "completed",   
            }
            storage_used = Jobs.select(fn.SUM(Jobs.storage_used)).where(
                Jobs.project_id == row.project_id
            ).scalar()
            project['storage_used'] = int(storage_used or 0)
            # remove public projects info

            # get import project job info
            import_status_file = path_util.make_import_status_json_path(row.project_id)
            if os.path.exists(import_status_file):
                status_dict = json.load(open(import_status_file, 'r'))
                status = status_dict.get('import_status')
                project['import_status'] = status
                if status == consts.ImportStatus.FAILED:
                    error_msg = status_dict.get('import_error_msg')
                    project['import_error_msg'] = error_msg \
                        if error_msg else 'An unexpected error occurred.'
    
                sdcproj_status = status_dict.get('import_sdcproj_status')
                if sdcproj_status:
                    project['import_sdcproj_status'] = sdcproj_status
                    if sdcproj_status == consts.ImportStatus.FAILED:
                        error_msg = status_dict.get('import_error_msg')
                        project['import_error_msg'] = error_msg \
                            if error_msg else 'An unexpected error occurred.'
    
            readonly_flag = False
            if str(user_id) != str(row.last_modified_uid):
                end_time_of_lock = (row.last_modified_datetime
                    + datetime.timedelta(seconds=consts.LOCK_DURATION_SEC))
                readonly_flag = datetime.datetime.now() < end_time_of_lock
            project.update({
                'readonly': readonly_flag,
                'deleted': row.deleted,
                'create_datetime': common.to_iso8601str(row.create_datetime),
                'update_datetime': common.to_iso8601str(row.update_datetime)
            })
            project_list.append(project)

        total = _count_accessible_project(
            user_id,  keyword, deleted, tenant_id, owner_user_id,
            project_id=flt_project_id, parent_project_id=flt_parent_project_id,
            metadata_filters=metadata_filters, op_and_copy_count=op_and_copy_count
        )

        # results
        result_json = {
            'metadata': {
                'offset': offset,
                'limit': limit,
                'sort_by': sort_by,
                'total': total
            },
            'projects':project_list
        }
        if tenant_id:
            result_json['metadata']['tenant_id'] = tenant_id
        if owner_user_id:
            result_json['metadata']['owner_user_id'] = str(owner_user_id)
        if deleted:
            result_json['metadata']['deleted'] = deleted
        return result_json

    except Exception as e:
        return str(e)


def _make_project_metadata_filters(search_filter: Optional[str]) -> dict:
    # accuracy gt 0.9 and description contains hoge
    #  => 
    # [{'accuracy': ('gt', 0.9), 'description': ('contains', 'hoge')}

    no_space_chars = '[^ \t\n\r\f\v]+'
    double_quoted_string = "'(?:(?:\\')|[^\'])+'"
    if search_filter is None:
        return {}
    
    filters = {}
    items = [x.strip() for x in search_filter.split('and')]
    for f in items:
        m = re.match(f'\A({no_space_chars}) +(eq|gt|ge|lt|le|contains) +({double_quoted_string}|{no_space_chars})\Z', f)
        if not m or len(m.groups()) != 3:
            raise Exception("Invalid filter")
        left_item = m.group(1)
        right_item = m.group(3).strip('\'')
        operator = m.group(2)
        if left_item in consts.NUMERIC_METADATA_NAMES:
            right_item = float(right_item)
        filters[common.add_user_metadata_mark_if_need(left_item)] = (operator, right_item)
    return filters


def _pop_project_id_from_metadata_filters(metadata_filters: dict) -> Optional[int]:
    item = metadata_filters.get('project_id')
    if item:
        project_id = int(item[1])
        del metadata_filters['project_id']
        return project_id
    return None


def _pop_parent_project_id_from_metadata_filter(metadata_filters: dict) -> Optional[int]:
    item = metadata_filters.get('parent_project_id')
    if item:
        project_id = int(item[1])
        del metadata_filters['parent_project_id']
        return project_id
    return None


def _pop_access_scope_from_metadata_filter(metadata_filters: dict) -> Optional[str]:
    item = metadata_filters.get('access_scope')
    if item:
        access_scope = item[1]
        del metadata_filters['access_scope']
        return access_scope
    return None


def _pop_op_and_copy_count_from_metadata_filter(metadata_filters: dict) -> Optional[Tuple[str, int]]:
    item = metadata_filters.get('copy_count')
    if item:
        op = item[0]
        copy_count = int(item[1])
        del metadata_filters['copy_count']
        return op, copy_count
    return None


def _make_subquery_for_project_list(user_id: int, keyword: str, deleted: bool, tenant_id: str,
                                    owner_user_id: int, project_id: int, parent_project_id: int,
                                    metadata_filters: [], op_and_copy_count: (str, int)) -> ModelSelect:
    projects = Projects.select().where(Projects.owner_user_id == user_id)
    if not deleted:
        projects = projects.where(Projects.deleted == deleted)
    if tenant_id:
        projects = projects.where(Projects.tenant_id == tenant_id)
    if owner_user_id:
        projects = projects.where(Projects.owner_user_id == owner_user_id)
    if keyword:
        projects = projects.where(*common.filter_by_name_keyword(Projects, keyword))
    if project_id:
        projects = projects.where(Projects.project_id == project_id)
    if parent_project_id:
        projects = projects.where(Projects.original == parent_project_id)
    if op_and_copy_count is not None:
        op, copy_count = op_and_copy_count
        if op == 'eq':
            projects = projects.where(Projects.copy_count == copy_count)
        elif op == 'gt':
            projects = projects.where(Projects.copy_count > copy_count)
        elif op == 'ge':
            projects = projects.where(Projects.copy_count >= copy_count)
        elif op == 'lt':
            projects = projects.where(Projects.copy_count < copy_count)
        elif op == 'le':
            projects = projects.where(Projects.copy_count <= copy_count)
        else:
            raise Exception(f'Invalid filter copy_count {op} {copy_count}')
    if metadata_filters:
        projects = projects.where(Projects.project_id.in_(
            common.make_subquery_from_metadata(ProjectMetadatas, metadata_filters)
        ))
    return projects


def _find_project_list(user_id: int, offset: int, limit: int, keyword: str,
                       sort_by: Ordering, deleted: bool=False, tenant_id: str=None,
                       owner_user_id: int=None, project_id: int=None, parent_project_id: int=None,
                       metadata_filters: []=None, op_and_copy_count: (str, int)=None) -> [ModelSelect]:
    projects = _make_subquery_for_project_list(user_id,  keyword, deleted, tenant_id,
                owner_user_id, project_id, parent_project_id, metadata_filters, op_and_copy_count)    
    projects =projects.order_by(sort_by).offset(offset).limit(limit)
    return projects


def _is_starred_projects(user_id: int, project_id: int):
    row = ProjectStars.select().filter(user_id=user_id, project_id=project_id).first()
    return row is not None


def _count_accessible_project(user_id: int, keyword: str=None, deleted: bool=False,
                              tenant_id: str=None,owner_user_id: int=None,
                              project_id: int=None, parent_project_id: int=None,
                              metadata_filters: []=None, op_and_copy_count: (str, int)=None) -> int:
    projects = _make_subquery_for_project_list(user_id,  keyword, deleted, tenant_id,
                owner_user_id, project_id, parent_project_id, metadata_filters, op_and_copy_count)    
    return projects.count()
