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

from flask import url_for
from sqlite3db.models import Reports
from reports.summary_poster import SummaryPoster


def get_report(user_id: str, project_id: int, report_id: int):
    report = Reports.select().where(
            Reports.project_id == project_id, Reports.report_id == report_id
        ).first()
    if report is None:
        raise Exception("Not found report.")
    
    # generate report html
    SummaryPoster(report_id).run()

    response = {
        'job_id': str(report.job_id),
        'status': "completed",
        'process': 100,
        'destination': report.destination,
        'download_url': get_report_html_url(user_id, project_id, report_id)
    }
    return response

def get_report_html_url(user_id: int, project_id: int, report_id: int):
    return url_for(
        endpoint="project.get_report_html", user_id=user_id,
        project_id=project_id, report_id=report_id, _external=True, 
    )
