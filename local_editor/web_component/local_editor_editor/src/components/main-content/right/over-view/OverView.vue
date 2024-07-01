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
// import $ from "jquery";
import { ref, reactive, onMounted, computed, nextTick, isProxy, toRaw } from 'vue'
import Network from '@/components/shared-components/network/Network.vue'
import { useLanguageStore } from '@/stores/misc/languages'
import { useResultStore } from '@/stores/result'
import { useNetworkStore } from '@/stores/network'
import { useEditorStore } from '@/stores/editor'
import { useSelectionStore } from '@/stores/selection'
import { useGraphStore } from '@/stores/graph'
import { useDefinitionsStore } from '@/stores/misc/definitions'
const network_store = useNetworkStore()
const editor_store = useEditorStore()
const graph_store = useGraphStore()
const result_store = useResultStore()
const selection_store = useSelectionStore()
const definitions_store = useDefinitionsStore()
const language_store = useLanguageStore()
const language = reactive(language_store.language)
const props = defineProps<{
    configuration: any, 
    isEditTab: boolean,
    targetIndex: number,
    width: number,
    completedConfiguration: any,
    selection: any,
    activeStatisticName: any,
    isTrainingTab: boolean
}>()

const networkList = computed(() => {
    if (!props.configuration || !props.configuration.networks) {
        return [];
    }
    return props.configuration.networks.map((network: any) => network.name);
}) 

const targetName = computed(() => {
    if (!networkList.value.length) {
        return '';
    }
    return networkList.value[props.targetIndex];
}) 

const showRect = computed(() => {
    if (!props.isEditTab) {
        return false;
    }
    var $networkEditorScroller: any = $('.network-editor-scroller');
    return $networkEditorScroller.width() < viewBoxObj.value.originX || $networkEditorScroller.height() < viewBoxObj.value.originY;
})

const rectX = computed(() => {
    let vb = viewBoxObj.value
    var svgHeight = vb.originY;
    var svgWidth = vb.originX;
    var svgRatio = svgHeight / svgWidth;
    
    var overviewSvgWidth = props.width;
    var overviewSvgHeight = 280;
    var overviewSvgRatio = overviewSvgWidth / overviewSvgHeight;
    
    var $networkEditorScroller = $('.network-editor-scroller');
    var scrollLeft: any = $networkEditorScroller.scrollLeft();
    
    if (vb.rate === vb.rateY) {
        return vb.x * (scrollLeft / svgWidth) * (svgRatio / overviewSvgRatio);
    } else {
        return vb.x * (scrollLeft / svgWidth);
    }
}) 

const rectWidth = computed(() => {
    let vb = viewBoxObj.value
    var svgHeight = vb.originY;
    var svgWidth = vb.originX;
    var svgRatio = svgWidth / svgHeight;

    var overviewSvgWidth = props.width;
    var overviewSvgHeight = 280;
    var overviewSvgRatio = overviewSvgHeight / overviewSvgWidth;

    var $networkEditorScroller = $('.network-editor-scroller');
    var scrollerWidth: any = $networkEditorScroller.width();

    if (vb.rate === vb.rateY) {
        return vb.x * (scrollerWidth / svgWidth) * (svgRatio * overviewSvgRatio);
    } else {
        return vb.x * (scrollerWidth / svgWidth);
    }
})

const rectY = computed(() => {
    let vb = viewBoxObj.value
    var svgHeight = vb.originY;
    var svgWidth = vb.originX;
    var svgRatio = svgHeight / svgWidth;

    var overviewSvgWidth = props.width;
    var overviewSvgHeight = 280;
    var overviewSvgRatio = overviewSvgWidth / overviewSvgHeight;

    var $networkEditorScroller = $('.network-editor-scroller');
    var scrollTop: any = $networkEditorScroller.scrollTop();
    if (vb.rate === vb.rateX) {
        return vb.y * (scrollTop / svgHeight) * (svgRatio / overviewSvgRatio);
    } else {
        return vb.y * (scrollTop / svgHeight);
    }
})

