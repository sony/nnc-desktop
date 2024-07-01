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

export interface IMaintenanceInfo {
  start: number;
  end: number;
  message: string;
}

export interface IGetMaintenance {
  maintenance: {
    payment: IMaintenanceInfo[];
    abci: IMaintenanceInfo[];
  };
  current_unix_time: number;
}

export interface IWorkspace {
  minimum_gb: number;
  maximum_gb: number;
  price: number;
}

export interface IInstance {
  instance_type: number;
  description: {
    [country: string]: string;
  };
  price: number;
  deleted: boolean;
}

export interface IBudget {
  minimum: number;
  maximum: number;
}

export interface IGetPlan {
  currency_rate: {
    [country: string]: string;
  };
  workspace: IWorkspace;
  instances: IInstance[];
  budget: IBudget;
}

export interface IInstanceType {
  available: boolean;
  description: {
    'ja-JP': string;
    'en-US': string;
  };
  instance_type: number;
  price: number;
  priority: number;
  provider: 'aws' | 'abci' | 'local' | 'remoteResG';
  create_datetime: string;
  update_datetime: string;
  deprecated?: boolean;
}

export interface IGetInstance {
  instance_type: {
    evaluate: IInstanceType[];
    profile: IInstanceType[];
    train: IInstanceType[];
  };
}
