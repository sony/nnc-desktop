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

import { ITenant, ITenantMember } from '../../interfaces/core-response/ITenant';
import { IMemberObj, ITenantObj } from '../state/tenant';
import { OWNER_ROLE } from '../../interfaces/core-response/IServiceSettings';

const LOCAL_WORKSPACE: string = 'private';

export function setTenantList(state: any, payload: ITenant[]): void {
  state.tenant.tenantList = payload.map((tenant: ITenant) => {
    return {
      tenantId: tenant.tenant_id,
      nickname: tenant.nickname,
      role: tenant.role,
      isLocal: tenant.purpose === LOCAL_WORKSPACE
    };
  });
  state.tenant.selectedTenantId = payload[0] ? payload[0].tenant_id : '';
}

export function setTenantMemberList(state: any, payload: {tenantId: string, memberList: ITenantMember[]}): void {
  state.tenant.memberList[payload.tenantId] = payload.memberList.map((member: ITenantMember) => {
    return {
      userId: member.user_id,
      nickname: member.nickname,
      role: member.role,
      status: member.status,
      workspaceUsed: member.workspace_used,
      needApplications: member.need_applications ? true : false,
      deleted: member.deleted,
      checked: false,
      elapsedTimeForEachInstances: {
        total: member.elapsed_time_for_each_instance || [],
        thisMonth: member.usage_history ? member.usage_history.this_month.elapsed_time_for_each_instance : [],
        lastMonth: member.usage_history ? member.usage_history.last_month.elapsed_time_for_each_instance : []
      }
    };
  });
  state.tenant = Object.assign({}, state.tenant);
}

export function setTenantId(state: any, payload: string): void {
  state.tenant.selectedTenantId = payload;
}

export function setCheckedTenantMember(state: any, payload: {tenantId: string, userId: string, checked: boolean}): void {
  const index: number = state.tenant.memberList[payload.tenantId].findIndex((member: IMemberObj) => member.userId === payload.userId);
  if (index !== -1) {
    state.tenant.memberList[payload.tenantId][index].checked = payload.checked;
  }
  state.tenant = Object.assign({}, state.tenant);
}

export function setAllCheckedTenantMember(state: any, payload: {tenantId: string, checked: boolean, myUserId: string}): void {
  state.tenant.allChecked[payload.tenantId] = payload.checked;
  state.tenant.memberList[payload.tenantId].filter((member: IMemberObj) => member.role !== OWNER_ROLE && member.userId !== payload.myUserId).forEach((member: IMemberObj) => member.checked = payload.checked);
  state.tenant = Object.assign({}, state.tenant);
}

export function changeAmountType(state: any, payload: {tenantId: string, type: string}): void {
  state.tenant.selectedAmountType[payload.tenantId] = payload.type;
  state.tenant = Object.assign({}, state.tenant);
}

export function initTenant(state: any, payload: ITenant[]): void {
  payload.forEach((tenant: ITenant) => {
    state.tenant.memberList[tenant.tenant_id] = [];
    state.tenant.allChecked[tenant.tenant_id] = false;
    state.tenant.selectedAmountType[tenant.tenant_id] = 'total';
  });
  state.tenant = Object.assign({}, state.tenant);
}

export function updateTenantName(state: any, payload: ITenantObj): void {
  state.tenant.tenantList.forEach((tenant: ITenantObj) => {
    if (tenant.tenantId === payload.tenantId) {
      tenant.nickname = payload.nickname;
    }
  });
  state.tenant = Object.assign({}, state.tenant);
}
