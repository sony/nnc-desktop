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
import {useEditorStore} from '@/stores/editor'
import {useDatasetStore} from '@/stores/dataset'
import {useDefinitionsStore} from '@/stores/misc/definitions'
import {useUtilsStore} from '@/stores/utils'
import {useLanguageStore} from '@/stores/misc/languages'
import { storeToRefs } from 'pinia';
import { nextTick, reactive, ref, computed, onMounted } from 'vue';
import NncLoading from '@/components/shared-components/NncLoading.vue'
import DatasetListContent from './DatasetListContent.vue'
import DatasetLoadFailed from './DatasetLoadFailed.vue'
import DatasetEmptyMessage from './DatasetEmptyMessage.vue'
const props = defineProps<{
    datasets: Array<any>, 
    isLoading: boolean, 
    selectOptionLabels: Array<any>
}>()
const editor_store = useEditorStore()
const definitions_store = useDefinitionsStore()
const dataset_store = useDatasetStore()
const utils_store = useUtilsStore()
const languages_store = useLanguageStore()
const language = reactive(languages_store.language)

const keyword = ref<string>('')
const selectedLabel = ref<string>(language.dataset.ALL)

const filteredDatasets = computed(() => {
    const splittedKeywordList = keyword.value.trim().split(/\s+/);
    let condition = '';
    let newKeyword = '';
    splittedKeywordList.forEach((_keyword: any) => {
        newKeyword += '(?=.*' + _keyword + ')';
    });
    condition += `${'^' + newKeyword + '.*$'}`
    const regExp = new RegExp(condition, 'i');
    const filteredDatasetList = props.datasets.filter((dataset: any) => regExp.test(dataset.original_name));
    if (selectedLabel.value === language.dataset.ALL || selectedLabel.value === undefined) {
        return filteredDatasetList;
        }
    return filteredDatasetList.filter((dataset) => isMatched(dataset));
})

function isMatched(dataset: any) {
    if (dataset.tenant_id === definitions_store.Definitions.DATASET.SAMPLE_DATASET_TENANT_ID) {
        return false;
    } else {
        if (dataset.owner_user_id !== selectedLabel.value && (dataset.labels.indexOf(selectedLabel.value) === -1)) {
        return false;
        }
    }
    return true;
}

function convertToNickName(label: any) {
    if (!label) {
        return '';
    }
    if (!editor_store.members.length) {
        return label;
    }
    const member = editor_store.members.find((members: any) => members.user_id === label);
    if (!member) {
        return label;
    }
    const nickname = member.nickname;
    const userId = member.user_id;
    if (member.deleted) {
        if (nickname) {
            return `${nickname} / Missing user (${userId})`;
        } else {
            return `Missing user (${userId})`;
        }
    } else {
        if (nickname) {
            return `${nickname} (${userId})`;
        } else {
            return userId;
        }
    }
}

</script>
<template>
    <div class="dataset-list">
        <div class="dataset-list-top">
            <div class="dataset-list-label">{{language.dataset.DATASET_LIST}}</div>
            <div class="dataset-list-search">
                <label class="select_label">
                    <select class="select_menu" id="select-label" name="select-label" v-model="selectedLabel">
                        <option v-for="selectOption in selectOptionLabels" :value="selectOption">
                            {{ convertToNickName(selectOption) }}
                        </option>
                    </select>
                </label>
                <input class="dataset-search-input" type="text" :placeholder="language.dataset.SEARCH" v-model="keyword">
            </div>
        </div>
        <div class="dataset-list-top">
            <div class="dataset-list-name">{{language.dataset.NAME}}</div>
            <div class="dataset-list-action"></div>
        </div>
        <div v-if="filteredDatasets" class="dataset-list-items">
            <NncLoading v-if="isLoading" />
            <DatasetEmptyMessage v-else-if="filteredDatasets.length === 0 && datasets.length === 0" />
            <div v-else class="app-scroll-x app-scroll-y">
                <DatasetListContent 
                    v-for="(dataset, index) in filteredDatasets" :key="index"
                    :dataset="dataset"
                    @set-preview-dataset="$emit('set-preview-dataset', dataset)"
                />
            </div>
        </div>
        <DatasetLoadFailed v-else />
    </div>
</template>