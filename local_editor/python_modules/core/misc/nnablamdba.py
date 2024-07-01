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

from flask import request
import subprocess
import tempfile
import os
from conf import settings


def nnablamdba():

    command = request.json.get("command")
    options = request.json.get("options")
    data = request.json.get('data')
    if data:
        data = data.encode("utf-8")
    cmd = settings.NNCD_CONSOLE_CLI_UTIL + [command]
    if options:
        for opt in options:
            val = options[opt]
            if isinstance(val, list):
                for v in val:
                    cmd.extend([str(opt), str(v)])
            else:
                cmd.extend([str(opt), str(val)])

    tmpdir = None
    output_filename = None
    if data:
        tmpdir = tempfile.TemporaryDirectory()
        input_filename = os.path.join(tmpdir.name, 'input.txt')
        output_filename = os.path.join(tmpdir.name, 'output.txt')
        with open(input_filename, "wb") as f:
            f.write(data)
        cmd.extend(['-i', input_filename, '-o', output_filename])
    out = subprocess.run(" ".join(cmd), shell=True, stdout=subprocess.PIPE).stdout

    if tmpdir:
        if os.path.exists(output_filename):
            with open(output_filename, "rb") as f:
                out = f.read()
        tmpdir.cleanup()

    return out.decode("utf-8")
