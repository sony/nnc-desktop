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
import { computed, onMounted } from 'vue';
import ResultContentHeader from '@/components/shared-components/result-content-header/ResultContentHeader.vue'
import NncLoading from '@/components/shared-components/NncLoading.vue'
import ResultContentPerformanceLog from '@/components/shared-components/result-content-performance-log/ResultContentPerformanceLog.vue'
import InferenceAction from './InferenceAction.vue'
import InferenceMainArea from './inference-main-area/InferenceMainArea.vue'
const result_store = useResultStore()
const editor_store = useEditorStore()
const {
    data,
    active,
    graph
} = storeToRefs(result_store)

const currentJob = computed(() => { 
    return data.value[active.value]; 
})

const elapsedTime = computed(() => {
    return (data.value[active.value] || {}).elapsed_time_of_inference;
})

const elapsedTaskTime = computed(() => {
    return ((data.value[active.value].inference_status || {}).time || {}).elapsed;
})

const remainingTaskTime = computed(() => {
    return Math.max((predictionTaskTime.value || 0) - (elapsedTaskTime.value || 0), 0);
})

const predictionTaskTime = computed(() => {
    return ((data.value[active.value].inference_status || {}).time || {}).prediction;
})

const predictionTime = computed(() => {
    if (['finished'].includes(data.value[active.value].inference_status.status)) {
        return elapsedTime.value;
    } else {
        return remainingTaskTime.value + elapsedTime.value;
    }
})

const instanceGroup = computed(() => {
    const inferenceInstanceGroup = (data.value[active.value] || {}).instance_group_of_inference;
    if (inferenceInstanceGroup) {
        return inferenceInstanceGroup;
    } else if ((data.value[active.value] || {}).type === 'inference') {
        return (data.value[active.value] || {}).instance_group;
    } else {
        return ''
    }
})

const hasInferenceStatus = computed(() => {
    return currentJob.value.inference_status
})

const inferenceFailed = computed(() => { 
    return hasInferenceStatus.value && hasInferenceStatus.value.status === 'failed'; 
})

const inferenceSucceeded = computed(() => { 
    return hasInferenceStatus.value && ['finished', 'suspended'].includes(hasInferenceStatus.value.status)
})

const inferenceProcessing = computed(() => {
    return ['preprocessing', 'processing'].includes(hasInferenceStatus.value.status)
})

</script>
<template>
    <div>
        <div v-if="active > -1">
            <div v-if="data.length">
                <ResultContentHeader
                    :current="data[active].inference_status.hasOwnProperty('data') ? data[active].inference_status.data.current : null"
                    :total="data[active].inference_status.hasOwnProperty('data') ? data[active].inference_status.data.max : null"
                    progress-name="Input"
                    :elapsed-time="elapsedTime"
                    :total-time="predictionTime"
                    :remainingTime="remainingTaskTime"
                    :instance-group="instanceGroup"
                />
                <InferenceAction
                    :modals="Object.keys(data[active].confusionMatrix.matrices)"
                    :labelList="Object.keys(data[active].classificationMatrix.matrices)"
                />
            </div>
            <div class="job-main-area scrollbar-macosx">
                <InferenceMainArea v-if="inferenceSucceeded"/>
                <div v-else-if="inferenceFailed" class="position-center error-message">NO RESULT AVAILABLE</div>
                <NncLoading v-else-if="inferenceProcessing"/>
            </div>
            <ResultContentPerformanceLog 
                :log="data.length && data[active] ? data[active].inference_logfile : ''" 
                :loads="undefined"
                job-id=''
            />
        </div>
        <span v-else class="position-center error-message">NO INFERENCE RESULT SELECTED.</span>
    </div>
</template>