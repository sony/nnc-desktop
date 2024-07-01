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

import {ITenantObj} from '../state/tenant';

import {IJobs} from '../../interfaces/core-response/IJobs';
import {ITenant} from '../../interfaces/core-response/ITenant';
import {ICoreProjects, ICoreSampleProject, ISampleProject} from '../../interfaces/core-response/IProject';
import { IState } from '../state';
import { IProjectList } from '../state/project';

/** プロジェクトの最大の表示数 */
const MAX_PROJECT_NUMBER: number = 500;

/** ジョブの最大の表示数 */
const MAX_JOB_NUMBER: number = 500;

/**
 * サンプルProjectを設定します。
 * @param state
 * @param payload
 */
export function setSampleProject(state: any, payload: ICoreSampleProject): void {
  const sampleProjectList: any[] = payload.projects.map((project: ISampleProject) => {
    return {
      project_id: project.project_id,
      tenant_id: project.tenant_id,
      owner_user_id: project.owner_user_id,
      project_name: project.project_name,
      deleted: project.deleted,
      create_datetime: project.create_datetime,
      update_datetime: project.update_datetime,
      isSample: true,
      copy_count: project.copy_count,
      star_count: project.star_count,
      starred: project.starred
    };
  });
  state.project.sampleProjectList = sampleProjectList;
  state.tenant.tenantList.forEach((tenant: ITenantObj) => {
    state.project.filteredSampleProjectList[tenant.tenantId] = sampleProjectList;
  });
  state.project = Object.assign({}, state.project);
}

/**
 * Projectを設定します。
 * @param {*} state
 * @param {IProjectParam} payload データ
 */
export function setProject(state: any, payload: {tenantId: string, projects: ICoreProjects}): void {
  const total: number = payload.projects.metadata.total;
  state.project.projectTotal[payload.tenantId] = total <= MAX_PROJECT_NUMBER ? total : MAX_PROJECT_NUMBER;
  state.project.projectList[payload.tenantId] = payload.projects.projects;
  state.project = Object.assign({}, state.project);
}

/**
 * Projectを追加します
 * @param {*} state
 * @param {IProjectParam} payload データ
 */
export function addProject(state: any, payload: {tenantId: string, projects: ICoreProjects}): void {
  const projectList: any = state.project.projectList[payload.tenantId];
  state.project.projectList[payload.tenantId] = projectList.concat(payload.projects.projects);
  state.project = Object.assign({}, state.project);
}

/**
 * 選択のフラグを設定します
 * @param {*} state
 * @param {IProjectParam} payload データ
 */
export function setChecked(state: any, payload: {tenantId: string, projectID: string, checked: boolean}): void {
  const projectList: any[] = [].concat(state.project.projectList[payload.tenantId]);
  projectList.forEach((project) => {
    if (project.project_id === payload.projectID) {
      project.checked = payload.checked;
    }
  });
  state.project.projectList[payload.tenantId] = projectList;
  state.project = Object.assign({}, state.project);
}

/**
 * 選択のフラグを設定します
 * @param {*} state
 * @param {IProjectParam} payload データ
 */
export function setStarChecked(state: any, payload: {projectId: string, checked: boolean}): void {
  const sampleProjectList: any[] = [].concat(state.project.sampleProjectList);
  sampleProjectList.forEach((project) => {
    if (project.project_id === payload.projectId) {
      project.starred = payload.checked;
    }
  });
  state.project.sampleProjectList = sampleProjectList;
  state.project = Object.assign({}, state.project);
}

/**
 * 現在の並び順を設定します
 * @param {*} state
 * @param {IProjectParam} payload データ
 */
export function setCurrentSort(state: any, payload: {tenantId: string, currentSort: string}): void {
  state.project.currentSort[payload.tenantId] = payload.currentSort;
  state.project = Object.assign({}, state.project);
}

/**
 * プロジェクトを全選択します
 * @param {*} state
 * @param {IProjectParam} payload データ
 */
export function selectProjectAll(state: any, payload: {tenantId: string, checked: boolean}): void {
  const projectList: any[] = [].concat(state.project.projectList[payload.tenantId]);
  projectList.forEach((project) => {
    project.checked = payload.checked;
  });
  state.project.projectList[payload.tenantId] = projectList;
  state.project.allChecked[payload.tenantId] = payload.checked;
  state.project = Object.assign({}, state.project);
}

export function clearProjectJobs(state: any, payload: string): void {
  state.project.jobTotal[payload] = 0;
  state.project.jobs[payload] = [];
  state.project = Object.assign({}, state.project);
}

