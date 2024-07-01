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
プロジェクトで定義されているエラーコードのルールに従う
"""

from enum import Enum

from typing import Optional


class CODE(Enum):
    """Error code.
    TODO 内容については別途検討&必要なものを追加
    """
    NNCD_DEBUG = '20004000'

    NNCD_BATCH_INTERNAL_SERVER_ERROR = '50019160'


def error_code_to_status_code(code: CODE) -> Optional[int]:
    """Get the http response code by error code."""
    if code is None:
        return None
    return int(int(code.value) / 100000)
