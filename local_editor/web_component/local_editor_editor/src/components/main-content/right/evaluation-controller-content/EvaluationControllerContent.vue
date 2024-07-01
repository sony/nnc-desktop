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
import DownloadBlueSvg from "@/assets/image/DownloadBlue.svg"
import uploadBlueSvg from "@/assets/image/uploadBlue.svg"
import { storeToRefs } from 'pinia';
import {useEditorStore} from '@/stores/editor'
import {useResultStore} from '@/stores/result'
import {useLanguageStore} from '@/stores/misc/languages'
import {useDefinitionsStore} from '@/stores/misc/definitions'
import { computed, reactive } from 'vue';
import NncButton from '@/components/shared-components/NncButton.vue'
const result_store = useResultStore()
const editor_store = useEditorStore()
const definitions_store = useDefinitionsStore()
const languages_store = useLanguageStore()
const language = reactive(languages_store.language)
const {
    downloadType,
    downloadFormats,
    isShowInLocalEditor,
    isCreateReport
} = storeToRefs(editor_store)
const {
    data,
    active,
    currentJobId
} = storeToRefs(result_store)

const locale = computed<any>(() => {
    return definitions_store.Definitions.LOCALE;
})

const downloadList = computed(() => {
    let _downloadFormats = downloadFormats.value.filter((downloadObj: any) => {
        return ((data.value[active.value] || {}).download_formats || []).findIndex((format: any) => format === downloadObj.name) !== -1;
    });
    if (_downloadFormats.length) {
        _downloadFormats.push({
            description: {
                'en-US': 'html beta',
                'ja-JP': 'html beta'
            },
            name: 'html'
        });
    }
    return _downloadFormats;
})

const type = computed(() => {
    const type = downloadList.value.findIndex((downloadObj: any) => downloadObj.name === downloadType.value) !== -1 ? downloadType.value : downloadList.value[0] ? downloadList.value[0].name : '';
    if (type) {
        downloadType.value = type
    }
    return type;
})

function downloadable() {
    return result_store.downloadable() && !(isCreateReport.value && downloadType.value === 'html')
}

function selectDownloadType(e: Event) {
    let v = (e.target as HTMLInputElement).value
    downloadType.value = v
}

function downloadClick() {
    if (downloadType.value === 'html') {
        editor_store.exportHtml(currentJobId.value);
    } else {
        editor_store.onDownload(downloadType.value)
    }
}

</script>

<template>
    <div class="job-action-control">
        <div class="title job-action-control-title">{{language.controller.CONTROLLER}}</div>
        <div class="download-area">
            <label class="select_label download_select">
                <select class="select_menu" @change="selectDownloadType" v-model="type">
                    <option v-for="(downloadObj) in downloadList" :value="downloadObj.name">{{downloadObj.description[locale]}}</option>
                </select>
            </label>
        </div>
        <NncButton class="download" :image="DownloadBlueSvg" :caption="language.controller.DOWNLOAD_PROJECT" :disabled="!downloadable()" @pressed="downloadClick" />
    </div>
</template>