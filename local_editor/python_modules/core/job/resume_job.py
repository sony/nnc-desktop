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

from conf import consts
from utils import common
from utils.file_utils import ProjectFile
from utils.exception import NNcdException, CODE
from utils.request_runner import start_running_job
from sqlite3db.models import Jobs, db, Projects, Tasks, StructureSearches, Datasets


class ParsePostArgs():

    def __init__(self, user_id: int, project_id: int, job_id: int):
        self.user_id = user_id
        self.project_id = project_id
        self.job_id = job_id
        self.type: str = None
        self.priority: str = None
        self.instance_group: int = None
        self.evaluation_dataset_id: int = None
        self.structure_search: dict = {}
        self.inference_inputs = []

        self._parse()

    def _parse(self):
        self.type = request.json.get("type")
        self.priority = request.json.get("priority", "normal")
        self.instance_group = int(request.json.get("instance_group"))
        dataset_id = request.json.get("evaluation_dataset_id")
        self.evaluation_dataset_id = int(dataset_id) if dataset_id is not None else None
        self.inference_inputs = request.json.get("inference_inputs")
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
            "type:" + str(self.type),
            "priority:" + str(self.priority),
            "instanche_group:" + str(self.instance_group),
            "evaluation_dataset_id" + str(self.evaluation_dataset_id),
            "inference_inputs" + str(self.inference_inputs),
            "structure_search:" + str(self.structure_search)
        ])


def resume_job(user_id: str, project_id: int, job_id: int):
    user_id = 1

    # get job args
    job_args = ParsePostArgs(user_id, project_id, job_id)
    if (job_args.type != Jobs._meta.EVALUATE 
        and job_args.structure_search 
        and job_args.structure_search.get("ss_enable", False)):

        # generate search structure
        job = common.find_job_with_validation(project_id, job_id)
        
        ss_id = job.ss_id
        if not common.validate_instance_group(job_args.instance_group):
            raise NNcdException(CODE.NNCD_BAD_REQUEST, 'Invalid instance group')
        if ss_id:
            results = _resume_job_by_ss_id(job_args, ss_id)
            if isinstance(results[job.job_id], Exception):
                raise results[job_id]
            return results[job_id]

    return _resume_job(job_args)


