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

import common, { ICommon } from './common';
import session, { ISession } from './session';
import dashboard, { IDashboard } from './dashboard';
import project, { IProject } from './project';
import computeResourceGroup, {IComputeResourceGroup} from './computeResource';
import pipeline, { IPipelineStore } from './pipeline';
import dataset, { IDataset } from './dataset';
import jobHistory, { IJobHistory } from './jobHistory';
import deactivate, { IDeactivate } from './deactivate';
import serviceSettings, { IServiceSettings } from './serviceSettings';
import tenant, { ITenant } from './tenant';

/** Stateの定義 */
export default {
  common,
  session,
  dashboard,
  project,
  pipeline,
  dataset,
  computeResourceGroup,
  jobHistory,
  deactivate,
  serviceSettings,
  tenant
};

export interface IState {
  common: ICommon;
  session: ISession;
  dashboard: IDashboard;
  project: IProject;
  pipeline: IPipelineStore;
  dataset: IDataset;
  computeResourceGroup: IComputeResourceGroup;
  jobHistory: IJobHistory;
  deactivate: IDeactivate;
  serviceSettings: IServiceSettings;
  tenant: ITenant;
}
