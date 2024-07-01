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

import { IState } from '../state';
import { IDatasetList, IProgress } from '../state/dataset';
import {ITenant} from '../../interfaces/core-response/ITenant';
import { ISampleDatasetResponse } from '../../interfaces/core-response/IDataset';
import { ITenantObj } from '../state/tenant';

interface IDatasetParam {
  metadata: {
    offset: number;
    limit: number;
    sort_by: string;
    total: number;
  };
  datasets: {
    dataset_id: string;
    dataset_name: string;
    tenant_id: string;
    owner_user_id: string;
    csv_header: string;
    data_num: number;
    column_num: number;
    extract_progress: number;
    status: string;
    storage_used: number;
  }[];
}

interface IPreviewDataParam {
  datasetID: string;
  metadata: {
    row: number;
    numrows: number,
    column: number;
    numcolumns: number;
    total: number;
  };
  dataset: {
    csv_header: string;
    result: {type: string, data: string}[][];
  };
}

interface IFeatures {
  shape: number[];
  type: string;
  variable: string;
}

/** データセットの最大の表示数 */
const MAX_DATASET_NUMBER: number = 500;

/** データセットプレビューの最大の表示数 */
const MAX_DATASET_PREVIEW_NUMBER: number = 500;

/** サンプルデータセットのオーナーユーザーID */
const SAMPLE_DATASET_OWNER_USER_ID: string = '3';

/**
 * サンプルデータセットを設定します。
 * @param state
 * @param payload
 */
export function setSampleDatasetList(state: IState, payload: ISampleDatasetResponse): void {
  state.dataset.sampleDatasetList = payload.datasets;
}

/**
 * データセットを設定します。
 * @param state
 * @param payload
 */
export function setDatasetList(state: any, payload: {tenantId: string, datasets: IDatasetParam}): void {
  const total: number = payload.datasets.metadata.total;
  state.dataset.datasetTotal[payload.tenantId] = total <= MAX_DATASET_NUMBER ? total : MAX_DATASET_NUMBER;
  state.dataset.datasetList[payload.tenantId] = payload.datasets.datasets;
  state.dataset = Object.assign({}, state.dataset);
}

/**
 * データセットを追加します
 * @param state
 * @param payload
 */
export function addDatasetList(state: any, payload: {tenantId: string, datasets: IDatasetParam}): void {
  const datasetList: any[] = state.dataset.datasetList[payload.tenantId];
  state.dataset.datasetList[payload.tenantId] = datasetList.concat(payload.datasets.datasets);
  state.dataset = Object.assign({}, state.dataset);
}

/**
 * previewするデータセットIDを設定します。
 * @param state
 * @param payload
 */
export function setPreviewDatasetID(state: any, payload: {tenantId: string, datasetId: string}): void {
  state.dataset.previewDatasetID[payload.tenantId] = payload.datasetId;
  state.dataset = Object.assign({}, state.dataset);
}

export function setPreviewList(state: any, payload: {tenantId: string, previews: IPreviewDataParam}): void {
  const total: number = payload.previews.metadata.total;
  state.dataset.previewTotal[payload.tenantId] = total;
  state.dataset.previewPage[payload.tenantId] = (payload.previews.metadata.row / 10) + 1;
  state.dataset.previewHeader[payload.tenantId] = payload.previews.dataset.csv_header.split(',');
  state.dataset.selectedDatasetID[payload.tenantId] = payload.previews.datasetID;
  state.dataset.previewOffset[payload.tenantId] = payload.previews.metadata.row;
  state.dataset.previewList[payload.tenantId] = payload.previews.dataset.result;
  state.dataset.columnLength[payload.tenantId] = state.dataset.previewHeader[payload.tenantId].length;
  state.dataset = Object.assign({}, state.dataset);
}

export function setPreviewPage(state: any, payload: {tenantId: string, page: number}): void {
  state.dataset.previewPage[payload.tenantId] = payload.page;
  state.dataset = Object.assign({}, state.dataset);
}

export function setMaxColumn(state: any, payload: {tenantId: string, max: number}): void {
  state.dataset.maxColumn[payload.tenantId] = payload.max;
  state.dataset = Object.assign({}, state.dataset);
}

export function setMinColumn(state: IState, payload: {tenantId: string, min: number}): void {
  state.dataset.minColumn[payload.tenantId] = payload.min;
  state.dataset = Object.assign({}, state.dataset);
}

