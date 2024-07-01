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

import datetime
import peewee as pw

from utils.consts import consts

"""
    Import Databse
"""
db = pw.SqliteDatabase(
    database=consts.DB_PATH,
    pragmas={
        'journal_mode': "wal",
        'cache_size': -1 * 64000,
        'foreign_keys': 1,
        'ignore_check_constraints': 0,
        'synchronous': 1
    },
    field_types={
        "MEDIUMTEXT": "TEXT",
        "DATETIME_AUTO_UPDATE": "DATETIME",
        "ENUM": "INTEGER",
    }
)

"""
    The custom fields and choices to use for models
"""
DELETED_CHOICES = (
    (0, False),
    (1, True)
)

PURPOSE_CHOICES = (
    (0, "private"),
    (1, "share"),
    (2, "sample"),
    (3, "public")
)

USER_ROLE_CHOICES = (
    (0xc0007, "owner"),
    (0x40007, "admin"),
    (0x00007, "user"),
    (0x00005, "sample")
)

DATASET_STATUS_CHOICES = (
    (0, "none"),
    (1, "ready"),
    (2, "extracting"),
    (3, "failed"),
    (4, "completed"),
    (5, "copying")
)

DATASET_COPY_STATUS_CHOICES = (
    (1, "ready"),
    (2, "processing"),
    (3, "failed"),
    (4, "completed")
)

class MediumTextField(pw.TextField):
    """Correspond with MySQL mediumtext field"""
    field_type = "MEDIUMTEXT"


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
    field_type = "DATETIME_AUTO_UPDATE"


"""
    Models
"""
class BaseModel(pw.Model):
    update_datetime = UpdateDateTimeField(default=datetime.datetime.utcnow)
    create_datetime = pw.DateTimeField(default=datetime.datetime.utcnow)

    @classmethod
    def update(cls, __data=None, **update):
        for key in cls.__dict__:
            field_obj = getattr(cls, key, None)
            if field_obj and isinstance(field_obj, UpdateDateTimeField):
                update.update({key: datetime.datetime.utcnow()})
        return pw.ModelUpdate(cls, cls._normalize_data(__data, update))

    class Meta:
        database = db
        legacy_table_names = False


class Tenants(BaseModel):
    tenant_id = pw.CharField(max_length=36, primary_key=True)
    name = pw.CharField(max_length=255)
    purpose = EnumField(choices=PURPOSE_CHOICES)

    class Meta:
        PRIVATE, SHARE, SAMPLE, PUBLIC = [item for _, item in PURPOSE_CHOICES]
        OWNER = USER_ROLE_CHOICES[0][1]


class Users(BaseModel):
    user_id = pw.BigIntegerField(primary_key=True)
    tenant_id = pw.ForeignKeyField(Tenants, column_name="tenant_id", backref="users")
    nickname = pw.CharField(max_length=255)
    guid = pw.BigIntegerField()
    guid2 = pw.CharField(max_length=32)
    workspace_used = pw.BigIntegerField()
    workspace_quota = pw.BigIntegerField()
    process_resource = pw.IntegerField()
    max_process_resource = pw.IntegerField()
    id_provider = pw.CharField(max_length=16)
    deleted = EnumField(choices=DELETED_CHOICES, default=False)


class Datasets(BaseModel):
    dataset_id = pw.AutoField()
    tenant_id = pw.ForeignKeyField(Tenants, column_name="tenant_id", backref="datasets")
    owner_user_id = pw.ForeignKeyField(Users, column_name="owner_user_id", backref="datasets")
    name = pw.CharField(max_length=255)
    storage_used = pw.BigIntegerField(default=0)
    extract_progress = pw.IntegerField(default=0)
    cache_progress = pw.IntegerField(default=0)
    cache_status = EnumField(choices=DATASET_STATUS_CHOICES, default='none')
    data_num = pw.IntegerField(default=0)
    column_num = pw.IntegerField(null=True)
    header = MediumTextField(null=True)
    status = EnumField(choices=DATASET_STATUS_CHOICES, default='none')
    error_code = pw.IntegerField(null=True)
    upload_prefix = pw.CharField(max_length=64, null=True)
    copy_status = EnumField(choices=DATASET_COPY_STATUS_CHOICES, default='completed')
    original = pw.IntegerField(null=True)
    hash = pw.CharField(max_length=128, null=True)
    deleted = EnumField(choices=DELETED_CHOICES, default=False)

    class Meta:
       NONE, READY, EXTRACTING, FAILED, COMPLETED, COPYING  = [
           s for _, s in DATASET_STATUS_CHOICES
       ]
