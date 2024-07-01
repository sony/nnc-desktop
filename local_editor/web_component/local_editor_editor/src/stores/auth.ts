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

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import {useDefinitionsStore} from './misc/definitions'

export const useAuthStore = defineStore('auth', () => {
    const definitions_store = useDefinitionsStore()

    function _onload(xhr: any, resolve: any, reject: any) {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.response));
        } else {
          reject(xhr);
        }
    }
    
    function createSessionRequest() {
        return new Promise((resolve, reject) => {
          var url = `${definitions_store.CoreDomain}v1/session`;
          var xhr = new XMLHttpRequest();
          xhr.open('POST', url);
          xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
          xhr.withCredentials = true;
          xhr.onload = _onload.bind(xhr, resolve, reject);
          xhr.onerror = reject;
          xhr.send();
        })
    }
    
    function updateSessionRequest(state: any, code: any) {
        return new Promise(function(resolve, reject) {
          var url = `${definitions_store.CoreDomain}v1/session`;
          var param = {
            state: state,
            authorization_code: code,
            redirect_uri: document.location.origin + document.location.pathname
          };
          var xhr = new XMLHttpRequest();
          xhr.open('PUT', url);
          xhr.setRequestHeader('content-type', 'application/json');
          xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
          xhr.withCredentials = true;
          xhr.onload = _onload.bind(xhr, resolve, reject);
          xhr.onerror = reject;
          xhr.send(JSON.stringify(param));
        })
    }
    
    function getSessionState(userID: any) {
        return new Promise(function(resolve, reject) {
          var url = `${definitions_store.CoreDomain}v1/session/${userID}/check`;
          var xhr = new XMLHttpRequest();
          xhr.open('POST', url);
          xhr.setRequestHeader('content-type', 'application/json');
          xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
          xhr.withCredentials = true;
          xhr.onload = _onload.bind(xhr, resolve, reject);
          xhr.onerror = reject;
          xhr.send();
        })
    }
    
    function onUnAuthorized() {
        createSessionRequest().then((response: any) => {
          var signinLink = response.urls.dashboard.signin;
          document.location.href = signinLink;
        })
    }

    return { 
        _onload,
        createSessionRequest,
        updateSessionRequest,
        getSessionState,
        onUnAuthorized
    }
})
