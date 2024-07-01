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
const definitions_store = useDefinitionsStore()
const utils_store = useUtilsStore()
const props = defineProps<{
    layer: any, 
    selected: any, 
    isEditTab: boolean, 
}>()

const rectInfo = computed(() => {
    const LAYER = definitions_store.Definitions.EDIT.LAYER;
    var component: any = utils_store.getComponent(props.layer.type);
    var fillColor = '#' + component.color.substring(2, 8);
    var color = props.selected ? LAYER.FRAME.FOCUSED.STROKE_COLOR : '#' + component.color.substring(2, 8);
    var cursor = props.isEditTab ? 'pointer' : 'auto';
    return {
        width: LAYER.RECT_WIDTH,
        height: LAYER.RECT_HEIGHT,
        style: `fill: ${fillColor}; stroke: ${color}; stroke-width: 2px; cursor: ${cursor}`
    }
})
</script>

<template>
    <rect :width="rectInfo.width" :height="rectInfo.height" :style="rectInfo.style" @click="$emit('click')" @dblclick="$emit('dblclick')" />
</template>