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

export interface ICommon {
  isInitialized: boolean;
  shouldShowAccountMenu: boolean;
  shouldShowSampleProjectBalloon: boolean;
  isLoading: {[key: string]: boolean};
  countryCode: string;
  locale: string;
  tosVersion: string;
  maintenance: {
    payment: any[];
  };
  adjustmentTime: number;
  selectedComponent: string;
  projectIdFromUrl: string;
  userId: string;
  language: string;
  isBusiness: boolean;
}

const common: ICommon = {
  isInitialized: false,
  shouldShowAccountMenu: false,
  shouldShowSampleProjectBalloon: false,
  isLoading: {
    dashboard: false,
    project: false,
    dataset: false,
    jobHistory: false,
    sampleProject: false,
    publicProject: false,
    serviceSettings: false,
    common: false
  },
  countryCode: '',
  locale: '',
  tosVersion: '',
  maintenance: {
    payment: []
  },
  adjustmentTime: NaN,
  selectedComponent: '',
  projectIdFromUrl: '',
  userId: '',
  language: 'en',
  isBusiness: false
};

/** 共通で使用するStateの定義 */
export default common;
