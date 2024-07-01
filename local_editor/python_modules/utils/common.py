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
import json
import uuid
import datetime
from flask import url_for
from typing import Optional, Union
from configparser import ConfigParser
from contextlib import contextmanager

from conf import consts, settings
from utils import available_jobs
from utils.file_utils import ProjectFile
from utils.exception import NNcdException, CODE
from sqlite3db.models import Model, DatasetMetadatas, ProjectMetadatas, SQL, \
    Projects, Jobs, Tasks, fn, db, Datasets, LocalInstances


def to_iso8601str(date_time: datetime.datetime):
    return date_time.strftime("%Y-%m-%dT%H:%M:%SZ")


def get_log_file_name(job_type):
    return job_type + consts.LOG_FILE_SUFFIX


def get_status_file_name(job_type):
    return job_type + consts.STATUS_FILE_SUFFIX


def get_result_job_file_dir(project_id: int, job_id: int):
    return os.path.join(settings.PROJECTS_DIR, os.path.normpath(f"{project_id}/results/{job_id}"))


def get_configuration_file_dir(project_id: int, job_id: int):
    return os.path.join(settings.PROJECTS_DIR, os.path.normpath(f"{project_id}/configurations/{job_id}"))


def get_reports_file_dir(project_id: int, report_id: int):
    return os.path.join(settings.PROJECTS_DIR, os.path.normpath(f"{project_id}/reports/{report_id}"))


def get_log_url(user_id: int, project_id: int, job_id:int, job_type: str):
    return url_for(
        endpoint="job.get_log", user_id=user_id, project_id=project_id,
        job_id=job_id, log_type=job_type, _external=True, 
    )


def get_status_url(user_id: int, project_id: int, job_id:int, job_type: str):
    return url_for(
        endpoint="job.get_status", user_id=user_id, project_id=project_id,
        job_id=job_id, job_type=job_type, _external=True
    )


def get_result_file_url(user_id: int, project_id: int, job_id:int, file_name: str):
    return url_for(
        endpoint="job.get_result_file", user_id=user_id, project_id=project_id,
        job_id=job_id, file_name=file_name, _external=True
    )


def rename_sort_by_matched_db_column(model: Model, sort_by: str):
    # default get the lastest one
    order = "asc"
    column_name = sort_by
    if sort_by[0] in ["+", "-"]:
        order = "asc" if sort_by[0] == '+' else "desc"
        column_name = sort_by[1:]
    if column_name in ('project_name', 'job_name', 'dataset_name'):
        column_name = "name"
    if column_name == "exec_user_id":
        column_name = "last_exec_uid"

    field_name = getattr(model, column_name)
    return getattr(field_name, order)()


def add_user_metadata_mark(name: str):
    # The user metadata is distinguished by the # prefix to the name
    return "#" + name


def add_user_metadata_mark_if_need(name: str):
    if name not in consts.SYSTEM_METADATA_NAMES:
        return add_user_metadata_mark(name)
    return name


def filter_by_name_keyword(model: Model, keyword: str):
    # escape wildcard characters
    replaced_keyword = keyword.replace('_', '\\_').replace('%', '\\%')
    splitted_keywords = replaced_keyword.strip().split()
    keyword_condition_list = []
    for keyword in splitted_keywords:
        keyword_condition_list.append(
            SQL('name like ? escape "\\"', (f'%{keyword}%', ))
        )
    return keyword_condition_list


def _make_criterion(metadata_cls, name, op, value):
    if isinstance(value, float):
        if op == 'eq':
            return (metadata_cls.item_name == name, metadata_cls.numeric_value == value)
        elif op == 'gt':
            return (metadata_cls.item_name == name, metadata_cls.numeric_value > value)
        elif op == 'ge':
            return (metadata_cls.item_name == name, metadata_cls.numeric_value >= value)
        elif op == 'lt':
            return (metadata_cls.item_name == name, metadata_cls.numeric_value < value)
        elif op == 'le':
            return (metadata_cls.item_name == name, metadata_cls.numeric_value <= value)
        else:
            raise Exception(f'Invalid filter {name} {op} {value}')
    elif isinstance(value, str):
        if op == 'eq':
            return (metadata_cls.item_name == name, metadata_cls.text_value == value)
        if op == 'contains':
            replaced_value = value.replace('_', '\\_').replace('%', '\\%')
            return (
                metadata_cls.item_name == name,
                SQL('text_value like ? escape "\\"', (f'%{replaced_value}%', ))
            )
        else:
            raise Exception(f'Invalid filter {name} {op} {value}')
    raise Exception(f'Invalid filter {name} {op} {value}')


