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
import { computed, nextTick, onBeforeUpdate, onMounted, reactive, ref } from 'vue';
import CheckWhiteSVG from "@/assets/image/CheckWhite.svg"
import {useLanguageStore} from '@/stores/misc/languages'
import {useEditorStore} from '@/stores/editor'
import {useDefinitionsStore} from '@/stores/misc/definitions'
import {useUtilsStore} from '@/stores/utils'
import {useResultStore} from '@/stores/result'
import { storeToRefs } from 'pinia';
import JobCostAndErrors from '@/objects/JobCostAndErrors'
import ContextMenu from '@/components/shared-components/context-menu/ContextMenu.vue'
import NncCheckbox from '@/components/shared-components/NncCheckbox.vue'
import NncButton from '@/components/shared-components/NncButton.vue'
const result_store = useResultStore()
const utils_store = useUtilsStore()
const editor_store = useEditorStore()
const definitions_store = useDefinitionsStore()
const languages_store = useLanguageStore()
const language = reactive(languages_store.language)
const {
    graph,
} = storeToRefs(result_store)
const {
    readOnly,
    isCopying,
    postingJob,
    isShowInLocalEditor,
    activeTabName
} = storeToRefs(editor_store)
const jobs_area_root = ref<any>(null)
const context_menu_for_all = ref<any>(null)
const context_menu = ref<any>(null)
const selected_result = ref<any>()
const result_menu_items = ref<any>([
    { type: 'action', text: language.training.jobContextMenu.RENAME, action: rename },
    { type: 'separator' },
    { type: 'action', text: language.training.jobContextMenu.OPEN_LEARNING_CURVE, action: open_comparison },
    { type: 'action', text: language.training.jobContextMenu.CLEAR_LEARNING_CURVE, action: clear_comparison },
    { type: 'separator' },
    { type: 'action', text: language.training.jobContextMenu.SUSPEND, action: suspendLearning},
    { type: 'action', text: language.training.jobContextMenu.RESUME, action: resumeJob },
    { type: 'separator' },
    { type: 'submenu', text: language.training.jobContextMenu.EXPORT, submenu: []},
    { type: 'action', text: language.training.jobContextMenu.RE_EDIT, action: open_reedit },
    { type: 'separator' },
    { type: 'action', text: language.training.jobContextMenu.DELETE, action: delete_confirm }
])

const read_only_result_menu_items = ref<any>([
    { type: 'action', text: language.training.jobContextMenu.RENAME, action: rename, disabled: true },
    { type: 'separator' },
    { type: 'action', text: language.training.jobContextMenu.OPEN_LEARNING_CURVE, action: open_comparison },
    { type: 'action', text: language.training.jobContextMenu.CLEAR_LEARNING_CURVE, action: clear_comparison },
    { type: 'separator' },
    { type: 'action', text: language.training.jobContextMenu.SUSPEND, action: suspendLearning, disabled: true },
    { type: 'action', text: language.training.jobContextMenu.RESUME, action: resumeJob, disabled: true },
    { type: 'separator' },
    { type: 'submenu', text: language.training.jobContextMenu.EXPORT, submenu: []},
    { type: 'action', text: language.training.jobContextMenu.RE_EDIT, action: open_reedit, disabled: true },
    { type: 'separator' },
    { type: 'action', text: language.training.jobContextMenu.DELETE, action: delete_confirm, disabled: true }
])

const nontarget_menu_items = ref<any>([
    { type: 'action', text: language.training.jobContextMenu.RENAME, disabled: true },
    { type: 'separator' },
    { type: 'action', text: language.training.jobContextMenu.OPEN_LEARNING_CURVE, disabled: true },
    { type: 'action', text: language.training.jobContextMenu.CLEAR_LEARNING_CURVE, action: clear_comparison },
    { type: 'separator' },
    { type: 'action', text: language.training.jobContextMenu.SUSPEND, disabled: true },
    { type: 'action', text: language.training.jobContextMenu.RESUME, disabled: true },
    { type: 'separator' },
    { type: 'action', text: language.training.jobContextMenu.EXPORT, disabled: true },
    { type: 'action', text: language.training.jobContextMenu.RE_EDIT, disabled: true },
    { type: 'separator' },
    { type: 'action', text: language.training.jobContextMenu.DELETE, disabled: true }
])

