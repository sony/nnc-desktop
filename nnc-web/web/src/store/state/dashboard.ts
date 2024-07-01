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

export interface IDashboard {
  workspaceInfo: IUserWorkSpaceInfo;
  resourceInfo: IUserResourceInfo;
  total: number;
  jobs: IJobInfo[];
  projectTotal: number;
  projectList: IProjectList[];
  infoContent: string;
  supportContents: ISupport[];
  supportContentsIndex: number;
  isInitSupportContents: boolean;
}

export interface ISupport {
  contentType: string;
  text: string;
}

interface IProjectList {
  isSample?: boolean;
  project_id?: string;
  tenant_id?: string;
  owner_user_id?: string;
  project_name?: string;
  deleted?: boolean;
  create_datetime?: string;
  update_datetime?: string;
  checked?: boolean;
  shouldShowInput?: boolean;
  inputValue?: string;
}

interface IUserWorkSpaceInfo {
  datasetWorkspaceUsed: number;
  jobWorkspaceUsed: number;
  workspaceQuota: number;
}

interface IUserResourceInfo {
  processResource: number;
  maxProcessResource: number;
}

interface IJobInfo {
  projectId: string;
  projectName: string;
  jobId: string;
  jobName: string;
  type: string;
  status: string;
  deleted: boolean;
  epochCurrent: number;
  epochMax: number;
  elapsedTime: number;
  updateDatetime: string;
}

const dashboard: IDashboard = {
  workspaceInfo: {
    datasetWorkspaceUsed: 0,
    jobWorkspaceUsed: 0,
    workspaceQuota: 0
  },
  resourceInfo: {
    processResource: 0,
    maxProcessResource: 0
  },
  total: 0,
  jobs: [],
  projectTotal: 0,
  projectList: [],
  infoContent: '',
  supportContents: [],
  supportContentsIndex: 0,
  isInitSupportContents: false
};

/** Dashboardで使用するStateの定義 */
export default dashboard;
