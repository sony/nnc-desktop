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

import requests
import json

from conf import settings
from utils.exception import NNcdException, CODE
from sqlite3db.models import db, LocalInstances, remoteResGInstances



def _get_url():
    return f'http://localhost:{settings.RUNNER_PORT}/'


def _post(url, data):
    res = requests.post(url, proxies={"http": None}, json=data)
    return res.json()


def start_running_job(job_id: int, job_type: str, run_args: str):
    # stop the existed job
    stop_running_job(job_id, job_type)

    arg_dict = json.loads(run_args)
    inst = LocalInstances.select().where(LocalInstances.instance_type == arg_dict.get('instance_group')).first()
    target = None

    data = {'job_id': job_id, 'job_type': job_type, 'args': run_args, 'envs': json.dumps({})}
    if inst.provider == 'remoteResG':
        target = list(remoteResGInstances.select(remoteResGInstances, LocalInstances).join(
                LocalInstances).where(remoteResGInstances.instance_type == arg_dict.get('instance_group')).dicts())
        if len(target) == 0:
            raise NNcdException(CODE.NNCD_INDEX_OUT_OF_RANGE , f"Instance {arg_dict.get('instance_group')} not found")
        target_inst = target[0]
        env_dict = {
                "TRAIN_PROCESSOR_INDEX": 1,
                "TRAIN_PROCESSOR_1_NAME": 'remoteResG_remote',
                "TRAIN_PROCESSOR_1_TYPE": "remoteResG",
                "TRAIN_PROCESSOR_1_USER": target_inst['user'],
                "TRAIN_PROCESSOR_1_KEY": target_inst['cert'],
                "TRAIN_PROCESSOR_1_GROUP": target_inst['partition'],
                "TRAIN_PROCESSOR_1_NUM_GPU": target_inst['gpu_count'],
                "TRAIN_PROCESSOR_1_IMAGE": f"docker://{settings.RUNNER_IMAGE_NAME}",
                "TRAIN_PROCESSOR_1_BASEDIR": f"/home/{target_inst['user']}/.nncd",
                "TRAIN_IN_NNCD": 'True'
            }
        data['envs'] = json.dumps(env_dict)


    _post(
        f"{_get_url()}/start_running_job", data)


def stop_running_job(job_id: int, job_type: str):
    _post(
        f'{_get_url()}/stop_running_job',
        {'job_id': job_id, "job_type": job_type})


def start_uploading_dataset(dataset_id: int, upload_dataset_args: str):
    _post(
        f'{_get_url()}/start_uploading_dataset',
        {'dataset_id': dataset_id, 'args': upload_dataset_args})


def stop_uploading_dataset(dataset_id: int):
    _post(
        f'{_get_url()}/stop_uploading_dataset',
        {"dataset_id": dataset_id})


def run_console_cli(cmd: list):
    res = _post(
        f'{_get_url()}/run_console_cli',
        {'cmd': cmd})
    return res['result']


def start_running_plugin(event: str):
    _post(
        f'{_get_url()}/start_running_plugin',
        {"event": event})
