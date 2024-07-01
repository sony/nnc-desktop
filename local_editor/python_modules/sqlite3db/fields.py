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

import peewee as pw


class Sqlite3Database(pw.SqliteDatabase):

    field_types = {
        "TINYINT": "INTEGER",
        "MEDIUMTEXT": "TEXT",
        "TINYAUTO": "INTEGER",
        "DATETIME AUTO_UPDATE": "DATETIME",
        "ENUM": "INTEGER",
        "UTCTIME": "DATETIME"
    }

    def __init__(self, database, *args, **kwargs):
        kwargs["field_types"] = self.field_types
        super(Sqlite3Database, self).__init__(database, *args, **kwargs)

# ######################################
# #######   Custom Fields  #############
# ######################################


class TinyIntegerField(pw.IntegerField):
    """Correspond with MySQL tinyint field"""
    field_type = "TINYINT"


class MediumTextField(pw.TextField):
    """Correspond with MySQL mediumtext field"""
    field_type = "MEDIUMTEXT"


class TinyAutoField(pw.AutoField):
    """Correspond with MySQL primary key of tinyint field"""
    field_type = "TINYAUTO"


class EnumField(pw.IntegerField):
    """the first option of every choice must be integer type"""
    field_type = "ENUM"

    def db_value(self, value):
        enum = {choice[1]: choice[0] for choice in self.choices}
        return enum.get(value, enum.get(self.default))

    def python_value(self, value):
        enum = {choice[0]: choice[1] for choice in self.choices}

        # for group_concat results
        if isinstance(value, str):
            value_list = value.split(",")
            result = []
            for value_str in value_list:
                result.append(enum.get(int(value_str), enum.get(self.default)))
            return result

        return enum.get(value, enum.get(self.default))


class UpdateDateTimeField(pw.DateTimeField):
    """The purpose is to automatically update the time"""
    field_type = "DATETIME AUTO_UPDATE"