/**
 * ProjectのJobを追加します。
 * @param {*} {commit, state} commit state
 * @param {IProjectJobParam} payload データ
 */
export function addProjectJobs(state: any, payload: {tenantId: string, jobs: IJobs}) {

  if (!payload.jobs || !payload.jobs.jobs || !payload.jobs.metadata) {
    return;
  }

  const jobs: any[] = payload.jobs.jobs;

  state.project.jobTotal[payload.tenantId] = Math.min(payload.jobs.metadata.total, MAX_JOB_NUMBER);
  jobs.forEach((job: any) => {

    let epochCurrent: number = 0;
    let epochMax: number = 0;

    if (job.train_status && job.train_status.epoch) {
      epochCurrent = job.train_status.epoch.current;
      epochMax = job.train_status.epoch.max;
    }

    state.project.jobs[payload.tenantId].push({
      projectId: job.project_id,
      projectName: job.project_name,
      jobId: job.job_id,
      jobName: job.job_name,
      type: job.type,
      status: job.status,
      epochCurrent: epochCurrent,
      epochMax: epochMax,
      elapsedTime: job.elapsed_time,
      storageUsed: job.storage_used
    });
  });
  state.project = Object.assign({}, state.project);
}

export function showProjectRenameInput(state: any, payload: {tenantId: string, projectId: string}): void {
  const projectList: any[] = [].concat(state.project.projectList[payload.tenantId]);
  projectList.forEach((project) => {
    if (project.project_id === payload.projectId) {
      project.shouldShowInput = true;
    }
  });
  state.project.projectList[payload.tenantId] = projectList;
  state.project = Object.assign({}, state.project);
}

export function hideProjectRenameInput(state: any, payload: {tenantId: string, projectId: string}): void {
  const projectList: any[] = [].concat(state.project.projectList[payload.tenantId]);
  projectList.forEach((project) => {
    if (project.project_id === payload.projectId) {
      project.shouldShowInput = false;
    }
  });
  state.project.projectList[payload.tenantId] = projectList;
  state.project = Object.assign({}, state.project);
}

export function inputProjectName(state: any, payload: {tenantId: string, projectID: string, projectName: string}): void {
  const projectList: any[] = [].concat(state.project.projectList[payload.tenantId]);
  projectList.forEach((project) => {
    if (project.project_id === payload.projectID) {
      project.inputValue = payload.projectName;
    }
  });
  state.project.projectList[payload.tenantId] = projectList;
  state.project = Object.assign({}, state.project);
}

export function renameProject(state: IState, payload: {tenantId: string, projectId: string, projectName: string}): void {
  const projectList: IProjectList[] = state.project.projectList[payload.tenantId];
  const project: IProjectList | undefined = projectList.find((_project: IProjectList) => _project.project_id === payload.projectId);
  if (project) {
    project.project_name = payload.projectName;
  }
  state.project.projectList[payload.tenantId] = projectList;
  state.project = Object.assign({}, state.project);
}

export function setMaxProjectListLength(state: any, payload: {tenantId: string, length: number}): void {
  state.project.maxProjectListLength[payload.tenantId] = payload.length;
  state.project = Object.assign({}, state.project);
}

export function setKeyword(state: any, payload: {tenantId: string, keyword: string}): void {
  state.project.keyword[payload.tenantId] = payload.keyword;
  state.project = Object.assign({}, state.project);
}

export function showDialog(state: any): void {
  state.project.shouldShowDialog = true;
}

export function hideDialog(state: any): void {
  state.project.shouldShowDialog = false;
}

export function setConfiguration(state: any, payload: {tenantId: string, configuration: {}}): void {
  state.project.configuration[payload.tenantId] = payload.configuration;
  state.project = Object.assign({}, state.project);
}

export function setNetworkIndex(state: any, payload: {tenantId: string, index: number}): void {
  state.project.networkIndex[payload.tenantId] = payload.index;
  state.project = Object.assign({}, state.project);
}

export function setCompletedConfiguration(state: any, payload: {tenantId: string, completedConfiguration: {}}): void {
  state.project.completedConfiguration[payload.tenantId] = payload.completedConfiguration;
  state.project = Object.assign({}, state.project);
}

export function setProjectRightWidth(state: any, payload: number): void {
  state.project.rightWidth = payload;
}

export function showProjectListLoading(state: any, payload: string): void {
  state.project.projectListLoading[payload] = true;
  state.project = Object.assign({}, state.project);
}

export function hideProjectListLoading(state: any, payload: string): void {
  state.project.projectListLoading[payload] = false;
  state.project = Object.assign({}, state.project);
}

