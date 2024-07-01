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

from conf import consts
from utils import common
from sqlite3db.models import Jobs


def get_download_result(user_id: str, project_id: int, job_id: int):
    format = request.args.get("format")
    active_status = [Jobs._meta.QUEUED, Jobs._meta.PREPROCESSING, Jobs._meta.PROCESSING]

    job = common.find_job_with_validation(project_id, job_id)
    if job.status in active_status:
        raise Exception("Job status must be SUSPENDED, FINISHED or FAILED.")

    set_of_job_type = common.find_set_of_job_type(job_id)
    if set_of_job_type == {Jobs._meta.PROFILE}:
        raise Exception("Job must be executed by train or evaluate to download result")

    file_name = _get_download_file_name(format)
    download_url = common.get_result_file_url(
        user_id, project_id, job_id, file_name
    )
    return {"download_url": download_url}

def _get_download_file_name(format_name: str):
    for nc_format in consts.NETWORK_CONFIGURATION_FORMATS:
        if nc_format['name'] == format_name:
            return nc_format['file_name']
    raise Exception("not found format in network configuration formats.")