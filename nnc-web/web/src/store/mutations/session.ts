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

import { ICreateSession } from '../../interfaces/core-response/ISession';

/**
 * 各種URIを設定します。
 * サインイン/アカウント設定
 * @param {*} state
 * @param payload データ
 */
export function setURI(state: any, payload: ICreateSession): void {
  state.session.signInURI = payload.urls.dashboard.signin;
  state.session.accountSettingURI = payload.urls.dashboard.account_settings;
}

/**
 * サインインするかどうかのフラグを設定します
 * @param state state
 * @param payload SignInのフラグ
 */
export function setIsSignIn(state: any, payload: boolean): void {
  state.session.isSignIn = payload;
}

/**
 * アカウントの種別を設定します
 * @param state state
 * @param payload アカウント種別
 */
export function setAccountType(state: any, payload: string): void {
  state.session.account = payload;
}
