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
import store from '../store/index';
import router from '../router/index';
import {CoreApiClient} from '../CoreApiClient';
import {MenuResizeUtil} from '../util/MenuResizeUtil';
import {SwalUtil} from '../util/SwalUtil';
import { ITenantObj } from '../store/state/tenant';
import { OWNER_ROLE } from '../interfaces/core-response/IServiceSettings';
import text from '../messages/Text';

@Component({
  name: 'Deactivate'
})
export default class Deactivate extends Vue {

  private checked: boolean = false;
  private userID: any = localStorage.getItem('u');

  public created() {
    this.setChecked(false);
  }

  public mounted() {
    store.commit('hideAccountMenu');
    const deactivateArea: HTMLElement | null = document.getElementById('deactivate-area');
    if (deactivateArea) {
      deactivateArea.onclick = (e: MouseEvent): void => {
        store.commit('hideAccountMenu');
      };
    }
  }

  private setChecked(checked: boolean) {
    store.commit('changeAgreeState', checked);
  }

  public onClickHome(e: any): void {
    router.push({ path: 'dashboard' });
  }

  public onClickMenu(e: any): void {
    const menu: string = e.currentTarget.getAttribute('data-menu');
    switch (menu) {
      case 'serviceSettings':
      case 'deactivate':
        router.push({ path: menu });
        break;
      default:
        break;
    }
  }

  public deactivate(): void {
    CoreApiClient.deactivate(this.userID).then(() => {
      localStorage.removeItem('u');
      localStorage.removeItem('l');
      document.location.href = '/';
    }, (error: any) => {
      this.$emit('apierror', error);
    });
  }

  get agreed(): boolean {
    return store.state.deactivate.agreed;
  }

  get isShareTenantOwner(): boolean {
    const tenantList: ITenantObj[] = store.state.tenant.tenantList;
    return tenantList.some((tenant: ITenantObj) => !tenant.isLocal && tenant.role === OWNER_ROLE);
  }

  get vueTexts(): string {
    return text[store.state.common.language].vueTexts.deactivate;
  }

  get language(): string {
    return store.state.common.language;
  }
}
