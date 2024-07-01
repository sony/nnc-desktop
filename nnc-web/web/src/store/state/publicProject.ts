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

interface IFilterValue {
  value: string;
  type: string;
}

export interface IPublicProject {
  projectTotal: number;
  projectList: IPublicProjectList[];
  allChecked: boolean;
  selectedProjectId: string;
  shouldShowAdvancedOptions: boolean;
  onlyMyProject: boolean;
  filters: {
    tags: IFilterValue,
    description: IFilterValue,
    copy_count: IFilterValue,
    dataset_number: IFilterValue,
    dataset_shape: IFilterValue,
    output_accuracy: IFilterValue,
    network_statistics_cost_parameter: IFilterValue,
    network_statistics_cost_add: IFilterValue,
    network_statistics_cost_multiply: IFilterValue,
    network_statistics_cost_multiply_add: IFilterValue
  };
  currentFilters: string;
  currentSort: string;
  clickStarFlag: boolean;
}

export interface IPublicProjectList {
  project_id: string;
  tenant_id: string;
  owner_user_id: string;
  project_name: string;
  deleted: boolean;
  create_datetime: string;
  update_datetime: string;
  checked: boolean;
  status: string;
  progress: number;
  copy_status: string;
  copy_progress: number;
  last_modified_user_id: string;
  readonly: boolean;
  summary_uri: string;
  import_status: string;
  import_sdcproj_status: string;
  labels: string[];
  copy_count: number;
  star_count: number;
  starred: boolean;
  storage_used: number;
}

const publicProject: IPublicProject = {
  projectTotal: 0,
  projectList: [],
  allChecked: false,
  selectedProjectId: '',
  shouldShowAdvancedOptions: false,
  onlyMyProject: true,
  filters: {
    tags: {
      value: '',
      type: 'contains'
    },
    description: {
      value: '',
      type: 'contains'
    },
    copy_count: {
      value: '',
      type: 'ge'
    },
    dataset_number: {
      value: '',
      type: 'ge'
    },
    dataset_shape: {
      value: '',
      type: 'contains'
    },
    output_accuracy: {
      value: '',
      type: 'ge'
    },
    network_statistics_cost_parameter: {
      value: '',
      type: 'ge'
    },
    network_statistics_cost_add: {
      value: '',
      type: 'ge'
    },
    network_statistics_cost_multiply: {
      value: '',
      type: 'ge'
    },
    network_statistics_cost_multiply_add: {
      value: '',
      type: 'ge'
    }
  },
  currentFilters: '',
  currentSort: '',
  clickStarFlag: false
};

/** PublicProjectで使用するStateの定義 */
export default publicProject;