const rectHeight = computed(() => {
    let vb = viewBoxObj.value
    var svgHeight = vb.originY;
    var svgWidth = vb.originX;
    var svgRatio = svgHeight / svgWidth;

    var overviewSvgWidth = props.width;
    var overviewSvgHeight = 280;
    var overviewSvgRatio = overviewSvgWidth / overviewSvgHeight;

    var $networkEditorScroller = $('.network-editor-scroller');
    var scrollerHeight: any = $networkEditorScroller.height();

    if (vb.rate === vb.rateX) {
        return vb.y * (scrollerHeight / svgHeight) * (svgRatio * overviewSvgRatio);
    } else {
        return vb.y * (scrollerHeight / svgHeight);
    }
})

const viewBox = computed(() => {
    return `0 0 ${viewBoxObj.value.x} ${viewBoxObj.value.y}`;
})

const viewBoxObj = computed<any>(() => {
    // 変更を検知する為の記述(この値自体は検知するだけにあり、特に使用はしない)
    editor_store.updateDetection;
    if (!editor_store.configuration.networks || !editor_store.configuration.networks[props.targetIndex]) {
        return {
            x: 280,
            y: 280
        }
    }
    const nodes = editor_store.configuration.networks[props.targetIndex].nodes
    if (!nodes.length) {
        return {
            x: 280,
            y: 280
        }
    }
    // 画面の最下部がレイヤーではなくリンクのことがある。つながるレイヤーが最下部のレイヤーより上にあった場合。その際のリンクの高さ分。
    const LAYER = definitions_store.Definitions.EDIT.LAYER
    const LINK_CURVE_HEIGHT = 20;
    const paddingRight = 80;
    const paddingTop = 20;
    const xArray = nodes.map((node: any) => node.x);
    const yArray = nodes.map((node: any) => node.y);
    const maxX = Math.max.apply(null, xArray);
    const maxY = Math.max.apply(null, yArray) + LINK_CURVE_HEIGHT;
    const x = Math.max(maxX, 0) + LAYER.RECT_WIDTH + LAYER.STATISTICS.BAR.MAXWIDTH + paddingRight;
    const y = Math.max(maxY, 0) + LAYER.RECT_HEIGHT + paddingTop;
    const svgWidth = props.width;
    const svgHeight = 280;
    const percentage = editor_store.zoomInfo.networkGraph.percentage / 100;
    if (x <= svgWidth && y <= svgHeight) {
        return {
            x: svgWidth,
            y: svgHeight,
            originX: x * percentage,
            originY: y * percentage
        }
    }

    const rateX = x / svgWidth;
    const rateY = y / svgHeight;

    let rate;

    let viewBox_X = svgWidth;
    let viewBox_Y = svgHeight;
    if (x > svgWidth && y <= svgHeight) {
        viewBox_X = svgWidth * rateX;
        viewBox_Y = svgHeight * rateX;
        rate = rateX;
    } else if (y > svgHeight && x <= svgWidth) {
        viewBox_Y = svgHeight * rateY;
        viewBox_X = svgWidth * rateY;
        rate = rateY;
    } else {
        viewBox_Y = svgHeight * Math.max(rateX, rateY);
        viewBox_X = svgWidth * Math.max(rateX, rateY);
        rate = Math.max(rateX, rateY);
    }
    return {
        x: viewBox_X,
        y: viewBox_Y,
        rateX: rateX,
        rateY: rateY,
        rate: rate,
        originX: x * percentage,
        originY: y * percentage
    }
})


function changeNetwork(e: any) {
    if (props.isEditTab) {
        network_store.Graphs.select(e.target.value);
    } else {
        editor_store.jobGraphIndex = networkList.value.indexOf(e.target.value);
    }
}