def make_subquery_from_metadata(model: Model, metadata_filters: dict):
    
    # get select 
    if model == ProjectMetadatas:
        select_field = ProjectMetadatas.project_id
    elif model == DatasetMetadatas:
        select_field = DatasetMetadatas.dataset_id
    else:
        select_field = None
    
    # get the query condition
    query_condition_list = [] 
    for k, (op, v) in metadata_filters.items():
        query_conditions = _make_criterion(model, k, op, v)
        query_condition_list.extend(query_conditions)

    return model.select(select_field).where(*query_condition_list)


def make_metadata(**kwargs):
    del_keys = []
    for k, v in kwargs.items():
        if v is None:
            del_keys.append(k)
    for k in del_keys:
        del kwargs[k]
    return kwargs


def is_editable_project(project: Projects, user_id: int) -> bool:
    if str(project.last_modified_uid) == str(user_id):
        return True
    end_time_of_lock = (project.last_modified_datetime
                        + datetime.timedelta(seconds=consts.LOCK_DURATION_SEC))
    return datetime.datetime.utcnow() > end_time_of_lock


def validate_instance_group(required_instance_group: int):
    instance = LocalInstances.select().where(
        LocalInstances.instance_type == required_instance_group)
    return instance.exists()


def put_configuration_to_file(configuration_format: Optional[str],
                              configuration: str, project_id: int, job_id: int = None):
    if configuration_format is None:
        configuration_format = "configuration"
    file_path = ProjectFile(configuration_format, project_id, job_id).write(configuration)
    return file_path


def get_status_from_file(project_id: int, job_id: int, job_type: str):
    status_file_name = get_status_file_name(job_type)
    file_obj = ProjectFile('results', project_id, job_id, status_file_name)
    result_str = file_obj.read()

    if result_str is None:
        # denote that file don't exist
        return ''
    try: 
        # decide whether the status is json type
        status_dict = json.loads(result_str)
    except json.JSONDecodeError:
        return ""

    # Change task and job tables when current task's status = job's status
    task = Tasks.select().where(Tasks.job_id == job_id)\
        .order_by(Tasks.create_datetime.desc()).first()
    if task.task_id == status_dict.get("task_id"):
        end_time = status_dict.get("end_time")
        if end_time:
            task.end_time = datetime.datetime.fromtimestamp(end_time)
        elasped_time = status_dict.get("time")
        if elasped_time:
            task.elapsed_time = int(elasped_time.get("elapsed"))
        # if job is evaluate status
        output_result = status_dict.get('output_result')
        if output_result:
            task.data_num = output_result.get('data_num')
            task.column_num = output_result.get('column_num')
            task.header = output_result.get('csv_header')    
        task.save()

        # change jobs status
        job = Jobs.select().where(Jobs.job_id == job_id).first()
        if job:
            status = status_dict.get('status', Jobs._meta.PREPROCESSING)
            if job.status != status:
                job.status = status
                job.status_update_datetime = datetime.datetime.utcnow()
            storage_used = status_dict.get("storage_used")
            if storage_used:
                job.storage_used = storage_used
            best_validation = status_dict.get("best")
            if best_validation:
                job.best_validation = best_validation.get("valid_error")
            cost_multiply_add = status_dict.get("cost_multiply_add")
            if cost_multiply_add:
                job.cost_multiply_add = cost_multiply_add
            elapsed_time = Tasks.select(fn.SUM(Tasks.elapsed_time))\
                .where(Tasks.job_id == job.job_id).scalar()
            job.elapsed_time = elapsed_time if elapsed_time is not None else 0
            cpu_elapsed_time = Tasks.select(fn.SUM(Tasks.elapsed_time))\
                .where(
                    Tasks.job_id == job.job_id,
                    Tasks.instance_group == consts.InstanceType.CPU.value
                ).scalar()
            job.cpu_elapsed_time = cpu_elapsed_time if cpu_elapsed_time is not None else 0
            job.save()

    return status_dict


def get_log_from_file(project_id: int, job_id: int, log_type: str, ext_path=None):
        """
        if log_type is plugin, ext_path is {plugin_id}/{plugin_name}/plugin_log.txt
        """
        log_file_name = ext_path if log_type in ['plugin'] else get_log_file_name(log_type)
        file_obj = ProjectFile('results', project_id, job_id, log_file_name)
        result = file_obj.read()
        return result if result else ''


