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
import { Prop } from 'vue-property-decorator';
import Component from 'vue-class-component';
import { ITenantObj } from '../store/state/tenant';
import store from '../store/index';
import {CoreApiClient} from '../CoreApiClient';
import text from '../messages/Text';
import {SwalUtil} from '../util/SwalUtil';
import {OWNER_ROLE, ADMIN_ROLE} from '../interfaces/core-response/IServiceSettings';

@Component({
  name: 'TenantTabs'
})
export default class TenantTabs extends Vue {
  @Prop() public tenantList!: ITenantObj[];
  @Prop() public selectedTenantId!: string;
  @Prop() public onClickTenantTab!: (tenantId: string) => void;
  @Prop() public warningList!: {tenantId: string, shouldShowWarning: boolean}[];

  public shouldShowRenameInput: {[tenantId: string]: boolean} = {};
  public inputedTenantName: {[tenantId: string]: string} = {};
  public selectTenantIdForRename: string = '';

  public created() {
    if (this.tenantList && this.tenantList.length) {
      this.tenantList.forEach((tenant: ITenantObj) => {
        this.$set(this.shouldShowRenameInput, tenant.tenantId, false);
        this.$set(this.inputedTenantName, tenant.tenantId, tenant.nickname);
      });
    }
  }

  public isSelected(tenantId: string): boolean {
    return tenantId === this.selectedTenantId;
  }

  public onClick(tenantId: string): void {
    if (this.isSelected(tenantId)) {
      return;
    }
    this.onClickTenantTab(tenantId);
  }

  public onClickRename(e: any, tenantId: string): void {
    if (!this.shouldShowRenameInput[this.selectTenantIdForRename]) {
      this.shouldShowRenameInput[tenantId] = true;
      this.selectTenantIdForRename = tenantId;
      Vue.nextTick(() => {
        const input: any = document.getElementById(this.selectTenantIdForRename);
        if (input) {
          input.focus();
        }
      });
    }
  }

  public onKeydownTenantName(e: any): void {
    switch (e.keyCode) {
      case 27: // Esc
      case 13: // Enter
        e.target.blur();
        break;

      default:
        break;
    }
  }

  public inputTenantName(tenantId: string, tenantName: string): void {
    this.inputedTenantName[tenantId] = tenantName;
  }

  public rename(e: any): void {
    const foundTenant: ITenantObj | undefined = this.tenantList.find((tenant: ITenantObj) => tenant.tenantId === this.selectTenantIdForRename);
    if (!foundTenant || !this.inputedTenantName[this.selectTenantIdForRename] || this.inputedTenantName[this.selectTenantIdForRename] === foundTenant.nickname) {
      this.shouldShowRenameInput[this.selectTenantIdForRename] = false;
      return;
    }
    const userId: string = store.state.common.userId;
    const newTenantName: string = this.inputedTenantName[this.selectTenantIdForRename];
    CoreApiClient.updateTenantName(userId, this.selectTenantIdForRename, newTenantName).then(() => {
      this.shouldShowRenameInput[this.selectTenantIdForRename] = false;
      if (foundTenant) {
        foundTenant.nickname = newTenantName;
        store.commit('updateTenantName', foundTenant);
      }
    }, (error: any) => {
      this.shouldShowRenameInput[this.selectTenantIdForRename] = false;
      this.inputedTenantName[this.selectTenantIdForRename] = foundTenant.nickname;
      this.$emit('apierror', error, (errorResponse: any) => {
        if (this.isInvalidTenantName(errorResponse)) {
          SwalUtil.alert(text[store.state.common.language].dialogTexts.INVALID_CHARACTER_INCLUDED);
        } else {
          this.onUnexpectedError(errorResponse);
        }
      });
    });
  }

  private isInvalidTenantName(error: any): boolean {
    return error.response.status === 400 && error.response.data.message === 'Invalid body(schema error)';
  }

  private onUnexpectedError(apiResponse: any): void {
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

  public shouldShowWarning(tenantId: string): boolean {
    const warningObj: {tenantId: string, shouldShowWarning: boolean} | undefined = this.warningList.find((warning: {tenantId: string, shouldShowWarning: boolean}) => warning.tenantId === tenantId);
    return warningObj ? warningObj.shouldShowWarning : false;
  }

  public hasAdminRoleForTenantTab(tenantId: string): boolean {
    const foundTenant: ITenantObj | undefined = this.tenantList.find((_tenant: ITenantObj) => _tenant.tenantId === tenantId);
    if (!foundTenant) {
      return false;
    }
    return foundTenant.role === OWNER_ROLE || foundTenant.role === ADMIN_ROLE;
  }

  public isLocalTenantForTenantTab(tenantId: string): boolean {
    const localTenant: ITenantObj | undefined = this.tenantList.find((tenant: ITenantObj) => tenant.isLocal);
    if (localTenant) {
      return tenantId === localTenant.tenantId;
    }
    return true;
  }

  public shouldShowEditIcon(tenantId: string): boolean {
    return !this.shouldShowRenameInput[tenantId] && !this.isLocalTenantForTenantTab(tenantId) && this.hasAdminRoleForTenantTab(tenantId);
  }

  public shouldShowWarningIcon(tenantId: string): boolean {
    return !this.shouldShowRenameInput[tenantId] && this.shouldShowWarning(tenantId);
  }
}
