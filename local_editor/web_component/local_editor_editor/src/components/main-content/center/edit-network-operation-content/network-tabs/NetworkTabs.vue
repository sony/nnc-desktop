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
import { ref, reactive, onMounted, onUpdated, computed } from 'vue'
import draggable from 'vuedraggable'
import { useNetworkStore } from '@/stores/network'
import { useEditorStore } from '@/stores/editor'
import { useUtilsStore } from '@/stores/utils'
import GraphTab from './GraphTab.vue'
import GraphTabAppend from './GraphTabAppend.vue'
import { storeToRefs } from 'pinia'

const network_store = useNetworkStore()
const editor_store = useEditorStore()
const utils_store = useUtilsStore()

const { data } = storeToRefs(network_store)

function dragEnd(e: any) {
    const oldIndex = e.oldIndex;
    const newIndex = e.newIndex;
    if (oldIndex !== newIndex) {
        network_store._select(data.value.graphs[e.newIndex].name, true)
        editor_store.configuration = utils_store.serialize_configuration()
    }
}

</script>
<template>
    <div class="network-tabs">
        <draggable :options="{animation: 300}" v-model="data.graphs" @end="dragEnd" item-key="name">
            <template #item="{element}">
                <GraphTab
                    :graph="element"
                    :class="{'active': element.name===data.target, 'renaming': element.renaming}"
                />
            </template>
        </draggable>
        <GraphTabAppend/>
    </div>
</template>