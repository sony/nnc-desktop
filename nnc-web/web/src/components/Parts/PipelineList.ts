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

/// <reference path="../../@types/index.d.ts" />
import Vue from 'vue';
import { Prop } from 'vue-property-decorator';
import Component from 'vue-class-component';
import Text from '../../messages/Text';
import store from '../../store/index';
import { IPipeline, IWorkflow } from '../../store/state/pipeline';

@Component({
  name: 'PipelineList'
})
export default class PipelineList extends Vue {
  @Prop() public workflowList!: IWorkflow[];
  @Prop() public pipelineList!: IPipeline[];
  @Prop() public selectedWorkflowId!: string;

  public isSelected(_workflow: IWorkflow): boolean {
    return _workflow.id === this.selectedWorkflowId;
  }

  get vueTexts(): {[key: string]: string} {
    return Text[store.state.common.language].vueTexts.pipeline;
  }

}
