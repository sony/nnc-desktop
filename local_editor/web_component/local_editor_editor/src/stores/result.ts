/* Copyright 2024 Sony Group Corporation. */
/**
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
*/

import { ref, computed, reactive } from 'vue'
import { defineStore } from 'pinia'
import {useEditorStore} from './editor'
import {useUtilsStore} from './utils'
import {useDefinitionsStore} from './misc/definitions'
import {useProjConvertStore} from './project_converter'
import {useLRCurveGraphStore} from './training_graph/learning_curve_graph'
import {useBaseGraphStore} from './training_graph/base_graph'
import {useTradeOffGraphStore} from './training_graph/trade_off_graph'
import { useLanguageStore } from '@/stores/misc/languages'
import { useEvaluationStore } from '@/stores/evaluation'
import { useInferenceStore } from '@/stores/inference'
import JobCostAndErrors from '@/objects/JobCostAndErrors'

export const useResultStore = defineStore('result', () => {
    const definitions_store = useDefinitionsStore()
    const trade_off_graph_store = useTradeOffGraphStore()
    const editor_store = useEditorStore()
    const learning_curve_graph_store = useLRCurveGraphStore()
    const base_graph_store = useBaseGraphStore()
    const project_converter_store = useProjConvertStore()
    const utils_store = useUtilsStore()
    const evaluation_store = useEvaluationStore()
    const inference_store = useInferenceStore()
    const language_store = useLanguageStore()
    const language = reactive(language_store.language)

    const data = ref<any>([])
    const active = ref<number>(-1)
    const graph = ref({
        type: "Learning Curve",
        trade_off_type: "All",
        comparison_id: "",
        show_training_error: true,
        show_validation_error: true,
        scale: 'linear',
        cost_type: 'CostMultiplyAdd',
    })
    const selectedLayer = ref<any>({
        name: '',
        type: ''
    })
    const selectedParams = ref<any>([])
    const metadata = ref<any>({ total: 0 })
    const deletedJobs = ref<any>([])
    const training_graph = ref<any>(graph.value)

    //utils
    const currentJobId = ref<any>(-1)
    const pollingTrainResultId = ref<any>('')
    const pollingEvaluateResultId = ref<any>('')
    const pollingInferResultId = ref<any>('')

    const jobsInQueue = computed(() => {
        return data.value.some(job => job.type !== "inference" && utils_store.is_active(job))
    })

    function init() {
        $(function() {
            $('#main-graphs-area').resizable({
                handles: "s",
                alsoResizeReverse: '.result-content-main-logs',
            });
        });
    }

    // utils
    /**
     * activeになっているTrainingResultを取得する
     */
    function getActiveResult(): any {
        return data.value[active.value];
    }

    function initSelectedLayer() {
        selectedLayer.value = {
            name: '',
            type: '',
            request: ''
        };
        if (graph.value.type === 'TrainParamsVisualization') {
            graph.value.type = 'Learning Curve';
        }
    }

    function deleteResult(jobId: any, isChangeActive: boolean) {
        var index = data.value.findIndex((result: any) => result.job_id == jobId);
        if (index >= 0) {
            deletedJobs.value.push(jobId);
            data.value.splice(index, 1);
            if (index < active.value) {
                active.value--;
            }
        }

        if (isChangeActive) {
            var newIndex = Math.min(index, data.value.length - 1);
            changeActive((data.value[newIndex] || {}).job_id);
        }
    }

    function getTrainResult(job_id: any, callback: any) {
        utils_store.callApi({
            url: definitions_store.Definitions.CORE_API.usersUrl() + "/projects/" + editor_store.projectId + "/jobs/" + job_id + "/train_result?configuration_format=sdcproj",
            type: 'get',
            dataType: 'json',
        }, callback, (error: any, status: any, httpErrorThrown: any) => {
            if ((error.responseJSON || {}).error === 'NNCD_JOB_DELETED') {
                editor_store.popup(language.ERROR,
                language.THE_JOB_IS_ALREADY_DELETED,
                [{name: 'OK', action: () => {
                deleteResult(job_id, false);
                }, },]);
            } else {
            utils_store.handleXhrFailure(error, status, httpErrorThrown);
            }
        });
    }

    function _parseMonitoringReport(result: any) {
        if ((result.train_status || result).monitoring_report) {
            var report = (result.train_status || result).monitoring_report || {};
            var indices = Object.keys(report).sort((a: any, b: any) => a - b);
            var valueOf = (key: any) => (index: any) => (report[index] || [])[key];
            Object.assign(result, {
                current_epoch: indices.length,
                costs: indices.map(valueOf('cost')),
                training_errors: indices.map(valueOf('train_error')),
                validation_errors: indices.map(valueOf('valid_error')),
            });
            delete (result.train_status || result).monitoring_report;
        }
        return result;
    }

    function showResultContent(result_id: any, callback?: any) {
        getTrainResult(result_id, (result: any) => {
            result = _parseMonitoringReport(result);
            Object.assign(data.value.find((job: any) => job.job_id == result_id), result);
            if (result.configuration) {
                var isActive = function() {
                    return result_id === data.value[active.value].job_id;
                };
                if (result.configuration_format === 'sdcproj') {
                    result.sdcproj = result.configuration;
                    result.configuration = project_converter_store.importProject(result.configuration);
                } else {
                    result.configuration = JSON.parse(result.configuration);
                    result.sdcproj = project_converter_store.exportProject(JSON.parse(result.configuration));
                }
                var activeResult = data.value.find((job: any) => job.job_id == result_id);
                if (isActive()) { // APIを叩いている間に別のジョブになっている場合がある為、アクティブな場合にのみ設定を行う
                    editor_store.jobConfiguration = result.configuration
                }
                if (activeResult.completedConfiguration) {
                    Object.assign(activeResult, result);
                    if (isActive()) {
                    editor_store.jobCompletedConfiguration = activeResult.completedConfiguration
                    }
                } else {
                    Object.assign(activeResult, result, {completedConfiguration: null});
                    utils_store.calc_props(result.configuration).then((response: any) => {
                        Object.assign(activeResult, result, {completedConfiguration: response});
                        if (isActive()) {
                        editor_store.jobCompletedConfiguration = response
                        }
                    });
                }
            }
            if(result.status != "queued" && result.status != "preprocessing") {
                editor_store.windowInit()
            }
            if (callback) callback();
        });
    }

    function checkPareto() {
        // パレート最適なジョブをマークし、コストと誤差を短い名前でアクセスできるよう
        // {pareto: Function, cost: Number, error: Number} というオブジェクト配列を生成する。
        // 配列は、コストの低いものを先頭に、同一コストなら誤差の小さいものをより先頭にソートしておく。
        // 適切にソートするためコストや誤差が参照できないオブジェクトは正の無限大値を設定しておく。
        const mappedJobs = data.value.map((job: any) => {
            const stat = job.train_status || {};
            const costAndErrors = new JobCostAndErrors(job, graph.value.cost_type, 'CostMultiplyAdd');
            return {
                pareto: (bool: any) => job.pareto_optimal = bool,
                cost: Number(costAndErrors.cost(Infinity)),
                error: Number(costAndErrors.validationBest(Infinity)),
            };
        }).sort((a: any, b: any) => (a.cost - b.cost) || (a.error - b.error)); // コストが同じなら（差が 0）、誤差の差で昇順ソート

        var cost = -Infinity; // 再左端からはじめる
        var error = Infinity; // 最初の誤差は極大としておく
        mappedJobs.forEach((item: any) => {
            if (cost !== item.cost) {
                cost = item.cost; // 同一コストのグループを探索するためにコストを更新する
                error = Math.min(error, item.error); // 最小誤差を更新する
                item.pareto(item.error <= error); // 現時点での最小誤差ならパレート最適とマークする
            } else {
                // 同一コストグループ内で、最小誤差を共有するものをパレート最適とマークする
                item.pareto(item.error === error);
            }
        });
    }

    function changeActive(job_id: any) {
        if (active.value === -1 || job_id !== currentJobId || active.value !== data.value.findIndex((result: any) => (result || {}).job_id === job_id)) {
            clearTimeout(pollingTrainResultId.value);
            clearTimeout(pollingEvaluateResultId.value);
            clearTimeout(pollingInferResultId.value);
            base_graph_store.disposeChart()

            // $('.result-learning-curve svg').remove();
            if (job_id === undefined) {
                currentJobId.value = undefined;
                active.value = -1;
            } else {
                var jobs = data.value;
                var index = jobs.findIndex((result: any) => result.job_id === job_id);
                if (index !== -1) {
                    var job = jobs[index];
                    // オーバービュー用のネットワークとcompletedしたものを初期化
                    editor_store.jobConfiguration = {};
                    editor_store.jobCompletedConfiguration = {};
                    editor_store.jobGraphIndex = 0;
                    // 一度表示をしているジョブであれば、その情報を設定する
                    if (job.completedConfiguration) {
                        editor_store.jobConfiguration = job.configuration
                        editor_store.jobCompletedConfiguration = job.completedConfiguration
                    }
                    initSelectedLayer()
                    showResultContent(job_id)
                    checkPareto();
                    
                    evaluation_store.table_type = "output_result";
                    evaluation_store.classification_filter = "";
                    evaluation_store.showEvaluationContent(job);
                    evaluation_store.resetOffset()

                    inference_store.table_type = "output_result";
                    inference_store.classification_filter = "";
                    inference_store.showInferContent(job);
                    inference_store.resetOffset()

                    if(utils_store.is_active(job)) {
                        if (job.type === 'train' || job.type === 'profile') {
                            setPollingForTrainResult(job)
                        }
                        if (job.type === 'evaluate') {
                            setPollingForEvaluateResult(job);
                        }
                        if (job.type === 'inference') {
                            setPollingForInferResult(job);
                        }
                    }
                    currentJobId.value = job_id;
                } else {
                    currentJobId.value = undefined;
                }
                active.value = index;
            }
        }
    }

    function setPollingForTrainResult(job: any) {
        var fetchResult = function(job: any) {
            if (job.status_url && job.log_url) {
                utils_store.callApi({
                    url: job.log_url,
                    type: 'get',
                    /*
                    * S3のファイルへのアクセス時にCORSルールによるpreflightリクエストを防ぐため
                    * headers, credentialsを送信しないように設定
                    * setPollingForEvaluateResultも同様
                    */
                    headers: null,
                    xhrFields: { withCredentials: false },
                }, (result: any) => {
                    job.logfile = result;
                });
                utils_store.callApi({
                    url: job.status_url,
                    type: 'get',
                    headers: null,
                    xhrFields: { withCredentials: false },
                }, (result: any) => {
                    if (result != "") {
                        if (result.status != "BEFORE_TRAINING") {
                            result = _parseMonitoringReport(result);
                            job.current_epoch = result.current_epoch;
                            job.costs = result.costs;
                            job.training_errors = result.training_errors;
                            job.validation_errors = result.validation_errors;
                            job.costs = result.costs;
                            job.train_status = job.train_status || {}
                            // Vue.set(job, 'train_status', job.train_status || {});
                            Object.assign(job.train_status, result);
                            editor_store.windowInit()
                        }
                    }
                }, _makeHandleS3ErrorFunction(job) // XXX プリサインド URL 処理のため EditorUtils.handleXhrFailure でなく特殊処理にまわす
                );
            } else {
                showResultContent(job.job_id);
            }
        };
        var _setPolling = function(job: any) {
            if (utils_store.networkConnectivity) {
                fetchResult(job);
                if (job && !utils_store.is_active(job)) {
                    showResultContent(job.job_id);
                    return;
                }
            }
            const INTERVAL = 500;
            pollingTrainResultId.value = setTimeout(_setPolling, INTERVAL, job);
        };
        _setPolling(job);
    }

    function setPollingForEvaluateResult(job: any) {
        var fetchResult = function(job: any) {
            if (job.status_url && job.log_url) {
                utils_store.callApi({
                    url: job.log_url,
                    type: 'get',
                    headers: null,
                    xhrFields: { withCredentials: false },
                }, (log: any) => {
                    job.evaluation_logfile = log;
                    editor_store.windowInit()
                });
                utils_store.callApi({
                    url: job.status_url,
                    type: 'get',
                    headers: null,
                    xhrFields: { withCredentials: false },
                }, (result: any) => {
                    if (result) {
                        job.evaluate_status = result;
                    }
                }, _makeHandleS3ErrorFunction(job) // XXX プリサインド URL 処理のため EditorUtils.handleXhrFailure でなく特殊処理にまわす
                );
            } else {
                evaluation_store.showEvaluationContent(job);
            }
        };
        var _setPolling = function(job: any) {
            if (utils_store.networkConnectivity) {
                fetchResult(job);
                if (job && !utils_store.is_active(job)) {
                    if (job.status === 'finished') {
                        evaluation_store.showEvaluationContent(job);
                    }
                    return;
                }
            }
            const INTERVAL = 500;
            pollingEvaluateResultId.value = setTimeout(_setPolling, INTERVAL, job);
        };
        _setPolling(job);
    }

    function setPollingForInferResult(job: any) {
        var fetchResult = function(job: any) {
            if (job.status_url && job.log_url) {
                utils_store.callApi({
                    url: job.log_url,
                    type: 'get',
                    headers: null,
                    xhrFields: { withCredentials: false },
                }, (log: any) => {
                    job.inference_logfile = log;
                    editor_store.windowInit()
                });
                utils_store.callApi({
                    url: job.status_url,
                    type: 'get',
                    headers: null,
                    xhrFields: { withCredentials: false },
                }, (result: any) => {
                    if (result) {
                        job.inference_status = result;
                        job.status = result.status;
                    }
                }, _makeHandleS3ErrorFunction(job) // XXX プリサインド URL 処理のため EditorUtils.handleXhrFailure でなく特殊処理にまわす
                );
            } else {
                inference_store.showInferContent(job);
            }
        };
        var _setPolling = function(job: any) {
            if (utils_store.networkConnectivity) {
                fetchResult(job);
                if (job && !utils_store.is_active(job)) {
                    if (job.status === 'finished') {
                        inference_store.showInferContent(job);
                    }
                    return;
                }
            }
            const INTERVAL = 500;
            pollingInferResultId.value = setTimeout(_setPolling, INTERVAL, job);
        };
        _setPolling(job);
    }

    function _makeHandleS3ErrorFunction(job: any) {
        return (error: any, status: any, httpErrorThrown: any) => {
        // エラーが起きたら次のリクエストからはAPI呼び出しに切り替える
        // タイミングが悪ければ空ファイルが返される時があり、その場合はjsonパースエラーになるのでその場合は除く
        if (status !== 'parsererror') {
            delete job.status_url;
            delete job.log_url;
        }
        }
    }

    function merge(jobs: any) {
        var activeJobId = active.value !== -1 ? (data.value[active.value] || {}).job_id : null;
        jobs.forEach((job: any) => {
            var job_id = job.job_id;
            if (!deletedJobs.value.includes(job_id)) {
                var jobArray = data.value;
                var target = jobArray.find((elem: any) => elem.job_id === job_id);
                if (target) { // update
                    Object.assign(target, job);
                } else {
                    data.value.push(Object.assign(
                        {
                            logfile: '',
                            evaluation_logfile: '',
                            evaluate_status: '',
                            inference_logfile: '',
                            inference_status: '',
                            confusionMatrix: {
                                selectedModal: '',
                                matrices: '',
                            },
                            classificationResult: {
                                total: 0,
                            },
                            classificationMatrix: {
                                selectedModal: '',
                                matrices: '',
                            },
                            current_epoch: undefined,
                            pluginResults: [],
                            selectedPluginIdAndName: '',
                        }, job));
                }
            }
        });
        data.value.sort((a: any, b: any) => a.create_datetime < b.create_datetime ? 1 : -1);
        active.value = activeJobId ? data.value.findIndex((job: any) => job.job_id === activeJobId) : -1;
    }

    function deleteJobs(jobIds: any, isChangeActive: boolean) {
        jobIds.forEach((jobId: any) => {
            var index = data.value.findIndex((result: any) => result.job_id === jobId);
            if (index >= 0) {
                deletedJobs.value.push(jobId);
                data.value.splice(index, 1);
                if (index < active.value) {
                    active.value--;
                }
            }
        });

        if (isChangeActive) {
            var newIndex = Math.min(0, data.value.length - 1);
            changeActive((data.value[newIndex] || {}).job_id);
        }
    }

    function getJobsInProgress() {
        return data.value.filter((job: any) => utils_store.is_active(job))
    }

    function pausable() {
        var job = data.value[active.value] || {};
        return ['queued', 'preprocessing', 'processing'].includes(job.status);
    }

    function resumable() {
        var job = data.value[active.value] || {};
        return ['suspended', 'failed'].includes(job.status);
    }

    function uneditable() {
        var job = data.value[active.value] || {};
        return ['queued', 'preprocessing'].includes(job.status);
    }

    function evaluatable() { // 学習か評価のジョブが選択されていて、中断されているか完了している
        var job = data.value[active.value] || {};
        return (['train'].includes(job.type) && ['suspended', 'finished', 'failed'].includes(job.status)) ||
            (['evaluate'].includes(job.type) && ['suspended', 'finished', 'failed'].includes(job.status));
    }

    function downloadable() { // 学習か評価のジョブが選択されていて、中断されているか完了している、かつtrain_statusが存在する
        var job = data.value[active.value] || {};
        return ['train', 'evaluate', 'inference'].includes(job.type) && ['suspended', 'finished', 'failed'].includes(job.status) && job.train_status && job.download_formats;
    }

    function publishable() { // ジョブが存在しているかどうか
        var job = data.value[active.value];
        return !!job;
    }

    function apiPublishable() { // evaluateが完了している
        var job = data.value[active.value] || {};
        return ['evaluate'].includes(job.type) && ['finished'].includes(job.status);
    }

    return { 
        data, 
        active, 
        graph,
        training_graph,
        selectedLayer,
        selectedParams,
        deletedJobs,
        metadata,
        jobsInQueue,
        currentJobId,
        init,
        merge,
        resumable,
        uneditable,
        evaluatable,
        publishable,
        apiPublishable,
        downloadable,
        pausable,
        initSelectedLayer,
        getActiveResult,
        changeActive,
        deleteResult,
        deleteJobs,
        setPollingForEvaluateResult,
        setPollingForTrainResult,
        setPollingForInferResult,
        getJobsInProgress,
        getTrainResult,
        showResultContent,
    }
})
