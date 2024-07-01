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

_js_escapes = {
    ord('\\'): r'\u005C',
    ord('\''): r'\u0027',
    ord('"'): r'\u0022',
    ord('>'): r'\u003E',
    ord('<'): r'\u003C',
    ord('&'): r'\u0026',
    ord('='): r'\u003D',
    ord('-'): r'\u002D',
    ord(';'): r'\u003B',
    ord('\u2028'): r'\u2028',
    ord('\u2029'): r'\u2029'
}
# ASCII codes less than 32 are also escaped
_js_escapes.update({ord('%c' % x): r'\u%04X' % x for x in range(32)})


def escapejs(text: str) -> str:
    if type(text) is not str:
        text = str(text)
    return text.translate(_js_escapes)
