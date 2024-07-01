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
import {useLanguageStore} from '@/stores/misc/languages'
import {useUtilsStore} from '@/stores/utils'
import {useDefinitionsStore} from '@/stores/misc/definitions'
import { storeToRefs } from 'pinia';
import { computed, nextTick, reactive, ref } from 'vue';
import DatasetProperty from './DatasetProperty.vue'
import DatasetPager from '@/components/shared-components/dataset-pager/DatasetPager.vue'
const editor_store = useEditorStore()
const dataset_store = useDatasetStore()
const utils_store = useUtilsStore()
const definitions_store = useDefinitionsStore()
const languages_store = useLanguageStore()
const language = reactive(languages_store.language)
const {
    data,
    active
} = storeToRefs(dataset_store)
const fetched = ref<any>({})
const isDatasetCacheNotFoundError = ref<boolean>(false)

const currentId = computed(() => { 
    return (data.value[active.value.index] || {}).id; 
})

const features = computed(() => {
    const convertedFeatures: any = [];
    const features = data.value.length > 0 ? data.value[active.value.index].features : undefined
    if (features) {
        features.forEach((feat: any) => {
            if (feat.type === 'Array of image' || feat.type === 'Vector') {
                // vectorの場合shapeを表示しないため不要
                const count = feat.shape[0];
                const copiedFeat = JSON.parse(JSON.stringify(feat));
                copiedFeat.shape.shift();
                for (let i = 1; i <= count; i++) {
                    convertedFeatures.push(copiedFeat);
                }
            } else {
                convertedFeatures.push(feat);
            }
        });
        return convertedFeatures;
    }
})

function makeGetData(offset: any) {
    return (callback: any) => {
        var id = data.value.length > 0 ? data.value[active.value.index].id : undefined
        if (fetched.value.id !== id || fetched.value.offset !== offset) {
            callback.clear();
            if (!id) {
                fetched.value = { id: id, offset: offset, };
                return;
            }
            isDatasetCacheNotFoundError.value = false;
            const SHOW_MAX_COLUMN = definitions_store.Definitions.DATASET.SHOW_MAX_COLUMN;
            const GET_COLUMN_INTERVAL = definitions_store.Definitions.DATASET.GET_COLUMN_INTERVAL;
            utils_store.callApi({
                url: definitions_store.Definitions.CORE_API.usersUrl() + "/datasets/" + id + "?row=" + offset + "&numrows=" + definitions_store.Definitions.ITEMS_PER_PAGE + "&column=0&numcolumns=" + GET_COLUMN_INTERVAL,
                type: 'GET',
                dataType: 'json',
            }, (result: any) => {
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
                    }, (result: any) => $def.resolve(result), (error: any) => $def.reject(error));
                    return $def.promise();
                };
                const promiseList = [];
                for (var i = GET_COLUMN_INTERVAL; i < Math.floor(columnLength); i += GET_COLUMN_INTERVAL) {
                    promiseList.push(_getPreviewData(i))
                }

                var datasetResults = result.dataset.result;

                Promise.all(promiseList).then((responses: any) => {
                    responses.forEach((response: any) => {
                        datasetResults = datasetResults.map((datasetResult: any, i: any) => {
                            if (response.dataset.result[i]) {
                                return datasetResult.concat(response.dataset.result[i]);
                            } else {
                                return datasetResult;
                            }
                        });
                    });
                    callback.update(result.dataset.csv_header.split(','), datasetResults, columnLength);
                    editor_store.windowInit()
                    fetched.value = { id: id, offset: offset, };
                }, (reason: any) => {
                    if ((reason.responseJSON || {}).error === 'NNCD_DATASET_CACHE_NOT_FOUND') {
                        fetched.value = { id: id, offset: offset, };
                        isDatasetCacheNotFoundError.value = true;
                        callback.hideLoading();
                    } else {
                        callback.hideLoading();
                        // utils_store.handleXhrFailure(error, status, httpErrorThrown);
                    }
                });
            }, (error: any, status: any, httpErrorThrown: any) => {
                if ((error.responseJSON || {}).error === 'NNCD_BAD_DATASET_ID') {
                    data.value.filter((dataset: any) => dataset.id === id).forEach((dataset: any) => Object.assign(dataset, {
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
        var id = data.value[active.value.index].id;
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
    };
}

function getOriginalFile(value: any) {
    const datasetId = data.value[active.value.index].id;
    dataset_store.getOriginalFile(value.original, value.row, value.column, datasetId);
}

function getTotalDataset() {
    if(data.value.length > 0) {
        return data.value[active.value.index].samples
    }
    return 0
}

function hasDataset() {
    return data.value.length > 0
}

</script>
<template>
    <div class="dataset-content">
        <div v-if="hasDataset()">
            <DatasetPager
                v-show="currentId"
                :index="active.index"
                :total="getTotalDataset()"
                :make-get-data="makeGetData"
                :make-get-next-column-data="makeGetNextColumnData"
                :show-limit-warning-on-control="true"
                :is-copying="false"
                :is-dataset-cache-not-found-error="isDatasetCacheNotFoundError"
                :is-classification="false"
                :filter="''"
                :sort-key="''"
                :sort-type="''"
                :label="''"
                :is-evaluation-tab="false"
                :is-init="false"
                :features="features"
                :menu-items="undefined"
                @get-original-file="getOriginalFile" 
            />
            <DatasetProperty />
        </div>
    </div>
</template>