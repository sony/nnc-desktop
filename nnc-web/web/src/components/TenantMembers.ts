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

/// <reference path="../@types/index.d.ts" />
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import store from '../store/index';
import { IMemberObj, ITenantObj, IElapsedTimeForEachInstances } from '../store/state/tenant';
import { IInstance as IMiscInstance } from '../store/state/jobHistory';
import {CoreApiClient} from '../CoreApiClient';
import {ConvertUtil} from '../util/ConvertUtil';
import {SwalUtil, IUsedInstanceDetail} from '../util/SwalUtil';
import {ROLE_LIST} from '../Const';
import { ITenantMembers, IInstance } from '../interfaces/core-response/ITenant';
import {OWNER_ROLE, ADMIN_ROLE, USER_ROLE} from '../interfaces/core-response/IServiceSettings';
import router from '../router/index';
import { DateFormatUtil } from '../util/DateFormatUtil';
import Loading2 from '../components/Loading2.vue';
import text from '../messages/Text';
import {StringUtil} from '../util/StringUtil';

const PENDING_STATUS: string = 'pending';
const FAILED_STATUS: string = 'mail_failure';
const EXPIRED_STATUS: string = 'invitation_expired';
import {PAGES} from '../Const';

import { AxiosError } from 'axios';

@Component({
  name: 'TenantMembers',
  components: {
    Loading2
  }
})
export default class TenantMembers extends Vue {
  @Prop() public selectedTenantId!: string;
  @Prop() public componentTitle!: string;
  @Prop() public label!: string;
  @Prop() public hasShareTenant!: boolean;
  @Prop() public isLocalTenant!: boolean;
  @Prop() public isLoading!: boolean;

  public mounted() {
    if (!store.state.serviceSettings.isInitServiceSettings) {
      router.push({ path: '/serviceSettings' });
    }
    if (!store.state.jobHistory.plans.instances.length) {
      CoreApiClient.getMiscPlans().then((res: any) => {
        store.commit('setMiscPlans', res);
      });
    }
  }

  private getTenantMembers(userId: string, tenantId: string): void {
    store.commit('showServiceSettingsLoading', tenantId);
    CoreApiClient.getTenantMembers(userId, tenantId).then((response: ITenantMembers) => {
      store.commit('setTenantMemberList', {tenantId: this.selectedTenantId, memberList: response.members});
      store.commit('hideServiceSettingsLoading', tenantId);
    }, (error: any) => {
      this.$emit('apierror', error);
    });
  }

  private onUnexpectedError(apiResponse: any): void {
    store.commit('setHideAllLoading', this.selectedTenantId);
    const pageUrl: string = location.href;
    let apiUrl: string;
    let method: string;
    let error: string;
    let message: string;
    if (apiResponse.response === undefined) {
      apiUrl  = apiResponse.config.url;
      method = apiResponse.config.method;
      error = 'ERROR';
      message = apiResponse.message;
    } else {
      apiUrl = apiResponse.response.config.url;
      method = apiResponse.response.config.method;
      error = apiResponse.response.data.error;
      message = apiResponse.response.data.message;
    }
    const userID: string = localStorage.getItem('u') || '';
    CoreApiClient.postLog(pageUrl, apiUrl, method, error, message, userID);
    SwalUtil.alert(text[store.state.common.language].dialogTexts.PLEASE_TRY_AGAIN_AFTER_A_WHILE);
  }

  public getMemberList(): IMemberObj[] {
    return store.state.tenant.memberList[this.selectedTenantId].filter((member: IMemberObj) => !member.deleted);
  }

  public convertWorkspaceUsed(workspaceUsed: number): string {
    return ConvertUtil.convertByteToGB(workspaceUsed, true) + 'GB';
  }

  public getTypeName(role: string): string {
    switch (role) {
      case OWNER_ROLE:
        return 'master';

      case ADMIN_ROLE:
        return 'administrator';

      case USER_ROLE:
        return 'user';

      default:
        return '';
    }
  }

  public isPending(status: string): boolean {
    return status === PENDING_STATUS;
  }

  public isFailed(status: string): boolean {
    return status === FAILED_STATUS;
  }

  public isExpired(status: string): boolean {
    return status === EXPIRED_STATUS;
  }

  public hasAdminRole(): boolean {
    const myUserId: string = store.state.common.userId;
    const member: IMemberObj | undefined = this.getMemberList().find((_member: IMemberObj) => _member.userId === myUserId);
    if (member) {
      return member.role === OWNER_ROLE || member.role === ADMIN_ROLE;
    }
    return false;
  }

  public isChangeableRole(userId: string, role: string, status: string): boolean {
    const myUserId: string = store.state.common.userId;
    if (userId === myUserId) {
      return false;
    }
    if (role === 'owner') {
      return false;
    }
    if (this.isPending(status) || this.isFailed(status) || this.isExpired(status)) {
      return false;
    }
    return true;
  }

