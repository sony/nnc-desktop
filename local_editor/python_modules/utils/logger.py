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

import json
import uuid
import datetime
import traceback
from enum import Enum

from utils.exception import CODE


class MsgHttpStsCode(Enum):
    SCODE_200 = 'Success'
    SCODE_400 = 'Bad Request'
    SCODE_403 = 'Forbidden'
    SCODE_500 = 'Server Error'


class MsgLogLevel(Enum):
    LEVEL_0 = '0'
    LEVEL_1 = '1'


class MsgComponentId(Enum):
    COMP_1 = 'GUI (Client JS)'
    COMP_2 = 'Editor (Client JS)'
    COMP_3 = 'Dashboard (Client JS)'
    COMP_4 = 'Core'


class NNcdLogger(object):
    """
    Logger for NNcd.
    """

    @staticmethod
    def __get_current_datetime_string() -> str:
        fmt: str = r'%Y-%m-%dT%H:%M:%S.%fZ'
        now = datetime.datetime.now()
        return now.strftime(fmt)


    @staticmethod
    def __create_message(code: str, opt_msg: str = "") -> str:
        if not code or code == CODE.NNCD_DEBUG.value or len(code) != 8:
            return opt_msg
        
        msg_s_code: str = MsgHttpStsCode[f'SCODE_{code[0:3]}'].value
        msg_log_level: str = MsgLogLevel[f'LEVEL_{code[3]}'].value
        msg_comp_id: str = MsgComponentId[f'COMP_{code[4]}'].value
        
        msg_obj: dict= {
            'Code': msg_s_code,
            'Level': msg_log_level,
            'Component': msg_comp_id,
            'OptMsg': opt_msg,
            'StackTrace': traceback.format_exc()
        }
        return json.dumps(msg_obj)

    @staticmethod
    def __get_level_string(code: str) -> str:
        if not code:
            return ''
        return MsgLogLevel[f'LEVEL_{code[3]}'].value

    @staticmethod
    def generate_transaction_id() -> str:
        transaction_id: str = ''
        try:
            transaction_id = str(uuid.uuid4())
        except Exception:
            pass
        return transaction_id    

    @staticmethod
    def debug(
        *,
        message: str = '',
        transaction_id: str = '',
        request_id: str = '',
        action: str = '',
    ):
        NNcdLogger.output(
            code=CODE.NNCD_DEBUG.value,
            message=message,
            transaction_id=transaction_id,
            request_id=request_id,
            action=action,
            level=MsgLogLevel.LEVEL_0.value
        )

    @staticmethod
    def output(
        *,
        code: str = '',
        message: str = '',
        func: str = '',
        file: str = '',
        line: str = '',
        transaction_id: str = '',
        request_id: str = '',
        action: str = '',
        level: str = '',
    ) -> None:
        try:
            time : str = NNcdLogger.__get_current_datetime_string()
            message: str = NNcdLogger.__create_message(code, message)
            if not level:
                level = NNcdLogger.__get_level_string(code)
            
            log_dict: dict= {
                'time': time,
                'level': level,
                'code': code,
                'message': message,
                'func': func,
                'file': file,
                'line': line,
                'transactionID': transaction_id,
                'requestID': request_id,
                'action': action
            }
            print(json.dumps(log_dict))
        except Exception as e:
            print(f'Cause error at log output. message = {e}')
