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

export interface IMetadata {
  limit: number;
  offset: number;
  sort_by: string;
  tenant_id: string;
  total: number;
}

export interface IProject {
  create_datetime: string;
  deleted: boolean;
  last_modified_user_id: string;
  owner_user_id: string;
  progress: number;
  project_id: string;
  project_name: string;
  readonly: boolean;
  status: string;
  tenant_id: string;
  update_datetime: string;
  import_status: string;
  import_sdcproj_status: string;
  labels: string[];
  storage_used: number;
}

export interface ISampleProject {
  project_id: string;
  tenant_id: string;
  owner_user_id: string;
  project_name: string;
  deleted: boolean;
  create_datetime: string;
  update_datetime: string;
  copy_count: string;
  star_count: number;
  starred: boolean;
}

export interface ICoreSampleProject {
  metadata: IMetadata;
  projects: ISampleProject[];
}

export interface ICoreProjects {
  metadata: IMetadata;
  projects: IProject[];
}

export interface ICoreConfiguration {
  configuration_format: string;
  configuration: string;
  readonly: boolean;
  last_modified_user_id: string;
}
