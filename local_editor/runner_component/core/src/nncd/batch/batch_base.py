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

import traceback
import uuid
from abc import abstractmethod
from datetime import datetime

from chalicelib.nncd.common.errors import CODE
from chalicelib.nncd.common.exceptions import NNcdException
from chalicelib.nncd.common.logger import NNcdLogger


class BatchBase(object):
    def __init__(self):
        self._start_timestamp = datetime.utcnow()
        self._transaction_id = str(uuid.uuid4())

    @abstractmethod
    def do(self):
        pass

    def run(self):
        NNcdLogger.debug(message='ENTER run')
        try:
            self.do()
            return True
        except NNcdException as e:
            print(traceback.format_exc())
            self._print_error_log(e)
            raise
        except Exception as e:
            print(traceback.format_exc())
            self._print_error_log(e)
            raise
        finally:
            NNcdLogger.debug(message='EXIT run')
        return False

    @classmethod
    def _get_current_timestamp(cls):
        return datetime.utcnow()

    def _print_error_log(self, e):
        """
        例外時のログを出力します。
        """
        ip: str = ''
        duration: str = str(self._get_current_timestamp() - self._start_timestamp)
        session_id: str = ''
        user_agent: str = ''
        http_method: str = ''
        path: str = ''
        action: str = f'{http_method} {path}'
        message = str(e) if str(e) != "None" else ""
        user_id: str = ''

        inspection_data: {} = self._get_error_inspection_data(e)

        NNcdLogger.output(
            ip=ip,
            code=inspection_data.get('code'),
            func=inspection_data.get('func'),
            file=inspection_data.get('f_name'),
            line=inspection_data.get('line'),
            duration=duration,
            session_id=session_id,
            transaction_id=self._transaction_id,
            request_id="",
            user_id=user_id,
            user_agent=user_agent,
            action=action,
            message=message
        )

    @staticmethod
    def _get_error_inspection_data(e: Exception):
        code: str = CODE.NNCD_BATCH_INTERNAL_SERVER_ERROR.value
        func: str = ''
        f_name: str = ''
        line: str = ''
        if isinstance(e, NNcdException):
            code = e.error_code.value
            func = e.cause_func_name
            f_name = e.cause_file_name
            line = e.cause_line_no

        return {'code': code, 'func': func, 'f_name': f_name, 'line': line}
