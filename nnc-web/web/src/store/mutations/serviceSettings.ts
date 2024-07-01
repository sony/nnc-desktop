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

import {ITenant} from '../../interfaces/core-response/ITenant';
import { IUserWorkspaceParam, IUserResourceParam } from './dashboard';
import {ICpuHours, IMonthInfo} from '../state/serviceSettings';
import {
  ICoreChargeParam,
  ICoreChargeMonth,
  ICoreDiscount,
  ICoreCharge,
  ICoreCpuHours,
  ICoreTenantBillings,
  ICoreTenantBilling,
  ICorePlanDetail,
  ICoreMemberCpuResource,
  ICoreMemberCpuResources,
  ICoreApiServerHours
} from '../../interfaces/core-response/IServiceSettings';

interface IServerHours {
  serverType: string;
  unitPrice: number;
  price: number;
  description: string;
  times: number;
}

export function setUserWorkspaceInfoServiceSettings(
  state: any,
  payload: {tenantId: string, workspaces: IUserWorkspaceParam}
): void {
  state.serviceSettings.workspaceInfo[payload.tenantId] = {
    jobWorkspaceUsed: payload.workspaces.job_workspace_used,
    datasetWorkspaceUsed: payload.workspaces.dataset_workspace_used,
    workspaceQuota: payload.workspaces.workspace_quota
  };
  state.serviceSettings = Object.assign({}, state.serviceSettings);
}

export function setUserResourceInfoServiceSettings(
  state: any,
  payload: {tenantId: string, resources: IUserResourceParam}
): void {
  state.serviceSettings.resourceInfo[payload.tenantId] = {
    processResource: payload.resources.process_resource,
    maxProcessResource: payload.resources.max_process_resource
  };
  state.serviceSettings = Object.assign({}, state.serviceSettings);
}

export function setBudget(state: any, payload: {tenantId: string, budget: number}): void {
  state.serviceSettings.budget[payload.tenantId] = payload.budget;
  state.serviceSettings.charged[payload.tenantId] = payload.budget || payload.budget === 0 ? true : false;
  state.serviceSettings = Object.assign({}, state.serviceSettings);
}

export function setCurrencyRateForBudget(state: any, payload: {tenantId: string, rate: number}): void {
  state.serviceSettings.currencyRate[payload.tenantId] = payload.rate;
  state.serviceSettings = Object.assign({}, state.serviceSettings);
}

function parseBillData(bill: ICoreTenantBilling, locale: string) {
  const cpuItems: any = bill.details.cloud_billings.cpu_hours;
  let cpuPlans: ICpuHours[] = [];
  if (cpuItems) {
    cpuPlans = cpuItems.map((cpuItem: ICoreCpuHours) => {
      return {
        description: cpuItem.description[locale],
        unitPrice: cpuItem.unit_price,
        times: cpuItem.times,
        price: cpuItem.price
      };
    });
  }

  const workspace: {description: string, price: number} = {
    description: '',
    price: 0
  };
  const billWorkspace: ICoreCharge | undefined = bill.details.cloud_billings.workspace;
  if (billWorkspace) {
    workspace.description = billWorkspace.description[locale];
    workspace.price = billWorkspace.price;
  }

  const data: IMonthInfo = {
    date: bill.date,
    currencyRate: bill.currency_rate[locale],
    total: bill.total,
    details: {
      cpuHours: cpuPlans,
      workspace: workspace,
      subTotal: bill.details.sub_total,
      tax: bill.details.consumption_tax
    }
  };

  const cpuDiscountItems: ICoreDiscount[] | undefined = bill.details.cloud_billings.cpu_discounts;
  if (cpuDiscountItems) {
    const cpuDiscounts: {description: string, amount: number}[] = cpuDiscountItems.map((cpuDiscountItem: ICoreDiscount) => {
      return {
        description: cpuDiscountItem.description[locale],
        amount: cpuDiscountItem.amount
      };
    });
    data.details.cpuDiscounts = cpuDiscounts;
  }

  const apiServerHours: ICoreApiServerHours[] | undefined = bill.details.cloud_billings.api_server_hours;
  let serverHours: IServerHours[] = [] as IServerHours[];
  if (apiServerHours) {
    serverHours = apiServerHours.map((serverItem: ICoreApiServerHours) => {
      return {
        serverType: serverItem.server_type,
        unitPrice: serverItem.unit_price,
        price: serverItem.price,
        description: serverItem.description[locale],
        times: serverItem.times
      };
    });
    data.details.apiServerHours = serverHours;
  }

  const apiExecutions: any = bill.details.cloud_billings.api_executions;
  if (apiExecutions) {
    data.details.apiExecutions = apiExecutions;
  }

  const workspaceDiscountItems: ICoreDiscount[] | undefined = bill.details.cloud_billings.workspace_discounts;
  if (workspaceDiscountItems) {
    const workspaceDiscounts: {description: string, amount: number}[] = workspaceDiscountItems.map((workspaceDiscountItem: ICoreDiscount) => {
      return {
        description: workspaceDiscountItem.description[locale],
        amount: workspaceDiscountItem.amount
      };
    });
    data.details.workspaceDiscounts = workspaceDiscounts;
  }

  const totalDiscountItems: ICoreDiscount[] | undefined = bill.details.cloud_billings.total_discounts;
  if (totalDiscountItems) {
    const totalDiscounts: {amount: number, description: string}[] = totalDiscountItems.map((totalDiscountItem: ICoreDiscount) => {
      return {
        amount: totalDiscountItem.amount,
        description: totalDiscountItem.description[locale]
      };
    });
    data.details.totalDiscounts = totalDiscounts;
  }

  const courseItem: ICoreCharge | undefined = bill.details.course;
  if (courseItem) {
    data.details.course = {
      description: courseItem.description[locale],
      price: courseItem.price
    };
  }

  const support: ICoreCharge | undefined = bill.details.technical_support;
  if (support) {
    data.details.support = {
      description: support.description[locale],
      price: support.price
    };
  }
  return data;
}

