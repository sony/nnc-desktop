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
import platform
from os.path import expanduser
home = expanduser("~")

NNCD_VERSION = '0.2.1' # should be updated after test finished
RESULT_DIR = os.path.join(home, 'nncd_bucket')
INSTANCE_CONF_DIR = f"{os.getcwd()}/py/server/instance_config/nncd_cli"

NNCD_CONSOLE_CLI_UTIL_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "nncd_console")

if sys.platform == "win32":
    NNCD_CONSOLE_CLI_UTIL = ["cd", NNCD_CONSOLE_CLI_UTIL_PATH, "&&",
        os.path.join(NNCD_CONSOLE_CLI_UTIL_PATH, "nncd_console_cli_util.exe")]
elif sys.platform == "darwin":
    executable = './nncd_console_cli_util_mac' if platform.machine() == 'arm64' else './nncd_console_cli_util_mac_x86'
    NNCD_CONSOLE_CLI_UTIL = ["cd", f'"{NNCD_CONSOLE_CLI_UTIL_PATH}"',
        "&&", executable]
else:
    NNCD_CONSOLE_CLI_UTIL = ["cd", f'"{NNCD_CONSOLE_CLI_UTIL_PATH}"',  # double quotes for black space of path
        "&&", "./nncd_console_cli_util"]

LOG_DIR = os.path.join(RESULT_DIR, "log")
DB_DIR = os.path.join(RESULT_DIR, "db")
PROJECTS_DIR = os.path.join(RESULT_DIR, "nncd-projects-rdc")
DATASETS_DIR = os.path.join(RESULT_DIR, "nncd-datasets-rdc")
DATASET_CACHE_DIR = os.path.join(RESULT_DIR, "nncd-dataset-cache-rdc")
UPLOAD_DATASET_PATH = os.path.join(RESULT_DIR, 'datasets')

SERVER_PORT = os.environ.get("SERVER_PORT")
RUNNER_PORT = os.environ.get("RUNNER_PORT")
GPU_COUNT = int(os.environ.get("GPU_COUNT", 0))
MOUNT_DIR = os.environ.get("MOUNT_DIR", RESULT_DIR)
RUNNER_IMAGE_NAME = os.environ.get("RUNNER_IMAGE_NAME", f"nncd-runner:{NNCD_VERSION}")