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
import {useEditorStore} from '@/stores/editor'
import {useDefinitionsStore} from '@/stores/misc/definitions'
import {useLanguageStore} from '@/stores/misc/languages'
import {useInferenceStore} from '@/stores/inference'
import {useEvaluationStore} from '@/stores/evaluation'
import NncRadio from '@/components/shared-components/NncRadio.vue'
import DatasetPager from '@/components/shared-components/dataset-pager/DatasetPager.vue'
import { computed, nextTick, onMounted, ref, watch, reactive } from 'vue';
const result_store = useResultStore()
const languages_store = useLanguageStore()
const definitions_store = useDefinitionsStore()
const language = reactive(languages_store.language)
const inference_store = useInferenceStore()
const evaluation_store = useEvaluationStore()
const editor_store = useEditorStore()
const _INTERVAL = 3000
const _INFER_STATUS_INTERVAL = 500
const _MAX_RETRY_COUNT = 20
const props = defineProps<{
    modals: any, 
    labelList: any, 
}>()

const {
    table_type,
    isInit,
    classification_sort_type,
    classification_sort_key,
    classification_label,
    classification_filter
} = storeToRefs(inference_store)
const {
    data,
    active,
} = storeToRefs(result_store)
const {
    plugins,
    isLoadEnd,
    projectId,
    isCopying
} = storeToRefs(editor_store)

const fetched = ref<any>({})
const colIndex = ref<number>(0)
const rowIndex = ref<number>(0)
const targetName = ref<string>('')

const currentJob = computed(() => { 
    return data.value[active.value] || {}; 
})

const InferenceJob = computed(() => { 
    return ['inference', 'evaluate'].includes(currentJob.value.type)
})

const finishedJob = computed(() => { 
    return (currentJob.value.inference_status || {}).status === 'finished'; 
})

const showClassification = computed(() => { 
    return table_type.value === 'classification_result'; 
})

const details = computed(() => { 
    return (currentJob.value.inference_status || {}).output_result; 
})

const showDetails = computed(() => { 
    return table_type.value === 'output_result'; 
})

const menuItems = computed(() => {
    return []
})

const isInferenceInit = computed(() => { 
    return isInit.value 
})

const hasConfusionMatrices = computed(() => { 
    return (currentJob.value.confusionMatrix.matrices); 
})

watch(isInferenceInit, (newValue, oldValue) => {
    fetched.value = {};
})

function updateSelectedIndex(target: any) {
    rowIndex.value = target.x;
    colIndex.value = target.y;
    targetName.value = target.name;
}

function isProcessing(inferenceResults: [][], finalLength: number) {
    return inferenceResults.some(i => i.length < finalLength)
}

