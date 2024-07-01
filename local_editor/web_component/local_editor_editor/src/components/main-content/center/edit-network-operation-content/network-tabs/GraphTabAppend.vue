<!-- Copyright 2024 Sony Group Corporation. -->
<!--
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
-->

<script setup lang="ts">
import { useHistoryStore } from '@/stores/history'
import { useNetworkStore } from '@/stores/network'
import { useEditorStore } from '@/stores/editor'
import { useUtilsStore } from '@/stores/utils'
const history_store = useHistoryStore()
const network_store = useNetworkStore()
const editor_store = useEditorStore()
const utils_store = useUtilsStore()

function clickedAddNetworkGraph() {
    var name = network_store._newName();
    var current = network_store.data.target;

    var command = {
        type: 'push-and-execute',
        argument: {
            exec: () => {
                network_store._append(name);
                network_store._select(name);
                editor_store.configuration = utils_store.serialize_configuration()
            },
            undo: () => {
                network_store._delete(name);
                network_store._select(current);
                editor_store.configuration = utils_store.serialize_configuration()
            },
            name: () => 'Add network',
        },
    }
    history_store.execute(command)
}
</script>
<template>
    <div class="graphs-tab graph-add" @click="clickedAddNetworkGraph">
        <img class="graph-addnew-img" src="@/assets/image/AddNew.svg"/>
    </div>
</template>