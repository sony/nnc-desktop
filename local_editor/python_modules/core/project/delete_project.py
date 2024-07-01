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

from conf import settings
from utils import common
from utils.exception import NNcdException, CODE
from utils.request_runner import stop_running_job
from sqlite3db.models import Projects, ProjectMetadatas, Jobs, Tasks


def delete_project(user_id: str, project_id: int):
    user_id = 1

    ProjectMetadatas.delete().where(
            ProjectMetadatas.project_id == project_id
        ).execute()

    project = Projects.select().where(
            Projects.project_id == project_id, Projects.deleted == False
        ).first()

    if project is not None:
        # Error if other user is editing project
        if not common.is_editable_project(project, user_id):
            raise NNcdException(CODE.NNCD_CONFIGURATION_EDITING,
                                    'Failed to resume job cases of the editing')
        project.deleted = True
        project.save()
    
    job_list = Jobs.select().where(Jobs.project_id == project_id, Jobs.deleted == False)
    if job_list is not None:
        active_status = [
            Jobs._meta.QUEUED,
            Jobs._meta.PREPROCESSING,
            Jobs._meta.PROCESSING
        ]
    
        for job in job_list:
            if job.status in active_status:
                task = (Tasks.select().where(Tasks.job_id == job.job_id)
                        .order_by(Tasks.create_datetime.desc()).first())

                # stop runner
                stop_running_job(job.job_id, task.type)

                # appends status to job and task
                common.wirte_job_status_to_suspend(job, task)

            job.deleted = True
            job.save()

    # remove project files
    project_dir = os.path.join(settings.PROJECTS_DIR, str(project_id))
    if os.path.exists(project_dir):
        shutil.rmtree(project_dir)

    return {}