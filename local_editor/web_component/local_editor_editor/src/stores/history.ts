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
import {useUtilsStore} from './utils'
import {useGraphStore} from './graph'

export const useHistoryStore = defineStore('history', () => {
  const utils_store = useUtilsStore()
  const graph_store = useGraphStore()

  const commands = ref<any>([])
  const index = ref<number>(0)

  const historyInfo = computed(() => {
    const nameOf = (command: any) => (command || {name: () => null}).name()
    return {
        undo: {
            enabled: 0 < index.value,
            name: nameOf(commands.value[index.value - 1]),
        },
        redo: {
            enabled: index.value < commands.value.length,
            name: nameOf(commands.value[index.value]),
        }
    }
  })

  function execute(command: any) {
    switch(command.type) {
        case 'push':
            commands.value.length = index.value; // index 以降のコマンドを削除する
            commands.value.push(command.argument); // コマンドキューにコマンドを追加する
            index.value += 1; // index を新たに積んだオブジェクトにあわせる
            // 統計情報の更新
            utils_store.calculate_properties();
            graph_store.getLayers().forEach((layer: any) => layer.updateOrderDisplay());
            break;
        case 'push-and-execute':
            commands.value.length = index.value; // index 以降のコマンドを削除する
            commands.value.push(command.argument);
            execute({type: 'redo'}); // index を一つ前にして redo() で新たに積んだコマンドを実行する
            break;
        case 'undo':
            var name;
            if (index.value > 0) {
                commands.value[--index.value].undo();
                name = commands.value[index.value].name();
            }
            // 統計情報の更新
            if (name !== 'Change active network' && name !== 'Add network') {
              utils_store.calculate_properties();
              graph_store.getLayers().forEach((layer: any) => layer.updateOrderDisplay());
            }
            break;
        case 'redo':
            var result;
            var name;
            if (index.value < commands.value.length) {
                result = commands.value[index.value].exec();
                name = commands.value[index.value++].name();
            }
            // 統計情報の更新
            if (name !== 'Change active network') {
              utils_store.calculate_properties();
              graph_store.getLayers().forEach((layer: any) => layer.updateOrderDisplay());
            }
            return result;
    }
  }

  return { 
    execute,
    historyInfo
  }
})
