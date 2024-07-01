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
import shutil
import subprocess

from conf import consts, settings
from utils import path_util, common
from sqlite3db.models import Jobs, Tasks, Projects
from conf.consts import ImportStatus, IMPORT_TMP_NNP, IMPORT_TMP_NNP_WITH_WEIGHT
from components.project_importer import file_util
from components.project_importer.base_task import BaseTask
from components.project_importer.exceptions import ImportProjectError


class SdcprojUpdater(BaseTask):
    def __init__(self, project_id: int, nnp_dir_path):
        super(SdcprojUpdater, self).__init__()
        self.project_id = project_id
        self.nnp_dir_path = nnp_dir_path

    def do(self):
        self._update_sdcproj_status(ImportStatus.PROCESSING)
        self.exec()
        self._update_sdcproj_status(ImportStatus.COMPLETED)
        # for get_projects api respance has attr import status and import_sdcproj_status  
        # self.delete_import_dir(self.nnp_dir_path)
        
    def _get_status_file_name(self, job_type):
        return job_type + consts.STATUS_FILE_SUFFIX

    def _create_empty_job(self):
        project = Projects.select().where(
                Projects.project_id == self.project_id,
                Projects.deleted == False,
            ).first()

        job = Jobs.create(
            name=consts.BASE_JOB_NAME_FOR_IMPORT_PROJECT,
            tenant_id=project.tenant_id,
            project_id=self.project_id,
            owner_user_id=project.owner_user_id,
            last_exec_uid=project.owner_user_id,
            elapsed_time=0,
            status=Jobs._meta.FINISHED
        )

        task = Tasks.create(
            job_id=job.job_id,
            owner_user_id=project.owner_user_id
        )
        task.start_time = task.update_datetime
        task.end_time = task.update_datetime
        task.elapsed_time = 0
        task.type = Jobs._meta.TRAIN
        task.save()
        
        return job

    def on_failure(self, error: Exception):
        msg = error.msg if isinstance(error, ImportProjectError) else 'Internal Server Error.'
        self._update_sdcproj_status(ImportStatus.FAILED, error_msg=msg)

    def _update_sdcproj_status(self, status, error_msg=None):
        new_status = {'import_sdcproj_status': status, 'import_error_msg': error_msg}
        status_file_path = path_util.make_import_status_json_path(self.project_id)
        if os.path.exists(status_file_path):
            status = json.load(open(status_file_path, 'r'))
            status.update(new_status)
            json.dump(status, open(status_file_path, 'w'))
        else:
            json.dump(new_status, open(status_file_path, 'w'))

    def delete_import_dir(self, dir_path: str):
        shutil.rmtree(dir_path, ignore_errors=False)

    def exec(self):
        nnp_file_list = [IMPORT_TMP_NNP, IMPORT_TMP_NNP_WITH_WEIGHT]
        import_nnp_name = ''
        for file_name in os.listdir(self.nnp_dir_path):
            if file_name in nnp_file_list:
                import_nnp_name = file_name

        if import_nnp_name == IMPORT_TMP_NNP:
            return

        # create empty job
        job = self._create_empty_job()

        # download sdcproj file
        local_path = os.path.join(self.nnp_dir_path, 'edit.sdcproj')
        output_sdcproj = os.path.join(self.nnp_dir_path, 'upload.sdcproj')
        sdcproj_path = path_util.make_project_sdcproj_path(self.project_id)
        file_util.copy(sdcproj_path, local_path)

        cmd = settings.NNCD_CONSOLE_CLI_UTIL + ['get_parameter_name',
            '-i', local_path, '-o', output_sdcproj, '-j', str(job.job_id)
        ]
    
        subprocess.run(" ".join(cmd), shell=True, stdout=subprocess.PIPE)

        file_util.copy(output_sdcproj, sdcproj_path)

        # copy sdcproj
        job_sdcproj_path = path_util.make_sdcproj_path(self.project_id, job.job_id)
        if not os.path.exists(os.path.dirname(job_sdcproj_path)):
            os.makedirs(os.path.dirname(job_sdcproj_path))
        file_util.copy(output_sdcproj, job_sdcproj_path)

        # move nnp
        dst_nnp_file_path = path_util.make_import_nnp_file_path(self.project_id, job.job_id)
        if not os.path.exists(os.path.dirname(dst_nnp_file_path)):
            os.makedirs(os.path.dirname(dst_nnp_file_path))
        file_util.copy(os.path.join(self.nnp_dir_path, import_nnp_name), dst_nnp_file_path)

        # upload status.json
        status_file_name = self._get_status_file_name('train')
        dummy_status = {
            'status': 'finished',
            'epoch': {
                'current': 100,
                'max': 100
            }
        }
        path_util.create_object_in_result(
            self.project_id, job.job_id, status_file_name, json.dumps(dummy_status)
        )

    
