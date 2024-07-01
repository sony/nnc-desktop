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
import { useDefinitionsStore } from '@/stores/misc/definitions'
import { useUtilsStore } from '@/stores/utils'
import { useNNABLACoreDefStore } from '@/stores/nnabla_core_def'
import { computed } from 'vue';
const definitions_store = useDefinitionsStore()
const utils_store = useUtilsStore()
const nnabla_core_def_store = useNNABLACoreDefStore()
const props = defineProps<{
    layer: any, 
    positions: any, 
}>()

const inputSideConnectors = computed(() => {
    const type = props.layer.type;
    const component = nnabla_core_def_store.nnablaCore.layers.components.find((component: any) => component.name == type);
    const filteredInputSideConnector = JSON.parse(JSON.stringify(component)).inputSideConnector.filter((inputSideConnector: any) => {
        // WithBiasがFalseの場合、bのサイドコネクターを表示しない
        if (props.layer.properties && (props.layer.properties.WithBias === 'False' || props.layer.properties.WithBias === false)) {
            if (inputSideConnector.name === 'b') {
                return false;
            }
        }
        return true;
    });

    try {
        return filteredInputSideConnector.map((connector: any) => {
            connector.name = connector.shortName || connector.name.substring(0, 1);
            return connector;
        });
    } catch (e) {
        return [];
    }
})

const labelOffset = computed(() => {
    return definitions_store.Definitions.EDIT.LAYER.CONNECTOR.SIDE.LABEL.OFFSET_Y;
})

const sideConnectionStyle = computed(() => {
    const LAYER = definitions_store.Definitions.EDIT.LAYER;
    const SIDE_CONNECTOR = LAYER.CONNECTOR.SIDE;
    return {
        r: SIDE_CONNECTOR.RADIUS,
        fill: SIDE_CONNECTOR.FILL_COLOR,
        style: `stroke-width: ${LAYER.CONNECTOR.STROKE_WIDTH}; opacity: ${SIDE_CONNECTOR.OPACITY};`
    }
})

const sideConnectionPositions = computed(() => {
    return props.positions.slice(0, inputSideConnectors.value.length).reverse();
})

</script>

<template>
    <g>
        <g v-for="(inputSideConnector, i) in inputSideConnectors">
            <circle :r="sideConnectionStyle.r" :fill="sideConnectionStyle.fill" :style="sideConnectionStyle.style" :cx="sideConnectionPositions[i].x" :cy="sideConnectionPositions[i].y"></circle>
            <text :x="sideConnectionPositions[i].x" :y="sideConnectionPositions[i].y + labelOffset" style="fill: white; font-size: 9px; font-weight: bold; text-anchor: middle; opacity: 0.75;">{{inputSideConnector.name}}</text>
        </g>
    </g>
</template>