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

import { IGetMaintenance } from '../../interfaces/core-response/IMisc';
import { IState } from '../state';

/**
 * 法人フラグを設定
 * @param state
 * @param isBusiness
 */
export function setIsBusiness(state: IState, isBusiness: boolean): void {
  state.common.isBusiness = isBusiness;
}

/**
 * アカウントメニューを表示します
 * @param state
 */
export function showAccountMenu(state: any): void {
  state.common.shouldShowAccountMenu = true;
}

/**
 * アカウントメニューを非表示にします
 * @param state
 */
export function hideAccountMenu(state: any): void {
  state.common.shouldShowAccountMenu = false;
}

/**
 * サンプルプロジェクトの吹き出しを表示します
 * @param state
 */
export function showSampleProjectBalloon(state: any): void {
  state.common.shouldShowSampleProjectBalloon = true;
}

/**
 * サンプルプロジェクトの吹き出しを非表示にします
 * @param state
 */
export function hideSampleProjectBalloon(state: any): void {
  state.common.shouldShowSampleProjectBalloon = false;
}

/**
 * ローディングアニメーションを表示します
 * @param {*} state
 */
export function showLoading(state: any, payload: string): void {
  state.common.isLoading[payload] = true;
}

/**
 * ローディングアニメーションを非表示にします
 * @param {*} state
 */
export function hideLoading(state: any, payload: string): void {
  if (payload === 'all') {
    state.common.isLoading[payload] = false;
    for (const key of Object.keys(state.common.isLoading)) {
      state.common.isLoading[key] = false;
    }
  } else {
    state.common.isLoading[payload] = false;
  }
}

/**
 * 初期化フラグを設定します
 * @param {*} state
 */
export function setIsInitialized(state: any, isInitialized: boolean): void {
  state.common.isInitialized = isInitialized;
}

/**
 * dashboard内の全てローディングを非表示にします
 * @param {*} state
 */
export function setHideAllLoading(state: any, payload?: string): void {
  state.common.isLoading.common = false;
  state.common.isLoading.dashboard = false;
  state.common.isLoading.publicProject = false;
  if (payload) {
    state.dataset.datasetListLoading[payload] = false;
    state.project.projectListLoading[payload] = false;
    state.project.projectJobListLoading[payload] = false;
    state.dataset.datasetPreviewListLoading[payload] = false;
    state.jobHistory.jobListLoading[payload] = false;
    state.serviceSettings.isLoading[payload] = false;
  }
  state.project = Object.assign({}, state.project);
  state.dataset = Object.assign({}, state.dataset);
  state.jobHistory = Object.assign({}, state.jobHistory);
  state.serviceSettings = Object.assign({}, state.serviceSettings);
}

/**
 * ToS表示に必要な情報を設定します
 * @param {*} state
 */
export function setTOSInfo(state: any, tosInfo: any): void {
  state.common.countryCode = tosInfo.latest.country_code;
  state.common.locale = tosInfo.latest.locale;
  state.common.tosVersion = tosInfo.latest.version;
}

/**
 * メンテナンス情報を設定します
 * @param {*} state
 * @param {*} coreから取得したメンテナンス情報
 */
export function setMaintenance(state: any, info: IGetMaintenance): void {
  const maintenanceInfo: any = info.maintenance;
  state.common.maintenance.payment = maintenanceInfo.payment;
  state.common.adjustmentTime = (new Date().getTime() / 1000) - info.current_unix_time;
}

/**
 * 選択されているコンポーネントを設定します
 * @param {*} state
 */
export function selectComponent(state: any, component: string): void {
  state.common.selectedComponent = component;
}

export function setProjectIdFromUrl(state: any, projectId: string): void {
  state.common.projectIdFromUrl = projectId;
}

export function setUserId(state: any, payload: string): void {
  state.common.userId = payload;
}

/**
 * 言語情報を設定します
 * @param {*} state
 */
export function setLanguage(state: any, payload: string): void {
  state.common.language = payload;
}
