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
import { Prop } from 'vue-property-decorator';
import store from '../store/index';
import {CoreApiClient} from '../CoreApiClient';
import {StringUtil} from '../util/StringUtil';
import {MenuResizeUtil} from '../util/MenuResizeUtil';
import {SwalUtil} from '../util/SwalUtil';
import { Watch } from 'vue-property-decorator';
import { IInstanceType } from '../interfaces/core-response/IMisc';
import { ITenantObj, IMemberObj } from '../store/state/tenant';
import { IComputeResource, IremoteResGForm} from '../store/state/computeResource';
import Overview from '../components/Overview/Overview.vue';
import LabelDialog from '../components/Dialog/Label.vue';
import UploadProjectDialog from '../components/Dialog/UploadProject.vue';
import Loading2 from '../components/Loading2.vue';
import TenantTabs from '../components/TenantTabs.vue';
import text from '../messages/Text';
import {PAGES, INSTANCE_TYPE_LIST} from '../Const';
import { TextType } from '../interfaces/common';

@Component({
  name: 'ComputeResource',
  components: {
    TenantTabs,
    Overview,
    LabelDialog,
    UploadProjectDialog,
    Loading2
  }
})
export default class ComputeResource extends Vue {
  @Prop() public language!: string;
  @Prop() public userId!: string;
  @Prop() public tenantList!: ITenantObj[];
  @Prop() public selectedTenantId!: string;
  @Prop() public hasShareTenant!: boolean;
  @Prop() public onClickTenantTab!: (tenantId: string) => void;
  @Prop() public isLocalTenant!: () => boolean;

  private getTenantInstance(userId: string, tenantId: string): Promise<any> {
    store.commit('showInstanceListLoading', tenantId);
    return new Promise((resolve: (res?: any) => void, reject: (res?: any) => void) => {
      this.getInstance({userID: userId, tenantId: tenantId}, (instances: IInstanceType[]) => {
        store.commit('setCompReso', {tenantId, instances});
        store.commit('hideInstanceListLoading', tenantId);
        resolve();
      });
    });
  }


  private getAllTenantInstance(): Promise<any> {
    const promiseList: Promise<any>[] = [];
    this.tenantList.forEach((tenant: ITenantObj) => {
      promiseList.push(this.getTenantInstance(this.userId, tenant.tenantId));
    });
    return Promise.all(promiseList);
  }

  private getBackendInfo(): void {
    CoreApiClient.getBackendEnvInfo().then((res) => {
      store.commit('setCompResoEnvInfo', res)
    }, (error: any) => {
      this.$emit('apierror', error);
    });
  }

  public created() {
    Promise.all([
      this.getAllTenantInstance()
    ]).then(() => {}, (error: any) => {
      this.$emit('apierror', error);
    });

    this.getBackendInfo();
  }

  public mounted() {
    window.lockedAuthAPI = false;
    store.commit('hideAccountMenu');
    const defaultRightWidth: number = 280;
    store.commit('setProjectRightWidth', defaultRightWidth);
    this.tenantList.forEach((tenant: ITenantObj) => {
      store.commit('setInstanceKeyword', {tenantId: tenant.tenantId, keyword: ''});
    });

    store.commit('selectComponent', PAGES.COMPUTE_RESOURCE);
    const projectArea: HTMLElement | null = document.getElementById('project-area');
    if (projectArea) {
      projectArea.onclick = (e: MouseEvent): void => {
        e.stopPropagation();
        const actionList: HTMLElement | null = document.getElementById('action-list');
        if (actionList) {
          actionList.style.display = 'none';
        }
        store.commit('hideAccountMenu');
      };
    }

    const actionIcon: HTMLElement | null = document.getElementById('action-icon'); //daozher
    if (actionIcon) {
      actionIcon.onclick = (e: MouseEvent) => {
        e.stopPropagation();
        const actionList: HTMLElement | null = document.getElementById('action-list');
        const icon: HTMLElement | null = document.getElementById('action-icon');
        if (!actionList || !icon) {
          return;
        }
        actionList.style.display = actionList.style.display !== 'block' ? 'block' : 'none';
        const iconTop = icon.getBoundingClientRect().top;
        const iconLeft = icon.getBoundingClientRect().left;
        const iconHeight = icon.clientHeight;
        const iconWidth = icon.clientWidth;
        actionList.style.top = (iconTop + iconHeight).toString() + 'px';
        const leftMenuWidth: number = (document.getElementById('menu-container') || {clientWidth: 0}).clientWidth;
        actionList.style.left = (iconLeft - leftMenuWidth) + 'px';
      };
    }

  }

