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

import Vue from 'vue';
import { Route } from 'vue-router';
import Component from 'vue-class-component';
import store from '../store/index';
import router from '../router/index';
import AccountMenu from '../components/AccountMenu.vue';
import LeftMenu from '../components/LeftMenu.vue';
import Loading from '../components/Loading.vue';
import {CoreApiClient} from '../CoreApiClient';
import {SwalUtil} from '../util/SwalUtil';
import {MenuResizeUtil} from '../util/MenuResizeUtil';
import {ResourceInfoUtil} from '../util/ResourceInfoUtil';
import { StringUtil } from '../util/StringUtil';
import { Watch } from 'vue-property-decorator';
import { ITenantObj } from '../store/state/tenant';
import { USER_ROLE } from '../interfaces/core-response/IServiceSettings';
import { ITenant } from '../interfaces/core-response/ITenant';
import {LANGUAGES} from '../Const';
import text from '../messages/Text';
import { ICreateSession } from '../interfaces/core-response/ISession';
import { IGetTOS } from '../interfaces/core-response/ITOS';
import { IGetMaintenance, IGetPlan } from '../interfaces/core-response/IMisc';
import { AxiosError } from 'axios';
import { ISupport } from '../store/state/dashboard';

declare global {
  interface Window {
    lockedAuthAPI?: boolean;
  }
}

@Component({
  name: 'Index',
  components: {
    AccountMenu,
    LeftMenu,
    Loading
  }
})
export default class Index extends Vue {
  public mounted(): void {
    const code: string = StringUtil.parseQueryString('code');
    const state: string = StringUtil.parseQueryString('state');
    if (code && state) {
      window.location.href = `/console/#/signin?code=${code}&state=${state}`;
      return;
    }

    if (!localStorage.getItem('b')) {
      store.commit('showSampleProjectBalloon');
    }
    const userID: string = localStorage.getItem('u') || '';
    CoreApiClient.checkSignin(userID).then((res: ICreateSession) => {
      const provider: string = this.convertProviderType(res.id_provider);
      store.commit('setURI', res);
      store.commit('setIsSignIn', true);
      store.commit('setUserId', userID);
      store.commit('setAccountType', provider);
      localStorage.setItem('a', provider);
      localStorage.removeItem('_a');
      CoreApiClient.getTOSPP().then((response: IGetTOS) => {
        if (response.needs_agreement) {
          const hash: string = response.latest.hash;
          let url: string = response.latest.url;
          if (store.state.common.isBusiness) {
            url += '?business=true';
          }
          SwalUtil.showTOSPP(url, () => {
            this.onClickAgreement(hash);
          });
        }
        if (response && response.latest && response.latest.locale) {
          localStorage.setItem('l', response.latest.locale);
        }
        store.commit('setTOSInfo', response);
        CoreApiClient.getInformation('maintenance', undefined, response.latest.country_code).then((maintenanceInfo: IGetMaintenance) => {
          store.commit('setMaintenance', maintenanceInfo);
        }, (error: AxiosError) => {
          this.onApiError(error);
        });

        if (location.href.indexOf('?project_id') !== -1) {
          const projectIdInParam: string = StringUtil.parseQueryString('project_id');
          store.commit('setProjectIdFromUrl', projectIdInParam);
          router.push({ path: 'project' });
        }
        const onlyMyProjFromUrl: string = StringUtil.parseQueryString('only_my_proj');
        store.commit('setOnlyMyProject', onlyMyProjFromUrl.toLocaleLowerCase() === 'true');
        CoreApiClient.getTenants(userID).then((tenantResponse: {tenants: ITenant[]}) => {
          const tenantId: string = StringUtil.parseQueryString('tenant_id');
          const tenantList: ITenant[] = tenantResponse.tenants;

          store.commit('setTenantList', tenantList);
          store.commit('initProject', tenantList);
          store.commit('initDataset', tenantList);
          store.commit('initComputeResource', tenantList);
          store.commit('initJobHistory', tenantList);
          store.commit('initServiceSettings', tenantList);
          store.commit('initPipeline', tenantList);
          store.commit('initTenant', tenantList);

          if (tenantList.findIndex((tenant: ITenant) => tenant.tenant_id === tenantId) !== -1) {
            store.commit('setTenantId', tenantId);
          }
          ResourceInfoUtil.updateAll(tenantResponse.tenants).then(() => {
            store.commit('setIsInitialized', true);
          });
        }, (error: AxiosError) => {
          this.onApiError(error);
        });
      }, (error: AxiosError) => {
        this.onApiError(error);
      });
      CoreApiClient.getMiscPlans().then((planResponse: IGetPlan) => {
        store.commit('setMiscPlans', planResponse);
      });
    }, (error: AxiosError) => {
      this.onApiError(error);
    });

    const languageFromLocalStrage: string | null = localStorage.getItem('sl');
    if (languageFromLocalStrage && this.isCorrectLang(languageFromLocalStrage)) {
      store.commit('setLanguage', languageFromLocalStrage);
    } else {
      const DEFAULT_LANGUAGE: string = 'en';
      localStorage.setItem('sl', DEFAULT_LANGUAGE);
      store.commit('setLanguage', DEFAULT_LANGUAGE);
    }

  }

