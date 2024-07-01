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
import EvaluationAction from './EvaluationAction.vue'
import NncLoading from '@/components/shared-components/NncLoading.vue'
import EvaluationMainArea from './evaluation-main-area/EvaluationMainArea.vue'
import ResultContentPerformanceLog from '@/components/shared-components/result-content-performance-log/ResultContentPerformanceLog.vue'
const result_store = useResultStore()
const editor_store = useEditorStore()
const {
    isCopying
} = storeToRefs(editor_store)
const {
    data,
    active,
    graph
} = storeToRefs(result_store)
const currentJob = computed(() => { 
    return data.value[active.value]; 
})

const hasEvaluateStatus = computed(() => {
    return currentJob.value.evaluate_status
})

const evaluationFailed = computed(() => { 
    return hasEvaluateStatus.value && hasEvaluateStatus.value.status === 'failed'; 
})

const evaluationSucceeded = computed(() => { 
    return hasEvaluateStatus.value && ['finished', 'suspended'].includes(hasEvaluateStatus.value.status)
})

const evaluationProcessing = computed(() => {
    return ['preprocessing', 'processing'].includes(hasEvaluateStatus.value.status)
})

const elapsedTime = computed(() => {
    return (data.value[active.value] || {}).elapsed_time_of_evaluate;
})

const elapsedTaskTime = computed(() => {
    return ((data.value[active.value].evaluate_status || {}).time || {}).elapsed;
})

const remainingTaskTime = computed(() => {
    return Math.max((predictionTaskTime.value || 0) - (elapsedTaskTime.value || 0), 0);
})

const predictionTaskTime = computed(() => {
    return ((data.value[active.value].evaluate_status || {}).time || {}).prediction;
})

const predictionTime = computed(() => {
    if (['finished'].includes(data.value[active.value].evaluate_status.status)) {
        return elapsedTime.value;
    } else {
        return remainingTaskTime.value + elapsedTime.value;
    }
})

const instanceGroup = computed(() => {
    const evaluateInstanceGroup = (data.value[active.value] || {}).instance_group_of_evaluate;
    if (evaluateInstanceGroup) {
        return evaluateInstanceGroup;
    } else if ((data.value[active.value] || {}).type === 'evaluate') {
        return (data.value[active.value] || {}).instance_group;
    } else {
        return ''
    }
})

</script>
<template>
    <div>
        <div v-if="active > -1">
            <div v-if="data.length">
                <ResultContentHeader
                    :current="data[active].evaluate_status.hasOwnProperty('data') ? data[active].evaluate_status.data.current : null"
                    :total="data[active].evaluate_status.hasOwnProperty('data') ? data[active].evaluate_status.data.max : null"
                    progress-name="Data"
                    :elapsed-time="elapsedTime"
                    :total-time="predictionTime"
                    :remainingTime="remainingTaskTime"
                    :instance-group="instanceGroup"
                />
                <EvaluationAction
                    :modals="Object.keys(data[active].confusionMatrix.matrices)"
                    :labelList="Object.keys(data[active].classificationMatrix.matrices)"
                />
            </div>
            <div class="job-main-area scrollbar-macosx">
                <EvaluationMainArea v-if="evaluationSucceeded"/>
                <div v-else-if="evaluationFailed" class="position-center error-message">NO RESULT AVAILABLE</div>
                <NncLoading v-else-if="evaluationProcessing"/>
            </div>
            <ResultContentPerformanceLog 
                :log="data.length && data[active] ? data[active].evaluation_logfile : ''" 
                :loads="undefined"
                job-id=''
            />
        </div>
        <span v-else class="position-center error-message">NO TRAINING RESULT SELECTED.</span>
    </div>
</template>