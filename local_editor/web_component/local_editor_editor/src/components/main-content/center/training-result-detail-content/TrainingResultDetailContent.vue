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
import { storeToRefs } from 'pinia';
import {useResultStore} from '@/stores/result'
import {useEditorStore} from '@/stores/editor'
import ResultContentMainHeader from './result-content-main-header/ResultContentMainHeader.vue'
import TrainingGraphActionBar from './training-graph-action-bar/TrainingGraphActionBar.vue'
import ResultContentMain from './result-content-main/ResultContentMain.vue'
import ResultContentPerformanceLog from '@/components/shared-components/result-content-performance-log/ResultContentPerformanceLog.vue'
import { onMounted } from 'vue';
const result_store = useResultStore()
const editor_store = useEditorStore()
const {
    zoomInfo
} = storeToRefs(editor_store)
const {
    data,
    active,
    graph
} = storeToRefs(result_store)

function on(name: string) {
    return (x: number) => Object({name: name, percentage: x});
}

// function handleAs(event: any, preprocess?: any | undefined) {
//     return (value: any) => {
//         emit(event, (preprocess || ((x: any) => x))(value));
//     }
// }

// function handleShowLinkingDataset() {
//     handleAs('showLinkingDataset')
// }

function handleLearningCurveZooming(value: any) {
    let operation = (on('Learning Curve') || ((x: any) => x))(value)
    editor_store.operateZooming(operation)
}

function handleTradeOffGraphZooming(value: any) {
    let operation = (on('Trade-off Graph') || ((x: any) => x))(value)
    editor_store.operateZooming(operation)
}

function handleTrainParamsVisualization(value: any) {
    let operation = (on('trainParamsVisualization') || ((x: any) => x))(value)
    editor_store.operateZooming(operation)
}

function getLoads() {
    if (data.value[active.value] && data.value[active.value].train_status) {
        return {
            values: data.value[active.value].train_status.cpu_gpu_load || [],
            timestamp: data.value[active.value].train_status.update_timestamp || '',
            status: data.value[active.value].status || ''
        };
    } else {
        return {
            values: [],
            timestamp: '',
            status: data.value[active.value] ? data.value[active.value].status : ''
        };
    }
}

function getCurrentGraph() {
    if(graph.value.type === 'Learning Curve') {
        return zoomInfo.value.learningCurve
    } else if(graph.value.type === 'Trade-off Graph') {
        return zoomInfo.value.tradeOffGraph
    } else if(graph.value.type === 'TrainParamsVisualization') {
        return zoomInfo.value.trainParamsVisualization
    }
}

function zoomValue(value: any) {
    if(graph.value.type === 'Learning Curve') {
        handleLearningCurveZooming(value)
    } else if(graph.value.type === 'Trade-off Graph') {
        handleTradeOffGraphZooming(value)
    } else if(graph.value.type === 'TrainParamsVisualization') {
        handleTrainParamsVisualization(value)
    }
}

</script>
<template>
    <div class="training-main-area">
        <div v-if="active > -1">
            <ResultContentMainHeader />
            <TrainingGraphActionBar :current-graph="getCurrentGraph()" @zoom-value="zoomValue" />
            <ResultContentMain class="job-main-area" :current-graph="getCurrentGraph()" @zoom-value="zoomValue" />
            <ResultContentPerformanceLog
                :log="data[active] ? data[active].logfile : ''"
                :loads="getLoads()"
                :jobId="data[active] ? data[active].job_id : ''"
                :status="data[active] ? data[active].status : ''"
            />
        </div>
        <span v-else class="position-center error-message">NO TRAINING RESULT SELECTED.</span>
    </div>
</template>