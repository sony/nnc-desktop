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

@Component({
  name: 'FileUpload'
})
export default class FileUpload extends Vue {
  @Prop() public inputId?: string;
  @Prop() public errorMessage?: string;
  @Prop() public small?: boolean;
  @Prop() public disabled?: boolean;
  @Prop() public fileName?: string;
  public isOnArea: boolean = false;

  public onArea(): void {
    if (this.disabled) {
      return;
    }
    this.isOnArea = true;
  }

  public offArea(): void {
    if (this.disabled) {
      return;
    }
    this.isOnArea = false;
  }

  public dropFile(e: any): void {
    if (this.disabled) {
      return;
    }
    this.isOnArea = false;
    // dropと選択でtarget, dataTransferが分かれる
    const files = e.target.files || e.dataTransfer.files;
    this.$emit('select-file', files[0]);
    // 初期化
    e.target.value = '';
  }

  get vueTexts(): {[key: string]: string} {
    return text[store.state.common.language].vueTexts.pipeline;
  }

  get dialogTexts(): {[key: string]: string} {
    return text[store.state.common.language].dialogTexts;
  }

  get defaultId(): string {
    return 'file-upload-input';
  }
}
