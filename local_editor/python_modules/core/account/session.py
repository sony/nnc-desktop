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


def check_session(user_id: str):
    return {
        'id_privider': 'sony',
        'urls': {
            'dashboard': {'account_settings': '', 'signin': ''},
            'abci': {'account_settings': '', 'signin': ''},
            'download': {'account_settings': '', 'signin': ''},
            'top': {'account_settings': '', 'signin': ''},
            'webview': {'account_settings': '', 'signin': ''},
        }
    }
