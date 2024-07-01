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

import os
import shutil

from utils import common
from utils.request_runner import stop_running_job
from sqlite3db.models import Jobs, Tasks, Reports


def delete_job(user_id: str, project_id: int, job_id: int):
    active_status = [
        Jobs._meta.QUEUED,
        Jobs._meta.PREPROCESSING,
        Jobs._meta.PROCESSING
    ]

    job = common.find_job_with_validation(project_id, job_id)
    # rdc: Raise an exception if the project to be deleted is being copied
    
    if job.status in active_status:

        task = (Tasks.select().where(Tasks.job_id == job.job_id)
                .order_by(Tasks.create_datetime.desc()).first())
        
        # stop runner
        stop_running_job(job.job_id, task.type)

        # appends status to job and task
        common.wirte_job_status_to_suspend(job, task)

    # remove jobs relative files
    remove_dir_list = []
    reports = Reports.select().filter(job_id=job_id, deleted=False)
    for report in reports:
        report_dir = common.get_reports_file_dir(project_id, report.report_id)
        remove_dir_list.append(report_dir)

    configurations_dir = common.get_configuration_file_dir(project_id, job_id)
    results_dir = common.get_result_job_file_dir(project_id, job_id)
    remove_dir_list.extend([configurations_dir, results_dir])

    for remove_dir in remove_dir_list:
        if os.path.exists(remove_dir):
            shutil.rmtree(remove_dir)
    job.deleted = True
    job.save()
    return {}
