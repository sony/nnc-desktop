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

from utils import project_utils
from utils.exception import NNcdException, CODE
from sqlite3db.models import Projects, ProjectStars, Jobs, Tasks, Users, Tenants, db


def copy_project(user_id: str, project_id: int):
    user_id = 1

    # get request args
    tenant_id = request.json.get("tenant_id", None)
    if not tenant_id:
        user = Users.select(Users.tenant_id)\
            .where(Users.user_id == user_id).first()
        tenant_id = user.tenant_id
    project_name = request.json.get("project_name", None)

    based_project = Projects.select().where(
            Projects.project_id == project_id, Projects.deleted == False
        ).first()
    if not based_project:
        raise NNcdException(CODE.NNCD_BAD_REQUEST, f'Not found project')


    # Can not copy the project being copied
    if not project_utils.is_copyable_jobs_in_project(project_id):
        return "The project cann't be copied."

    # create new project and save, for later use project_id
    new_project = Projects.create(
        name=project_name,
        tenant_id=tenant_id,
        owner_user_id=user_id,
        last_modified_uid=user_id
    )

    # copy lastest job and task
    _copy_lastest_job(
        based_project.project_id, tenant_id,
        user_id, new_project.project_id
    )

    # copy project configuration and sdcproj file
    project_utils.copy_project_sdcproj_file(
        based_project.project_id, new_project.project_id
    )

    # copy user-defined project metadata
    project_utils.copy_users_metadata(based_project, new_project)

    with db.atomic():
        # copy original project id
        new_project.original = based_project.project_id
        new_project.save()

        # add public or sample project copy count
        tenant = Tenants.select()\
            .where(Tenants.tenant_id == based_project.tenant_id).first()
        if tenant.purpose in (Tenants._meta.PUBLIC, Tenants._meta.SAMPLE):
            based_project.copy_count += 1
            based_project.save()

        return {"project_id": str(new_project.project_id)}


def _copy_lastest_job(based_project_id: int, tenant_id: str,
                      user_id: int, new_project_id: int):
    # find the lastest finished or suspended job
    job_status = [Jobs._meta.FINISHED, Jobs._meta.SUSPENDED]
    lastest_job = Jobs.select()\
        .where(Jobs.project_id == based_project_id,
               Jobs.status.in_(job_status),
               Jobs.deleted == False)\
        .order_by(Jobs.create_datetime.desc()).dicts().first()

    # copy job and task if lastest job exists
    if lastest_job is not None:
        project_utils.copy_job(lastest_job, tenant_id, user_id, new_project_id)
