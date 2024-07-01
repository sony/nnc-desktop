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
import { computed, ref, reactive } from 'vue';
import { useEditorStore } from '@/stores/editor'
import { useLanguageStore } from '@/stores/misc/languages'
import EditControllerContent from './edit-controller-content/EditControllerContent.vue'
import TrainingControllerContent from './training-controller-content/TrainingControllerContent.vue'
import EvaluationControllerContent from './evaluation-controller-content/EvaluationControllerContent.vue'
import InferenceControllerContent from './inference-controller-content/InferenceControllerContent.vue'
import OverView from './over-view/OverView.vue'
import { storeToRefs } from 'pinia';
const editor_store = useEditorStore()
const language_store = useLanguageStore()

const language = reactive(language_store.language)
const activeJobId = ref('')
const {configuration, 
       jobConfiguration, 
       completedConfiguration, 
       jobCompletedConfiguration,
       rightWidth, 
       selection, 
       graphIndex, 
       jobGraphIndex} = storeToRefs(editor_store)

const activeName = computed(() => {
    if (selectedEditTab) {
        if (!editor_store.statistics || !editor_store.statistics.active || !editor_store.statistics.active.name) {
            return '';
        } else {
            return editor_store.statistics.active.name;
        }
    } else {
        return editor_store.jobStatisticActive.name;
    }
})

const useStatistics = computed(() => {
    if (selectedEditTab) {
        return editor_store.statistics.values;
    } else {
        return editor_store.jobCompletedConfiguration.statistics ? editor_store.jobCompletedConfiguration.statistics[editor_store.jobGraphIndex] : [];
    }
}) 

const selectedEditTab = computed(() => {
    return editor_store.activeTabNameLowerCase === 'edit';
})

const selectedDatasetTab = computed(() => {
    return editor_store.activeTabNameLowerCase === 'dataset';
})

const selectedConfigTab = computed(() => {
    return editor_store.activeTabNameLowerCase === 'config';
})

const selectedTrainingTab = computed(() => {
    return editor_store.activeTabNameLowerCase === 'training';
})

const selectedEvaluationTab = computed(() => {
    return editor_store.activeTabNameLowerCase === 'evaluation';
})

const dynamicComponentGen = computed(() => {
    if(editor_store.activeTabNameLowerCase === 'edit') { return EditControllerContent }
    if(editor_store.activeTabNameLowerCase === 'training') { return TrainingControllerContent }
    if(editor_store.activeTabNameLowerCase === 'evaluation') { return EvaluationControllerContent }
    if(editor_store.activeTabNameLowerCase === 'inference') { return InferenceControllerContent }
})

function onUpdateJobId(jobId: string) {
    activeJobId.value = jobId
}

</script>

<template>
    <div id="right-content" class="right-content" v-if="!selectedDatasetTab && !selectedConfigTab">
        <div class="app-row app-scroll-y" style="top: 0; bottom: 0;">
            <component 
            :is="dynamicComponentGen"
            :active-job-id="activeJobId"
            @update-job-id="onUpdateJobId"
            />
            <OverView
            :configuration="selectedEditTab ? configuration : jobConfiguration"
            :completed-configuration="selectedEditTab ? completedConfiguration : jobCompletedConfiguration"
            :target-index="selectedEditTab ? graphIndex : jobGraphIndex"
            :is-edit-tab="selectedEditTab"
            :width="rightWidth"
            :selection="selection"
            :active-statistic-name="activeName"
            :is-training-tab="selectedTrainingTab"
            />
            <div style="padding-bottom: 16px;">
                <div class="network-statistics">
                    <div class="title">{{language.controller.NETWORK_STATISTICS}}</div>
                </div>
                <div class="network-statistics-scroller nnc-invoker">
                    <div v-for="state in useStatistics"
                    :key="state.name"
                    :class="'stat-line' + (activeName === state.name ? ' active' : '')"
                    @click.prevent="$emit('statistics', state)"
                    >
                        <div class="content"><div class="name">{{ state.name }}</div>{{ Number(state.sum).toLocaleString() }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
