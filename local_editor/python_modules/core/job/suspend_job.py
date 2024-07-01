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

import json
import subprocess

from utils import common
from utils.file_utils import ProjectFile
from utils.exception import NNcdException, CODE
from utils.request_runner import stop_running_job
from sqlite3db.models import Jobs, Tasks, StructureSearches


def suspend_job(user_id: str, project_id: int, job_id: int):

    # get job
    job = common.find_job_with_validation(project_id, job_id) 

    last_task = Tasks.select().where(Tasks.job_id == job_id)\
        .order_by(Tasks.create_datetime.desc()).first()
    ss_id = job.ss_id

    stop_running_job(job.job_id, last_task.type)

    if ss_id and last_task.type != Jobs._meta.EVALUATE:
        # If it is not an automatic structure search job and
        #   an evaluation job, the related job is also stopped
        # note: When the job executes evaluation, the connection 
        #   with the automatic structure search is deleted.
        # Don't need to check the evaluation job ???
        return _suspend_job_by_ss_id(ss_id)
    else:
        # suspend single job
        return _suspend_job(job, last_task)


def _suspend_job(job: Jobs, task: Tasks):
    return_status = "suspended"
    active_status = [
        Jobs._meta.QUEUED, Jobs._meta.PREPROCESSING,
        Jobs._meta.PROCESSING, Jobs._meta.FINISHED
    ]
    if job.status not in active_status:
        raise NNcdException(
            CODE.NNCD_STATUS_INCORRECT, 'Job status must be QUEUED, PREPROCESSING or PROCESSING')
    # appends status to job and task
    common.wirte_job_status_to_suspend(job, task)

    # In case of automatic structure search, sdcproj is 0 bytes until worker creates it.
    # If sdcproj is suspended with 0 bytes, the job cannot be continued and this job is deleted.
    # ???
    sdcproj = ProjectFile("sdcproj", job.project_id, job.job_id).read()
    if not sdcproj:
        job.deleted = True
        job.save()
        return_status = 'deleted'
    return {'status': return_status}


def _suspend_job_by_ss_id(ss_id: int):
    ss = StructureSearches.select().where(StructureSearches.ss_id == ss_id).first()
    ss.desired_state = Jobs._meta.SUSPENDED
    ss.save()
    jobs = Jobs.select().where(Jobs.ss_id == ss_id, Jobs.deleted == False)
    result = []
    for job in jobs:
        task = Tasks.select().where(Tasks.job_id == job.job_id)\
            .order_by(Tasks.create_datetime.desc()).first()
        if task.type == Jobs._meta.EVALUATE:
            continue
        ret = _suspend_job(job, task)
        ret.update({"job_id": job.job_id})
        result.append(ret)
    return json.dumps(result)
