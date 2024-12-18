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

import csv
from logging import getLogger

from chalicelib.nncd.core.common import consts

logger = getLogger(__name__)


class CsvReader(object):
    def __init__(self, csv_file):
        self.csv_file = csv_file
        self.remaining_data = ''

    def read_rows(self, skip_header=True):
        # CSVの列をリスト形式にして行単位で返すイテラブルなオブジェクトを返す
        offset = 0
        file_size = self.csv_file.get_content_length()
        if file_size is None:
            return
        first_row = True

        while True:
            logger.info(f'#### read = offset{offset}, limit={consts.OBJECT_RANGE_SIZE}')
            #
            read_data = self.csv_file.get_partial_data(offset, consts.OBJECT_RANGE_SIZE)
            if read_data is None:
                return
            rows = (self.remaining_data + read_data.decode('utf-8')).splitlines(True)
            if offset + len(read_data) < file_size:
                if self._is_last_char_line_break(rows[-1]):
                    self.remaining_data = ''
                else:
                    self.remaining_data = rows.pop()

            for row in rows:
                row = self._trim_line_break(row)
                if first_row and skip_header:
                    first_row = False
                    continue
                if row is None or len(row) == 0:
                    continue
                yield next(csv.reader([row]))

            if file_size <= offset + len(read_data):
                break

            # 次のrangeを設定
            offset += len(read_data)

    @classmethod
    def _is_last_char_line_break(cls, text):
        return text[-1] == '\n' if len(text) > 0 else False

    @classmethod
    def _trim_line_break(cls, text):
        return text.splitlines()[0]
