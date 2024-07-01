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

import { IUserWorkspaceParam, IUserResourceParam } from '../mutations/dashboard';
import {ICoreChargeParam, ICoreChargeMonth, ICoreMemberCpuResource} from '../../interfaces/core-response/IServiceSettings';

interface IUserWorkSpaceInfo {
  datasetWorkspaceUsed: number;
  jobWorkspaceUsed: number;
  workspaceQuota: number;
}

interface IUserResourceInfo {
  processResource: number;
  maxProcessResource: number;
}

export interface ICpuHours {
  description: string;
  unitPrice: number;
  times: number;
  price: number;
}

export interface IMonthInfo {
  date: string;
  currencyRate: number;
  total: number;
  details: {
    course?: {description: string, price: number},
    cpuHours: ICpuHours[],
    cpuDiscounts?: {description: string, amount: number}[],
    support?: {description: string, price: number},
    workspace: {description: string, price: number},
    workspaceDiscounts?: {description: string, amount: number}[],
    totalDiscounts?: {description: string, amount: number}[],
    subTotal: number;
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

export interface ICourse {
  name?: {
    [country: string]: string;
  };
  support?: number;
  minWorkspace: number;
}

export interface IServiceSettings {
  workspaceInfo: {[key: string]: IUserWorkSpaceInfo};
  resourceInfo: {[key: string]: IUserResourceInfo};
  budget: {[key: string]: number};
  budgetRange: {[key: string]: {minimum: number, maximum: number}};
  course: {[key: string]: ICourse};
  charged: {[key: string]: boolean};
  currencyRate: {[key: string]: number};
  thisMonth: {[key: string]: IMonthInfo};
  months: {[key: string]: IMonthInfo[]};
  cardId: {[key: string]: number};
  creditCardNo: {[key: string]: string};
  creditCardThrough: {[key: string]: string};
  yearList: {[key: string]: string[]};
  maxWorkspaceGb: {[key: string]: number};
  selectedYear: {[key: string]: string};
  isPaymentMaintenance: {[key: string]: boolean};
  paymentMethod: {[key: string]: string};
  isChangeableBudget: {[key: string]: boolean};
  services: {[key: string]: string[]};
  isPaymentModalDisplayed: {[key: string]: boolean};
  isTopicPath: boolean;
  currentPath: string;
  nickname: string;
  isInitServiceSettings: {[key: string]: boolean};
  isLoading: {[key: string]: boolean};
  memberCpuResourceThisMonth: {[key: string]: ICoreMemberCpuResource};
  memberCpuResourceMonth: {[key: string]: ICoreMemberCpuResource[]};
}

const serviceSettings: IServiceSettings = {
  workspaceInfo: {},
  resourceInfo: {},
  budget: {},
  budgetRange: {},
  course: {},
  charged: {},
  currencyRate: {},
  thisMonth: {},
  months: {},
  cardId: {},
  creditCardNo: {},
  creditCardThrough: {},
  yearList: {},
  maxWorkspaceGb: {},
  selectedYear: {},
  isPaymentMaintenance: {},
  paymentMethod: {},
  isChangeableBudget: {},
  services: {},
  isPaymentModalDisplayed: {},
  isTopicPath: false,
  currentPath: 'top',
  nickname: '',
  isInitServiceSettings: {},
  isLoading: {},
  memberCpuResourceThisMonth: {},
  memberCpuResourceMonth: {}
};

/** ServiceSettingsで使用するStateの定義 */
export default serviceSettings;
