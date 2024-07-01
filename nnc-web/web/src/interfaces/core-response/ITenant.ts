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

export interface IInstance {
  instance_type: number;
  elapsed_time: number;
}

export interface ITenant {
  create_datetime: string;
  nickname: string;
  purpose: string;
  role: string;
  tenant_id: string;
}

export interface ITenantMember {
  user_id: string;
  nickname: string;
  role: string;
  status: string;
  workspace_used: number;
  need_applications?: string[];
  deleted: boolean;
  elapsed_time_for_each_instance: IInstance[];
  usage_history: {
    this_month: {
      elapsed_time_for_each_instance: IInstance[];
    };
    last_month: {
      elapsed_time_for_each_instance: IInstance[];
    }
  };
}

export interface ITenantMembers {
  members: ITenantMember[];
}
