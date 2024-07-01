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

export interface IClassifier {
  classifier_id: string;
  status: 'submitted' | 'building' | 'running' | 'stopping' | 'stopped' | 'provisioning' | 'failed' | 'terminating' | 'terminated' | 'retrying';
  api_key: string;
  version: string;
  project_id: string;
  job_id: string;
  project_name: string;
  job_name: string;
  url: string;
  public: boolean;
  server_spec: {
    type: 'serverless' | 'cpu' | 'gpu';
    number_of_instances: number;
    schedule: boolean;
    schedule_rule: IScheduleRule;
  };
  create_datetime: string;
  update_datetime: string;
  checked?: boolean;
}

export interface IGetClassifiers {
  metadata: {
    limit: number;
    next_page_token: string;
  };
  classifiers: IClassifier[];
  pagination: {
    next_page_token: string;
  };
}

export interface IGetMetrics {
  metadata: IMetricsMetaData;
  metrics: IMetrics[];
}

export interface IMetrics {
  name: string;
  metric_data: IMetricsData[];
}

export interface IMetricsMetaData {
  name?: string;
  start_time: number;
  end_time: number;
  period: number;
}

export interface IMetricsData {
  timestamp: number;
  count: number;
}

export interface IScheduleRule {
  start_on: string;
  end_on: string;
  day_of_week: string;
}

export interface IServerSpec {
  type: string;
  number_of_instances?: number;
  schedule?: boolean;
  schedule_rule?: IScheduleRule;
}
