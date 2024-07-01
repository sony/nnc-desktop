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
import { computed } from 'vue';
import { useDefinitionsStore } from '@/stores/misc/definitions'
import { useGraphStore } from '@/stores/graph'
import { useNNABLACoreDefStore } from '@/stores/nnabla_core_def'
import LinkSvg from './LinkSvg.vue'
import Layer from './layer/Layer.vue'
const props = defineProps<{
    configuration: any, 
    completedConfiguration: any,
    targetIndex: number,
    selection: any,
    activeStatisticName: any,
    isEditTab: boolean,
    isOverview: boolean
}>()
const definitions_store = useDefinitionsStore()
const nnabla_core_def_store = useNNABLACoreDefStore()
const graph_store = useGraphStore()

const nodes = computed(() => {
    if (props.configuration.networks && props.configuration.networks[props.targetIndex]) {
        return props.configuration.networks[props.targetIndex].nodes;
    }
    return [];
})

const links = computed(() => {
    if (props.configuration.networks && props.configuration.networks[props.targetIndex]) {
        return props.configuration.networks[props.targetIndex].links;
    }
    return [];
})

const sideConnectorPositions = computed(() => {
    const LAYER = definitions_store.Definitions.EDIT.LAYER
    var MARGIN_X = LAYER.CONNECTOR.SIDE.MARGIN_X;
    var MARGIN_Y = LAYER.CONNECTOR.SIDE.MARGIN_Y;
    var START_OFFSET_X = LAYER.CONNECTOR.SIDE.START_OFFSET_X;
    var START_OFFSET_Y = LAYER.CONNECTOR.SIDE.START_OFFSET_Y;
    var maxConnectors = Math.max.apply(null, nnabla_core_def_store.nnablaCore.layers.components.map((comp: any) => comp.inputSideConnector.length));
    var x = (() => { var x = START_OFFSET_X, _; return () => ([x, _] = [x - MARGIN_X, x])[1]; })();
    var y = (() => { var y = START_OFFSET_Y, _ = y - MARGIN_Y; return () => ([y, _] = [_, y])[1]; })();
    return Array(maxConnectors).fill(null).map(_ => { return { x: x(), y: y(), }; });
})

const completedNodes = computed(() => {
    if (!props.completedConfiguration.networks || !props.completedConfiguration.networks[props.targetIndex] || !props.completedConfiguration.networks[props.targetIndex].nodes) {
        return [];
    }
    return props.completedConfiguration.networks[props.targetIndex].nodes;
})

function selectedLayer(layer: any) {
    if (props.isEditTab) { // フォーカスが当たるのはEditタブのみ
        return props.selection.all.indexOf(layer.name) !== -1;
    } else {
        return false;
    }
}

function getCompletedNode(i: any) {
    try {
        return props.completedConfiguration.networks[props.targetIndex].nodes[i];
    } catch (e) {
        return;
    }
}

function getGraphLayer(node: any) {
    if (!props.isOverview) {
        return;
    }
    return graph_store.getLayers().find((layer: any) => layer.name() === node.name);
}

</script>

<template>
    <g>
        <Layer
            v-for="(node, i) in nodes"
            :key="'layer' + i"
            :layer="node"
            :graphLayer="getGraphLayer(node)"
            :links="links"
            :completed-layer="getCompletedNode(i)"
            :statistics="completedConfiguration.statistics"
            :active-statistic="activeStatisticName"
            :side-connector-positions="sideConnectorPositions"
            :selected="selectedLayer(node)"
            :target-index="targetIndex"
            :is-edit-tab="isEditTab"
            @layerClick="(layer: any) => $emit('layerClick', layer)"
            @layerDoubleClick="(layer: any) => $emit('layerDoubleClick', layer)"
        />
        <LinkSvg
            v-for="link in links"
            :link="link" :nodes="nodes" :positions="sideConnectorPositions"
        />
    </g>
</template>