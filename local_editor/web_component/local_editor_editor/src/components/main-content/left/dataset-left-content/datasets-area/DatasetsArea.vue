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
import {useDatasetStore} from '@/stores/dataset'
import {useLanguageStore} from '@/stores/misc/languages'
import {useEditorStore} from '@/stores/editor'
import {useDefinitionsStore} from '@/stores/misc/definitions'
import {useUtilsStore} from '@/stores/utils'
import { storeToRefs } from 'pinia';
import { reactive, ref } from 'vue';
import ContextMenu from'@/components/shared-components/context-menu/ContextMenu.vue'
const dataset_store = useDatasetStore()
const utils_store = useUtilsStore()
const definitions_store = useDefinitionsStore()
const editor_store = useEditorStore()
const languages_store = useLanguageStore()
const {
    data,
    active
} = storeToRefs(dataset_store)
const {readOnly} = storeToRefs(editor_store)
const language = reactive(languages_store.language)
const menu_items = ref<any>([
    { type: 'action', text: language.dataset.contextMenu.MOVE_UP, action: moveUp, disabled: false },
    { type: 'action', text: language.dataset.contextMenu.MOVE_DOWN, action: moveDown, disabled: false },
    { type: 'action', text: language.dataset.contextMenu.ADD, action: add },
    { type: 'action', text: language.dataset.contextMenu.RENAME, action: rename },
    { type: 'action', text: language.dataset.contextMenu.DELETE, action: deleteDataset },
])
const read_only_menu_items = ref<any>([
    { type: 'action', text: language.dataset.contextMenu.MOVE_UP, action: moveUp, disabled: true },
    { type: 'action', text: language.dataset.contextMenu.MOVE_DOWN, action: moveDown, disabled: true },
    { type: 'action', text: language.dataset.contextMenu.ADD, action: add, disabled: true },
    { type: 'action', text: language.dataset.contextMenu.RENAME, action: rename, disabled: true },
    { type: 'action', text: language.dataset.contextMenu.DELETE, action: deleteDataset, disabled: true },
])
const context_menu = ref<any>(null)
const datasets_area_root = ref<any>(null)

function changeActive(_dataset: any) {
    dataset_store.visibleLinkingDataset = false
    if (_dataset.name === data.value[active.value.index].name) return;
    data.value.forEach((dataset: any, index: any) => {
        if (dataset.name === _dataset.name) {
            dataset.active = true;
            active.value.index = index;
        } else {
            dataset.active = false;
        }
    });
}

function open_menu(dataset: any, event: any, type?: any) {
    event.preventDefault();
    var params: any = { 'parent': datasets_area_root.value, 'event': event };
    var emitEvent = 'open';
    if(type == 'dropdown') {
        var el: any = document.elementFromPoint(event.clientX, event.clientY);
        params.point = {
            x: el.x,
            y: el.y + el.height
        };
        params.excludeClass = event.target.className;
        if (context_menu.value.open && (dataset.name === data.value[active.value.index].name)) {
            emitEvent = 'close_menu';
        }
    }
    
    if(emitEvent === 'open') {
        context_menu.value.open_menu(params);
    } else if(emitEvent === 'close_menu') {
        context_menu.value.closeMenu(params);
    }
    if(dataset) changeActive(dataset);
    menu_items.value[0].disabled = isFirst();
    menu_items.value[1].disabled = isLast();
}

function rename() {
    editor_store.prompt(
        definitions_store.Definitions.strings.prompt_message('dataset'),
        data.value[active.value.index].name,
        [ {name: 'Cancel', }, {name: 'OK', action: (newName: any) => {
            if (newName) {
                data.value[active.value.index].name = utils_store.toUniqueName(newName, data.value);
            }
        }, }, ]);
}

function deleteDataset() {
    if (1 < data.value.length) {
        var index = data.value.findIndex((dataset: any) => dataset.name == data.value[active.value.index].name);
        if (index >= 0) {
            if (data.value[index].is_main) {
                var mainIndex = index > 0 ? index - 1 : index + 1;
                data.value[mainIndex].is_main = true;
            }
            data.value.splice(index, 1);
            data.value.forEach((dataset: any) => {
                dataset.active = false;
            });
            if (index === data.value.length) {
                index = 0;
            }
            data.value[index].active = true;
            active.value.index = index;
        }
    }
}

function moveUp() {
    if (!isFirst()) {
        // activeなindexの一つ上から二つ配列から削除し、順番を入れ替えたものを元の配列に追加している
        data.value.splice(active.value.index - 1, 2, data.value[active.value.index], data.value[active.value.index - 1]);
        active.value.index = active.value.index - 1;
    }
}

function moveDown() {
    if (!isLast()) {
        data.value.splice(active.value.index, 2, data.value[active.value.index + 1], data.value[active.value.index]);
        active.value.index = active.value.index + 1;
    }
}

function isFirst() {
    const firstDatasetIndex = 0;
    return active.value.index === firstDatasetIndex;
}

function isLast() {
    const lastDatasetIndex = data.value.length - 1;
    return active.value.index === lastDatasetIndex;
}

function add() {
    var _new_dataset = {
        name: utils_store.toUniqueName("Dataset", data.value),
        tobe_shuffled: false,
        tobe_normalized_image: false,
        is_main: false,
        id: '',
        samples: 0,
        columns: 0,
        header: [],
        contents: []
    };
    data.value.push(_new_dataset);
}
</script>

<template>
    <div ref="datasets_area_root" class="datasets-area app-row app-col" @contextmenu="open_menu('', $event)">
        <div class="datasets app-row app-col app-scroll-x app-scroll-y">
            <div v-for="dataset in data" @click="changeActive(dataset)" @contextmenu.stop="open_menu(dataset, $event)" class="nnc-invoker">
                <div class="dataset" :class="dataset.active ? 'active': ''">
                    <div class="dataset-component">
                        <div class="dataset-top clearfix">
                            <div class="dataset-top-etc-btn">
                                <img src="@/assets/image/Etc.svg" class="dataset-top-etc-image nnc-enabled nnc-invoker" @click="open_menu(dataset, $event, 'dropdown')" />
                            </div>
                            <div class="dataset-headline">
                                <div class="dataset-title">{{ dataset.name }}</div>
                                <img src="@/assets/image/Linked.svg" class="dataset-top-link-image"/><span class="dataset-original-name" v-if="data.length">{{ dataset.original_name }}</span>
                            </div>
                        </div>
                        <div class="dataset-body">
                            <div class="clearfix"><div class="dataset-property-name">Num Data</div><div class="dataset-property-value">{{ dataset.samples }}</div></div>
                            <div class="clearfix"><div class="dataset-property-name">Num Column</div><div class="dataset-property-value">{{ dataset.columns }}</div></div>
                            <div class="clearfix"><div class="dataset-property-name">Shuffle</div><div class="dataset-property-value">{{ dataset.tobe_shuffled }}</div></div>
                            <div class="clearfix"><div class="dataset-property-name">Cache</div><div class="dataset-property-value">true</div></div>
                            <div class="clearfix"><div class="dataset-property-name">Normalize</div><div class="dataset-property-value">{{ dataset.tobe_normalized_image }}</div><div class="dataset-state" v-if="dataset.is_main">Main</div></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <ContextMenu
            ref="context_menu" 
            :menuItems="readOnly ? read_only_menu_items : menu_items"
            :isSub="false"
        />
    </div>
</template>