export function addPreviewList(state: any, payload: {tenantId: string, previews: IPreviewDataParam, isNext?: boolean}): void {
  state.dataset.previewList[payload.tenantId] = state.dataset.previewList[payload.tenantId].map((preview: any, i: number) => {
    if (payload.previews.dataset.result[i]) {
      if (payload.isNext) {
        return preview.concat(payload.previews.dataset.result[i]);
      } else {
        return payload.previews.dataset.result[i].concat(preview);
      }
    } else {
      return preview;
    }
  });
  state.dataset = Object.assign({}, state.dataset);
}

export function splicePreviewList(state: IState, payload: {tenantId: string, start: number, end: number}): void {
  state.dataset.previewList[payload.tenantId].forEach((preview: any) => {
    preview.splice(payload.start, payload.end);
  });
  state.dataset = Object.assign({}, state.dataset);
}

/**
 * 選択のフラグを設定します
 * @param state
 * @param payload
 */
export function setDatasetChecked(state: any, payload: {tenantId: string, datasetID: string, checked: boolean}): void {
  const datasetList: any[] = [].concat(state.dataset.datasetList[payload.tenantId]);
  datasetList.forEach((dataset) => {
    if (dataset.dataset_id === payload.datasetID) {
      dataset.checked = payload.checked;
    }
  });
  state.dataset.datasetList[payload.tenantId] = datasetList;
  state.dataset = Object.assign({}, state.dataset);
}

/**
 * 全選択を行います
 * @param state
 * @param payload
 */
export function selectDatasetAll(state: any, payload: {tenantId: string, checked: boolean}): void {
  const datasetList: any[] = [].concat(state.dataset.datasetList[payload.tenantId]);
  datasetList.forEach((dataset: any) => {
    if (dataset.owner_user_id !== SAMPLE_DATASET_OWNER_USER_ID) {
      dataset.checked = payload.checked;
    }
  });
  state.dataset.datasetList[payload.tenantId] = datasetList;
  state.dataset.allChecked[payload.tenantId] = payload.checked;
  state.dataset = Object.assign({}, state.dataset);
}

/**
 * トークンを設定します
 * @param state
 * @param payload
 */
export function setToken(state: any, payload: {tenantId: string, token: string}): void {
  state.dataset.token[payload.tenantId] = payload.token;
  state.dataset = Object.assign({}, state.dataset);
}

/**
 * ページを設定します
 * @param state
 * @param payload
 */
export function setPage(state: any, payload: {tenantId: string, page: number}): void {
  state.dataset.previewPage[payload.tenantId] = payload.page;
  state.dataset = Object.assign({}, state.dataset);
}

/**
 * 選択されているデータセットIDを設定します
 * @param state
 * @param payload
 */
export function selectDatasetId(state: any, payload: {tenantId: string, datasetId: number}): void {
  state.dataset.selectedDatasetID[payload.tenantId] = payload.datasetId;
  state.dataset = Object.assign({}, state.dataset);
}

export function setKeywordForDataset(state: any, payload: {tenantId: string, keyword: string}): void {
  state.dataset.keyword[payload.tenantId] = payload.keyword;
  state.dataset = Object.assign({}, state.dataset);
}

export function setIsDatasetCacheNotFoundError(state: any, payload: {tenantId: string, flag: boolean}): void {
  state.dataset.isDatasetCacheNotFoundError[payload.tenantId] = payload.flag;
  state.dataset = Object.assign({}, state.dataset);
}

export function setPreviewListIfNotCache(state: any, payload: {tenantId: string, datasetID: string, row: number}): void {
  state.dataset.previewPage[payload.tenantId] = (payload.row / 10) + 1;
  state.dataset.previewHeader[payload.tenantId] = '';
  state.dataset.selectedDatasetID[payload.tenantId] = payload.datasetID;
  state.dataset.previewOffset[payload.tenantId] = 0;
  state.dataset.previewList[payload.tenantId] = [[]];
  state.dataset.columnLength[payload.tenantId] = 0;
  state.dataset = Object.assign({}, state.dataset);
}

export function showCopyArea(state: any): void {
  state.dataset.shouldShowCopyArea = true;
}

export function hideCopyArea(state: any): void {
  state.dataset.shouldShowCopyArea = false;
}

export function selectTenantId(state: any, payload: string): void {
  state.dataset.selectedTenantId = payload;
}

