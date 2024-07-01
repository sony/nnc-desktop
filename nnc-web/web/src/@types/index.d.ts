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

declare function onUnAuthorized(account?: number): void;
declare function exportProject(configuration: {}, is_create_job: boolean, is_exclude_file_path?: boolean): string;
declare function importProject(project_content: string, parseDatasetUri?: boolean): any;
declare namespace nnc {
  let emptyConfiguration: {};
  let parseIni: (sdcproj: string) => {};
}
declare namespace ACCOUNT {
  const SONY: number;
  const GOOGLE: number;
}
declare namespace nNablaCore {
  let layers: {
    components: any[];
  };
}
declare namespace SpsvApi {
  let spsvCardInfoScreen: () => void;
}

declare interface ILayer {
  name: string;
  properties: {[key: string]: any};
  type: string;
  x: number;
  y: number;
}

declare interface ILink {
  from_name: string | null;
  from_node: string;
  to_name: string | null;
  to_node: string;
}

declare interface INetwork {
  links: ILink[];
  name: string;
  nodes: ILayer[];
}

declare interface IConfiguration {
  batch: number;
  datasets: any[];
  description: string;
  epoch: number;
  executors: any[];
  main_dataset_name: string;
  monitor_interval: number;
  monitors: any[];
  networks: INetwork[];
  optimizers: any[];
  precision: string;
  save_best: boolean;
  structure_search: any;
}

declare interface IStatistic {
  name: string;
  max: string;
  sum: string;
}

declare interface ICompletedConfiguration {
  networks: INetwork[];
  statistics: IStatistic[][];
}

declare interface IInputSideConnector {
  color: string;
  kind: string;
  enable: boolean;
  shape: string;
  name: string;
}

declare interface IProperty {
  name: string;
  argumentName: string;
  required: boolean;
  editable: boolean;
  value: string;
  shortName: string;
  type: string;
}

declare interface IComponent {
  outputSideConnector: any[];
  parameterScope: string | null;
  inputSideConnector: IInputSideConnector[];
  name: string;
  output: number;
  color: string;
  input: number;
  property: IProperty[];
  layout: string | null;
}

declare module 'vue2-timepicker' {}
