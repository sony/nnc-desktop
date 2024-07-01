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

export interface IJobHistory {
  total: {[key: string]: number};
  jobs: {[key: string]: IJobInfo[]};
  sort: {[key: string]: string};
  plans: IPlans;
  jobListLoading: {[key: string]: boolean};
}

interface IElapsedTimeForEachInstance {
  instance_type: number;
  elapsed_time: number;
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
  elapsedTimeForEachInstance: IElapsedTimeForEachInstance[];
}

interface IPlans {
  currencyRate: {};
  workspace: {
    minimumGb: number;
    maximumGb: number;
    price: number;
  };
  instances: IInstance[];
}

export interface IInstance {
  description: {};
  instanceType: number;
  price: number;
  deleted: boolean;
}

const jobHistory: IJobHistory = {
  total: {},
  jobs: {},
  sort: {},
  plans: {
    currencyRate: {},
    workspace: {
      minimumGb: 0,
      maximumGb: 0,
      price: 0
    },
    instances: []
  },
  jobListLoading: {}
};

/** JobHistoryで使用するStateの定義 */
export default jobHistory;
