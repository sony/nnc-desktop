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

from sqlite3db import fields
from sqlite3db import choices
from sqlite3db.client import db
import peewee as pw
import datetime
import json

fn = pw.fn
Model = pw.Model
SQL = pw.SQL


class BaseModel(pw.Model):

    update_datetime = fields.UpdateDateTimeField(default=datetime.datetime.utcnow)
    create_datetime = pw.DateTimeField(default=datetime.datetime.utcnow)

    @classmethod
    def update(cls, __data=None, **update):
        for key in cls.__dict__:
            field_obj = getattr(cls, key, None)
            if field_obj and isinstance(field_obj, fields.UpdateDateTimeField):
                update.update({key: datetime.datetime.utcnow()})
        return pw.ModelUpdate(cls, cls._normalize_data(__data, update))
    
    class Meta:
        database = db
        legacy_table_names = False


class Instances(BaseModel):
    instance_type = pw.IntegerField(primary_key=True)
    description = pw.TextField()
    provider = pw.CharField(max_length=32)
    update_datetime = None
    create_datetime = None

    description.python_value = lambda value: json.loads(value)
    description.db_value = lambda value: json.dumps(value)


class Tenants(BaseModel):
    tenant_id = pw.CharField(max_length=36, primary_key=True)
    name = pw.CharField(max_length=255)
    purpose = fields.EnumField(choices=choices.PURPOSE_CHOICES)

    class Meta:
        PRIVATE, SHARE, SAMPLE, PUBLIC = [item for _, item in choices.PURPOSE_CHOICES]
        OWNER = choices.USER_ROLE_CHOICES[0][1]


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
    deleted = fields.EnumField(choices=choices.DELETED_CHOICES, default=False)


class Datasets(BaseModel):
    dataset_id = pw.AutoField()
    tenant_id = pw.ForeignKeyField(Tenants, column_name="tenant_id", backref="datasets")
    owner_user_id = pw.ForeignKeyField(Users, column_name="owner_user_id", backref="datasets")
    name = pw.CharField(max_length=255)
    storage_used = pw.BigIntegerField(default=0)
    extract_progress = pw.IntegerField(default=0)
    cache_progress = pw.IntegerField(default=0)
    cache_status = fields.EnumField(choices=choices.DATASET_STATUS_CHOICES, default='none')
    data_num = pw.IntegerField(default=0)
    column_num = pw.IntegerField(null=True)
    header = fields.MediumTextField(null=True)
    status = fields.EnumField(choices=choices.DATASET_STATUS_CHOICES, default='none')
    error_code = pw.IntegerField(null=True)
    upload_prefix = pw.CharField(max_length=64, null=True)
    copy_status = fields.EnumField(choices=choices.DATASET_COPY_STATUS_CHOICES, default='completed')
    original = pw.IntegerField(null=True)
    hash = pw.CharField(max_length=128, null=True)
    deleted = fields.EnumField(choices=choices.DELETED_CHOICES, default=False)
    description = pw.TextField()

    class Meta:
       NONE, READY, EXTRACTING, FAILED, COMPLETED, COPYING  = [
           s for _, s in choices.DATASET_STATUS_CHOICES
       ]


class ExchangeRates(BaseModel):
    from_year_month = pw.AutoField()
    rates = pw.TextField()

    rates.python_value = lambda value: json.loads(value)
    rates.db_value = lambda value: json.dumps(value)


class InstanceTariffs(BaseModel):
    from_year_month = pw.IntegerField()
    instance_type = pw.ForeignKeyField(Instances, column_name="instance_type", backref="instance_traiffs")
    price = pw.IntegerField()
    deleted = fields.EnumField(choices=choices.DELETED_CHOICES)

    class Meta:
        primary_key = pw.CompositeKey("from_year_month", "instance_type")


class Services(BaseModel):
    service_id = pw.SmallIntegerField(primary_key=True)
    service_name = pw.CharField(max_length=64)


class InstanceViewProperties(BaseModel):
    service_id = pw.ForeignKeyField(Services, column_name="service_id", backref="instance_view_properties")
    instance_type = pw.ForeignKeyField(Instances, column_name="instance_type", backref="instance_view_properties")
    order_no = pw.SmallIntegerField()
    priority = pw.SmallIntegerField()
    deleted = fields.EnumField(choices=choices.DELETED_CHOICES, default=False)

    class Meta:
        primary_key = pw.CompositeKey("service_id", "instance_type")


class JobInstanceTypes(BaseModel):
    job_type = fields.EnumField(choices=choices.JOB_TYPE_CHOICES)
    instance_type = pw.ForeignKeyField(Instances, column_name="instance_type", backref="job_instance_type")
    num_nodes = pw.CharField(max_length=64, null=True)

    class Meta:
        primary_key = pw.CompositeKey("job_type", "instance_type")


