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
import Vuex, { Store } from 'vuex';
import state, { IState } from './state/index';
import mutations from './mutations/index';

Vue.use(Vuex);
Vue.config.devtools = true

const store: Store<IState> = new Vuex.Store({
  state,
  mutations
});

export default store;