  public isInstanceListLoading(): boolean {
    return store.state.computeResourceGroup.instanceListLoading[this.selectedTenantId];
  }

  public resizeRightMenu(e: any): void {
    e.preventDefault();
    MenuResizeUtil.resize('project-job-list', '', 'left-menu-border', false, 10, (width: number) => store.commit('setProjectRightWidth', width));
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
    CoreApiClient.postLog(pageUrl, apiUrl, method, error, message, this.userId);
    SwalUtil.alert(text[store.state.common.language].dialogTexts.PLEASE_TRY_AGAIN_AFTER_A_WHILE);
  }

  get instanceList(): IComputeResource[] {
    let instList: IComputeResource[] = store.state.computeResourceGroup.compResoList[this.selectedTenantId].filter((_inst: IComputeResource) => !_inst.deleted);
    const keyword: string = store.state.project.keyword[this.selectedTenantId];
    const splittedKeywordList: string[] = keyword.trim().split(/\s+/);
    let condition: string = '';
    let newKeyword: string = '';
    splittedKeywordList.forEach((_keyword: string) => {
      newKeyword += '(?=.*' + _keyword + ')';
    });
    condition += `${'^' + newKeyword + '.*$'}`;
    const regExp: RegExp = new RegExp(condition, 'i');
    instList = ([] as IComputeResource[]).concat(instList)
    return instList.filter((i: IComputeResource) => regExp.test(i.name));
  }

  get allChecked(): boolean {
    return store.state.computeResourceGroup.allChecked[this.selectedTenantId];
  }

  get jobs(): {}[] {
    return store.state.project.jobs[this.selectedTenantId];
  }

  get jobTotal(): number {
    return store.state.project.jobTotal[this.selectedTenantId];
  }

  get keyword(): string {
    return store.state.project.keyword[this.selectedTenantId];
  }

  public getTypeAndStatus(jobObj: any): string {
    const type: string = this.capitalize(jobObj.type);
    const status: string = this.capitalize(jobObj.status);
    return type + ' ' + '/' + ' ' + status;
  }

  private capitalize(str: string): string {
    switch (str) {
      case 'profile':
        return this.commonVueTexts.PROFILE;
      case 'train':
        return this.commonVueTexts.TRAIN;
      case 'evaluate':
        return this.commonVueTexts.EVALUATE;
      case 'queued':
        return this.commonVueTexts.jobStatus.QUEUED;
      case 'preprocessing':
        return this.commonVueTexts.jobStatus.PREPROCESSING;
      case 'processing':
        return this.commonVueTexts.jobStatus.PROCESSING;
      case 'finished':
        return this.commonVueTexts.jobStatus.FINISHED;
      case 'suspended':
        return this.commonVueTexts.jobStatus.SUSPENDED;
      case 'failed':
        return this.commonVueTexts.jobStatus.FAILED;
      default:
        return StringUtil.toUpperFirstLetter(str) || '-';
    }
  }


  public getInstance(param: {userID: string, tenantId: string}, successCallback: (response: IInstanceType[]) => void): void {
    CoreApiClient.getInstance(param.userID, param.tenantId).then((response: IInstanceType[]) => {
      successCallback(response);
    }, (error: any) => {
      this.$emit('apierror', error);
    });
  }


  public deleteInstance(instance: IComputeResource): void {
    const tenantId: string = this.selectedTenantId;
    const confirmMessage: string = text[store.state.common.language].dialogTexts.WILL_BE_DELETE;
    const messageError: string = text[this.language].dialogTexts.DELETE_INSTANCE_ERROR;
    SwalUtil.confirm(instance.name + confirmMessage, () => {
      store.commit('showInstanceListLoading', tenantId);
      CoreApiClient.deleteInstances(this.userId, tenantId, [instance.instance_type]).then((instances: IInstanceType[]) => {
        store.commit('setCompReso', {tenantId, instances});
        store.commit('hideInstanceListLoading', tenantId);
      }, (error: any) => {
        this.$emit('apierror', error, (errorResponse: any) => {
          SwalUtil.alert(messageError, () => {
            console.log(errorResponse);
            store.commit('hideInstanceListLoading', tenantId);
          });
        });
      });
    });
  }