class Projects(BaseModel):
    project_id = pw.AutoField()
    tenant_id = pw.ForeignKeyField(Tenants, column_name="tenant_id", backref="projects")
    owner_user_id = pw.ForeignKeyField(Users, column_name="owner_user_id", backref="projects")
    name = pw.CharField(max_length=255)
    original = pw.IntegerField(null=True)
    copy_count = pw.IntegerField(default=0)
    star_count = pw.IntegerField(default=0)
    last_modified_uid = pw.ForeignKeyField(Users, column_name="last_modified_uid", backref="modified_project")
    last_modified_datetime = pw.DateTimeField(default=datetime.datetime.utcnow)
    deleted = fields.EnumField(choices=choices.DELETED_CHOICES, default=False)


class Jobs(BaseModel):
    job_id = pw.AutoField()
    tenant_id = pw.ForeignKeyField(Tenants, column_name="tenant_id", backref="jobs")
    owner_user_id = pw.ForeignKeyField(Users, column_name="owner_user_id", backref="jobs")
    last_exec_uid = pw.ForeignKeyField(Users, column_name="last_exec_uid", backref="jobs")
    project_id = pw.ForeignKeyField(Projects, column_name="project_id", backref="jobs")
    name = pw.CharField(max_length=255)
    status = fields.EnumField(choices=choices.JOB_STATUS_CHOICES, default="queued")
    status_update_datetime = pw.DateTimeField(default=datetime.datetime.utcnow)
    storage_used = pw.BigIntegerField(default=0)
    elapsed_time = pw.IntegerField(default=0)
    cpu_elapsed_time = pw.IntegerField(default=0)
    best_validation = pw.DoubleField(null=True, default=0)
    cost_multiply_add = pw.IntegerField(null=True)
    ss_id = pw.IntegerField(null=True)
    deleted = fields.EnumField(choices=choices.DELETED_CHOICES, default=False)

    class Meta:
        QUEUED, PREPROCESSING, PROCESSING, SUSPENDED, FINISHED, FAILED = [
            status for _, status in choices.JOB_STATUS_CHOICES
        ]
        PROFILE, TRAIN, EVALUATE, INFERENCE = [job_type for _, job_type in choices.JOB_TYPE_CHOICES]


class ProjectMetadatas(BaseModel):
    project_id = pw.IntegerField()
    item_name = pw.CharField(max_length=64)
    item_type = fields.EnumField(choices=choices.PROJECT_METADATA_TYPE_CHIOCES)
    numeric_value = pw.DoubleField(default=0)
    text_value = pw.CharField(max_length=128, default='')
    job_id = pw.IntegerField(default=0)
    dataset_id = pw.IntegerField(default=0)

    class Meta:
        primary_key = pw.CompositeKey("project_id", "item_name", "item_type", "numeric_value", "text_value", "job_id")
        TEXT, NUMERIC = [m_i_type for _, m_i_type in choices.PROJECT_METADATA_TYPE_CHIOCES]


class Reports(BaseModel):
    report_id = pw.AutoField()
    owner_user_id = pw.ForeignKeyField(Users, column_name="owner_user_id", backref="reports")
    project_id = pw.ForeignKeyField(Projects, column_name="project_id", backref="reports")
    job_id = pw.IntegerField(null=True)
    report_type = fields.EnumField(choices=choices.REPORT_TYPE_CHOICES, default="network")
    destination = fields.EnumField(choices=choices.REPORT_DESTINATION_CHOICES, default="local")
    url = pw.CharField(max_length=512, default="")
    post_id = pw.IntegerField(null=True)
    deleted = fields.EnumField(choices=choices.DELETED_CHOICES, default=False)

    class Meta:
        NETWORK, NETWORK_AND_RESULT = [r_type for _, r_type in choices.REPORT_TYPE_CHOICES]
        LOCAL, PUBLIC = [dest for _, dest in choices.REPORT_DESTINATION_CHOICES]

class ServiceInstanceTypes(BaseModel):
    service_id = pw.ForeignKeyField(Services, default=1, column_name="service_id", backref="service_instance_types")
    instance_type = pw.ForeignKeyField(Instances, column_name="instance_type", backref="service_instance_types")

    class Meta:
        primary_key = pw.CompositeKey("service_id", "instance_type")


class ServiceMethodTypes(BaseModel):
    service_id = pw.ForeignKeyField(Services, default=1, column_name="service_id", backref="service_method_types")
    method_type = pw.IntegerField()
    description = pw.CharField(max_length=128)

    class Meta:
        primary_key = pw.CompositeKey("service_id", "method_type")


