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
import pipeline, { IWorkflow, IPipeline, IDetailJob, IWorkflowJob, IScript, IInstance } from '../state/pipeline';
import {ITenant} from '../../interfaces/core-response/ITenant';

export function initPipeline(state: IState, payload: ITenant[]): void {
  payload.forEach((tenant: ITenant) => {
    state.pipeline.workflowList[tenant.tenant_id] = [];
    state.pipeline.pipelineList[tenant.tenant_id] = [];
    state.pipeline.workflowJobList[tenant.tenant_id] = [];
    state.pipeline.detailWorkflowJob[tenant.tenant_id] = {} as IDetailJob;
    state.pipeline.selectedWorkflowId[tenant.tenant_id] = '';
    state.pipeline.selectedWorkflowJobId[tenant.tenant_id] = '';
    state.pipeline.isLoading[tenant.tenant_id] = false;
    state.pipeline.isLoadingRightPane[tenant.tenant_id] = false;
    state.pipeline.trainAvailableInstance[tenant.tenant_id] = [];
    state.pipeline.evaluateAvailableInstance[tenant.tenant_id] = [];
  });
  state.pipeline = Object.assign({}, state.pipeline);
}

export function setAvailableInstance(state: IState, payload: {tenantId: string, train: IInstance[], evaluate: IInstance[]}): void {
  state.pipeline.trainAvailableInstance[payload.tenantId] = payload.train;
  state.pipeline.evaluateAvailableInstance[payload.tenantId] = payload.evaluate;
  state.pipeline = Object.assign({}, state.pipeline);
}

export function setWorkflowList(state: IState, payload: {tenantId: string, workflowList: IWorkflow[]}): void {
  state.pipeline.workflowList[payload.tenantId] = payload.workflowList;
  state.pipeline = Object.assign({}, state.pipeline);
}

export function setPipelineList(state: IState, payload: {tenantId: string, pipelineList: IPipeline[]}): void {
  state.pipeline.pipelineList[payload.tenantId] = payload.pipelineList;
  state.pipeline = Object.assign({}, state.pipeline);
}

export function updateWorkflow(state: IState, payload: {tenantId: string, workflow: IWorkflow}): void {
  state.pipeline.workflowList[payload.tenantId] = state.pipeline.workflowList[payload.tenantId].map((_workflow: IWorkflow) => {
    if (_workflow.id === payload.workflow.id) {
      return payload.workflow;
    } else {
      return _workflow;
    }
  });
  state.pipeline = Object.assign({}, state.pipeline);
}

export function updatePipeline(state: IState, payload: {tenantId: string, pipeline: IPipeline}): void {
  state.pipeline.pipelineList[payload.tenantId] = state.pipeline.pipelineList[payload.tenantId].map((_pipeline: IPipeline) => {
    if (_pipeline.id === payload.pipeline.id) {
      return payload.pipeline;
    } else {
      return _pipeline;
    }
  });
  state.pipeline = Object.assign({}, state.pipeline);
}

export function setWorkflowJobs(state: IState, payload: {tenantId: string, workflowJobList: IWorkflowJob[]}): void {
  state.pipeline.workflowJobList[payload.tenantId] = payload.workflowJobList;
  state.pipeline = Object.assign({}, state.pipeline);
}

export function setWorkflowJob(state: IState, payload: {tenantId: string, workflowJobList: IWorkflowJob[]}): void {
  state.pipeline.workflowJobList[payload.tenantId] = payload.workflowJobList;
  state.pipeline = Object.assign({}, state.pipeline);
}

export function setDetailWorkflowJob(state: IState, payload: {tenantId: string, detailWorkflowJob: IDetailJob}): void {
  state.pipeline.detailWorkflowJob[payload.tenantId] = payload.detailWorkflowJob;
  state.pipeline = Object.assign({}, state.pipeline);
}

export function setCheckedForPipeline(state: IState, payload: {id: string, checked: boolean, tenantId: string}): void {
  const workflowList: IWorkflow[] = state.pipeline.workflowList[payload.tenantId];
  const workflow: IWorkflow | undefined = state.pipeline.workflowList[payload.tenantId].find((_workflow: IWorkflow) => {
    return _workflow.id === payload.id;
  });
  if (workflow) {
    workflow.checked = payload.checked;
  }
  state.pipeline.workflowList[payload.tenantId] = workflowList;
  state.pipeline = Object.assign({}, state.pipeline);
}

export function inputWorkflowName(state: IState, payload: {tenantId: string, id: string, name: string}): void {
  state.pipeline.workflowList[payload.tenantId] = state.pipeline.workflowList[payload.tenantId].map((_workflow: IWorkflow) => {
    if (_workflow.id === payload.id) {
      return {
        ..._workflow,
        inputValue: payload.name
      };
    } else {
      return _workflow;
    }
  });
  state.pipeline = Object.assign({}, state.pipeline);
}

export function setAllCheckedForPipeline(state: IState, payload: {checked: boolean, tenantId: string}): void {
  state.pipeline.workflowList[payload.tenantId] = state.pipeline.workflowList[payload.tenantId].map((_workflow: IWorkflow) => {
    return {
      ..._workflow,
      checked: payload.checked
    };
  });
  state.pipeline = Object.assign({}, state.pipeline);
}

export function setScripts(state: IState, payload: IScript[]): void {
  state.pipeline.scripts = payload;
}

export function selectWorkflow(state: IState, payload: {tenantId: string, workflowId: string}): void {
  state.pipeline.selectedWorkflowId[payload.tenantId] = payload.workflowId;
  state.pipeline = Object.assign({}, state.pipeline);
}

export function selectWorkflowJobId(state: IState, payload: {tenantId: string, workflowJobId: string}): void {
  state.pipeline.selectedWorkflowJobId[payload.tenantId] = payload.workflowJobId;
  state.pipeline = Object.assign({}, state.pipeline);
}

export function showPipelineListLoading(state: IState, payload: string): void {
  state.pipeline.isLoading[payload] = true;
  state.pipeline = Object.assign({}, state.pipeline);
}

export function hidePipelineListLoading(state: IState, payload: string): void {
  state.pipeline.isLoading[payload] = false;
  state.pipeline = Object.assign({}, state.pipeline);
}

export function showPipelineRightPaneLoading(state: IState, payload: string): void {
  state.pipeline.isLoadingRightPane[payload] = true;
  state.pipeline = Object.assign({}, state.pipeline);
}

export function hidePipelineRightPaneLoading(state: IState, payload: string): void {
  state.pipeline.isLoadingRightPane[payload] = false;
  state.pipeline = Object.assign({}, state.pipeline);
}
