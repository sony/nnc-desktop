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
import logging
import traceback
import subprocess
import traceback
from pathlib import Path
from nnabla.utils import image_utils

from src.json_formatter import JsonFormatter
from src.decorator import trace
from src.my_logger import get_logger

logger = get_logger()
logger.setLevel(os.environ.get('LOG_LEVEL', logging.DEBUG))

RESULT_DIR = os.path.join(os.path.expanduser("~"), "nncd_bucket")
PROJECTS_DIR = os.path.join(RESULT_DIR, "nncd-projects-rdc")


@trace
def to_png_if_need(file_path: str) -> str:
    root, ext = os.path.splitext(file_path)
    if ext != '.dcm':
        return file_path
    # convert dicom to png
    image_utils.set_backend('DICOM')
    img = image_utils.imread(file_path)
    image_path = root + '.png'
    image_utils.imsave(image_path, img)
    return image_path


@trace
def handle_input_parameter(parameter: dict):
    """handle input parameter and return file suffix"""
    if not parameter['value'].startswith(RESULT_DIR):
        return
    # convert dicom to png
    parameter['value'] = to_png_if_need(parameter['value'])


@trace
def preprocess_parameters(parameters: list):
    suffix = None
    for parameter in parameters:
        if parameter.get('direction') == "input":
            handle_input_parameter(parameter)



def run_script(path: str, parameters: dict, log_file_path: str):
    command = [sys.executable, "-B", os.path.join(PROJECTS_DIR, path)]
    for parameter in parameters:
        if parameter['format'] == 'bool' and parameter['value'].lower == 'false':
            continue
        command.append(parameter['name'])
        if parameter['format'] == 'bool':
            continue
        command.append(parameter['value'])
    
    logger.debug(' '.join(command))
    with open(log_file_path, 'wb') as f:
        p = subprocess.run(
            command,
            stdout=f,
            stderr=f,
            shell= sys.platform == 'win32' # parameter value might contains single quote or double quote on win
        )
    return p.returncode


def main(event: str):
    """
    event: {
        'script_path': '~/nncd_bucket/xxxxx/lime.py',
        'log_file_path': '~/nncd_ucket/xxxxxx/plugin_log.txt',
        'parameters': [
            {
                'name': '-m',
                'value': 's3://xxx/xxxx/result.nnp',
                'direction': 'input'
            },
            {
                'name': '-i',
                'value': 's3://xxx/xxxx/4.png',
                'direction': 'input'
            },
            {
                'name': '-c',
                'value': '0',
                'direction': 'input'
            },
            {
                'name': '-n',
                'value': '100',
                'direction': 'input'
            },
            {
                'name': '-o',
                'value': 'lime.png',
                'direction': 'output'
            }
        ]
    }
    """
    event = json.loads(event)

    local_file_path = event['log_file_path']
    script_path = event['script_path']
    parameters = event.get("parameters", [])

    for handler in logging.getLogger().handlers:
        handler.setFormatter(JsonFormatter(event=event))
    
    if not Path(local_file_path).exists():
        Path(local_file_path).touch()
    
    try:
        # Pre-process based on parameters
        preprocess_parameters(parameters)

        # Run the plugin script
        return_code = run_script(script_path, parameters, local_file_path)
        logger.debug("return code {}".format(return_code))

    except Exception:
        print(traceback.format_exc())
        with open(local_file_path, 'a') as f:
            f.write(traceback.format_exc())

    return {
        "statusCode": 200,
        "body": json.dumps({}),
    }
