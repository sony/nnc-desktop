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
import { computed, reactive } from 'vue';
import {useLanguageStore} from '@/stores/misc/languages'
import {useDefinitionsStore} from '@/stores/misc/definitions'
import {useEditorStore} from '@/stores/editor'
import {useSDUUtilsStore} from '@/stores/editor/sduutils'
const languages_store = useLanguageStore()
const definitions_store = useDefinitionsStore()
const sduutils_store = useSDUUtilsStore()
const editor_store = useEditorStore()
const language = reactive(languages_store.language)
const props = defineProps<{
    elapsedTime: any, 
    totalTime: any, 
    remainingTime: any, 
    instanceGroup: any, 
}>()

const instanceName = computed(() => {
    if (!editor_store.allInstances.train) {
        return '-';
    }
    const filteredInstance = editor_store.allInstances.train.filter((instance: any) => instance.instance_type === props.instanceGroup);
    if (!filteredInstance.length) {
        return '-';
    }
    let locale: any = definitions_store.Definitions.LOCALE
    return filteredInstance[0].description[locale];
})

function formatTime(sec: any) {
    if(!sec) return "--:--:--:--";
    return sduutils_store.calcSecToDayHourMinSec(sec);
}

</script>
<template>
    <div class="float-left job-action-text result-content-time">
        <img class="job-action-image" src="@/assets/image/Time.svg"/>
        <div class="content-area">
            <div class="title">{{language.training.ELAPSED}}</div>
            <div class="text-fixed-width text">{{ formatTime(elapsedTime) }}</div>
        </div>
        <div class="content-area">
            <div class="title">{{language.training.REMAINING}}</div>
            <div class="text-fixed-width text">{{ formatTime(remainingTime) }}</div>
        </div>
        <div class="content-area">
            <div class="title">{{language.training.TOTAL}}</div>
            <div class="text-fixed-width text">{{ formatTime(totalTime) }}</div>
        </div>
        <img class="job-action-image" src="@/assets/image/Resource.svg"/>
        <div class="content-area">
            <div class="title">{{language.training.RESOURCE}}</div>
            <div class="text-fixed-width text">{{ instanceName }}</div>
        </div>
    </div>
</template>