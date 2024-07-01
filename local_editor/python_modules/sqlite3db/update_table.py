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

# from sqlite3db import models
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sqlite3db = __import__('sqlite3db.models', globals(), locals())
models = sqlite3db.models

plugins = [
    {
        "owner_tenant_id": "ccbf15a0-bcb6-4ba6-b10e-27fc877c4348",
        "plugin_id": "7de3c778-849b-48bf-8fb5-3956fd22f98f",
        "plugin_name": "Grad-CAM",
        "plugin_file": 'plugins/ccbf15a0-bcb6-4ba6-b10e-27fc877c4348/gradcam.py',
        "description": (
            "Grad-CAM: Visual Explanations from Deep Networks via Gradient-based Localization\n"
            "Ramprasaath R. Selvaraju, Michael Cogswell, Abhishek Das, Ramakrishna Vedantam, Devi Parikh, Dhruv Batra\n"
            "https://arxiv.org/abs/1610.02391\n"
        ),
        "parameters": [
            {
                "name": "model",
                "direction": "input",
                "description": "path to model nnp file (model)",
                "format": "path",
                "default": "result.nnp",
                "readonly": True
            },
            {
                "name": "image",
                "direction": "input",
                "description": "point to input image file (image)",
                "format": "select"
            },
            {
                "name": "class_index",
                "direction": "input",
                "description": "class index to visualize (int)",
                "format": "int",
                "default": "0"
            },
            {
                "name": "output",
                "direction": "output",
                "description": "path to output image file (image)",
                "format": "path",
                "default": "grad_cam"
            }
        ]
    },
    {
        "owner_tenant_id": "ccbf15a0-bcb6-4ba6-b10e-27fc877c4348",
        "plugin_id": "4d84478a-752a-4fb3-abc1-3e21088274ce",
        "plugin_name": "LIME",
        "plugin_file": 'plugins/ccbf15a0-bcb6-4ba6-b10e-27fc877c4348/lime.py',
        "description": (
            '"Why Should I Trust You?": Explaining the Predictions of Any Classifier '
            'Marco Tulio Ribeiro, Sameer Singh, Carlos Guestrin '
            'https://arxiv.org/abs/1602.04938\n'
        ),
        "parameters": [
            {
                "name": "model",
                "direction": "input",
                "description": "path to model nnp file (model)",
                "format": "path",
                "default": "result.nnp",
                "readonly": True
            },
            {
                "name": "image",
                "direction": "input",
                "description": "point to input image file (image)",
                "format": "select"
            },
            {
                "name": "class_index",
                "direction": "input",
                "description": "class index to visualize (int)",
                "format": "int",
                "default": "0"
            },
            {
                "name": "num_samples",
                "direction": "input",
                "description": "number of samples N (int)",
                "format": "int",
                "default": "1000"
            },
            {
                "name": "num_segments",
                "direction": "input",
                "description": "number of segments (int)",
                "format": "int",
                "default": "10"
            },
            {
                "name": "num_segments_2",
                "direction": "input",
                "description": "number of segments to highlight (int)",
                "format": "int",
                "default": "3"
            },
            {
                "name": "output",
                "direction": "output",
                "description": "path to output image file (image)",
                "format": "path",
                "default": "lime"
            }
        ]
    }
]


def add_plugins():
    """add plugins table."""
    table = getattr(models, 'Plugins')
    
    if not table.table_exists():
        table.create_table()
    for plugin in plugins:
        query = table.select().where(table.plugin_id == plugin["plugin_id"])
        if not query.exists():
            table.insert(**plugin).execute()


def add_local_instances():
    """add local_instances table."""
    table = getattr(models, 'LocalInstances')
    if table.table_exists():
        table.drop_table()
    table.create_table()

    # add gpu record
    gpu_count = int(os.environ.get("GPU_COUNT", 0))        
    if gpu_count == 0:
        description = {"en-US": "Host CPU x 1", "ja-JP": "Host CPU x 1"}
    else:
        description = {"en-US": f"Host GPU x {gpu_count}", "ja-JP": f"Host GPU x {gpu_count}"}
    table.insert({
        'gpu_count': gpu_count,
        "available": True,
        "description": description,
        "priority": 0,
        "provider": 'local'}).execute()


def add_job_remote_job():
    """add job_remote_job table."""
    table = getattr(models, 'JobRemoteJob')
    if not table.table_exists():
        table.create_table()


def main():
    # v0.2.3 --> v1.0.1
    add_plugins()
    add_local_instances()
    add_job_remote_job()


if __name__ == "__main__":
    main()