const menu_items_for_all = ref<any>([
    { type: 'action', text: language.training.jobContextMenu.DELETE_ALL_INCOMPLETE, action: delete_all_incompletes }
])

const read_only_menu_items_for_all = ref<any>([
    { type: 'action', text: language.training.jobContextMenu.DELETE_ALL_INCOMPLETE, action: delete_all_incompletes, disabled: true }
])

const isLoading = ref<boolean>(false)

onMounted(() => {
    updateProgressIcons()
})

onBeforeUpdate(() => {
    updateProgressIcons()
})

const menu_items = computed(() => {
    /* nncd: add let and if, then modify return value */
    let items = selected_result.value ? readOnly.value ? read_only_result_menu_items.value : result_menu_items.value : nontarget_menu_items.value;
    return items;
    // return this.selected_result ? this.readOnly ? this.read_only_result_menu_items : this.result_menu_items : this.nontarget_menu_items;
    /********/
})

const get_menu_items_for_all = computed(() => {
    return menu_items_for_all.value
})

function showError(error: any) {
    return typeof error === 'number' ? error.toFixed(6) : "-";
}

function showCost(job: any) {
    const costAndErrors = new JobCostAndErrors(job, graph.value.cost_type)
    return costAndErrors.cost('-').toLocaleString();
}

function changeActive(_result: any) {
    result_store.changeActive(_result.job_id);
}

function select_result(result: any) {
    selected_result.value = result;
}

function open_menu(result: any, event: any, type?: any) {
    event.preventDefault();
    var emitEvent = 'open';
    if ((result && result != 'active') || (result == 'active' && result_store.getActiveResult() ) ) {
        if (result == 'active') {
            result = result_store.getActiveResult();
        }
        var _createSubmenu = () => {
            const submenu: any = [];
            const availableDownloadFormats = result.download_formats || [];
            editor_store.downloadFormats.filter((downloadObj: any) => {
                return availableDownloadFormats.findIndex((format: any) => format === downloadObj.name) !== -1;
            }).forEach((downloadFormat: any) => {
                let locale = definitions_store.Definitions.LOCALE
                submenu.push({
                    type: 'action',
                    text: locale ? downloadFormat.description[locale] : '',
                    action: download.bind(null, downloadFormat.name),
                    disabled: !(['train', 'evaluate', 'inference'].includes(result.type) && ['suspended', 'finished', 'failed'].includes(result.status) && result.train_status && result.download_formats)
                });
            });
            if (submenu.filter((menu: any) => !menu.disabled).length) {
                submenu.push({
                    type: 'action',
                    text: 'html beta',
                    action: downloadHtml.bind(null, result.job_id),
                    disabled: !(['train', 'evaluate', 'inference'].includes(result.type) && ['suspended', 'finished', 'failed'].includes(result.status) && result.train_status && result.download_formats && !editor_store.isCreateReport)
                });
            }
            return submenu;
        };
        var item_suspend = result_menu_items.value.find((menu_item: any) => menu_item.text == language.training.jobContextMenu.SUSPEND);
        var suspendable_ = (state: any) => ['queued', 'preprocessing', 'processing'].includes(state) && result.type !== 'inference';
        if (item_suspend) item_suspend.disabled = !suspendable_(result.status);
        result_menu_items.value.find((menu_item: any) => menu_item.text === language.training.jobContextMenu.RESUME).disabled = (result.status !== 'suspended' && result.status !== 'failed') || result.type === 'inference' || editor_store.forceRegister;
        result_menu_items.value.find((menu_item: any) => menu_item.text === language.training.jobContextMenu.EXPORT).submenu = _createSubmenu();
        read_only_result_menu_items.value.find((menu_item: any) => menu_item.text === language.training.jobContextMenu.EXPORT).submenu = _createSubmenu();
        result_menu_items.value.find((menu_item: any) => menu_item.text === language.training.jobContextMenu.RE_EDIT).disabled = ['queued', 'preprocessing'].includes(result.status);
    } else {
        result = '';
    }
    select_result(result);
    var params: any = { 'parent': jobs_area_root.value, 'event': event };
    if(type == 'dropdown') {
        var el: any = document.elementFromPoint(event.clientX, event.clientY);
        params.point = {
            x: el.x,
            y: el.y + el.height
        };
        params.excludeClass = event.target.className;
        if (context_menu.value.open && (result_store.getActiveResult() || {}).job_id === result.job_id) {
            emitEvent = 'close_menu';
        }
    }
    if(emitEvent === 'open') {
        context_menu.value.open_menu(params);
    } else if(emitEvent === 'close_menu') {
        context_menu.value.closeMenu(params);
    }
    changeActive(result);
}

