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
import { IDataset as IDatasetStore } from '../store/state/dataset';
import {CoreApiClient} from '../CoreApiClient';
import {MenuResizeUtil} from '../util/MenuResizeUtil';
import {SwalUtil} from '../util/SwalUtil';
import {ConvertUtil} from '../util/ConvertUtil';
import { ResourceInfoUtil } from '../util/ResourceInfoUtil';
import { IDatasetList, IAllLabel, IFeatures, IProgress } from '../store/state/dataset';
import { ITenantObj, IMemberObj } from '../store/state/tenant';
import TenantTabs from '../components/TenantTabs.vue';
import Loading2 from '../components/Loading2.vue';
import LabelDialog from '../components/Dialog/Label.vue';
import {ADMIN_ROLE, OWNER_ROLE} from '../interfaces/core-response/IServiceSettings';
import text from '../messages/Text';
import {PAGES, STORAGE_UNIT_BORDER} from '../Const';
import UploadDatasetDialog from '../components/Dialog/UploadDataset.vue';
import { S3Util } from '../util/S3Util';
import AWS from 'aws-sdk';
import { TextType } from '../interfaces/common';
import { IDataset, IDatasetResponse, ISampleDatasetResponse } from '../interfaces/core-response/IDataset';

const POLLING_INTERVAL: number = 15 * 1000;
const MAX_INITIAL_DATASET_NUMBER: number = 50;
const SAMPLE_DATASET_OWNER_USER_ID: string = '3';
const SAMPLE_DATASET_TENANT_ID: string = 'ccbf15a0-bcb6-4ba6-b10e-27fc877c4348';
// 一度に取得するデータセット数
const GET_DATASETS_NUM: number = 20;
const uploadBucketRegion: string = 'default';

const GET_COLUMN_INTERVAL: number = 10;

@Component({
  name: 'Dataset',
  components: {
    TenantTabs,
    LabelDialog,
    UploadDatasetDialog,
    Loading2
  }
})
export default class Dataset extends Vue {
  @Prop() public language!: string;
  @Prop() public userId!: string;
  @Prop() public tenantList!: ITenantObj[];
  @Prop() public selectedTenantId!: string;
  @Prop() public hasShareTenant!: boolean;
  @Prop() public onClickTenantTab!: (tenantId: string) => void;
  @Prop() public isLocalTenant!: () => boolean;