export function showProjectJobListLoading(state: any, payload: string): void {
  state.project.projectJobListLoading[payload] = true;
  state.project = Object.assign({}, state.project);
}

export function hideProjectJobListLoading(state: any, payload: string): void {
  state.project.projectJobListLoading[payload] = false;
  state.project = Object.assign({}, state.project);
}

export function selectProjectId(state: any, payload: {tenantId: string, projectId: string}): void {
  state.project.selectedProjectId[payload.tenantId] = payload.projectId;
  state.project = Object.assign({}, state.project);
}

export function initProject(state: any, payload: ITenant[]): void {
  payload.forEach((tenant: ITenant) => {
    state.project.maxProjectListLength[tenant.tenant_id] = 10;
    state.project.projectTotal[tenant.tenant_id] = 0;
    state.project.projectList[tenant.tenant_id] = [];
    state.project.filteredSampleProjectList[tenant.tenant_id] = [];
    state.project.jobTotal[tenant.tenant_id] = 0;
    state.project.jobs[tenant.tenant_id] = [];
    state.project.keyword[tenant.tenant_id] = '';
    state.project.allChecked[tenant.tenant_id] = false;
    state.project.configuration[tenant.tenant_id] = {};
    state.project.networkIndex[tenant.tenant_id] = 0;
    state.project.completedConfiguration[tenant.tenant_id] = {};
    state.project.projectListLoading[tenant.tenant_id] = false;
    state.project.projectJobListLoading[tenant.tenant_id] = false;
    state.project.selectedProjectId[tenant.tenant_id] = '';
  });
  state.project = Object.assign({}, state.project);
}

export function setAllLabels(state: any, payload: {tenantId: string, allLabels: string[]}): void {
  state.project.allLabels[payload.tenantId] = payload.allLabels;
  state.project = Object.assign({}, state.project);
}

export function setProjectLabels(state: any, payload: string[]): void {
  state.project.projectLabels = payload;
  state.project = Object.assign({}, state.project);
}

export function setProjectIdForLabel(state: any, payload: string): void {
  state.project.projectIdForLabel = payload;
  state.project = Object.assign({}, state.project);
}

export function setSelectedLabel(state: any, payload: {tenantId: string, selectedLabel: string}): void {
  state.project.selectedLabel[payload.tenantId] = payload.selectedLabel;
  state.project = Object.assign({}, state.project);
}

export function setSelectOptionlabels(state: any, payload: {tenantId: string, selectOptionLabels: string[]}): void {
  state.project.selectOptionLabels[payload.tenantId] = payload.selectOptionLabels;
  state.project = Object.assign({}, state.project);
}

export function updateProjectLabel(state: IState, payload: {tenantId: string, projectId: string, labels: string[]}): void {
  const projectList: IProjectList[] = state.project.projectList[payload.tenantId];
  const project: IProjectList | undefined = projectList.find((_project: IProjectList) => _project.project_id === payload.projectId);
  if (project) {
    project.labels = payload.labels;
  }
  state.project.projectList[payload.tenantId] = projectList;
  state.project = Object.assign({}, state.project);
}

export function updateDeleteFlagForProject(state: IState, payload: {tenantId: string, projectId: string}): void {
  const projectList: IProjectList[] = state.project.projectList[payload.tenantId];
  const project: IProjectList | undefined = projectList.find((_project: IProjectList) => _project.project_id === payload.projectId);
  if (project) {
    project.deleted = true;
  }
  state.project.projectList[payload.tenantId] = projectList;
  state.project = Object.assign({}, state.project);
}

export function setPlusStarCount(state: any, projectId: string): void {
  state.project.sampleProjectList.forEach((sampleProj: ISampleProject) => {
    if (sampleProj.project_id === projectId) {
      sampleProj.star_count += 1;
    }
  });
  state.project = Object.assign({}, state.project);
}

export function setMinusStarCount(state: any, projectId: string): void {
  state.project.sampleProjectList.forEach((sampleProj: ISampleProject) => {
    if (sampleProj.project_id === projectId) {
      sampleProj.star_count -= 1;
    }
  });
  state.project = Object.assign({}, state.project);
}

export function setClickStarFlag(state: any, clickStarFlag: boolean): void {
  state.project.clickStarFlag = clickStarFlag;
  state.project = Object.assign({}, state.project);
}

export function showUploadDialog(state: any): void {
  state.project.shouldShowUploadDialog = true;
}

export function hideUploadDialog(state: any): void {
  state.project.shouldShowUploadDialog = false;
}
