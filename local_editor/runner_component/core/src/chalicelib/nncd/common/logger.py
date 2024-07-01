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

# -*- coding: utf-8 -*-
"""Logger module."""

import datetime
import json
import os
import traceback
import uuid
from enum import Enum
from functools import wraps

from .errors import CODE


class MsgHttpStsCode(Enum):
    """
    HTTP Status Code別ログ文字列
    """
    SCODE_200 = 'Success'
    SCODE_400 = 'Bad Request'
    SCODE_403 = 'Forbidden'
    SCODE_500 = 'Server Error'


class MsgLogLevel(Enum):
    """
    Log Level別ログ文字列
    """
    LEVEL_0 = '0'
    LEVEL_1 = '1'


class MsgComponentId(Enum):
    """
    Component ID別ログ文字列
    """
    COMP_1 = 'GUI (Client JS)'
    COMP_2 = 'Editor (Client JS)'
    COMP_3 = 'Dashboard(Client JS)'
    COMP_4 = 'Core'
    COMP_5 = 'Broker'
    COMP_6 = 'Woker'
    COMP_7 = 'MetaUpdator'
    COMP_9 = 'BillBatch'


class MsgErrorFactor(Enum):
    """
    Error Factor別ログ文字列
    """
    FACT_0 = 'None'
    FACT_1 = 'NNcd'
    FACT_2 = 'AWS'
    FACT_3 = 'M-DCIM'
    FACT_4 = 'corelib'
    FACT_5 = 'BSS'
    FACT_6 = 'SonyPayment'
    FACT_7 = 'ABCI'
    FACT_8 = 'Google'


class NNcdLogger(object):
    """
    Logger for NNcd.
    """

    @staticmethod
    def debuglog(func):
        @wraps(func)
        def inner(self, *args, **kwargs):
            NNcdLogger.debug(message=f'[START] func:{func.__qualname__}, args:{args}, kwargs:{kwargs}')
            result = func(self, *args, **kwargs)
            NNcdLogger.debug(message=f'[END] func:{func.__qualname__}')
            return result
        return inner

    @staticmethod
    def get_log_level() -> str:
        return os.environ.get('LOG_LEVEL', '0')

    @staticmethod
    def should_output_debug_log() -> bool:
        return NNcdLogger.get_log_level() == MsgLogLevel.LEVEL_0.value

    @staticmethod
    def generate_transaction_id() -> str:

        transaction_id: str = ''
        try:
            transaction_id = str(uuid.uuid4())
        except Exception:
            # ログ用途なので問題発生しても何もせず空を返すだけ
            pass

        return transaction_id

    @staticmethod
    def __get_level_string(code: str) -> str:
        if not code:
            return ''
        return MsgLogLevel[f'LEVEL_{code[3]}'].value

    @staticmethod
    def __create_message(code: str, opt_msg: str = '') -> str:
        """
        Create message by error code.
        """

        if not code or code == CODE.NNCD_DEBUG.value or len(code) != 8:
            return opt_msg

        msg_s_code: str = MsgHttpStsCode[f'SCODE_{code[0:3]}'].value
        msg_log_level: str = MsgLogLevel[f'LEVEL_{code[3]}'].value
        msg_comp_id: str = MsgComponentId[f'COMP_{code[4]}'].value
        msg_e_factor: str = MsgErrorFactor[f'FACT_{code[5]}'].value

        msg_obj: {} = {
            'Code': msg_s_code,
            'Level': msg_log_level,
            'Component': msg_comp_id,
            'Factor': msg_e_factor,
            'OptMsg': opt_msg,
            'StackTrace': traceback.format_exc()
        }
        return json.dumps(msg_obj)

    @staticmethod
    def __get_current_datetime_string() -> str:
        fmt: str = '%Y-%m-%dT%H:%M:%S.%fZ'
        now = datetime.datetime.now()
        return now.strftime(fmt)

    @staticmethod
    def debug(
        *,
        message: str = '',
        duration: str = '',
        session_id: str = '',
        transaction_id: str = '',
        request_id: str = '',
        user_id: str = '',
        action: str = ''
    ):
        NNcdLogger.output(
            code=CODE.NNCD_DEBUG.value,
            message=message,
            duration=duration,
            session_id=session_id,
            transaction_id=transaction_id,
            request_id=request_id,
            user_id=user_id,
            action=action,
            level=MsgLogLevel.LEVEL_0.value
        )

    @staticmethod
    def error(
        *,
        message: str = '',
        duration: str = '',
        session_id: str = '',
        transaction_id: str = '',
        request_id: str = '',
        user_id: str = '',
        action: str = ''
    ):
        NNcdLogger.output(
            code=CODE.NNCD_DEBUG.value,
            message=message,
            duration=duration,
            session_id=session_id,
            transaction_id=transaction_id,
            request_id=request_id,
            user_id=user_id,
            action=action,
            level=MsgLogLevel.LEVEL_1.value
        )

    @staticmethod
    def output(
        *,
        ip: str = '',
        code: str = '',
        message: str = '',
        func: str = '',
        file: str = '',
        line: str = '',
        duration: str = '',
        session_id: str = '',
        transaction_id: str = '',
        request_id: str = '',
        user_id: str = '',
        user_agent: str = '',
        action: str = '',
        level: str = ''
    ) -> None:
        """
        Output log.
        """
        try:
            time: str = NNcdLogger.__get_current_datetime_string()
            message: str = NNcdLogger.__create_message(code, message)
            if not level:
                level = NNcdLogger.__get_level_string(code)

            if level == MsgLogLevel.LEVEL_0.value and not NNcdLogger.should_output_debug_log():
                return

            log_dict: {} = {
                'time': time,
                'level': level,
                'ip': ip,
                'code': code,
                'message': message,
                'func': func,
                'file': file,
                'line': line,
                'duration': duration,
                'sessionID': session_id,
                'transactionID': transaction_id,
                'requestID': request_id,
                'userID': user_id,
                'userAgent': user_agent,
                'action': action
            }

            print(json.dumps(log_dict))
        except Exception as e:
            """
            ログ出力時に例外が発生した場合、簡易ログを出力して処理は続行する。
            TODO 暫定措置、要検討
            """
            print(f'Cause error at log output. message = {e}')
