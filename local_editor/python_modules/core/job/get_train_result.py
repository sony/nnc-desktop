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
import json

from conf import consts
from sqlite3db.models import Jobs, Tasks
from utils import job_utils, project_utils, common


def get_train_result(user_id: str, project_id: int, job_id: int):
    configuration_format = request.args.get("configuration_format")

    job = Jobs.select()\
        .where(Jobs.job_id == job_id, Jobs.deleted == False).first()
    if not job:
        return

    result = {"status":job.status}

    # get current job type
    set_of_job_type = common.find_set_of_job_type(job.job_id)
    job_type = Jobs._meta.PROFILE
    if Jobs._meta.TRAIN in set_of_job_type:
        job_type = Jobs._meta.TRAIN
    
    # get the earliest task start time
    start_time = Tasks.select(Tasks.start_time).where(
            Tasks.job_id == job_id, Tasks.type == job_type, Tasks.start_time.is_null(False)
        ).order_by(Tasks.create_datetime.asc()).scalar()
    if start_time:
        result["start_time"] = common.to_iso8601str(start_time)
    
    # get the lastest task end time
    last_task = Tasks.select(Tasks.end_time).where(
            Tasks.job_id == job_id, Tasks.type == job_type
        ).order_by(Tasks.create_datetime.desc()).first()
    if last_task and last_task.end_time:
        result["end_time"] = common.to_iso8601str(last_task.end_time)

    # get job configuration
    configuration, configuration_format = project_utils.get_configuration_from_file(
        configuration_format, job.project_id, job.job_id
    )
    if configuration:
        result["configuration"] = configuration
        result["configuration_format"] = configuration_format

    # get job log file
    log = common.get_log_from_file(job.project_id, job.job_id, job_type)
    if log is not None:
        result['logfile'] = log 
    
    # get job status
    train_status = common.get_status_from_file(job.project_id, job.job_id, job_type)
    if train_status:
        result["train_status"] = train_status

    return result
