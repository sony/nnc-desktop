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

export interface IProject {
  maxProjectListLength: {[key: string]: number};
  projectTotal: {[key: string]: number};
  projectList: {[key: string]: IProjectList[]};
  sampleProjectList: IProjectList[];
  filteredSampleProjectList: {[key: string]: ISampleProjectList[]};
  jobTotal: {[key: string]: number};
  jobs: {[key: string]: IJobInfo[]};
  keyword: {[key: string]: string};
  allChecked: {[key: string]: boolean};
  shouldShowDialog: boolean;
  configuration: {[key: string]: IConfiguration};
  networkIndex: {[key: string]: number};
  completedConfiguration: {[key: string]: ICompletedConfiguration};
  rightWidth: number;
  allLabels: {[key: string]: string[]};
  projectIdForLabel: string;
  selectedLabel: {[key: string]: string};
  selectOptionLabels: {[key: string]: string[]};
  projectLabels: string[];
  currentSort: {[key: string]: string};
  clickStarFlag: boolean;
  shouldShowUploadDialog: boolean;
  projectListLoading: {[key: string]: boolean};
  projectJobListLoading: {[key: string]: boolean};
  selectedProjectId: {[key: string]: string};
}

export interface IProjectList {
  isSample?: boolean;
  project_id: string;
  tenant_id: string;
  owner_user_id: string;
  project_name: string;
  deleted?: boolean;
  create_datetime: string;
  update_datetime: string;
  checked?: boolean;
  shouldShowInput?: boolean;
  inputValue?: string;
  status?: string;
  progress?: number;
  last_modified_user_id: string;
  import_status: string;
  import_sdcproj_status: string;
  readonly: boolean;
  labels: string[];
  storage_used: string;
}

export type ISampleProjectList = IProjectList & {
  copy_count: number;
  star_count: number;
};

interface IJobInfo {
  projectId: string;
  projectName: string;
  jobId: string;
  jobName: string;
  type: string;
  status: string;
  epochCurrent: number;
  epochMax: number;
  elapsedTime: number;
  storageUsed: string;
}

export interface ILabel {
  labelName: string;
  checked: boolean;
}

export interface IAllLabel {
  tenantId: string[];
}

const project: IProject = {
  maxProjectListLength: {},
  projectTotal: {},
  projectList: {},
  sampleProjectList: [],
  filteredSampleProjectList: {},
  jobTotal: {},
  jobs: {},
  keyword: {},
  allChecked: {},
  shouldShowDialog: false,
  configuration: {},
  networkIndex: {},
  completedConfiguration: {},
  rightWidth: 280,
  allLabels: {},
  projectIdForLabel: '',
  selectedLabel: {},
  selectOptionLabels: {},
  projectLabels: [],
  currentSort: {},
  clickStarFlag: false,
  shouldShowUploadDialog: false,
  projectListLoading: {},
  projectJobListLoading: {},
  selectedProjectId: {}
};

/** Projectで使用するStateの定義 */
export default project;
