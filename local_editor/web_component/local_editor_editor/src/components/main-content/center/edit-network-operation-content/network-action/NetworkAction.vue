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
import { ref, reactive, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import ToolButton from './ToolButton.vue'
import NNCZoomBox from '@/components/shared-components/nnc-zoom-box/NNCZoomBox.vue'
import { useHistoryStore } from '@/stores/history'
import { useEditorStore } from '@/stores/editor'
import { useNetworkStore } from '@/stores/network'
import { useLanguageStore } from '@/stores/misc/languages'
import { useClipboardStore } from '@/stores/editor/clipboard'
import { useContextMenuStore } from '@/stores/editor/context_menu'
const history_store = useHistoryStore()
const editor_store = useEditorStore()
const language_store = useLanguageStore()
const clipboard_store = useClipboardStore()
const network_store = useNetworkStore()
const context_menu_store = useContextMenuStore()

const language = reactive(language_store.language)
const { historyInfo } = storeToRefs(history_store)
const { selection } = storeToRefs(editor_store)
const { contextMenuShown } = storeToRefs(context_menu_store)

const actionButton = ref(document.createElement("div"))

const props = defineProps<{
    editContainerTop: number,
    editContainerLeft: number,
}>()

function undo() {
    let command = {type: 'undo'}
    history_store.execute(command)
}

function redo() {
    let command = {type: 'redo'}
    history_store.execute(command)
}

function cut() {
    clipboard_store.cut()
}

function copy() {
    clipboard_store.copy()
}

function paste() {
    clipboard_store.paste()
}

function unitDisabled() {
    return network_store.unitDisabled()
}

function onCreateUnit() {
    network_store.createUnit()
}

function dropDownMenu() {
    const actionBEle = actionButton.value
    if (actionBEle) {
        context_menu_store.setContextMenuPos({
            menuleft: actionBEle.getBoundingClientRect().x - props.editContainerLeft,
            menutop: actionBEle.getBoundingClientRect().bottom - props.editContainerTop
        })
        context_menu_store.setContextMenuShown(!contextMenuShown.value)
    }

}

function zoom(value: number) {
    let operation = {name: 'Editor', percentage: value}
    editor_store.operateZooming(operation)
}

// hooks
onMounted(() => {
})

</script>
<template>
    <div class="network-action">
        <img v-if="!historyInfo.undo.enabled" src="@/assets/image/Undo.svg" class="network-action-image nnc-disabled" />
        <img v-else          src="@/assets/image/Undo.svg" class="network-action-image nnc-enabled nnc-invoker" @click.stop.prevent="undo" />
        <!-- <ToolButton image-name="Undo"  :disabled="!historyInfo.undo.enabled" @pressed="undo" /> -->

        <img v-if="!historyInfo.redo.enabled" src="@/assets/image/Redo.svg" class="network-action-image nnc-disabled" />
        <img v-else          src="@/assets/image/Redo.svg" class="network-action-image nnc-enabled nnc-invoker" @click.stop.prevent="redo" />
        <!-- <ToolButton image-name="Redo"  :disabled="!historyInfo.redo.enabled" @pressed="redo" /> -->

        <img v-if="!selection.all.length" src="@/assets/image/Cut.svg" class="network-action-image nnc-disabled" />
        <img v-else          src="@/assets/image/Cut.svg" class="network-action-image nnc-enabled nnc-invoker" @click.stop.prevent="cut" />
        <!-- <ToolButton image-name="Cut"   :disabled="!selection.all.length"     @pressed="cut" /> -->

        <img v-if="!selection.all.length" src="@/assets/image/Copy.svg" class="network-action-image nnc-disabled" />
        <img v-else          src="@/assets/image/Copy.svg" class="network-action-image nnc-enabled nnc-invoker" @click.stop.prevent="copy" />
        <!-- <ToolButton image-name="Copy"  :disabled="!selection.all.length"     @pressed="copy" /> -->

        <img v-if="false" src="@/assets/image/Paste.svg" class="network-action-image nnc-disabled" />
        <img v-else          src="@/assets/image/Paste.svg" class="network-action-image nnc-enabled nnc-invoker" @click.stop.prevent="paste" />
        <!-- <ToolButton image-name="Paste" :disabled="false"                     @pressed="paste" /> -->

        <img v-if="unitDisabled()" src="@/assets/image/Unit.svg" class="network-action-image nnc-disabled" />
        <img v-else          src="@/assets/image/Unit.svg" class="network-action-image nnc-enabled nnc-invoker" @click.stop.prevent="onCreateUnit" />
        <!-- <ToolButton image-name="Unit"  :disabled="unitDisabled()"            @pressed="onCreateUnit" /> -->

        <div class="pull-right action-menu">
            <NNCZoomBox :percentages="editor_store.zoomInfo.networkGraph.percentages" :percentage="editor_store.zoomInfo.networkGraph.percentage" @zoom-value="zoom" />
            <button ref="actionButton" @click="dropDownMenu" class="btn network-action-button">
                <span>{{language.common.ACTION}}</span>
                <img src="@/assets/image/ArrowDownBlue.svg" class="icon-small" />
            </button>
        </div>
    </div>
</template>