function open_menu_for_all(event: any, type?: any) {
    event.preventDefault();
    var params: any = { 'parent': jobs_area_root.value, 'event': event };
    var emitEvent = 'open';
    if(type == 'dropdown') {
        var el: any = document.elementFromPoint(event.clientX, event.clientY);
        params.point = {
            x: el.x,
            y: el.y + el.height
        };
        params.excludeClass = event.target.className;
        if (context_menu_for_all.value.open && context_menu_for_all.value.excludeClass === event.target.className) {
            emitEvent = 'close_menu';
        }
    }
    if(emitEvent === 'open') {
        context_menu_for_all.value.open_menu(params);
    } else if(emitEvent === 'close_menu') {
        context_menu_for_all.value.closeMenu(params);
    }
}

function download(type: any) {
    editor_store.onDownload(type)
}

function downloadHtml(jobId: any) {
    editor_store.exportHtml(jobId);
}

function rename() {
    editor_store.prompt(
        definitions_store.Definitions.strings.prompt_message('result'),
        selected_result.value.job_name,
        [ {name: 'Cancel', }, {name: 'OK', action: (newName: any) => {
            if (newName) {
                utils_store.callApi({
                    url: definitions_store.Definitions.CORE_API.usersUrl() + "/projects/" + editor_store.projectId + "/jobs/" + result_store.getActiveResult().job_id + "/job_name",
                    type: 'PUT',
                    data: JSON.stringify({ job_name: newName }),
                    contentType: 'application/json',
                    dataType: 'json',
                }, (result: any) => {
                    selected_result.value.job_name = newName;
                }, utils_store.handleXhrFailure);
            }
        }, }, ]);
}

function open_comparison() {
    result_store.graph.comparison_id = selected_result.value.job_id;
}

function clear_comparison() {
    result_store.graph.comparison_id = "";
}

function suspendLearning() {
    editor_store.onTriggeredJob('suspend')
}

function resumeJob() {
    editor_store.onTriggeredJob(
        'resume',
        result_store.getActiveResult().instance_group,
        editor_store.numNodes[result_store.getActiveResult().job_id][result_store.getActiveResult().instance_group]
    )
}

function open_reedit() {
    editor_store.onOpenReEdit()
}

function delete_confirm() {
    var delete_job = result_store.getActiveResult();
    var msg = utils_store.format(language.DO_YOU_WANT_TO_DELETE_JOB, delete_job.job_name) + '?';
    editor_store.popup(
        language.COMFIRM, msg,
        [{name: 'Cancel',}, {name: 'OK', action: () => {
            _delete(delete_job.job_id, true);
        }, }, ]);
}

function delete_all_incompletes() {
    editor_store.popup(
        language.COMFIRM, language.DO_YOU_REALLY_WANT_TO_DELETE_INCOMPLETE_RESULTS,
        [{name: 'Cancel',}, {name: 'OK', action: () => {
            const currentJobId = (result_store.data[result_store.active] || {}).job_id;
            var isChangeActive = false;
            result_store.data.filter((result: any) => result.status === "failed").forEach((job: any) => {
                _delete(job.job_id, false);
                if (currentJobId === job.job_id) {
                    isChangeActive = true;
                }
            });
            if (isChangeActive) {
                if (!result_store.data.length) {
                    result_store.active = -1;
                }
                result_store.changeActive((result_store.data[0] || {}).job_id);
            }
        }, }, ]);
}

function _delete(job_id: any, isChangeActive: boolean) {
    utils_store.callApi({
        url: definitions_store.Definitions.CORE_API.usersUrl() + "/projects/" + editor_store.projectId + "/jobs/" + job_id,
        type: 'DELETE',
        dataType: 'json',
    }, (result: any) => {
    }, utils_store.handleXhrFailure);
    result_store.deleteResult(job_id, isChangeActive);
}

