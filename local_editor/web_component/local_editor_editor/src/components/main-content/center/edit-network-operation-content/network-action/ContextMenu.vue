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
import { ref, reactive, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useHistoryStore } from '@/stores/history'
import { useEditorStore } from '@/stores/editor'
import { useNetworkStore } from '@/stores/network'
import { useLanguageStore } from '@/stores/misc/languages'

import { useSelectionStore } from '@/stores/selection'
import { useUtilsStore } from '@/stores/utils'
import { useGraphStore } from '@/stores/graph'
import { useClipboardStore } from '@/stores/editor/clipboard'
import { useContextMenuStore } from '@/stores/editor/context_menu'

const history_store = useHistoryStore()
const selection_store = useSelectionStore()
const editor_store = useEditorStore()
const utils_store = useUtilsStore()
const language_store = useLanguageStore()
const graph_store = useGraphStore()
const network_store = useNetworkStore()
const context_menu_store = useContextMenuStore()
const clipboard_store = useClipboardStore()
const language = reactive(language_store.language)

const contextMC = ref<HTMLInputElement | null>(null)

const {
    historyInfo
} = storeToRefs(history_store)
const { selection } = storeToRefs(editor_store)

const {
    contextMenuShown,
    menutop,
    menuleft
} = storeToRefs(context_menu_store)

const networkGraph = editor_store.zoomInfo.networkGraph;
const values = computed(() => utils_store.indexOperator(networkGraph.percentages, networkGraph.percentage))

function undoClick() {
    let command = { type: 'undo' }
    history_store.execute(command)
    context_menu_store.setContextMenuShown(false)
}

function redoClick() {
    let command = { type: 'redo' }
    history_store.execute(command)
    context_menu_store.setContextMenuShown(false)
}

function cutClick() {
    clipboard_store.cut()
    context_menu_store.setContextMenuShown(false)
}

function copyClick() {
    clipboard_store.copy()
    context_menu_store.setContextMenuShown(false)
}

function pasteClick() {
    clipboard_store.paste()
    context_menu_store.setContextMenuShown(false)
}

function deleteClick() {
    graph_store.deleteSelection('Delete')
    context_menu_store.setContextMenuShown(false)
}

function unitDisabled() {
    return network_store.unitDisabled()
}

function createUnitClick() {
    network_store.createUnit()
    context_menu_store.setContextMenuShown(false)
}

function selectAllClick() {
    graph_store.selectAll()
    context_menu_store.setContextMenuShown(false)
}

function inverseSelectClick() {
    graph_store.invertSelection()
    context_menu_store.setContextMenuShown(false)
}

function clearSelectClick() {
    selection_store.clear()
    context_menu_store.setContextMenuShown(false)
}

function arrangeClick() {
    utils_store.arrange_layers()
    context_menu_store.setContextMenuShown(false)
}

function zoomClick(value: number) {
    let operation = {name: 'Editor', percentage: value}
    editor_store.operateZooming(operation)
    context_menu_store.setContextMenuShown(false)
}

function exportPrototxt() {
    editor_store.exportPrototxt()
    context_menu_store.setContextMenuShown(false)
}

function exportPythonCode() {
    editor_store.exportPythonCode()
    context_menu_store.setContextMenuShown(false)
}

function exportHtml() {
    editor_store.exportHtml()
    context_menu_store.setContextMenuShown(false)
}

</script>

