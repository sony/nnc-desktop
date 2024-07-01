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
import sys
import json

from conf import settings, consts
from sqlite3db.models import LocalInstances


class remoteResGInstance():

    def __init__(self):
        self.remote_config_path = os.path.join(settings.RESULT_DIR, 'remote_config/config.json')
    
    def insert_table(self, config):
        """insert remoteResG record to LocalInstances."""

        self.delete()
        gpu_count = config['TRAIN_PROCESSOR_1_NUM_GPU']
        partition = config['TRAIN_PROCESSOR_1_GROUP']
        instance = LocalInstances.create(
            gpu_count=gpu_count,
            available=True,
            priority=0,
            description={
                "en-US": f"remoteResG {partition} x {gpu_count}",
                "ja-JP": f"remoteResG {partition} x {gpu_count}"},
            provider='remoteResG')
        return instance.instance_type

    def delete(self):
        LocalInstances.delete().where(LocalInstances.provider == 'remoteResG').execute()
        
    def extend(self):
        if not os.path.exists(self.remote_config_path):
            self.delete()
            return

        with open(self.remote_config_path, 'r') as f:
            remote_config = json.load(f)

        for instance_name in remote_config:
            cfg = remote_config[instance_name]
            instance_type = self.insert_table(cfg)
            remote_config[instance_name]["INSTANCE_TYPE"] = instance_type
            
            os.chown(cfg['TRAIN_PROCESSOR_1_KEY'], 1000, 1000)
        
        with open(self.remote_config_path, 'w') as f:
            json.dump(remote_config, f, indent=4)


def extend_instance():
    remoteResGInstance().extend() 
        