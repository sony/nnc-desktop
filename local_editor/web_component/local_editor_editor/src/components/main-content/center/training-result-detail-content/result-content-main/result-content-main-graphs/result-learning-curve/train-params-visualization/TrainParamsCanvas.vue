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
import { computed, nextTick, onMounted, onUpdated, reactive, ref, watch } from 'vue';
import {useLanguageStore} from '@/stores/misc/languages'
import {useDefinitionsStore} from '@/stores/misc/definitions'
const languages_store = useLanguageStore()
const definitions_store = useDefinitionsStore()
const props = defineProps<{
    param: any, 
    gainValue: number, 
    type: string, 
    maxValue: number, 
    zoom: number
}>()

const el = ref()

const width = computed(() => {
    return Math.min(props.param[0].length, definitions_store.Definitions.TRAINING.VISUALIZATION.MAX_WEIGHT) * size.value * props.zoom;
})

const height = computed(() => {
    return Math.min(props.param.length, definitions_store.Definitions.TRAINING.VISUALIZATION.MAX_WEIGHT) * size.value * props.zoom;
})

const size = computed(() => {
    return definitions_store.Definitions.TRAINING.VISUALIZATION.POINT_SIZE;
})

onMounted(() => {
    drawImage()
})

onUpdated(() => {
    drawImage()
})

watch(() => props.zoom, (newValue, oldValue) => {
    el.value.width = props.param[0].length * size.value * props.zoom;
    el.value.height = props.param.length * size.value * props.zoom;
    drawImage()
  }
)

watch(() => props.type, (newValue, oldValue) => {
    drawImage()
  }
)

watch(() => props.gainValue, (newValue, oldValue) => {
    if (props.type === 'Normalize') {
        return;
    }
    drawImage()
  }
)

function getColor(value: any) {
    var color = Math.min(255 - (255 * Math.abs(value)), 255);
    if (value > 0) {
        return `rgb(255, ${color}, ${color})`;
    } else {
        return `rgb(${color}, ${color}, 255)`;
    }
}

function drawImage() {
    let context = el.value.getContext('2d');
    context.clearRect(0, 0, context.canvas.clientWidth, context.canvas.clientHeight);
    context.scale(props.zoom, props.zoom);
    const slicedParam = props.param.slice(0, definitions_store.Definitions.TRAINING.VISUALIZATION.MAX_WEIGHT);
    slicedParam.forEach((row: any, i: any) => {
        const slicedRow = row.slice(0, definitions_store.Definitions.TRAINING.VISUALIZATION.MAX_WEIGHT);
        slicedRow.forEach((cell: any, j: any) => {
            if (props.type === 'Normalize') {
                cell = cell / props.maxValue;
            } else {
                cell = cell * props.gainValue;
            }
            context.fillStyle = getColor(cell);
            context.fillRect(j * size.value, i * size.value, size.value, size.value);
        });
    });
    context.scale(1/ props.zoom, 1 / props.zoom);
}

</script>
<template>
    <canvas ref="el" :width="width" :height="height" />
</template>