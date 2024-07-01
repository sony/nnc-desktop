/* Copyright 2024 Sony Group Corporation. */
/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

export const USER_ROLE: string = 'user';
export const ADMIN_ROLE: string = 'admin';
export const OWNER_ROLE: string = 'owner';

export interface ICoreChargeParam {
    metadata: {
      year: number;
      first_year: number;
    };
    billings: {
      date: string;
      total: number;
      currency_rate: any;
      details: {
        cpu_hours: {
          description: any;
        unit_price?: number;
        times?: number;
        price?: number;
        }[];
        workspace: {
          description: any;
          price: number;
        },
        subTotal: number;
        tax: number;
        api_server_hours?: ICoreApiServerHours[];
        api_executions?: ICoreApiExcecutions;
      };
    }[];
}

export interface ICoreDiscount {
  amount: number;
  description: {
    'ja-JP': string;
    'en-US': string;
  };
}

export interface ICoreCharge {
  description: {
    'en-US': string;
    'ja-JP': string;
  };
  price: number;
}

export interface ICoreCpuHours {
  description: {
    'en-US': string;
    'ja-JP': string;
  };
  instance_type: number;
  price: number;
  times: number;
  unit_price: number;
}

interface ICoreCloudBillings {
  cpu_hours?: ICoreCpuHours[];
  cpu_discounts?: ICoreDiscount[];
  sub_total: number;
  total_discounts?: ICoreDiscount[];
  workspace?: ICoreCharge;
  workspace_discounts?: ICoreDiscount[];
  api_server_hours?: ICoreApiServerHours[];
  api_executions?: ICoreApiExcecutions;
}

export interface ICoreApiServerHours {
  server_type: string;
  unit_price: number;
  price: number;
  description: {
    'en-US': string;
    'ja-JP': string;
  };
  times: number;
}

export interface ICoreApiExcecutions {
  price: number;
  description: {
    'en-US': string;
    'ja-JP': string;
  };
}

export interface ICoreTenantBilling {
  currency_rate: {
    'en-US': number;
    'ja-JP': number;
  };
  date: string;
  details: {
    cloud_billings: ICoreCloudBillings;
    consumption_tax: number;
    course?: ICoreCharge;
    sub_total: number;
    technical_support?: ICoreCharge;
  };
  total: number;
}

export interface ICoreTenantBillings {
  metadata: {
    year: number;
    first_year: number;
  };
  billings: ICoreTenantBilling[];
}

export interface ICoreElapsedInstance {
  instance_type: number;
  elapsed_time: number;
}

export interface ICoreMemberCpuResource {
  date: string;
  elapsed_time_for_each_instance: ICoreElapsedInstance[];
}

export interface ICoreMemberCpuResources {
  metadata: {
    year: number;
    first_year: number;
  };
  process_resource: ICoreMemberCpuResource[];
}

export interface ICoreMemberInstanceUnit {
  description: string;
  times: number;
  unitPrice: string;
  price: string;
}

export interface ICoreChargeMonth {
    date: string;
    currencyRate: number;
    total: number;
    details: {
      cpuHours: {
        description: string;
        unitPrice?: number;
        times?: number;
        price?: number;
      }[];
      workspace: {
        description: string;
        price: number;
      },
      subTotal: number,
      tax: number;
      apiServerHours?: {
        serverType: string;
        unitPrice: number;
        price: number;
        description: string;
        times: number;
      }[];
      apiExecutions?: {
        price: number;
        description: {
          'en-US': string;
          'ja-JP': string;
        }
      }
    };
  }

interface ICoreCourse {
  min_workspace_gb: number;
  name: {'ja-JP': string, 'en-US': string};
  technical_service: {
    limit: number
  };
}

export interface ICorePlanDetail {
  budget: number;
  budget_changeable: boolean;
  budget_range: {maximum: number, minimum: number};
  corporate_course?: ICoreCourse;
  max_project_num: number;
  max_workspace_gb: number;
  payment_method: string;
  services: string[];
  workspace_gb: number;
}

export interface ICorePlan {
  currency_rate: {'ja-JP': string, 'en-US': string};
  plan: ICorePlanDetail;
}
