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

import {ITenantObj} from '../state/tenant';

import {ITenant} from '../../interfaces/core-response/ITenant';
import {ICoreProjects, ICoreSampleProject, ISampleProject} from '../../interfaces/core-response/IProject';
import { IInstanceType } from '../../interfaces/core-response/IMisc';
import { IState } from '../state';
import { IComputeResource } from '../state/computeResource';

/** プロジェクトの最大の表示数 */
const MAX_PROJECT_NUMBER: number = 500;

/** ジョブの最大の表示数 */
const MAX_JOB_NUMBER: number = 500;

export function initComputeResource(state: any, payload: ITenant[]): void {
    payload.forEach((tenant: ITenant) => {
      state.computeResourceGroup.compResoTotal[tenant.tenant_id] = 0;
      state.computeResourceGroup.compResoList[tenant.tenant_id] = [];
      state.computeResourceGroup.keyword[tenant.tenant_id] = '';
      state.computeResourceGroup.allChecked[tenant.tenant_id] = false;
      state.computeResourceGroup.instanceListLoading[tenant.tenant_id] = false;
    });
    state.computeResourceGroup = Object.assign({}, state.computeResourceGroup);
  }

export function setInstanceKeyword(state: any, payload: {tenantId: string, keyword: string}): void {
    state.computeResourceGroup.keyword[payload.tenantId] = payload.keyword;
    state.computeResourceGroup = Object.assign({}, state.computeResourceGroup);
}

export function showInstanceListLoading(state: any, payload: string): void {
    state.computeResourceGroup.instanceListLoading[payload] = true;
    state.computeResourceGroup = Object.assign({}, state.computeResourceGroup);
}

export function hideInstanceListLoading(state: any, payload: string): void {
    state.computeResourceGroup.instanceListLoading[payload] = false;
    state.computeResourceGroup = Object.assign({}, state.computeResourceGroup);
}


/**
 * @param {*} state
 * @param {IInstanceParam} payload
 */
export function setCompReso(state: any, payload: {tenantId: string, instances: IInstanceType[]}): void {
    const total: number = payload.instances.length;
    state.computeResourceGroup.compResoTotal[payload.tenantId] = total;
    let results:IComputeResource[] = payload.instances.map((i: IInstanceType) => {
      return {
        ...i,
        name: i.description['en-US'],
        checked: false // reset checked each time set compute resources
      };
    })
    const remote = results.filter(i => i.provider !== 'local').sort((a, b) => a.update_datetime < b.update_datetime ? 1 : -1);
    const local = results.filter(i => i.provider === 'local').sort((a, b) => a.update_datetime < b.update_datetime ? 1 : -1);
    state.computeResourceGroup.compResoList[payload.tenantId] = remote.concat(local);
    state.computeResourceGroup.allChecked[payload.tenantId] = false;  // reset checked each time set compute resources
    state.computeResourceGroup = Object.assign({}, state.computeResourceGroup);
  }

/**
 * 選択のフラグを設定します
 * @param {*} state
 * @param {*} payload データ
 */
export function setInstanceChecked(state: any, payload: {tenantId: string, instanceID: string, checked: boolean}): void {
    const resourceList: any[] = [].concat(state.computeResourceGroup.compResoList[payload.tenantId]);
    resourceList.forEach((i) => {
      if (i.instance_type === parseInt(payload.instanceID)) {
        i.checked = payload.checked && i.provider !== 'local';
      }
    });
    state.computeResourceGroup.compResoList[payload.tenantId] = resourceList;
    state.computeResourceGroup = Object.assign({}, state.computeResourceGroup);
  }

/**
 * プロジェクトを全選択します
 * @param {*} state
 * @param {IProjectParam} payload データ
 */
export function selectInstanceAll(state: any, payload: {tenantId: string, checked: boolean}): void {
    const resourceList: any[] = [].concat(state.computeResourceGroup.compResoList[payload.tenantId]);
    resourceList.forEach((i) => {
      i.checked = payload.checked && i.provider !== 'local';
    });
    state.computeResourceGroup.compResoList[payload.tenantId] = resourceList;
    state.computeResourceGroup.allChecked[payload.tenantId] = payload.checked;
    state.computeResourceGroup = Object.assign({}, state.computeResourceGroup);
  }

export function setCompResoEnvInfo(state: any, payload: any): void {
    state.computeResourceGroup.platform = payload.platform;
}