def _resume_job(job_args: ParsePostArgs):
    resumable_status = [Jobs._meta.SUSPENDED, Jobs._meta.FINISHED, Jobs._meta.FAILED]

    job = common.find_job_with_validation(job_args.project_id, job_args.job_id)
    project = Projects.select().where(
            Projects.project_id == job_args.project_id, Projects.deleted == False
        ).first()

    # Error if another user is editing project 
    if not common.is_editable_project(project, job_args.user_id):
        raise NNcdException(CODE.NNCD_CONFIGURATION_EDITING,
                                'Failed to resume job cases of the editing')
    last_task = Tasks.select().where(
            Tasks.job_id == job_args.job_id
        ).order_by(Tasks.create_datetime.desc()).first()

    if job.status not in resumable_status:
        raise NNcdException(CODE.NNCD_STATUS_INCORRECT, 'Job might still be running')

    if job_args.type in [Jobs._meta.EVALUATE, Jobs._meta.INFERENCE]:
        train_task = Tasks.select() \
            .where(Tasks.job_id == job_args.job_id, Tasks.type == Jobs._meta.TRAIN) \
            .order_by(Tasks.create_datetime.desc()).first()
        if not train_task:
            raise NNcdException(CODE.NNCD_BAD_REQUEST, 'Training job has not started yet')
        # evaluate resume job, validation dataset
        common.validate_available_dataset(job_args.user_id, job_args.evaluation_dataset_id)
    else:
        if (last_task.type == Jobs._meta.EVALUATE
                or last_task.type == Jobs._meta.TRAIN
                and job.status == Jobs._meta.FINISHED):
            raise NNcdException(CODE.NNCD_BAD_REQUEST, 'training job has already been finished')

    # create new task for the next use
    task = Tasks(job_id=job, owner_user_id=job_args.user_id)
    if not common.validate_instance_group(job_args.instance_group):
        raise NNcdException(CODE.NNCD_BAD_REQUEST, 'Invalid instance group')
    task.start_time = datetime.datetime.utcnow()
    task.instance_group = job_args.instance_group
    task.type = job_args.type
        

    # get sdcproj file path
    sdcproj_file_path = "{dir_path}/data.sdcproj".format(
        dir_path=common.get_configuration_file_dir(job_args.project_id, job.job_id)
    )

    # create the log file and other empty results file, and get results dir
    output_path = create_file_in_results_dir(
        job_args.project_id, job.job_id, job_args.type
    )

    # unbind structure search id
    if job.ss_id and (
        job_args.type == Jobs._meta.EVALUATE
        or job_args.structure_search
        and not job_args.structure_search.get("ss_enable", False)
    ):
        job.ss_id = None
    
    # write job status
    job.status = Jobs._meta.PREPROCESSING
    job.status_update_datetime = datetime.datetime.utcnow()

    # if job resume training job
    common.change_status_of_train_file(job, job_args.type, Jobs._meta.PREPROCESSING)

    # get parallel_num and provider
    parallel_num, provider = common.get_parallel_num_and_provider(task.instance_group)

    resume_args = {
        'command': job_args.type,
        'config': sdcproj_file_path,
        'outdir': output_path,
        'inputs': job_args.inference_inputs,
        "priority": job_args.priority,
        "instance_group": job_args.instance_group,
        "parallel_num": parallel_num
    }

    if job_args.structure_search:
        resume_args.update(job_args.structure_search)
    
    # evaluate/inference resume
    if job_args.type in [Jobs._meta.EVALUATE, Jobs._meta.INFERENCE]:
        found_dataset = Datasets.select().where(
                Datasets.dataset_id == job_args.evaluation_dataset_id,
                Datasets.deleted == False
            ).first()
        if job_args.type == Jobs._meta.INFERENCE:
            resume_args['infer_header'] = found_dataset.header
        resume_args['dataset'] = "{tenant_id}/{dataset_id}.cache".format(
            tenant_id=found_dataset.tenant_id,
            dataset_id=job_args.evaluation_dataset_id
        )
        task.dataset_id = job_args.evaluation_dataset_id

    with db.atomic():
        job.save()
        task.save()

    resume_args.update({'task_id': task.task_id})

    # resume job
    start_running_job(job.job_id, job_args.type, json.dumps(resume_args))

    log_txt_url = common.get_log_url(
        job_args.user_id, job_args.project_id, job.job_id, job_args.type)
    status_json_url = common.get_status_url(
        job_args.user_id, job_args.project_id, job.job_id, job_args.type)

    return {
        'log_url': log_txt_url,
        'status_url': status_json_url
    }


def _resume_job_by_ss_id(job_args: ParsePostArgs, ss_id: int):
    ss = StructureSearches.select().where(StructureSearches.ss_id == ss_id).first()
    ss.desired_state = Jobs._meta.PROCESSING
    ss.save()
    jobs = Jobs.select().where(
        Jobs.ss_id == ss_id, Jobs.status == Jobs._meta.SUSPENDED, Jobs.deleted == False
    )
    base_job_id = str(ss.base_job_id)
    job_args.structure_search.update({
        'base_job_id': int(base_job_id)
    })
    results = {}
    for job in jobs:
        try:
            job_args.job_id = job.job_id
            ret = _resume_job(job_args)
            results[job.job_id] = ret
        except Exception as e:
            results[job.job_id] = e
    if job_args.job_id not in results:
        # The job requested by the user executes resume_job
        # even in a state other than suspended.
        results[job_args.job_id] = _resume_job(job_args)
    return results


def create_file_in_results_dir(project_id: int, job_id: int, job_type: str):
    log_file_name = common.get_log_file_name(job_type)
    status_file_name = common.get_status_file_name(job_type)
    file_obj = ProjectFile("results", project_id, job_id)

    # remove evaluation_log.txt, evaluation_status.json and page dirtory
    if job_type == Jobs._meta.EVALUATE:
        remove_file = [log_file_name, status_file_name, 'page']
        file_obj.remove(remove_file)

    if job_type == Jobs._meta.INFERENCE:
        remove_file = [log_file_name, status_file_name, 'infer_page']
        file_obj.remove(remove_file)
    
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
            file_obj.write(f"{now_time} [front]: Accepted a job request", mode="a")
        else:
            if not file_obj.exist():
                file_obj.write("")
    return file_obj.file_dir_path