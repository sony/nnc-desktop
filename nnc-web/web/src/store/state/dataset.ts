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


export interface IDataset {
  datasetTotal: {[key: string]: number};
  datasetList: {[key: string]: IDatasetList[]};
  progressList: {[key: string]: IProgress[]};
  sampleDatasetList: IDatasetList[];
  selectedDatasetID: {[key: string]: string};
  previewOffset: {[key: string]: number};
  previewTotal: {[key: string]: number};
  previewPage: {[key: string]: number};
  previewHeader: {[key: string]: string[]};
  previewList: {[key: string]: {type: string, data: string}[][]};
  columnLength: {[key: string]: number};
  maxColumn: {[key: string]: number};
  minColumn: {[key: string]: number};
  token: {[key: string]: string};
  previewDatasetID: {[key: string]: string};
  keyword: {[key: string]: string};
  isDatasetCacheNotFoundError: {[key: string]: boolean};
  shouldShowCopyArea: boolean;
  selectedTenantId: {[key: string]: string};
  allChecked: {[key: string]: boolean};
  datasetIdForLabel: string;
  datasetLabels: string[];
  shouldShowDialog: boolean;
  allLabels: {[key: string]: string[]};
  selectOptionLabels: {[key: string]: string[]};
  selectedLabel: {[key: string]: string};
  uploadErrorMsg: string;
  features: {[key: string]: IFeatures[]};
  datasetListLoading: {[key: string]: boolean};
  datasetPreviewListLoading: {[key: string]: boolean};
  shouldShowUploadDialog: boolean;
}

export interface IDatasetList {
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
  checked?: boolean;
  labels: string[];
  features: IFeatures[];
  shouldShowInput?: boolean;
  inputValue?: string;
  deleted?: boolean;
}

export interface IProgress {
  datasetId: string;
  progress: number;
}

export interface IAllLabel {
  tenantId: string[];
}

export interface IFeatures {
  shape?: number[];
  type: string;
  variable: string;
}

const dataset: IDataset = {
  datasetTotal: {},
  datasetList: {},
  progressList: {},
  sampleDatasetList: [],
  selectedDatasetID: {},
  previewOffset: {},
  previewTotal: {},
  previewPage: {},
  previewHeader: {},
  previewList: {},
  columnLength: {},
  maxColumn: {},
  minColumn: {},
  token: {},
  previewDatasetID: {},
  keyword: {},
  isDatasetCacheNotFoundError: {},
  shouldShowCopyArea: false,
  selectedTenantId: {},
  allChecked: {},
  datasetIdForLabel: '',
  datasetLabels: [],
  shouldShowDialog: false,
  allLabels: {},
  selectOptionLabels: {},
  selectedLabel: {},
  uploadErrorMsg: '',
  features: {},
  datasetListLoading: {},
  datasetPreviewListLoading: {},
  shouldShowUploadDialog: false
};

/** Projectで使用するStateの定義 */
export default dataset;