function onLayerDoubleClick(layer: any) {
    if (!props.isTrainingTab) { // TRAININGタブのみ有効
        return;
    }
    var request = '';
    switch (layer.type) {
        case 'Affine':
            request = `${layer.name}~affine~W.txt`;
            break;

        case 'Convolution':
            request = `${layer.name}~conv~W.txt`;
            break;

        case 'DepthwiseConvolution':
            request = `${layer.name}~depthwise_conv~W.txt`;
            break;

        case 'Deconvolution':
            request = `${layer.name}~deconv~W.txt`;
            break;

        case 'DepthwiseDeconvolution':
            request = `${layer.name}~depthwise_deconv~W.txt`;
            break;

        case 'Embed':
            request = `${layer.name}~embed~W.txt`;
            break;

        case 'Parameter':
            request = 'Parameter.txt';
            break;

        default:
            return;

    }
    // result_store.graph.type = '';
    nextTick(() => {
        result_store.selectedLayer = {
            name: layer.name,
            type: layer.type,
            request: request
        };
        result_store.graph.type = 'TrainParamsVisualization';
    });
}

function onLayerClick(layer: any) {
    if (!props.isEditTab) {
        return;
    }
    const percentage = editor_store.zoomInfo.networkGraph.percentage / 100;
    const $networkEditorScroller: any = $('.network-editor-scroller');
    const scrollerHeight = $networkEditorScroller.height() / percentage;
    const scrollerWidth = $networkEditorScroller.width() / percentage;
    const scrollerLeft = $networkEditorScroller[0].scrollLeft / percentage;
    const scrollerTop = $networkEditorScroller[0].scrollTop / percentage;

    const layerLeft = layer.x;
    const layerTop = layer.y;
    const LAYER = definitions_store.Definitions.EDIT.LAYER
    const layerRight = layerLeft + LAYER.RECT_WIDTH + LAYER.STATISTICS.BAR.MAXWIDTH;
    const layerBottom = layerTop + LAYER.RECT_HEIGHT;

    let scrollLeft = $networkEditorScroller[0].scrollLeft;
    let scrollTop = $networkEditorScroller[0].scrollTop;

    // スクロールによって隠れてしまう箇所があるので、その分を余分に取っておく。
    const MARGIN = 16;
    if (scrollerLeft <= layerLeft && layerRight > scrollerLeft + scrollerWidth) {
        const leftDiff = layerRight - (scrollerLeft + scrollerWidth);
        scrollLeft += (leftDiff * percentage) + MARGIN;
    } else if (scrollerLeft > layerLeft && layerRight <= scrollerLeft + scrollerWidth) {
        const leftDiff = scrollerLeft - layerLeft;
        scrollLeft -= (leftDiff * percentage) + MARGIN;
    }

    if (scrollerTop <= layerTop && layerBottom > scrollerTop + scrollerHeight) {
        const topDiff = layerBottom - (scrollerTop + scrollerHeight);
        scrollTop += (topDiff * percentage) + MARGIN;
    } else if (scrollerTop > layerTop && layerBottom <= scrollerTop + scrollerHeight) {
        const topDiff = scrollerTop - layerTop;
        scrollTop -= (topDiff * percentage) + MARGIN;
    }

    const ANIMATION_TIME = 500;

    $networkEditorScroller.animate({
        scrollTop: scrollTop,
        scrollLeft: scrollLeft
    }, ANIMATION_TIME);

    selection_store.clear();
    const targetLayer = graph_store.getLayers().find((graphLayer: any) => graphLayer.name() === layer.name);
    selection_store.layer.focus(targetLayer);
    selection_store.change([targetLayer]);

}

</script>

<template>
    <div id="overview-area">
        <div class="title">
            <span>{{language.controller.OVERVIEW}}</span>
            <label class="select_label" v-if="networkList.length">
                <select class="select_menu" @change="changeNetwork" :value="targetName">
                    <option v-for="(name, i) in networkList" :key="'option' + i" :value="name">{{name}}</option>
                </select>
            </label>
        </div>
        <svg id="network-editor-overview" :viewBox="viewBox">
            <rect v-if="showRect" :x="rectX" :y="rectY" :width="rectWidth" :height="rectHeight" style="fill: rgba(0, 102, 153, 0.1);" />
            <Network
                :configuration="configuration"
                :completed-configuration="completedConfiguration"
                :target-index="targetIndex"
                :selection="selection"
                :active-statistic-name="activeStatisticName"
                :is-edit-tab="isEditTab"
                :isOverview="true"
                @layerClick="onLayerClick"
                @layerDoubleClick="onLayerDoubleClick"
            />
        </svg>
    </div>
</template>