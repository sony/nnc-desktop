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

import { IInstance } from '../../interfaces/core-response/ITenant';

export interface IElapsedTimeForEachInstances {
  total: IInstance;
  lastMonth: IInstance[];
  thisMonth: IInstance[];
}

export interface ITenantObj {
  tenantId: string;
  nickname: string;
  role: string;
  isLocal: boolean;
}

export interface IMemberObj {
  userId: string;
  nickname: string;
  role: string;
  status: string;
  workspaceUsed: number;
  deleted: boolean;
  checked: boolean;
  elapsedTimeForEachInstances: IElapsedTimeForEachInstances;
}

export interface ITenant {
  tenantList: ITenantObj[];
  memberList: {[key: string]: IMemberObj[]};
  allChecked: {[key: string]: boolean};
  selectedAmountType: {[key: string]: string};
  selectedTenantId: string;
}

const tenant: ITenant = {
  tenantList: [],
  memberList: {},
  allChecked: {},
  selectedAmountType: {},
  selectedTenantId: ''
};

export default tenant;
