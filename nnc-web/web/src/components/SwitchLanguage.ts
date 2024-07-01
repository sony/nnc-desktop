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

/// <reference path="../@types/index.d.ts" />
import Vue from 'vue';
import { Prop } from 'vue-property-decorator';
import Component from 'vue-class-component';
import {LANGUAGES} from '../Const';
import store from '../store/index';

@Component({
  name: 'SwitchLanguage'
})
export default class SwitchLanguage extends Vue {
  get languages(): any {
    return LANGUAGES;
  }

  get selectedLang(): string {
    return store.state.common.language;
  }

  public switchLang(language: string): void {
    if (this.isCorrectLang(language)) {
      localStorage.setItem('sl', language);
      store.commit('setLanguage', language);
    } else {
      const DEFAULT_LANGUAGE: string = 'en';
      localStorage.setItem('sl', DEFAULT_LANGUAGE);
      store.commit('setLanguage', DEFAULT_LANGUAGE);
    }
  }

  public isCorrectLang(language: string): boolean {
    return LANGUAGES.some((lang: {'value': string, 'label': string}) => {
      return lang.value === language;
    });
  }

}
