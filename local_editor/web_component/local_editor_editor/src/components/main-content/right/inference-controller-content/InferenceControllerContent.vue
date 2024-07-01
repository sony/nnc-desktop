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
import {useEditorStore} from '@/stores/editor'
import {useInferenceStore} from '@/stores/inference'
import {useResultStore} from '@/stores/result'
import {useLanguageStore} from '@/stores/misc/languages'
import {useDefinitionsStore} from '@/stores/misc/definitions'
import { computed, reactive, ref } from 'vue';
import NncInferenceDialog from './nnc-inference-dialog/NncInferenceDialog.vue'
import NncControllerButton from '@/components/shared-components/NncControllerButton.vue'
const result_store = useResultStore()
const inference_store = useInferenceStore()
const editor_store = useEditorStore()
const languages_store = useLanguageStore()
const language = reactive(languages_store.language)
const props = defineProps<{
    activeJobId: string
}>()
const emit = defineEmits([
    'updateJobId'
])

const numNode = ref<any>({})

const {
    availableInstances,
    resumeInstance,
    shouldShowUploadDialog
} = storeToRefs(editor_store)
const {
    data,
    active
} = storeToRefs(result_store)
const {
    uploaded_inputs,
    isUploaded
} = storeToRefs(inference_store)

const disabled = computed(() => {
    let job = result_store.getActiveResult()
    if(!(job && job.evaluate_status)) {
        return true
    }
    if(job.evaluate_status.status !== "finished") {
        return true
    }
    return ['preprocessing', 'processing'].includes(job.status) ? true : false
})

function pausable() {
    return result_store.pausable()
}

function uploadInferInput() {
    if (disabled.value) {
        return;
    }
    editor_store.shouldShowUploadDialog = true
}

function getButtonName() {
    return language.controller.RUN;
}

function suspended() {
    return false
}

function runInference() {
    const type = resumeInstance.value.selected;
    const priority = resumeInstance.value.activePriority;
    let group = resumeInstance.value.priorities[priority];
    editor_store.onTriggeredJob('inference', Number(group), Number(numNode.value))
}

function onCancelUploadProject() {
    shouldShowUploadDialog.value = false
}

</script>

<template>
    <div class="job-action-control" style="min-height: 0;">
        <div class="title job-action-control-title">
            <span>{{language.controller.CONTROLLER}}</span>
            <NncControllerButton
                :caption="getButtonName()"
                :suspended="suspended()"
                :disabled="disabled"
                @pressed="uploadInferInput()"
            />
        </div>
    </div>

    <NncInferenceDialog
      v-if="shouldShowUploadDialog"
      :title="language.inference.UPLOAD_INPUT_TITLE"
      :callback="runInference"
      :cancelCallback="onCancelUploadProject"
    />
</template>