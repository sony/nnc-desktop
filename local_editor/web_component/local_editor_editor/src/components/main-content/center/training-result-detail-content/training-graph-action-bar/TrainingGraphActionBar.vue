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
import { computed, nextTick, reactive, ref } from 'vue';
import { storeToRefs } from 'pinia';
import {useResultStore} from '@/stores/result'
import {useEditorStore} from '@/stores/editor'
import {useTradeOffGraphStore} from '@/stores/training_graph/trade_off_graph'
import {useBaseGraphStore} from '@/stores/training_graph/base_graph'
import {useLanguageStore} from '@/stores/misc/languages'
import NncRadio from '@/components/shared-components/NncRadio.vue'
import NNCZoomBox from '@/components/shared-components/nnc-zoom-box/NNCZoomBox.vue'
const languages_store = useLanguageStore()
const language = reactive(languages_store.language)
const result_store = useResultStore()
const editor_store = useEditorStore()
const trade_off_graph_store = useTradeOffGraphStore()
const base_graph_store = useBaseGraphStore()
const props = defineProps<{
    currentGraph: any, 
}>()
const {
    graph
} = storeToRefs(result_store)
const trade_off_types = ref([
    "All",
    "Previous",
    "Pareto Only"
])

function changeTradeOffType() {
    trade_off_graph_store.tradeOff();
}

function onGraphScaleChanged(value: any) {
    graph.value.scale = value;
    base_graph_store.reloadChart()
}

function graphTypeChanged(type: any) {
    nextTick(() => {
        base_graph_store.disposeChart()
        base_graph_store.reloadChart()
    });
}

</script>
<template>
    <div class="action-bar">
        <span class="action-bar-graph-type">
            <NncRadio v-model="graph.type" choice="Learning Curve" @changed="(choice) => graphTypeChanged(choice)" :label="language.training.LEARNING_CURVE" :disabled="false"/>
            <NncRadio v-model="graph.type" choice="Trade-off Graph" @changed="(choice) => graphTypeChanged(choice)" :label="language.training.TRADE_OFF_GRAPH" :disabled="false"/>
        </span>
        <label class="select_label">
            <select class="select_menu" v-model="graph.trade_off_type" @change="changeTradeOffType">
                <option v-for="option in trade_off_types" v-bind:value="option">
                    {{ option }}
                </option>
            </select>
        </label>
        <span class="action-bar-graph-scale">
            <NncRadio :modelValue="graph.scale" @update:modelValue="onGraphScaleChanged" choice="linear" :label="language.training.LINEAR_SCALE" :disabled="false"/>
            <NncRadio :modelValue="graph.scale" @update:modelValue="onGraphScaleChanged" choice="log"    :label="language.training.LOG_SCALE" :disabled="false"/>
        </span>
        <div class="pull-right">
            <NNCZoomBox class="training-zoom-box" :percentages="currentGraph.percentages" :percentage="currentGraph.percentage" @zoom-value="value => $emit('zoom-value', value)" />
        </div>
    </div>
</template>