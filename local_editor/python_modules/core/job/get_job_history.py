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

from utils import job_utils, common
from sqlite3db.models import Jobs, Projects
from conf.consts import SAMPLE_USER_ID

DEFAULT_LIMIT = 500
DEFAULT_OFFSET = 0
DEFAULT_SORT_BY = 'create_datetime'


def get_job_history(user_id: str):
    user_id = 1

    limit = int(request.args.get("limit", DEFAULT_LIMIT))
    offset = int(request.args.get("offset", DEFAULT_OFFSET))
    sort_by_type = request.args.get("sort_by", DEFAULT_SORT_BY)
    db_sort_by = common.rename_sort_by_matched_db_column(Jobs, sort_by_type)

    # get all jobs by user_id
    query = Jobs.select().where(
            Jobs.owner_user_id == user_id, Jobs.last_exec_uid != SAMPLE_USER_ID
        ).order_by(db_sort_by)

    jobs = query.offset(offset).limit(limit)
    job_total = query.count()

    # generate the json data of jobs
    job_list = []
    for job in jobs:
        job_detail = job_utils.create_job_data_combined_with_tasks(job)
        if not job_detail:
            continue
        
        # get sum of elapsed time for each instance
        job_detail["elapsed_time_for_each_instance"] = job_utils.create_elapsed_time_for_each_instance(job)

        project = Projects\
            .select(Projects.name)\
            .where(Projects.project_id == job.project_id).first()
        job_detail["project_name"] = project.name

        job_list.append(job_detail)

    return {
        "metadata": {
            'offset': offset,
            'limit': limit,
            'total': job_total
        },
        "jobs": job_list
    }
