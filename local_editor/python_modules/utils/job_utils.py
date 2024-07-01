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
from conf import consts
from sqlite3db.models import Tasks, Jobs, fn
from utils import common
from utils.file_utils import ProjectFile


def create_job_data_combined_with_tasks(job: Jobs):
    data = {}

    # get job part data from jobs table
    data = {
        "job_id": str(job.job_id),
        "job_name": job.name,
        "owner_user_id": str(job.owner_user_id),
        "exec_user_id": str(job.last_exec_uid),
        "project_id": str(job.project_id),
        "status": job.status,
        "elapsed_time": job.elapsed_time,
        "deleted": job.deleted
    }

    # get job part data combined with tasks
    tasks = Tasks\
        .select()\
        .where(Tasks.job_id == job.job_id)\
        .order_by(Tasks.create_datetime.asc())
    if not tasks:
        return None
        
    first_task = tasks[0]
    last_task = tasks[-1]
    for task in tasks:
        if task.start_time is not None:
            data['start_time'] = common.to_iso8601str(task.start_time)
            break
    
    if last_task.end_time is not None:
        data["end_time"] = common.to_iso8601str(last_task.end_time)
    data["instance_group"] = last_task.instance_group
    data["type"] = last_task.type
    data["update_datetime"] = common.to_iso8601str(last_task.update_datetime)
    data["create_datetime"] = common.to_iso8601str(first_task.create_datetime)
    data['num_nodes'] = last_task.num_nodes

    # add train_status.json to job data
    stauts_file_name = Jobs._meta.TRAIN + consts.STATUS_FILE_SUFFIX
    train_status = get_result_if_exists(job.project_id, job.job_id, stauts_file_name)
    if train_status:
        data['train_status'] = json.loads(train_status)
    return data


def get_result_if_exists(project_id: int, job_id: int, file_name:str):
    return ProjectFile("results", project_id, job_id, file_name).read()


def make_downloadable_formats(project_id: int, job_id: int):
    downloadable_formats = []

    # get all not-null files from the dictory of result
    result_path = common.get_result_job_file_dir(project_id, job_id)
    if not os.path.exists(result_path):
        return []
    result_file_list = []
    for file_name in os.listdir(result_path):
        file_path = os.path.join(result_path, file_name)
        if os.path.getsize(file_path):
            result_file_list.append(file_name)

    # add file formats to downloadable_formats in order of NETWORK_CONFIGURATION_FORMATS
    for nc_format in consts.NETWORK_CONFIGURATION_FORMATS:
        if nc_format['file_name'] in result_file_list:
            downloadable_formats.append(nc_format["name"])
    
    # if the new file of nnp format exists, please ignore the result.nnp creating by old job
    if {consts.NNP_FORMAT_NNP, consts.NNP_FORMAT_NNP_RESULT} & set(downloadable_formats):
        if consts.NNP_FORMAT_LEGACY in downloadable_formats:
            downloadable_formats.remove(consts.NNP_FORMAT_LEGACY)
    return downloadable_formats


def make_elapsed_time_for_each_type(job_id: int):
    """get time cost of train, profile, evaluate"""
    # get sum of elapsed time of train
    elapsed_time_of_train = Tasks\
        .select(fn.SUM(Tasks.elapsed_time))\
        .where(Tasks.job_id == job_id, Tasks.type == Jobs._meta.TRAIN).scalar()
    
    elapsed_time_for_each_type = {
        "elapsed_time_of_train": elapsed_time_of_train if elapsed_time_of_train is not None else 0
    }

    # get last elapsed time of profile and evaluate, and translate {type: elapsed_time}
    query = Tasks\
        .select(Tasks.type, Tasks.elapsed_time)\
        .where(Tasks.job_id == job_id, Tasks.type != Jobs._meta.TRAIN)\
        .group_by(Tasks.type)\
        .having(Tasks.create_datetime == fn.MAX(Tasks.create_datetime))
    elapsed_time_by_type = {q.type: q.elapsed_time for q in query}

    for job_type in [Jobs._meta.PROFILE, Jobs._meta.EVALUATE, Jobs._meta.INFERENCE]:
        key_name = "elapsed_time_of_" + job_type
        elapsed_time = elapsed_time_by_type.get(job_type, 0)
        elapsed_time_for_each_type.update({key_name: elapsed_time})
            
    return elapsed_time_for_each_type


def make_last_instance_group_for_each_type(job_id: int):
    last_instance_group_for_each_type = {}

    # get last instance group of each type from sqlite3
    instance_group_by_type = Tasks\
        .select(Tasks.type, Tasks.instance_group)\
        .where(Tasks.job_id == job_id, Tasks.type.is_null(is_null=False))\
        .group_by(Tasks.type)\
        .having(Tasks.create_datetime == fn.MAX(Tasks.create_datetime))

    for row in instance_group_by_type:
        key_name = "instance_group_of_" + row.type
        if row.instance_group is not None:
            instance_group = row.instance_group 
        else:
            instance_group = consts.InstanceType.CPU.value
        if instance_group:
            last_instance_group_for_each_type.update({key_name: instance_group})
    return last_instance_group_for_each_type


def create_elapsed_time_for_each_instance(job: Jobs):
    # include deleted job
    elapsed_time_for_each_instance = Tasks\
        .select(Tasks.instance_group.alias("instance_type"),
            fn.SUM(Tasks.elapsed_time).alias("elapsed_time"))\
        .where(Tasks.job_id == job.job_id, Tasks.elapsed_time.is_null(False))\
        .group_by(Tasks.instance_group).dicts()
    if elapsed_time_for_each_instance:
        return list(elapsed_time_for_each_instance)
    return None
