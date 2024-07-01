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

from utils import job_utils
from sqlite3db.models import Jobs


def get_jobs(user_id: str, project_id: int):

    # get sql select params
    limit = int(request.args.get("limit", 500))
    offset = int(request.args.get("offset", 0))
    sort_by = Jobs.create_datetime.desc()

    # get all jobs exclude deleted jobs in this project
    jobs = Jobs.select().where(
               Jobs.project_id == project_id, Jobs.deleted == False
           ).order_by(sort_by).offset(offset).limit(limit)

    job_list = []
    if jobs:
        for job in jobs:
            job_content = job_utils.create_job_data_combined_with_tasks(job)

            if job_content:
                # add download_formats, elapsed_time_for_each_type, instance_group_for_each_type
                job_content["download_formats"] = job_utils.make_downloadable_formats(job.project_id, job.job_id)
                job_content.update(job_utils.make_elapsed_time_for_each_type(job.job_id))
                job_content.update(job_utils.make_last_instance_group_for_each_type(job.job_id))

                job_list.append(job_content)

    # modefy metadata values
    metadata = {
        'limit': limit,
        'offset': offset,
        'total': jobs.count()
    }
    return {
        "metadata": metadata,
        "jobs": job_list
    }