function showUiState(result: any) {
    let type = result.type
    let state = result.status

    if(['finished', 'suspended', 'failed'].includes(state)) {
        switch (activeTabName.value) {
            case "TRAINING":
            case "EVALUATION":
                if(result.train_status) {
                    type = "train"
                    state = result.train_status.status
                }
                if(result.evaluate_status) {
                    type = "evaluate"
                    state = result.evaluate_status.status
                }
                break
            case "INFERENCE":
                if(result.inference_status) {
                    type = "inference"
                    state = result.inference_status.status
                }
                break
        }
    }

    switch (type + "_" + state) {
        case "profile_queued":
        case "train_queued":
        case "evaluate_queued":
            return language.jobStatus.SCHEDULED;

        case "profile_preprocessing":
            return language.jobStatus.BEFOREPROFILING;
        case "train_preprocessing":
            return language.jobStatus.BEFORETRAINING;
        case "evaluate_preprocessing":
            return language.jobStatus.BEFOREEVALUATING;
        case "inference_preprocessing":
            return language.jobStatus.BEFOREINFERENCE;

        case "profile_processing":
            return language.jobStatus.PROFILING;
        case "train_processing":
            return language.jobStatus.TRAINING;
        case "evaluate_processing":
            return language.jobStatus.EVALUATING;
        case "inference_processing":
            return language.jobStatus.INFERENCING;

        case "profile_finished":
        case "train_finished":
            return '';
        case "evaluate_finished":
            return language.jobStatus.EVALUATED;
        case "inference_finished":
            return language.jobStatus.INFERRED;

        case "profile_suspended":
        case "train_suspended":
        case "evaluate_suspended":
        case "inference_suspended":
            return language.jobStatus.SUSPENDED;

        case "profile_failed":
        case "train_failed":
        case "evaluate_failed":
        case "inference_failed":
            return language.jobStatus.INCOMPLETE;

        default:
            return "Error"; // for development
    }
}

function updateProgressIcons() {
    var evaluatedIcon = new Image()
    var _drawProgressIcon = (result: any) => {
        var elm: any = document.querySelector("[data-id='job-progress-" + result.job_id + "']");
        if (elm) {
            var context = elm.getContext('2d');
            context.canvas.width = 24;
            context.canvas.height = 24;
            var progress;
            var chartType;
            var drawOverlayIcon;
            var status = result.status;
            if (status === 'finished' && ['evaluate', 'inference'].includes(result.type)) {
                progress = 100;
                chartType = 'pie';
                drawOverlayIcon = (context: any) => context.drawImage(evaluatedIcon, 0, 0, 24, 24);
            } else {
                var epoch = (((result.train_status || {}).epoch) || {current: 0, max: 1});
                progress = Math.round(100 * epoch.current / (epoch.max || 1));
                chartType = 'doughnut';
            }

            new Chart(context, {
                type: chartType,
                data: {
                    labels: ['progress', 'remaining'],
                    datasets: [{
                        backgroundColor: ['#006699', ['suspended', 'failed'].includes(status) ? '#D8D8D8' : '#c2d9e5'],
                        data: [progress, 100 - progress]
                    }],
                },
                options: {
                    animation: { duration: 0, },
                    elements: { arc: { borderWidth: 0, }, },
                    tooltips: false,
                    responsive: false,
                    legend: { display: false, },
                    events: [],
                }
            });

            // 評価が完了している場合、Chartの上にチェックマークを表示する
            (drawOverlayIcon || (context => undefined))(context);
        }
    };

    evaluatedIcon.src = CheckWhiteSVG
    evaluatedIcon.onload = () => { 
        result_store.data.forEach(_drawProgressIcon);
    }
}

function loadMore() {
    if (!isLoading.value) {
        isLoading.value = true;
        editor_store.fetchResults(
            () => { isLoading.value = false },
            result_store.data.length
        )
    }
}

function checkedBox(job_id: any) {
    if (result_store.graph.comparison_id !== job_id) {
        result_store.graph.comparison_id = job_id;
    } else {
        result_store.graph.comparison_id = '';
    }
    result_store.showResultContent(job_id);
}

function parseUTCToLocalTime(utcTime: string): string {
    try {
        const date = new Date(utcTime);
        
        if (isNaN(date.getTime())) {
            throw new Error("Invalid date");
        }
        
        return new Intl.DateTimeFormat('en-CA', {
            dateStyle: 'short',
            timeStyle: 'medium',
            hour12:false
            }).format(date).replace(',', '')
    } catch (error) {
        return utcTime;
    }
}

</script>

