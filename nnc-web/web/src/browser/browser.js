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

var agent = window.navigator.userAgent.toLowerCase();
var isChrome = (agent.indexOf('chrome') !== -1) && (agent.indexOf('edge') === -1)  && (agent.indexOf('opr') === -1);

var browser_check_dialog_area = document.getElementById('browser_check_dialog_area');
var browser_check_button = document.getElementById('browser_check_button');

if (isChrome) {
  if (browser_check_dialog_area) {
    browser_check_dialog_area.remove();
  }
} else {
  browser_check_dialog_area.setAttribute('style', 'display: flex');
  browser_check_button.onclick = function() {
    // IEはremoveが未対応
    browser_check_dialog_area.parentNode.removeChild(browser_check_dialog_area);
  }
}