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
from datetime import datetime
from sqlite3db.models import LocalInstances, ExchangeRates


def get_plan_list():

    year_month = int(datetime.utcnow().strftime("%Y%M"))

    ret_instances = []
    instances = LocalInstances.select()
    for instance in instances:
        ret_instances.append({
            'instance_type': instance.instance_type,
            'description': instance.description,
            'deleted': instance.deleted
        })

    # get current exchange rates
    rate = ExchangeRates.select().where(
        ExchangeRates.from_year_month <= year_month
    ).order_by(
        ExchangeRates.from_year_month.desc()
    ).first()
    if not rate:
        raise Exception("exchange_rates data not found.")

    return {
        "currency_rate": rate.rates,
        "instances": ret_instances,
        "workspace": {
            "minimum_gb": 10,
            "maximum_gb": 1000,
            "price": 25
        },
        "budget": {
            "minimum": 10000,
            "maximum": 100000
        }
    }