class StructureSearches(BaseModel):
    ss_id = pw.AutoField()
    base_job_id = pw.ForeignKeyField(Jobs, column_name="base_job_id", backref="structure_searches")
    multi_mutate_num = pw.IntegerField()
    desired_state = pw.IntegerField()


class Tasks(BaseModel):
    task_id = pw.AutoField()
    owner_user_id = pw.ForeignKeyField(Users, column_name="owner_user_id", backref="tasks")
    job_id = pw.ForeignKeyField(Jobs, column_name="job_id", backref="tasks")
    dataset_id = pw.IntegerField(null=True)
    aws_job_id = pw.CharField(max_length=255, null=True)
    instance_group = pw.IntegerField(null=True)
    start_time = pw.DateTimeField(null=True)
    end_time = pw.DateTimeField(null=True)
    elapsed_time = pw.IntegerField(null=True)
    type = fields.EnumField(choices=choices.JOB_TYPE_CHOICES, null=True)
    data_num = pw.IntegerField(default=0)
    column_num = pw.IntegerField(null=True)
    header = fields.MediumTextField(null=True)
    num_nodes = pw.IntegerField(default=1, null=False)


class TenantPlans(BaseModel):
    tenant_plan_id = pw.AutoField()
    tenant_id = pw.ForeignKeyField(Tenants, column_name="tenant_id", backref="tenant_plans", null=True)
    workspace_gb = pw.IntegerField()
    budget = pw.IntegerField()
    services = pw.SmallIntegerField(default=2)
    corp_course_id = pw.IntegerField(null=True)
    support_purchased = pw.SmallIntegerField(default=0)
    support_limit = pw.SmallIntegerField(null=True)


class TenantUserRoles(BaseModel):
    tenant_user_role_id = pw.AutoField()
    tenant_id = pw.ForeignKeyField(Tenants, column_name="tenant_id", backref="tenant_user_roles")
    user_id = pw.ForeignKeyField(Users, column_name="user_id", backref="tenant_user_roles")
    user_role = fields.EnumField(choices=choices.USER_ROLE_CHOICES)
    status = pw.IntegerField()
    deleted = fields.EnumField(choices=choices.DELETED_CHOICES)


class ProjectStars(BaseModel):
    user_id = pw.ForeignKeyField(Users, column_name="user_id", backref="project_stars")
    project_id = pw.ForeignKeyField(Projects, field="project_id", column_name="project_id", backref="project_stars")

    class Meta:
        primary_key = False


class DatasetMetadatas(BaseModel):
    metadata_id = pw.AutoField()
    dataset_id = pw.IntegerField()
    item_name = pw.CharField(max_length=64)
    text_value = pw.CharField(max_length=512, default="")


class Plugins(BaseModel):
    plugin_id = pw.CharField(max_length=36, primary_key=True)
    owner_tenant_id = pw.ForeignKeyField(Tenants, column_name="owner_tenant_id", backref="plugins")
    plugin_name = pw.CharField(max_length=255)
    plugin_file = pw.CharField(max_length=255)
    parameters = pw.TextField()
    description = pw.TextField()
    computing_service = pw.CharField(max_length=255, null=True)
    deleted = fields.EnumField(choices=choices.DELETED_CHOICES, default=False)

    parameters.python_value = lambda value: json.loads(value)
    parameters.db_value = lambda value: json.dumps(value)


class LocalInstances(BaseModel):
    """NNCD instance, include local and remote."""
    instance_type = pw.IntegerField(primary_key=True)
    description = pw.TextField()
    priority = pw.SmallIntegerField()
    available = fields.EnumField(choices=choices.INSTANCE_AVAILABLE_CHOICES, default=True)
    gpu_count = pw.SmallIntegerField(default=0)
    provider = pw.CharField(max_length=32)
    deleted = fields.EnumField(choices=choices.DELETED_CHOICES, default=False)

    description.python_value = lambda value: json.loads(value)
    description.db_value = lambda value: json.dumps(value)


class remoteResGInstances(BaseModel):
    """remoteResG instance, contains cert and setting info."""
    instance_type = pw.ForeignKeyField(LocalInstances, column_name="instance_type", backref="remoteResG_instances")
    user = pw.TextField()
    cert = pw.TextField()
    partition = pw.TextField()

class JobRemoteJob(BaseModel):
    """The remote_id is NNCD remote instance job id."""
    order = pw.AutoField()
    job_id = pw.ForeignKeyField(Jobs, column_name="job_id", backref="job_remote_job")
    remote_job_id = pw.IntegerField()
