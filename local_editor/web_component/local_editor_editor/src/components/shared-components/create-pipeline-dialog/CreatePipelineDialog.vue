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
import { useLanguageStore } from '@/stores/misc/languages'
import { useDefinitionsStore } from '@/stores/misc/definitions'
import { useEditorStore } from '@/stores/editor'
import { computed, ref, reactive } from 'vue'
import { storeToRefs } from 'pinia';
import PipelineCondition from './PipelineCondition.vue'
import PipelineFilename from './PipelineFilename.vue'
import PipelineSendMail from './PipelineSendMail.vue'
import PipelineSelectInstance from './PipelineSelectInstance.vue'
import PipelineFile from './PipelineFile.vue'
const definitions_store = useDefinitionsStore()
const language_store = useLanguageStore()
const editor_store = useEditorStore()
const language = reactive(language_store.language)
const props = defineProps<{
    data: any, 
    buttons: any,
    defaultButton: any,
}>()
const MAX_DATA_SOURCE_NAME_LENGTH = 255;
const MAX_DATA_SOURCE_NUM = 5;
const MAX_FILE_NAME = 3;
const pipelineSupportPage = 'https://support.dl.sony.com/docs-ja/automation';
const {currentLang} = storeToRefs(language_store)
const {availableInstances} = storeToRefs(editor_store)
const LANG = ref<string>(currentLang.value.toLocaleLowerCase())
const pipelineName = ref<string>('')
const preProcess = ref<any>(null)
const postProcess = ref<any>(null)
const fileName = ref<any>([
    {value: '', errorMessage: ''}
])
const isSendMail = ref<boolean>(true)
const dataSources = ref<any>([
    {value: '', trigger: true, errorMessage: ''},
])
const trainInstance = ref<any>({
    type: 1,
    selected: 'Standard'
})
const evaluateInstance = ref<any>({
    type: 1,
    selected: 'Standard'
})

const text = computed(() => {
    return language.CREATE_PIPELINE;
})

const instances = computed(() => {
    const AvailableInstances = availableInstances.value;
    return {
        train: AvailableInstances.train.filter((instance: any) => instance.available),
        evaluate: AvailableInstances.evaluate.filter((instance: any) => instance.available)
    }
})

const parameters = computed(() => {
    return {
        pipelineName: pipelineName.value,
        preProcess: preProcess.value,
        postProcess: postProcess.value,
        fileName: fileName.value.filter((_file: any) => _file.value).map((_file: any) => _file.value),
        isSendMail: isSendMail.value,
        trainInstance: trainInstance.value.type,
        evaluateInstance: evaluateInstance.value.type,
        dataSources: dataSources.value.filter((_data: any) => _data.value),
    };
})

const disabled = computed(() => {
    return [
        !!errorMessage.value,
        !!getErrorMessage(true),
        !!getErrorMessage(false),
        !!getPipelineNameError(),
        hasFileNameError(),
        hasDataSourceError(),
    ].some(flag => flag);
})

const errorMessage = computed(() => {
    if (!hasPipelineName()) {
        return text.value.ENTER_PIPELINE_NAME;
    } else if (!hasDataSource()) {
        return text.value.ENTER_DATA_SOURCE_NAME;
    } else if (!checkedTrigger()) {
        return text.value.CHECK_TRIGGER_ERROR;
    }
    return '';
})

function hasPipelineName() {
    return !!pipelineName.value;
}

function hasDataSource() {
    return !!dataSources.value.filter((_data: any) => _data.value).length;
}

function hasDataSourceError() {
    return !!dataSources.value.some((_data: any) => _data.errorMessage);
}

function hasFileNameError() {
    return !!fileName.value.some((_file: any) => _file.errorMessage);
}

function checkedTrigger() {
    return dataSources.value.filter((_data: any) => _data.value).some((_data: any) => _data.trigger);
}

function onInputFile(file: any, isPreProcess: boolean) {
    if (isPreProcess) {
        preProcess.value = file;
    } else {
        postProcess.value = file;
    }
}

function onClearFile(isPreProcess: boolean) {
    if (isPreProcess) {
        preProcess.value = null;
    } else {
        postProcess.value = null;
    }
}

function onInputFileName(_fileName: any, i: any) {
    fileName.value[i].value = _fileName;
    fileName.value[i].errorMessage = getFileNameError(_fileName);
}

function onInputPipelineName(name: any) {
    pipelineName.value = name;
}

function onInputSendMail(value: any) {
    isSendMail.value = value;
}

function onChangeInstance(value: any, isTrain: boolean) {
    if (isTrain) {
        trainInstance.value = value;
    } else {
        evaluateInstance.value = value;
    }
}

function getErrorMessage(isPreProcess: boolean) {
    const fileName = isPreProcess ?
        preProcess.value ? preProcess.value.name : '' :
        postProcess.value ? postProcess.value.name : '';

    if (!fileName) {
        return '';
    }

    if (!isPythonCode(fileName)) {
        return text.value.UPLOAD_FILE_IS_NOT_CORRECT;
    } else {
        return '';
    }
}

