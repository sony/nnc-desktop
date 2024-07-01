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

import re
from flask import request
from typing import Optional

from utils import common
from sqlite3db.models import Datasets, DatasetMetadatas

DEFAULT_OFFSET = 0
DEFAULT_LIMIT = 500
DEFAULT_SORT_BY = 'create_datetime'
PROGRESS_BLOCK = 2

def get_datasets(user_id: str):

    user_id = 1

    # get the query coditions of model Datasets
    limit = int(request.args.get("limit", DEFAULT_LIMIT))
    offset = int(request.args.get("offset", DEFAULT_OFFSET))
    keyword = request.args.get("keyword", "")
    search_filter = request.args.get("search_filter")
    sort_by = request.args.get("sort_by", DEFAULT_SORT_BY)
    tenant_ids = request.args.get("tenant_ids").split(",")
    owner_user_id = request.args.get("owner_user_id")
    if owner_user_id:
        owner_user_id = int(owner_user_id)
    dataset_id = request.args.get("dataset_id")
    if dataset_id and dataset_id.isalnum():
        dataset_id = int(dataset_id)

    # get all datasets and total
    total, datasets = _find_dataset_list_and_total(
        user_id, limit, offset, keyword, search_filter, sort_by,
        tenant_ids, owner_user_id, dataset_id
    )

    # generate JSON data
    dataset_list = []
    for row in datasets:
        dataset = dict()
        dataset["dataset_id"] = str(row.dataset_id)
        dataset["tenant_id"] = str(row.tenant_id)
        dataset["owner_user_id"] = str(row.owner_user_id)
        dataset["dataset_name"] = str(row.name)
        dataset["storage_used"] = int(row.storage_used)
        dataset["description"] = str(row.description)

        # get status
        status = row.status
        cache_status = row.cache_status
        if (status == Datasets._meta.FAILED or
            cache_status == Datasets._meta.FAILED):
            status = Datasets._meta.FAILED
        elif (status == Datasets._meta.COMPLETED and
            cache_status == Datasets._meta.COMPLETED):
            status = Datasets._meta.COMPLETED
        else:
            status = Datasets._meta.EXTRACTING
        dataset["status"] = status
        process = int((row.extract_progress + row.cache_progress) / PROGRESS_BLOCK)
        dataset["extract_progress"] = process
        dataset["data_num"] = int(row.data_num)
        if row.column_num is not None:
            dataset["column_num"] = int(row.column_num)
        if row.header is not None:
            dataset["csv_header"] = str(row.header)
        if row.error_code is not None:
            dataset["error_code"] = int(row.error_code)
        # update DB process from DynamoDB
        # dataset.update(get_dataset_copy_progress(row))
        dataset["update_datetime"] = common.to_iso8601str(row.update_datetime)
        dataset["labels"] = _find_dataset_labels(row.dataset_id)
        dataset["features"] = []
        if row.hash:
            dataset['hash'] = row.hash.upper()

        dataset_list.append(dataset)

    result_json = {
        "metadata": {
            "offset": offset,
            "limit": limit,
            "sort_by": sort_by,
            "total": total
        },
        "datasets": dataset_list
    }
    if tenant_ids:
        result_json['metadata']['tenant_ids'] = ','.join(tenant_ids)
    if owner_user_id:
        result_json['metadata']['owner_user_id'] = str(owner_user_id)
    return result_json


def _find_dataset_list_and_total(user_id: int, limit: int, offset: int, keyword: str,
                      search_filter: str, sort_by: object, tenant_ids: [str],
                      owner_user_id: Optional[int], dataset_id: Optional[int]):
    db_sort_by = common.rename_sort_by_matched_db_column(Datasets, sort_by)
    metadata_filters = _make_dataset_metadata_filters(search_filter)

    datasets = Datasets.select().where(Datasets.deleted == False)
    if keyword:
        datasets = datasets.where(*common.filter_by_name_keyword(Datasets, keyword))
    if tenant_ids:
        datasets = datasets.where(Datasets.tenant_id.in_(tenant_ids))
    if owner_user_id:
        datasets = datasets.where(Datasets.owner_user_id == owner_user_id)
    if metadata_filters:
        datasets = datasets.where(Datasets.dataset_id.in_(
            common.make_subquery_from_metadata(DatasetMetadatas, metadata_filters)))
    if dataset_id:
        datasets = datasets.where(Datasets.dataset_id == dataset_id)
    return (
        len(datasets),
        datasets.order_by(db_sort_by).offset(offset).limit(limit)
    )
        

def _make_dataset_metadata_filters(search_filter: Optional[str]):
    # tags eq aaa and labels contains bbb
    # translate to
    # {'tags': ('eq', 'aaa'), 'labels': ('contains', 'bbb')}
    no_space_chars ='[^ \t\n\r\f\v]'
    if search_filter is None:
        return {}
    filters = {}
    items = [x.strip() for x in search_filter.split("and")]
    for f in items:
        m = re.match(f'^({no_space_chars}+) +(eq|contains) +({no_space_chars}+)$', f)
        if not m or len(m.groups()) != 3:
            raise Exception("Invaild filter")
        filters[common.add_user_metadata_mark_if_need(m.group(1))] = (m.group(2), str(m.group(3)))
    return filters


def _find_dataset_labels(dataset_id: int):
    metadata_list = DatasetMetadatas.select().where(
        DatasetMetadatas.dataset_id == dataset_id,
        DatasetMetadatas.item_name == common.add_user_metadata_mark("labels")
    )
    return [x.text_value for x in metadata_list]
