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
import { useEditorStore } from '@/stores/editor'
import { useConfigStore } from '@/stores/config'
import { useUtilsStore } from '@/stores/utils'
import { useNNABLACoreDefStore } from '@/stores/nnabla_core_def'
import { useDefinitionsStore } from '@/stores/misc/definitions'
import { storeToRefs } from 'pinia';
import { nextTick, reactive, ref } from 'vue';
import {useLanguageStore} from '@/stores/misc/languages'
import ContextMenu from '@/components/shared-components/context-menu/ContextMenu.vue'
const editor_store = useEditorStore()
const nnabla_core_def_store = useNNABLACoreDefStore()
const config_store = useConfigStore()
const definitions_store = useDefinitionsStore()
const utils_store = useUtilsStore()
const {readOnly} = storeToRefs(editor_store)
const {data, active} = storeToRefs(config_store)
const languages_store = useLanguageStore()
const language = reactive(languages_store.language)

const DEFAULT_OPTIMIZER_SCHEDULER = ref<string>('Exponential')
const DEFAULT_OPTIMIZER_WARMUP_LENGTH = ref<number>(5)
const DEFAULT_OPTIMIZER_POWWER = ref<number>(1)
const DEFAULT_OPTIMIZER_STEPS = ref<string>('')
const configs_area_root = ref<any>(null)
const context_menu = ref<any>(null)
const menu_items = ref<any>([
    { type: 'action', text: language.config.contextMenu.ADD_OPTIMIZER, action: add_optimizer },
    { type: 'action', text: language.config.contextMenu.ADD_EXECUTOR, action: add_executor },
    { type: 'action', text: language.config.contextMenu.MOVE_UP, action: moveUp, disabled: false },
    { type: 'action', text: language.config.contextMenu.MOVE_DOWN, action: moveDown, disabled: false },
    { type: 'action', text: language.config.contextMenu.RENAME, action: rename },
    { type: 'action', text: language.config.contextMenu.DELETE, action: deleteConfig },
])

const read_only_menu_items = ref<any>([
    { type: 'action', text: language.config.contextMenu.ADD_OPTIMIZER, action: add_optimizer, disabled: true },
    { type: 'action', text: language.config.contextMenu.ADD_EXECUTOR, action: add_executor, disabled: true },
    { type: 'action', text: language.config.contextMenu.MOVE_UP, action: moveUp, disabled: true },
    { type: 'action', text: language.config.contextMenu.MOVE_DOWN, action: moveDown, disabled: true },
    { type: 'action', text: language.config.contextMenu.RENAME, action: rename, disabled: true },
    { type: 'action', text: language.config.contextMenu.DELETE, action: deleteConfig, disabled: true },
])

function changeActive(_config: any) {
    data.value.forEach((config: any, index: any) => {
        if (config.name === _config.name) {
            config.active = true;
            active.value.index = index;
        } else {
            config.active = false;
        }
    });
}

function open_menu(config: any, event: any, type?: any) {
    event.preventDefault();
    var params: any = { 'parent': configs_area_root.value, 'event': event };
    var emitEvent = 'open';
    if(type == 'dropdown') {
        var el: any = document.elementFromPoint(event.clientX, event.clientY);
        params.point = {
            x: el.x,
            y: el.y + el.height
        };
        params.excludeClass = event.target.className;
        if (context_menu.value.open) {
            emitEvent = 'close_menu';
        }
    }
    if(emitEvent === 'open') {
        context_menu.value.open_menu(params);
    } else if(emitEvent === 'close_menu') {
        context_menu.value.closeMenu(params);
    }
    if (config) {
        changeActive(config);
    } else {
        config = data.value[active.value.index];
    }
    const MOVE_UP_INDEX = 2;
    const MOVE_DOWN_INDEX = 3;
    const RENAME_INDEX = 4;
    const DELETE_INDEX = 5;
    if (config.type === 'Optimizer' || config.type === 'Executor') {
        menu_items.value[MOVE_UP_INDEX].disabled = isFirst(config.type);
        menu_items.value[MOVE_DOWN_INDEX].disabled = isLast(config.type);
    } else {
        menu_items.value[MOVE_UP_INDEX].disabled = true;
        menu_items.value[MOVE_DOWN_INDEX].disabled = true;
    }
    if (config.name === 'train_error' || config.name === 'valid_error' || config.type === 'Global') {
        menu_items.value[RENAME_INDEX].disabled = true;
        menu_items.value[DELETE_INDEX].disabled = true;
    } else {
        menu_items.value[RENAME_INDEX].disabled = false;
        menu_items.value[DELETE_INDEX].disabled = false;
    }
}