function makeGetData(offset: any) {
    var isInit = false;
    var isUpdating = false;
    return (callback: any) => {
        const job = data.value[active.value];
        const id = job.job_id;
        const SHOW_MAX_COLUMN = definitions_store.Definitions.DATASET.SHOW_MAX_COLUMN;
        const GET_COLUMN_INTERVAL = definitions_store.Definitions.DATASET.GET_COLUMN_INTERVAL;
        if (!offset) {
            fetched.value = {};
        }
        if (fetched.value.id !== id || fetched.value.offset !== offset) {
            callback.clear();
            var _getData = (retryCount = 0, inferStatusAvailable=false) => {
                if(!inferStatusAvailable) {
                    if(!(job.inference_status && job.inference_status.status)) {
                        setTimeout(_getData, _INFER_STATUS_INTERVAL, retryCount, inferStatusAvailable);
                        return;
                    }
                    if(!(['evaluate', 'inference'].includes(job.type)) || job.inference_status.status !== 'finished') {
                        if (!isInit) {
                            fetched.value = {};
                            isInit = true;
                        } else {
                            isInit = false;
                        }
                        return;
                    }
    
                    if (isUpdating) {
                        return;
                    }
                    isUpdating = true;
                }
                
                inferStatusAvailable = true
                callback.showLoading();
                inference_store.getInferResult(job, offset, 0, definitions_store.Definitions.ITEMS_PER_PAGE, GET_COLUMN_INTERVAL, true, (result: any) => {
                    const inferenceResult = result.inference_result;
                    const header = inferenceResult.inference_status && inferenceResult.inference_status.output_result ? inferenceResult.inference_status.output_result.csv_header.split(',') : [];
                    var table = inferenceResult.result || [];

                    if(!(['suspended', 'finished', 'failed'].includes(inferenceResult.status))) {
                        setTimeout(_getData, _INTERVAL, retryCount, inferStatusAvailable);
                        return;
                    }
                    // finishedでもresultがなかった場合はポーリングを行う対象とする
                    if ((inferenceResult.status === 'finished' && !inferenceResult.result) && retryCount <= _MAX_RETRY_COUNT) {
                        retryCount++;
                        setTimeout(_getData, _INTERVAL, retryCount, inferStatusAvailable);
                        return;
                    }

                    const columnLength = header.length <= SHOW_MAX_COLUMN ? header.length : SHOW_MAX_COLUMN;
                    if (columnLength <= GET_COLUMN_INTERVAL) {
                        callback.update(header, table, GET_COLUMN_INTERVAL);
                        nextTick(() => {
                            editor_store.windowInit()
                            if (!table.length) {
                                callback.hideLoading();
                            }
                        });
                        fetched.value = { id: id, offset: offset, };
                        isUpdating = false;
                        return;
                    }
                    var _getInferenceResult = (column: any) => {
                        var $def = $.Deferred();
                        inference_store.getInferResult(job, offset, column, definitions_store.Definitions.ITEMS_PER_PAGE, GET_COLUMN_INTERVAL, true, (result: any) => $def.resolve(result));
                        return $def.promise();
                    };
                    const promiseList = [];
                    for (var i = GET_COLUMN_INTERVAL; i < Math.floor(columnLength); i += GET_COLUMN_INTERVAL) {
                        promiseList.push(_getInferenceResult(i));
                    }

                    Promise.all(promiseList).then((responses) => {
                        responses.forEach((response) => {
                            table = table.map((outputResult: any, i: any) => {
                                if (response.inference_result.result && response.inference_result.result[i]) {
                                    return outputResult.concat(response.inference_result.result[i]);
                                } else {
                                    return outputResult;
                                }
                            });
                        });
                        if (isProcessing(table, columnLength) && retryCount <= _MAX_RETRY_COUNT) {
                            retryCount++;
                            setTimeout(_getData, _INTERVAL, retryCount, inferStatusAvailable);
                            return;
                        }
                        callback.update(header, table, columnLength);
                        nextTick(() => {
                            editor_store.windowInit()
                            if (!table.length) {
                                callback.hideLoading();
                            }
                        });
                        fetched.value = { id: id, offset: offset, };
                        isUpdating = false;
                        return;
                    });
                });
            }
            _getData();
        }
    };
}

function makeGetNextColumnData(offset: any) {
    const GET_COLUMN_INTERVAL = definitions_store.Definitions.DATASET.GET_COLUMN_INTERVAL;
    return (callback: any, column: any) => {
        const job = data.value[active.value];
        const id = job.job_id;
        var _getData = (retryCount = 0) => {
            inference_store.getInferResult(job, offset, column, definitions_store.Definitions.ITEMS_PER_PAGE, GET_COLUMN_INTERVAL, true, (result: any) => {
                const inferenceResult = result.inference_result;
                const header = inferenceResult.inference_status ? inferenceResult.inference_status.output_result.csv_header.split(',') : [];
                var table = inferenceResult.result || [];

                if (retryCount <= _MAX_RETRY_COUNT) {
                    retryCount++;
                    setTimeout(_getData, _INTERVAL, retryCount);
                    return;
                }

                callback.update(table, column + GET_COLUMN_INTERVAL);
                nextTick(() => {
                    editor_store.windowInit()
                    if (!table.length) {
                        callback.hideLoading();
                    }
                });
            });
        }
        _getData();
    }
}

