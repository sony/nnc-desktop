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
import datetime
from flask import request

from utils import common
from conf import consts, settings
from utils.file_utils import ProjectFile
from utils.exception import NNcdException, CODE
from utils.request_runner import start_running_job
from sqlite3db.models import db, Jobs, Projects, StructureSearches, Tasks, LocalInstances


class ParsePostArgs():

    def __init__(self):
        self.job_name: str = None
        self.configuration: str = None
        self.configuration_format: str = None
        self.sdcproj: str = None
        self.type: str = None
        self.priority: str = None
        self.instance_group: int = None
        self.structure_search: dict = {}

        self._parse()

    def _parse(self):
        self.job_name = request.json.get("job_name")
        self.configuration = request.json.get("configuration")
        self.configuration_format = request.json.get("configuration_format")
        self.sdcproj = request.json.get("this_will_be_deprecated_in_day2")
        self.type = request.json.get("type")
        if self.type == Jobs._meta.EVALUATE:
            raise NNcdException(CODE.NNCD_BAD_REQUEST, 'Type must be profile or train')
        self.priority = request.json.get("priority", "normal")
        self.instance_group = int(request.json.get("instance_group"))
        structure_search = request.json.get("structure_search")
        if structure_search:
            self.structure_search = {
                "ss_enable": structure_search["enable"],
                'ss_attempt_hours': structure_search['attempt_hours'],
                'ss_attempt_times': structure_search['attempt_times']
            }
            if 'multi_mutate_num' in structure_search:
                self.structure_search['multi_mutate_num'] = structure_search['multi_mutate_num']

    def __str__(self):
        return " - ".join([
            "job_name:" + str(self.job_name),
            "configuration:" + str(self.configuration),
            "configuration_format:" + str(self.configuration_format),
            "sdcproj:" + str(self.sdcproj),
            "type:" + str(self.type),
            "priority:" + str(self.priority),
            "instanche_group:" + str(self.instance_group),
            "structure_search:" + str(self.structure_search)
        ])


def create_job(user_id: str, project_id: int):
    user_id = 1

    # get args
    job_args = ParsePostArgs()
    log_file_name = common.get_log_file_name(job_args.type)
    status_file_name = common.get_status_file_name(job_args.type)
    
    
    project = Projects.select().where(
            Projects.project_id == project_id, Projects.deleted == False
        ).first()

    # Error if another user is editing project 
    if not common.is_editable_project(project, user_id):
        raise NNcdException(CODE.NNCD_CONFIGURATION_EDITING,
                                'Failed to create job cases of the editing')
        
    # create new job for the next use
    job = Jobs(            
        name=job_args.job_name,
        tenant_id=project.tenant_id,
        project_id=project_id,
        owner_user_id=user_id,
        last_exec_uid=user_id,
    )
    # create new task for the next use
    task = Tasks(job_id=job, owner_user_id=user_id)
    if not common.validate_instance_group(job_args.instance_group):
        raise NNcdException(CODE.NNCD_BAD_REQUEST, 'Invalid instance group')
    task.instance_group = job_args.instance_group
    task.type = job_args.type

    with db.atomic():
        job.save()
        task.save()

    if job_args.structure_search and job_args.structure_search["ss_enable"]:
        ss = None
        if "base_job_id" in job_args.structure_search:
            # find the structure search job from MetaUpdater
            base_job_id = job_args.structure_search["base_job_id"]
            ss = StructureSearches.select()\
                .where(StructureSearches.base_job_id == base_job_id).first()
            # If the structure search job status is suspended, stop creating the new job
            if ss.desired_state == Jobs._meta.SUSPENDED:
                raise NNcdException(CODE.NNCD_STATUS_INCORRECT, 'Structure search is required stop by user.')
        else:
            job_args.structure_search["base_job_id"] = job.job_id
            ss = StructureSearches(
                base_job_id=job.job_id,
                multi_mutate_num=job_args.structure_search.get("multi_mutate_num", 1),
                desired_state=Jobs._meta.PROCESSING)
            ss.save()
        if ss:
            job.ss_id = ss.ss_id
        
    # save configuraiton to the file of {job_id}/data.sdcproj
    # get sdcproj file path
    sdcproj_file_path = common.put_configuration_to_file(
        "sdcproj", job_args.configuration, project_id, job.job_id
    )
    
    # create the log file and other empty results file, and get results dir
    file_obj = ProjectFile("results", project_id, job.job_id)
    results_file = [
        log_file_name,
        status_file_name,
        consts.REPORT_FILE,
        consts.NNP_FILE
    ]
    for file_name in results_file:
        file_obj.file_name = file_name
        if file_name == log_file_name:
            now_time = str(datetime.datetime.utcnow())[:-3]
            file_obj.write(f"{now_time} [front]: Accepted a job request")
        else:
            file_obj.write("")
    output_path = file_obj.file_dir_path

    # get parallel_num and provider
    parallel_num, provider = common.get_parallel_num_and_provider(task.instance_group)

    run_work_args = {
        'task_id': task.task_id,
        'command': job_args.type,
        'config': sdcproj_file_path,
        'outdir': output_path,
        "priority": job_args.priority,
        "instance_group": job_args.instance_group,
        "parallel_num": parallel_num
    }
    if job_args.structure_search:
        run_work_args.update(job_args.structure_search)

    # submit run_work_args
    start_running_job(job.job_id, job_args.type, json.dumps(run_work_args))

    # save new job and task
    job.status=Jobs._meta.PREPROCESSING
    task.start_time = datetime.datetime.utcnow()
    with db.atomic():
        job.save()
        task.save()

    return {
        'job_id': str(job.job_id),
        'log_url': common.get_log_url(user_id, project_id, job.job_id, job_args.type),
        'status_url': common.get_status_url(user_id, project_id, job.job_id, job_args.type)
    }
