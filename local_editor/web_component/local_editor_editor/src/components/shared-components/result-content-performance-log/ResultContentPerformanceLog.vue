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
import {useLanguageStore} from '@/stores/misc/languages'
import { computed, onMounted, onUpdated, reactive, ref, watch } from 'vue';
import ResultContentLog from './ResultContentLog.vue'
import ResultContentPerformance from './ResultContentPerformance.vue'
const result_store = useResultStore()
const editor_store = useEditorStore()
const languages_store = useLanguageStore()
const language = reactive(languages_store.language)
const props = defineProps<{
    log: string, 
    loads: any, 
    jobId: string, 
}>()

var jobInfo = {
    log: 'log',
    performance: 'performance',
}
const job_info_log = ref<string>(jobInfo.log)
const scrollFlag = ref<boolean>(true)
const {data, active} = storeToRefs(result_store)

onMounted(() => {
    $('.job-main-area').resizable({
        handles: "s",
        alsoResizeReverse: '.performance-log-area',
    });
    var $jobLog: any = $(".job-log");
    $jobLog.on("scroll", (e) => {
        if ($jobLog.scrollTop() + $jobLog[0].clientHeight == $jobLog[0].scrollHeight) {
            scrollFlag.value = true;
        } else {
            scrollFlag.value = false;
        };
    });
})

onUpdated(() => {
    var $jobLog = $(".job-log");
    if ($jobLog.length) {
        if ($jobLog[0].clientHeight == $jobLog[0].scrollHeight) {
            scrollFlag.value = true;
        }
        if (scrollFlag.value) {
            $jobLog.scrollTop($jobLog[0].scrollHeight);
        };
    };
})

watch(() => props.jobId, (newValue, oldValue) => {
    job_info_log.value = jobInfo.log;
  }
)

const performanceTabClass = computed(() => {
    let className = 'graphs-tab nnc-invoker';
    if (isActivePerformance.value)  {
        className += ' ' + 'active';
    }
    if (!isTraining()) {
        className += ' ' + 'disabled';
    }
    return className;
})

const isActiveLog = computed(() => {
    return job_info_log.value === jobInfo.log;
})

const isActivePerformance = computed(() => {
    return job_info_log.value === jobInfo.performance;
})

function isTraining() {
    const job = data.value[active.value] || {};
    return ['train'].includes(job.type) && result_store.pausable();
}

function onClickTab(activeName: any) {
    if (activeName === jobInfo.performance) {
        if (isTraining()) {
            job_info_log.value = activeName;
        }
    } else {
        job_info_log.value = activeName;
    }
}

</script>
<template>
    <div class="performance-log-area">
        <template v-if="loads">
        <div class="performance-log-tabs">
            <div @click="onClickTab(jobInfo.log)" :class="isActiveLog ? 'graphs-tab nnc-invoker active' : 'graphs-tab nnc-invoker'">
                <div>{{language.training.LOG}}</div>
            </div>
            <div
                @click="onClickTab(jobInfo.performance)"
                :class="performanceTabClass"
            >
                <div>{{language.training.PERFORMANCE}}</div>
            </div>
        </div>
        <ResultContentLog :log="log" v-if="isActiveLog" />
        <ResultContentPerformance :loads="loads" v-else-if="isActivePerformance" />
        </template>
        <template v-else>
            <ResultContentLog :log="log" />
        </template>
    </div>
</template>