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
import datetime
from typing import Optional

from sqlite3db.models import Projects, Jobs, Tasks, ProjectMetadatas
from conf import consts, settings
from utils import common
from utils.file_utils import ProjectFile


def _is_completed_page_files_of_result(job: Jobs, task: Tasks):
    # check that output_result_{row}_{colunm}.cache.json is complete
    row = int((task.data_num - 1) / 10) * 10
    column = int((task.column_num - 1) / 10) * 10
    name, _ = os.path.splitext(consts.OUTPUT_RESULT_CSV)
    file_name = f'page/{name}_{column}_{row}.cache.json'

    result_path = common.get_result_job_file_dir(job.project_id, job.job_id)
    result_file_path = os.path.join(result_path, file_name)
    return os.path.exists(result_file_path)


def is_copyable_jobs_in_project(project_id: int):
    """Make the copied project is complete, include the page file"""
    # the status of job to copy
    copy_status = [Jobs._meta.FINISHED, Jobs._meta.SUSPENDED]

    jobs = Jobs.select()\
        .where(Jobs.project_id == project_id, Jobs.deleted == False)

    for job in jobs:
        if job.status not in copy_status:
            continue
        # check that the task exists if the job isn't in the copy state
        task = Tasks.select().where(
                Tasks.job_id == job.job_id, Tasks.type == Jobs._meta.EVALUATE
            ).order_by(Tasks.create_datetime.desc()).first()
        if not task:
            continue

        # check that the evaluation result is complete if the task exists
        if task.data_num and task.column_num:
            if not _is_completed_page_files_of_result(job, task):
                return False
    return True


def copy_job(base_job: dict, tenant_id: str, user_id: int, new_project_id: int):
    # copy job
    new_job_metadata = base_job.copy()
    new_job_metadata.update({
        "tenant_id": tenant_id,
        "owner_user_id": user_id,
        "last_exec_uid": user_id,
        "project_id": new_project_id,
        "elapsed_time": 0,
        "cpu_elapsed_time": 0
    })
    new_job_metadata.pop("job_id")
    new_job = Jobs(**new_job_metadata)
    new_job.save()

    _copy_tasks(base_job["job_id"], new_job.job_id, user_id)
    _copy_job_sdcproj_and_result_file(
        base_job['project_id'], base_job['job_id'],
        new_job.project_id, new_job.job_id
    )
    return new_job


def _copy_tasks(based_job_id: int, new_job_id: int, user_id: int):
    task_list = Tasks.select().where(Tasks.job_id == based_job_id).dicts()
    for task in task_list:
        new_task_metadata = task.copy()
        new_task_metadata.update({
            "job_id": new_job_id,
            "owner_user_id": user_id,
            "elapsed_time": 0
        })
        new_task_metadata.pop("task_id")
        new_task = Tasks(**new_task_metadata)
        new_task.save()


def _copy_job_sdcproj_and_result_file(src_project_id: int, src_job_id: int,
                                      dst_project_id: int, dst_job_id: int):

    # copy data file with ".configuration" or "sdcproj" suffix
    copy_suffix = ['configuration', 'sdcproj']
    for suffix in copy_suffix:
        src_path = f"{src_project_id}/configurations/{src_job_id}/data.{suffix}"
        dst_path = f"{dst_project_id}/configurations/{dst_job_id}/data.{suffix}"

        _copy_file(src_path, dst_path)

    # copy result file
    src_result_path = f"{src_project_id}/results/{src_job_id}/"
    dst_result_path = f"{dst_project_id}/results/{dst_job_id}/"

    copy_files = [
        'confusion_matrix.json',
        'evaluate_log.txt',
        'evaluate_status.json',
        'monitoring_report.yml',
        'result.ini',
        'result.nnp',
        'train_log.txt',
        'train_status.json',

        # page dir
        'page/',

        # temporary copy
        'result_train.nnp',
        'result_evaluate.nnp',
        'result.nnb',
        'result.onnx',
    ]
    for file_name in copy_files:
        _copy_file(src_result_path+file_name, dst_result_path+file_name)
    
    # copy file with 'results_best_' and 'results_current_' prefix
    for file_name in _result_prefix_files(src_result_path):
        _copy_file(src_result_path+file_name, dst_result_path+file_name)


def copy_project_sdcproj_file(src_project_id: int, dst_project_id: int):
    # copy data file with ".configuration" or "sdcproj" suffix
    copy_suffix = ['configuration', 'sdcproj']
    for suffix in copy_suffix:
        src_path = f"{src_project_id}/configurations/project/data.{suffix}"
        dst_path = f"{dst_project_id}/configurations/project/data.{suffix}"

        _copy_file(src_path, dst_path)


def copy_users_metadata(src_project: Projects, dst_project: Projects):
    # copy project_metadatas
    metadata_list = ProjectMetadatas.select()\
        .where(ProjectMetadatas.project_id == src_project.project_id)
    
    for metadata in metadata_list:
        if not metadata.item_name.startswith("#"):
            continue
        common.merge_projectmetadata(
            dst_project.project_id, metadata.item_name,
            ProjectMetadatas._meta.TEXT, metadata.text_value
        )


def _copy_file(src_path: str, dst_path: str):
    src_file_path = os.path.join(settings.PROJECTS_DIR, src_path)
    dst_file_path = os.path.join(settings.PROJECTS_DIR, dst_path)

    if not os.path.exists(src_file_path):
        return
    if os.path.isdir(src_file_path):
        shutil.copytree(src_file_path, dst_file_path)
    else:
        dst_dir_path, _ = os.path.split(dst_file_path)
        if not os.path.exists(dst_dir_path):
            os.makedirs(dst_dir_path)
        shutil.copy(src_file_path, dst_file_path)


def _result_prefix_files(src_path: str):
    src_dir_path = os.path.join(settings.PROJECTS_DIR, src_path)
    if os.path.exists(src_dir_path):
        file_list = os.listdir(src_dir_path)
        for file_name in file_list:
            if file_name.startswith("results_best_") or file_name.startswith("results_current_"):
                yield file_name


def get_configuration_from_file(configuration_format: Optional[str],
                                project_id: int, job_id: Optional[int] = None):
    if configuration_format is None:
        res = ProjectFile("configuration", project_id, job_id).read()
        output_format = "json"
    else:
        res = ProjectFile("sdcproj", project_id, job_id).read()
        output_format = configuration_format

    if res is None and configuration_format == "sdcproj":
        return get_configuration_from_file(None, project_id, job_id)
    return res, output_format
