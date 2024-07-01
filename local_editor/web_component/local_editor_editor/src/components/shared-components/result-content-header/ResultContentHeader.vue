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
import ResultContentProgress from './ResultContentProgress.vue'
import ResultContentTime from './ResultContentTime.vue'
const result_store = useResultStore()
const editor_store = useEditorStore()
const languages_store = useLanguageStore()
const language = reactive(languages_store.language)
const {
    data,
    active
} = storeToRefs(result_store)
const props = defineProps<{
    current: any, 
    total: any, 
    progressName: any, 
    elapsedTime: any, 
    totalTime: any, 
    remainingTime: any, 
    instanceGroup: any
}>()


</script>
<template>
    <div class="job-action">
        <ResultContentTime :elapsed-time="elapsedTime" :total-time="totalTime" :remaining-time="remainingTime" :instance-group="instanceGroup" />
        <ResultContentProgress :current="current" :total="total" :progress-name="progressName" />
    </div>
</template>