  public mounted() {
    window.lockedAuthAPI = false;
    store.commit('hideAccountMenu');
    this.tenantList.forEach((tenant: ITenantObj) => {
      store.commit('setKeywordForDataset', {tenantId: tenant.tenantId, keyword: ''});
      store.commit('setSelectedLabelForDataset', {tenantId: tenant.tenantId, keyword: this.commonVueTexts.ALL});
    });
    Promise.all([
      this.getSampleDatasets(),
      this.getAllTenantDatasets()
    ]).then(() => {
      store.commit('hideAllDatasetListLoading');
      this.setPollingForDataset(store.state.dataset.datasetList[this.selectedTenantId], this.selectedTenantId);
    });

    store.commit('selectComponent', PAGES.DATASET);
    const datasetArea: HTMLElement | null = document.getElementById('dataset-area');
    if (datasetArea) {
      datasetArea.onclick = (e: MouseEvent): void => {
        e.stopPropagation();
        const actionList: HTMLElement | null = document.getElementById('action-list');
        if (actionList) {
          actionList.style.display = 'none';
        }
        store.commit('hideCopyArea');
        store.commit('hideAccountMenu');
      };
    }

    const actionIcon: HTMLElement | null = document.getElementById('action-icon');
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

  private async getSampleDatasets(): Promise<void> {
    if (store.state.dataset.sampleDatasetList.length) {
      return;
    }
    try {
      const response: ISampleDatasetResponse = await CoreApiClient.getSampleDatasets(this.userId, SAMPLE_DATASET_TENANT_ID);
      store.commit('setSampleDatasetList', response);
    } catch (e) {
      this.$emit('apierror', e);
    }
  }

  public beforeDestroy() {
    if (this.pollingDatasetTimerId) {
      clearTimeout(this.pollingDatasetTimerId);
    }
  }

  public isLoading(): boolean {
    return store.state.common.isLoading[PAGES.DATASET];
  }

  public isDatasetListLoading(): boolean {
    return store.state.dataset.datasetListLoading[this.selectedTenantId];
  }

  public isDatasetPreviewLoading(): boolean {
    return store.state.dataset.datasetPreviewListLoading[this.selectedTenantId];
  }

  private pollingDatasetTimerId: number = NaN;

  private isUnavailableScroll: boolean = false;

  private resizeRightMenu(e: any): void {
    e.preventDefault();
    MenuResizeUtil.resize('dataset-data-list', '', 'left-menu-border', false);
  }

  get datasetList(): IDatasetList[] {
    let datasetList: any = store.state.dataset.datasetList[this.selectedTenantId].filter((_dataset: IDatasetList) => !_dataset.deleted).map((dataset: IDatasetList) => {
      let progress = 0;
      const progressObj: IProgress | undefined = store.state.dataset.progressList[this.selectedTenantId].find((_progress: IProgress) => _progress.datasetId === dataset.dataset_id);
      if (progressObj) {
        // 小数第一位まで表示に使用
        progress = Math.floor(progressObj.progress * 10) / 10;
      }
      return {
        ...dataset,
        progress
      };
    });
    datasetList = datasetList.concat(store.state.dataset.sampleDatasetList);
    const keyword: string = store.state.dataset.keyword[this.selectedTenantId];
    const splittedKeywordList: string[] = keyword.trim().split(/\s+/);
    const selectedLabel: string = store.state.dataset.selectedLabel[this.selectedTenantId];
    let condition: string = '';
    let newKeyword: string = '';
    splittedKeywordList.forEach((splittedKeyword: string) => {
      newKeyword += '(?=.*' + splittedKeyword + ')';
    });
    condition += `${'^' + newKeyword + '.*$'}`;
    const regExp: RegExp = new RegExp(condition, 'i');
    const filteredDatasetList: IDatasetList[] = datasetList.filter((dataset: any) => regExp.test(dataset.dataset_name));
    if (selectedLabel === this.commonVueTexts.ALL || selectedLabel === undefined) {
      return filteredDatasetList;
    }
    return filteredDatasetList.filter((dataset: IDatasetList) => this.isMatched(dataset));
  }

  public isMatched(dataset: IDatasetList): boolean {
    const selectedLabel: string = store.state.dataset.selectedLabel[this.selectedTenantId];
    if (dataset.owner_user_id === SAMPLE_DATASET_OWNER_USER_ID) {
      return false;
    } else {
      if (dataset.owner_user_id !== selectedLabel && (dataset.labels.indexOf(selectedLabel) === -1)) {
        return false;
      }
    }
    return true;
  }

  public convertToNickName(optionLabel: string): string {
    if (!optionLabel) {
      return '';
    }
    const memberList: IMemberObj[] = store.state.tenant.memberList[this.selectedTenantId];
    if (!memberList.length) {
      return optionLabel;
    }
    const member: IMemberObj | undefined = memberList.find((_member: IMemberObj) => _member.userId === optionLabel);
    if (!member) {
      // 画面表示後に追加されたユーザー/退会したユーザー
      return optionLabel;
    }
    const nickname: string = member.nickname;
    const userId: string = member.userId;
    if (member.deleted) {
      if (nickname) {
        return `${nickname} / Missing user (${userId})`;
      } else {
        return `Missing user (${userId})`;
      }
    } else {
      if (nickname) {
        return `${nickname} (${userId})`;
      } else {
        return userId;
      }
    }
  }

  get datasetTotal(): number {
    return store.state.dataset.datasetTotal[this.selectedTenantId];
  }

  get allChecked(): boolean {
    return store.state.dataset.allChecked[this.selectedTenantId];
  }

  get previewHeader(): string[] {
    return this.datasetStore.previewHeader[this.selectedTenantId].slice(this.datasetStore.minColumn[this.selectedTenantId], this.datasetStore.maxColumn[this.selectedTenantId]);
  }

  get previewList(): {type: string, data: string, original?: string}[][] {
    return store.state.dataset.previewList[this.selectedTenantId];
  }

  get datasetStore(): IDatasetStore {
    return store.state.dataset;
  }

  public convertToShape(i: number): string {
    const features: IFeatures[] = store.state.dataset.features[this.selectedTenantId];
    if (features[i] && features[i].shape) {
      return (features[i].shape as number[]).join(',');
    }
    return '';
  }

  private getDatasetTotal(tenantId: string): number {
    return store.state.dataset.datasetTotal[tenantId] - this.getDeletedDatasetNum(tenantId);
  }

  private getDeletedDatasetNum(tenantId: string): number {
    return store.state.dataset.datasetList[tenantId].filter((_dataset: IDatasetList) => _dataset.deleted).length;
  }

  get previewTotal(): number {
    return store.state.dataset.previewTotal[this.selectedTenantId];
  }

  get previewOffset(): number {
    return store.state.dataset.previewOffset[this.selectedTenantId];
  }

  get previewPage(): number {
    return store.state.dataset.previewPage[this.selectedTenantId];
  }

  get token(): string {
    return store.state.dataset.token[this.selectedTenantId];
  }

  get keyword(): string {
    return store.state.dataset.keyword[this.selectedTenantId];
  }

  get shouldShowCopyArea(): boolean {
    return store.state.dataset.shouldShowCopyArea;
  }

  private isPreviewDatasetID(datasetID: string) {
    return datasetID === store.state.dataset.previewDatasetID[this.selectedTenantId];
  }

  public onClickGetUploader(e: any): void {
    window.open('https://support.dl.sony.com/docs/download-uploader/', '_blank');
  }

  public onClickCheckCommand(e: any): void {
    window.open('https://support.dl.sony.com/docs/uploader/', '_blank');
  }

  private getTenantDatasets(userId: string, tenantId: string): Promise<any> {
    store.commit('showDatasetListLoading', tenantId);
    return new Promise((resolve: (res?: any) => void, reject: (res?: any) => void) => {
      const limit: string = String(GET_DATASETS_NUM);
      this.getDatasetList({userID: userId, tenantId: tenantId, limit: limit}, (datasets: any) => {
        store.commit('setDatasetList', {tenantId, datasets});
        const allLabels: string[] = this.createAllLabels(datasets.datasets);
        store.commit('setAllLabelsForDataset', {tenantId: tenantId, allLabels: allLabels});
        const filteredTenant: ITenantObj | undefined = store.state.tenant.tenantList.find((tenant: ITenantObj) => tenant.tenantId === tenantId);
        if (filteredTenant) {
          const selectOptionLabels: string[] = this.createSelectOptionLabels(datasets.datasets, filteredTenant.isLocal);
          store.commit('setSelectOptionlabelsForDataset', {tenantId: tenantId, selectOptionLabels: selectOptionLabels});
        }
        if (datasets.metadata.total > Number(limit)) {
          this.getDatasetByParallel(tenantId, datasets.metadata.total);
        }
        if (store.state.dataset.sampleDatasetList.length) {
          store.commit('hideDatasetListLoading', tenantId);
        }
        resolve();
      });
    });
  }

  private createAllLabels(datasets: IDatasetList[]): string[] {
    const allLabels: any[] = [];
    datasets.forEach((dataset: IDatasetList) => {
      dataset.labels.forEach((label: string) => {
        if (allLabels.findIndex(labelInAll => labelInAll.labelName === label) === -1) {
          allLabels.push({labelName: label, checked: false});
        }
      });
    });
    return allLabels;
  }

  private createSelectOptionLabels(datasets: IDatasetList[], isLocal: boolean): string[] {
    const selectOptionLabels: string[] = [];
    selectOptionLabels.push(this.commonVueTexts.ALL);
    datasets.forEach((dataset: IDatasetList) => {
      if (selectOptionLabels.indexOf(dataset.owner_user_id) === -1 && !isLocal && dataset.owner_user_id !== SAMPLE_DATASET_OWNER_USER_ID) {
        selectOptionLabels.push(dataset.owner_user_id);
      }
    });
    datasets.forEach((dataset: IDatasetList) => {
      dataset.labels.forEach((label: string) => {
        if (selectOptionLabels.indexOf(label) === -1) {
          selectOptionLabels.push(label);
        }
      });
    });
    return selectOptionLabels;
  }

  private getAllTenantDatasets(): Promise<any> {
    const promiseList: Promise<any>[] = [];
    this.tenantList.forEach((tenant: ITenantObj) => {
      promiseList.push(this.getTenantDatasets(this.userId, tenant.tenantId));
    });
    return Promise.all(promiseList);
  }

  private getDatasetByParallel(tenantId: string, datasetTotal: number): void {
    const promiseList: Promise<IDatasetResponse>[] = [];
    const limit: string = String(GET_DATASETS_NUM);
    if (datasetTotal === 0) {
      promiseList.push(CoreApiClient.getDatasetList(this.userId, tenantId, String(0), limit, ''));
    } else {
      for (let i = 0; i < datasetTotal; i += Number(limit)) {
        promiseList.push(CoreApiClient.getDatasetList(this.userId, tenantId, String(i), limit, ''));
      }
    }

    Promise.all(promiseList).then((responses: IDatasetResponse[]) => {
      const datasets: IDataset[] = [];
      responses.forEach((response: IDatasetResponse) => {
        datasets.push.apply(datasets, response.datasets);
      });
      const res: IDatasetResponse = {
        metadata: responses[0].metadata,
        datasets: datasets.map((_dataset: any) => {
          return {
            ...this.getTargetDataset(_dataset.dataset_id),
            ..._dataset
          };
        })
      };
      store.commit('setDatasetList', {tenantId: tenantId, datasets: res});
      const allLabels: string[] = this.createAllLabels(res.datasets);
      store.commit('setAllLabelsForDataset', {tenantId: tenantId, allLabels: allLabels});
      const filteredTenant: ITenantObj | undefined = store.state.tenant.tenantList.find((tenant: ITenantObj) => tenant.tenantId === tenantId);
      if (filteredTenant) {
        const selectOptionLabels: string[] = this.createSelectOptionLabels(res.datasets, filteredTenant.isLocal);
        store.commit('setSelectOptionlabelsForDataset', {tenantId: tenantId, selectOptionLabels: selectOptionLabels});
      }
      this.setPollingForDataset(res.datasets, tenantId);
      store.commit('hideDatasetListLoading', tenantId);
    });
  }

  public getDatasetList(param: {userID: string, offset?: string, limit?: string, keyword?: string, tenantId: string}, successCallback: (response: any) => void): void {
    const tenantIds: string = param.tenantId;
    CoreApiClient.getDatasetList(param.userID, tenantIds, param.offset, param.limit, param.keyword).then((response: any) => {
      successCallback(response);
    }, (error: any) => {
      this.$emit('apierror', error);
    });
  }

  public isUploading(datasets: any[]): boolean {
    return datasets.some((dataset) => (dataset.status === 'ready' || dataset.status === 'extracting'));
  }

  private isCopying(datasets: any[]): boolean {
    return datasets.some((dataset) => (dataset.status === 'copying'));
  }

  private setPollingForDataset(datasets: any[], tenantId: string): void {
    if (this.isUploading(datasets) || this.isCopying(datasets)) {
      if (this.pollingDatasetTimerId) {
        clearTimeout(this.pollingDatasetTimerId);
      }
      this.pollingDatasetTimerId = setTimeout(() => {
        const promiseList: Promise<IDatasetResponse>[] = [];
        for (let i = 0; i < Math.floor(this.getDatasetTotal(tenantId)); i += GET_DATASETS_NUM) {
          promiseList.push(CoreApiClient.getDatasetList(this.userId, tenantId, String(i), String(GET_DATASETS_NUM), ''));
        }
        Promise.all(promiseList).then((responses: IDatasetResponse[]) => {
          const newDatasets: IDataset[] = [];
          responses.forEach((response: IDatasetResponse) => {
            newDatasets.push.apply(newDatasets, response.datasets);
          });
          const res: IDatasetResponse = {
            metadata: responses[0].metadata,
            datasets: newDatasets.map((_dataset: IDataset) => {
              return {
                ...this.getTargetDataset(_dataset.dataset_id),
                ..._dataset
              };
            })
          };
          store.commit('setDatasetList', {tenantId: tenantId, datasets: res});
          this.setPollingForDataset(res.datasets, tenantId);
        });
      }, POLLING_INTERVAL);
    }
  }

  public onClickCopy(datasetId: string, ownerUserId: string, datasetName: string): void {
    // サンプルデータセットはコピーできない
    if (this.isSampleDataset(ownerUserId)) {
      const message: string = text[store.state.common.language].dialogTexts.SAMPLE_DATASET_CAN_NOT_COPY;
      SwalUtil.alert(message);
      return;
    }
    const shareTenantList: ITenantObj[] = this.tenantList.filter((tenant: ITenantObj) => !tenant.isLocal);
    const infoMessage: string = text[store.state.common.language].dialogTexts.COPY_DATASET_TO_GROUP;
    const info: {message: string, defaultText: string, tenantList: ITenantObj[]} = {
      message: infoMessage,
      defaultText: datasetName + '_copy',
      tenantList: shareTenantList
    };
    SwalUtil.inputName(info, (newDatasetName: string, tenantId?: string) => {
      if (!newDatasetName) {
        const inputNameMessage: string = text[store.state.common.language].dialogTexts.ENTER_NEW_DATASET_NAME;
        SwalUtil.alert(inputNameMessage);
        return;
      }
      const selectedTenantId: string = tenantId ? tenantId : shareTenantList[0].tenantId;
      store.commit('showDatasetListLoading', selectedTenantId);
      CoreApiClient.copyDataset(this.userId, datasetId, newDatasetName, selectedTenantId).then(() => {
        const datasetTotal: number = Math.floor(this.getDatasetTotal(selectedTenantId) + 1);
        this.getDatasetByParallel(selectedTenantId, datasetTotal);
      }, (error: any) => {
        this.$emit('apierror', error);
      });
    });
  }

  public isValidAction(ownerUserId: string): boolean {
    const userId: string = store.state.common.userId;
    if (ownerUserId === userId) {
      return true;
    }

    const selectedTenant: ITenantObj | undefined = this.tenantList.find((tenant: ITenantObj) => tenant.tenantId === this.selectedTenantId);
    if (!selectedTenant) {
      return false;
    }

    const role: string = selectedTenant.role;
    return role === OWNER_ROLE || role === ADMIN_ROLE;
  }

  public deleteDataset(datasetId: string, ownerUserId: string): void {

    // サンプルデータセットの場合は削除できない
    if (this.isSampleDataset(ownerUserId)) {
      const canNotDeleteMsg = text[store.state.common.language].dialogTexts.SAMPLE_DATASET_CAN_NOT_DELETE;
      SwalUtil.alert(canNotDeleteMsg);
      return;
    }

    if (!this.isValidAction(ownerUserId)) {
      const message: string = text[store.state.common.language].dialogTexts.DO_NOT_HAVE_PERM_TO_DELETE_DATASET;
      SwalUtil.alert(message);
      return;
    }

    const tenantId: string = this.selectedTenantId;

    const datasetName: string = this.getTargetDataset(datasetId).dataset_name;
    if (!datasetName) {
      return;
    }

    const msg: string = text[store.state.common.language].dialogTexts.WILL_BE_DELETE;
    SwalUtil.confirm(datasetName + msg, () => {
      store.commit('showDatasetListLoading', tenantId);
      CoreApiClient.deleteDatasets(this.userId, [datasetId]).then(() => {
        store.commit('updateDeleteFlagForDataset', { tenantId, datasetId });
        ResourceInfoUtil.updateWorkspaceInfo(this.userId, tenantId);
        const datasetTotal: number = Math.floor(this.getDatasetTotal(tenantId));
        this.getDatasetByParallel(tenantId, datasetTotal);
        store.commit('hideDatasetListLoading', tenantId);
      }, (error: any) => {
        this.$emit('apierror', error);
      });
    });
  }

  public deleteAll(e: MouseEvent): void {
    const datasetListElement: HTMLElement | null = document.getElementById('dataset-list');
    if (!datasetListElement) {
      return;
    }

    const checkboxList: any = datasetListElement.getElementsByClassName('checkbox');
    const deletedDatasetIDs: string[] = [];
    let isSampleDatasetID: boolean = false;
    for (let i: number = 0; i < checkboxList.length; i++) {
      if (checkboxList[i].checked) {
        deletedDatasetIDs.push(checkboxList[i].getAttribute('data-did'));
        // サンプルデータセットのIDが含まれていた場合、削除できないフラグを立てる
        if (checkboxList[i].getAttribute('data-owner-userid') === '3') {
          isSampleDatasetID = true;
        }
      }
    }

    if (!deletedDatasetIDs.length) {
      e.stopPropagation();
      return;
    }

    const tenantId: string = this.selectedTenantId;

    const ownerUserIdList: string[] = [];
    const datasetList: IDatasetList[] = store.state.dataset.datasetList[tenantId];

    deletedDatasetIDs.forEach((datasetId: string) => {
      const index: number = datasetList.findIndex((dataset: IDatasetList) => dataset.dataset_id === datasetId);
      if (index !== -1) {
        ownerUserIdList.push(datasetList[index].owner_user_id || '');
      }
    });

    let isAllValidAction: boolean = true;
    if (ownerUserIdList.length) {
      ownerUserIdList.forEach((ownerUserId: string) => {
        if (!this.isValidAction(ownerUserId)) {
          isAllValidAction = false;
        }
      });
    }

    if (!isAllValidAction) {
      const message: string = text[store.state.common.language].dialogTexts.DO_NOT_HAVE_PERMISSION_TO_DELETE_ONE_OR_MORE_DATASET;
      SwalUtil.alert(message);
      return;
    }

    if (isSampleDatasetID) {
      const canNotDeleteMsg = text[store.state.common.language].dialogTexts.SAMPLE_DATASET_CAN_NOT_DELETE;
      SwalUtil.alert(canNotDeleteMsg);
      return;
    }

    const allDatasetDeleteMsg: string = text[store.state.common.language].dialogTexts.ALL_DATASETS_WILL_BE_DELETED;
    SwalUtil.confirm(allDatasetDeleteMsg, () => {
      store.commit('showDatasetListLoading', tenantId);
      CoreApiClient.deleteDatasets(this.userId, deletedDatasetIDs).then(() => {
        deletedDatasetIDs.forEach((_datasetId: string) => {
          store.commit('updateDeleteFlagForDataset', { tenantId, datasetId: _datasetId });
        });
        ResourceInfoUtil.updateWorkspaceInfo(this.userId, tenantId);
        const datasetTotal: number = Math.floor(this.getDatasetTotal(tenantId));
        this.getDatasetByParallel(tenantId, datasetTotal);
        store.commit('hideDatasetListLoading', tenantId);
      }, (error: any) => {
        this.$emit('apierror', error);
      });
    });

  }

  public select(e: any): void {
    e.stopPropagation();
    e.preventDefault();
    const target: any = e.currentTarget;
    const datasetID: string = target.getAttribute('data-did');
    const input: any = document.getElementById(datasetID);
    const checked: boolean = !input.checked;
    store.commit('setDatasetChecked', { tenantId: this.selectedTenantId, datasetID, checked });
  }

  public selectAll(e: any): void {
    const datasetListElement: HTMLElement | null = document.getElementById('dataset-list');
    if (!datasetListElement) {
      return;
    }
    store.commit('selectDatasetAll', {tenantId: this.selectedTenantId, checked: e.currentTarget.checked});
  }

  public checked(): boolean {
    const datasetList: any = store.state.dataset.datasetList[this.selectedTenantId];
    if (!datasetList || !datasetList.length) {
      return false;
    }

    let checked: boolean = false;
    for (let i: number = 0; i < datasetList.length; i++) {
      if (datasetList[i].checked) {
        checked = true;
        break;
      }
    }
    return checked;
  }

  get shouldShowUploadDialog(): boolean {
    return store.state.dataset.shouldShowUploadDialog;
  }

  get isShowingDialog(): boolean {
    return store.state.dataset.shouldShowDialog || store.state.dataset.shouldShowUploadDialog;
  }

  public openUploadDialog(): void {
    store.commit('showUploadDialogForDataset');
  }

  public onCancelUploadDataset(): void {
    store.commit('hideUploadDialogForDataset');
  }

  public async uploadDatasetFromBrowser(datasetName: string, files: File[], fileSize: number): Promise<void> {
    const uploader: HTMLInputElement | null = document.getElementById('dataset-uploader') as HTMLInputElement;
    if (uploader) {
      uploader.value = '';
    }
    const tenantId: string = this.selectedTenantId;
    store.commit('showDatasetListLoading', tenantId);
    if (!fileSize) {
      return;
    }

    let encryptedText = '';
    try {
      const tokenResponse = await CoreApiClient.getToken(this.userId, tenantId);
      encryptedText = tokenResponse.encrypted_text;
    } catch (error) {
      this.$emit('apierror', error);
      return;
    }
    let accessKeyId: string = '';
    let secretAccessKey: string = '';
    let sessionToken: string = '';
    let datasetId: string = '';
    let uploadPath: string = '';
    try {
      const credentialResponse = await CoreApiClient.getCredentials(encryptedText, datasetName, fileSize);
      accessKeyId = credentialResponse.access_key_id;
      secretAccessKey = credentialResponse.secret_access_key;
      sessionToken = credentialResponse.session_token;
      datasetId = credentialResponse.dataset_id;
      uploadPath = credentialResponse.upload_path;
    } catch (error) {
      this.$emit('apierror', error);
      return;
    }

    const warningMessage: string = text[store.state.common.language].dialogTexts.IT_WILL_TAKE_LONG_TIME_FOR_DATASET;
    SwalUtil.alert(warningMessage, () => {
      store.commit('hideDatasetListLoading', tenantId);
    });

    const datasetTotal: number = Math.floor(this.getDatasetTotal(tenantId) + 1);
    this.getDatasetByParallel(tenantId, datasetTotal);

    // upload_pathからbucket名とKeyを取得
    const reg: RegExp = new RegExp('\s3://(.+?)$');
    const bucketAndKey: string = (uploadPath.match(reg) as string[])[1];
    const key: string = bucketAndKey.split('/')[1];
    const bucketName: string = bucketAndKey.split('/')[0];

    const s3: AWS.S3 = new AWS.S3({
      accessKeyId,
      secretAccessKey,
      sessionToken,
      region: uploadBucketRegion
    });

    const s3Params: AWS.S3.Types.CreateMultipartUploadRequest = {
      Bucket: bucketName,
      Key: key + '/' + files[0].name,
      ContentType : files[0].type
    };
    S3Util.uploadMultiPart(s3, s3Params, files[0], (progress: number) => {
      // 進捗が進んだ際のcallback
      store.commit('updateDatasetProgress', {
        tenantId,
        datasetId,
        progress
      });
    }, () => {
      // success callback
      const readyMessage: string = text[store.state.common.language].dialogTexts.IT_IS_READY_TO_UPLOAD;
      SwalUtil.alert(readyMessage, () => {
        return;
      });
    }, () => {
      // error callback
      const failedMessage: string = text[store.state.common.language].dialogTexts.DATASET_UPLOAD_FAILED;
      SwalUtil.alert(failedMessage, () => {
        return;
      });
    });
  }

  public uploadDataset(e: any): void {
    e.stopPropagation();
    if (store.state.dataset.shouldShowCopyArea) {
      store.commit('hideCopyArea');
      return;
    }

    const tenantId: string = this.selectedTenantId;

    store.commit('showDatasetListLoading', tenantId);
    CoreApiClient.getToken(this.userId, this.selectedTenantId).then((res: any) => {
      store.commit('hideDatasetListLoading', tenantId);
      store.commit('setToken', {tenantId: this.selectedTenantId, token: res['encrypted_text']});
      store.commit('showCopyArea');
    }, (error: any) => {
      this.$emit('apierror', error);
    });
  }

  public close(): void {
    store.commit('hideCopyArea');
  }

  public copyUrl(e: any): void {
    e.stopPropagation();
    const input: any = document.getElementById('upload-dataset-input');
    input.focus();
    input.select();
    document.execCommand('copy');
  }

  public isSelectedLocalTenant(): boolean {
    const selectedTenantId: string = store.state.dataset.selectedTenantId[this.selectedTenantId];
    return (this.tenantList.find((tenant: ITenantObj) => tenant.tenantId === selectedTenantId) || {isLocal: false}).isLocal;
  }

  private isSamePage(row: number): boolean {
    return this.previewPage === (row / 10 + 1);
  }

  public async getPreviewData(datasetId: string, param: {row: string, column: string}): Promise<void> {
    const tenantId: string = this.selectedTenantId;
    store.commit('setMinColumn', {tenantId: tenantId, min: 0});
    const previewList: HTMLElement | null = document.getElementById('dataset-preview-list');
    if (previewList) {
      previewList.scrollLeft = 0;
    }
    store.commit('showDatasetPreviewListLoading', tenantId);
    store.commit('setPreviewPage', {
      tenantId,
      page: (Number(param.row) / 10) + 1
    });
    store.commit('selectDatasetId', {
      tenantId,
      datasetId
    });
    try {
      const res: any = await CoreApiClient.getPreviewDataList(this.userId, datasetId, param);
      // 最大 MAX_INITIAL_DATASET_NUMBER 件まで取得
      const columnLength: number = res.dataset.csv_header.split(',').length <= MAX_INITIAL_DATASET_NUMBER ? res.dataset.csv_header.split(',').length : MAX_INITIAL_DATASET_NUMBER;
      res.datasetID = datasetId;
      if (!this.isSamePage(res.metadata.row) || datasetId !== store.state.dataset.selectedDatasetID[tenantId]) {
        return;
      }
      store.commit('setMaxColumn', {tenantId: tenantId, max: 10});
      store.commit('setPreviewList', {tenantId: tenantId, previews: res});
      if (columnLength <= GET_COLUMN_INTERVAL) {
        this.isUnavailableScroll = false;
        store.commit('hideDatasetPreviewListLoading', tenantId);
        store.commit('setIsDatasetCacheNotFoundError', {tenantId: tenantId, flag: false});
        return;
      }
      const promiseList: any = [];
      for (let i = GET_COLUMN_INTERVAL; i < Math.floor(columnLength); i += GET_COLUMN_INTERVAL) {
        promiseList.push(CoreApiClient.getPreviewDataList(this.userId, datasetId, {
          row: param.row,
          column: i
        }));
      }

      try {
        const responses: any[] = await Promise.all(promiseList);
        if (!this.isSamePage(responses[0].metadata.row) || datasetId !== store.state.dataset.selectedDatasetID[tenantId]) {
          return;
        }
        responses.forEach((response, i) => {
          response.datasetID = datasetId;
          store.commit('addPreviewList', {tenantId: tenantId, previews: response, isNext: true});
        });
        store.commit('setMaxColumn', {tenantId: tenantId, max: columnLength});
        this.isUnavailableScroll = false;
        store.commit('setIsDatasetCacheNotFoundError', {tenantId: tenantId, flag: false});
      } catch (error) {
        this.$emit('apierror', error, (errorResponse: any) => {
          if (this.isDatasetCacheNotFoundError(errorResponse)) {
            store.commit('setMaxColumn', 0);
            store.commit('setPreviewListIfNotCache', {tenantId: tenantId, datasetID: datasetId, row: param.row});
            store.commit('setIsDatasetCacheNotFoundError', {tenantId: tenantId, flag: true});
            return;
          } else {
            store.commit('setIsDatasetCacheNotFoundError', {tenantId: tenantId, flag: false});
          }
        });
      } finally {
        store.commit('hideDatasetPreviewListLoading', tenantId);
      }
    } catch (error) {
      this.$emit('apierror', error, (errorResponse: any) => {
        store.commit('hideDatasetPreviewListLoading', tenantId);
        if (this.isDatasetCacheNotFoundError(errorResponse)) {
          store.commit('setMaxColumn', 0);
          store.commit('setPreviewListIfNotCache', {tenantId: tenantId, datasetID: datasetId, row: param.row});
          store.commit('setIsDatasetCacheNotFoundError', {tenantId: tenantId, flag: true});
          return;
        } else {
          store.commit('setIsDatasetCacheNotFoundError', {tenantId: tenantId, flag: false});
        }
      });
    }
  }

  public isDatasetCacheNotFoundError(error: any): boolean {
    return error.response.data.error === 'NNCD_DATASET_CACHE_NOT_FOUND';
  }

  public isDatasetCacheNotFoundErrorFromStore(): boolean {
    return store.state.dataset.isDatasetCacheNotFoundError[this.selectedTenantId];
  }

  public onClickDataset(e: any): void {
    const datasetID: string = e.currentTarget.getAttribute('data-did');
    store.commit('setPreviewDatasetID', {tenantId: this.selectedTenantId, datasetId: datasetID});
    const selectedDataset: IDatasetList[] = this.datasetList.filter((dataset: IDatasetList) => dataset.dataset_id === datasetID);
    store.commit('setFeatures', {tenantId: this.selectedTenantId, features: selectedDataset[0].features});
    const param = {
      row: '0',
      column: '0'
    };
    this.getPreviewData(datasetID, param);
  }

  public onscroll(e: any): void {
    if ((e.target.scrollLeft + e.target.offsetWidth) >= e.target.scrollWidth && !this.isUnavailableScroll) {
      const maxColumn: number = this.datasetStore.maxColumn[this.selectedTenantId];
      const columnLength: number = this.datasetStore.columnLength[this.selectedTenantId];
      if (columnLength <= maxColumn) {
        return;
      }
      const param = {
        row: String((this.datasetStore.previewPage[this.selectedTenantId] - 1) * 10),
        column: String(maxColumn)
      };
      this.isUnavailableScroll = true;
      this.getNextColumn(e.target, this.selectedTenantId, param, true);
    } else if ((e.target.scrollLeft === 0) && !this.isUnavailableScroll) {
      const minColumn: number = this.datasetStore.minColumn[this.selectedTenantId];
      if (minColumn === 0) {
        return;
      }
      const param = {
        row: String((this.datasetStore.previewPage[this.selectedTenantId] - 1) * 10),
        column: String(minColumn - GET_COLUMN_INTERVAL)
      };
      this.isUnavailableScroll = true;
      this.getNextColumn(e.target, this.selectedTenantId, param, false);
    }
  }

  public async getNextColumn(element: HTMLElement, tenantId: string, param: {row: string, column: string}, isNext: boolean): Promise<void> {
    const datasetId: string = this.datasetStore.selectedDatasetID[tenantId];
    store.commit('showDatasetPreviewListLoading', tenantId);
    try {
      const res: any = await CoreApiClient.getPreviewDataList(this.userId, datasetId, param);
      res.datasetID = datasetId;
      if (isNext) {
        const nextMaxColumn: number = Number(param.column) + GET_COLUMN_INTERVAL;
        store.commit('setMaxColumn', {tenantId: tenantId, max: nextMaxColumn});
        store.commit('addPreviewList', {tenantId: tenantId, previews: res, isNext: true});
        Vue.nextTick(() => {
          // 追加カラムのサイズ
          const remainScroll: number = element.scrollWidth - (element.scrollLeft + element.offsetWidth);
          store.commit('setMinColumn', {tenantId: tenantId, min: nextMaxColumn - MAX_INITIAL_DATASET_NUMBER});
          store.commit('splicePreviewList', {tenantId, start: 0, end: GET_COLUMN_INTERVAL});
          Vue.nextTick(() => {
            element.scrollLeft -= remainScroll;
            store.commit('hideDatasetPreviewListLoading', tenantId);
            this.isUnavailableScroll = false;
          });
        });
      } else {
        const nextMaxColumn: number = Number(param.column) + MAX_INITIAL_DATASET_NUMBER;
        store.commit('setMaxColumn', {tenantId, max: nextMaxColumn});
        store.commit('addPreviewList', {tenantId, previews: res, isNext: false});
        Vue.nextTick(() => {
          // // 追加カラムのサイズ
          const indexColumn: HTMLElement = document.getElementById('index-column') as HTMLElement;
          const indexOffsetLeft: number = indexColumn.offsetLeft || 0;
          const indexWidth = indexColumn.offsetWidth;
          const data: HTMLElement = document.getElementById(`data_${GET_COLUMN_INTERVAL}`) as HTMLElement;
          const dataLeft = data.offsetLeft - indexOffsetLeft - indexWidth - 1;

          store.commit('setMinColumn', {tenantId: tenantId, min: nextMaxColumn - MAX_INITIAL_DATASET_NUMBER});
          store.commit('splicePreviewList', {tenantId, start: MAX_INITIAL_DATASET_NUMBER, end: GET_COLUMN_INTERVAL});
          Vue.nextTick(() => {
            element.scrollLeft += dataLeft;
            store.commit('hideDatasetPreviewListLoading', tenantId);
            this.isUnavailableScroll = false;
          });
        });
      }
    } catch (error) {
      this.$emit('apierror', error, (errorResponse: any) => {
        store.commit('hideDatasetPreviewListLoading', tenantId);
        if (this.isDatasetCacheNotFoundError(errorResponse)) {
          store.commit('setMaxColumn', {tenantId: tenantId, max: 0});
          store.commit('setPreviewListIfNotCache', {tenantId: tenantId, datasetID: datasetId, row: param.row});
          store.commit('setIsDatasetCacheNotFoundError', {tenantId: tenantId, flag: true});
          return;
        } else {
          store.commit('setIsDatasetCacheNotFoundError', {tenantId: tenantId, flag: false});
        }
      });
    }
  }

  public getPreviousPage(e: any): void {
    if (store.state.dataset.previewPage[this.selectedTenantId] === 1) {
      return;
    }
    this.isUnavailableScroll = true;
    const datasetID: string = store.state.dataset.selectedDatasetID[this.selectedTenantId];
    const param = {
      row: String((store.state.dataset.previewPage[this.selectedTenantId] - 2) * 10),
      column: '0'
    };
    this.getPreviewData(datasetID, param);
  }

  public getFirstPage(e: any): void {
    if (store.state.dataset.previewPage[this.selectedTenantId] === 1) {
      return;
    }
    this.isUnavailableScroll = true;
    const datasetID: string = store.state.dataset.selectedDatasetID[this.selectedTenantId];
    const param = {
      row: '0',
      column: '0'
    };
    this.getPreviewData(datasetID, param);
  }

  public getNextPage(e: any): void {
    if (store.state.dataset.previewPage[this.selectedTenantId] === this.getMaxPage()) {
      return;
    }
    this.isUnavailableScroll = true;
    const datasetID: string = store.state.dataset.selectedDatasetID[this.selectedTenantId];
    const param = {
      row: String(store.state.dataset.previewPage[this.selectedTenantId] * 10),
      column: '0'
    };
    this.getPreviewData(datasetID, param);
  }

  public getLastPage(e: any): void {
    if (store.state.dataset.previewPage[this.selectedTenantId] === this.getMaxPage()) {
      return;
    }
    this.isUnavailableScroll = true;
    const datasetID: string = store.state.dataset.selectedDatasetID[this.selectedTenantId];
    const param = {
      row: String((this.getMaxPage() - 1) * 10),
      column: '0'
    };
    this.getPreviewData(datasetID, param);
  }

  public getPreviewPage(e: any): void {
    const page: number = Number(e.currentTarget.value);
    if (!page || page < 1 || this.getMaxPage() < page || page === store.state.dataset.previewPage[this.selectedTenantId]) {
      e.currentTarget.value = store.state.dataset.previewPage[this.selectedTenantId];
      return;
    }
    this.isUnavailableScroll = true;
    const datasetID: string = store.state.dataset.selectedDatasetID[this.selectedTenantId];
    store.commit('setPage', {tenantId: this.selectedTenantId, page});
    const param = {
      row: String((page - 1) * 10),
      column: '0'
    };
    this.getPreviewData(datasetID, param);
  }

  public getMaxPage(): number {
    return Math.ceil(this.previewTotal / 10);
  }

  public shouldShowCopyIcon(): boolean {
    return this.isLocalTenant() && this.hasShareTenant;
  }

  private getWorkspaceQuotaString(): string {
    return ConvertUtil.convertByteToGB(ResourceInfoUtil.getWorkspaceQuota(this.selectedTenantId), false).toString();
  }

  private getWorkspaceUsedString(): string {
    return ConvertUtil.convertByteToGB(ResourceInfoUtil.getWorkspaceUsed(this.selectedTenantId), true).toFixed(1);
  }

  public isCloseToTheLimitWorkspace(): boolean {
    return ResourceInfoUtil.isCloseToTheLimitWorkspaceUsed(this.selectedTenantId);
  }

  public calcDatasetStorage(storage: number): string {
    const mb: number = ConvertUtil.calcMBStorage(storage);
    if (mb >= STORAGE_UNIT_BORDER) {
      return String(ConvertUtil.calcStorage(storage)) + 'GB';
    } else {
      return String(mb) + 'MB';
    }
  }

  public getPreviewColumnAndRows(): {column?: string, row?: string} {
    const previewDatasetID: string = store.state.dataset.previewDatasetID[this.selectedTenantId];
    if (!previewDatasetID || !this.datasetList) {
      return {};
    }
    const previewDataset: any = this.datasetList.filter((dataset: any) => {
      return dataset.dataset_id === previewDatasetID;
    });
    if (!previewDataset || !previewDataset[0]) {
      return {};
    }
    return {
      column: previewDataset[0].column_num,
      row: previewDataset[0].data_num
    };
  }

  public oninput(value: string): void {
    store.commit('setKeywordForDataset', {tenantId: this.selectedTenantId, keyword: value});
  }

  public initKeyword(): void {
    store.commit('setKeywordForDataset', {tenantId: this.selectedTenantId, keyword: ''});
  }

  public onChangeTab(tenantId: string): void {
    this.onClickTenantTab(tenantId);
    this.setPollingForDataset(store.state.dataset.datasetList[tenantId], tenantId);
  }

  public getOwnerName(ownerUserId: string): string {
    if (!ownerUserId) {
      return '';
    }
    if (this.isSampleDataset(ownerUserId)) {
      return 'SAMPLE';
    }
    const memberList: IMemberObj[] = store.state.tenant.memberList[this.selectedTenantId];
    if (!memberList.length) {
      return '';
    }
    const member: IMemberObj | undefined = memberList.find((_member: IMemberObj) => _member.userId === ownerUserId);
    if (!member) {
      // 画面表示後に追加されたユーザー/退会したユーザー
      return `Missing user (${ownerUserId})`;
    }
    const nickname: string = member.nickname;
    const userId: string = member.userId;
    if (member.deleted) {
      if (nickname) {
        return `${nickname} / Missing user (${userId})`;
      } else {
        return `Missing user (${userId})`;
      }
    } else {
      if (nickname) {
        return `${nickname} (${userId})`;
      } else {
        return userId;
      }
    }
  }

  public getWarningList(): {tenantId: string, shouldShowWarning: boolean}[] {
    return this.tenantList.map((tenant: ITenantObj) => {
      const tenantId: string = tenant.tenantId;
      return {
        tenantId: tenantId,
        shouldShowWarning: ResourceInfoUtil.isCloseToTheLimitWorkspaceUsed(tenantId)
      };
    });
  }

  public onClickLabel(datasetId: string): void {
    const currentLabelList: string[] = this.getTargetDataset(datasetId).labels;
    store.commit('setDatasetIdForLabel', datasetId);
    store.commit('setDatasetLabels', currentLabelList);
    store.commit('showDialogForDataset');
  }

  get vueTexts(): TextType {
    return text[this.language].vueTexts.datasets;
  }

  get commonVueTexts(): TextType {
    return text[this.language].vueTexts.common;
  }

  get dialogTexts(): string {
    return text[this.language].dialogTexts;
  }

  get shouldShowDialog(): boolean {
    return store.state.dataset.shouldShowDialog;
  }

  get labelList(): string[] {
    return store.state.dataset.selectOptionLabels[this.selectedTenantId];
  }

  public getDatasetLabelList(): string[] {
    return store.state.dataset.datasetLabels;
  }

  public getAllLabelList(): string[] {
    return store.state.dataset.allLabels[this.selectedTenantId];
  }

  public getSelectOptionlabels(): string[] {
    return store.state.dataset.selectOptionLabels[this.selectedTenantId];
  }

  public onUpdate(labelList: string[]): void {
    const datasetId: string = store.state.dataset.datasetIdForLabel;
    const tenantId: string = this.selectedTenantId;
    store.commit('showDatasetListLoading', tenantId);
    CoreApiClient.putLabelToDataset(this.userId, datasetId, labelList).then(() => {
      store.commit('updateDatasetLabel', {tenantId, datasetId, labels: labelList.sort()});
      const datasetTotal: number = Math.floor(this.getDatasetTotal(tenantId));
      this.getDatasetByParallel(tenantId, datasetTotal);
      store.commit('hideDatasetListLoading', tenantId);
    }, (error: any) => {
      this.$emit('apierror', error);
    });
    store.commit('hideDialogForDataset');
  }

  public onCreateLabel(newLabel: string): void {
    const optionLabels: string[] = store.state.dataset.selectOptionLabels[this.selectedTenantId];
    optionLabels.push(newLabel);
    store.commit('setSelectOptionlabelsForDataset', {tenantId: this.selectedTenantId, selectOptionLabels: optionLabels});
  }

  public onCancel(): void {
    store.commit('hideDialogForDataset');
  }

  public changeLabel(e: any): void {
    store.commit('setSelectedLabelForDataset', {tenantId: this.selectedTenantId, selectedLabel: e.currentTarget.value});
  }

  public isSampleDataset(owner_user_id: string): boolean {
    return owner_user_id === SAMPLE_DATASET_OWNER_USER_ID;
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

  public showUploadErrorMsg(uploadErrorCode: number): void {
    if (uploadErrorCode) {
      CoreApiClient.getUploadErrorMessage(uploadErrorCode).then((response: any) => {
        SwalUtil.alert(response.message[store.state.common.language], () => {
          return;
        });
      }, (error: any) => {
        this.$emit('apierror', error, (errorResponse: any) => {
          if (errorResponse && (errorResponse.response.status === 403 || errorResponse.response.status === 404)) {
            SwalUtil.alert(text[store.state.common.language].dialogTexts.DEFAULT_ERROR, () => {
              return;
            });
          } else {
            this.onUnexpectedError(errorResponse);
          }
        });
      });
    } else {
      SwalUtil.alert(text[store.state.common.language].dialogTexts.DEFAULT_ERROR, () => {
        return;
      });
    }
  }

  public onFocus(e: any): void {
    if (document.getElementsByClassName('swal2-container').length) {
      e.target.blur();
    }
  }

  public onClickRenameIcon(datasetId: string): void {
    const tenantId: string = this.selectedTenantId;
    const dataset: IDatasetList = this.getTargetDataset(datasetId);
    store.commit('showDatasetRenameInput', {tenantId, datasetId});
    store.commit('inputDatasetName', {
      tenantId,
      datasetId,
      datasetName: dataset.dataset_name
    });
  }

  public updated() {
    const input: any = document.getElementById('dataset-name-input');
    if (input) {
      input.focus();
    }
  }

  public inputDatasetName(datasetId: string, datasetName: string): void {
    store.commit('inputDatasetName', {tenantId: this.selectedTenantId, datasetId, datasetName});
  }

  public onKeydownDatasetName(e: any): void {
    switch (e.keyCode) {
      case 27: // Esc
      case 13: // Enter
        e.target.blur();
        break;

      default:
        break;
    }
  }

  private isInvalidDatasetName(error: any): boolean {
    return error.response.status === 400 && error.response.data.message === 'Invalid body(schema error)';
  }

  public rename(e: any, datasetId: string): void {
    const currentTarget: any = e.currentTarget;
    if (currentTarget.disabled) {
      return;
    }
    e.stopPropagation();
    currentTarget.disabled = true;
    const tenantId: string = this.selectedTenantId;
    store.commit('showDatasetListLoading', tenantId);
    const targetDataset: IDatasetList = this.getTargetDataset(datasetId);
    const newDatasetName: string = targetDataset.inputValue as string;
    const oldDatasetName: string = targetDataset.dataset_name;
    if (!newDatasetName || newDatasetName === oldDatasetName) {
      store.commit('hideDatasetRenameInput', {tenantId: tenantId, datasetId: datasetId});
      store.commit('hideDatasetListLoading', tenantId);
      return;
    }
    CoreApiClient.updateDatasetName(this.userId, datasetId, newDatasetName).then(() => {
      store.commit('renameDataset', {tenantId: tenantId, datasetId, datasetName: newDatasetName});
      store.commit('hideDatasetRenameInput', {tenantId: tenantId, datasetId: datasetId});
      store.commit('hideDatasetListLoading', tenantId);
      const datasetTotal: number = Math.floor(this.getDatasetTotal(tenantId));
      this.getDatasetByParallel(tenantId, datasetTotal);
    }, (error: any) => {
      store.commit('inputDatasetName', {tenantId: tenantId, datasetId, oldDatasetName});
      store.commit('hideDatasetRenameInput', {tenantId: tenantId, datasetId: datasetId});
      this.$emit('apierror', error, (errorResponse: any) => {
        if (this.isInvalidDatasetName(errorResponse)) {
          const message: string = text[store.state.common.language].dialogTexts.INVALID_CHARACTER_INCLUDED;
          SwalUtil.alert(message, () => {
            currentTarget.disabled = false;
            store.commit('hideDatasetListLoading', tenantId);
          });
        } else {
          this.onUnexpectedError(errorResponse);
        }
      });
    });
  }

  public getOriginalFile(original: boolean, currentRow: number, currentColumn: number): void {
    if (!original) {
      return;
    }
    const tenantId: string = this.selectedTenantId;
    const previewOffset: number = store.state.dataset.previewOffset[tenantId];
    if (previewOffset) {
      currentRow += previewOffset;
    }
    const datasetId: string = store.state.dataset.selectedDatasetID[tenantId];
    store.commit('showDatasetPreviewListLoading', tenantId);
    CoreApiClient.getOriginalFile(this.userId, datasetId, String(currentRow), String(currentColumn)).then((res: any) => {
      const anchor: any = document.createElement('a');
      anchor.href = res.download_url;
      anchor.target = '_blank';
      anchor.click();
      store.commit('hideDatasetPreviewListLoading', tenantId);
    }, (error: any) => {
      this.$emit('apierror', error, (errorResponse: any) => {
        if (this.isOriginalFileNotFind(errorResponse)) {
          store.commit('hideDatasetPreviewListLoading', tenantId);
          const message: string = text[store.state.common.language].dialogTexts.YOU_CAN_NOT_DOWNLOAD;
          SwalUtil.alert(message, () => {
            return;
          });
        } else {
          this.onUnexpectedError(errorResponse);
        }
      });
    });
  }

  private isOriginalFileNotFind(error: any): boolean {
    return error.response.status === 400 && error.response.data.message === 'Not found original data';
  }

  private getTargetDataset(datasetId: string): IDatasetList {
    return store.state.dataset.datasetList[this.selectedTenantId].find((_dataset: IDatasetList) => _dataset.dataset_id === datasetId) || {} as IDatasetList;
  }

}
