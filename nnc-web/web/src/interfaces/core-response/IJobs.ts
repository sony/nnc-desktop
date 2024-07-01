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

export interface IJobs {
  metadata: {
    keyword: string;
    offset: number;
    limit: number;
    sort_by: string;
    total: number;
  };
  jobs: {
    job_id: string;
    owner_user_id: string;
    project_id: string;
    project_name: string;
    job_name: string;
    status: string;
    type: string;
    start_time: string;
    end_time: string;
    elapsed_time: number;
    train_status: {
      best: {
        epoch: number;
        valid_error: number;
      },
      epoch: {
        current: number;
        max: number;
      },
      monitoring_report: {
      },
      status: string;
      time: {
        elapsed: number;
        prediction: number;
      },
      type: string;
      update_timestamp: number;
      storage_used: number;
    },
    deleted: boolean;
    update_datetime: string;
    create_datetime: string;
    storage_used: number;
  }[];
}

export interface IJob {
  job_id: string;
  owner_user_id: string;
  project_id: string;
  project_name: string;
  job_name: string;
  status: string;
  type: string;
  start_time: string;
  end_time: string;
  elapsed_time: number;
  train_status: {
    best: {
      epoch: number;
      valid_error: number;
    },
    epoch: {
      current: number;
      max: number;
    },
    monitoring_report: {
    },
    status: string;
    time: {
      elapsed: number;
      prediction: number;
    },
    type: string;
    update_timestamp: number;
    storage_used: number;
  };
  deleted: boolean;
  update_datetime: string;
  create_datetime: string;
  storage_used: number;
}
