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

import { ref, computed, reactive, nextTick } from 'vue'
import { defineStore } from 'pinia'
import {useGraphStore} from './graph'
import {useResultStore} from './result'
import {useUtilsStore} from './utils'
import {useSVGAreaStore} from './editor/svgarea'
import {useDefinitionsStore} from './misc/definitions'
import {useLanguageStore} from './misc/languages'
import {useDatasetStore} from './dataset'
import {useEvaluationStore} from './evaluation'
import {useInferenceStore} from './inference'
import {useConfigStore} from './config'
import {useProjConvertStore} from './project_converter'
import {useLRCurveGraphStore} from './training_graph/learning_curve_graph'
import {useTradeOffGraphStore} from './training_graph/trade_off_graph'
import { useNetworkStore } from '@/stores/network'
import Zoomer from '@/objects/Zoomer'

export const useEditorStore = defineStore('editor', () => {
    const graph_store = useGraphStore()
    const result_store = useResultStore()
    const inference_store = useInferenceStore()
    const proj_convert_store = useProjConvertStore()
    const svgarea_store = useSVGAreaStore()
    const config_store = useConfigStore()
    const dataset_store = useDatasetStore()
    const evaluation_store = useEvaluationStore()
    const learning_curve_graph_store = useLRCurveGraphStore()
    const trade_off_graph_store = useTradeOffGraphStore()
    const utils_store = useUtilsStore()
    const definitions_store = useDefinitionsStore()
    const network_store = useNetworkStore()
    const languages_store = useLanguageStore()
    const language = reactive(languages_store.language)
    const operations: any = {
        'Editor': 'networkGraph', 
        'Learning Curve': 'learningCurve', 
        'Trade-off Graph': 'tradeOffGraph', 
        'trainParamsVisualization': 'trainParamsVisualization'
    }

    const params = ref<any>({})
    const projectName = ref<string>('') // project name
    const activeTabName = ref<string>('EDIT')
    const readOnly = ref<boolean>(false)
    const zoomInfo = ref<any>({})
    const graphIndex = ref<number>(0)
    const selection = ref<any>({ 
        main: '', 
        all: [], 
        props: null
    })
    const propMap = ref<any>({}) // all layer's properties mapping
    const statistics = ref<any>({
        active: null, // active statistics object in this.values
        values: [], // statistics calculated by nnablambda
    })
    const configuration = ref<any>({})
    const jobStatisticActive = ref({
        max: '',
        name: 'Output',
        sum: ''
    })
    const jobCompletedConfiguration = ref<any>({})
    const jobGraphIndex = ref<number>(0)
    const jobConfiguration = ref({})
    const updateDetection = ref<boolean>(false)
    const rightWidth = ref<number>(280)
    const completedConfiguration = ref({})
    const editTabInstance = ref<any>({})
    const resumeInstance = ref<any>({})
    const postingJob = ref<boolean>(false)
    const projectId = ref<string>('')
    const modal = ref<any>({}) // modal dialog
    const tenantId = ref<string>('')
    const isLoadEnd = ref<boolean>(false)
    const availableInstances = ref<any>({})
    const isRegistered = ref<boolean>(false)
    const tenantList = ref<any>([])
    const hasShareTenant = ref<boolean>(false)
    const numNodes = ref<any>({})
    const abciMaintenanceList = ref<any>([])
    const abciUseRate = ref<number>(0)
    const isShowInLocalEditor = ref<boolean>(false)
    const freeCpuHours = ref<number>(0)
    const services = ref<any>([])
    const isLocal = ref<boolean>(true)
    const reportUrl = ref<string>('')
    const reportProgress = ref<number>(0)
    const members = ref<any>([])
    const isCurrentNetwork = ref<boolean>(true)
    const nickname = ref<string>('')
    const isCopying = ref<boolean>(false)
    const showNetworkForReport = ref<boolean>(false)
    const downloadType = ref<string>('nnp')
    const downloadFormats = ref<any>([])
    const allInstances = ref<any>({})
    const plugins = ref<any>([])
    const isWorkspaceExceeded = ref<boolean>(false)
    const isFreeCpuExceeded = ref<boolean>(false)
    const _configuration = ref<any>() 
    const _jobs = ref<any>() 
    const isCreateReport = ref(false)
    const selectedComponent = ref('')
    const shouldShowUploadDialog = ref<boolean>(false)

    const activeTabNameLowerCase = computed(() => {
        return activeTabName.value.toLowerCase()
    })

    const editTabIsActive = computed(() => {
        return activeTabName.value === 'EDIT'
    })

    const forceRegister = computed(() => {
        // nncd: modify return value
        // return !this.isRegistered && (this.isFreeCpuExceeded || this.isWorkspaceExceeded);
        return isShowInLocalEditor.value;
    });

    const reportConfiguration = computed(() => {
        return isCurrentNetwork.value ? configuration.value : jobConfiguration.value;
    })

    const reportCompletedConfiguration = computed(() => {
        return isCurrentNetwork.value ? completedConfiguration.value : jobCompletedConfiguration.value;
    })

    function init() {
        const zoom_info_def = definitions_store.Definitions.ZOOM_INFO
        zoomInfo.value = {
            networkGraph: new Zoomer(zoom_info_def['Editor']),
            learningCurve: new Zoomer(zoom_info_def['Learning Curve']),
            tradeOffGraph: new Zoomer(zoom_info_def['Trade-off Graph']),
            trainParamsVisualization: new Zoomer(zoom_info_def['trainParamsVisualization']),
        }

        editTabInstance.value = {
            selected: 'train',
            activePriority: 0,
            priorities: {
                0: definitions_store.Definitions.DEFAULT_INSTANCE_GROUP,
                1: definitions_store.Definitions.DEFAULT_INSTANCE_GROUP
            },
            selectedNumNodes: {}
        }

        resumeInstance.value = {
            selected: 'train',
            activePriority: 0,
            priorities: {
                0: definitions_store.Definitions.DEFAULT_INSTANCE_GROUP,
                1: definitions_store.Definitions.DEFAULT_INSTANCE_GROUP
            },
            selectedNumNodes: {},
            firstNumNode: ''
        }

        $(document).ready(() => nextTick(() => $('.scrollbar-macosx').scrollbar()));
    }

    var mapType = (prop: any) => {
        if (prop.type === 'File') {
            return 'file';
        } else if (!prop.editable) {
            return 'immutable';
        } else {
            if (prop.name === 'Name') {
                return 'name';
            } else {
                switch (prop.type) {
                    default: return 'text';
                    case 'Boolean': return 'bool';
                    case 'Option': return 'select';
                }
            }
        }
    }

    var makePropFor = (layer: any) => (prop: any) => { 
        return {
            name: prop.name,
            type: mapType(prop),
            choice: prop.option,
            computed: prop.name === 'Name' ? layer.name() : layer.getProperty(prop.name),
            value: layer.getUserInputProperty(prop.name),
            error: (layer.errors().find((error: any) => error.property === prop.name) || {}).message,
        }; 
    }

    function onAddedLayer(layer: any) {
        propMap.value[layer.name()] = {
            type: layer.type(),
            color: '#' + layer.component().color.substring(2),
            props: layer.typedProperties().map(makePropFor(layer)),
        }
    }

    /**
     * @param layers specify all layers on the editing graph.
     */
    function initPropMap(layers: any) {
        // ideally object which will be no longer referenced in the map should be cleared here...
        layers.forEach(function(layer: any) { onAddedLayer(layer); });
        _updateSelectedLayer();
    }

    function _updateSelectedLayer() {
        var layer = propMap.value[selection.value.main];
        selection.value.props = layer ? Object.assign({}, layer) : null
    }

    /**
     * @param nodes represent the array which holds all completed properties from nnablambda.
     */
    function onComputedProperties(nodes: any) {
        var map = propMap.value;
        nodes.forEach((node: any) => {
            var props = (map[node.name] || {}).props || []; // this Vue object's mapping (or discard)
            var _propObj = (name: string) => props.find((prop: any) => prop.name === name) || {}; // find matching property
            var computedMap = node.properties;
            for (var key in computedMap) { // update each property by computed value
                _propObj(key).computed = computedMap[key];
            }
        });
        _updateSelectedLayer();
    }

    function updateStatistics(_statistics: any) {
        statistics.value.values = _statistics;
        changeActiveStatistics(_statistics[0] || statistics.value.active);
    }

    function changeActiveStatistics(stat: any) {
        if (stat) {
            if (activeTabName.value.toLowerCase() === 'edit') {
                statistics.value.active = stat;
                graph_store.getLayers().forEach((layer: any) => layer.updateStatistics(stat));
            } else {
                jobStatisticActive.value = stat;
            }
        }
    }

    /**
     * @param errors are array in which member has the type {layer: 'name', property: 'name', message: 'error'}.
     */
    function onComputedErrors(errors: any) {
        var map = propMap.value;
        // delete all errors forged in the mapped item
        for (var key in map) {
            map[key].props.forEach((prop: any) => delete prop.error);
        }

        // set errors
        errors.forEach((error: any) => {
            var props = (map[error.layer] || {}).props || []; // this Vue object's mapping (or discard)
            var _propObj = (name: any) => props.find((prop: any) => prop.name === name) || {}; // find matching property
            _propObj(error.property).error = error.message; // set error message
        });

        _updateSelectedLayer();
    }

    /**
     * Show unit create dialog.
     * @param actions {name: String,} representing button.
     */
    function showUnitCreateDialog(actions: any) {
        modal.value = {
            title: 'Unit Settings',
            unit: true,
            actions: actions.map((elem: any) => Object.assign({
                name: elem.name,
                action: (value: any) => { 
                    delete modal.value['show'];
                    (elem.action || ((value: any) => undefined))(value);
                }
            })),
            show: true, // show dialog
        }
    }

    function operateZooming(operation: any) {
        zoomInfo.value[operations[operation.name]].zoom(operation.percentage);
    }

    // Editor Window Size
    /**
     * 初期表示
     * @memberOf nnc.EditorWindowSize
     */
    function windowInit() {
        changeSize();
    }

    /**
     * バインディング
     * @memberOf nnc.EditorWindowSize
     */
    function windowBind() {
        /**
         * Windowの高さ変更時イベント
         */
        $(window).resize(function (e: any) {
            changeSize();
        });
    }

    /**
     * Windowサイズ変更時実行イベント
     * @memberOf nnc.EditorWindowSize
     */
    function changeSize() {
        // jQuery セレクターが undefined を返した場合 _NullQueriedDom オブジェクトでガードして width, height ともに 0 とする。
        const _NullQueriedDom = {getBoundingClientRect: () => new Object({width: 0, height: 0,}), };
        const boundingWidthOf = (selector: any) => ($(selector)[0] || _NullQueriedDom).getBoundingClientRect().width;
        const boundingHeightOf = (selector: any) => ($(selector)[0] || _NullQueriedDom).getBoundingClientRect().height;
        // get width in decimal value
        const windowWidth: any = $(window).width();
        var leftContentWidth = boundingWidthOf('.left-content');
        var rightContentWidth = boundingWidthOf('.right-content');
        var contentWidth = windowWidth - leftContentWidth - rightContentWidth;
        $('.center-content').outerWidth(contentWidth);

        var windowHeight: any = $(window).outerHeight(true);
        var navbarHeight = boundingHeightOf('.editor-navbar');
        var contentHeight = windowHeight - navbarHeight;
        $('.main-content').outerHeight(contentHeight);

        if(editTabIsActive) {
            var graphsTabHeight = boundingHeightOf('.network-tabs');
            var networkActionHeight = boundingHeightOf('.network-action');
            var graphHeight = contentHeight - graphsTabHeight - networkActionHeight;
            $('.network-editor-scroller').height(graphHeight);
            svgarea_store.requestAdjustSize();
        }

        if(activeTabName.value === 'TRAINING' || activeTabName.value === 'EVALUATION' || activeTabName.value === 'INFERENCE') {
            var logAreaHeight = boundingHeightOf('.performance-log-area');

            if(activeTabName.value === 'TRAINING') {
                var jobMainAreaHeight = contentHeight - 40 - 40 - 16 - logAreaHeight;
                $('.job-main-area').outerHeight(jobMainAreaHeight);

                var svgWidth = contentWidth - 32;
                var legend_dom: any = $('.legend')
                // var svgHeight = jobMainAreaHeight - 34 - legend_dom.outerHeight(true);
                var svgHeight = jobMainAreaHeight - 34 - 48;
                if (result_store.data.length && result_store.active > -1) {
                    learning_curve_graph_store.width = trade_off_graph_store.width = svgWidth - learning_curve_graph_store.margin.LEFT - learning_curve_graph_store.margin.RIGHT;
                    learning_curve_graph_store.svgWidth = trade_off_graph_store.svgWidth = svgWidth;
                    learning_curve_graph_store.chartSVGWidth = trade_off_graph_store.chartSVGWidth = svgWidth;
                    learning_curve_graph_store.height = trade_off_graph_store.height = svgHeight - learning_curve_graph_store.margin.TOP - learning_curve_graph_store.margin.BOTTOM;
                    learning_curve_graph_store.svgHeight = trade_off_graph_store.svgHeight = svgHeight;
                    learning_curve_graph_store.chartSVGHeight = trade_off_graph_store.chartSVGHeight = svgHeight - 80;
                    learning_curve_graph_store.learningCurve(result_store.getActiveResult().job_id);
                    trade_off_graph_store.tradeOff()
                }
            }

            if(activeTabName.value === 'EVALUATION') {
                var jobMainAreaHeight = contentHeight - 40 - 80 - logAreaHeight;
                $('.job-main-area').outerHeight(jobMainAreaHeight);

                $('.pager-content').outerHeight(jobMainAreaHeight); // output_result
                $('.confusion-matrix-content').outerHeight(jobMainAreaHeight); // confusion_matrix
            }

            if(activeTabName.value === 'INFERENCE') {
                var jobMainAreaHeight = contentHeight - 40 - 40 - logAreaHeight;
                $('.job-main-area').outerHeight(jobMainAreaHeight);
                $('.pager-content').outerHeight(jobMainAreaHeight); // output_result
            }
        }
    }

    function _changeActiveTabAccordingToQueryParam(params: any) {
        switch ((params || {}).tab) {
        default:
            activeTabName.value = 'EDIT';
            break;
        case 'training':
            activeTabName.value = 'TRAINING';
            break;
        case 'evaluation':
            activeTabName.value = 'EVALUATION';
            break;
        }

    }

    function updateIsLoadEnd(obj: any) {
        _configuration.value |= obj.configuration;
        _jobs.value |= obj.jobs;
        isLoadEnd.value = _configuration.value && _jobs.value;
        if (_configuration.value && _jobs.value) {
            _changeActiveTabAccordingToQueryParam(utils_store.getParams);
        }
    }

    function fetchResults(callback?: any, offset?: any) {
        utils_store.callApi({
            url: definitions_store.Definitions.CORE_API.usersUrl() + '/projects/' + utils_store.getProjectId +  '/jobs' + '?offset=' + (offset || 0) + '&limit=10',
            type: 'get',
            dataType: 'json',
        }, (result: any) => {
            result_store.merge(result.jobs);
            result_store.metadata.total = result.metadata.total;
            result.jobs.forEach((job: any) => {
                var numNodeObj: any = {};
                numNodeObj[job.instance_group] = job.num_nodes;
                if (numNodes.value[job.job_id]) {
                    Object.assign(numNodes.value[job.job_id], numNodeObj);
                } else {
                    numNodes.value[job.job_id] = numNodeObj;
                }
            });
            (callback || (() => undefined))();
        }, (error: any, status: any, httpErrorThrown: any) => {
            if (((error.responseJSON || {}).error === 'NNCD_BAD_REQUEST') && ((error.responseJSON || {}).message === 'Not found project')) {
                popup(language.ERROR, language.THE_PROJECT_MIGHT_BE_DELETED,
                    [{name: 'OK', action: () => {document.location.href = hasShareTenant.value ? '/console/#/project?tenant_id=' + tenantId.value : '/console/#/project'}}]);
            } else {
                updateIsLoadEnd({ jobs: true });
                utils_store.handleXhrFailure(error, status, httpErrorThrown);
            }
        });
    }

    function onRenamed(changes: any) {
        // assign new mapping
        var backup = changes.map((change: any) => { return {name: change.to, prop: propMap.value[change.from],}; });
        backup.forEach((item: any) => {
            propMap.value[item.name] = item.prop;

            // update 'Name' value in the mapping
            var nameProp = item.prop.props.find((prop: any) => prop.name === 'Name');
            nameProp.value = item.name;
            nameProp.computed = item.name;
        });
        // drop old mapping
        var oldNames = changes.map((change: any) => change.from);
        var newNames = changes.map((change: any) => change.to);
        oldNames.filter((name: any) => !newNames.includes(name)).forEach((name: any) => delete propMap.value[name]);

        var changed = changes.find((change: any) => change.from === selection.value.main);
        if (changed) {
            selection.value.main = changed.to;
        }
        _updateSelectedLayer();
    }

    function changedNumNode(type: string, group: any, numNode: any) {
        let groupObj: any = {}
        groupObj[group] = numNode;
        if (result_store.getActiveResult()) {
            const currentJobId = result_store.getActiveResult().job_id;
            switch(type) {
                case 'train':
                    editTabInstance.value.selectedNumNodes[currentJobId] = groupObj;
                case 'resume':
                    resumeInstance.value.selectedNumNodes[currentJobId] = groupObj;
            }
        } else {
            resumeInstance.value.firstNumNode = groupObj;
        }
    }

    function makeConfiguration(type: string) {
        switch(type) {
            case 'train':
            case 'scheduleTrain':
            case 'evaluate':
                return utils_store.serialize_configuration();
            case 'retrainNotInPlace':
                return utils_store.serialize_configuration(result_store.getActiveResult().configuration.networks);
            default:
                throw type;
        }
    }

    /**
     * Show popup dialog.
     * @param title dialog title
     * @param message dialog message
     * @param actions array of pair {name: String, action: function} representing button. last action is set to 'Defalut'.
     */
    function popup(title: any, message: any, actions: any) {
        modal.value = {
        title: title,
        message: message,
        actions: actions.map((elem: any) => Object.assign({
            name: elem.name,
            action: () => { 
                // Vue.delete(this.modal, 'show'); 
                // (elem.action || (() => undefined))(); 
                delete modal.value['show']
                if(elem.action) {
                    elem.action()
                }
            }
        })),
        show: true, // show dialog
        }
    }

    function isCompletedDataset(datasetId: any) {
        const sampleDatasetTenantId = definitions_store.Definitions.DATASET.SAMPLE_DATASET_TENANT_ID;
        const tenantIds = sampleDatasetTenantId + ',' + tenantId.value;
        const $def = $.Deferred();
        const notCompletedResponse = () => {
            $def.resolve({
                isCompleted: false
            });
        }
        if (datasetId) {
            utils_store.callApi({
                url: `${definitions_store.Definitions.CORE_API.usersUrl()}/datasets?sort_by=-update_datetime&tenant_ids=${tenantIds}&limit=1&offset=0&dataset_id=${datasetId}`,
                type: 'GET',
                dataType: 'json',
            }, (datasetResult: any) => {
                if (datasetResult.datasets.length) {
                    const dataset = datasetResult.datasets[0];
                    $def.resolve({
                        dataset,
                        isCompleted: dataset.status === 'completed'
                    });
                } else {
                    notCompletedResponse();
                }
            }, () => {
                notCompletedResponse();
            });
        } else {
            setTimeout(notCompletedResponse, 0);
        }
        return $def.promise();
    }

    function isUserRole(tenantIdInput?: any) {
        tenantIdInput = tenantIdInput || tenantId.value;
        const USER_ROLE = 'user';
        const tenant = tenantList.value.find((tenant: any) => tenant.tenant_id === tenantIdInput);
        if (tenant) {
            return tenant.role === USER_ROLE;
        }
        return false;
    }

    /**
     * Show register popup dialog.
     * @param title dialog title
     * @param message dialog message
     * @param actions {name: String,} representing button.
     */
    function registerPopup(title: any, message: any, actions: any, tenantIdInput?: any) {
        tenantIdInput = tenantIdInput || tenantId.value;
        modal.value = {
            title: title,
            message: message,
            actions: actions.map((elem: any) => Object.assign({
                name: elem.name,
                action: () => {
                    if (hasShareTenant.value) {
                        document.location.href = '/console/#/serviceSettings?tenant_id=' + tenantIdInput;
                    } else {
                        document.location.href = '/console/#/serviceSettings';
                    }
                }
            })),
            show: true, // show dialog
        }
    }

    function onTriggeredJob(type: any, group?: any, selectedNumNode?: any) {
        var _do = () => {
            postingJob.value = true;
            isLoadEnd.value = false; // show loading spinner.
            if (!group) {
                group = definitions_store.Definitions.DEFAULT_INSTANCE_GROUP;
            }

            var unsetPostingJob = () => {
                postingJob.value = false;
                isLoadEnd.value = true; // hide loading spinner.
            };
            var _pushNewJob = (result: any, type: any, name: any, group: any) => {
                activeTabName.value = 'TRAINING';
                result_store.data.unshift(Object.assign(
                    {
                        type: type,
                        status: 'queued',
                        active: false,
                        logfile: '',
                        job_name: name,
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
                        instance_group: group,
                    }, result)
                );
                result_store.changeActive(result.job_id);
            };
            var _getDatasets = (callback: any) => {
                const sampleDatasetTenantId = definitions_store.Definitions.DATASET.SAMPLE_DATASET_TENANT_ID;
                const tenantIds = sampleDatasetTenantId + ',' + tenantId.value;

                utils_store.callApi({
                    url: definitions_store.Definitions.CORE_API.usersUrl() + "/datasets" + "?tenant_ids=" + tenantIds,
                    type: 'GET',
                    dataType: 'json',
                }, callback, (error: any, status: any, httpErrorThrown: any) => {
                    isLoadEnd.value = true;
                    utils_store.handleXhrFailure(error, status, httpErrorThrown);
                });
            };
            var _checkDatasets = (target_datasets: any, callback: any) => {
                if (!target_datasets.every((dataset: any) => dataset.id)) {
                    const errors = 'Unlinked dataset exists.';
                    (callback || ((errors: any) => undefined))(errors);
                    return;
                };
                Promise.all(
                    target_datasets.map((dataset: any) => isCompletedDataset(dataset.id))
                ).then(datasetResults => {
                    const errors = datasetResults.every(dataset => dataset.isCompleted) ?
                        '' : 'Linked dataset might have been deleted.';
                    (callback || ((errors: any) => undefined))(errors);
                });
            };
            var _getStructureSearchParams = (configuration: any, isResume: boolean) => {
                var copiedStructureSearch = Object.assign({}, configuration.structure_search);
                var numParallel = Number(copiedStructureSearch.num_parallel);
                var attemptTimes = Number(copiedStructureSearch.attempt_times);
                if (numParallel > 1) {
                    if (numParallel > attemptTimes) { // 並列数の多かった場合は、並列数を試行回数に合わせる
                        numParallel = attemptTimes;
                        copiedStructureSearch.num_parallel = attemptTimes;
                    }
                    if (!numParallel) {
                        copiedStructureSearch.attempt_times = 0;
                    } else {
                        copiedStructureSearch.attempt_times = Math.floor(attemptTimes / numParallel);
                    }
                } else { // 不正な値が入っていた場合には並列数1とする
                    copiedStructureSearch.num_parallel = 1;
                }
                return {
                    enable: (copiedStructureSearch.enable ? 1 : 0),
                    attempt_hours: Number(copiedStructureSearch.attempt_hours),
                    attempt_times: Number(copiedStructureSearch.attempt_times),
                    multi_mutate_num: isResume ? undefined : Number(copiedStructureSearch.num_parallel)
                };
            }
            var name = utils_store.getNewJobName();
            switch (type) {
                case 'train':
                case 'scheduleTrain':
                case 'retrainNotInPlace':
                    var configuration = makeConfiguration(type);
                    var _getEmptyNodeNetworks = () => {
                        return configuration.networks.filter((network: any) => {
                            if (!network.nodes) {
                                return false;
                            }
                            return network.nodes.length === 0;
                        });
                    };
                    var emptyNodeNetworks = _getEmptyNodeNetworks();
                    if (emptyNodeNetworks.length) {
                        var errors = emptyNodeNetworks.reduce((accumulator: any, network: any) => {
                            // TODO: 文言確認
                            return accumulator + `${network.name}|||${network.name}->` + language.NETWORK_IS_EMPTY
                        }, '');
                        popup('Errors in graph', errors, [{name: 'OK',},]);
                        unsetPostingJob();
                        return;
                    }
                    var _getCoreNum = () => {
                        const _instance = availableInstances.value.train.find((instance: any) => instance.instance_type === group);
                        if (!_instance) return 0;
                        // 言語によるCore数の違いはないので、ja-JP固定とする
                        return Number(_instance.description['ja-JP'].substr(-1));
                    }
                    var _validateBatchSize = () => {
                        let optimizerOrMonitorDatasetName: any = [];
                        const coreNum = _getCoreNum();
                        configuration.optimizers.forEach((optimizerConfig) => optimizerOrMonitorDatasetName.push(optimizerConfig.dataset));
                        configuration.monitors.forEach((monitorConfig) => optimizerOrMonitorDatasetName.push(monitorConfig.dataset));
                        // optimizersかmonitorsで設定されているデータセットでバッチサイズを超えているものがないかをチェックする
                        return configuration.datasets.filter((dataset: any) => optimizerOrMonitorDatasetName.includes(dataset.name) && dataset.samples < (configuration.batch * coreNum));
                    }
                    var datasetsLessThanBatchSize = _validateBatchSize();
                    if (datasetsLessThanBatchSize.length) {
                        var errors = datasetsLessThanBatchSize.reduce((accumulator: any, dataset: any) => {
                            // TODO: 文言確認
                            return accumulator + language.BATCH_SIZE_IS_LARGER + `"${dataset.name}".\n`
                        }, '');
                        popup('Errors in CONFIG', errors, [{name: 'OK',},]);
                        unsetPostingJob();
                        return;
                    }
                    utils_store.checkErrors(configuration, (errors: any) => {
                        if (errors) {
                            popup('Errors in graph', errors, [{name: 'OK',},]);
                            unsetPostingJob();
                        } else {
                            _checkDatasets(configuration.datasets, (errors: any) => {
                                if (errors) {
                                    popup('Errors in dataset', errors, [{name: 'OK',},]);
                                    unsetPostingJob();
                                } else {
                                    var jobName = utils_store.getNewJobName();
                                    var jobType = 'train';
                                    // post new job
                                    var data: any = {
                                        configuration: proj_convert_store.exportProject(configuration, true),
                                        configuration_format: 'sdcproj',
                                        type: jobType,
                                        job_name: jobName,
                                        instance_group: group,
                                        structure_search: _getStructureSearchParams(configuration, false),
                                    }
                                    let selectedNumNodeObj: any = {};
                                    if (result_store.getActiveResult()) {
                                        const currentJobId = result_store.getActiveResult().job_id;
                                        if (selectedNumNode) {
                                            selectedNumNodeObj[group] = selectedNumNode;
                                            editTabInstance.value.selectedNumNodes[currentJobId] = selectedNumNodeObj;
                                            resumeInstance.value.selectedNumNodes[currentJobId] = selectedNumNodeObj;
                                            resumeInstance.value.firstNumNode = selectedNumNodeObj;
                                            data['num_nodes'] = selectedNumNode;
                                        } else {
                                            selectedNumNodeObj[group] = 1;
                                            editTabInstance.value.selectedNumNodes[currentJobId] = selectedNumNodeObj;
                                            resumeInstance.value.selectedNumNodes[currentJobId] = selectedNumNodeObj;
                                        }
                                    } else {
                                        if (selectedNumNode) {
                                            selectedNumNodeObj[group] = selectedNumNode;
                                            resumeInstance.value.firstNumNode = selectedNumNodeObj;
                                            data['num_nodes'] = selectedNumNode;
                                        }
                                    }
                                    utils_store.callApi({
                                        url: definitions_store.Definitions.CORE_API.usersUrl() + "/projects/" + projectId.value + "/jobs",
                                        type: 'post',
                                        data: JSON.stringify(data),
                                        contentType: 'application/json',
                                        dataType: 'json',
                                    }, (result: any) => {
                                        _pushNewJob(result, jobType, jobName, group);
                                    }, utils_store.showPopupIfLimitExceededOrHandleAsDefaultFailureFor(jobType, isRegistered.value), unsetPostingJob);
                                }
                            });
                        }
                    });
                    break;
                case 'suspend':
                    var job_id = result_store.getActiveResult().job_id;
                    utils_store.callApi({
                        url: definitions_store.Definitions.CORE_API.usersUrl() + "/projects/" + projectId.value + "/jobs/" + job_id + "/suspend",
                        type: 'POST',
                        dataType: 'json',
                    }, (result: any) => {
                        result = result || {};
                        let deleteJobs: any = [];
                        (result.changed_jobs || []).forEach((job: any) => {
                            if (job.status === 'suspended') {
                                result_store.merge([{job_id: String(job.job_id), status: 'suspended'}]);
                            } else if (job.status === 'deleted') {
                                deleteJobs.push(String(job.job_id));
                            }
                        });
                        if (deleteJobs.length) {
                            result_store.deleteJobs(deleteJobs, result.status === 'deleted');
                        }

                        var activeIndex = result_store.active;
                        var offset = (Math.ceil((activeIndex + 1) / 10) - 1) * 10;
                        fetchResults(() => {
                            unsetPostingJob();
                        }, offset);
                    }, (error: any, status: any, httpErrorThrown: any) => {
                        const errorMessage = (error.responseJSON || {}).error;
                        if (errorMessage === 'NNCD_STATUS_INCORRECT') { // 停止しようとしたがすでに停止 or 完了している場合
                            // 最新情報を取得
                            var activeIndex = result_store.active;
                            var offset = (Math.ceil((activeIndex + 1) / 10) - 1) * 10;
                            fetchResults(() => {
                                unsetPostingJob();
                            }, offset);
                            return;
                        } else if (errorMessage === 'NNCD_JOB_DELETED') { // 停止しようとしたがすでに削除されている場合
                            result_store.deleteResult(job_id, true);
                            unsetPostingJob();
                            return;
                        } else {
                            isLoadEnd.value = true;
                            utils_store.handleXhrFailure(error, status, httpErrorThrown);
                        }
                    });
                    break;
                case 'resume':
                    var job = result_store.getActiveResult();
                    var jobType: string = job.type;
                    var job_id = job.job_id;
                    var data: any = { type: jobType,
                                instance_group: group,
                                structure_search: _getStructureSearchParams(config_store.data.filter((config: any) => config.type === "Global")[0], true), };
                    if (resumeInstance.value.selectedNumNodes[job_id] && resumeInstance.value.selectedNumNodes[job_id][group]) {
                        data['num_nodes'] = resumeInstance.value.selectedNumNodes[job_id][group];
                    } else if (numNodes.value[job_id] && numNodes.value[job_id][group]) {
                        data['num_nodes'] = numNodes.value[job_id][group];
                    }
                    if (jobType === 'evaluate') {
                        const executor = config_store.data.filter((config: any) => config.type === "Executor")[0];
                        const firstExecutorsDatasetName = (executor || {}).dataset;
                        const referencedDataset = dataset_store.data.find((dataset: any) => dataset.name === firstExecutorsDatasetName);
                        const datasetId = (referencedDataset || {}).id;
                        if (!datasetId) {
                            popup('Error in CONFIG', language.SPECIFIED_DATASET_MIGHT_BE_DELETED, [{name: 'OK',},]);
                            unsetPostingJob();
                        } else {
                            Object.assign(data, { evaluation_dataset_id: datasetId, });
                        }
                    }
                    utils_store.callApi({
                        url: definitions_store.Definitions.CORE_API.usersUrl() + "/projects/" + projectId.value + "/jobs/" + job_id + "/resume",
                        type: 'POST',
                        data: JSON.stringify(data),
                        contentType: 'application/json',
                        dataType: 'json',
                    }, (result: any) => {
                        var index = result_store.data.findIndex((job: any) => job.job_id === job_id);
                        var offset = (Math.ceil((index + 1) / 10) - 1) * 10;
                        fetchResults(() => {
                            var job = result_store.data.find((job: any) => job.job_id === job_id);
                            Object.assign(job, result);
                            (job.type === 'evaluate') ? result_store.setPollingForEvaluateResult(job) : result_store.setPollingForTrainResult(job);
                            result_store.changeActive(job.job_id);
                            unsetPostingJob();
                            activeTabName.value = (job.type === 'evaluate') ? 'EVALUATION' : 'TRAINING';
                            nextTick(() => {
                                evaluation_store.isInit = !evaluation_store.isInit;
                            });
                        }, offset);
                    }, (error: any, status: any, httpErrorThrown: any) => {
                        utils_store.showPopupIfLimitExceededOrHandleAsDefaultFailureFor(jobType, isRegistered.value)(error, status, httpErrorThrown);
                        unsetPostingJob();
                    });
                    break;
                case 'stopTrain': // Pause All Running Jobs
                    const inprogressJobs = result_store.getJobsInProgress();
                    const filteredJobs = inprogressJobs.filter(j => j.type !== 'reference')
                    let promiseObj;

                    const currentJobId = (result_store.data[result_store.active] || {}).job_id;
                    const suspendedJobs: any = [];

                    var _suspend = (jobId: any) => {
                        var finished = $.Deferred();
                        // suspendしようとしたが存在していなかった場合 or すでにSuspendされているもの
                        if (result_store.data.findIndex((job: any) => job.job_id === jobId) === -1 || suspendedJobs.includes(jobId)) {
                            setTimeout(() => {
                                finished.resolve();
                            }, 0);
                            return finished;
                        }
                        utils_store.callApi({
                            url: definitions_store.Definitions.CORE_API.usersUrl() + "/projects/" + projectId.value + "/jobs/" + jobId + "/suspend",
                            type: 'POST',
                            dataType: 'json',
                        }, (result: any) => {
                            result = result || {};
                            const deleteJobs: any = [];
                            (result.changed_jobs || []).forEach((job: any) => {
                                if (job.status === 'suspended') {
                                    suspendedJobs.push(String(job.job_id));
                                    result_store.merge([{job_id: String(job.job_id), status: 'suspended'}]);
                                } else if (job.status === 'deleted') {
                                    deleteJobs.push(String(job.job_id));
                                }
                            });
                            if (deleteJobs.length) {
                                const isActive = deleteJobs.includes(currentJobId);
                                result_store.deleteJobs(deleteJobs, isActive);
                            }
                            finished.resolve();
                        }, (error: any, status: any, httpErrorThrown: any) => {
                            const errorMessage = (error.responseJSON || {}).error;
                            if (errorMessage === 'NNCD_STATUS_INCORRECT') { // 停止しようとしたがすでに停止 or 完了している場合
                                // 次のgetJobsで更新される為何もしない
                                finished.resolve();
                                return;
                            } else if (errorMessage === 'NNCD_JOB_DELETED') { // 停止しようとしたがすでに削除されている場合
                                const isActive = result_store.data.findIndex((result: any) => result.job_id === jobId) === result_store.active;
                                result_store.deleteResult(jobId, isActive);
                                finished.resolve();
                                return;
                            } else {
                                isLoadEnd.value = true;
                                utils_store.handleXhrFailure(error, status, httpErrorThrown);
                            }
                        });
                        return finished;
                    }

                    for (let i = 0; i < filteredJobs.length; i++) {
                        if (promiseObj) {
                            promiseObj = promiseObj.then(_suspend.bind(filteredJobs[i].job_id))
                        } else {
                            promiseObj = _suspend(filteredJobs[i].job_id);
                        }
                    }

                    if (promiseObj) {
                        promiseObj.then(() => {
                            fetchResults(() => {
                                unsetPostingJob();
                            }, 0);
                        });
                    }
                    break;
                case 'evaluate':
                case 'inference':
                case 'resumeTrain':
                    var jobType: string = ''
                    if(['evaluate', 'inference'].includes(type)) {
                        jobType = type
                    } else {
                        jobType = 'train'
                    }
                    var job_id = result_store.getActiveResult().job_id;
                    const executor = config_store.data.filter((config: any) => config.type === "Executor")[0];
                    const firstExecutorsDatasetName = (executor || {}).dataset;
                    const referencedDataset = dataset_store.data.find((dataset: any) => dataset.name === firstExecutorsDatasetName);
                    const datasetId = (referencedDataset || {}).id;
                    if (!datasetId) {
                        var message;
                        if (!executor) {
                            message = language.NO_EXECUTOR_DEFINED;
                        } else if (!referencedDataset) {
                            // TODO 文言確認
                            message = utils_store.format(language.IS_NOT_FOUND_SPECIFIED_IN, firstExecutorsDatasetName, executor.name);
                        } else {
                            message = 'Dataset "' + firstExecutorsDatasetName + language.HAS_NOT_BEEN_LINKED;
                        }
                        popup('Error in CONFIG', message, [{name: 'OK',},]);
                        unsetPostingJob();
                    } else {
                        var data: any = { 
                            type: jobType, 
                            evaluation_dataset_id: datasetId, 
                            instance_group: group,
                            structure_search: _getStructureSearchParams(config_store.data.filter((config: any) => config.type === "Global")[0], true)
                        };
                        const currentJobId = result_store.getActiveResult().job_id;

                        if (resumeInstance.value.selectedNumNodes[currentJobId] && resumeInstance.value.selectedNumNodes[currentJobId][group] && jobType === 'train') {
                            data['num_nodes'] = resumeInstance.value.selectedNumNodes[currentJobId][group];
                        }
                        if(jobType === 'inference') {
                            data['inference_inputs'] = inference_store.uploaded_inputs
                        }
                        utils_store.callApi({
                            url: definitions_store.Definitions.CORE_API.usersUrl() + "/projects/" + projectId.value + "/jobs/" + job_id + "/resume",
                            type: 'POST',
                            data: JSON.stringify(data),
                            contentType: 'application/json',
                            dataType: 'json',
                        }, (result: any) => {
                            var index = result_store.data.findIndex((job: any) => job.job_id === job_id);
                            var offset = (Math.ceil((index + 1) / 10) - 1) * 10;
                            fetchResults(() => {
                                var job = result_store.data.find((job: any) => job.job_id === job_id);
                                Object.assign(job, result);
                                switch(job.type) {
                                    case 'evaluate':
                                        result_store.setPollingForEvaluateResult(job)
                                        break
                                    case 'inference':
                                        result_store.setPollingForInferResult(job)
                                        break
                                    default:
                                        result_store.setPollingForTrainResult(job)
                                        break
                                }
                                result_store.changeActive(job.job_id);
                                unsetPostingJob();
                                switch(job.type) {
                                    case 'evaluate':
                                        activeTabName.value = 'EVALUATION'
                                        nextTick(() => {
                                            evaluation_store.isInit = !evaluation_store.isInit;
                                        });
                                        break
                                    case 'inference':
                                        activeTabName.value = 'INFERENCE'
                                        nextTick(() => {
                                            inference_store.isInit = !inference_store.isInit;
                                        });
                                        break
                                    default:
                                        activeTabName.value = 'TRAINING'
                                        nextTick(() => {
                                            evaluation_store.isInit = !evaluation_store.isInit;
                                        });
                                        break
                                }
                            }, offset);
                        }, (error: any, status: any, httpErrorThrown: any) => {
                            utils_store.showPopupIfLimitExceededOrHandleAsDefaultFailureFor(jobType, isRegistered.value)(error, status, httpErrorThrown);
                            unsetPostingJob();
                        });
                    }
                    break;
                case 'profile':
                    var jobName = utils_store.getNewJobName();
                    var jobType = 'profile';
                    utils_store.callApi({
                        url: definitions_store.Definitions.CORE_API.usersUrl() + "/projects/" + projectId.value + "/jobs",
                        type: 'post',
                        data: JSON.stringify({
                            configuration_format: 'sdcproj',
                            configuration: proj_convert_store.exportProject(utils_store.serialize_configuration(), true),
                            type: jobType,
                            job_name: jobName,
                            instance_group: group,
                        }),
                        contentType: 'application/json',
                        dataType: 'json',
                    }, (result: any) => {
                        _pushNewJob(result, jobType, jobName, group);
                    }, utils_store.showPopupIfLimitExceededOrHandleAsDefaultFailureFor(jobType, isRegistered.value), unsetPostingJob);
                    break;
            }
        }

        var _isABCIInstance = () => {
            if (!availableInstances.value.train) {
                return false;
            }
            var index = availableInstances.value.train.findIndex((instance: any) => instance.instance_type === group);
            if (index === -1) {
                return false;
            } else {
                return availableInstances.value.train[index].provider === 'abci';
            }
        }

        var _getCurrentABCIMaintenanceInfo = () => {
            var currentTime = new Date().getTime() / 1000;
            var index = abciMaintenanceList.value.findIndex((maintenanceInfo: any) => maintenanceInfo.start <= currentTime && currentTime < maintenanceInfo.end);
            return index !== -1 ? abciMaintenanceList.value[index] : null;
        }

        var _isABCIMaintenance = () => {
            if (['train', 'retrainNotInPlace', 'resume', 'evaluate', 'profile'].includes(type) && _isABCIInstance()) {
                return _getCurrentABCIMaintenanceInfo() !== null;
            } else {
                return false;
            }
        }

        if (_isABCIMaintenance()) {
            var maintenanceInfo = _getCurrentABCIMaintenanceInfo();
            if (maintenanceInfo) {
                popup('Error', maintenanceInfo.message, [{name: 'OK',},]);
                return;
            }
        }

        var _isUnsupportedPresicionSetting = () => {
            var _configuration = utils_store.serialize_configuration();
            return (
                ['train', 'retrainNotInPlace', 'resume', 'evaluate', 'profile'].includes(type) &&
                definitions_store.Definitions.PRECISION_UNSUPPORTED_INSTANCES.includes(group) &&
                _configuration.precision === 'Half'
            );
        }

        if (_isUnsupportedPresicionSetting()) {
            popup('Error in CONFIG', language.THIS_PROCESSOR_DOESNT_SUPPORT, [{name: 'OK',},]);
            return;
        }

        var _needsAgreementTask = (taskType: any) => {
            return ['train', 'retrainNotInPlace', 'resume', 'evaluate', 'profile'].includes(taskType);
        }

        if (_isABCIInstance()) {
            const instances = availableInstances.value['train'];
            if (instances.findIndex((instance: any) => instance.needs_agreement) !== -1 || instances.findIndex((instance: any) => !instance.available) !== -1) {
                var message = language.YOU_DONT_HAVE_PERM_ABCI;
                popup(language.ERROR, message, [{name: 'OK',},]);
                return;
            }
        }

        var _showABCIUseRateDialog = () => {
            if (_isABCIInstance() && abciUseRate.value >= definitions_store.Definitions.ABCI_USE_RATE.THRESHOLD) {
                const title = language.controller.abciUseRateDialog.TITLE;
                const message = language.controller.abciUseRateDialog.MESSAGE;
                popup(title, message, [
                    {name: 'Cancel'},
                    {name: 'OK', action: _do}
                ]);
            } else {
                _do();
            }
        }

        var _showAgreePrivateBilling = () => {
            // 個人テナントで実行 かつ 課金対象のジョブ かつ 同意済みではない かつ 課金ユーザー かつ テナントに所属している
            if (privateTenant[0].tenant_id === tenantId.value && _needsAgreementTask(type) && !definitions_store.Definitions.AGREED_PRIVATE_BILLING() && isRegistered.value && tenantList.value.length > 1) {
                showAgreePrivateBillingPopup(language.NOTICE, [{name: 'Cancel'}, {
                    name: 'Yes and Run', action: (privateChecked: boolean) => {
                        if (privateChecked) {
                            utils_store.callApi({
                                url: definitions_store.Definitions.CORE_API.usersUrl() + '/settings',
                                type: 'PUT',
                                data: JSON.stringify({ "flag_billing_notification_already_agreed": true }),
                                contentType: 'application/json',
                                dataType: 'json',
                            }, () => localStorage.setItem('p', 'true'));
                        }
                        _showABCIUseRateDialog();
                    }
                }]);
            } else {
                _showABCIUseRateDialog();
            }
        }

        const privateTenant = tenantList.value.filter((tenant: any) => tenant.purpose === 'private');
        // 課金非対応国のユーザー or 無課金ユーザー or 同意が必要でないタスク or 課金ユーザーで同意済みの場合、即実行
        if (!definitions_store.Definitions.REGISTRABLE() || !isRegistered.value || !_needsAgreementTask(type) || definitions_store.Definitions.AGREED_BILLING_SYSTEM()) {
            _showAgreePrivateBilling();
        } else {
            showAgreeBillingSystemPopup(language.NOTICE, [{name: 'Cancel'}, {
                name: 'Yes and Run', action: (checked: boolean) => {
                    if (checked) {
                        utils_store.callApi({
                            url: definitions_store.Definitions.CORE_API.usersUrl() + '/settings',
                            type: 'PUT',
                            data: JSON.stringify({ "flag_job_includes_preparation_agreed": true }),
                            contentType: 'application/json',
                            dataType: 'json',
                        }, () => localStorage.setItem('s', 'true'));
                    }
                    _showAgreePrivateBilling();
                }
            }]);
        }
    }

    /**
     * Show register popup dialog.
     * @param title dialog title
     * @param message dialog message
     * @param actions {name: String,} representing button.
     */
    function showAgreePrivateBillingPopup(title: any, actions: any) {
        modal.value = {
            title: title,
            titleIcon: '@/assets/image/Warning.svg',
            agreePrivateBilling: {
                messages: [
                    language.THE_JOB_WILL_BE_CHARGED_TO_YOUR_PERSONAL_ACCOUNT,
                ],
                confirmMessage: language.ARE_YOU_SURE_WANT_RUN_JOB,
                checkboxMessage: language.DONT_ASK_AGAIN
            },
            actions: actions.map((elem: any) => Object.assign({
                name: elem.name,
                action: (value: any) => { 
                    // Vue.delete(this.modal, 'show'); 
                    // (elem.action || ((value: any) => undefined))(value); 
                    delete modal.value['show']
                    if(elem.action) {
                        elem.action(value)
                    }
                }
            })),
            show: true, // show dialog
        }
    }

    /**
     * Show register popup dialog.
     * @param title dialog title
     * @param message dialog message
     * @param actions {name: String,} representing button.
     */
    function showAgreeBillingSystemPopup(title: any, actions: any) {
        modal.value = {
            title: title,
            titleIcon: '@/assets/image/Warning.svg',
            agreeBillingSystem: {
                messages: [
                    language.YOU_WILL_BE_CHARGED_ACCORDING,
                    language.PREPARING_ENVIRONMENT,
                    language.WHEN_YOU_USE_GPUS,
                ],
                priceLinkName: language.SEE_PRICE,
                priceLink: language.PRICE_LINK,
                tipsLinkName: language.TIPS,
                tipsLinkURI: 'https://support.dl.sony.com/faq-ja/faq：クラウドサービス/#efficient_preparation_running_job',
                confirmMessage: language.ARE_YOU_SURE_WANT_RUN_JOB,
                checkboxMessage: language.DONT_ASK_AGAIN
            },
            actions: actions.map((elem: any) => Object.assign({
                name: elem.name,
                action: (value: any) => { 
                    // Vue.delete(this.modal, 'show'); 
                    // (elem.action || ((value: any) => undefined))(value); 
                    delete modal.value['show']
                    if(elem.action) {
                        elem.action(value)
                    }
                }
            })),
            show: true, // show dialog
        }
    }

    function updateCpuFreeHours() {
        utils_store.callApi({
            url: definitions_store.Definitions.CORE_API.usersUrl() + '/account/process_resource',
            type: 'get',
            dataType: 'json',
        }, (result: any) => {
            const value = result.max_process_resource - result.process_resource;
            freeCpuHours.value = (value > 0) ? Math.floor(value * 10 / 60) / 10 : 0;
        });
    }

    function onJobTypeChanged(jobType: any, dropdownType: any) {
        switch(dropdownType) {
            case 'edit-tab':
                editTabInstance.value.selected = jobType;
                break;
            case 'resume':
                resumeInstance.value.selected = jobType;
                break;
        }
    }

    function onPriorityChanged(priority: any, dropdownType: any) {
        switch(dropdownType) {
            case 'edit-tab':
                editTabInstance.value.activePriority = priority;
                break;
            case 'resume':
                resumeInstance.value.activePriority = priority;
                break;
        }
    }

    function exportPythonCode() {
        utils_store.exportPythonCode(result => {
            var a = document.createElement('a');
            a.download = `${projectName.value}.py`;
            var blob = new Blob([result.configuration], {'type': 'text/plain'});
            a.href = window.URL.createObjectURL(blob);
            a.click();
        }, errors => {
            this.popup('Errors in graph', errors, [{name: 'OK',},]);
        });
    }

    function exportPrototxt() {
        utils_store.exportCaffe(result => {
            var a = document.createElement('a');
            a.download = `${projectName.value}_${network_store.Graphs.target()}.prototxt`;
            var blob = new Blob([result.configuration], {'type': 'text/plain'});
            a.href = window.URL.createObjectURL(blob);
            a.click();
            if (result.error) {
                this.popup('Warning', result.error, [{name: 'OK',},]);
            }
        }, errors => {
            this.popup('Errors in graph', errors, [{name: 'OK',},]);
        });
    }

    function onChoiceChanged(choice: any, priority: any, dropdownType: any) {
        switch(dropdownType) {
            case 'edit-tab':
                editTabInstance.value.priorities[priority] = choice;
                break;
            case 'resume':
                resumeInstance.value.priorities[priority] = choice;
                break;
        }
    }

    function onSave() {
        if (readOnly.value) {
            const message = language.THIS_PROJECT_IS_OPEND_IN_READ_ONLY;
            popup(language.NOTICE, message, [{name: 'OK',},]);
            return
        }
        isLoadEnd.value = false;
        utils_store.save_configuration(() => isLoadEnd.value = true);
    }

    /**
     * Show prompt dialog.
     * @param title dialog title (prompt message)
     * @param initialValue initial value in input text area
     * @param actions array of pair {name: Strinng, action: function} representing button.
     * last action is set to 'Default'.
     * Default action called back with text input value on its first parameter.
     */
    function saveAsShare(title: any, initialValue: any, actions: any) {
        modal.value = {
            title: title,
            initialValue: initialValue,
            tenantList: tenantList.value,
            actions: actions.map((elem: any) => Object.assign({
                name: elem.name,
                action: (value: any) => { 
                    // Vue.delete(this.modal, 'show'); 
                    // (elem.action || (value => undefined))(value); 
                    delete modal.value['show']
                    if(elem.action) {
                        elem.action(value)
                    }
                }
            })),
            show: true, // show dialog
        }
    }

    /**
     * Show async copy dialog.
     * @param actions {name: String,} representing button.
     */
    function showAsyncCopyDialog(actions: any, tenantId: any) {
        modal.value = {
            title: language.NOTICE,
            message: language.THE_PROJECT_WITH_NEW_NAME_IS_SAVED_BG,
            link: {
                url: hasShareTenant.value ? '/console/#/project?tenant_id=' + tenantId : '/console/#/project',
                name: language.SEE_YOUR_PROJECTS
            },
            actions: actions.map((elem: any) => Object.assign({
                name: elem.name,
                action: (value: any) => { 
                    // Vue.delete(this.modal, 'show'); 
                    // (elem.action || (value => undefined))(value); 
                    delete modal.value['show']
                    if(elem.action) {
                        elem.action(value)
                    }
                }
            })),
            show: true, // show dialog
        }
    }

    function onSaveAs() {
        saveAsShare(definitions_store.Definitions.strings.prompt_message('project'), projectName.value, [{name: 'Cancel', }, {name: 'OK', action: (value: any) => {
            var tenantId = value.tenantId;
            if (tenantId) {
                isLoadEnd.value = false;
                utils_store.callApi({
                    url: definitions_store.Definitions.CORE_API.usersUrl() + "/projects/" + projectId.value + "/copy",
                    type: 'POST',
                    data: JSON.stringify({ project_name: value.projectName, tenant_id: tenantId }),
                    contentType: 'application/json',
                    dataType: 'json',
                }, (result: any) => {
                    if (result.sync) {
                        location.href = "/console/editor?project_id=" + result.project_id;
                    } else {
                        showAsyncCopyDialog([{name: 'OK'},], tenantId);
                    }
                }, (error: any, status: any, httpErrorThrown: any) => {
                    if ((error.responseJSON || {}).error === 'NNCD_STORAGE_LIMIT_EXCEEDED') {
                        var message = '';
                        var buttonName = '';
                        if (isUserRole(tenantId)) {
                            message = language.WORKSPACE_OF_GROUP_IS_FULL_CONTACT_ADMIN;
                            popup('Failed to copy', message, [{name: 'OK',},])
                            return;
                        } else if (isRegistered.value) {
                            message = language.WORKSPACE_IS_FULL;
                            buttonName = 'Go to Service Settings';
                        } else {
                            message = language.YOU_HAVE_CONSUMED_ALL_WORKSPACE_SIZE;
                            buttonName = 'Enter credit card';
                        }
                        registerPopup('Failed to copy', message, [{name: buttonName,},], tenantId);
                    } else if((error.responseJSON || {}).message === 'File being used by another process') {
                        message = language.IS_COPYING_PROJECT;
                        popup(language.NOTICE, message, [{name: 'OK',},]);
                        return;
                    } else {
                        isLoadEnd.value = true;
                        utils_store.handleXhrFailure(error, status, httpErrorThrown);
                    }
                }, () => isLoadEnd.value = true);
            }
        }, }, ]);
    }

    function showReadOnlyDialog(userId: any) {
        const member = members.value.find((members: any) => members.user_id === userId);
        const name = member ? (member.nickname || member.user_id) : userId || '';
        const message = utils_store.format(language.THIS_PROJECT_IS_LOCKED, name);
        const title = language.NOTICE;
        popup(title, message, [{name: 'OK',},]);
    }

    function showPublishProjectDialog(title: any, message: any, list: any, selectedValue: any, actions: any) {
        modal.value = {
            title: title,
            text: message,
            radioList: list,
            isPublish: true,
            selected: selectedValue,
            actions: actions.map((elem: any) => Object.assign({
                name: elem.name,
                action: (value: any) => { 
                    // Vue.delete(this.modal, 'show'); 
                    // (elem.action || (value => undefined))(value); 
                    delete modal.value['show']
                    if(elem.action) {
                        elem.action(value)
                    }
                }
            })),
            show: true, // show dialog
        }
    }

    function showLinkModal(title: any, message: any, link: any, actions: any) {
        modal.value = {
            title: title,
            message: message,
            link: link,
            actions: actions.map((elem: any) => Object.assign({
                name: elem.name,
                action: (value: any) => { 
                    // Vue.delete(this.modal, 'show'); 
                    // (elem.action || (value => undefined))(value); 
                    delete modal.value['show']
                    if(elem.action) {
                        elem.action(value)
                    }
                }
            })),
            show: true, // show dialog
        }
    }

    function onPublishProject() {
        const CURRENT_NETWORK = language.CURRENT_NETWORK;
        const LATEST_JOB = language.LATEST_JOB;
        const LATEST_JOB_RESULT = language.LATEST_JOB_RESULT;

        const existsJob = result_store.data.length !== 0;
        const hasResults = existsJob && !['queued', 'preprocessing', 'processing', 'failed'].includes(result_store.data[0].status);

        var list = [
            {
                value: CURRENT_NETWORK,
                description: language.ONLY_THE_CURRENT_NETWORK,
                disabled: false
            },
            {
                value: LATEST_JOB,
                description: language.ONLY_THE_NETWORK_OF_LAST_JOB,
                disabled: !existsJob
            },
            {
                value: LATEST_JOB_RESULT,
                description: language.NETWORK_AND_RESULTS_OF_LAST_JOB,
                disabled: !hasResults
            },
        ];
        const message = '';
        showPublishProjectDialog('Publish project', message, list, CURRENT_NETWORK, [{name: 'Cancel', }, {name: 'OK', action: (selectedAction: any) => {
            var jobId: any;
            var isExcludeGraph = false;
            switch (selectedAction) {
                case CURRENT_NETWORK:
                    isCurrentNetwork.value = true;
                    isExcludeGraph = true;
                    break;
                case LATEST_JOB:
                    isExcludeGraph = true;
                case LATEST_JOB_RESULT:
                    jobId = result_store.data[0].job_id;
                    isCurrentNetwork.value = false;
                    result_store.changeActive(jobId);
                    break;
                default:
                    break;
            }
            nextTick(() => {
                getReportFiles(jobId, isExcludeGraph).then((files: any) => {
                    _publish(jobId, files);
                });
            });
        }, }, ]);
    }

    function _publish(jobId: any, files: any) {
        var hasPublishPermission = () => {
            if (isLocal.value) {
                return true;
            }
            var tenant = tenantList.value.find((tenant: any) => tenant.tenant_id === tenantId.value);
            if (tenant) {
                return tenant.role !== 'user';
            } else {
                return false;
            }
        }
        var hasNickname = () => {
            return nickname.value !== '';
        }

        if (!hasNickname()) {
            const localTenant = tenantList.value.find((tenant: any) => tenant.purpose === 'private');
            // TODO 文言確認
            showLinkModal('Error', language.YOU_CANT_PUBLISH_WITHOUT_NAME, {
                url: hasShareTenant.value ? '/console/#/serviceSettings/?tenant_id=' + localTenant.tenant_id : '/console/#/serviceSettings',
                name: 'Service Settings'
            }, [{name: 'OK', action: () => {}}]);
            return;
        }

        if (!hasPublishPermission()) { // 共有テナントの場合は管理者権限が必要
            popup('Failed to publish', language.YOU_DONT_HAVE_PERM_TO_PUBLISH, [{name: 'OK',},]);
            return;
        }
        if (isCopying.value) {
            popup('Failed to publish', language.THIS_PROJECT_BEING_COPIED, [{name: 'OK',},]);
            return;
        }
        isLoadEnd.value = false;
        var type = files.findIndex((file: any) => file.name === 'learning_curve.png') !== -1 ? 'network_and_result' : 'network';
        utils_store.callApi({
            url: definitions_store.Definitions.CORE_API.usersUrl() + "/projects/" + projectId.value + "/disclose",
            type: 'post',
            data: JSON.stringify({
                job_id: jobId,
                disclose_type: type
            }),
            contentType: 'application/json',
            dataType: 'json',
        }, (result: any) => {
            utils_store.callApi({
                url: definitions_store.Definitions.CORE_API.usersUrl() + "/projects/" + result.project_id + "/reports",
                type: 'post',
                data: JSON.stringify({
                    job_id: result.job_id,
                    destination: 'public',
                    files: files,
                    report_type: type
                }),
                contentType: 'application/json',
                dataType: 'json',
            }, (result: any) => {
                isLoadEnd.value = true;
                showLinkModal(language.NOTICE, language.THE_PROCESS_OF_PUBLISHING, {
                    url: '/console/#/publicProject/?only_my_proj=true',
                    name: language.SEE_DASHBOARD
                }, [{name: 'OK', action: () => {}}]);
            }, (error: any, status: any, httpErrorThrown: any) => {
                isLoadEnd.value = true;
                utils_store.handleXhrFailure(error, status, httpErrorThrown);
            });

        }, (xhr: any, status: any, httpErrorThrown: any) => {
            const response = xhr.responseJSON;
            if ((response || {}).error === 'NNCD_STATUS_INCORRECT') {
                isLoadEnd.value = true;
                popup('Failed to publish', language.YOU_CANT_PUBLISH, [{name: 'OK',},]);
                return;
            } else {
                isLoadEnd.value = true;
                utils_store.handleXhrFailure(xhr, status, httpErrorThrown);
            }
        });
    }

    function getReportFiles(jobId: any, isExcludeGraph?: boolean) {
        const $def = $.Deferred();
        utils_store.getNetworkImages().then((imageList: any) => {
            var files = imageList.map((image: any, i: any) => {
                return {
                    name: 'network_' + i + '.png',
                    data: {
                        type: 'image/png',
                        base64: image
                    }
                }
            });
            utils_store.getGraphImage(jobId).then((graphImage: any) => {
                if (graphImage && !isExcludeGraph) {
                    files.push({
                        name: 'learning_curve.png',
                        data: {
                            type: 'image/png',
                            base64: graphImage
                        }
                    });
                }
                const references = utils_store.getReferences();
                if (references.length) {
                    files.push({
                        name: 'references.json',
                        data: {
                            type: 'application/json',
                            base64: btoa(JSON.stringify(references))
                        }
                    });
                }
                $def.resolve(files);
            });
        });
        return $def.promise();
    }

    function _createPipeline(pipelineName: any, trainInstanceType: any, evaluateInstanceType: any, fileName: any, successCallback: any, errorCallback: any) {
        utils_store.callApi({
            url: `${definitions_store.Definitions.CORE_API.usersUrl()}/tenants/${tenantId.value}/pipelines`,
            type: 'post',
            data: JSON.stringify({
                pipeline_name: pipelineName,
                project_id: Number(projectId.value),
                train_instance_type: Number(trainInstanceType),
                evaluate_instance_type: Number(evaluateInstanceType),
                result_files: fileName
            }),
            contentType: 'application/json',
            dataType: 'json',
        }, successCallback, errorCallback);
    }

    function _createWorkflow(workflowName: any, pipelineId: any, dataSources: any, isSendMail: any, successCallback: any, errorCallback: any) {
        utils_store.callApi({
            url: `${definitions_store.Definitions.CORE_API.usersUrl()}/tenants/${tenantId.value}/workflows`,
            type: 'post',
            data: JSON.stringify({
                name: workflowName,
                pipeline_ids: [pipelineId],
                data_sources: dataSources,
                email_notification: isSendMail
            }),
            contentType: 'application/json',
            dataType: 'json',
        }, successCallback, errorCallback);
    }

    function showCompletePipelineDialog() {
        showLinkModal(language.CREATE_PIPELINE.SUCCESS_CREATE_PIPELINE, ' ' , {
            url: '/console/#/pipeline',
            name: language.CREATE_PIPELINE.SEE_DASHBOARD_FOR_PIPELINE
        }, [{name: 'OK', action: () => {
            isLoadEnd.value = true;
        }}]);
    }

    function _createScript(isPreProcess: any) {
        var $def = $.Deferred();
        utils_store.callApi({
            url: `${definitions_store.Definitions.CORE_API.usersUrl()}/tenants/${tenantId.value}/pipeline_scripts`,
            type: 'post',
            data: JSON.stringify({
                file_name: isPreProcess ? 'preprocess.py' : 'postprocess.py'
            }),
            contentType: 'application/json',
            dataType: 'json',
        }, (response: any) => {
            response.isPreProcess = isPreProcess;
            $def.resolve(response);
        }, (error: any, status: any, obj: any) => {
            $def.reject([error, status, obj]);
        });
        return $def.promise();
    }

    function _uploadScript(accessKeyId: any, secretAccessKey: any, sessionToken: any, uploadPath: any, file: any) {
        var $def = $.Deferred();
        const reg = new RegExp('\s3://(.+?)$');
        const bucketAndKey = uploadPath.match(reg)[1];
        const index = bucketAndKey.indexOf('/');
        const bucketName = bucketAndKey.substr(0, index);
        const key = bucketAndKey.substr(index + 1);
        const uploadBucketRegion = 'default';

        const s3 = new AWS.S3({
          accessKeyId,
          secretAccessKey,
          sessionToken,
          region: uploadBucketRegion
        });

        const s3Params = {
          Body: file,
          Bucket: bucketName,
          Key: key,
          ContentType : file.type
        };

        utils_store.s3_upload(s3, s3Params, $def.resolve, $def.reject);
        return $def.promise();
    }

    /**
         * Show complete download dialog.
         * @param actions {name: String,} representing button.
         */
    function showAvailableDownloadHtmlDialog(url: any) {
        const actions = [{name: 'Cancel', action: () => {
            reportProgress.value = 0;
            isCreateReport.value = false;
            reportUrl.value = '';
        }},{name: 'Download and Close', action: () => {
            reportProgress.value = 0;
            isCreateReport.value = false;
            reportUrl.value = '';
        }}];
        modal.value = {
            title: language.HTML_DOWNLOAD,
            htmlDownload: {
                message: '',
                link: url
            },
            actions: actions.map((elem: any) => Object.assign({
                name: elem.name,
                action: (value: any) => { 
                    // Vue.delete(this.modal, 'show'); 
                    // (elem.action || (value => undefined))(value); 
                    delete modal.value['show']
                    if(elem.action) {
                        elem.action(value)
                    }
                }
            })),
            show: true, // show dialog
        }
    }

    function _updatePipeline(pipelineId: any, pipelineName: any, trainInstanceType: any, evaluateInstanceType: any, preProcessScriptId: any, postProcessScriptId: any, resultFiles: any) {
        var $def = $.Deferred();
        utils_store.callApi({
            url: `${definitions_store.Definitions.CORE_API.usersUrl()}/tenants/${tenantId.value}/pipelines/${pipelineId}`,
            type: 'put',
            data: JSON.stringify({
                pipeline_name: pipelineName,
                project_id: Number(projectId.value),
                train_instance_type: trainInstanceType,
                evaluate_instance_type: evaluateInstanceType,
                pre_process_script_id: preProcessScriptId ? preProcessScriptId : undefined,
                post_process_script_id: postProcessScriptId ? postProcessScriptId : undefined,
                result_files: resultFiles
            }),
            contentType: 'application/json',
            dataType: 'json',
        }, (response: any) => {
            $def.resolve(response);
        }, (error: any, status: any, obj: any) => {
            $def.reject([error, status, obj]);
        });
        return $def.promise();
    }

    function _handlePipelineError(error: any, status: any, obj: any) {
        isLoadEnd.value = true;
        utils_store.handleXhrFailure(error, status, obj)
    }

    function createPipeline() {
        const actions = [{name: 'Cancel'},{name: 'Create', action: (params: any) => {
            isLoadEnd.value = false;
            params.fileName.push('result.nnp');

            _createPipeline(params.pipelineName, params.trainInstance, params.evaluateInstance, params.fileName, (result: any) => {
                const pipelineId = result.pipeline_id;
                const dataSources = params.dataSources.map((_data: any) => {
                    return {
                        name: _data.value,
                        trigger: _data.trigger
                    };
                });
                _createWorkflow(params.pipelineName, pipelineId, dataSources, params.isSendMail, (response: any) => {
                    if (!params.preProcess && !params.postProcess) {
                        // preProcess postProcessがない場合は処理終了
                        isLoadEnd.value = true;
                        showCompletePipelineDialog();
                        return;
                    }
                    const workflowId = response.workflow_id;
                    const promiseList = [];
                    if (params.preProcess) {
                        promiseList.push(_createScript(true));
                    }
                    if (params.postProcess) {
                        promiseList.push(_createScript(false));
                    }
                    Promise.all(promiseList).then((_responses) => {
                        const _promiseList = [];
                        let preProcessScriptId = '';
                        let postProcessScriptId = '';
                        _responses.forEach((_response) => {
                            if (_response.isPreProcess) {
                                preProcessScriptId = _response.script_id;
                                _promiseList.push(
                                    _uploadScript(_response.access_key_id, _response.secret_access_key, _response.session_token, _response.upload_url, params.preProcess)
                                );
                            } else {
                                postProcessScriptId = _response.script_id;
                                _promiseList.push(
                                    _uploadScript(_response.access_key_id, _response.secret_access_key, _response.session_token, _response.upload_url, params.postProcess)
                                );
                            }
                        });
                        _promiseList.push(_updatePipeline(pipelineId, params.pipelineName, params.trainInstance, params.evaluateInstance, preProcessScriptId, postProcessScriptId, params.fileName));

                        Promise.all(_promiseList).then(() => {
                            isLoadEnd.value = true;
                            showCompletePipelineDialog();
                        }, () => {
                            popup(language.ERROR, language.CREATE_PIPELINE.SCRIPT_UPLOAD_ERROR, [{name: 'OK',},]);
                            isLoadEnd.value = true;
                        });
                    }, (errorArray) => {
                        _handlePipelineError(errorArray[0], errorArray[1], errorArray[2]);
                    });

                }, _handlePipelineError);
            }, _handlePipelineError);
        }}];
        modal.value = {
            title: language.CREATE_PIPELINE.title,
            type: 'createPipeline',
            actions: actions.map(elem => Object.assign({
                name: elem.name,
                action: (value: any) => { 
                    // Vue.delete(this.modal, 'show'); 
                    // (elem.action || (value => undefined))(value); 
                    delete modal.value['show']
                    if(elem.action) {
                        elem.action(value)
                    }
                }
            })),
            show: true, // show dialog
        }
    }

    /**
     * Show prompt dialog.
     * @param title dialog title (prompt message)
     * @param initialValue initial value in input text area
     * @param actions array of pair {name: Strinng, action: function} representing button.
     * last action is set to 'Default'.
     * Default action called back with text input value on its first parameter.
     */
    function prompt(title: any, initialValue: any, actions: any) {
        modal.value = {
            title: title,
            initialValue: initialValue,
            actions: actions.map((elem: any) => Object.assign({
                name: elem.name,
                action: (value: any) => { 
                    // Vue.delete(this.modal, 'show'); 
                    // (elem.action || (value => undefined))(value); 
                    delete modal.value['show']
                    if(elem.action) {
                        elem.action(value)
                    }
                }
            })),
            show: true, // show dialog
        }
    }

    function showMetaDialog(metaList: any, actions: any) {
        modal.value = {
            title: language.TAGS_WHEN_PROJECT_PUBLISHED,
            text: language.ENTER_TAGS,
            metaList: metaList,
            actions: actions.map((elem: any) => Object.assign({
                name: elem.name,
                action: (value: any) => { 
                    // Vue.delete(this.modal, 'show'); 
                    // (elem.action || (value => undefined))(value); 
                    delete modal.value['show']
                    if(elem.action) {
                        elem.action(value)
                    }
                }
            })),
            show: true, // show dialog
        }
    }

    function getReport(reportId: any) {
        utils_store.callApi({
            url: definitions_store.Definitions.CORE_API.usersUrl() + "/projects/" + projectId.value + "/reports/" + reportId,
            type: 'get',
            contentType: 'application/json',
            dataType: 'json',
        }, (result: any) => {
            if (result.status === 'ready' || result.status === 'processing') {
                reportProgress.value = result.progress;
                const TIMER = 10 * 1000;
                setTimeout(() => {
                    getReport(reportId);
                }, TIMER);
            } else if (result.status === 'completed') {
                reportProgress.value = result.progress;
                reportUrl.value = result.download_url;
                if (!modal.value.show) { // モーダルは後勝ちの為、既に何か表示していた場合はスルー
                    showAvailableDownloadHtmlDialog(result.download_url);
                }
            } else if (result.status === 'failed') {
                reportProgress.value = 0;
                isCreateReport.value = false;
                reportUrl.value = '';
                popup(language.FAILED_TO_EXPORT_PROJECT_AS_HTML, language.PLEASE_TRY_AGAIN, [{name: 'OK',},]);
            }
        }, (error: any, status: any, httpErrorThrown: any) => {
            isLoadEnd.value = true;
            utils_store.handleXhrFailure(error, status, httpErrorThrown);
        });
    }

    function exportHtml(jobId?: any) {
        isCurrentNetwork.value = jobId ? false : true;
        nextTick(() => {
            getReportFiles(jobId).then((files: any) => {
                var type = files.findIndex((file: any) => file.name === 'learning_curve.png') !== -1 ? 'network_and_result' : 'network';
                utils_store.callApi({
                    url: definitions_store.Definitions.CORE_API.usersUrl() + "/projects/" + projectId.value + "/reports",
                    type: 'post',
                    data: JSON.stringify({
                        job_id: jobId,
                        destination: 'local',
                        files: files,
                        report_type: type
                    }),
                    contentType: 'application/json',
                    dataType: 'json',
                }, (result: any) => {
                    reportProgress.value = 1;
                    isCreateReport.value = true;
                    popup(language.NOTICE, language.PLEASE_WAIT_FOR_HTML_FORMAT, [{name: 'OK', action: () => {
                        getReport(result.report_id);
                    }},]);
                }, (error: any, status: any, httpErrorThrown: any) => {
                    isLoadEnd.value = true;
                    utils_store.handleXhrFailure(error, status, httpErrorThrown);
                });
            });
        });
    }

    function onDownload(type: any) {
        if (type === 'html') {
            exportHtml(result_store.getActiveResult().job_id);
            return;
        }
        utils_store.callApi({
            url: definitions_store.Definitions.CORE_API.usersUrl() + "/projects/" + projectId.value + "/jobs/" + result_store.getActiveResult().job_id + "/download?format=" + type,
            type: 'GET',
            dataType: 'json',
        }, (result: any) => {
            var a = document.createElement('a');
            a.href = result.download_url;
            a.click();
        }, (error: any, status: any, obj: any) => {
            if (error.responseJSON.error === "NNCD_STATUS_INCORRECT") {
                popup('Failed to download', language.CAN_NOT_DOWNLOAD_FROM_SCHEDULED_OR_RUNNNING, [{name: 'OK',},]);
            } else {
                isLoadEnd.value = true;
                utils_store.handleXhrFailure(error, status, obj);
            }
        });
    }

    /**
     * Show re-edit dialog.
     * @param title dialog title
     * @param selectedAction initial value of selected action
     * @param actions array of pair {name: Strinng, action: function} representing button.
     * last action is set to 'Default'.
     * Default action called back with selected value on its first parameter.
     */
    function reedit(title: any, selectedAction: any, actions: any) {
        modal.value = {
            title: title,
            selectedAction: selectedAction,
            actions: actions.map((elem: any) => Object.assign({
                name: elem.name,
                action: (value: any) => { 
                    // Vue.delete(this.modal, 'show'); 
                    // (elem.action || (value => undefined))(value); 
                    delete modal.value['show']
                    if(elem.action) {
                        elem.action(value)
                    }
                }
            })),
            show: true, // show dialog
        }
    }

    function _openNetworksInEditor(_configuration: any) {
        activeTabName.value = "EDIT";
        nextTick(function () {
            utils_store.load(_configuration.networks);
            configuration.value = utils_store.serialize_configuration()
        });
    }

    function onOpenNetwork(weight: any) {
        var job_id = result_store.getActiveResult().job_id;
        isLoadEnd.value = false;
        if (weight) {
            result_store.getTrainResult(job_id, (result: any) => {
                utils_store.completeWeightParameter(result.configuration, job_id, _openNetworksInEditor);
                isLoadEnd.value = true;
            });
        } else {
            result_store.getTrainResult(job_id, (result: any) => {
                _openNetworksInEditor(proj_convert_store.importProject(result.configuration));
                isLoadEnd.value = true;
            });
        }
    }

    function onOpenReEdit() {
        reedit('Re-edit', 'Open in Edit Tab', [{name: 'Cancel', }, {name: 'OK', action: (selectedAction: any) => {
            if ( selectedAction === 'Open in Edit Tab' ) {
                onOpenNetwork(false);
            } else if ( selectedAction === 'Open in Edit Tab with Weight' ) {
                onOpenNetwork(true);
            } else if ( selectedAction === 'Re-train' ) {
                let usedInstance = result_store.getActiveResult().instance_group;
                const instance = availableInstances.value.train.find((instance: any) => instance.instance_type === usedInstance) || {};
                if (instance.available) {
                    onTriggeredJob('retrainNotInPlace', usedInstance);
                } else {
                    const CPU_INSTANCE = 1;
                    onTriggeredJob('retrainNotInPlace', CPU_INSTANCE);
                }
            }
        }, }, ]);
    }

    function publishProject(jobId: any) {
        isCurrentNetwork.value = false;

        const NETWORK_ONLY = language.NETWORK_ONLY;
        const NETWORK_JOB = language.NETWORK_JOB;
        var index = result_store.data.findIndex((result: any) => result.job_id == jobId);
        if (index === -1) {
            // ここには入らない
            return;
        }
        const hasResults = !['queued', 'preprocessing', 'processing', 'failed'].includes(result_store.data[index].status);

        var list = [
            {
                value: NETWORK_ONLY,
                description: language.ONLY_THE_NETWORK_OF_SELECTED_JOB
            },
            {
                value: NETWORK_JOB,
                description: language.THE_NETWORK_AND_RESULTS_OF_SELECTED_JOB,
                disabled: !hasResults
            }
        ];
        const message = '';
        showPublishProjectDialog('Publish project', message, list, NETWORK_ONLY, [{name: 'Cancel', }, {name: 'OK', action: (selectedAction: any) => {
            var isExcludeGraph = selectedAction === NETWORK_ONLY;
            getReportFiles(jobId, isExcludeGraph).then((files: any) => {
                _publish(jobId, files);
            });
        }, }, ]);
    }

    function showPluginDialog(plugin: any, target: any, actions: any) {
        modal.value = {
            title: plugin.description,
            plugin,
            target,
            actions: actions.map((elem: any) => Object.assign({
                name: elem.name,
                action: (value: any) => { 
                    // Vue.delete(this.modal, 'show'); 
                    // (elem.action || (value => undefined))(value); 
                    delete modal.value['show']
                    if(elem.action) {
                        elem.action(value)
                    }
                }
            })),
            show: true,
        }
    }

    function fetchResultsAll(isAll?: boolean, isFirst?: boolean) {
        const total = result_store.metadata.total;
        if (!total) {
            fetchResults();
        } else {
            var _fetchResults = (offset: any) => {
                var $def = $.Deferred();
                fetchResults(() => $def.resolve(), offset);
                return $def.promise();
            };

            var _isActiveJob = (offset: any) => {
                const jobs = result_store.data.slice(offset, offset + 10);
                return jobs.findIndex((job: any) => utils_store.is_active(job)) !== -1;
            };

            var $promiseObj;
            for (var i = 0; i < Math.ceil(total / 10); i++) {
                const offset = i * 10;
                if ($promiseObj) {
                    // 初回は全件取得し、二回目以降はアクティブなジョブが含まれているものを取得
                    if (isFirst || isAll || _isActiveJob(offset)) {
                        $promiseObj = $promiseObj.then(() => _fetchResults(offset));
                    }
                } else {
                    $promiseObj = _fetchResults(offset);
                }
            }
        }
    }

    function setPollingForFetchResults() {
        var isFirst = true;
        var _fetchResults = () => {
            if ((utils_store.getNetworkConnectivity() && shouldCallGetJobs()) || isFirst) {
                fetchResultsAll(false, isFirst);
                isFirst = false;
            }
            setTimeout(_fetchResults, 3000);
        };
        _fetchResults();
    }

    function shouldCallGetJobs() {
        return activeTabName.value === 'TRAINING' || activeTabName.value === 'EVALUATION' || activeTabName.value === 'INFERENCE';
    }

    function getUseRate() {
        utils_store.callApi({
            url: definitions_store.Definitions.CORE_API.baseUrl() + '/misc/abci_use_rate',
            type: 'get',
            dataType: 'json',
        }, (result: any) => {
            abciUseRate.value = result.use_rate_percentage || 0;
        });
    }

    /**
     * update user input value in this propMap.
     */
    function onChangedProperty(layer: any, propName: any, propValue: any) {
        if (propMap.value[layer].props.find((prop: any) => prop.name === propName)) {
            propMap.value[layer].props.find((prop: any) => prop.name === propName).value = propValue;
            selection.value.props = propMap.value[selection.value.main];
        }
    }

    /**
     * @param {Set} layers represent layer selection.
     */
    function onChangedSelection(layers: any) {
        selection.value = {
            main: (layers.focused() || {name: () => ''}).name(),
            all: layers.apply((layer: any) => layer.name()),
        };
        _updateSelectedLayer();
    }

    function onDeletedLayer(name: any) {
        delete propMap.value[name];
    }

    return { 
        params,
        projectName,
        zoomInfo,
        showNetworkForReport,
        graphIndex,
        downloadType,
        downloadFormats,
        statistics,
        rightWidth,
        tenantList,
        isLocal,
        postingJob,
        abciMaintenanceList,
        abciUseRate,
        reportProgress,
        reportUrl,
        numNodes,
        isCurrentNetwork,
        isShowInLocalEditor,
        availableInstances,
        hasShareTenant,
        modal,
        freeCpuHours,
        services,
        isRegistered,
        editTabInstance,
        configuration,
        resumeInstance,
        updateDetection,
        jobConfiguration,
        jobGraphIndex,
        jobCompletedConfiguration,
        editTabIsActive,
        jobStatisticActive,
        members,
        activeTabName, 
        isCopying,
        tenantId, 
        projectId,
        isCreateReport,
        readOnly,
        isLoadEnd,
        selection,
        selectedComponent,
        completedConfiguration,
        activeTabNameLowerCase,
        forceRegister,
        plugins,
        allInstances,
        nickname,
        isFreeCpuExceeded,
        reportConfiguration,
        reportCompletedConfiguration,
        isWorkspaceExceeded,
        shouldShowUploadDialog,
        init,
        changedNumNode,
        onSave,
        onSaveAs,
        onPublishProject,
        onJobTypeChanged,
        onPriorityChanged,
        exportPythonCode,
        exportPrototxt,
        showPluginDialog,
        onTriggeredJob,
        onChoiceChanged,
        onRenamed,
        popup,
        onAddedLayer,
        initPropMap,
        onComputedProperties,
        updateStatistics,
        onComputedErrors,
        showReadOnlyDialog,
        showUnitCreateDialog,
        operateZooming,
        windowInit,
        windowBind,
        isUserRole,
        registerPopup,
        updateCpuFreeHours,
        createPipeline,
        showAvailableDownloadHtmlDialog,
        prompt,
        showMetaDialog,
        onDownload,
        exportHtml,
        onOpenReEdit,
        onOpenNetwork,
        publishProject,
        fetchResults,
        fetchResultsAll,
        isCompletedDataset,
        updateIsLoadEnd,
        setPollingForFetchResults,
        shouldCallGetJobs,
        getUseRate,
        onChangedProperty,
        onChangedSelection,
        onDeletedLayer
    }
})
