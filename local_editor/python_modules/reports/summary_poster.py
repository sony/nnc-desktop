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
import os
from flask import request
from tempfile import TemporaryDirectory
from sqlite3db.models import Projects, Users, Reports
from utils.file_utils import ProjectFile
from reports.report import Report
from reports.confusion_matrix import ConfusionMatrix
from conf.consts import SAMPLE_USER_ID
from utils.common import validate_available_dataset


class SummaryPoster(object):
    def __init__(self, report_id: int) -> None:
        self.report_id = report_id
        self.owner_user_id = None
        self.nickname = None
        self.project_id = None
        self.job_id = None
        self.project_name = None
        self.destination = None
        self.report_type = None
    
    def load_report_info_from_db(self) -> None:
        report = Reports.select().where(Reports.report_id == self.report_id).first()
        if not report:
            raise Exception(f"Not found report (report_id = {self.report_id})")
        self.owner_user_id = report.owner_user_id
        self.project_id = report.project_id
        self.job_id = report.job_id
        self.destination = report.destination
        self.report_type = report.report_type
        project_raw = Projects.select().where(
                Projects.project_id == self.project_id, Projects.deleted == False
            ).first()
        if not project_raw:
            raise Exception("Not fount project (project_id = {self.project_id})")
        self.project_name = project_raw.name
        user = Users.select().where(
                Users.user_id == self.owner_user_id, Users.deleted == False
            ).first()
        self.nickname = user.nickname
        if self.destination == Reports._meta.PUBLIC:
            if not self.nickname:
                raise Exception("Nickname is empty.")

    def generate_confusion_matrix_csv_from_json(self) -> []:
        local_c_matrix = ProjectFile(
            'reports', self.project_id, self.report_id, 'confusion_matrix.json'
        )
        if not local_c_matrix.exist():
            return []
        
        c_matrix_list = ConfusionMatrix.load_json(local_c_matrix.read())
        c_matrix_paths = []
        for c_matrix in c_matrix_list:
            c_matrix_paths.append(
                c_matrix.write_file(local_c_matrix.file_dir_path)
            )
        return c_matrix_paths

    def run(self) -> None:
        self.load_report_info_from_db()

        with TemporaryDirectory() as temp:
            local_sdcproj = ProjectFile(
                "reports", self.project_id, self.report_id, "data.sdcproj"
            )
            if not local_sdcproj.exist():
                raise Exception("Not found sdcproj on reports dir")

            report = Report.load_from_sdcproj(local_sdcproj.full_path)
            self.validate_all_dataset(self.owner_user_id, report)
    
            report.set_project_name(self.project_name)
            reports_file_base_path = local_sdcproj.file_dir_path
            report.make_network_image_path(reports_file_base_path)
            if self.report_type == Reports._meta.NETWORK_AND_RESULT:
                report.make_result_section(
                    reports_file_base_path,
                    self.generate_confusion_matrix_csv_from_json()
                )
            else:
                report.clear_result_section()
            
            references_json = ProjectFile(
                "reports", self.project_id, self.report_id, "references.json"
            ).read()
            references = json.loads(references_json) if references_json else {}
            report.set_references(references)

            ini_file_path = os.path.join(reports_file_base_path, "report.ini")
            report.write_ini_file(ini_file_path)

            html_file_path = os.path.join(reports_file_base_path, "report.html")
            nickname = None
            import_url = None
            if self.destination == Reports._meta.PUBLIC:
                nickname = self.nickname
                import_url = f"{request.host_url}/#/project?project_id={self.project_id}"
            report.export_html(ini_file_path, html_file_path, nickname, import_url)
            
    @classmethod
    def validate_all_dataset(cls, user_id: int, report: Report) -> None:
        for dataset_id in report.find_dataset_ids_of_datasets():
            cls._validate_dataset(user_id, dataset_id)
    
    @classmethod
    def _validate_dataset(cls, user_id: int, dataset_id: str) -> None:
        validate_available_dataset(user_id, dataset_id)
        