function getPipelineNameError() {
    const value = pipelineName.value;
    if (!value) {
        return '';
    } else if (value.length > MAX_DATA_SOURCE_NAME_LENGTH) {
        return language.NAME_IS_TOO_SHORT_OR_LONG;
    } else if (value.match(/[^a-zA-Z0-9_ !#$%&\'\()+,\.\-=@\[\]^`{}~]+/g)) {
        return language.INVALID_CHARACTERES_ARE_INCLUDED;
    }
    return '';
}

function getFileNameError(value: any) {
    if (!value) {
        return '';
    } else if (value.length > MAX_DATA_SOURCE_NAME_LENGTH) {
        return language.NAME_IS_TOO_SHORT_OR_LONG;
    } else if (value.match(/[^a-zA-Z0-9_ !#$%&\'\()+,\.\-=@\[\]^`{}~]+/g)) {
        return language.INVALID_CHARACTERES_ARE_INCLUDED;
    }
    return '';
}

function isPythonCode(fileName: any) {
    return fileName.match(/.+\.py$/) ? true : false;
}

function isMaxDataSource() {
    return dataSources.value.length >= MAX_DATA_SOURCE_NUM;
}

function isMaxFileName() {
    return fileName.value.length >= MAX_FILE_NAME;
}

function addDataSource() {
    if (!isMaxDataSource()) {
        dataSources.value.push({value: '', trigger: false, errorMessage: ''});
    }
}

function addFileName() {
    if (!isMaxFileName()) {
        fileName.value.push({value: '', errorMessage: ''});
    }
}

function getDataSourceErrorMessage(value: any) {
    if (!value) {
        return '';
    } else if (value.length > MAX_DATA_SOURCE_NAME_LENGTH) {
        return language.NAME_IS_TOO_SHORT_OR_LONG;
    } else if (value.match(/[^a-zA-Z0-9_ !#$%&\'\()+,\.\-=@\[\]^`{}~]+/g)) {
        return language.INVALID_CHARACTERES_ARE_INCLUDED;
    }
    return '';
}

function onInput(value: any, i: any) {
    dataSources.value[i].value = value;
    dataSources.value[i].errorMessage = getDataSourceErrorMessage(value);
}

function onChangeTrigger(value: any, i: any) {
    dataSources.value[i].trigger = value;
}

</script>

<template>
    <div class="nnc-modal-container pipeline">
        <div class="nnc-modal-header">{{ data.title }}</div>
        <div class="nnc-modal-body">
            <div class="condition-area">
                <PipelineFilename
                    :title="text.PIPELINE_NAME"
                    :value="pipelineName"
                    :onInput="(value: any) => onInputPipelineName(value)"
                    :errorMessage="getPipelineNameError()"
                />
                <PipelineCondition
                    v-for="(dataSource, i) in dataSources"
                    :key="'data' + i"
                    :title="text.DATA_SOURCE_NAME"
                    :value="dataSource.value"
                    :onInput="(value: any) => onInput(value, i)"
                    :trigger="dataSource.trigger"
                    :with-trigger="false"
                    :onChangeTrigger="(value: any) => onChangeTrigger(value, i)"
                    :errorMessage="dataSource.errorMessage"
                />
                <div class="add-area" v-if="!isMaxDataSource()">
                    <img class="add-img" src="@/assets/image/AddNew.svg" @click="addDataSource" />
                </div>
                <PipelineSelectInstance
                    :title="text.TRAIN_INSTANCE"
                    :instances="trainInstance"
                    :availableInstances="instances.train"
                    :onInput="(value: any) => onChangeInstance(value, true)"
                />
                <PipelineSelectInstance
                    :title="text.EVALUATE_INSTANCE"
                    :instances="evaluateInstance"
                    :availableInstances="instances.evaluate"
                    :onInput="(value: any) => onChangeInstance(value, false)"
                />
                <PipelineSendMail
                    :title="text.IS_SEND_MAIL"
                    :value="isSendMail"
                    :onInput="(value: any) => onInputSendMail(value)"
                />
                <PipelineFile
                    :title="text.PRE_PROCESS"
                    :file="preProcess"
                    :onInput="(file: any) => onInputFile(file, true)"
                    :onClear="() => onClearFile(true)"
                    :errorMessage="getErrorMessage(true)"
                />
                <PipelineFile
                    :title="text.POST_PROCESS"
                    :file="postProcess"
                    :onInput="(file: any) => onInputFile(file, false)"
                    :onClear="() => onClearFile(false)"
                    :errorMessage="getErrorMessage(false)"
                />
                <PipelineFilename
                    v-for="(name, i) in fileName"
                    :key="'data' + i"
                    :title="text.OUTPUT_FILE_NAME"
                    :value="name.value"
                    :onInput="(value: any) => onInputFileName(value, i)"
                    :errorMessage="name.errorMessage"
                />
                <div class="add-area file" v-if="!isMaxFileName()">
                    <img class="add-img" src="@/assets/image/AddNew.svg" @click="addFileName" />
                </div>
            </div>
        </div>
        <div class="error-message">{{errorMessage}}</div>
        <div v-if="LANG === 'en'">
            {{text.CLICK}} <a :href="pipelineSupportPage" target="_blank">{{text.HERE}} </a>{{text.DETAIL}}
        </div>

        <div v-if="LANG === 'ja'">
            {{text.DETAIL}}<a :href="pipelineSupportPage" target="_blank">{{text.HERE}}</a>
        </div>
        <div class="nnc-modal-footer">
            <button :class="'nnc-modal-button' + ' ' + definitions_store.Definitions.MODAL.TABBABLE_CLASS" v-for="btn in buttons" @click="btn.action()">{{ btn.name }}</button>
            <button v-if="disabled" :disabled="true" class="nnc-modal-button disabled default">{{ defaultButton.name }}</button>
            <button v-else :class="'nnc-modal-button default' + ' ' + definitions_store.Definitions.MODAL.TABBABLE_CLASS" @click="defaultButton.action(parameters)">{{ defaultButton.name }}</button>
        </div>
    </div>
</template>