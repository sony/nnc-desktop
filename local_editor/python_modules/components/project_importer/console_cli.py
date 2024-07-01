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
import re

from conf import settings
from components.project_importer.exceptions import ImportProjectError
from utils.request_runner import run_console_cli

class ConsoleCli:
    def __init__(self):
        pass

    @classmethod
    def _exclude_error_msg(cls, tb_msg):
        m = re.match(r'.*\n(\S+:\s*.*)$', tb_msg, re.M | re.S)
        if m:
            return m.groups()[0].rstrip('\r\n')
        return 'Unknown error'

    @classmethod
    def convert(cls, input_path: str, output_path: str):
        cmd = ['console_cli', 'convert', input_path, output_path]
        res = run_console_cli(cmd)
        if not os.path.exists(output_path):
            raise ImportProjectError(cls._exclude_error_msg(res))
