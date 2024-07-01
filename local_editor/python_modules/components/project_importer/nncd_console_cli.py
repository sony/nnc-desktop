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
import subprocess

from conf import settings
from components.project_importer.exceptions import ImportProjectError


class NNcdConsoleCli:
    def __init__(self):
        pass

    @classmethod
    def _exclude_error_msg(cls, tb_msg):
        m = re.match(r'.*\n(\S+:\s*.*)$', tb_msg, re.M | re.S)
        if m:
            return m.groups()[0].rstrip('\r\n')
        return 'Unknown error'

    @classmethod
    def import_nntxt(cls, input_path: str, output_path: str):
        cmd = settings.NNCD_CONSOLE_CLI_UTIL + [ 'import_nntxt',
            '-i', input_path, '-o', output_path]
        res = subprocess.run(" ".join(cmd), shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        if not os.path.exists(output_path):
            msg = res.stderr.decode("utf-8")
            raise ImportProjectError(cls._exclude_error_msg(msg))

    @classmethod
    def import_caffe(cls, input_path: str, output_path: str):
        cmd = settings.NNCD_CONSOLE_CLI_UTIL + ['import_caffe',
            '-i', input_path, '-e', 'NNabla', '-o', output_path]
        res = subprocess.run(" ".join(cmd), shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        if not os.path.exists(output_path):
            msg = res.stderr.decode("utf-8")
            raise ImportProjectError(cls._exclude_error_msg(msg))
