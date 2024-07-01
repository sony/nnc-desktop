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
import { ResourceInfoUtil } from '../util/ResourceInfoUtil';
import store from '../store/index';
import { ITenantObj } from '../store/state/tenant';
import text from '../messages/Text';

const OWNER_ROLE: string = 'owner';
const ADMIN_ROLE: string = 'admin';

@Component({
  name: 'LeftMenu'
})
export default class LeftMenu extends Vue {
  @Prop() public language!: string;
  @Prop() public selectedComponent!: string;
  @Prop() public selectedTenantId!: string;
  @Prop() public isLocalTenant!: () => boolean;
  @Prop() public tenantList!: ITenantObj[];

  get shouldShowSampleProjectBalloon(): boolean {
    return store.state.common.shouldShowSampleProjectBalloon;
  }

  public hideBalloon(): void {
    store.commit('hideSampleProjectBalloon');
    localStorage.setItem('b', 'true');
  }

  public getClassName(componentName: string): string {
    return componentName === this.selectedComponent ? 'menu selected' : 'menu';
  }

  public getUserId(): string {
    return store.state.common.userId;
  }

  public shouldShowAccountMenu(): boolean {
    return store.state.common.shouldShowAccountMenu;
  }

  public onClickMenuIcon(e: any) {
    e.stopPropagation();
    if (this.shouldShowAccountMenu()) {
      store.commit('hideAccountMenu');
    } else {
      store.commit('showAccountMenu');
    }
  }

  public hideMenuIcon() {
    store.commit('hideAccountMenu');
  }

  private isCloseToTheLimitProjectNum(): boolean {
    return this.tenantList.map((tenant: ITenantObj) => {
      if (ResourceInfoUtil.isCharged(tenant.tenantId)) {
        return false;
      }
      return ResourceInfoUtil.isCloseToTheLimitProjectNum(tenant.tenantId);
    }).some((value: boolean) => value );
  }

  private isOverTheLimitProjectNum(): boolean {
    return this.tenantList.map((tenant: ITenantObj) => {
      if (ResourceInfoUtil.isCharged(tenant.tenantId)) {
        return false;
      }
      return ResourceInfoUtil.isOverTheLimitProjectNum(tenant.tenantId);
    }).some((value: boolean) => value );
  }

  private isCloseToTheLimitWorkspaceUsed(): boolean {
    return this.tenantList.map((tenant: ITenantObj) => {
      return ResourceInfoUtil.isCloseToTheLimitWorkspaceUsed(tenant.tenantId);
    }).some((value: boolean) => value );
  }

  private isOverTheLimitWorkspaceUsed(): boolean {
    return this.tenantList.map((tenant: ITenantObj) => {
      return ResourceInfoUtil.isOverTheLimitWorkspaceUsed(tenant.tenantId);
    }).some((value: boolean) => value );
  }

  private isCloseToTheLimitResources(): boolean {
    return this.tenantList.map((tenant: ITenantObj) => {
      if (ResourceInfoUtil.isCharged(tenant.tenantId)) {
        return ResourceInfoUtil.isCloseToTheLimitBudget(tenant.tenantId) || ResourceInfoUtil.isCloseToTheLimitWorkspaceUsed(tenant.tenantId);
      } else {
        return ResourceInfoUtil.isCloseToTheLimitWorkspaceUsed(tenant.tenantId) || ResourceInfoUtil.isCloseToTheLimitProcessResource(tenant.tenantId);
      }
    }).some((value: boolean) => value );
  }

  private isOverTheLimitResources(): boolean {
    return this.tenantList.map((tenant: ITenantObj) => {
      if (ResourceInfoUtil.isCharged(tenant.tenantId)) {
        return ResourceInfoUtil.isOverTheLimitBudget(tenant.tenantId) || ResourceInfoUtil.isOverTheLimitWorkspaceUsed(tenant.tenantId);
      } else {
        return ResourceInfoUtil.isOverTheLimitWorkspaceUsed(tenant.tenantId) || ResourceInfoUtil.isOverTheLimitProcessResource(tenant.tenantId);
      }
    }).some((value: boolean) => value );
  }

  get vueTexts(): string {
    return text[this.language].vueTexts.leftMenu;
  }

}
