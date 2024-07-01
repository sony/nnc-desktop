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

import re
from typing import Optional
from peewee import SqliteDatabase
from sqlite3db.models import Jobs

class SqlCondition:
    @classmethod
    def convert(cls, cond_text):
        """convert to sql statement
        from
        y' not in (1, 2, 3)
        to
        y'__1st not in ('1', '2', '3')
        """
        m = re.match('(.+) (=|not in) (.+)', cond_text)
        return " ".join([
            cls._to_col_name(m.group(1)),
            m.group(2),
            f'{cls._to_num_str(m.group(3))}'
        ])
    
    @classmethod
    def _to_col_name(cls, name: str):
        if name.endswith("'"):
            col_name = name + '__1st'
            return f'`{col_name}`'
        return f'`{name}`'
    
    @classmethod
    def _to_num_str(cls, values: str):
        m = re.match('\\((.+)\\)', values)
        if m is None:
            return f'"{values.strip()}"'
        num_str = ','.join([f'"{x.strip()}"' for x in m.group(1).split(',')])
        return f'({num_str})'


class SqlOrderBy:
    @classmethod
    def convert(cls, order_text):
        """convert to sql order by
        from
        y'__1st asc
        to
        cast(`y'__1st` as real) asc
        """
        col_name, order = cls._parse_col_name_and_order(order_text)
        return f'cast(`{col_name}` as real) {order}'

    @classmethod
    def _parse_col_name_and_order(cls, name):
        m = re.match(r'\A([^ ]+)( (?:asc|desc))?\Z', name)
        if m is None:
            raise Exception('invalid order schema.')
        return m.group(1), m.group(2) or 'asc'


class OutputResult:
    def __init__(self, file_path, offset: int, limit: int,
                 filter_text: Optional[str], sort_by:Optional[str]):
        self._file_path: str = file_path
        self._offset: int = offset
        self._limit: int = limit
        self._filter_text: Optional[str] = self._to_sql_conditions(filter_text)
        self._sort_by: Optional[str] = self._to_sql_order_by(sort_by)
        self.header = None
        print(f'self._filter_text = {self._filter_text}')

    @classmethod
    def to_db_file_name(cls, label_name: str, job_type: str=Jobs._meta.EVALUATE) ->str:
        left_l = label_name.split(' - ')[0]
        if job_type == Jobs._meta.EVALUATE:
            return f'{left_l}_output_result.db'
        else:
            return f'{left_l}_infer_result.db'

    @classmethod
    def verify_filter_text(cls, filter_text: str) -> bool:
        if not filter_text:
            return True
        m = re.match('(.+) and (.+)', filter_text)
        if not m:
            return False
        try:
            SqlCondition.convert(m.group(1))
            SqlCondition.convert(m.group(2))
        except Exception:
            return False
        return True

    def result(self):
        db = SqliteDatabase(self._file_path)
        stmt = 'SELECT * From outputs'
        if self._filter_text:
            stmt += f' Where {self._filter_text}'
        if self._sort_by:
            stmt += f' ORDER BY {self._sort_by}'
        stmt += ' LIMIT ? OFFSET ?'
        try:
            cursor = db.execute_sql(stmt, (self._limit, self._offset))
            self.header = [x[0] for x in cursor.description]
            result = cursor.fetchall()
            db.close()
            return result
        except Exception:
            print(f'Failed to query stmt={stmt}')

    def get_total(self) -> int:
        db = SqliteDatabase(self._file_path)
        total_stmt = 'SELECT COUNT(*) FROM outputs'
        if self._filter_text:
            total_stmt += f' WHERE {self._filter_text}'
        cursor = db.execute_sql(total_stmt)
        result = cursor.fetchone()[0]
        db.close()
        return result

    @classmethod
    def _to_sql_conditions(cls, filter_text: str) ->str:
        if not filter_text:
            return None
        m = re.match('(.+) and (.+)', filter_text)
        return ' and '.join([
            SqlCondition.convert(m.group(1)),
            SqlCondition.convert(m.group(2)),
        ])
    
    @classmethod
    def _to_sql_order_by(cls, order_text: str) -> str:
        if not order_text:
            return None
        return SqlOrderBy.convert(order_text)
