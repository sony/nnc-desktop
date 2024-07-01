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
import { computed } from 'vue';
import SideConnectors from './SideConnectors.vue'
const definitions_store = useDefinitionsStore()
const utils_store = useUtilsStore()
const props = defineProps<{
    layer: any, 
    positions: any, 
}>()

const topCircleInfo = computed(() => {
    const LAYER = definitions_store.Definitions.EDIT.LAYER;
    var component: any = utils_store.getComponent(props.layer.type);
    return {
        show: component.input != 0,
        r: LAYER.CONNECTOR.RADIUS,
        fill: LAYER.CONNECTOR.STROKE_COLOR,
        cx: LAYER.RECT_WIDTH / 2,
        cy: 0
    }
})

const bottomCircleInfo = computed(() => {
    const LAYER = definitions_store.Definitions.EDIT.LAYER;
    var component: any = utils_store.getComponent(props.layer.type);
    return {
        show: component.output != 0,
        r: LAYER.CONNECTOR.RADIUS,
        fill: LAYER.CONNECTOR.STROKE_COLOR,
        cx: LAYER.RECT_WIDTH / 2,
        cy: LAYER.RECT_HEIGHT
    }
})

</script>

<template>
    <g>
        <circle v-if="topCircleInfo.show" :r="topCircleInfo.r" :fill="topCircleInfo.fill" :cx="topCircleInfo.cx" :cy="topCircleInfo.cy" />
        <circle v-if="bottomCircleInfo.show" :r="bottomCircleInfo.r" :fill="bottomCircleInfo.fill" :cx="bottomCircleInfo.cx" :cy="bottomCircleInfo.cy" />
        <SideConnectors :layer="layer" :positions="positions" />
    </g>
</template>