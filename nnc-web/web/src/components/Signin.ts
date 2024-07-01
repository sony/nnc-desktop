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
import Component from 'vue-class-component';
import store from '../store/index';
import router from '../router/index';
import {CoreApiClient} from '../CoreApiClient';
import {SwalUtil} from '../util/SwalUtil';
import { StringUtil } from '../util/StringUtil';
import text from '../messages/Text';
import { ICreateSession } from '../interfaces/core-response/ISession';
import { AxiosError } from 'axios';

const TOP_URL: string = '/';

const CANCEL: string = '104';
const SIGNOUT: string = '106';
const EMPTY: string = '';

@Component({
  name: 'Signin'
})
export default class Signin extends Vue {

  private onUnexpectedError(apiResponse: AxiosError): void {
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

  public created() {
    if (store.state.session.isSignIn) {
      router.push({ path: 'dashboard' });
      return;
    }

    switch (this.getErrorCode()) {
      case EMPTY:
        break;

      case SIGNOUT:
        this.signout();
        return;

      case CANCEL:
      default:
          document.location.href = TOP_URL;
          return;
    }

    const state = this.getState();
    let code = this.getCode();
    if (state && code) {
      if (location.href.indexOf('?') < location.href.indexOf('#')) {
        document.location.href = `${location.origin}${location.pathname}${location.hash}?code=${code}&state=${state}`;
        return;
      }
      let provider: string = '';
      let _account: string = localStorage.getItem('_a') || 's';
      let redirectURI: string = '';
      switch (_account) {
        case 's':
          redirectURI = window.location.href.split('?')[0];
          provider = 'sony';
          break;
        case 'g':
          redirectURI = window.location.href.split('?')[0].split('#')[0];
          code = decodeURIComponent(code);
          provider = 'google';
          break;
        default:
          _account = 's';
          redirectURI = window.location.href.split('?')[0];
          provider = 'sony';
      }
      CoreApiClient.updateSession({state, code, redirectURI: redirectURI, provider}).then((res: ICreateSession) => {
        const userId: string = res.u;
        localStorage.setItem('u', userId);
        store.commit('setUserId', userId);
        store.commit('setURI', res);
        store.commit('setAccountType', _account);
        localStorage.setItem('a', _account);

        localStorage.removeItem('_a');
        if (res.auth_flow === 'sign-in') {
          store.commit('setIsSignIn', true);
        } else {
          router.push({ path: 'form' });
        }
      }, (error: AxiosError) => {
        if (this.isInvalidStateNonceGrant(error)) {
          const message: string = text[store.state.common.language].dialogTexts.SESSION_HAS_EXPIRED;
          const account: string = store.state.session.account || localStorage.getItem('a') || '';
          switch (account) {
            case 's':
            case 'g':
              SwalUtil.alert(message, () => {
                if (account === 's') {
                  onUnAuthorized(ACCOUNT.SONY);
                } else {
                  onUnAuthorized(ACCOUNT.GOOGLE);
                }
              });
              break;

            default:
              SwalUtil.selectAccount(message, () => {
                onUnAuthorized(ACCOUNT.SONY);
              }, () => {
                onUnAuthorized(ACCOUNT.GOOGLE);
              });
              break;
          }
        } else {
          this.onUnexpectedError(error);
        }
      });
    } else {
      const error: AxiosError = {
        config: {},
        name: '',
        message: '',
        response: {
          config: {
            url: '',
            method: ''
          },
          data: {
            error: 'NNCD_BAD_REQUEST',
            message: 'Invalid Query Parameter'
          },
          status: 400,
          statusText: '',
          headers: {}
        }
      };
      this.onUnexpectedError(error);
    }
  }

  public isInvalidStateNonceGrant(errorResponse: AxiosError): boolean {
    if (errorResponse.response && errorResponse.response.data) {
      return errorResponse.response.status === 400 &&
             (errorResponse.response.data.error === 'NNCD_BAD_REQUEST' || errorResponse.response.data.error === 'GOOGLE_ERROR' || errorResponse.response.data.error === 'MDCIM_ERROR') &&
             (errorResponse.response.data.message === 'invalid_state' || errorResponse.response.data.message === 'invalid_nonce' || errorResponse.response.data.message === 'invalid_grant');
    } else {
      return false;
    }
  }

  public getState(): string {
    return StringUtil.parseQueryString('state');
  }

  public getCode(): string {
    return StringUtil.parseQueryString('code');
  }

  public getErrorCode(): string {
    return StringUtil.parseQueryString('error_code');
  }

  public linkDashbord(): void {
    router.push({ path: 'dashboard' });
  }

  get isSignIn(): boolean {
    return store.state.session.isSignIn;
  }

  private signout(): void {
    CoreApiClient.signout(true).then(() => {
      localStorage.removeItem('u');
      localStorage.removeItem('a');
      document.location.href = TOP_URL;
    }, (error: AxiosError) => {
      try {
        if (error.response && error.response.status === 400 && error.response.data.error === 'NNCD_UNAUTHORIZED') {
          localStorage.removeItem('u');
          localStorage.removeItem('a');
          document.location.href = TOP_URL;
        } else {
          this.onUnexpectedError(error);
        }
      } catch (e) {
        this.onUnexpectedError(error);
      }
    });
  }
}
