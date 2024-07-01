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
import {ITenant} from '../../interfaces/core-response/ITenant';
import { IGetPlan } from '../../interfaces/core-response/IMisc';

/** ジョブの最大の表示数 */
const MAX_JOB_NUMBER: number = 500;

export function clearJobs(state: any, payload: string): void {
  state.jobHistory.total[payload] = 0;
  state.jobHistory.jobs[payload] = [];
}

/**
 * ジョブリストを追加します
 * @param state
 * @param payload
 */
export function addJobs(state: any, payload: {tenantId: string, jobs: IJobs}): void {

  if (!payload || !payload.jobs || !payload.jobs.metadata) {
    return;
  }

  const jobs: any[] = payload.jobs.jobs;

  state.jobHistory.total[payload.tenantId] = Math.min(payload.jobs.metadata.total, MAX_JOB_NUMBER);
  jobs.forEach((job: any) => {

    let epochCurrent: number = 0;
    let epochMax: number = 0;

    if (job.train_status && job.train_status.epoch) {
      epochCurrent = job.train_status.epoch.current;
      epochMax = job.train_status.epoch.max;
    }

    state.jobHistory.jobs[payload.tenantId].push({
      projectId: job.project_id,
      projectName: job.project_name,
      execUserId: job.exec_user_id,
      jobId: job.job_id,
      jobName: job.job_name,
      type: job.type,
      status: job.status,
      deleted: job.deleted,
      epochCurrent: epochCurrent,
      epochMax: epochMax,
      elapsedTime: job.elapsed_time,
      updateDatetime: job.update_datetime,
      elapsedTimeForEachInstance: job.elapsed_time_for_each_instance
    });
  });

  state.jobHistory = Object.assign({}, state.jobHistory);
}

export function setMiscPlans(state: any, payload: IGetPlan): void {

  if (!payload) {
    return;
  }

  state.jobHistory.plans.currencyRate = payload.currency_rate;
  state.jobHistory.plans.workspace.minimumGb = payload.workspace.minimum_gb;
  state.jobHistory.plans.workspace.maximumGb = payload.workspace.maximum_gb;
  state.jobHistory.plans.workspace.price = payload.workspace.price;

  payload.instances.forEach((instance: any) => {
    state.jobHistory.plans.instances.push({
      description: instance.description,
      instanceType: instance.instance_type,
      price: instance.price,
      deleted: instance.deleted
    });
  });
}

export function setSortType(state: any, payload: {tenantId: string, sortType: string}): void {
  state.jobHistory.sort[payload.tenantId] = payload.sortType;
  state.jobHistory = Object.assign({}, state.jobHistory);
}

export function showJobListLoading(state: any, payload: string): void {
  state.jobHistory.jobListLoading[payload] = true;
  state.jobHistory = Object.assign({}, state.jobHistory);
}

export function hideJobListLoading(state: any, payload: string): void {
  state.jobHistory.jobListLoading[payload] = false;
  state.jobHistory = Object.assign({}, state.jobHistory);
}

export function initJobHistory(state: any, payload: ITenant[]): void {
  payload.forEach((tenant: ITenant) => {
    state.jobHistory.total[tenant.tenant_id] = 0;
    state.jobHistory.jobs[tenant.tenant_id] = [];
    state.jobHistory.sort[tenant.tenant_id] = '-update_datetime';
    state.jobHistory.jobListLoading[tenant.tenant_id] = false;
  });
  state.jobHistory = Object.assign({}, state.jobHistory);
}
