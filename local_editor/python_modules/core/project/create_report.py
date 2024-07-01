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

import base64
from flask import request

from utils import common
from utils.file_utils import ProjectFile
from sqlite3db.models import Reports, Jobs


def create_report(user_id: str, project_id: int):
    user_id = 1

    # post args
    destination = request.json.get("destination")
    files = request.json.get("files")
    job_id = request.json.get("job_id")
    report_type = request.json.get("report_type")
    if job_id is not None:
        if report_type is None:
            raise Exception("report_type must be set if job_id is set")
    else:
        report_type = Reports._meta.NETWORK

    report = Reports.create(
        owner_user_id=user_id, project_id=project_id,
        job_id=job_id, destination=destination, report_type=report_type
    )

    # Copy the files needed for report creation to the reports directory
    try:
        _copy_sdcproj_to_report_dir(project_id, job_id, report.report_id)
        _copy_additional_files_to_report_dir(project_id, report.report_id, files)
        if report_type == Reports._meta.NETWORK_AND_RESULT:
            _copy_confusion_matrix_to_report_dir_if_exists(
                project_id, job_id, report.report_id
            )
    except:
        report.delete().execute()
        raise
        
    return {"report_id": str(report.report_id)}


def _copy_sdcproj_to_report_dir(project_id: int, job_id: int, report_id: int):
    ProjectFile('sdcproj', project_id, job_id).copy(
        ProjectFile("reports", project_id, report_id)
    )


def _copy_additional_files_to_report_dir(project_id: int, report_id: int, files: dict):
    report_file = ProjectFile("reports", project_id, report_id)
    for file in files:
        report_file.file_name = file["name"]
        report_file.write(
            base64.b64decode(file['data']["base64"].encode("utf-8")), mode="wb"
        )


def _copy_confusion_matrix_to_report_dir_if_exists(project_id: int, job_id: int, report_id: int):
    result_file = ProjectFile("results", project_id, job_id, "confusion_matrix.json")
    if result_file.exist():
        result_file.copy(ProjectFile("reports", project_id, report_id))