<template>
    <div :class="['test2', 'action-menu-item', 'dropdown-menu', contextMenuShown ? 'show' : '']"
        :style="{ left: `${menuleft}px`, top: `${menutop}px` }">
        <ul ref="contextMC" class="network-context-menu context-menu">
            <!-- undo redo -->
            <li v-show="!historyInfo.undo.name" class="context-menu-item">
                <span class="menu-item disabled">{{language.edit.contextMenu.UNDO}}</span>
            </li>
            <li v-show="historyInfo.undo.name" class="context-menu-item" @click="undoClick">
                <span class="menu-item enabled">{{language.edit.contextMenu.UNDO}} - {{historyInfo.undo.name}}</span>
            </li>

            <li v-show="!historyInfo.redo.name" class="context-menu-item">
                <span class="menu-item disabled">{{language.edit.contextMenu.REDO}}</span>
            </li> 
            <li v-show="historyInfo.redo.name" class="context-menu-item" @click="redoClick">
                <span class="menu-item enabled">{{language.edit.contextMenu.REDO}} - {{historyInfo.redo.name}}</span>
            </li>
            <li class="context-menu-item"><span class="item-separator"></span></li>

            <!-- cut copy paste delete create_unit -->
            <li v-show="!selection.all.length" class="context-menu-item">
                <span class="menu-item disabled">{{language.edit.contextMenu.CUT}}</span>
            </li>
            <li v-show="selection.all.length" class="context-menu-item" @click="cutClick">
                <span class="menu-item enabled">{{language.edit.contextMenu.CUT}}</span>
            </li>

            <li v-show="!selection.all.length" class="context-menu-item">
                <span class="menu-item disabled">{{language.edit.contextMenu.COPY}}</span>
            </li>
            <li v-show="selection.all.length" class="context-menu-item" @click="copyClick">
                <span class="menu-item enabled">{{language.edit.contextMenu.COPY}}</span>
            </li>

            <li class="context-menu-item" @click="pasteClick">
                <span class="menu-item enabled">{{language.edit.contextMenu.PASTE}}</span>
            </li>

            <li v-show="!selection.all.length" class="context-menu-item">
                <span class="menu-item disabled">{{language.edit.contextMenu.DELETE}}</span>
            </li>
            <li v-show="selection.all.length" class="context-menu-item" @click="deleteClick">
                <span class="menu-item enabled">{{language.edit.contextMenu.DELETE}}</span>
            </li>

            <li v-show="unitDisabled()" class="context-menu-item">
                <span class="menu-item disabled">{{language.edit.contextMenu.CREATE_UNIT}}</span>
            </li>
            <li v-show="!unitDisabled()" class="context-menu-item" @click="createUnitClick">
                <span class="menu-item enabled">{{language.edit.contextMenu.CREATE_UNIT}}</span>
            </li>
            <li class="context-menu-item"><span class="item-separator"></span></li>

            <!-- selection -->
            <li class="context-menu-item" @click="selectAllClick">
                <span class="menu-item enabled">{{language.edit.contextMenu.SELECT_ALL}}</span>
            </li>

            <li class="context-menu-item" @click="inverseSelectClick">
                <span class="menu-item enabled">{{language.edit.contextMenu.INVERSE_LAYER_SELECTION}}</span>
            </li>

            <li v-show="selection.all.length" class="context-menu-item" @click="clearSelectClick">
                <span class="menu-item enabled">{{language.edit.contextMenu.CLEAR_SELECTION}}</span>
            </li>
            <li v-show="!selection.all.length" class="context-menu-item">
                <span class="menu-item disabled">{{language.edit.contextMenu.CLEAR_SELECTION}}</span>
            </li>
            <li class="context-menu-item"><span class="item-separator"></span></li>

            <!-- arrange -->
            <li class="context-menu-item" @click="arrangeClick">
                <span class="menu-item enabled">{{language.edit.contextMenu.ARRANGE_LAYERS}}</span>
            </li>
            <li class="context-menu-item"><span class="item-separator"></span></li>

            <!-- zoom -->
            <li class="context-menu-item" @click="zoomClick(100)">
                <span class="menu-item enabled">{{language.edit.contextMenu.ZOOM_DEFAULT}}</span>
            </li>
            <li v-show="values.canMoveNext" class="context-menu-item" @click="zoomClick(values.next)">
                <span class="menu-item enabled">{{language.edit.contextMenu.ZOOM_IN}}</span>
            </li>
            <li v-show="!values.canMoveNext" class="context-menu-item">
                <span class="menu-item disabled">{{language.edit.contextMenu.ZOOM_IN}}</span>
            </li>

            <li v-show="values.canMovePrev" class="context-menu-item" @click="zoomClick(values.prev)">
                <span class="menu-item enabled">{{language.edit.contextMenu.ZOOM_OUT}}</span>
            </li>
            <li v-show="!values.canMovePrev" class="context-menu-item">
                <span class="menu-item disabled">{{language.edit.contextMenu.ZOOM_OUT}}</span>
            </li>
            <li class="context-menu-item"><span class="item-separator"></span></li>
            
            <li class="context-menu-item">
                <span class="item-submenu">
                    {{language.edit.contextMenu.EXPORT}}
                    <ul class="network-context-menu context-menu sub submenu">
                        <li class="context-menu-item">
                            <span class="menu-item enabled" @click="exportPrototxt">prototxt(Caffe)beta</span>
                        </li>
                        <li class="context-menu-item">
                            <span class="menu-item enabled" @click="exportPythonCode">Python Code (NNabla)</span>
                        </li>
                        <li class="context-menu-item">
                            <span v-show="editor_store.isCreateReport" class="menu-item disabled">html beta</span>
                            <span v-show="!editor_store.isCreateReport" class="menu-item enabled" @click="exportHtml">html beta</span>
                        </li>
                    </ul>
                </span>
            </li>
        </ul>
    </div>
</template>

<style lang="scss" scoped>
ul.network-context-menu.context-menu.sub.submenu{
    top:0px;
    left:165px;
}
</style>