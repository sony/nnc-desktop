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


import inspect
from enum import Enum
from flask import jsonify
from typing import Optional, Union


class CODE(Enum):
    NNCD_INFO = '20014000'
    NNCD_DEBUG = '20004000'
    NNCD_BAD_REQUEST = '40014161'
    NNCD_STATUS_INCORRECT = '40014170'
    NNCD_CLASSIFICATION_MATRIX_NOT_FOUND = '40014171'
    NNCD_PLUGIN_RESULT_NOT_FOUND = '40014172'
    NNCD_PLUGIN_RESULT_EMPTY = '40014173'
    NNCD_BAD_DATASET_ID = '40014174'
    NNCD_JOB_DELETED = '40014180'
    NNCD_INDEX_OUT_OF_RANGE = '40014182'
    NNCD_BAD_CONFIGURATION_DATA = '40014184'
    NNCD_CONFIGURATION_EDITING = '40014192'
    NNCD_INTERNAL_SERVER_ERROR = '50014160'
    NNCD_DATASET_CACHE_NOT_FOUND = '50014185'
    NNCD_BATCH_INTERNAL_SERVER_ERROR = '50019160'
    DOCKER_CPU_RUN_JOB_ERROR = '50080001'

    NNCD_NNCD_BAD_REQUEST = '40024001'


def error_code_to_status_code(code: CODE) ->Optional[int]:
    """Get the http response code by error code."""
    if code is None:
        return None
    return int(int(code.value) / 100000)


class NNcdException(Exception):

    def __init__(self, error_code: CODE, msg: Union[Exception, str] = None, payload=None):
        super().__init__(msg)
        self.error_code: CODE = error_code

        frame = inspect.currentframe().f_back
        self.cause_file_name: str = frame.f_code.co_filename
        self.cause_func_name: str = frame.f_code.co_name
        self.cause_line_no: str = frame.f_lineno


def handle_exception(error):
    if not isinstance(error, NNcdException):
        error = NNcdException(CODE.NNCD_INTERNAL_SERVER_ERROR, 'unexpected error')

    message = str(error) if str(error) != "None" else ""
    status_code = error_code_to_status_code(error.error_code) 
    if status_code is None:
        status_code = 500
    
    response = jsonify({
        'code': error.error_code.value,
        'error': error.error_code.name,
        'message': message
    })
    response.status_code = status_code
    response.headers['Content-Type'] = 'application/json'
    response.headers['X-Content-Type-Options'] = 'nosniff'
    return response