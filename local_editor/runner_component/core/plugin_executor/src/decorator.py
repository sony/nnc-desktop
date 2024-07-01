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

from src.my_logger import get_logger

logger = get_logger()


def trace(func):
    def wrapper(*args, **kwargs):
        logger.debug('[ENTER] {}'.format(func.__name__))
        logger.debug('positional arguments: {}'.format(args))
        logger.debug('keyword arguments: {}'.format(kwargs))
        result = func(*args, **kwargs)
        logger.debug('result: {}'.format(result))
        logger.debug('[EXIT] {}'.format(func.__name__))
        return result
    return wrapper
