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

import store from '../store/index';
import { CoreApiClient } from '../CoreApiClient';
import { ITenant, ITenantMembers } from '../interfaces/core-response/ITenant';
import { ICorePlan } from '../interfaces/core-response/IServiceSettings';

export class ResourceInfoUtil {

  private static readonly LIMIT_THRESHOLD: number = 0.8;

  public static updateAll(tenants: ITenant[]): Promise<any> {
    return new Promise((resolve: (res?: any) => void, reject: (res?: any) => void) => {
      this.updatePlanInfoAll(tenants).then(() => {
        this.updateTenantMemberAll(tenants);
        this.updateProcessResourceInfoAll(tenants);
        this.updateWorkspaceInfoAll(tenants);
        this.updateCreatedProjectNumAll(tenants);
        resolve();
      });
    });
  }

  private static updateTenantMemberAll(tenants: ITenant[]): Promise<any> {
    const promiseList: Promise<any>[] = [];
    const userId: any = localStorage.getItem('u');
    tenants.forEach((tenant: ITenant) => {
      promiseList.push(this.updateTenantMember(userId, tenant.tenant_id, tenant.purpose === 'private'));
    });
    return Promise.all(promiseList);
  }

  private static updateTenantMember(userId: string, tenantId: string, isLocal: boolean): Promise<any> {
    return new Promise((resolve: (res?: any) => void, reject: (res?: any) => void) => {
      if (isLocal) {
        resolve();
        return;
      }
      CoreApiClient.getTenantMembers(userId, tenantId).then((response: ITenantMembers) => {
        store.commit('setTenantMemberList', {tenantId, memberList: response.members});
        resolve();
      }, (error: any) => {
        // error, do nothing.
        resolve();
      });
    });
  }
  private static updatePlanInfoAll(tenants: ITenant[]): Promise<any> {
    const promiseList: Promise<any>[] = [];
    const userId: any = localStorage.getItem('u');
    tenants.forEach((tenant: ITenant) => {
      promiseList.push(this.updatePlanInfo(userId, tenant.tenant_id, tenant.role));
    });
    return Promise.all(promiseList);
  }

  public static updatePlanInfo(userId: string, tenantId: string, role: string): Promise<any> {
    return new Promise((resolve: (res?: any) => void, reject: (res?: any) => void) => {
      CoreApiClient.getTenantPlan(userId, tenantId).then((res: ICorePlan) => {
        store.commit('setBudget', {tenantId, budget: res.plan.budget});
        store.commit('setMaxWorkspaceGb', {tenantId, workspace: res.plan.max_workspace_gb});
        store.commit('setPlan', {tenantId, plan: res.plan});
        if ((res.plan.budget || res.plan.budget === 0 ? true : false) && role !== 'user') {
          this.updateBillingTotal(userId, tenantId).then(() => {
            resolve();
          });
        } else {
          resolve();
        }
      }, (error: any) => {
        // error, do nothing.
        resolve();
      });
    });
  }

  private static updateProcessResourceInfoAll(tenants: ITenant[]): Promise<any> {
    const promiseList: Promise<any>[] = [];
    const userId: any = localStorage.getItem('u');
    tenants.forEach((tenant: ITenant) => {
      promiseList.push(this.updateProcessResourceInfo(userId, tenant.tenant_id, tenant.purpose === 'private'));
    });
    return Promise.all(promiseList);
  }

  public static updateProcessResourceInfo(userId: string, tenantId: string, isLocal: boolean): Promise<any> {
    return new Promise((resolve: (res?: any) => void, reject: (res?: any) => void) => {
      if (!isLocal) {
        resolve();
        return;
      }
      CoreApiClient.getResourceInfo(userId).then((res: any) => {
        store.commit('setUserResourceInfoServiceSettings', {tenantId, resources: res});
        resolve();
      }, (error: any) => {
        // error, do nothing.
        resolve();
      });
    });
  }

  private static updateWorkspaceInfoAll(tenants: ITenant[]): Promise<any> {
    const promiseList: Promise<any>[] = [];
    const userId: any = localStorage.getItem('u');
    tenants.forEach((tenant: ITenant) => {
      promiseList.push(this.updateWorkspaceInfo(userId, tenant.tenant_id));
    });
    return Promise.all(promiseList);
  }

  public static updateWorkspaceInfo(userId: string, tenantId: string): Promise<any> {
    return new Promise((resolve: (res?: any) => void, reject: (res?: any) => void) => {
      CoreApiClient.getTenantWorkspaceInfo(userId, tenantId).then((res: any) => {
        store.commit('setUserWorkspaceInfoServiceSettings', {tenantId, workspaces: res});
        resolve();
      }, (error: any) => {
        // error, do nothing.
        resolve();
      });
    });
  }