  public isDeletableUser(userId: string, role: string): boolean {
    const myUserId: string = store.state.common.userId;
    if (userId === myUserId) {
      return false;
    }
    if (role === 'owner') {
      return false;
    }
    return true;
  }

  public changeRole(userId: string, nickname: string, currentRole: string): void {
    const message: string = text[store.state.common.language].dialogTexts.SELECT_USER_TYPE;
    SwalUtil.select({message, selected: currentRole, selectList: ROLE_LIST}, (role: string) => {
      if (role === currentRole) {
        // 変更がない為、何もしない
        return;
      }
      const myUserId: string = store.state.common.userId;
      const tenantId: string = store.state.tenant.selectedTenantId;
      CoreApiClient.updateRole(myUserId, tenantId, userId, role).then(() => {
        this.getTenantMembers(myUserId, tenantId);
      }, (error: any) => {
        this.$emit('apierror', error);
      });
    });
  }

  public deleteUser(userId: string, nickname: string): void {
    let message: string;
    if (nickname) {
      message = `${userId}` + StringUtil.format(text[store.state.common.language].dialogTexts.NICKNAME_WILL_BE_REMOVE_FROM_GROUP, nickname);
    } else {
      message = `${userId}` + text[store.state.common.language].dialogTexts.WILL_BE_REMOVE_FROM_GROUP;
    }

    const myUserId: string = store.state.common.userId;
    const tenantId: string = store.state.tenant.selectedTenantId;
    SwalUtil.confirm(message, () => {
      CoreApiClient.deleteTenantMember(myUserId, tenantId, userId).then(() => {
        this.getTenantMembers(myUserId, tenantId);
      }, (error: any) => {
        this.$emit('apierror', error);
      });
    });
  }

  private isNotFoundError(error: any): boolean {
    try {
      return error.response.data.error === 'NNCD_MEMBER_NOT_FOUND';
    } catch (e) {
      return false;
    }
  }

  private isNotSupportedError(error: any): boolean {
    try {
      return error.response.data.error === 'NNCD_NOT_SUPPORTED_ON_ID_PROVIDER';
    } catch (e) {
      return false;
    }
  }

  private isAlreadyInvited(error: any): boolean {
    try {
      return error.response.data.error === 'NNCD_MEMBER_ALREADY_EXISTS';
    } catch (e) {
      return false;
    }
  }

  private isEmailAddressNotRegistered(error: AxiosError): boolean {
    return !!error.response && error.response.data.error === 'NNCD_EMAIL_ADDRESS_NOT_REGISTERED';
  }

  private onInviteError(tenantId: string, errorResponse: AxiosError): void {
    if (this.isNotFoundError(errorResponse)) {
      store.commit('hideServiceSettingsLoading', tenantId);
      SwalUtil.alert(text[store.state.common.language].dialogTexts.USER_NOT_FOUND);
    } else if (this.isAlreadyInvited(errorResponse)) {
      store.commit('hideServiceSettingsLoading', tenantId);
      SwalUtil.alert(text[store.state.common.language].dialogTexts.USER_HAS_ALREADY_INVITED);
    } else if (this.isNotSupportedError(errorResponse)) {
      store.commit('hideServiceSettingsLoading', tenantId);
      SwalUtil.alert(text[store.state.common.language].dialogTexts.UNSUPPORTED_PROVIDER);
    } else if (this.isEmailAddressNotRegistered(errorResponse)) {
      store.commit('hideServiceSettingsLoading', tenantId);
      SwalUtil.alert(text[store.state.common.language].dialogTexts.EMAIL_ADDRESS_NOT_REGISTERED);
    } else {
      this.onUnexpectedError(errorResponse);
    }
  }

  public onClickInvite(): void {
    const message: string = text[store.state.common.language].dialogTexts.ENTER_USER_ID_TO_INVITE;
    SwalUtil.inputUserId({message}, (userId: string) => {
      const myUserId: string = store.state.common.userId;
      const tenantId: string = store.state.tenant.selectedTenantId;
      store.commit('showServiceSettingsLoading', tenantId);
      CoreApiClient.inviteMember(myUserId, tenantId, userId).then(() => {
        this.getTenantMembers(myUserId, tenantId);
      }, (error: any) => {
        this.$emit('apierror', error, this.onInviteError.bind(this, tenantId));
      });
    });
  }

  public onClickAction(): void {
    const actionList: HTMLElement | null = document.getElementById('action-list-tenant-members');
    const icon: HTMLElement | null = document.getElementById('action-icon-tenant-members');
    if (!actionList || !icon) {
      return;
    }
    actionList.style.display = actionList.style.display !== 'block' ? 'block' : 'none';
    const actionWidth: number = actionList.clientWidth;
    const iconTop: number = icon.getBoundingClientRect().top;
    const iconLeft: number = icon.getBoundingClientRect().left;
    const iconHeight: number = icon.clientHeight;
    const iconWidth: number = icon.clientWidth;
    actionList.style.top = (iconTop + iconHeight).toString() + 'px';
    const leftMenuWidth: number = (document.getElementById('menu-container') || {clientWidth: 0}).clientWidth;
    actionList.style.left = (iconLeft + iconWidth - actionWidth - leftMenuWidth) + 'px';
  }

