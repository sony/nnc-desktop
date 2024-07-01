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
    completedLayer: any, 
    statistics: any, 
    activeStatistic: string, 
    targetIndex: number
}>()

const statisticLabel = computed(() => {
    if (!props.completedLayer) {
        return '';
    }
    return props.completedLayer.properties[props.activeStatistic];
})

const statisticBar = computed(() => {
    if (!props.completedLayer) {
        return 0;
    }
    return getStatisticsBar();
})

function getStatisticsBar() {
    const LAYER = definitions_store.Definitions.EDIT.LAYER;
    const product = (value: any) => (value || '0').split(',').map((x: any) => Number(x) || 0).reduce((a: any, b: any) => a * b, 1);
    const properties = props.completedLayer.properties;
    const value = product(properties[props.activeStatistic]);
    if (!value) {
        return '0';
    }
    const statistic = props.statistics[props.targetIndex].find((statistic: any) => statistic.name === props.activeStatistic);
    if (!statistic) {
        return '0';
    }
    return (value / statistic.max) * LAYER.STATISTICS.BAR.MAXWIDTH;
}

</script>

<template>
    <g>
        <text x="204" y="32">{{statisticLabel}}</text>
        <rect x="204" y="36" :width="statisticBar" height="4" style="fill: rgb(140, 140, 140); opacity: 1;"></rect>
    </g>
</template>