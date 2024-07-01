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
import json
import logging.config
from flask import request

from utils.logger import NNcdLogger
from utils.exception import CODE
from conf.settings import LOG_DIR

LOGGING_CONFIG = {
    "version": 1,
    "formatters": {
        "simple": {
            "format": '%(asctime)s [ERROR]: %(message)s'
        }
    },
    "filters": {},
    "handlers": {
        "error_log_to_file": {
            "level": "ERROR",
            "class": "logging.handlers.RotatingFileHandler",
            "formatter": "simple",
            "filename": os.path.join(LOG_DIR, 'request_error.log'),
            "maxBytes": 1024 * 1024 * 5,
            "backupCount": 5,
            "encoding": "utf-8"
        }
    },
    "loggers": {
        "request_error_log": {
            "handlers": ["error_log_to_file"],
            "level": "ERROR"
        }
    }
}
logging.config.dictConfig(LOGGING_CONFIG)
request_error_logger = logging.getLogger("request_error_log")

def post_log():
    message = {
        'page_url': request.json.get('page_url', ''),
        'api_url': request.json.get('api_url', ''),
        'method': request.json.get('method', ''),
        'error': request.json.get('error', ''),
        'message': request.json.get('message', ''),
        'user_id': request.json.get('user_id', '')
    }
    NNcdLogger.output(
        code=CODE.NNCD_INFO.value,
        func='',
        file='',
        line='',
        transaction_id=NNcdLogger.generate_transaction_id(),
        action=f'{request.method} {request.url}',
        message=message
    )
    request_error_logger.error(json.dumps(message))

    return {}