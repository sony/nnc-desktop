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


from datetime import datetime

from conf import consts
from sqlite3db.models import Jobs, Users, Tasks, fn


def get_process_resource(user_id: str):
    user_id = 1
    # running_status = [
    #     Jobs._meta.QUEUEED,
    #     Jobs._meta.PREPROCESSING,
    #     Jobs._meta.PROCESSING
    # ]
    current_dt = datetime.utcnow()

    user = Users.select().where(Users.user_id == user_id).first()
    max_process_resource = user.max_process_resource

    running_elapsed_time_sec = get_sum_of_cpu_elapsed_time_of_running_task(user_id, current_dt)
    finished_elapsed_time_sec = get_sum_of_cpu_elapsed_time_for_user(user_id)
    elapsed_time_min, _ = divmod(finished_elapsed_time_sec + running_elapsed_time_sec, 60)
    return {
        'process_resource': int(elapsed_time_min),
        'max_process_resource': int(max_process_resource)
    }


def get_sum_of_cpu_elapsed_time_of_running_task(user_id: int, end_time: datetime):
    jobs = Jobs.select(Jobs.job_id).where(
        Jobs.owner_user_id == user_id,
        Jobs.status == Jobs._meta.PROCESSING
    )
    cpu_usage = Tasks.select(
            fn.SUM(fn.STRFTIME('%s', end_time) - fn.STRFTIME('%s', Tasks.end_time))
        ).where(
            Tasks.instance_group == consts.InstanceType.CPU.value,
            Tasks.job_id.in_(jobs),
            Tasks.end_time.is_null()
        ).scalar()
    return int(cpu_usage) if cpu_usage is not None else 0


def get_sum_of_cpu_elapsed_time_for_user(user_id: int):
    elapsed_time = Jobs.select(fn.SUM(Jobs.cpu_elapsed_time)).where(
            Jobs.owner_user_id == user_id
        ).scalar()
    return elapsed_time if elapsed_time is not None else 0