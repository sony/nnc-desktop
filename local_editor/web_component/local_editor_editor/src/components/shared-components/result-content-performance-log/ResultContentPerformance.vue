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
import { computed, ref, watch } from 'vue';
import {useDefinitionsStore} from '@/stores/misc/definitions'
import NncLoading from '@/components/shared-components/NncLoading.vue'
const definitions_store = useDefinitionsStore()
const props = defineProps<{
    loads: any, 
}>()

const totalLoads = ref<any>([])
const timeStamp = ref<number>(0)
const GPU_LOAD = 3
const CPU_LOAD = 1
const MAX_UTILIZATION_RATE = 100
const GRID_MARGIN = 1

watch(() => props.loads, (newValue, oldValue) => {
    const timestamp = parseInt(props.loads.timestamp, 10) * 1000;
    if (props.loads.values.length && timestamp > timeStamp.value) {
        timeStamp.value = timestamp;
        if (!props.loads.values[0][GPU_LOAD]) {
            totalLoads.value.push({
                x: timestamp,
                y: Math.min(props.loads.values[0][CPU_LOAD], MAX_UTILIZATION_RATE),
            });
            drawChart();
        } else {
            const sum = props.loads.values.map((value: any) => Math.min(value[GPU_LOAD], MAX_UTILIZATION_RATE)).reduce((previous: any, current: any) => previous + current);
            const average = sum / props.loads.values.length;
            totalLoads.value.push({
                x: timestamp,
                y: Math.min(average, MAX_UTILIZATION_RATE),
            });
            drawChart();
        }
    }
  }
)

const parsedLoads = computed(() => {
    const loads: any = [];
    if (!props.loads.values.length) {
        return loads;
    }
    else {
        props.loads.values.forEach((load: any, i: any) => {
            if (!load[GPU_LOAD]) {
                const value = Math.min(Number(load[CPU_LOAD]), MAX_UTILIZATION_RATE);
                loads.push(`CPU: ${value}%`);
            } else {
                const value = Math.min(Number(load[GPU_LOAD]), MAX_UTILIZATION_RATE);
                if (props.loads.values.length === 1) {
                    loads.push(`GPU: ${value}%`);
                } else {
                    loads.push(`GPU_${i}: ${value}%`);
                }
            }
        });
        return loads;
    }
})

const isLoading = computed(() => {
    return ['queued', 'preprocessing', ''].includes(props.loads.status);
})

function drawChart() {
    const ctx = document.getElementById('performance-graph');
    const DISPLAY_SEC = 60 * 1000;
    const PERFORMANCE_GRAPH = definitions_store.Definitions.TRAINING.PERFORMANCE_GRAPH;
    if (!ctx) {
        return;
    }
    new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'CPU',
                data: totalLoads.value.filter(() => true),
                backgroundColor: PERFORMANCE_GRAPH.BACKGROUND_COLOR,
                borderColor: PERFORMANCE_GRAPH.BORDER_COLOR,
                borderWidth: PERFORMANCE_GRAPH.BORDER_WIDTH,
                lineTension: PERFORMANCE_GRAPH.LINE_TENSION,
            }]
        },
        options: {
            legend: { display: false, },
            events: ['click'],
            animation: false,
            responsive: false,
            maintainAspectRatio: true,
            title: { display: false, },
            layout: {
                padding: PERFORMANCE_GRAPH.PADDING,
            },
            scales: {
                xAxes: [{
                    type: 'time',
                    time: {
                        unit: 'second',
                        min: timeStamp.value - DISPLAY_SEC,
                        max: timeStamp.value,
                        displayFormats: {
                            second: PERFORMANCE_GRAPH.DISPLAY_FORMATS
                        },
                    },
                    scaleLabel: { display: false, },
                    ticks: { display: false, }
                }],
                yAxes: [{
                    scaleLabel: { display: false, },
                    ticks: {
                        min: 0,
                        max: MAX_UTILIZATION_RATE + GRID_MARGIN,
                        fontColor: PERFORMANCE_GRAPH.FONT_COLOR,
                        fontSize: PERFORMANCE_GRAPH.FONT_SIZE,
                        fontFamily: 'Arial',
                        autoSkip: true,
                        autoSkipPadding: true,
                        maxTicksLimit: PERFORMANCE_GRAPH.MAX_TICKS_LIMIT,
                        padding: PERFORMANCE_GRAPH.PADDING,
                        callback: function(value: any) {
                            if (value % 10 === 0) {
                                return value;
                            } else {
                                return '';
                            }
                        }
                    }
                }]
            }
        }
    });
}

</script>
<template>
<div class="log-area performance">
    <div v-if="isLoading">
        <NncLoading />
    </div>
    <template v-else>
        <div class="performance-graph-area">
            <canvas id="performance-graph" />
        </div>
        <div class="performance-details">
            <div v-if="parsedLoads.length">
                <div>Utilization rate</div>
                <div v-for="load in parsedLoads">{{load}}</div>
            </div>
        </div>
    </template>
</div>
</template>