  public deleteAll(e: MouseEvent): void {
    const tenantId: string = this.selectedTenantId;
    const instList: IComputeResource[] = store.state.computeResourceGroup.compResoList[tenantId];

    const deletedInstIDs: number[] = instList.filter((i: IComputeResource) => i.checked).map((i: IComputeResource) => i.instance_type);

    if (!deletedInstIDs.length) {
      e.stopPropagation();
      return;
    }

    const confirmMessage: string = text[store.state.common.language].dialogTexts.ALL_INSTANCE_WILL_BE_DELETED;
    const messageError: string = text[this.language].dialogTexts.DELETE_INSTANCE_ERROR;
    SwalUtil.confirm(confirmMessage, () => {
      store.commit('showInstanceListLoading', tenantId);
      CoreApiClient.deleteInstances(this.userId, tenantId, deletedInstIDs).then((instances: IInstanceType[]) => {
        store.commit('setCompReso', {tenantId, instances});
        store.commit('hideInstanceListLoading', tenantId);
      }, (error: any) => {
        this.$emit('apierror', error, (errorResponse: any) => {
          SwalUtil.alert(messageError, () => {
            console.log(errorResponse);
            store.commit('hideInstanceListLoading', tenantId);
          });
        });
      });
    });
  }


  public select(e: any): void {
    e.stopPropagation();
    e.preventDefault();
    const target: any = e.currentTarget;
    const instanceID: string = target.getAttribute('data-pid');
    const input: any = document.getElementById(instanceID);
    const checked: boolean = !input.checked;
    store.commit('setInstanceChecked', {tenantId: this.selectedTenantId, instanceID, checked });
  }

  public selectAll(e: any): void {
    const projectListElement: HTMLElement | null = document.getElementById('instance-list');
    if (!projectListElement) {
      return;
    }
    store.commit('selectInstanceAll', {tenantId: this.selectedTenantId, checked: e.currentTarget.checked});
  }

  public checked(): boolean {
    const instList: IComputeResource[] = store.state.computeResourceGroup.compResoList[this.selectedTenantId];
    if (!instList || !instList.length) {
      return false;
    }
    return instList.reduce((a, b) => a || !!b.checked, false);
  }

  public addResource(): void {
    const messageError: string = text[this.language].dialogTexts.ADD_INSTANCE_ERROR;
    const tenantId: string = this.selectedTenantId;
    SwalUtil.inputInstance({message: '', selected: 'remoteResG', selectList: INSTANCE_TYPE_LIST}, (instance: IremoteResGForm) => {
      if (!instance) {
        return;
      }
      store.commit('showInstanceListLoading', tenantId);
      CoreApiClient.createInstance(this.userId, tenantId, instance).then((instances: IInstanceType[]) => {
        store.commit('setCompReso', {tenantId, instances});
        store.commit('hideInstanceListLoading', tenantId);
      }, (error: any) => {
        this.$emit('apierror', error, (errorResponse: any) => {
          SwalUtil.alert(messageError, () => {
            console.log(errorResponse);
            store.commit('hideInstanceListLoading', tenantId);
          });
        });
      });
    });
  }

  public oninput(value: string): void {
    const keyword: string = store.state.project.keyword[this.selectedTenantId];
    store.commit('setInstanceKeyword', {tenantId: this.selectedTenantId, keyword: value});
  }

  public initKeyword(): void {
    const keyword: string = store.state.project.keyword[this.selectedTenantId];
    store.commit('setInstanceKeyword', {tenantId: this.selectedTenantId, keyword: ''});
  }

  public onChangeTab(tenantId: string): void {
    this.onClickTenantTab(tenantId);
    Vue.nextTick(() => {
      store.commit('setInstanceKeyword', {tenantId: this.selectedTenantId, keyword: store.state.project.keyword[this.selectedTenantId]});
    });
  }

  get rightWidth(): number {
    return store.state.project.rightWidth;
  }

  get vueTexts(): TextType {
    return text[this.language].vueTexts.computeResource;
  }

  get commonVueTexts(): TextType {
    return text[this.language].vueTexts.common;
  }

}
