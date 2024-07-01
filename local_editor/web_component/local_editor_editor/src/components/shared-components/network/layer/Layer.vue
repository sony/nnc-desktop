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
import { useUtilsStore } from '@/stores/utils'
import { computed } from 'vue';
import MainImage from './MainImage.vue'
import Circles from './circles/Circles.vue'
import ClipPath from './ClipPath.vue'
import Statistic from './Statistic.vue'
const definitions_store = useDefinitionsStore()
const nnabla_core_def_store = useNNABLACoreDefStore()
const utils_store = useUtilsStore()
const props = defineProps<{
    layer: any, 
    links: any, 
    completedLayer: any, 
    statistics: any, 
    sideConnectorPositions: any, 
    selected: any, 
    activeStatistic: any, 
    targetIndex: number, 
    isEditTab: boolean, 
    graphLayer: any
}>()

const repeatCount = computed(() => {
    if (props.completedLayer && props.completedLayer.repeatTimes) {
        return 'x' + props.completedLayer.repeatTimes;
    }
    return '';
})

const repeatInfo = computed(() => {
    const LAYER = definitions_store.Definitions.EDIT.LAYER;
    return {
        fill: LAYER.REPEAT.FONTCOLOR,
        fontSize: LAYER.REPEAT.FONTSIZE,
        x: LAYER.REPEAT.OFFSET_X,
        y: LAYER.REPEAT.OFFSET_Y
    }
})

const orderList = computed(() => {
    if (props.graphLayer) {
        // 検知の為に使用
        props.layer;
        return props.graphLayer._orderList || [];
    } else {
        const appendList: any = [];
        const destLinks = props.links.filter((link: any) => link.from_node === props.layer.name);
        destLinks.forEach((destLink: any) => {
            const targetLinks = props.links.filter((link: any) => link.to_node === destLink.to_node);
            if (targetLinks.length > 1) {
                // indexと表示用でずれる為1を足す
                appendList.push(targetLinks.findIndex((link: any) => link.from_node === props.layer.name) + 1);
            }
        });
        return appendList;
    }
})

const orderInfo = computed(() => {
    const LAYER = definitions_store.Definitions.EDIT.LAYER;
    return {
        fill: LAYER.ORDER.FONTCOLOR,
        fontSize: LAYER.ORDER.FONTSIZE,
        x: LAYER.ORDER.OFFSET_X,
        y: LAYER.ORDER.OFFSET_Y
    }
})

const layerTransform = computed(() => {
    return 'translate(' + props.layer.x + ',' + props.layer.y + ')';
})

const isCommentLayer = computed(() => {
    return props.layer.type === 'Comment';
})

const commentLayerInfo = computed(() => {
    const LAYER = definitions_store.Definitions.EDIT.LAYER;
    const component: any = utils_store.getComponent(props.layer.type);
    const color = props.selected ? LAYER.FRAME.FOCUSED.STROKE_COLOR : '#' + component.color.substring(2, 8);
    var cursor = props.isEditTab ? 'pointer' : 'auto';
    return {
        width: LAYER.RECT_WIDTH,
        height: LAYER.RECT_HEIGHT,
        style: `fill: ${LAYER.COMMENT.FILL_COLOR}; stroke: ${color}; stroke-width: 2px; cursor: ${cursor}`,
        text: props.layer.properties.Comment || '',
        textStyle: `font-size: ${LAYER.COMMENT.FONT_SIZE}; overflow-wrap: break-word; overflow: hidden; cursor: default: width: 100%; height: 100%;`
    }
})

const isUnitLayer = computed(() => {
    return props.layer.type === 'Unit';
})

const unitDropcap = computed(() => {
    const UNIT = definitions_store.Definitions.EDIT.LAYER.UNIT;
    return {
        x: UNIT.OFFSET_X,
        y: UNIT.OFFSET_Y,
        width: UNIT.WIDTH,
        height: UNIT.HEIGHT,
        image: UNIT.IMAGE_SOURCE
    }
})

const dropcap = computed(() => {
    const DROPCAP_CHAR = definitions_store.Definitions.EDIT.LAYER.DROPCAP_CHAR;
    return {
        x: DROPCAP_CHAR.OFFSET_X,
        y: DROPCAP_CHAR.OFFSET_Y,
        style: `fill: ${DROPCAP_CHAR.FONTCOLOR}; font-size: ${DROPCAP_CHAR.FONTSIZE}; pointer-events: none; text-anchor: middle;`,
        text: props.layer.type.substr(0, 1).toUpperCase()
    }
})


</script>

<template>
    <g :transform="layerTransform">
        <g v-if="isCommentLayer">
            <rect :width="commentLayerInfo.width" :height="commentLayerInfo.height" :style="commentLayerInfo.style"></rect>
            <foreignObject :width="commentLayerInfo.width" :height="commentLayerInfo.height">
                <div :style="commentLayerInfo.textStyle" @click="() => $emit('layerClick', layer)">{{commentLayerInfo.text}}</div>
            </foreignObject>
        </g>
        <g v-else>
            <MainImage :layer="layer" :selected="selected" :is-edit-tab="isEditTab" @click="() => $emit('layerClick', layer)" @dblclick="() => $emit('layerDoubleClick', layer)" />
            <image v-if="isUnitLayer" :href="unitDropcap.image" :x="unitDropcap.x" :y="unitDropcap.y" :width="unitDropcap.width" :height="unitDropcap.height" />
            <text v-else :x="dropcap.x" :y="dropcap.y" :style="dropcap.style">{{dropcap.text}}</text>
            <Circles :layer="layer" :positions="sideConnectorPositions" />
            <ClipPath :layer="layer" :links="links" :completedLayer="completedLayer" :graphLayer="graphLayer" />
            <Statistic :layer=layer :completed-layer="completedLayer" :statistics="statistics" :activeStatistic="activeStatistic" :target-index="targetIndex" />
            <g v-if="orderList.length">
                <text v-for="order in orderList" :x="orderInfo.x" :y="orderInfo.y" :fill="orderInfo.fill" :font-size="orderInfo.fontSize">{{order}}</text>
            </g>
            <g v-if="repeatCount">
                <text :x="repeatInfo.x" :y="repeatInfo.y" :fill="repeatInfo.fill" :font-size="repeatInfo.fontSize">{{repeatCount}}</text>
            </g>
        </g>
    </g>
</template>