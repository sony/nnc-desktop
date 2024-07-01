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

interface IDataSource {
  name: string;
  trigger?: boolean;
}

interface IWorkflow {
  workflow_id: string;
  name: string;
  pipeline_ids: string[];
  data_sources: IDataSource[];
  email_notification: boolean;
  create_at: string;
  update_at: string;
}

export interface IWorkflows {
  pagination?: {
    next_page_token: string;
  };
  workflows: IWorkflow[];
}

interface IConfiguration {
  environment: {
    USER_ID: string;
    PROJECT_ID: string;
  };
}

interface IPipeline {
  pipeline_id: string;
  pipeline_name: string;
  project_id: string;
  train_instance_type: number;
  evaluate_instance_type: number;
  pre_process_script_id: string;
  post_process_script_id: string;
  result_files: string[];
  // configuration: IConfiguration;
}

export interface IPipelines {
  pipelines: IPipeline[];
  pagination: {
    next_page_token?: string;
  };
}

type JobStatus = 'waiting' | 'copying_data_sources' | 'running' | 'copying_result' | 'notification' | 'suspending' | 'suspended' | 'finished' | 'failed';

interface IJob {
  workflow_id: string;
  job_id: string;
  job_name: string;
  status: JobStatus;
  start_at: number;
  end_at: number;
}

export interface IWorkflowJobs {
  jobs: IJob[];
  pagination: {
    next_page_token?: string;
  };
}

interface ITask {
  task_name: string;
  status: string;
  start_at: number;
  end_at?: number;
  create_at: string;
  update_at: string;
}

export interface IDetailJob {
  job_id: string;
  pipeline_id: string;
  execution_id: string;
  last_task?: string;
  status: string;
  tasks: ITask[];
  start_at: number;
  end_at?: number;
  create_at: string;
  update_at: string;
}

export interface IWorkflowJob {
  executions: IDetailJob[];
  error?: {
    cause: string;
    message: string;
  };
}

type ScriptStatus = 'ready' | 'processing' | 'failed' | 'completed' | 'updating' | 'rollback_completed';

export interface IScript {
  file_name: string;
  script_id: string;
  owner_user_id: string;
  status: ScriptStatus;
  create_at: string;
  update_at: string;
}

export interface IGetScripts {
  scripts: IScript[];
  pagination?: {
    next_page_token: string;
  };
}

export interface IUpdatePipelineRequest {
  pipeline_name: string;
  project_id: string;
  train_instance_type: number;
  evaluate_instance_type: number;
  pre_process_script_id?: string;
  post_process_script_id?: string;
  result_files: string[];
}

export interface IUpdateWorkflowRequest {
  name: string;
  pipeline_ids: string[];
  data_sources: IDataSource[];
  email_notification: boolean;
}

export interface IGetUrlToUploadScriptRequest {
  file_name?: string;
  script_id?: string;
}

export interface IGetUrlToUploadScriptResponse {
  script_id: string;
  file_name: string;
  upload_url: string;
  access_key_id: string;
  secret_access_key: string;
  session_token: string;
}

export interface IDownloadScript {
  file_name: string;
  download_url: string;
}

export interface IGenerateUrlToUploadDataSourceRequest {
  data_sources: {
    name: string;
    upload_filename: string;
  }[];
}

export interface IUploadDataSource {
  name: string;
  upload_url: string;
  upload_filename: string;
  access_key_id: string;
  secret_access_key: string;
  session_token: string;
}

export interface IGenerateUrlToUploadDataSourceResponse {
  data_sources: IUploadDataSource[];
}

export interface IDownloadFile {
  name: string;
  download_url: string;
  error: string;
}

export interface IDownloadResults {
  pipeline_id: string;
  execution_id: string;
  files: IDownloadFile[];
}
