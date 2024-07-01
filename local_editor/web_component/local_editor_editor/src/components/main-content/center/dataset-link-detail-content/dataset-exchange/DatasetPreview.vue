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
import DatasetPager from '@/components/shared-components/dataset-pager/DatasetPager.vue'
const editor_store = useEditorStore()
const definitions_store = useDefinitionsStore()
const dataset_store = useDatasetStore()
const utils_store = useUtilsStore()
const languages_store = useLanguageStore()
const language = reactive(languages_store.language)
const props = defineProps<{
    previewDataset: any, 
    isDatasetCacheNotFoundError: boolean, 
    features: any
}>()

const fetched = ref<any>({})
const isDatasetCacheNotFoundError = ref<boolean>(false)

const previewLimitText = computed(() => {
    return definitions_store.Definitions.strings.data_preview_limit
})

function makeGetData(offset: any) {
    const SHOW_MAX_COLUMN = definitions_store.Definitions.DATASET.SHOW_MAX_COLUMN;
    const GET_COLUMN_INTERVAL = definitions_store.Definitions.DATASET.GET_COLUMN_INTERVAL;
    return (callback: any) => {
        const id = props.previewDataset.id;
        if (fetched.value.id !== id || fetched.value.offset !== offset) {
            callback.clear();
            utils_store.callApi({
                url: definitions_store.Definitions.CORE_API.usersUrl() + "/datasets/" + id + "?row=" + offset + "&numrows=" + definitions_store.Definitions.ITEMS_PER_PAGE + "&column=0&numcolumns=" + GET_COLUMN_INTERVAL,
                type: 'GET',
                dataType: 'json',
            }, (result: any) => {
                isDatasetCacheNotFoundError.value = false;
                const columnLength = result.dataset.csv_header.split(',').length <= SHOW_MAX_COLUMN ? result.dataset.csv_header.split(',').length : SHOW_MAX_COLUMN;
                if (columnLength <= GET_COLUMN_INTERVAL) {
                    callback.update(result.dataset.csv_header.split(','), result.dataset.result, GET_COLUMN_INTERVAL);
                    editor_store.windowInit()
                    fetched.value = { id: id, offset: offset, };
                    return;
                }
                var _getPreviewData = (column: any) => {
                    var $def = $.Deferred();
                    utils_store.callApi({
                        url: definitions_store.Definitions.CORE_API.usersUrl() + "/datasets/" + id + "?row=" + offset + "&numrows=" + definitions_store.Definitions.ITEMS_PER_PAGE + "&column=" + column + "&numcolumns=" + GET_COLUMN_INTERVAL,
                        type: 'GET',
                        dataType: 'json',
                    }, (result: any) => $def.resolve(result), $def.reject);
                    return $def.promise();
                };
                const promiseList = [];
                for (var i = GET_COLUMN_INTERVAL; i < Math.floor(columnLength); i += GET_COLUMN_INTERVAL) {
                    promiseList.push(_getPreviewData(i))
                }

                var datasetResults = result.dataset.result;

                Promise.all(promiseList).then((responses) => {
                    responses.forEach((response) => {
                        datasetResults = datasetResults.map((datasetResult: any, i: any) => {
                            if (response.dataset.result[i]) {
                                return datasetResult.concat(response.dataset.result[i]);
                            } else {
                                return datasetResult;
                            }
                        })
                    });
                    callback.update(result.dataset.csv_header.split(','), datasetResults, columnLength);
                    editor_store.windowInit()
                    fetched.value = { id: id, offset: offset, };
                }, (reason: any) => {
                    if ((error.responseJSON || {}).error === 'NNCD_DATASET_CACHE_NOT_FOUND') {
                        fetched.value = { id: id, offset: offset, };
                        isDatasetCacheNotFoundError.value = true;
                        callback.hideLoading();
                    } else {
                        callback.hideLoading();
                        utils_store.handleXhrFailure(error, status, httpErrorThrown);
                    }
                });
            }, (error: any, status: any, httpErrorThrown: any) => {
                if ((error.responseJSON || {}).error === 'NNCD_BAD_DATASET_ID') {
                    dataset_store.data.filter((dataset: any) => dataset.id === id).forEach((dataset: any) => Object.assign(dataset, {
                        id: '',
                        tenant_id: '',
                        original_name: '',
                        samples: 0,
                        columns: 0,
                        header: [],
                        contents: [],
                    }));
                } else if ((error.responseJSON || {}).error === 'NNCD_DATASET_CACHE_NOT_FOUND') {
                    fetched.value = { id: id, offset: offset, };
                    isDatasetCacheNotFoundError.value = true;
                    callback.hideLoading();
                } else {
                    callback.hideLoading();
                    utils_store.handleXhrFailure(error, status, httpErrorThrown);
                }
            });
        }
    };
}

function makeGetNextColumnData(offset: any) {
    const GET_COLUMN_INTERVAL = definitions_store.Definitions.DATASET.GET_COLUMN_INTERVAL;
    return (callback: any, column: any) => {
        const id = props.previewDataset.id;
        utils_store.callApi({
            url: definitions_store.Definitions.CORE_API.usersUrl() + "/datasets/" + id + "?row=" + offset + "&numrows=" + definitions_store.Definitions.ITEMS_PER_PAGE + "&column=" + column + "&numcolumns=" + GET_COLUMN_INTERVAL,
            type: 'GET',
            dataType: 'json',
        }, (result: any) => {
            callback.update(result.dataset.result, column + GET_COLUMN_INTERVAL);
        }, (error: any, status: any, httpErrorThrown: any) => {
            if ((error.responseJSON || {}).error === 'NNCD_DATASET_CACHE_NOT_FOUND') {
                fetched.value = { id: id, offset: offset, };
                isDatasetCacheNotFoundError.value = true;
                callback.clear();
            } else {
                callback.clear();
                utils_store.handleXhrFailure(error, status, httpErrorThrown);
            }
        });
    }
}

function getOriginalFile(value: any) {
    const datasetId = props.previewDataset.id;
    dataset_store.getOriginalFile(value.original, value.row, value.column, datasetId);
}

</script>
<template>
    <div class="dataset-preview height-max">
        <DatasetPager 
            v-if="previewDataset.id"
            :index="previewDataset.index"
            :total="previewDataset.samples"
            :make-get-data="makeGetData"
            :make-get-next-column-data="makeGetNextColumnData"
            :show-limit-warning-on-control="false"
            :is-copying="false"
            :is-dataset-cache-not-found-error="isDatasetCacheNotFoundError"
            :is-classification="false"
            :filter="''"
            :sort-key="''"
            :sort-type="''"
            :label="''"
            :is-evaluation-tab="false"
            :is-inference-tab="false"
            :is-init="false"
            :features="features"
            :menu-items="undefined"
            @get-original-file="getOriginalFile" 
        >
            <div slot="pager-header">
                <span class="preview-title">{{language.dataset.PREVIEW}}</span>
                <span v-if="500 < previewDataset.samples" class="paging-limit-warning">{{ previewLimitText }}</span>
            </div>
        </DatasetPager>
    </div>
</template>