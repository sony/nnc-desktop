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
"""
ユーザー定義の例外は妥当な理由がない限り増やさない
例外は基本的にNNcdExceptionを使用し、原因等はerror_codeによって示す
"""

import inspect
from typing import Union, Dict

from .errors import CODE


class NNcdException(Exception):
    """
    共通例外クラス
    """
    def __init__(self, error_code: CODE, msg: Union[Exception, str] = None):
        super().__init__(msg)
        self.error_code: CODE = error_code

        frame = inspect.currentframe().f_back
        self.cause_file_name: str = frame.f_code.co_filename
        self.cause_func_name: str = frame.f_code.co_name
        self.cause_line_no: str = frame.f_lineno


class Redirect(Exception):
    def __init__(self, location: str, headers: Dict):
        self.location = location
        self.headers = headers
