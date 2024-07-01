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
import store from '../store/index';
import router from '../router/index';
import {CoreApiClient} from '../CoreApiClient';
import {SwalUtil} from '../util/SwalUtil';
import text from '../messages/Text';
import { TextType } from '../interfaces/common';
declare global {
  interface Window {
    lockedAuthAPI?: boolean;
  }
}

@Component({
  name: 'AccountMenu'
})
export default class AccountMenu extends Vue {
  @Prop() public language!: string;
  @Prop() public shouldShowAccountMenu?: boolean;
  @Prop() public version?: string;
  @Prop() public countryCode?: string;
  @Prop() public locale?: string;

  private onClickAccountSettings(e: any): void {
    store.commit('hideAccountMenu');
    window.open(store.state.session.accountSettingURI, '_blank');
  }

  private onClickServiceSettings(e: any): void {
    store.commit('hideAccountMenu');
    router.push({ path: 'serviceSettings' });
  }

  private onClickHelp(e: any): void {
    store.commit('hideAccountMenu');
    if (store.state.common.language === 'ja') {
      window.open('https://support.dl.sony.com/ja/', '_blank');
    } else {
      window.open('https://support.dl.sony.com/', '_blank');
    }
  }

  private onClickTOS(e: any): void {
    store.commit('hideAccountMenu');
    window.open(`/tos/${this.version}/${this.countryCode}/${this.locale}/tos.html`, '_blank');
  }

  private onClickLicenses(e: any): void {
    store.commit('hideAccountMenu');
    window.open(`/console/licenses.txt`, '_blank');
  }

  private hasErrorResponse(error: any): boolean {
    return error && error.response ? true : false;
  }

  private onUnexpectedError(apiResponse: any): void {
    store.commit('setHideAllLoading');
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

  private onClickLogout(e: any): void {
    store.commit('hideAccountMenu');
    SwalUtil.confirm(text[store.state.common.language].dialogTexts.ARE_YOU_SURE_YOU_WANT_TO_SIGN_OUT, () => {
      store.commit('showLoading', 'common');
      CoreApiClient.signout().then(() => {
        store.commit('hideLoading', 'common');
        localStorage.removeItem('u');
        localStorage.removeItem('l');
        localStorage.removeItem('s');
        localStorage.removeItem('a');
        if (store.state.common.language === 'ja') {
          document.location.href = '/ja/';
        } else {
          document.location.href = '/';
        }
      }, (error) => {
        if (!this.hasErrorResponse(error)) {
          this.onUnexpectedError(error);
        } else if (error.response.status === 400 && error.response.data.error === 'NNCD_UNAUTHORIZED') {
          if (window.lockedAuthAPI) {
            return;
          }
          window.lockedAuthAPI = true;
          SwalUtil.alert(text[store.state.common.language].dialogTexts.SESSION_HAS_EXPIRED, () => {
            onUnAuthorized();
          });
        } else {
          this.onUnexpectedError(error);
        }
      });
    });
  }

  public isSonyAccount(): boolean {
    return store.state.session.account === 's';
  }

  get vueTexts(): TextType {
    return text[this.language].vueTexts.accountMenu;
  }

}