  private convertProviderType(provider: string): string {
    switch (provider) {
      case 'sony':
        return 's';
      case 'google':
        return 'g';
      case 'jfe':
        return 'j';
      default:
        return 's';
    }
  }

  public isCorrectLang(language: string): boolean {
    return LANGUAGES.some((lang: {'value': string, 'label': string}) => {
      return lang.value === language;
    });
  }

  @Watch('$route')
  public onRouteChange(newValue: Route, oldValue: Route): void {
    const PROJECT_PATH: string = '/project';
    if (oldValue.path === PROJECT_PATH && newValue.path === PROJECT_PATH) {
      return;
    }
    if (!oldValue.query.project_id && newValue.query.project_id) {
      const projectIdInParam: string = newValue.query.project_id;
      store.commit('setProjectIdFromUrl', projectIdInParam);
      router.push({ path: 'project'});
    }
  }

  private hasErrorResponse(error: AxiosError): boolean {
    return error && error.response ? true : false;
  }

  private isAuthorizedError(error: AxiosError): boolean {
    return !!error.response && error.response.status === 400 && error.response.data.error === 'NNCD_UNAUTHORIZED';
  }

  private isInvalidUserId(error: AxiosError): boolean {
    return !!error.response && error.response.status === 400 && error.response.data.message === 'invalid_user_id.';
  }

  private isStorageLimitExceededError(error: AxiosError): boolean {
    return !!error.response && error.response.status === 400 && error.response.data.error === 'NNCD_STORAGE_LIMIT_EXCEEDED';
  }

  private onUnAuthorized(): void {
    if (window.lockedAuthAPI) {
      return;
    }
    window.lockedAuthAPI = true;
    const account: string = store.state.session.account || localStorage.getItem('a') || '';
    switch (account) {
      case 's':
      case 'g':
        SwalUtil.alert(text[store.state.common.language].dialogTexts.SESSION_HAS_EXPIRED, () => {
          if (account === 's') {
            onUnAuthorized(ACCOUNT.SONY);
          } else {
            onUnAuthorized(ACCOUNT.GOOGLE);
          }
        });
        break;

      default:
        const message: string = text[store.state.common.language].dialogTexts.SESSION_HAS_EXPIRED;
        SwalUtil.selectAccount(message, () => {
          onUnAuthorized(ACCOUNT.SONY);
        }, () => {
          onUnAuthorized(ACCOUNT.GOOGLE);
        });
        break;
    }
  }

  private onUnexpectedError(apiResponse: AxiosError): void {
    store.commit('setHideAllLoading', store.state.tenant.selectedTenantId);
    const pageUrl: string = location.href;
    let apiUrl: string;
    let method: string;
    let error: string;
    let message: string;
    if (!apiResponse.response) {
      apiUrl  = apiResponse.config.url || '';
      method = apiResponse.config.method || '';
      error = 'ERROR';
      message = apiResponse.message;
    } else {
      apiUrl = apiResponse.response.config.url || '';
      method = apiResponse.response.config.method || '';
      error = apiResponse.response.data.error;
      message = apiResponse.response.data.message;
    }
    const userID: string = localStorage.getItem('u') || '';
    CoreApiClient.postLog(pageUrl, apiUrl, method, error, message, userID);
    SwalUtil.alert(text[store.state.common.language].dialogTexts.PLEASE_TRY_AGAIN_AFTER_A_WHILE);
  }

  public onClickAgreement(hash: string): void {
    CoreApiClient.updateTOSPP({hash: hash}).then(() => {
      return;
    }, (error: AxiosError) => {
      this.onApiError(error);
    });
  }

  public isInitialized(): boolean {
    return store.state.common.isInitialized;
  }

  public isLoading(): boolean {
    return store.state.common.isLoading['common'];
  }

  public shouldShowAccountMenu(): boolean {
    return store.state.common.shouldShowAccountMenu;
  }

  public getTOSVersion(): string {
    return store.state.common.tosVersion;
  }

  public getCountryCode(): string {
    return store.state.common.countryCode;
  }

  public getLocale(): string {
    return store.state.common.locale;
  }

  public getSelectedComponent(): string {
    return store.state.common.selectedComponent;
  }

  public getTenantList(): ITenantObj[] {
    return store.state.tenant.tenantList;
  }

  public getSelectedTenant(): string {
    return store.state.tenant.selectedTenantId;
  }

  public onClicktenantTab(tenantId: string): void {
    store.commit('setTenantId', tenantId);
  }

  public hasShareTenant(): boolean {
    return store.state.tenant.tenantList.length > 1;
  }

