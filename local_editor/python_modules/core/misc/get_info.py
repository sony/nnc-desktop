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

import time
from flask import request


def get_info():
    what_text = request.args.get("what_text", '')
    # locale = request.args.get("locale", '')
    # country = request.args.get("country", '')
    
    if what_text == 'announce':
        return {"text": '<div></div>'}
    elif what_text == 'maintenance':
        return {
            'maintenance': {},
            'current_unix_time': time.time()
        }
    else:
        raise Exception("Invalid text")