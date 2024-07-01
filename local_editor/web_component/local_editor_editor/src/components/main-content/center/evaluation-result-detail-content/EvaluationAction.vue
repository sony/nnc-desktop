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
import {useEvaluationStore} from '@/stores/evaluation'
import {useUtilsStore} from '@/stores/utils'
import NncRadio from '@/components/shared-components/NncRadio.vue'
import { computed, nextTick, onMounted, ref, watch, reactive } from 'vue';
import DatasetPager from '@/components/shared-components/dataset-pager/DatasetPager.vue'
const result_store = useResultStore()
const definitions_store = useDefinitionsStore()
const utils_store = useUtilsStore()
const evaluation_store = useEvaluationStore()
const editor_store = useEditorStore()
const languages_store = useLanguageStore()
const language = reactive(languages_store.language)
const _INTERVAL = 3000
const _INFER_STATUS_INTERVAL = 500
const _MAX_RETRY_COUNT = 20
const props = defineProps<{
    modals: any, 
    labelList: any, 
}>()
const {
    plugins,
    isLoadEnd,
    projectId,
    isCopying
} = storeToRefs(editor_store)
const {
    data,
    active,
    graph
} = storeToRefs(result_store)
const {
    table_type,
    isInit,
    classification_sort_type,
    classification_sort_key,
    classification_label,
    classification_filter
} = storeToRefs(evaluation_store)
const fetched = ref<any>({})
const colIndex = ref<number>(0)
const rowIndex = ref<number>(0)
const targetName = ref<string>('')

const currentJob = computed(() => { 
    return data.value[active.value] || {}; 
})

const evaluationJob = computed(() => { 
    return ['evaluate', 'inference'].includes(currentJob.value.type)
})

const finishedJob = computed(() => { 
    return (currentJob.value.evaluate_status || {}).status === 'finished'; 
})

const details = computed(() => { 
    return (currentJob.value.evaluate_status || {}).output_result; 
})

const showDetails = computed(() => { 
    return table_type.value === 'output_result'; 
})

const showClassification = computed(() => { 
    return table_type.value === 'classification_result'; 
})

const hasConfusionMatrices = computed(() => { 
    return (currentJob.value.confusionMatrix.matrices); 
})

const isEvaluationInit = computed(() => { 
    return isInit.value 
})

const menuItems = computed(() => {
    return [
        { type: 'submenu', text: 'Plugins', submenu: plugins.value.map((plugin: any) => {
            return {
                type: 'action',
                text: plugin.plugin_name,
                action: showPluginDialog.bind(this, plugin.plugin_id),
            };
        })},
    ];
})

function updateSelectedIndex(target: any) {
    rowIndex.value = target.x;
    colIndex.value = target.y;
    targetName.value = target.name;
}

function showPluginDialog(pluginId: any) {
    const plugin = plugins.value.find((plugin: any) => plugin.plugin_id === pluginId);
    if (!plugin) {
        return;
    }
    const target = {
        x: rowIndex.value,
        y: colIndex.value,
        name: targetName.value,
    };
    editor_store.showPluginDialog(plugin, target, [{name: 'Cancel', }, {name: 'OK', action: (value: any) => {
        const outputName = (value.find((val: any) => {
            return val.name === 'output';
        }) || {}).value || '';
        const activeResult = data.value[active.value];
        const jobId = activeResult.job_id;
        isLoadEnd.value = false;
        utils_store.callApi({
            url: definitions_store.Definitions.CORE_API.usersUrl() + '/projects/' + projectId.value + '/jobs/' + jobId + '/plugins/' + pluginId,
            type: 'post',
            data: JSON.stringify({
                parameters: value
            }),
            contentType: 'application/json',
            dataType: 'json',
        }, (result: any) => {
            utils_store.callApi({
                url: definitions_store.Definitions.CORE_API.usersUrl() + '/projects/' + projectId.value + '/jobs/' + jobId + '/plugins/results',
                type: 'get',
                dataType: 'json',
            }, (pluginResultsResponse: any) => {
                const pluginIdAndName = pluginId + outputName;
                Object.assign(activeResult, {
                    pluginResults: pluginResultsResponse.results.map((result: any) => {
                        return Object.assign(result, {
                            pluginIdAndName: result.plugin_id + result.name,
                        });
                    }),
                    selectedPluginIdAndName: pluginIdAndName,
                });
                nextTick(() => {
                    table_type.value = 'others';
                });
            }, utils_store.handleXhrFailure, () => {
                isLoadEnd.value = true;
            });
        }, (error: any, status: any, httpErrorThrown: any) => {
            isLoadEnd.value = true;
            utils_store.handleXhrFailure(error, status, httpErrorThrown);
        });
    }, }, ]);
}

