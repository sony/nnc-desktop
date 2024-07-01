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

import Vue from 'vue';
import { Prop } from 'vue-property-decorator';
import Component from 'vue-class-component';
import store from '../../store';
import text from '../../messages/Text';

@Component({
  name: 'Copy'
})
export default class Copy extends Vue {
  @Prop() public text!: string;
  @Prop() public disabled?: boolean;
  @Prop() public className?: string;

  private copied = false;

  public copy() {
    const input: HTMLInputElement = document.createElement('input');
    document.body.appendChild(input);
    input.value = this.text;
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    this.copied = true;
  }

  public onMouseLeave() {
    this.copied = false;
  }

  get description() {
    return this.copied ? text[store.state.common.language].dialogTexts.COPIED : text[store.state.common.language].dialogTexts.COPY_TO_CLIPBOARD;
  }
}