<template>
<div ref="jobs_area_root" class="jobs-area app-row app-col">
    <div class="job-header" @contextmenu="open_menu_for_all($event)">
        <div class="job-top-image-btn">
            <img src="@/assets/image/Etc.svg" class="job-top-image nnc-enabled nnc-invoker all" @click="open_menu_for_all($event, 'dropdown')" />
        </div>
        <div class="title">{{language.training.JOB_HISTORY}}</div>
        <NncButton 
            class="job-action-pause-all job-action-control-content-no-image" 
            image=""
            :caption="language.training.PAUSE_ALL_JOBS" 
            :disabled="!result_store.jobsInQueue || postingJob" 
            @pressed="editor_store.onTriggeredJob('stopTrain')" 
        />
        <ContextMenu ref="context_menu_for_all" :menuItems="readOnly ? read_only_menu_items_for_all : menu_items_for_all" :is-sub="false"/>
    </div>
    <div id="training-results" class="training-results app-row app-col app-scroll-x app-scroll-y" @contextmenu="open_menu('', $event)">
        <div v-for="result in result_store.data" :key="result.job_id" href="#" class="result nnc-invoker" @click="changeActive(result)" @contextmenu.stop="open_menu(result, $event)">
            <div :class="['job', result_store.active !== -1 && result.job_id === result_store.data[result_store.active].job_id ? 'active': '']">
                <div class="job-content">
                    <div class="job-top">
                        <div class="job-top-image-btn">
                            <img src="@/assets/image/Etc.svg" class="job-top-image nnc-enabled nnc-invoker" @click="open_menu(result, $event, 'dropdown')" />
                        </div>
                        <div class="job-headline">
                            <canvas :data-id="'job-progress-' + [ result.job_id ]"></canvas>
                            <div class="job-title" :data-id="[ result.id ]">{{ result.job_name }}</div>
                            <div class="job-status">{{ showUiState(result) }}</div>
                        </div>
                    </div>
                    <div class="job-property">
                        <div class="job-property-name" v-if="result.train_status && result.type === 'profile'">
                            <p>{{ result_store.graph.cost_type }}</p>
                            <p>Start Time</p>
                        </div>
                        <div class="job-property-name" v-else-if="!result.train_status && result.type === 'profile'">
                            <p>{{ result_store.graph.cost_type }}</p>
                            <p>Start Time</p>
                        </div>
                        <div class="job-property-name" v-else>
                            <p>Training</p>
                            <p>Validation</p>
                            <p>Best Validation</p>
                            <p>{{ result_store.graph.cost_type }}</p>
                            <p>Start Time</p>
                        </div>
                        <div class="job-property-value" v-if="result.train_status && result.type === 'profile'">
                            <p>{{ showCost(result) }}</p>
                            <p class="start-time">{{ parseUTCToLocalTime(result.start_time) }}</p>
                        </div>
                        <div class="job-property-value" v-else-if="result.train_status && result.type !== 'profile'">
                            <p>{{ showError((result.train_status.last || {}).train_error) }}</p>
                            <p>{{ showError((result.train_status.last || {}).valid_error) }}</p>
                            <p>{{ showError((result.train_status.best || {}).valid_error) }}@{{ (result.train_status.best || {}).epoch }}</p>
                            <p>{{ showCost(result) }}</p>
                            <p class="start-time">{{ parseUTCToLocalTime(result.start_time) }}</p>
                        </div>
                    </div>
                    <div class="job-compare" v-if="result.status != 'queued' && result.status != 'preprocessing' && result.type !== 'profile'">
                        <NncCheckbox 
                            :label="language.training.COMPARISON" 
                            :modelValue="result.job_id === result_store.graph.comparison_id" 
                            :disabled="false"
                            @update:modelValue="checkedBox(result.job_id)" 
                        />
                        <span v-if="result.pareto_optimal" class="pareto-optimal">{{language.training.PARETO_OPTIMAL}}</span>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="isCopying" class="training-results-message">
            <span>Only saved jobs are displayed.</span>
        </div>
        <div class="load-more nnc-invoker" @click="loadMore" v-if="result_store.data.length && result_store.data.length < result_store.metadata.total">
            <img src="@/assets/image/Load.svg" class="nnc-enabled" :class="[isLoading ? 'loading' : '']" />Load More
        </div>
    </div>
    <ContextMenu ref="context_menu" :menuItems="menu_items" :is-sub="false" />
</div>
</template>