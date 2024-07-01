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
import {useLanguageStore} from '@/stores/misc/languages'
import {useEditorStore} from '@/stores/editor'
import { computed, reactive } from 'vue';
import ResultContentHeader from '@/components/shared-components/result-content-header/ResultContentHeader.vue'
const result_store = useResultStore()
const editor_store = useEditorStore()
const languages_store = useLanguageStore()
const language = reactive(languages_store.language)
const {
    data,
    active
} = storeToRefs(result_store)

const currentEpoch = computed(() => {
    return ((trainStatus.value || {}).epoch || {}).current;
})

const maxEpoch = computed(() => {
    return ((trainStatus.value || {}).epoch || {}).max;
})

const trainStatus = computed(() => {
    return (data.value[active.value] || {}).train_status;
})

const elapsedTime = computed(() => {
    var activeData = (data.value[active.value] || {});
    return activeData.elapsed_time_of_train + activeData.elapsed_time_of_profile;
})

const elapsedTaskTime = computed(() => {
    return ((trainStatus.value || {}).time || {}).elapsed;
})

const remainingTaskTime = computed(() => {
    return Math.max((predictionTaskTime.value || 0) - (elapsedTaskTime.value || 0), 0);
})

const predictionTaskTime = computed(() => {
    return ((trainStatus.value || {}).time || {}).prediction;
})

const predictionTime = computed(() => {
    if (['finished'].includes(data.value[active.value].status)) {
        return elapsedTime.value;
    } else {
        return remainingTaskTime.value + elapsedTime.value;
    }
})

const instanceGroup = computed(() => {
    const profileInstanceGroup = (data.value[active.value] || {}).instance_group_of_profile;
    const trainInstanceGroup = (data.value[active.value] || {}).instance_group_of_train;
    if (trainInstanceGroup) {
        return trainInstanceGroup;
    } else if (profileInstanceGroup) {
        return profileInstanceGroup;
    } else {
        return (data.value[active.value] || {}).instance_group;
    }
})

</script>
<template>
    <div class="result-content-main-header">
        <ResultContentHeader
            :current="currentEpoch"
            :total="maxEpoch"
            :progress-name="language.training.EPOCH"
            :elapsed-time="elapsedTime"
            :total-time="predictionTime"
            :remaining-time="remainingTaskTime"
            :instance-group="instanceGroup"
        />
    </div>
</template>