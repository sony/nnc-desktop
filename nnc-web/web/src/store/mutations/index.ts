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

import * as common from './common';
import { setURI, setIsSignIn, setAccountType } from './session';
import * as dashboard from './dashboard';
import * as project from './project';
// import * as computeResource from './computeResource';
import {
  initComputeResource,
  setCompReso,
  setInstanceKeyword,
  showInstanceListLoading,
  hideInstanceListLoading,
  setInstanceChecked,
  selectInstanceAll,
  setCompResoEnvInfo
} from './computeResource';
import * as dataset from './dataset';
import {
  clearJobs,
  addJobs,
  setMiscPlans,
  setSortType,
  showJobListLoading,
  hideJobListLoading,
  initJobHistory
} from './jobHistory';
import { changeAgreeState } from './deactivate';
import {
  setUserWorkspaceInfoServiceSettings,
  setUserResourceInfoServiceSettings,
  setBudget,
  setCurrencyRateForBudget,
  setBillThisMonth,
  setBillMonths,
  setCardId,
  setCardInfo,
  setMaxWorkspaceGb,
  updateSelectedYear,
  setIsPaymentMaintenance,
  setPlan,
  setServices,
  setIsPaymentModalDisplayed,
  setTopicPath,
  setNickname,
  setIsInitServiceSettings,
  showServiceSettingsLoading,
  hideServiceSettingsLoading,
  initServiceSettings,
  setMemberCpuResourceThisMonth,
  setMemberCpuResourceMonth
} from './serviceSettings';

import {
  setTenantList,
  setTenantMemberList,
  setTenantId,
  setCheckedTenantMember,
  setAllCheckedTenantMember,
  changeAmountType,
  initTenant,
  updateTenantName
} from './tenant';


export default {
  ...common,
  setURI,
  setIsSignIn,
  setAccountType,
  ...dashboard,
  ...project,
  ...dataset,
  clearJobs,
  addJobs,
  setMiscPlans,
  setSortType,
  showJobListLoading,
  hideJobListLoading,
  initJobHistory,
  changeAgreeState,
  setUserWorkspaceInfoServiceSettings,
  setUserResourceInfoServiceSettings,
  setBudget,
  setCurrencyRateForBudget,
  setBillThisMonth,
  setBillMonths,
  setCardId,
  setCardInfo,
  setMaxWorkspaceGb,
  updateSelectedYear,
  setIsPaymentMaintenance,
  setPlan,
  setServices,
  setIsPaymentModalDisplayed,
  setTopicPath,
  setNickname,
  setIsInitServiceSettings,
  showServiceSettingsLoading,
  hideServiceSettingsLoading,
  initServiceSettings,
  setTenantList,
  setTenantMemberList,
  setTenantId,
  setCheckedTenantMember,
  setAllCheckedTenantMember,
  changeAmountType,
  initTenant,
  updateTenantName,
  setMemberCpuResourceThisMonth,
  setMemberCpuResourceMonth,
  initComputeResource,
  setCompReso,
  setInstanceKeyword,
  showInstanceListLoading,
  hideInstanceListLoading,
  setInstanceChecked,
  selectInstanceAll,
  setCompResoEnvInfo
};
