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

import {IJobs} from '../../interfaces/core-response/IJobs';
import { ISupport } from '../state/dashboard';
import { IState } from '../state';

interface IProjectParam {
  metadata: {
    offset: number;
    limit: number;
    sort_by: string;
    total: number;
  };
  projects: {
    isSample?: boolean;
    project_id: string;
    tenant_id: string;
    owner_user_id: string;
    project_name: string;
    deleted: boolean;
    create_datetime: string;
    update_datetime: string;
  }[];
}

export interface IUserWorkspaceParam {
  job_workspace_used: number;
  dataset_workspace_used: number;
  workspace_quota: number;
}

export interface IUserResourceParam {
  process_resource: number;
  max_process_resource: number;
}

export interface IMiscInfoParam {
  text: string;
}

export function setProjectForDashboard(state: any, payload: IProjectParam): void {
  state.dashboard.projectTotal = payload.metadata.total;
  state.dashboard.projectList = payload.projects;
}

export function setJobs(state: any, payload: IJobs): void {
  state.dashboard.jobs = [];

  const jobs: any[] = payload.jobs;
  if (!jobs) {
    return;
  }

  state.dashboard.total = payload.metadata.total;

  jobs.forEach((job: any) => {

    let epochCurrent: number = 0;
    let epochMax: number = 0;

    if (job.train_status && job.train_status.epoch) {
      epochCurrent = job.train_status.epoch.current;
      epochMax = job.train_status.epoch.max;
    }

    state.dashboard.jobs.push({
      projectId: job.project_id,
      projectName: job.project_name,
      jobId: job.job_id,
      jobName: job.job_name,
      type: job.type,
      status: job.status,
      deleted: job.deleted,
      epochCurrent: epochCurrent,
      epochMax: epochMax,
      elapsedTime: job.elapsed_time,
      updateDatetime: job.update_datetime
    });
  });
}

export function setInfoContent(state: IState, payload: string): void {
  state.dashboard.infoContent = payload;
}

export function setSupportContents(state: IState, payload: {contents: ISupport[], index: number}): void {
  state.dashboard.supportContents = payload.contents;
  state.dashboard.supportContentsIndex = payload.index;
  state.dashboard.isInitSupportContents = true;
}

export function setSupportContentsIndex(state: IState, payload: number): void {
  state.dashboard.supportContentsIndex = payload;
}
