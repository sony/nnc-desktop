#! /usr/bin/env python3
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


import sys
import json
from configparser import ConfigParser

result_ini = ConfigParser()
result_ini.optionxform = str
result_ini.read(sys.argv[1])
config = {}
for name, value in result_ini.items('statistics'):
  config[name] = int(value)
print(json.dumps(config))