function makeClassificationData(offset: any, filter: any, sort_key: any, sort_type: any, label: any) {
    var isInit = false;
    var isUpdating = false;
    return (callback: any) => {
        const job = data.value[active.value];
        const id = job.job_id;
        if (fetched.value.id !== id || fetched.value.offset !== offset || fetched.value.filter !== filter || fetched.value.sort_key !== sort_key || fetched.value.sort_type !== sort_type || fetched.value.label !== label) {
            callback.clear();
            if(!(['evaluate', 'inference'].includes(job.type)) || job.inference_status.status !== 'finished') {
                if (!isInit) {
                    fetched.value = {};
                    isInit = true;
                } else {
                    isInit = false;
                }
                return;
            }

            if (isUpdating) {
                return;
            }
            isUpdating = true;
            if (fetched.value.filter !== filter || fetched.value.label !== label) {
                offset = 0;
            }
            var _getData = (retryCount = 0) => {
                callback.showLoading();
                callback.hideError();
                inference_store.getClassificationResult(job, offset, filter, sort_key, sort_type, (result: any) => {
                    const header = (result.header || []).map((header: any) => header.name);
                    const sortable = (result.header || []).map((header: any) => header.sortable);
                    var table = result.classification_result || [];
                    const total = result.metadata.total;

                    callback.update(header, table, total, sortable);
                    nextTick(() => {
                        editor_store.windowInit()
                        if (!table.length) {
                            callback.hideLoading();
                        }
                    });
                    fetched.value = { id: id, offset: offset, filter: filter, sort_key: sort_key, sort_type: sort_type, label: label };
                    isUpdating = false;
                    return;
                }, (error: any, status: any, httpErrorThrown: any) => {
                    if (error && error.responseJSON && error.responseJSON.error === 'AWS_S3_NOT_FOUND') {
                        callback.showError(language.NOT_FOUND_CLASSIFICATION_RESULT);
                    } else {
                        callback.showError(language.AN_UNEXPECTED_ERROR_OCCURED);
                    }
                });
            }
            _getData();
            // if(classification_label.value) {
            //     _getData();
            // }
        }
    }
}

function resetCondition() {
    classification_sort_key.value = "";
    classification_sort_type.value = "";
    classification_filter.value = "";
}

</script>
<template>
    <div style="width: 100%; height: 40px; border-bottom: solid 1px #d8d8d8">
        <KeepAlive>
            <DatasetPager 
                v-if="InferenceJob && finishedJob"
                v-show="details && showDetails"
                :total="(details || {}).data_num"
                :index="active"
                :make-get-data="makeGetData"
                :make-get-next-column-data="makeGetNextColumnData"
                :show-limit-warning-on-control="true"
                :is-copying="isCopying"
                :is-dataset-cache-not-found-error="false"
                :is-classification="false"
                filter=""
                sort-key=""
                sort-type=""
                label=""
                :features=null
                :is-evaluation-tab="false"
                :is-inference-tab="true"
                :is-init="isInit"
                :menuItems="undefined"
                @updateSelectedIndex="updateSelectedIndex"
            />
        </KeepAlive>
        <KeepAlive>
            <DatasetPager 
                v-if="InferenceJob && finishedJob && showClassification"
                :total="(details || {}).data_num"
                :index="active"
                :make-get-data="makeClassificationData"
                :make-get-next-column-data="() => undefined"
                :show-limit-warning-on-control="false"
                :is-copying="isCopying"
                :is-dataset-cache-not-found-error="false"
                :is-classification="true"
                :filter="classification_filter"
                :sort-key="classification_sort_key"
                :sort-type="classification_sort_type"
                :label="classification_label"
                :is-evaluation-tab="false"
                :is-inference-tab="true"
                :is-init="isInit"
                :features="undefined"
                :menu-items="undefined"
                @total="value => currentJob.classificationResult.total = value"
                @sort_key="value => classification_sort_key = value"
                @sort_type="value => classification_sort_type = value"
                @reset_condition="resetCondition"
            />
        </KeepAlive>
        <div class="action-bar-inference">
            <span class="infer-radio-btn">
                <NncRadio v-model="table_type" choice="output_result" :label="language.training.OUTPUT_RESULT" :disabled="false"/>
            </span>


            <template v-if="hasConfusionMatrices">
                <span class="infer-radio-btn">
                    <NncRadio v-model="table_type" choice="classification_result" :label="language.training.CLASSIFICATION_RESULT" :disabled="false"/>
                </span>
                <label class="select_label" style="display: none;">
                    <select class="select_menu" v-model="classification_label" @change="resetCondition">
                        <option v-for="option in modals" v-bind:value="option">
                            {{ option }}
                        </option>
                    </select>
                </label>
            </template>
            <template v-else>
                <span class="infer-radio-btn">
                    <NncRadio v-model="table_type" choice="classification_result" :label="language.training.CLASSIFICATION_RESULT" disabled />
                </span>
            </template>

        </div>
    </div>
</template>

<style scoped>
.infer-radio-btn {
    padding-left: 12px; 
    line-height: 40px;
}
</style>