/**
 * 今月の課金情報を設定します。
 * @param {ICoreChargeParam} payload データ
 */
export function setBillThisMonth(state: any, payload: {tenantId: string, bill: ICoreTenantBilling}): void {
  const locale: string = state.common.locale;
  state.serviceSettings.thisMonth[payload.tenantId] = parseBillData(payload.bill, locale);
  state.serviceSettings = Object.assign({}, state.serviceSettings);
}

/**
 * 今月のテナントメンバーのインスタンス使用時間を設定します。
 * @param {ICoreChargeParam} payload データ
 */
export function setMemberCpuResourceThisMonth(state: any, payload: {tenantId: string, processResource: ICoreMemberCpuResource}): void {
  const locale: string = state.common.locale;
  state.serviceSettings.memberCpuResourceThisMonth[payload.tenantId] = payload.processResource;
  state.serviceSettings = Object.assign({}, state.serviceSettings);
}

/**
 * 過去のテナントメンバーのインスタンス使用時間を設定します。
 * @param {ICoreChargeParam} payload データ
 */
export function setMemberCpuResourceMonth(state: any, payload: {tenantId: string, processResource: ICoreMemberCpuResources}): void {
  const locale: string = state.common.locale;
  state.serviceSettings.memberCpuResourceMonth[payload.tenantId] = payload.processResource.process_resource;
  const year: number = new Date().getFullYear();
  const firstYear: number = payload.processResource.metadata.first_year;
  const yearList: string[] = [];
  for (let i = year; i >= firstYear; i--) {
    yearList.push(String(i));
  }
  state.serviceSettings.yearList[payload.tenantId] = yearList;
  state.serviceSettings = Object.assign({}, state.serviceSettings);
}

/**
 * 今月の課金対象となっているWorkspaceサイズを設定します。
 * @param {ICoreChargeParam} payload データ
 */
export function setMaxWorkspaceGb(state: any, payload: {tenantId: string, workspace: number}): void {
  if (!payload.workspace && payload.workspace !== 0) {
    return;
  }
  state.serviceSettings.maxWorkspaceGb[payload.tenantId] = payload.workspace;
  state.serviceSettings = Object.assign({}, state.serviceSettings);
}

  /**
   * 過去の月別課金情報state.serviceSettings.monthsを設定します。
   * @param {ICoreChargeParam} payload データ
   */
export function setBillMonths(state: any, payload: {tenantId: string, bill: ICoreChargeParam}): void {
  const billings: any[] = payload.bill.billings;
  const billMonths: ICoreChargeMonth[] = [];
  const locale: string = state.common.locale;
  billings.forEach((bill: any) => {
    billMonths.push(parseBillData(bill, locale));
  });
  state.serviceSettings.months[payload.tenantId] = billMonths;
  const year: number = new Date().getFullYear();
  const firstYear: number = payload.bill.metadata.first_year;
  const yearList: string[] = [];
  for (let i = year; i >= firstYear; i--) {
    yearList.push(String(i));
  }

  state.serviceSettings.yearList[payload.tenantId] = yearList;
  state.serviceSettings = Object.assign({}, state.serviceSettings);
}

export function setCardId(state: any, payload: {tenantId: string, cardId: number}): void {
  state.serviceSettings.cardId[payload.tenantId] = payload.cardId;
  state.serviceSettings = Object.assign({}, state.serviceSettings);
}

export function setCardInfo(state: any, payload: {tenantId: string, cardInfo: any}): void {
  state.serviceSettings.cardId[payload.tenantId] = payload.cardInfo[0].credit_card_id;
  state.serviceSettings.creditCardNo[payload.tenantId] = payload.cardInfo[0].credit_card_no;
  state.serviceSettings.creditCardThrough[payload.tenantId] = payload.cardInfo[0].credit_card_through;
  state.serviceSettings = Object.assign({}, state.serviceSettings);
}

export function updateSelectedYear(state: any, payload: {tenantId: string, year: string}): void {
  if (!payload.year) {
    return;
  }
  state.serviceSettings.selectedYear[payload.tenantId] = payload.year;
  state.serviceSettings = Object.assign({}, state.serviceSettings);
}

