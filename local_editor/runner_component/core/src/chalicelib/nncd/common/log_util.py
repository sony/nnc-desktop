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

MAX_STR_LEN = 1024


def to_short_log_message(obj: dict):
    """ clip too long text in log message """
    if isinstance(obj, dict):
        new_dict = dict()
        for k, v in obj.items():
            new_dict[k] = to_short_log_message(v)
        return new_dict
    if isinstance(obj, list):
        new_list = list()
        for v in obj:
            new_list.append(to_short_log_message(v))
        return new_list
    if isinstance(obj, str) and len(obj) > MAX_STR_LEN:
        return obj[:MAX_STR_LEN] + f'...(len={len(obj)})'
    return obj
