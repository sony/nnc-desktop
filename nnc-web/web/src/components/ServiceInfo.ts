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

/// <reference path='../@types/index.d.ts' />
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import text from '../messages/Text';
import store from '../store/index';

@Component({
  name: 'ServiceInfo'
})
export default class ServiceInfo extends Vue {
  @Prop() public componentTitle!: string;
  @Prop() public infoImagePath!: string;
  @Prop() public main!: {text: string, shouldShowCurrencyUnit?: boolean};
  @Prop() public description!: {text: string, shouldShowCurrencyUnit?: boolean};
  @Prop() public linkText!: string;
  @Prop() public onClickLink!: (e: any) => void;
  @Prop() public currencyUnit!: string;
  @Prop() public tabIndex!: number;
  @Prop() public disabled!: boolean;

  public onClick(e: any): void {
    if (this.disabled) {
      return;
    }
    this.onClickLink(e);
  }

  get vueTexts(): string {
    return text[store.state.common.language].vueTexts.serviceSettings;
  }
}
