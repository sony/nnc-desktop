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
import tempfile
import subprocess
from flask import request

from conf import settings
from utils.exception import NNcdException, CODE


def export_network():
    configuration = request.json.get('configuration').encode('utf-8')
    export_type = request.json.get("type")

    tmpdir = tempfile.TemporaryDirectory()
    input_filename = os.path.join(tmpdir.name, 'input.txt')
    output_filename = os.path.join(tmpdir.name, 'output.txt')
    error_filename = os.path.join(tmpdir.name, 'error.txt')

    cmd = settings.NNCD_CONSOLE_CLI_UTIL.copy()
    if export_type =='nnabla':
        cmd += ['export_python_code']
    elif export_type == 'caffe':
        cmd += ['export_caffe', '-l', error_filename]
    with open(input_filename, 'wb') as f:
        f.write(configuration)
    
    cmd += ['-i', input_filename, '-o', output_filename]
    subprocess.run(" ".join(cmd), shell=True, stdout=subprocess.PIPE)
    error = b''
    if os.path.exists(output_filename):
        with open(output_filename, 'rb') as f:
            output = f.read()
    else:
        raise NNcdException(CODE.NNCD_BAD_CONFIGURATION_DATA, 'This configration is invalid.')
    if os.path.exists(error_filename) and export_type == 'caffe':
        with open(error_filename, 'rb') as f:
            error = f.read()
    tmpdir.cleanup()
    return{
        'configuration': output.decode('utf-8'),
        'error': error.decode('utf-8')
    }