  public select(e: any, userId: string): void {
    store.commit('setCheckedTenantMember', {tenantId: this.selectedTenantId, userId: userId, checked: e.target.checked});
  }

  public selectAll(e: any): void {
    store.commit('setAllCheckedTenantMember', {tenantId: this.selectedTenantId, checked: e.target.checked, myUserId: store.state.common.userId});
  }

  public deleteAll(e: any): void {
    const deletedIds: string[] = this.getMemberList().filter((member: IMemberObj) => member.checked).map((member: IMemberObj) => member.userId);
    if (!deletedIds.length) {
      e.stopPropagation();
      return;
    }

    SwalUtil.confirm(text[store.state.common.language].dialogTexts.ALL_SELECTED_USER_REMOVE_FROM_GROUP, () => {
      const myUserId: string = store.state.common.userId;
      const tenantId: string = this.selectedTenantId;
      store.commit('showServiceSettingsLoading', tenantId);
      CoreApiClient.deleteTenantMembers(myUserId, tenantId, deletedIds).then(() => {
        this.getTenantMembers(myUserId, tenantId);
      }, (error: any) => {
        this.$emit('apierror', error);
      });
    });

  }

  public checked(): boolean {
    return this.getMemberList().some((member: IMemberObj) => member.checked);
  }

  public allChecked(): boolean {
    return store.state.tenant.allChecked[this.selectedTenantId];
  }

  public onChangeAmountType(e: HTMLSelectElement): void {
    store.commit('changeAmountType', {tenantId: this.selectedTenantId, type: e.target.value});
  }

  /**
   * countryCodeに応じた通貨記号を返します。
   */
  public getCurrencySymbol(): string {
    const countryCode = store.state.common.countryCode;
    let currencyUnit: string = '';
    switch (countryCode) {
      case 'JP':
        currencyUnit = '&yen;';
        break;
      case 'US':
        currencyUnit = '$';
        break;
    }
    return currencyUnit;
  }

  get selectedAmountType(): string {
    return store.state.tenant.selectedAmountType[this.selectedTenantId];
  }

  public shouldShowCurrencySymbol(elapsedTimeForEachInstances: IElapsedTimeForEachInstances): boolean {
    return elapsedTimeForEachInstances[this.selectedAmountType].length !== 0;
  }

  private calcPrice(elapsedTime: number, pricePerHour: number): number {
    return Math.ceil((elapsedTime / 3600) * pricePerHour);
  }

  public getPrice(elapsedTimeForEachInstances: IElapsedTimeForEachInstances): string {
    const elapsedTimeForEachInstance: IInstance[] = elapsedTimeForEachInstances[this.selectedAmountType];
    if (!elapsedTimeForEachInstance.length) {
      return '-';
    }

    let price: number = 0;
    const instances: IMiscInstance[] = store.state.jobHistory.plans.instances;
    if (!instances.length) {
      return '-';
    }
    elapsedTimeForEachInstance.forEach((instance: IInstance) => {
      const targetInstance: IMiscInstance | undefined = instances.find((miscInstance: IMiscInstance) => miscInstance.instanceType === instance.instance_type);
      if (targetInstance) {
        price += this.calcPrice(instance.elapsed_time, targetInstance.price);
      }
    });

    const locale: string = store.state.common.locale;
    const currencyRate: number = store.state.jobHistory.plans.currencyRate[locale];
    return ConvertUtil.convertPriceToDispPrice(price, currencyRate, locale);

  }

  private parseElapsedTime(elapsedTime: number): string {
    return DateFormatUtil.getElapsedTime(String(elapsedTime));
  }

  public showDetails(elapsedTimeForEachInstances: IElapsedTimeForEachInstances): void {
    const elapsedTimeForEachInstance: IInstance[] = elapsedTimeForEachInstances[this.selectedAmountType];
    if (!elapsedTimeForEachInstance.length) {
      return;
    }
    const instances: IMiscInstance[] = store.state.jobHistory.plans.instances;
    if (!instances.length) {
      return;
    }
    const details: IUsedInstanceDetail[] = [];
    const locale: string = store.state.common.locale;
    const currencyRate: number = store.state.jobHistory.plans.currencyRate[locale];
    elapsedTimeForEachInstance.forEach((instance: IInstance) => {
      const targetInstance: IMiscInstance | undefined = instances.find((miscInstance: IMiscInstance) => miscInstance.instanceType === instance.instance_type);
      if (targetInstance) {
        details.push({
          processor: targetInstance.description[locale],
          time: this.parseElapsedTime(instance.elapsed_time),
          amount: ConvertUtil.convertPriceToDispPrice(this.calcPrice(instance.elapsed_time, targetInstance.price), currencyRate, locale)
        });
      }
    });
    SwalUtil.showUsedInstanceDetails(details);
  }

  get vueTexts(): string {
    return text[store.state.common.language].vueTexts.tenantMembers;
  }

}