function add_optimizer() {
    var _new_optimizer = {
        name: utils_store.toUniqueName('Optimizer', data.value),
        network: 'Main',
        dataset: 'Training',
        updater: {
            interval: 1
        },
        weight_decay: 0,
        learning_rate_multiplier: 1,
        update_interval: 1,
        type: 'Optimizer',
        active: false,
        scheduler: DEFAULT_OPTIMIZER_SCHEDULER.value,
        warmup_scheduler: false,
        warmup_length: DEFAULT_OPTIMIZER_WARMUP_LENGTH.value,
        warmup_length_unit: definitions_store.Definitions.CONFIG.UPDATE_INTERVAL_UNIT.EPOCH,
        update_interval_unit: definitions_store.Definitions.CONFIG.UPDATE_INTERVAL_UNIT.EPOCH,
        power: DEFAULT_OPTIMIZER_POWWER.value,
        steps: DEFAULT_OPTIMIZER_STEPS.value
    };
    config_store.set_default_updater(_new_optimizer.updater, nnabla_core_def_store.nnablaCore.solvers.find((updater: any) => updater.default));
    var index = data.value.findIndex((config: any) => config.type == 'Monitor');
    data.value.splice(index, 0, _new_optimizer);
}

function add_executor() {
    var _new_executor = {
        name: utils_store.toUniqueName('Executor', data.value),
        network: 'MainRuntime',
        dataset: 'Validation',
        number_of_evaluation: 1,
        adopt_result: 'mean',
        back_propagation: false,
        type: 'Executor',
        active: false
    };
    data.value.push(_new_executor);
}

function rename() {
    var config = data.value[active.value.index];
    if (config.type === "Optimizer" || config.type === "Executor") {
        editor_store.prompt(definitions_store.Definitions.strings.prompt_message('config'), config.name, [ {
            name: 'Cancel',
        }, {
            name: 'OK',
            action: (name: any) => name && (config.name = utils_store.toUniqueName(name, data.value)),
        }, ] );
    }
}

function deleteConfig() {
    var config = data.value[active.value.index];
    if (config.type === "Optimizer" || config.type === "Executor") {
        var index = data.value.findIndex((_config: any) => _config.name === config.name);
        if (index >= 0) {
            data.value.splice(index, 1);
            data.value.forEach((config: any) => config.active = false);
            data.value[0].active = true;
            active.value.index = 0;
        }
    }
}

function moveUp() {
    var config = data.value[active.value.index];
    if (!isFirst(config.type)) {
        // activeなindexの一つ上から二つ配列から削除し、順番を入れ替えたものを元の配列に追加している
        data.value.splice(active.value.index - 1, 2, data.value[active.value.index], data.value[active.value.index - 1]);
        active.value.index = active.value.index - 1;
    }
}

function moveDown() {
    var config = data.value[active.value.index];
    if (!isLast(config.type)) {
        data.value.splice(active.value.index, 2, data.value[active.value.index + 1], data.value[active.value.index]);
        active.value.index = active.value.index + 1;
    }
}

function isFirst(configType: any) {
    const firstIndex = data.value.findIndex((config: any) => config.type === configType);
    return active.value.index === firstIndex;
}

function isLast(configType: any) {
    const lastIndex = findLastIndex(configType);
    return active.value.index === lastIndex;
}

function findLastIndex(configType: any) {
    const reverseIndex = data.value.slice().reverse().findIndex((config: any) => config.type === configType);
    const count = data.value.length - 1;
    const lastIndex = reverseIndex >= 0 ? count - reverseIndex : reverseIndex;
    return lastIndex;
}

</script>

<template>
    <div ref="configs_area_root" class="configs-area app-row app-col" @contextmenu="open_menu('', $event)">
        <div class="config-top">
            <span class="config-headline">{{language.config.CONFIG}}</span>
            <img src="@/assets/image/Etc.svg" class="config-headline-image nnc-enabled nnc-invoker" @click="open_menu('', $event, 'dropdown')" />
        </div>
        <div class="configs app-row app-col app-scroll-x app-scroll-y">
            <div v-for="config in data" @click="changeActive(config)" @contextmenu.stop="open_menu(config, $event)" class="nnc-invoker">
                <div class="config" :class="config.active ? 'active': ''">
                    <div class="config-content-list">
                        <div class="config-title">
                            <div class="config-state pull-right">{{ config.type }}</div>
                            <div class="config-name">{{ config.name }}</div>
                        </div>
                        <div v-if="config.type=='Global'">
                            <div class="config-property">Max Epoch = {{ config.epoch }}</div>
                            <div class="config-property">Batch Size = {{ config.batch }}</div>
                        </div>
                        <div v-else-if="config.type=='Optimizer'">
                            <div class="config-property">Network = {{ config.network }}</div>
                            <div class="config-property">Dataset = {{ config.dataset }}</div>
                            <div class="config-property">Updater = {{ config.updater.name }}</div>
                        </div>
                        <div v-else-if="config.type=='Monitor'">
                            <div class="config-property">Network = {{ config.network }}</div>
                            <div class="config-property">Dataset = {{ config.dataset }}</div>
                        </div>
                        <div v-else-if="config.type=='Executor'">
                            <div class="config-property">Network = {{ config.network }}</div>
                            <div class="config-property">Dataset = {{ config.dataset }}</div>
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