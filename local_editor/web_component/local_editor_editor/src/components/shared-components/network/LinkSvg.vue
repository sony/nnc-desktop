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
import { useNNABLACoreDefStore } from '@/stores/nnabla_core_def'
import { computed } from 'vue';
const definitions_store = useDefinitionsStore()
const nnabla_core_def_store = useNNABLACoreDefStore()
const props = defineProps<{
    link: any, 
    nodes: any,
    positions: any,
}>()

const style = computed(() => {
    const LINK = definitions_store.Definitions.EDIT.LINK;
    return `stroke-width: ${LINK.DEFAULT.STROKE_WIDTH}; stroke: ${LINK.STROKE_COLOR}; fill: none;`
})

function existNodes(link: any) {
    const from = link.from_node;
    const to = link.to_node;
    return props.nodes.findIndex((node: any) => node.name === from) !== -1 && props.nodes.findIndex((node: any) => node.name === to) !== -1;
}

function d(link: any) {
    const LAYER = definitions_store.Definitions.EDIT.LAYER;
    const from_node = props.nodes.find((node: any) => node.name === link.from_node);
    const to_node = props.nodes.find((node: any) => node.name === link.to_node);
    const from_position = {
        x: from_node.x + (LAYER.RECT_WIDTH / 2),
        y: from_node.y + LAYER.RECT_HEIGHT
    };
    let to_position = {
        x: to_node.x + (LAYER.RECT_WIDTH / 2),
        y: to_node.y
    };
    if (link.to_name) {
        let inputSideConnectorFinder: any = nnabla_core_def_store.nnablaCore.layers.components.find((component: any) => component.name == to_node.type)
        const inputSideConnector = inputSideConnectorFinder.inputSideConnector;
        const order = inputSideConnector.findIndex((inputSideConnector: any) => inputSideConnector.name === link.to_name);
        to_position = {
            x: to_node.x + props.positions.slice(0, inputSideConnector.length).reverse()[order].x,
            y: to_node.y + props.positions.slice(0, inputSideConnector.length).reverse()[order].y
        }
    }
    if (from_position.y <= to_position.y) {
        return 'M ' + from_position.x + ',' + from_position.y +
                ' L ' + to_position.x + ',' + to_position.y;
    } else {
        var GRID = definitions_store.Definitions.EDIT.GRID.SIZE;
        var RAD = GRID / 2;
        // 接続先のノードの位置 + ノードの幅 + statisticの領域
        var targetRight = to_node.x + LAYER.RECT_WIDTH + LAYER.STATISTICS.BAR.MAXWIDTH;
        return 'M ' + from_position.x + ',' + from_position.y +
                ' v ' + GRID +
                ' a ' + (RAD) + ',' + (RAD) + ' 0 0,0 ' + ( RAD) + ',' + ( RAD) +
                ' H ' + Math.max(from_position.x + GRID * 7.5, to_position.x + GRID * 2.5, targetRight) +
                ' a ' + (RAD) + ',' + (RAD) + ' 0 0,0 ' + ( RAD) + ',' + (-RAD) +
                ' V ' + (to_position.y - GRID) +
                ' a ' + (RAD) + ',' + (RAD) + ' 0 0,0 ' + (-RAD) + ',' + (-RAD) +
                ' H ' + (to_position.x + RAD)+
                ' a ' + (RAD) + ',' + (RAD) + ' 0 0,0 ' + (-RAD) + ',' + ( RAD) +
                ' V ' + to_position.y;
    }
}

</script>

<template>
    <path v-if="existNodes(link)" :d="d(link)" :style="style"></path>
</template>