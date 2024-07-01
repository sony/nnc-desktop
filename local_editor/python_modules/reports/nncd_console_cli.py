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
import subprocess
from conf import settings


class NNcdConsleCli:

    def complete(self, input_path: str, output_path: str):
        cmd  = settings.NNCD_CONSOLE_CLI_UTIL + ['complete', "-i", input_path, "-o", output_path]
        ret = subprocess.run(" ".join(cmd), shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        if not os.path.exists(output_path):
            msg = ret.stderr.decode('utf-8')
            raise Exception(msg)