export function showDatasetListLoading(state: any, payload: string): void {
  state.dataset.datasetListLoading[payload] = true;
  state.dataset = Object.assign({}, state.dataset);
}

export function hideDatasetListLoading(state: any, payload: string): void {
  state.dataset.datasetListLoading[payload] = false;
  state.dataset = Object.assign({}, state.dataset);
}

export function hideAllDatasetListLoading(state: IState): void {
  state.tenant.tenantList.forEach((_tenant: ITenantObj) => {
    state.dataset.datasetListLoading[_tenant.tenantId] = false;
  });
  state.dataset = Object.assign({}, state.dataset);
}

export function showDatasetPreviewListLoading(state: any, payload: string): void {
  state.dataset.datasetPreviewListLoading[payload] = true;
  state.dataset = Object.assign({}, state.dataset);
}

export function hideDatasetPreviewListLoading(state: any, payload: string): void {
  state.dataset.datasetPreviewListLoading[payload] = false;
  state.dataset = Object.assign({}, state.dataset);
}

export function initDataset(state: IState, payload: ITenant[]): void {
  payload.forEach((tenant: ITenant) => {
    state.dataset.datasetTotal[tenant.tenant_id] = 0;
    state.dataset.datasetList[tenant.tenant_id] = [];
    state.dataset.progressList[tenant.tenant_id] = [];
    state.dataset.selectedDatasetID[tenant.tenant_id] = '0';
    state.dataset.previewOffset[tenant.tenant_id] = 0;
    state.dataset.previewTotal[tenant.tenant_id] = 0;
    state.dataset.previewPage[tenant.tenant_id] = 0;
    state.dataset.previewHeader[tenant.tenant_id] = [];
    state.dataset.previewList[tenant.tenant_id] = [];
    state.dataset.columnLength[tenant.tenant_id] = 0;
    state.dataset.maxColumn[tenant.tenant_id] = 0;
    state.dataset.minColumn[tenant.tenant_id] = 0;
    state.dataset.token[tenant.tenant_id] = '';
    state.dataset.previewDatasetID[tenant.tenant_id] = '';
    state.dataset.keyword[tenant.tenant_id] = '';
    state.dataset.isDatasetCacheNotFoundError[tenant.tenant_id] = false;
    state.dataset.selectedTenantId[tenant.tenant_id] = '';
    state.dataset.allChecked[tenant.tenant_id] = false;
    state.dataset.datasetListLoading[tenant.tenant_id] = false;
    state.dataset.datasetPreviewListLoading[tenant.tenant_id] = false;
  });
  state.dataset = Object.assign({}, state.dataset);
}

export function showDialogForDataset(state: any): void {
  state.dataset.shouldShowDialog = true;
}

export function hideDialogForDataset(state: any): void {
  state.dataset.shouldShowDialog = false;
}

export function setAllLabelsForDataset(state: any, payload: {tenantId: string, allLabels: string[]}): void {
  state.dataset.allLabels[payload.tenantId] = payload.allLabels;
  state.dataset = Object.assign({}, state.dataset);
}

export function setDatasetIdForLabel(state: any, payload: string): void {
  state.dataset.datasetIdForLabel = payload;
  state.dataset = Object.assign({}, state.dataset);
}

export function setDatasetLabels(state: any, payload: string[]): void {
  state.dataset.datasetLabels = payload;
  state.dataset = Object.assign({}, state.dataset);
}

export function setSelectOptionlabelsForDataset(state: any, payload: {tenantId: string, selectOptionLabels: string[]}): void {
  state.dataset.selectOptionLabels[payload.tenantId] = payload.selectOptionLabels;
  state.dataset = Object.assign({}, state.dataset);
}

export function setSelectedLabelForDataset(state: any, payload: {tenantId: string, selectedLabel: string}): void {
  state.dataset.selectedLabel[payload.tenantId] = payload.selectedLabel;
  state.dataset = Object.assign({}, state.dataset);
}

export function updateDatasetLabel(state: IState, payload: {tenantId: string, datasetId: string, labels: string[]}): void {
  const datasetList: IDatasetList[] = state.dataset.datasetList[payload.tenantId];
  const dataset: IDatasetList | undefined = datasetList.find((_dataset: IDatasetList) => _dataset.dataset_id === payload.datasetId);
  if (dataset) {
    dataset.labels = payload.labels;
  }
  state.dataset.datasetList[payload.tenantId] = datasetList;
  state.dataset = Object.assign({}, state.dataset);
}

