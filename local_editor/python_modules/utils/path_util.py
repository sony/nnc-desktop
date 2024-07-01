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

from conf.settings import PROJECTS_DIR


def make_result_dir_path(project_id, job_id):
    return '{project_dir}/{project_id}/results/{job_id}'.format(
        project_dir=PROJECTS_DIR, project_id=project_id, job_id=job_id
    )


def make_import_nnp_file_path(project_id, job_id):
    path = make_result_dir_path(project_id, job_id)
    return '{path}/results_best_100.nnp'.format(
        path=path
    )


def make_temp_nnp_dir_path(project_id):
    return '{project_dir}/{project_id}/import'.format(
        project_dir=PROJECTS_DIR, project_id=project_id,
    )


def make_import_config_dir_path(project_id):
    return '{project_dir}/{project_id}/import/project.data'.format(
        project_dir=PROJECTS_DIR, project_id=project_id,
    )


def make_import_status_json_path(project_id):
    return '{project_dir}/{project_id}/import/import_status.json'.format(
        project_dir=PROJECTS_DIR, project_id=project_id,
    )


def make_sdcproj_path(project_id, job_id):
    return '{project_dir}/{project_id}/configurations/{job_id}/data.sdcproj'.format(
        project_dir=PROJECTS_DIR, project_id=project_id, job_id=job_id
    )


def make_project_sdcproj_path(project_id):
    return '{project_dir}/{project_id}/configurations/project/data.sdcproj'.format(
        project_dir=PROJECTS_DIR, project_id=project_id
    )


def copy_org_sdcproj(src_project_id, dst_project_id, dst_job_id):
    # copy sdcproj files
    src_sdcproj_path = make_project_sdcproj_path(src_project_id)
    dst_sdcproj_path = make_sdcproj_path(dst_project_id, dst_job_id)
    shutil.copy(src_sdcproj_path, dst_sdcproj_path)


def create_object_in_result(project_id, job_id, name, data):
    destination_file_path = os.path.join(
        make_result_dir_path(project_id, job_id), name
    )
    with open(destination_file_path, 'w') as f:
        f.write(data)
    return destination_file_path

