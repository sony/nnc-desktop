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
import inspect
import logging
from enum import Enum
from datetime import datetime
from uuid import uuid4

LOGGER_NAME = 'dataset_to_cache_and_page'


class Code(Enum):
    I_DEFAULT = '20008000'
    E_DEFAULT = '50018999'
    E_NNCD_ARGS_ERROR = '50018101'
    E_NNCD_STATUS_ERROR = '50018102'
    E_NNCD_NNABLA_ERROR = '50018104'
    E_DATASET_NOT_FOUND = '40018901'
    E_DATASET_EMPTY = '40018902'
    E_DATASET_HEADER_ONLY = '40018903'
    E_DATASET_NOT_FOUND_INPUT_DATA_FILE = '40018904'
    E_DATASET_INVALID_COLUMN_DATA = '40018905'
    E_DATASET_INVALID_STRING_DATA = '40018906'
    E_DATASET_INCLUDE_NULL_DATA = '40018907'
    E_DATASET_INVALID_FORMAT = '40018908'
    E_DATASET_INCLUDE_STRING_DATA_TO_INPUT_CSV = '40018909'


class BaseError(Exception):
    """Base class for this module exceptions
    """

    def __init__(self, message: str, code: str):
        super().__init__(message)
        self.code = code.value if isinstance(code, Code) else code


class Logger():
    """Logger for dataset_convert_to_cache_and_page"""

    def __init__(self):
        self.init_time = datetime.utcnow().timestamp()
        self.default_params = {}

        self.logger = logging.getLogger(LOGGER_NAME)
        handler = logging.StreamHandler()
        handler.setFormatter(logging.Formatter())
        self.logger.addHandler(handler)

        loglevel = os.environ.get('LOG_LEVEL', "INFO").lower()
        if loglevel == 'debug':
            self.logger.setLevel(logging.DEBUG)
        elif loglevel == 'info':
            self.logger.setLevel(logging.INFO)
        elif loglevel == 'warning':
            self.logger.setLevel(logging.WARNING)
        elif loglevel == 'error':
            self.logger.setLevel(logging.ERROR)
        else:
            self.logger.setLevel(logging.CRITICAL)
    
    def start_request(self):
        """call when processing is accepted"""
        self.init_time = datetime.utcnow().timestamp()
        self.request_id = str(uuid4())
        self.default_params.update({'requestID': self.request_id})
    
    def _log(self, level: int, message: str, **kwargs):
        log_record = kwargs
        log_record.update(self.default_params)

        now = datetime.utcnow()
        ds = now.isoformat()

        # call from logger.debug -> logger._log go though 2 layers
        call_frame = inspect.stack()[2]

        log_record.update({
            'level': logging.getLevelName(level).lower(),
            'message': message,
            'file': call_frame.filename,
            'line': call_frame.lineno,
            'func': call_frame.function,

            # Time format should be aligned with confluence definition
            'time': ds[:23] + 'Z' if '.' in ds else ds + '.000Z',
            
            # unit: sec, accuracy: msec
            # The accuracy of msec is a batch process in the first place,
            # It doesn't seem meaningful just to improve accuracy 
            'duration': round((now.timestamp() -self.init_time), 3)
        })
        if 'code' not in log_record:
            if level in [logging.INFO, logging.DEBUG]:
                log_record['code'] = Code.I_DEFAULT.value
            else:
                log_record['code'] = Code.E_DEFAULT.value
        elif isinstance(log_record['code'], Code):
            log_record['code'] = log_record['code'].value
        
        self.logger.log(level, log_record)

    def debug(self, message: str, **kwargs):
        self._log(logging.DEBUG, message, **kwargs)

    def info(self, message: str, **kwargs):
        self._log(logging.INFO, message, **kwargs)

    def warning(self, message: str, **kwargs):
        self._log(logging.WARNING, message, **kwargs)

    def error(self, message: str, **kwargs):
        self._log(logging.ERROR, message, **kwargs)
