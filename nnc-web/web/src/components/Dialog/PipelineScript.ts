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
import FileUpload from '../Parts/FileUpload.vue';
import { IScript } from '../../store/state/pipeline';

const MAX_FILE_NAME_LENGTH: number = 255;
const MAX_FILE_NAME_NUM: number = 3;

@Component({
  name: 'PipelineScriptDialog',
  components: {
    FileUpload,
    Radio
  }
})
export default class PipelineScriptDialog extends Vue {
  @Prop() public scripts!: IScript[];
  @Prop() public resultFiles!: string[];
  @Prop() public preProcessScriptId!: string;
  @Prop() public postProcessScriptId!: string;

  public preProcessFile: File = {} as File;
  public postProcessFile: File = {} as File;
  public inputtedResultFiles: {value: string, errorMessage: string}[] = [];

  public mounted() {
    this.inputtedResultFiles = this.resultFiles.map((name: string) => {
      return {
        value: name,
        errorMessage: ''
      };
    });
    if (!this.inputtedResultFiles.length) {
      this.addFileName();
    }
  }

  public onSelectFile(file: File, isPreProcess: boolean): void {
    if (isPreProcess) {
      this.preProcessFile = file;
    } else {
      this.postProcessFile = file;
    }
  }

  public onInputName(value: string, index: number): void {
    this.inputtedResultFiles[index].value = value;
    this.inputtedResultFiles[index].errorMessage = this.getFileNameError(value);
  }

  private getFileNameError(value: string): string {
    if (value.length > MAX_FILE_NAME_LENGTH) {
      return this.commonDialogTexts.NAME_IS_TOO_SHORT_OR_LONG;
    } else if (value.match(/[^a-zA-Z0-9_ !#$%&\'\()+,\.\-=@\[\]^`{}~]+/g)) {
      return this.commonDialogTexts.INVALID_CHARACTER_INCLUDED;
    }
    return '';
  }

  public addFileName(): void {
    if (!this.isMaxFileName) {
      this.inputtedResultFiles.push({
        value: '',
        errorMessage: ''
      });
    }
  }

  public onClickUpdate() {
    this.$emit('update-script', {
      preProcess: this.preProcessFile,
      postProcess: this.postProcessFile,
      preProcessScriptId: this.preProcessScriptId || '',
      postProcessScriptId: this.postProcessScriptId || '',
      fileName: this.inputtedResultFiles.map((file: {value: string, errorMessage: string}) => file.value).filter((str: string) => !!str)
    });
  }

  public isCompleted(script: IScript) {
    return (script.status === 'completed') || (script.status === 'rollback_completed');
  }

  public isRollbackCompleted(script: IScript) {
    return script.status === 'rollback_completed';
  }

  private isPythonFile(fileName: string) {
    return !!fileName.match(/.+\.py$/);
  }

  private getErrorMessage(file: File): string {
    if (!file.size) {
      return '';
    }
    const fileName: string = file.name;
    if (!this.isPythonFile(fileName)) {
      return 'Invalid format.';
    }
    return '';
  }

  get vueTexts(): {[key: string]: string} {
    return text[store.state.common.language].vueTexts.pipeline;
  }

  get dialogTexts(): {[key: string]: string} {
    return text[store.state.common.language].dialogTexts.PIPELINE_SCRIPT;
  }

  get commonDialogTexts(): {[key: string]: string} {
    return text[store.state.common.language].dialogTexts;
  }

  get disabled(): boolean {
    // TODO APIつなぎこみ時に修正
    return !!this.preProcessError || !!this.postProcessError || this.hasError;
  }

  get hasError(): boolean {
    return this.inputtedResultFiles.some((resultFile: {value: string, errorMessage: string}) => !!resultFile.errorMessage);
  }

  get preProcessError(): string {
    return this.getErrorMessage(this.preProcessFile);
  }

  get postProcessError(): string {
    return this.getErrorMessage(this.postProcessFile);
  }

  get currentPreProcess(): IScript {
    return this.scripts.find((script: IScript) => script.scriptId === this.preProcessScriptId) || {} as IScript;
  }

  get currentPostProcess(): IScript {
    return this.scripts.find((script: IScript) => script.scriptId === this.postProcessScriptId) || {} as IScript;
  }

  get isMaxFileName(): boolean {
    return this.inputtedResultFiles.length >= MAX_FILE_NAME_NUM;
  }
}