  public isLocalTenant(): boolean {
    const localTenant: ITenantObj | undefined = store.state.tenant.tenantList.find((tenant: ITenantObj) => tenant.isLocal);
    if (localTenant) {
      return this.getSelectedTenant() === localTenant.tenantId;
    }
    return true;
  }

  public onClickLeftMenu(component: string): void {
    switch (component) {
      case 'dashboard':
      case 'project':
      case 'dataset':
      case 'computeResource':
      case 'jobHistory':
      case 'sampleProject':
      case 'pipeline':
      case 'serviceSettings':
      case 'deactivate':
        router.push({ path: '/' + component });
        break;

      default:
        break;
    }
  }

  private resizeLeftMenu(e: Event): void {
    e.preventDefault();
    MenuResizeUtil.resize('menu-container', 'right-menu-border');
  }

  /**
   * CoreApiを叩いた際にエラーが返却された際の処理
   * @param apiResponse APIレスポンス
   * @param errorHandling 共通エラーハンドリング以外で行うエラーハンドリング(Optional)
   */
  public onApiError(apiResponse: AxiosError, errorHandling?: (apiResponse: AxiosError) => void): void {
    if (!this.hasErrorResponse(apiResponse)) {
      this.onUnexpectedError(apiResponse);
      return;
    } else if (this.isAuthorizedError(apiResponse) || this.isInvalidUserId(apiResponse)) {
      this.onUnAuthorized();
      return;
    } else if (this.isStorageLimitExceededError(apiResponse)) {
      const isRegistered: boolean = store.state.serviceSettings.charged[this.getSelectedTenant()];
      let message: string = '';
      let buttonName: string = '';
      if (this.isUserRole(apiResponse)) {
        message = text[store.state.common.language].dialogTexts.WORKSPACE_IS_FULL_CONTACT_ADMIN;
        SwalUtil.alert(message, () => {
          store.commit('hideLoading', 'all');
        });
        return;
      } else if (isRegistered) {
        message = text[store.state.common.language].dialogTexts.WORKSPACE_IS_FULL;
        buttonName = 'Go to Service Settings';
      } else {
        message = text[store.state.common.language].dialogTexts.YOU_HAVE_CONSUMED_ALL_WORKSPACE;
        buttonName = 'Enter credit card';
      }
      const tenantId: string = this.getTenantIdFromErrorResponse(apiResponse);
      SwalUtil.alert(message, () => {
        store.commit('hideLoading', 'all');
        router.push({ path: 'serviceSettings' });
        if (this.getTenantList().findIndex((tenant: ITenantObj) => tenant.tenantId === tenantId) !== -1) {
          store.commit('setTenantId', tenantId);
        }
      }, undefined, buttonName);
      return;
    }
    (errorHandling || (() => this.onUnexpectedError(apiResponse)))(apiResponse);
  }

  private getTenantIdFromErrorResponse(apiResponse: AxiosError): string {
    let tenantId: string = '';
    if (apiResponse.config.method === 'post' || apiResponse.config.method === 'put') {
      try {
        tenantId = JSON.parse(apiResponse.config.data).tenant_id;
      } catch (e) {
        return '';
      }
    } else {
      tenantId = apiResponse.config.params.tenant_id;
    }
    return tenantId;
  }

  private isUserRole(apiResponse: AxiosError): boolean {
    const tenantId: string = this.getTenantIdFromErrorResponse(apiResponse);

    const tenant: ITenantObj | undefined = this.getTenantList().find((_tenant: ITenantObj) => _tenant.tenantId === tenantId);
    if (tenant) {
      return tenant.role === USER_ROLE;
    }
    return false;
  }

  get language(): string {
    return store.state.common.language;
  }

  get userId(): string {
    return store.state.common.userId;
  }

}

window.onresize = () => {
  const actionList: HTMLElement | null = document.getElementById('action-list');
  const icon: HTMLElement | null = document.getElementById('action-icon');
  if (actionList && icon) {
    const iconTop = icon.getBoundingClientRect().top;
    const iconLeft = icon.getBoundingClientRect().left;
    const iconHeight = icon.clientHeight;
    actionList.style.top = (iconTop + iconHeight).toString() + 'px';
    actionList.style.left = iconLeft + 'px';
  }

  const tenantActionList: HTMLElement | null = document.getElementById('action-list-tenant-members');
  const tenantIcon: HTMLElement | null = document.getElementById('action-icon-tenant-members');
  if (tenantActionList && tenantIcon) {
    const actionWidth: number = tenantActionList.clientWidth;
    const iconTop: number = tenantIcon.getBoundingClientRect().top;
    const iconLeft: number = tenantIcon.getBoundingClientRect().left;
    const iconHeight: number = tenantIcon.clientHeight;
    const iconWidth: number = tenantIcon.clientWidth;
    tenantActionList.style.top = (iconTop + iconHeight).toString() + 'px';
    tenantActionList.style.left = (iconLeft + iconWidth - actionWidth) + 'px';
  }
};