export function setIsPaymentMaintenance(state: any, payload: {tenantId: string, isPaymentMaintenance: boolean}): void {
  state.serviceSettings.isPaymentMaintenance[payload.tenantId] = payload.isPaymentMaintenance;
  state.serviceSettings = Object.assign({}, state.serviceSettings);
}

export function setPlan(state: any, payload: {tenantId: string, plan: ICorePlanDetail}): void {
  state.serviceSettings.paymentMethod[payload.tenantId] = payload.plan.payment_method;
  state.serviceSettings.isChangeableBudget[payload.tenantId] = payload.plan.budget_changeable;
  state.serviceSettings.budgetRange[payload.tenantId] = payload.plan.budget_range || {};
  const course = payload.plan.corporate_course;
  if (course) {
    state.serviceSettings.course[payload.tenantId].name = course.name;
    state.serviceSettings.course[payload.tenantId].support = course.technical_service.limit;
    state.serviceSettings.course[payload.tenantId].minWorkspace = course.min_workspace_gb;
  }
  state.serviceSettings = Object.assign({}, state.serviceSettings);
}

export function setServices(state: any, payload: {tenantId: string, services: string[]}): void {
  state.serviceSettings.services[payload.tenantId] = payload.services;
  state.serviceSettings = Object.assign({}, state.serviceSettings);
}

export function setIsPaymentModalDisplayed(state: any, payload: {tenantId: string, isPaymentModalDisplayed: boolean}): void {
  state.serviceSettings.isPaymentModalDisplayed[payload.tenantId] = payload.isPaymentModalDisplayed;
  state.serviceSettings = Object.assign({}, state.serviceSettings);
}

export function setTopicPath(state: any, payload: {currentPath: string, isTopicPath: boolean}): void {
  state.serviceSettings.isTopicPath = payload.isTopicPath;
  state.serviceSettings.currentPath = payload.currentPath;
}

export function setNickname(state: any, payload: string): void {
  state.serviceSettings.nickname = payload;
}

export function setIsInitServiceSettings(state: any, payload: {tenantId: string, initFlag: boolean}): void {
  state.serviceSettings.isInitServiceSettings[payload.tenantId] = payload.initFlag;
  state.serviceSettings = Object.assign({}, state.serviceSettings);
}

export function showServiceSettingsLoading(state: any, payload: string): void {
  state.serviceSettings.isLoading[payload] = true;
  state.serviceSettings = Object.assign({}, state.serviceSettings);
}

export function hideServiceSettingsLoading(state: any, payload: string): void {
  state.serviceSettings.isLoading[payload] = false;
  state.serviceSettings = Object.assign({}, state.serviceSettings);
}

export function initServiceSettings(state: any, payload: ITenant[]): void {
  payload.forEach((tenant: ITenant) => {
    state.serviceSettings.workspaceInfo[tenant.tenant_id] = {
      datasetWorkspaceUsed: 0,
      jobWorkspaceUsed: 0,
      workspaceQuota: 0
    };
    state.serviceSettings.resourceInfo[tenant.tenant_id] = {
      processResource: 0,
      maxProcessResource: 0
    };
    state.serviceSettings.budget[tenant.tenant_id] = 0;
    state.serviceSettings.budgetRange[tenant.tenant_id] = {min: 0, max: 0};
    state.serviceSettings.course[tenant.tenant_id] = {};
    state.serviceSettings.charged[tenant.tenant_id] = false;
    state.serviceSettings.currencyRate[tenant.tenant_id] = 0;
    state.serviceSettings.thisMonth[tenant.tenant_id] = {};
    state.serviceSettings.months[tenant.tenant_id] = [];
    state.serviceSettings.memberCpuResourceThisMonth[tenant.tenant_id] = {};
    state.serviceSettings.memberCpuResourceMonth[tenant.tenant_id] = [];
    state.serviceSettings.cardId[tenant.tenant_id] = NaN;
    state.serviceSettings.creditCardNo[tenant.tenant_id] = '';
    state.serviceSettings.creditCardThrough[tenant.tenant_id] = '';
    state.serviceSettings.yearList[tenant.tenant_id] = [];
    state.serviceSettings.maxWorkspaceGb[tenant.tenant_id] = 0;
    state.serviceSettings.selectedYear[tenant.tenant_id] = '';
    state.serviceSettings.isPaymentMaintenance[tenant.tenant_id] = false;
    state.serviceSettings.paymentMethod[tenant.tenant_id] = '';
    state.serviceSettings.isChangeableBudget[tenant.tenant_id] = true;
    state.serviceSettings.services[tenant.tenant_id] = [];
    state.serviceSettings.isPaymentModalDisplayed[tenant.tenant_id] = false;
    state.serviceSettings.isInitServiceSettings[tenant.tenant_id] = false;
    state.serviceSettings.isLoading[tenant.tenant_id] = false;
  });
  state.serviceSettings = Object.assign({}, state.serviceSettings);
}
