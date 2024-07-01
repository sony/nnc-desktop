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
import store from '../../store';
import text from '../../messages/Text';
import Radio from '../Parts/Radio.vue';
import { IInstance } from '../../store/state/pipeline';
type InstanceSelectedType = 'standard' | 'abci';

const MAX_DATA_SOURCE_NAME_LENGTH = 255;

@Component({
  name: 'PipelineChangeDialog',
  components: {
    Radio
  }
})
export default class PipelineChangeDialog extends Vue {
  @Prop() public name!: string;
  @Prop() public trainInstanceType!: number;
  @Prop() public evaluateInstanceType!: number;
  @Prop() public isSendMail!: boolean;
  @Prop() public trainAvailableInstance!: IInstance[];
  @Prop() public evaluateAvailableInstance!: IInstance[];

  public inputtedName: string = '';
  public selectedTrainInstanceType: number = 0;
  public selectedTrainInstanceProvider: InstanceSelectedType = 'standard';
  public selectedEvaluateInstanceType: number = 0;
  public selectedEvaluateInstanceProvider: InstanceSelectedType = 'standard';
  public inputtedIsSendMail: boolean = true;

  public mounted() {
    this.inputtedName = this.name;
    this.inputtedIsSendMail = this.isSendMail;
    this.selectedTrainInstanceProvider = this.getInstanceSelected(this.trainInstanceType, true);
    this.selectedEvaluateInstanceProvider = this.getInstanceSelected(this.evaluateInstanceType, false);
    Vue.nextTick(() => {
      // aws, abciのタブを切り替えてからインスタンスタイプを選択しないと、デフォルトのインスタンスがうまく設定できない
      this.selectedTrainInstanceType = this.trainInstanceType;
      this.selectedEvaluateInstanceType = this.evaluateInstanceType;
    });
  }

  private getInstanceSelected(instanceType: number, isTrain: boolean): InstanceSelectedType {
    const instances: IInstance[] = isTrain ? this.trainAvailableInstance : this.evaluateAvailableInstance;
    const instance: IInstance | undefined = instances.find((_instance: IInstance) => _instance.instanceType === instanceType);
    if (!instance) {
      return 'standard';
    } else {
      return instance.provider === 'aws' ? 'standard' : 'abci';
    }
  }

  public onClickUpdate() {
    this.$emit('change-pipeline', {
      name: this.inputtedName,
      isSendMail: this.inputtedIsSendMail,
      trainInstance: this.selectedTrainInstanceType,
      evaluateInstance: this.selectedEvaluateInstanceType
    });
  }

  public onChangeName(name: string) {
    this.inputtedName = name;
  }

  public onChangeSendMail(value: string) {
    this.inputtedIsSendMail = Boolean(value);
  }

  public onChangeProvider(value: InstanceSelectedType, isTrain: boolean) {
    if (isTrain) {
      this.selectedTrainInstanceProvider = value;
      Vue.nextTick(() => {
        this.selectedTrainInstanceType = this.trainInstance[0].instanceType;
      });
    } else {
      this.selectedEvaluateInstanceProvider = value;
      Vue.nextTick(() => {
        this.selectedEvaluateInstanceType = this.evaluateInstance[0].instanceType;
      });
    }
  }

  public onChangeInstanceType(value: string, isTrain: boolean): void {
    if (isTrain)  {
      this.selectedTrainInstanceType = Number(value);
    } else {
      this.selectedEvaluateInstanceType = Number(value);
    }
  }

  get vueTexts(): {[key: string]: string} {
    return text[store.state.common.language].vueTexts.pipeline;
  }

  get dialogTexts(): {[key: string]: string} {
    return text[store.state.common.language].dialogTexts.PIPELINE_CHANGE;
  }

  get commonDialogTexts(): {[key: string]: string} {
    return text[store.state.common.language].dialogTexts;
  }

  get disabled(): boolean {
    return !!this.errorMessage;
  }

  get trainInstance(): IInstance[] {
    return this.selectedTrainInstanceProvider === 'standard' ?
      this.trainAvailableInstance.filter((_instance: IInstance) => _instance.provider === 'aws') :
      this.trainAvailableInstance.filter((_instance: IInstance) => _instance.provider === 'abci');
  }

  get evaluateInstance(): IInstance[] {
    return this.selectedEvaluateInstanceProvider === 'standard' ?
      this.evaluateAvailableInstance.filter((_instance: IInstance) => _instance.provider === 'aws') :
      this.evaluateAvailableInstance.filter((_instance: IInstance) => _instance.provider === 'abci');
  }

  get abciInstance(): IInstance[] {
    return this.trainAvailableInstance.filter((_instance: IInstance) => _instance.provider === 'abci');
  }

  get errorMessage(): string {
    const value = this.inputtedName;
    if (!value || value.length > MAX_DATA_SOURCE_NAME_LENGTH) {
        return this.commonDialogTexts.NAME_IS_TOO_SHORT_OR_LONG;
    } else if (value.match(/[^a-zA-Z0-9_ !#$%&\'\()+,\.\-=@\[\]^`{}~]+/g)) {
        return this.commonDialogTexts.INVALID_CHARACTER_INCLUDED;
    }
    return '';
  }

}
