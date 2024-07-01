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

export interface IDataSource {
  name: string;
  trigger: boolean;
}

export interface IWorkflow {
  id: string;
  name: string;
  pipelineIds: string[];
  dataSources: IDataSource[];
  updateDatetime: string;
  checked?: boolean;
  inputValue?: string;
  isSendMail: boolean;
}

export interface IPipeline {
  id: string;
  name: string;
  projectId: string;
  trainInstance: number;
  evaluateInstance: number;
  preProcessScriptId: string;
  postProcessScriptId: string;
  resultFiles: string[];
}

export type JobStatus = 'waiting' | 'copying_data_sources' | 'running' | 'copying_result' | 'notification' | 'suspending' | 'suspended' | 'finished' | 'failed';

export interface IWorkflowJob {
  workflowId: string;
  jobId: string;
  jobName: string;
  status: JobStatus;
  startAt: number;
  endAt: number;
}

interface ITask {
  name: string;
  status: string;
  startAt: number;
  endAt: number;
}

export interface IDetailJob {
  jobId: string;
  pipelineId: string;
  executionId: string;
  lastTask: string;
  status: string;
  tasks: ITask[];
  startAt: number;
  endAt: number;
  errorDetails?: {
    cause: string;
    message: string;
  };
}

export type ScriptStatus = 'ready' | 'processing' | 'failed' | 'completed' | 'updating' | 'rollback_completed';

export interface IScript {
  fileName: string;
  scriptId: string;
  status: ScriptStatus;
  updateDatetime: string;
}

export interface IInstance {
  available: boolean;
  description: {
    'ja-JP': string;
    'en-US': string;
  };
  instanceType: number;
  price: number;
  priority: number;
  provider: 'aws' | 'abci';
}

export interface IPipelineStore {
  workflowList: {[key: string]: IWorkflow[]};
  pipelineList: {[key: string]: IPipeline[]};
  workflowJobList: {[key: string]: IWorkflowJob[]};
  detailWorkflowJob: {[key: string]: IDetailJob};
  scripts: IScript[];
  selectedWorkflowId: {[key: string]: string};
  selectedWorkflowJobId: {[key: string]: string};
  isLoading: {[key: string]: boolean};
  isLoadingRightPane: {[key: string]: boolean};
  trainAvailableInstance: {[key: string]: IInstance[]};
  evaluateAvailableInstance: {[key: string]: IInstance[]};
}

const pipeline: IPipelineStore = {
  workflowList: {},
  pipelineList: {},
  workflowJobList: {},
  detailWorkflowJob: {},
  scripts: [],
  selectedWorkflowId: {},
  selectedWorkflowJobId: {},
  isLoading: {},
  isLoadingRightPane: {},
  trainAvailableInstance: {},
  evaluateAvailableInstance: {}
};

export default pipeline;