function isProcessing(evaluationResults: any) {
    return evaluationResults.some((results: any) => results.some((result: any) => result.status === 'processing'));
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
            var _getData = (retryCount=0, evalStatusAvailable=false) => {
                if(!evalStatusAvailable) {
                    if(!job.evaluate_status.status) {
                        setTimeout(_getData, _INFER_STATUS_INTERVAL, retryCount, evalStatusAvailable);
                        return;
                    }
                    if(!(['evaluate', 'inference'].includes(job.type)) || job.evaluate_status.status !== 'finished') {
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

                evalStatusAvailable = true
                callback.showLoading();
                evaluation_store.getEvaluationResult(job, offset, 0, definitions_store.Definitions.ITEMS_PER_PAGE, GET_COLUMN_INTERVAL, true, (result: any) => {
                    const evaluationResult = result.evaluation_result;
                    const header = evaluationResult.evaluate_status && evaluationResult.evaluate_status.output_result ? evaluationResult.evaluate_status.output_result.csv_header.split(',') : [];
                    var table = evaluationResult.result || [];

                    if(!(['suspended', 'finished', 'failed'].includes(evaluationResult.status))) {
                        setTimeout(_getData, _INTERVAL, retryCount, evalStatusAvailable);
                        return;
                    }
                    // finishedでもresultがなかった場合はポーリングを行う対象とする
                    if ((evaluationResult.status === 'finished' && !evaluationResult.result || isProcessing(table)) && retryCount <= _MAX_RETRY_COUNT) {
                        retryCount++;
                        setTimeout(_getData, _INTERVAL, retryCount, evalStatusAvailable);
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
                    var _getEvaluationResult = (column: any) => {
                        var $def = $.Deferred();
                        evaluation_store.getEvaluationResult(job, offset, column, definitions_store.Definitions.ITEMS_PER_PAGE, GET_COLUMN_INTERVAL, true, (result: any) => $def.resolve(result));
                        return $def.promise();
                    };
                    const promiseList = [];
                    for (var i = GET_COLUMN_INTERVAL; i < Math.floor(columnLength); i += GET_COLUMN_INTERVAL) {
                        promiseList.push(_getEvaluationResult(i));
                    }

                    Promise.all(promiseList).then((responses) => {
                        responses.forEach((response) => {
                            table = table.map((outputResult: any, i: any) => {
                                if (response.evaluation_result.result && response.evaluation_result.result[i]) {
                                    return outputResult.concat(response.evaluation_result.result[i]);
                                } else {
                                    return outputResult;
                                }
                            });
                        });
                        if (isProcessing(table) && retryCount <= _MAX_RETRY_COUNT) {
                            retryCount++;
                            setTimeout(_getData, _INTERVAL, retryCount, evalStatusAvailable);
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
            evaluation_store.getEvaluationResult(job, offset, column, definitions_store.Definitions.ITEMS_PER_PAGE, GET_COLUMN_INTERVAL, true, (result: any) => {
                const evaluationResult = result.evaluation_result;
                const header = evaluationResult.evaluate_status ? evaluationResult.evaluate_status.output_result.csv_header.split(',') : [];
                var table = evaluationResult.result || [];

                if (isProcessing(table) && retryCount <= _MAX_RETRY_COUNT) {
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
            if(!(['evaluate', 'inference'].includes(job.type)) || job.evaluate_status.status !== 'finished') {
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
                evaluation_store.getClassificationResult(job, offset, filter, sort_key, sort_type, (result: any) => {
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
            if(classification_label.value) {
                _getData();
            }
        }
    }
}

function resetCondition() {
    classification_sort_key.value = "";
    classification_sort_type.value = "";
    classification_filter.value = "";
}

watch(isEvaluationInit, (newValue, oldValue) => {
    fetched.value = {};
})

</script>
<template>
    <div class="evaluate-action">
        <KeepAlive>
            <DatasetPager 
                v-if="evaluationJob && finishedJob"
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
                :is-evaluation-tab="true"
                :is-inference-tab="false"
                :is-init="isInit"
                :menuItems="menuItems"
                @updateSelectedIndex="updateSelectedIndex"
            />
        </KeepAlive>
        <KeepAlive>
            <DatasetPager 
                v-if="evaluationJob && finishedJob && showClassification"
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
                :is-evaluation-tab="true"
                :is-inference-tab="false"
                :is-init="isInit"
                :features="undefined"
                :menu-items="undefined"
                @total="value => currentJob.classificationResult.total = value"
                @sort_key="value => classification_sort_key = value"
                @sort_type="value => classification_sort_type = value"
                @reset_condition="resetCondition"
            />
        </KeepAlive>
        <div class="action-bar-evaluate">
            <span class="action-bar-evaluate-action-type">
                <NncRadio v-model="table_type" choice="output_result" :label="language.training.OUTPUT_RESULT" :disabled="false"/>
                <NncRadio v-model="table_type" choice="confusion_matrix" :label="language.training.CONFUSION_MATRIX" :disabled="false"/>
            </span>
            <label class="select_label">
                <select class="select_menu" v-model="currentJob.confusionMatrix.selectedModal">
                    <option v-for="option in modals" v-bind:value="option">
                        {{ option }}
                    </option>
                </select>
            </label>
            <span class="action-bar-evaluate-action-type">
                <NncRadio v-model="table_type" choice="others" :label="language.training.OTHERS" :disabled="false"/>
            </span>
            <label class="select_label">
                <select class="select_menu" v-model="currentJob.selectedPluginIdAndName" :disabled="table_type !== 'others'">
                    <option v-for="pluginResult in currentJob.pluginResults || []" :value="pluginResult.pluginIdAndName">
                        {{ pluginResult.name }}
                    </option>
                </select>
            </label>
        </div>
        <div v-if="hasConfusionMatrices">
            <span class="action-bar-evaluate-action-type">
                <NncRadio v-model="table_type" choice="classification_result" :label="language.training.CLASSIFICATION_RESULT" :disabled="false"/>
            </span>
            <label class="select_label">
                <select class="select_menu" v-model="classification_label" @change="resetCondition">
                    <option v-for="option in modals" v-bind:value="option">
                        {{ option }}
                    </option>
                </select>
            </label>
            <span class="action-bar-evaluate-action-type">
                <NncRadio v-model="table_type" choice="classification_matrix" :label="language.training.CLASSIFICATION_MATRIX" :disabled="false"/>
            </span>
            <label class="select_label">
                <select class="select_menu" v-model="currentJob.classificationMatrix.selectedModal">
                    <option v-for="option in labelList" v-bind:value="option">
                        {{ option }}
                    </option>
                </select>
            </label>
            <span class="action-bar-evaluate-action-type">
                <NncRadio v-model="table_type" choice="likelihood_graph" :label="language.training.LIKELIHOOD_GRAPH" :disabled="false"/>
            </span>
            <label class="select_label">
                <select class="select_menu" v-model="classification_label">
                    <option v-for="option in modals" v-bind:value="option">
                        {{ option }}
                    </option>
                </select>
            </label>
        </div>
        <div v-else>
            <span class="action-bar-evaluate-action-type">
                <NncRadio v-model="table_type" choice="classification_result" :label="language.training.CLASSIFICATION_RESULT" disabled />
                <NncRadio v-model="table_type" choice="classification_matrix" :label="language.training.CLASSIFICATION_MATRIX" disabled />
                <NncRadio v-model="table_type" choice="likelihood_graph" :label="language.training.LIKELIHOOD_GRAPH" disabled />
            </span>
        </div>
    </div>
</template>