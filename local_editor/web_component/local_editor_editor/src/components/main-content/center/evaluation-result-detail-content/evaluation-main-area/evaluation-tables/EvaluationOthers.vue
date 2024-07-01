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
import { computed, onMounted, ref, watch, reactive, nextTick, onBeforeUnmount } from 'vue';
import NncLoading from '@/components/shared-components/NncLoading.vue'
import ContextMenu from'@/components/shared-components/context-menu/ContextMenu.vue'
import {useEvaluationStore} from '@/stores/evaluation'
import {useEditorStore} from '@/stores/editor'
import {useUtilsStore} from '@/stores/utils'
import {useLanguageStore} from '@/stores/misc/languages'
import {useDefinitionsStore} from '@/stores/misc/definitions'
import {useResultStore} from '@/stores/result'
const definitions_store = useDefinitionsStore()
const editor_store = useEditorStore()
const evaluation_store = useEvaluationStore()
const utils_store = useUtilsStore()
const languages_store = useLanguageStore()
const language = reactive(languages_store.language)
const props = defineProps<{
    selectedPluginIdAndName: string, 
    pluginResults: any
}>()
const result_store = useResultStore()
const {
    projectId
} = storeToRefs(editor_store)
const {
    data,
    active,
    graph
} = storeToRefs(result_store)
const {
    colIndex,
    rowIndex,
    classification_label,
    classification_filter,
    classification_sort_key,
    classification_sort_type,
    table_type
} = storeToRefs(evaluation_store)

const dataType = ref<string>('')
const b64Data = ref<string>('')
const csvData = ref<any>([])
const log = ref<string>('')
const logUrl = ref<string>('')
const logTimerId = ref<any>(NaN)
const resultTimerId = ref<any>(NaN)
const isInit = ref<boolean>(false)
const isFirst = ref<boolean>(false)
const menu_items = ref<any>([
    { type: 'action', text: 'Save CSV as...', action: save_as_csv }
])
const context_menu = ref<any>(null)
const evaluation_others_root = ref<any>(null)

const base64Image = computed(() => {
    return 'data:' + dataType.value + ';base64,' + b64Data.value;
})

const maxCsvDataLength = computed(() => {
    return csvData.value.reduce((a: any, b: any) => a.length > b.length ? a : b).length;
})

watch(() => props.selectedPluginIdAndName, (newValue, oldValue) => {
    if (!isFirst.value) {
        // 初回はmountedとwatchと二回呼ばれてしまう為skip
        isFirst.value = true;
        return;
    }
    init();
    const activeResult = data.value[active.value];
    const jobId = activeResult.job_id;
    const plugin = props.pluginResults.find((pluginResult: any) => pluginResult.pluginIdAndName === props.selectedPluginIdAndName);
    if (!plugin) {
        return;
    }
    getPluginResult(plugin.plugin_id, plugin.name, jobId);
  }
)

onMounted(() => {
    const activeResult = data.value[active.value];
    const jobId = activeResult.job_id;
    if (props.selectedPluginIdAndName) {
        const plugin = props.pluginResults.find((pluginResult: any) => pluginResult.pluginIdAndName === props.selectedPluginIdAndName);
        if (!plugin) {
            return;
        }
        getPluginResult(plugin.plugin_id, plugin.name, jobId);
        isFirst.value = true;
    } else {
        utils_store.callApi({
            url: definitions_store.Definitions.CORE_API.usersUrl() + '/projects/' + projectId.value + '/jobs/' + jobId + '/plugins/results',
            type: 'get',
            dataType: 'json',
        }, (pluginResultsResponse: any) => {
            if (pluginResultsResponse.results.length) {
                const plugin = pluginResultsResponse.results[0];
                const pluginIdAndName = plugin.plugin_id + plugin.name;
                activeResult.selectedPluginIdAndName = pluginIdAndName;
                activeResult.pluginResults = pluginResultsResponse.results.map((result: any) => {
                    return Object.assign(result, {
                        pluginIdAndName: result.plugin_id + result.name,
                    });
                });
                nextTick(() => {
                    getPluginResult(plugin.plugin_id, plugin.name, jobId);
                });
            } else {
                isInit.value = true;
            }
        }, utils_store.handleXhrFailure);
    }
})

onBeforeUnmount(() => {
    clearTimeout(logTimerId.value);
    clearTimeout(resultTimerId.value);
})

function open_menu(event: any) {
    event.preventDefault();
    context_menu.value.open_menu({ 'parent': evaluation_others_root.value, 'event': event });
}

function save_as_csv() {
    const plugin = props.pluginResults.find((pluginResult: any) => pluginResult.pluginIdAndName === props.selectedPluginIdAndName);
    if (!plugin) {
        return;
    }
    let content = '';
    const a = document.createElement('a');
    a.download = `${plugin.name}.csv`;
    csvData.value.forEach((row: any) => {
        addPadding(row).forEach((column: any, i: any) => {
            content += column;
            if (row.length - 1 !== i) {
                content += ', ';
            }
        });
        content += '\n';
    });
    const blob = new Blob([content], {type: 'text/csv'});
    const blobURL = window.URL.createObjectURL(blob);
    a.href = blobURL;
    a.click();
}

