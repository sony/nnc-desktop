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
import { storeToRefs } from 'pinia'
import { useNetworkStore } from '@/stores/network'
import { useHistoryStore } from '@/stores/history'
import { useEditorStore } from '@/stores/editor'
import { useUtilsStore } from '@/stores/utils'
const props = defineProps<{
    graph: any
}>()
const network_store = useNetworkStore()
const history_store = useHistoryStore()
const editor_store = useEditorStore()
const utils_store = useUtilsStore()

const graph = ref(props.graph)
const { data } = storeToRefs(network_store)

// get all graph names
function names() {
    return data.value.graphs.map((g: any) => g.name)
}

// get graph index by name
function indexOf(name: string) {
    return names().indexOf(name)
}

function startEdit(name: string) {
    data.value.graphs[indexOf(name)]['renaming'] = true
}

function selectTarget(name: string) {
    var toggle = () => {
        var prevTarget = data.value.target;
        network_store._select(name);
        name = prevTarget;
    };
    var command = {
        type: 'push-and-execute',
        argument: {
            exec: toggle,
            undo: toggle,
            name: () => 'Change active network',
        },
    }
    history_store.execute(command)
}

function clicked(name: string) {
    if (data.value.target === name) {
        startEdit(name);
    } else {
        selectTarget(name);
    }
}

function keydown(e: any){
    switch (e.keyCode) {
        case 27:
        case 13:
            e.target.blur();
            break;
        default:
            break;
    }
}

function lostEditFocus(e: any, name: any) {
    var graph = data.value.graphs[indexOf(name)]
    delete graph['renaming']
    renameTarget(graph, e.target.value.replace(/[^\x20-\x7E]+/g, ''));
}

function renameTarget(graph: any, name: any) {
    if (name && names().every((v: any) => v !== name)) {
        var original = data.value.target;
        var command = {
            type: 'push-and-execute',
            argument: {
                exec: () => {
                    graph['name'] = name
                    data.value.target = name
                },
                undo: () => {
                    graph['name'] = original
                    data.value.target = original
                },
                name: () => 'Change network name',
            },
        }
        history_store.execute(command)
    }
}

function clickedDelete(name: any) {
    var info: any
    var prevTarget: any
    var command = {
        type: 'push-and-execute',
        argument: {
            exec: () => {
                info = network_store._delete(name);
                prevTarget = data.value.target.target;
                network_store._select(info['next-target']);
                editor_store.configuration = utils_store.serialize_configuration()
            },
            undo: () => {
                var graphs = data.value.graphs;
                graphs.splice(info.index, 0, info.deleted);
                network_store._select(prevTarget);
                editor_store.configuration = utils_store.serialize_configuration()
            },
            name: () => 'Delete network',
        },
    }
    history_store.execute(command)
}

// custom directive for form/input; refered as v-focus.
const vFocus = {
    mounted: (el: any) => {
        el.focus();
        el.select();
    }
}

</script>
<template>
    <div class="graphs-tab nnc-invoker" @click="clicked(graph.name);">
        <div v-if="graph.renaming">
            <input
                class="tab-rename-input-area"
                type="text"
                size="18"
                maxlength="255"
                v-focus
                v-bind:value="graph.name"
                @keydown="keydown"
                @blur="lostEditFocus($event, graph.name);" />
        </div>
        <span v-else class="graph-name-area">
            <span class="graph-name">{{ graph.name }}</span>
            <span>
                <span class="delete-mark" @click.stop.prevent="clickedDelete(graph.name);">
                    <img class="graph-remove-img" src="@/assets/image/Remove.svg"/>
                </span>
            </span>
        </span>
    </div>
</template>