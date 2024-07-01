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

import { ref } from 'vue'
import { defineStore } from 'pinia'

interface MenuPosition {
    menutop: number;
    menuleft: number;
}

export const useContextMenuStore = defineStore('context_menu', () => {
  const contextMenuShown = ref<Boolean>(false);
  const menutop = ref<number>(0);
  const menuleft = ref<number>(0);

  function setContextMenuShown(payload: boolean): void {
    contextMenuShown.value = payload;
  }

  function setContextMenuPos(payload: MenuPosition): void {
    menutop.value = payload.menutop;
    menuleft.value = payload.menuleft;
  }

  return {
    contextMenuShown,
    menutop,
    menuleft,
    setContextMenuShown,
    setContextMenuPos
  }
})
