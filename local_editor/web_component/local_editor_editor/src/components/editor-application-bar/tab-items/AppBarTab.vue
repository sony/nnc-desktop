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
import { ref, reactive, nextTick } from 'vue'
import { useEditorStore } from '@/stores/editor'
import { useEvaluationStore } from '@/stores/evaluation'
import { useResultStore } from '@/stores/result'
import { useBaseGraphStore } from '@/stores/training_graph/base_graph'
import { useContextMenuStore } from '@/stores/editor/context_menu'

const props = defineProps<{
    tabName: string, 
    displayName: string
}>()

const editor_store = useEditorStore()
const result_store = useResultStore()
const evaluation_store = useEvaluationStore()
const context_menu_store = useContextMenuStore()
const base_graph_store = useBaseGraphStore()

function changeActiveTab(tabName: string): void {
    context_menu_store.setContextMenuShown(false)
    if (editor_store.activeTabName !== tabName) {
        evaluation_store.resetConfusionMatrix()
        editor_store.activeTabName = tabName
        result_store.initSelectedLayer()
        base_graph_store.disposeChart()
    }
    nextTick(function() {
        editor_store.windowInit()
        // タブを切り替えた際にオーバービュー表示が更新されるようにフラグを変更
        editor_store.updateDetection = !editor_store.updateDetection
    })
}

</script>

<template>
    <div class="nnc-invoker" :class="['navbar-el', editor_store.activeTabName === tabName ? 'active' : '']" @click="changeActiveTab(tabName)">
        <span class="navbar-tab">
            <img v-if='tabName === "DATASET"' src="@/assets/image/LinkedWhite.svg" class="navbar-img tab-name-img nnc-enabled">
            <img v-if='tabName === "CONFIG"' src="@/assets/image/SettingsWhite.svg" class="navbar-img tab-name-img nnc-enabled">
            <span>{{ displayName }}</span>
        </span>
    </div>
</template>