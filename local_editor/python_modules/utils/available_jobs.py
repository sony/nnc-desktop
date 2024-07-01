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

import json
from conf import consts
from sqlite3db.models import JobInstanceTypes, fn, Instances,\
    ServiceInstanceTypes, InstanceViewProperties, ServiceMethodTypes
    

def make_available_instance(tenant_id: str):
    available_instance_dict = dict()

    job_instance_types = JobInstanceTypes\
        .select(
            JobInstanceTypes.instance_type,
            fn.GROUP_CONCAT(JobInstanceTypes.job_type).alias("job_types"),
            Instances.provider,
            Instances.description)\
        .join(Instances).group_by(JobInstanceTypes.instance_type).dicts()
    for job_instance_type in job_instance_types:
        instance_type = job_instance_type.get("instance_type")
        job_instance_type["available"] = False
        job_instance_type["priority"] = 1
        available_instance_dict[instance_type] = job_instance_type

    service_instance_types = ServiceInstanceTypes.select().dicts()
    for service_instance_type in service_instance_types:
        instance_type = service_instance_type.get("instance_type")
        if service_instance_type.get("service_id") & consts.SERVICE_FREE:
            available_instance_dict[instance_type]["available"] = True

    instance_view_properties = InstanceViewProperties.select()\
        .order_by(
            InstanceViewProperties.service_id,
            InstanceViewProperties.instance_type
        ).dicts()
    for instance_view_property in instance_view_properties:
        instance_type = instance_view_property.get("instance_type")
        if instance_view_property.get("service_id") & consts.SERVICE_FREE:
            priority = instance_view_property.get("priority")
            available_instance_dict[instance_type]["priority"] = priority

    return list(available_instance_dict.values())


def make_available_method(tenant_id: str):
    available_methods = dict()

    service_method_types = ServiceMethodTypes.select().dicts()
    for service_method_type in service_method_types:
        method_type = service_method_type.get("method_type")
        available_method = available_methods.get(method_type)
        if available_method is None:
            available_methods[method_type] = {
                "method_type": method_type,
                "description": json.loads(service_method_type["description"]),
                "available": False,
            }
        if service_method_type.get("service_id") & consts.SERVICE_FREE:
            available_methods[method_type]['available'] = True
    return list(available_methods.values())