function downloadImage() {
    const canvas = document.createElement('canvas');
    const ctx: any = canvas.getContext('2d');
    const img = new Image();
    img.src = base64Image.value;
    img.onload = () => {
        const plugin = props.pluginResults.find((pluginResult: any) => pluginResult.pluginIdAndName === props.selectedPluginIdAndName);
        if (!plugin) {
            return;
        }
        ctx.drawImage(img, 0, 0, img.width, img.height);
        const link = document.createElement('a');
        link.href = canvas.toDataURL();
        link.download = plugin.name + '.' + dataType.value.replace(/image\//, '');
        link.click();
    };
}

function addPadding(row: any) {
    const padNum = maxCsvDataLength.value - row.length;
    for (let i = 0; i < padNum; i++) {
        row.push('');
    }
    return row;
}

function init() {
    dataType.value = '';
    b64Data.value = '';
    csvData.value = [];
    log.value = '';
    logUrl.value = '';
    logTimerId.value = NaN;
    resultTimerId.value = NaN;
    isInit.value = false;
    clearTimeout(logTimerId.value);
    clearTimeout(resultTimerId.value);
}

function getPluginResult(pluginId: any, name: any, jobId: any, count = 0) {
    if (!isSelectedPlugin(pluginId, name)) {
        return;
    }
    clearTimeout(resultTimerId.value);
    utils_store.callApi({
        url: definitions_store.Definitions.CORE_API.usersUrl() + '/projects/' + projectId.value + '/jobs/' + jobId + '/plugins/' + pluginId +'/result?name=' + name,
        type: 'get',
        dataType: 'json',
    }, (result: any) => {
        if (!isSelectedPlugin(pluginId, name)) {
            return;
        }
        isInit.value = true;
        dataType.value = result.data_type;
        b64Data.value = result.b64_data || '';
        csvData.value = result.csv_data || [];
    }, (error: any, status: any, httpErrorThrown: any) => {
        if (!isSelectedPlugin(pluginId, name)) {
            return;
        }
        if ((error.responseJSON || {}).error === 'NNCD_PLUGIN_RESULT_EMPTY') {
            // まだ作成されていない場合
            b64Data.value = '';
            csvData.value = [];
            if (count < (definitions_store.Definitions.PLUGIN.MAX_POLLING_TIME / definitions_store.Definitions.PLUGIN.GET_RESULT_POLLING_INTERVAL)) {
                resultTimerId.value = setTimeout(() => {
                    getPluginResult(pluginId, name, jobId, ++count);
                }, definitions_store.Definitions.PLUGIN.GET_RESULT_POLLING_INTERVAL);
                if (!log.value) {
                    getLogUrl(pluginId, name);
                }
            }
        } else {
            utils_store.handleXhrFailure(error, status, httpErrorThrown);
        }
    });
}

function getLogUrl(pluginId: any, name: any) {
    const activeResult = data.value[active.value];
    const jobId = activeResult.job_id;
    utils_store.callApi({
        url: definitions_store.Definitions.CORE_API.usersUrl() + '/projects/' + projectId.value + '/jobs/' + jobId + '/plugins/' + pluginId +'/log_url?name=' + name,
        type: 'get',
        dataType: 'json',
    }, (result: any) => {
        if (!isSelectedPlugin(pluginId, name)) {
            return;
        }
        logUrl.value = result.log_url;
        getLog(pluginId, name);
    }, utils_store.handleXhrFailure);
}

function getLog(pluginId: any, name: any, count = 0) {
    clearTimeout(logTimerId.value);
    if (!logUrl.value) {
        return;
    }
    utils_store.callApi({
        url: logUrl.value,
        type: 'get',
        headers: null,
        xhrFields: { withCredentials: false },
    }, (result: any) => {
        if (!isSelectedPlugin(pluginId, name)) {
            return;
        }
        log.value = result;
        isInit.value = true;
        if (!b64Data.value && !csvData.value.length && (count < (definitions_store.Definitions.PLUGIN.MAX_POLLING_TIME / definitions_store.Definitions.PLUGIN.LOG_POLLING_INTERVAL))) {
            logTimerId.value = setTimeout(() => {
                getLog(pluginId, name, ++count);
            }, definitions_store.Definitions.PLUGIN.LOG_POLLING_INTERVAL);
        }
    });
}

function isSelectedPlugin(pluginId: any, name: any) {
    return (pluginId + name) === props.selectedPluginIdAndName;
}

</script>
<template>
<div ref="evaluation_others_root" style="height:100%;">
    <table id="plugin-result-table" class="table table-bordered" v-if="b64Data">
        <thead>
            <tr>
                <th class="index-column">Index</th>
                <th>Result</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>1</td>
                <td>
                    <img @click="downloadImage" :src="base64Image" class="data-table-image" />
                </td>
            </tr>
        </tbody>
    </table>
    <div v-else-if="csvData.length" @contextmenu="open_menu($event)" style="position: relative">
        <table class="table table-bordered">
            <tbody>
                <tr v-for="row in csvData" class="evaluation-others-tr">
                    <td v-for="col in addPadding(row)">{{col}}</td>
                </tr>
            </tbody>
        </table>
        <ContextMenu ref="context_menu" :menuItems="menu_items" :is-sub="false"/>
    </div>
    <div v-else-if="!b64Data && !csvData.length && log">
        <div class="plugin-log-area">
            {{log}}
        </div>
    </div>
    <div v-else-if="!isInit">
        <NncLoading />
    </div>
</div>
</template>