def wirte_job_status_to_suspend(job: Jobs, task: Tasks):
    # change the status of jobs table and task table
    
    task.end_time = datetime.datetime.utcnow()
    if task.start_time:
        task_elapsed_time = task.end_time - task.start_time
        task.elapsed_time = task_elapsed_time.total_seconds()
    else:
        task.elapsed_time = 0
    job.status = Jobs._meta.SUSPENDED
    job.status_update_datetime = datetime.datetime.utcnow()
    elapsed_time = Tasks.select(fn.SUM(Tasks.elapsed_time))\
        .where(Tasks.job_id == job.job_id).scalar()
    job.elapsed_time = elapsed_time if elapsed_time is not None else 0
    cpu_elapsed_time = Tasks.select(fn.SUM(Tasks.elapsed_time))\
        .where(
            Tasks.job_id == job.job_id,
            Tasks.instance_group == consts.InstanceType.CPU.value
        ).scalar()
    job.cpu_elapsed_time = cpu_elapsed_time if cpu_elapsed_time is not None else 0
    with db.atomic():
        job.save()
        task.save()
    
    # change the status of train_status.json to SUSPENED
    change_status_of_train_file(job, task.type, Jobs._meta.SUSPENDED)


def change_status_of_train_file(job: Jobs, job_type: str, status: str):
    status_file_name = get_status_file_name(job_type)
    file_obj = ProjectFile('results', job.project_id, job.job_id, status_file_name)
    result_str = file_obj.read()
    if result_str is None:
        return
    try:
        train_status = json.loads(result_str)
        train_status['status'] = status
        file_obj.write(json.dumps(train_status))
    except json.JSONDecodeError:
        pass


def find_set_of_job_type(job_id: int):
    set_of_job_type = set()
    tasks = Tasks.select(Tasks.type).where(Tasks.job_id == job_id)
    for task in tasks:
        set_of_job_type.add(task.type)
    return set_of_job_type


def validate_available_dataset(user_id: int, dataset_id: str):
    dataset = Datasets.select()\
        .where(
            Datasets.owner_user_id == user_id,
            Datasets.dataset_id == dataset_id,
            Datasets.deleted == False
        ).first()
    if dataset:
        return

    dataset = Datasets.select()\
        .where(
            Datasets.owner_user_id == consts.SAMPLE_USER_ID,
            Datasets.dataset_id == dataset_id,
            Datasets.deleted == False
        ).first()
    if dataset:
        return
    raise NNcdException(CODE.NNCD_BAD_DATASET_ID, 'This dataset can not be referenced')


def merge_projectmetadata(project_id: int, item_name: str, item_type: str,
                          numeric_or_text_value: Union[str, float],
                          job_id: int=0, dataset_id: int=0):
    if item_type == ProjectMetadatas._meta.TEXT:
        text_value = numeric_or_text_value
        numeric_value = 0
    else:
        text_value = ''
        numeric_value = numeric_or_text_value
    
    kwargs = {
        'project_id': project_id,
        "item_name": item_name,
        "item_type": item_type,
        "numeric_value": numeric_value,
        "text_value": text_value,
        "job_id": job_id,
        "dataset_id": dataset_id
    }
    metadata = ProjectMetadatas.select().filter(**kwargs).first()
    if metadata:
        for key, value in kwargs.items():
            setattr(metadata, key, value)
        metadata.save()
    else:
        metadata = ProjectMetadatas.create(**kwargs)
    return metadata


def find_project_labels(project_id: int):
    project_metadata_list = ProjectMetadatas.select()\
        .where(
            ProjectMetadatas.project_id == project_id,
            ProjectMetadatas.item_name == add_user_metadata_mark('labels')
        )
    return [x.text_value for x in project_metadata_list]


def find_job_with_validation(project_id: int, job_id: int) -> Jobs:
    job = Jobs.select().where(Jobs.job_id == job_id).first()
    if not job:
        raise NNcdException(CODE.NNCD_BAD_REQUEST, 'Job id not found')
    if job.deleted:
        raise NNcdException(CODE.NNCD_JOB_DELETED, 'This job is deleted')
    if str(job.project_id) != str(project_id):
        raise NNcdException(CODE.NNCD_BAD_REQUEST, 'Project id is not correct')

    project = Projects.select().where(Projects.project_id == project_id)
    if not project.exists():
        raise NNcdException(CODE.NNCD_BAD_REQUEST, f'Not found project')
    return job


def get_parallel_num_and_provider(instance_group: int):
    instance = LocalInstances.select().where(
        LocalInstances.instance_type == instance_group).first()
    if not instance:
        return None, None
    parallel_num = instance.gpu_count if instance.gpu_count != 0 else 1
    provider = instance.provider
    return parallel_num, provider

@contextmanager
def check_table_exist(table):
    if not table.table_exists():
        table.create_table()
    yield

def is_valid_uuid(uuid_string):
    """Check if the string is uuid."""
    try:
        uuid_obj = uuid.UUID(uuid_string)
        return str(uuid_obj) == uuid_string
    except Exception:
        return False
