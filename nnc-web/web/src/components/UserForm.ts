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
import Component from 'vue-class-component';
import store from '../store/index';
import router from '../router/index';
import { SwalUtil } from '../util/SwalUtil';

const FORM_URL: string = '/ja/user/form.html';

@Component({
  name: 'UserForm'
})
export default class UserForm extends Vue {
  public mounted() {
    const userId: string = store.state.common.userId;
    if (!userId || this.isSignIn) {
      // サインアップからの遷移以外ではdashboardに移動
      this.linkDashbord();
      return;
    }

    window.addEventListener('message', e => {
      if (e.data && e.data.action === 'form-complete') {
        store.commit('setIsBusiness', e.data.message.isBusiness);

        // ユーザー情報の入力が完了すると呼ばれる
        SwalUtil.hideDialog(() => {
          store.commit('setIsSignIn', true);
        });
      }
    });

    SwalUtil.showIframe(`${FORM_URL}?user_id=${userId}`);
  }

  public linkDashbord(): void {
    router.push({ path: 'dashboard' });
  }

  get isSignIn(): boolean {
    return store.state.session.isSignIn;
  }
}
