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
import logging
import zipfile
import sys
import importlib
import subprocess
import re
from datetime import datetime

from os.path import expanduser

# no gpu support temporarily, no need update table unless table mismatched
PY_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(os.path.join(PY_ROOT, 'server'))
models = importlib.import_module('sqlite3db.models')


def get_gpu_num():
    cmd = """nvidia-smi --query-gpu=name --format=csv,noheader"""
    result = subprocess.run(cmd, shell=True, capture_output=True)
    if result.returncode == 0:
        return len(result.stdout.splitlines())
    else:
        return 0


def update_gpu_conf(gpu_setting_path, LocalSDeepProcessorType):
    with open(gpu_setting_path, 'r') as f:
        datas = f.readlines()

    logging.warning(f'gpu conf: {gpu_setting_path} {datas}')
    with open(gpu_setting_path, 'w') as f:
        for i in datas:
            search_data = re.search('LocalSDeepProcessorType=(0|1)\s*', i)
            if search_data:
                i = i.replace(f'LocalSDeepProcessorType={search_data.group(1)}',
                              f'LocalSDeepProcessorType={LocalSDeepProcessorType}')
            logging.warning(f'new data: {i}')
            f.write(i)


def check_gpu():
    gpu_num = get_gpu_num()
    query = models.LocalInstances.select().where(models.LocalInstances.instance_type == 1)
    if gpu_num > 0:
        gpu_num_const = 1 # local multigpu is not support for now
        update_datas = {'description': {"en-US": f"HOST GPU x {gpu_num_const}", "ja-JP": f"HOST GPU x {gpu_num_const}"},
                        "gpu_count": gpu_num_const}
        if query.exists():
            models.LocalInstances.update(update_datas).where(models.LocalInstances.instance_type == 1).execute()
            LocalSDeepProcessorType = 1
        else:
            models.LocalInstances.create(
            instance_type=1,
            update_datetime=datetime.now(),
            create_datetime=datetime.now(),
            description=update_datas['description'],
            priority=0,
            available=1,
            gpu_count=gpu_num_const,
            provider='local',
            deleted=0
            )
            LocalSDeepProcessorType = 1
    else:
        update_datas = {'description': {"en-US": f"HOST CPU x 1", "ja-JP": f"HOST CPU x 1"},
                        "gpu_count": 0}
        if query.exists():
            models.LocalInstances.delete().where(models.LocalInstances.instance_type == 1).execute()
            LocalSDeepProcessorType = 0
        else:
            LocalSDeepProcessorType = 0

    connector_settings_path = os.path.join(PY_ROOT, 'connector', 'nncd_console', 'settings', 'settings.ini')
    server_settings_path = os.path.join(PY_ROOT, 'server', 'nncd_console', 'settings', 'settings.ini')
    update_gpu_conf(connector_settings_path, LocalSDeepProcessorType)
    update_gpu_conf(server_settings_path, LocalSDeepProcessorType)


def main():
    src_dir = os.environ.get('DESKTOP_SRC_DIR')
    home = expanduser("~")
    RESULT_DIR = os.path.join(home, 'nncd_bucket')
    if src_dir and not os.path.isdir(RESULT_DIR):
        zip_src = os.path.join(src_dir, 'opt-ex.zip')
        with zipfile.ZipFile(zip_src, 'r') as zip_ref:
            zip_ref.extractall(home)
            logging.warning(f'extract data dir successfully.')
        
    logging.warning(f'desktop: {src_dir} {RESULT_DIR}')

    try:
        import nnabla_ext.cuda, nnabla_ext.cudnn
        check_gpu()
        logging.warning('precheck ok')
    except:
        query = models.LocalInstances.select().where(models.LocalInstances.instance_type == 1)
        if query.exists():
            models.LocalInstances.delete().where(models.LocalInstances.instance_type == 1).execute()
        logging.warning('precheck ok')

if __name__ == '__main__':
    main()
