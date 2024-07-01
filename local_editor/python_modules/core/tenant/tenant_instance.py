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
from flask import request

from utils import available_jobs
# from utils.extend_instance import extend_instance
from utils.common import check_table_exist
from sqlite3db.models import db, ExchangeRates, LocalInstances, remoteResGInstances


def get_tenant_instance(user_id: str, tenant_id: str):

    # if user add extra instance
    # extend_instance() use create_tenant_instance instead.

    instances = LocalInstances.select().dicts()
    instance_type_dict = dict.fromkeys(['evaluate', 'profile', 'train', 'inference'], list(instances))
    return {
        "currency_rate": make_exchange_rate(),
        "instance_type": instance_type_dict,
        "method_type": available_jobs.make_available_method(tenant_id)
    }


def make_exchange_rate():
    year_month = int(datetime.datetime.utcnow().strftime("%Y%M"))
    exchange_rate = ExchangeRates\
        .select(ExchangeRates.rates)\
        .where(ExchangeRates.from_year_month <= year_month)\
        .order_by(ExchangeRates.from_year_month.desc()).scalar()
    return exchange_rate


def create_tenant_instance(user_id: str, tenant_id: str):
    with db.atomic():
        with check_table_exist(LocalInstances):
            partition = request.json.get('partition')
            gpu_count = request.json.get('gpuNumber')
            instance = LocalInstances.create(
                gpu_count=gpu_count,
                available=True,
                priority=0,
                description={
                    "en-US": f"remoteResG {partition} GPU x {gpu_count}",
                    "ja-JP": f"remoteResG {partition} GPU x {gpu_count}"},
                provider='remoteResG')
        with check_table_exist(remoteResGInstances):
            remoteResGInstances.insert({
                'instance_type': instance.instance_type,
                'user': request.json.get('userId'),
                'cert': request.json.get('cert'),
                'partition': request.json.get('partition')
                }).execute()
    return get_tenant_instance(user_id, tenant_id)


def delete_tenant_instance(user_id: str, tenant_id: str):
    from utils.logger import NNcdLogger
    NNcdLogger.debug(message=f"ids={request.json.get('ids')}")
    import logging
    logging.error(f"ids={request.json.get('ids')}")

    with db.atomic():
        instanceIds= request.json.get('ids')
        with check_table_exist(remoteResGInstances):
            remoteResGInstances.delete().where(remoteResGInstances.instance_type.in_(instanceIds)).execute()
        with check_table_exist(LocalInstances):
            LocalInstances.delete().where(LocalInstances.instance_type.in_(instanceIds)).execute()
    return get_tenant_instance(user_id, tenant_id)