  private static updateCreatedProjectNumAll(tenants: ITenant[]): Promise<any> {
    const promiseList: Promise<any>[] = [];
    const userId: any = localStorage.getItem('u');
    tenants.forEach((tenant: ITenant) => {
      promiseList.push(this.updateCreatedProjectNum(userId, tenant.tenant_id));
    });
    return Promise.all(promiseList);
  }

  private static updateCreatedProjectNum(userId: string, tenantId: string): Promise<any> {
    return new Promise((resolve: (res?: any) => void, reject: (res?: any) => void) => {
      CoreApiClient.getProjects(userId, '0', '10', tenantId).then((projects: any) => {
        store.commit('setProject', {tenantId, projects});
        resolve();
      }, (error: any) => {
        // error, do nothing.
        resolve();
      });
    });
  }

  public static updateBillingTotal(userId: string, tenantId: string): Promise<any> {
    return new Promise((resolve: (res?: any) => void, reject: (res?: any) => void) => {
      CoreApiClient.getTenantBillings(userId, tenantId).then((res: any) => {
        if (res.billings) {
          store.commit('setBillThisMonth', {tenantId, bill: res.billings[0]});
          store.commit('setBillMonths', {tenantId, bill: res});
          store.commit('updateSelectedYear', {tenantId, year: res.billings[0].date.substr(0, 4)});
        }
        resolve();
      }, (error: any) => {
        // error, do nothing.
        resolve();
      });
    });
  }

  public static getWorkspaceQuota(tenantId: string): number {
    return store.state.serviceSettings.workspaceInfo[tenantId].workspaceQuota;
  }

  public static getWorkspaceUsed(tenantId: string): number {
    const datasetWorkspaceUsed: number = store.state.serviceSettings.workspaceInfo[tenantId].datasetWorkspaceUsed;
    const jobWorkspaceUsed: number = store.state.serviceSettings.workspaceInfo[tenantId].jobWorkspaceUsed;
    return datasetWorkspaceUsed + jobWorkspaceUsed;
  }

  public static getMaxProjectNum(): number {
    return 10;
  }

  public static getCreatedProjectNum(tenantId: string): number {
    return store.state.project.projectTotal[tenantId];
  }

  public static getBudget(tenantId: string): number {
    return store.state.serviceSettings.budget[tenantId];
  }

  public static getBillingTotal(tenantId: string): number {
    return store.state.serviceSettings.thisMonth[tenantId].total;
  }

  public static getMaxProcessResource(tenantId: string): number {
    return store.state.serviceSettings.resourceInfo[tenantId].maxProcessResource;
  }

  public static getProcessResource(tenantId: string): number {
    return store.state.serviceSettings.resourceInfo[tenantId].processResource;
  }

  public static isCloseToTheLimitBudget(tenantId: string): boolean {
    return this.isCloseToTheLimit(this.getBillingTotal(tenantId), this.getBudget(tenantId));
  }

  public static isOverTheLimitBudget(tenantId: string): boolean {
    return this.isOverTheLimit(this.getBillingTotal(tenantId), this.getBudget(tenantId));
  }

  public static isCloseToTheLimitProcessResource(tenantId: string): boolean {
    return this.isCloseToTheLimit(this.getProcessResource(tenantId), this.getMaxProcessResource(tenantId));
  }

  public static isOverTheLimitProcessResource(tenantId: string): boolean {
    return this.isOverTheLimit(this.getProcessResource(tenantId), this.getMaxProcessResource(tenantId));
  }

  public static isCloseToTheLimitWorkspaceUsed(tenantId: string): boolean {
    return this.isCloseToTheLimit(this.getWorkspaceUsed(tenantId), this.getWorkspaceQuota(tenantId));
  }

  public static isOverTheLimitWorkspaceUsed(tenantId: string): boolean {
    return this.isOverTheLimit(this.getWorkspaceUsed(tenantId), this.getWorkspaceQuota(tenantId));
  }

  public static isCloseToTheLimitProjectNum(tenantId: string): boolean {
    return this.isCloseToTheLimit(this.getCreatedProjectNum(tenantId), this.getMaxProjectNum());
  }

  public static isOverTheLimitProjectNum(tenantId: string): boolean {
    return this.isOverTheLimit(this.getCreatedProjectNum(tenantId), this.getMaxProjectNum());
  }

  private static isCloseToTheLimit(numerator: number, denominator: number): boolean {
    return this.isLimit(numerator, denominator, ResourceInfoUtil.LIMIT_THRESHOLD);
  }

  private static isOverTheLimit(numerator: number, denominator: number): boolean {
    return this.isLimit(numerator, denominator, 1);
  }

  private static isLimit(numerator: number, denominator: number, threshold: number): boolean {
    if (!denominator || denominator === 0) {
      return false;
    }

    const usage: number = numerator / denominator;
    return usage >= threshold;
  }

  public static isCharged(tenantId: string): boolean {
    return store.state.serviceSettings.charged[tenantId];
  }

}
