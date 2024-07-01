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
import { ref, reactive } from 'vue'
import { useLanguageStore } from '@/stores/misc/languages'
import AppBarTab from './tab-items/AppBarTab.vue'
import ButtonHome from './tab-items/ButtonHome.vue'
import ButtonSave from './tab-items/ButtonSave.vue'
import ButtonSaveAs from './tab-items/ButtonSaveAs.vue'
import ButtonExpand from './tab-items/ButtonExpand.vue'
const props = defineProps<{
    projectName: string, 
    isLocal: boolean, 
    isCreateReport: boolean, 
    reportUrl: string, 
    reportProgress: any, 
    modal: any
}>()
const emit = defineEmits([
    'showDownloadDialog', 
    'save', 
    'saveAs'
])

const language_store = useLanguageStore()
const language = reactive(language_store.language)
const COMPLETE_PROGRESS = 100

const report_progress_title = ref("")

function onMouseMove() {
    report_progress_title.value = `Html exported: ${props.reportProgress}%`
}

function onClick() {
    if (props.reportProgress === COMPLETE_PROGRESS) {
        emit('showDownloadDialog', props.reportUrl)
    }
}

</script>

<template>
    <div class="editor-navbar">
        <div> <!-- this DIV element for symmetry of 'pull-right' -->
            <ButtonHome :modal="modal" />
            <AppBarTab tabName="EDIT" :displayName="language.edit.EDIT" />
            <AppBarTab tabName="TRAINING" :displayName="language.edit.TRAINING" />
            <AppBarTab tabName="EVALUATION" :displayName="language.edit.EVALUATION" />
            <AppBarTab tabName="INFERENCE" :displayName="language.edit.INFERENCE" />
        </div>
        <div class="editor-navbar-center">
            <div class="project-name">
                <img v-if="!isLocal" src="@/assets/image/Users.svg" />
                {{ projectName }}
            </div>
        </div>
        <div class="pull-right">
            <div v-if="isCreateReport" class="report-progress-area" @click="onClick" @mousemove="onMouseMove">
                <canvas :title="report_progress_title" id="report-progress" width="24" height="24"></canvas>
            </div>
            <AppBarTab tabName="DATASET" :displayName="language.edit.DATASET" />
            <AppBarTab tabName="CONFIG" :displayName="language.edit.CONFIG" />
            <ButtonSave @click="$emit('save')" />
            <ButtonSaveAs @click="$emit('saveAs')" />
            <!-- <button-publish-project @click="$emit('publish-project')" /> -->
            <!-- <button-pipeline @click="$emit('pipeline')" /> -->
            <ButtonExpand />
        </div>
    </div>
</template>