export function updateDeleteFlagForDataset(state: IState, payload: {tenantId: string, datasetId: string}): void {
  const datasetList: IDatasetList[] = state.dataset.datasetList[payload.tenantId];
  const dataset: IDatasetList | undefined = datasetList.find((_dataset: IDatasetList) => _dataset.dataset_id === payload.datasetId);
  if (dataset) {
    dataset.deleted = true;
  }
  state.dataset.datasetList[payload.tenantId] = datasetList;
  state.dataset = Object.assign({}, state.dataset);
}

export function setUploadErrorMsg(state: any, uploadErrorMsg: string): void {
  state.dataset.uploadErrorMsg = uploadErrorMsg;
  state.dataset = Object.assign({}, state.dataset);
}

export function setFeatures(state: any, payload: {tenantId: string, features: IFeatures[]}): void {
  const convertedFeatures: IFeatures[] = [];
  payload.features.forEach((feat: IFeatures) => {
    if (feat.type === 'Array of image' || feat.type === 'Vector') {
      // vectorの場合shapeを表示しないため不要
      const count: number = feat.shape[0];
      const copiedFeat: IFeatures = JSON.parse(JSON.stringify(feat));
      copiedFeat.shape.shift();
      for (let i: number = 1; i <= count; i++) {
        convertedFeatures.push(copiedFeat);
      }
    } else {
      convertedFeatures.push(feat);
    }
  });
  state.dataset.features[payload.tenantId] = convertedFeatures;
  state.dataset = Object.assign({}, state.dataset);
}

export function showDatasetRenameInput(state: any, payload: {tenantId: string, datasetId: string}): void {
  const datasetList: any[] = [].concat(state.dataset.datasetList[payload.tenantId]);
  datasetList.forEach((dataset) => {
    if (dataset.dataset_id === payload.datasetId) {
      dataset.shouldShowInput = true;
    }
  });
  state.dataset.datasetList[payload.tenantId] = datasetList;
  state.dataset = Object.assign({}, state.dataset);
}

export function hideDatasetRenameInput(state: any, payload: {tenantId: string, datasetId: string}): void {
  const datasetList: any[] = [].concat(state.dataset.datasetList[payload.tenantId]);
  datasetList.forEach((dataset) => {
    if (dataset.dataset_id === payload.datasetId) {
      dataset.shouldShowInput = false;
    }
  });
  state.dataset.datasetList[payload.tenantId] = datasetList;
  state.dataset = Object.assign({}, state.dataset);
}

export function inputDatasetName(state: any, payload: {tenantId: string, datasetId: string, datasetName: string}): void {
  const datasetList: any[] = [].concat(state.dataset.datasetList[payload.tenantId]);
  datasetList.forEach((dataset) => {
    if (dataset.dataset_id === payload.datasetId) {
      dataset.inputValue = payload.datasetName;
    }
  });
  state.dataset.datasetList[payload.tenantId] = datasetList;
  state.dataset = Object.assign({}, state.dataset);
}

export function renameDataset(state: IState, payload: {tenantId: string, datasetId: string, datasetName: string}): void {
  const datasetList: IDatasetList[] = state.dataset.datasetList[payload.tenantId];
  const dataset: IDatasetList | undefined = datasetList.find((_dataset: IDatasetList) => _dataset.dataset_id === payload.datasetId);
  if (dataset) {
    dataset.dataset_name = payload.datasetName;
  }
  state.dataset.datasetList[payload.tenantId] = datasetList;
  state.dataset = Object.assign({}, state.dataset);
}

export function showUploadDialogForDataset(state: any): void {
  state.dataset.shouldShowUploadDialog = true;
}

export function hideUploadDialogForDataset(state: any): void {
  state.dataset.shouldShowUploadDialog = false;
}

export function updateDatasetProgress(state: IState, payload: {tenantId: string, datasetId: string, progress: number}) {
  const progressList: IProgress[] = state.dataset.progressList[payload.tenantId];
  const progressObj: IProgress | undefined = progressList.find((_progress: IProgress) => _progress.datasetId === payload.datasetId);
  if (progressObj) {
    progressObj.progress = payload.progress;
  } else {
    progressList.push({
      datasetId: payload.datasetId,
      progress: payload.progress
    });
  }
  state.dataset = Object.assign({}, state.dataset);
}
