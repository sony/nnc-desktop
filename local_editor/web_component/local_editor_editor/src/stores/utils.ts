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

import { ref, computed, reactive, nextTick, toRaw } from 'vue'
import { defineStore } from 'pinia'
import {useGraphStore} from './graph'
import {useDatasetStore} from './dataset'
import {useNNABLACoreDefStore} from './nnabla_core_def'
import {useConfigStore} from './config'
import {useProjConvertStore} from './project_converter'
import {useDefinitionsStore} from './misc/definitions'
import { useLanguageStore } from './misc/languages'
import { useSVGAreaStore } from './editor/svgarea'
import { useAuthStore } from './auth'
import {useEditorStore} from './editor'
import {useNetworkStore} from './network'
import IndexOperator from '@/objects/IndexOperator'
import {useLRCurveGraphForHtmlStore} from './training_graph/learning_curve_for_html'

export const useUtilsStore = defineStore('utils', () => {
    const graph_store = useGraphStore()
    const auth_store = useAuthStore()
    const proj_convert_store = useProjConvertStore()
    const config_store = useConfigStore()
    const network_store = useNetworkStore()
    const svgarea_store = useSVGAreaStore()
    const editor_store = useEditorStore()
    const definitions_store = useDefinitionsStore()
    const dataset_store = useDatasetStore()
    const learning_curve_for_html_store = useLRCurveGraphForHtmlStore()
    const language_store = useLanguageStore()
    const nnabla_core_def_store = useNNABLACoreDefStore()

    // state
    const _networkConnectivity = ref<boolean>(true) // remember the status of network connectivity.
    const params = ref<any>({})
    const _timeoutIds = ref<any>({})
    const _nnablamdaCalls = ref<any>({})
    const _calcSdcproj = ref<string>('')
    const _lastSavedConfiguration = ref<string>('') // sdcprojが入る
    const isPopUp = ref<boolean>(false)

    // getters
    const getParams = computed(() => {
        if (Object.keys(params.value).length === 0) {
            let _params = location.search.substring(1).split('&');
            _params.forEach(param => {
                let key_value = param.split('=')
                params.value[key_value[0]] = key_value[1]
            })
        }
        return params.value
    })

    const getProjectId = computed(() => {
        return getParams.value.project_id;
    })


    // actions
    /*
     * key に関連付けた callback を timeout 後に設定する。
     * すでに key に callback が関連付けられていたら先にこれをキャンセルする。
     * callback を指定しなければキャンセルのみを実行する。
     * @param key callback を管理するためのキー
     * @param callback timeout 後に呼び出すコールバック関数
     * @param timeout callback 呼び出しの遅延時間。指定しなければ 2500ms
     */
    function setTimeoutWrapped(key: string, callback: Function, timeout: number) {
        clearTimeout(_timeoutIds.value[key])
        delete _timeoutIds.value[key]

        if (callback) {
            _timeoutIds.value[key] = setTimeout(() => {
                delete _timeoutIds.value[key]
                callback()
            }, timeout || 2500)
        }
    }

    /**
     * resultを基に、NetworkGraphをロードする
     * @param result
     */
    function load(networks: any) {
        network_store.Graphs.reset(networks);
        if (svgarea_store) {
            svgarea_store.requestAdjustSize();
        }
    }

    function move(name: string, position: { x: number; y: number; }) {
        const networkTabIndex = network_store.Graphs.targetIndex();
        const nodeIndex = editor_store.configuration.networks[networkTabIndex].nodes.findIndex((node: any) => node.name === name);
        editor_store.configuration.networks[networkTabIndex].nodes[nodeIndex].x = position.x;
        editor_store.configuration.networks[networkTabIndex].nodes[nodeIndex].y = position.y;
    }

    function _callApi(request: any, doneCallback: any, failedCallback?: any, alwaysCallback?: any) {
        return $.ajax(request)
                .done(doneCallback)
                .fail(failedCallback)
                .always(alwaysCallback);
    }


    function _generateNetworks() {
        network_store.Graphs.flush(); // reflect current edit into data.
        return network_store.Graphs.data();
    }

    function _generateConfiguration(networks?: any) {
        var configuration = {
            networks: networks || _generateNetworks(),
        };
        return Object.assign(configuration, dataset_store.serialize_data(), config_store.serialize_data());
    }

    /**
     * Call nnablamda.
     *
     * @param {string} command 'complete' or 'error_check'
     * @param {string} data neural network console project file string.
     * @param {Object} options command specific option dictionary.
     * @param {(result) => cancellable} callback
     * @return cancellable object
     */
    function _nnablamda(command: string, data: any, options: any, callback: any) {
        let request = {
            url: definitions_store.Definitions.CORE_API.baseUrl() + '/misc/nnablambda',
            type: 'post',
            data: JSON.stringify({ command: command, data: data, options: options, }),
            contentType: 'application/json',
            dataType: 'text',
        }
        let failedCallback = (error: any, status: any) => {
            if (status !== 'abort') {
                editor_store.isLoadEnd = true;
                _handleXhrFailure(error);
            }
        }
        var xhr: any = _callApi(request, callback, failedCallback);

        return {
            status: () => ((xhr || {}).readyState || 0), // readyState 0 means UNSENT
            cancel: () => {
                switch ((xhr || {}).readyState) {
                case 1:
                case 2:
                case 3:
                    xhr.abort();
                    break;
                default:
                    break; // nothing to do
                }
            },
        };
    }

    function _getStatistics(sdcproj: any) {
        var _parseStatisticsObj = function(statisticsObj: any, index: any, key: any) {
            return statisticsObj['Statistics_' + index + '_' + key];
        }

        const configuration = proj_convert_store.importProject(sdcproj);
        const parsedObj = proj_convert_store.parseIni(sdcproj);

        if (configuration.networks.length === 1) {
            const statisticsObj = parsedObj.Statistics;
            const statisticList = [];
            for (let i = 0; i < statisticsObj.NumStatistics; i++) {
              statisticList.push({
                name: _parseStatisticsObj(statisticsObj, i, 'Name'),
                max: _parseStatisticsObj(statisticsObj, i, 'Max'),
                sum: _parseStatisticsObj(statisticsObj, i, 'Sum')
              });
            }
            return [statisticList];
        }
        return configuration.networks.map((network: any, index: any) => {
            const statisticsObj = parsedObj[network.name + '_Statistics'];
            const statisticList = [];
            for (let i = 0; i < statisticsObj.NumStatistics; i++) {
                statisticList.push({
                    name: _parseStatisticsObj(statisticsObj, i, 'Name'),
                    max: _parseStatisticsObj(statisticsObj, i, 'Max'),
                    sum: _parseStatisticsObj(statisticsObj, i, 'Sum')
                });
            }
            return statisticList;
        });
    }

    function _setProperties() {
        var configuration = _generateConfiguration();
        var currentGraphName = network_store.Graphs.flush().name;

        var _networks = configuration.networks;

        try {
            var componentType = proj_convert_store.getComponentType(_calcSdcproj.value);
            var targetIndex = network_store.Graphs.targetIndex();
            network_store.Graphs.feed(_networks[targetIndex].name, proj_convert_store.importProject(_calcSdcproj.value).networks[targetIndex], componentType[targetIndex].properties);

            var parsedSdcproj = proj_convert_store.parseIni(_calcSdcproj.value);
            var _statistics = parsedSdcproj.Statistics || parsedSdcproj[currentGraphName + '_Statistics'];
            network_store.Graphs.stat(currentGraphName, _statistics, componentType[targetIndex].params);

            var layers = graph_store.getLayers((layer: any) => layer);
            editor_store.initPropMap(layers);
            configuration = proj_convert_store.importProject(_calcSdcproj.value);

            editor_store.completedConfiguration = {
                networks: configuration.networks,
                statistics: _getStatistics(_calcSdcproj.value)
            };
        } catch (e) {
            // TODO retry, consider to avoid burst.
            console.error("_setProperties failed: ", e)
        }
    }

    function _calcAndSetPropsAndErrors() {
        if (graph_store.getLayers().length > 0) { // skip calculation, if there is no component on the graph.
            var configuration = _generateConfiguration()
            var sdcproj = proj_convert_store.exportProject(configuration);

            if (_nnablamdaCalls.value.complete) {
                _nnablamdaCalls.value.complete.cancel();
            }
            var complete = _nnablamda('complete', sdcproj, null, (sdcproj: any) => {
                _calcSdcproj.value = sdcproj;

                if (_nnablamdaCalls.value.complete === complete) {
                    delete _nnablamdaCalls.value.complete;
                }

                _setProperties();
            });
            _nnablamdaCalls.value.complete = complete;

            if (_nnablamdaCalls.value.error_check) {
                _nnablamdaCalls.value.error_check.cancel();
            }
            var error_check = _nnablamda('error_check', sdcproj, null, (errors: any) => {
                if (_nnablamdaCalls.value.error_check === error_check) {
                    delete _nnablamdaCalls.value.error_check;
                }
                try {
                    network_store.Graphs.error(errors);
                } catch (e) {
                    // TODO retry, consider to avoid burst.
                    console.error(e);
                }
            });
            _nnablamdaCalls.value.error_check = error_check;
        }
    }

    function _format(format: string, ...args: any[]) {
        const replaceFunction = (m: any, k: string) => {
            return args[ parseInt(k, 10) - 1];
         };
         return format.replace( /\%@(\d+)/g, replaceFunction);
    }

    /**
     * get component
     * @param {string} type component type name
     * @returns {component}
     */
    function _component(type: string): any {
        return nnabla_core_def_store.nnablaCore.layers.components.find((component: any) => component.name == type);
    };

        /**
     * M-DCIM セッションの回復チャレンジ
     *
     * 一度呼び出したら、なにもしない関数に置き換えることで多数回呼び出してしまう問題を防ぐ。
     * 現状の onUnAuthorized 実装は別ページへの遷移とページリロードになっている。
     * よってセッションが回復したら（ページリロードにより） _recoverMdcimSession も再度呼び出し可能になる。
     *
     * @param {*} response HTTP Response object.
     * @return true if recover challenge attempted, otherwise false.
     */


    var _ignoredTimeout: any; // remember the attempt to ignore API timeout error.
    function _handleXhrFailure(xhr: any, status?: any, httpErrorThrown?: any){
        const resp = xhr.responseJSON;
        const pageUrl = location.href.replace('/editor', '/editor#' + editor_store.activeTabName);
        const apiUrl = xhr.requestURL;
        const method = xhr.requestType;
        const userId = definitions_store.Definitions.USER.ID();
        let error;
        let message;
        if (xhr.responseJSON) {
            error = xhr.responseJSON.error;
            message = xhr.responseJSON.message;
        } else {
            error = 'ERROR';
            message = 'Unexpected Error';
        }
        switch(xhr.status) {
            case 408: // Request Timeout
            case 504: // Gateway Timeout
                if (!_ignoredTimeout) {
                    _ignoredTimeout = 1; // first time
                    console.log('SKIP timeout error', xhr);
                    return; // ignore timeout error for the first time it catched.
                } else {
                    // 2nd time and after, timeout is handled as default error.
                    if (!resp) {
                        // if responseJSON does not exist, add it to show hint in error for the USER.
                        xhr.responseJSON = {
                            code: 'undefined; -- ' + xhr.status + ' TIMEOUT --',
                        };
                    }
                }
                break;
            case 400:
                // if (_recoverMdcimSession(resp || {})) {
                //     EditorUtils.callApi = () => null;
                //     _callApi = () => null;
                //     return; // break failure handling.
                // }
                break;
            case 0: // Possibility of Network down
                // EditorUtils.callApi = () => _offLinePopup();
                // _callApi = () => _offLinePopup();
                // if (!_networkConnectivity) {
                //     return; // ignore if _checkNetwork() is running
                // }
                // _networkConnectivity = false;
                // _checkNetwork(pageUrl, apiUrl, method, error, message, userId, resp);
                return;
                /* $fall-through$ */
            default:
                // XXX DAY 1: delete this default case
                // and enumerate ALL error status codes to the side of 'case 400'.
                if ((resp || {}).error === 'NNCD_STATUS_INCORRECT') {
                    return; // JUST ignore; for example, in the case of trying to suspend the suspended job.
                }
                break;
        }
        // _postLog(pageUrl, apiUrl, method, error, message, userId, _showErrorPopup.bind(this, resp), _showErrorPopup.bind(this, resp))
    }

    function _setCalcProps(){
        if (graph_store.getLayers().length > 0) { // skip calculation, if there is no component on the graph.
            if (_calcSdcproj.value) _setProperties();
        }
    };

    function _allowedUserOperation() {
        return editor_store.isLoadEnd
    }

    function _editTabIsActive() {
        return editor_store.activeTabName === 'EDIT'
    }

    function _calcArrangedPositions(network: any, callback: any) {
        var configuration = _generateConfiguration(network);
        var sdcproj = proj_convert_store.exportProject(configuration);

        if (_nnablamdaCalls.value.arrange_layers) {
            _nnablamdaCalls.value.arrange_layers.cancel();
        }
        var arrange_layers = _nnablamda('arrange_layers', sdcproj, null, (sdcproj: any) => {
            if (_nnablamdaCalls.value.arrange_layers === arrange_layers) {
                delete _nnablamdaCalls.value.arrange_layers;
            }
            try {
                (callback || ((sdcproj: any) => undefined))(proj_convert_store.importProject(sdcproj).networks[0]);
            } catch (e) {
                // TODO retry, consider to avoid burst.
                console.error(e);
            }
        });
        _nnablamdaCalls.value.arrange_layers = arrange_layers;
    }

    function _indexOperator(array: any, value: any) {
        return new IndexOperator(toRaw(array), value)
    }

    function _calcProps(configuration: any) {
        var $def = $.Deferred();
        if (configuration) {
            var sdcproj = proj_convert_store.exportProject(configuration);

            if (_nnablamdaCalls.value.jobComplete) {
                _nnablamdaCalls.value.jobComplete.cancel();
            }
            var jobComplete = _nnablamda('complete', sdcproj, null, (sdcproj: any) => {
                if (_nnablamdaCalls.value.jobComplete === jobComplete) {
                    delete _nnablamdaCalls.value.jobComplete;
                }
                try {
                    $def.resolve({
                        networks: proj_convert_store.importProject(sdcproj).networks,
                        statistics: _getStatistics(sdcproj)
                    });
                } catch (e) {
                    // TODO retry, consider to avoid burst.
                    console.error(e);
                }
            });
            _nnablamdaCalls.value.jobComplete = jobComplete;
        }
        return $def.promise();
    }

    function _is_active(job: any) {
        return ['queued', 'preprocessing', 'processing'].includes(job.status)
    }

    function getNewJobName() {
        return (new Date()).toISOString().replace('T', '_').replace(/[-:]/g, '').substring(0, 15)
    }

    /**
     * Check errors in graph before starting training.
     *
     * @param configuration configuration to check errors.
     * @param callback receiver of errors from nnablambda call, subcommand 'error_check'.
     */
    function _checkErrors(configuration: any, callback: any) {
        var sdcproj = proj_convert_store.exportProject(configuration, true);
    
        if (_nnablamdaCalls.error_check) {
            _nnablamdaCalls.error_check.cancel();
        }
        var error_check = _nnablamda('error_check', sdcproj, null, (errors: any) => {
            if (_nnablamdaCalls.error_check === error_check) {
                delete _nnablamdaCalls.error_check;
            }
            try {
                (callback || ((errors: any) => undefined))(errors);
            } catch (e) {
                // TODO retry, consider to avoid burst.
                console.error(e);
            }
        });
        _nnablamdaCalls.error_check = error_check;
    }

    function _handleLimitExceededAndCascadeDefault(jobType: any, isRegistered: boolean) {
        return (error: any, status: any, httpErrorThrown: any) => {
            if (isRegistered && (error.responseJSON || {}).error === 'NNCD_STORAGE_LIMIT_EXCEEDED') {
                if (editor_store.isUserRole()) {
                    var message = language_store.language.WORKSPACE_OF_GROUP_IS_FULL_CONTACT_ADMIN;
                    editor_store.popup('Failed to copy', message, [{name: 'OK',},])
                } else {
                    editor_store.registerPopup('Failed to ' + jobType, language_store.language.WORKSPACE_IS_FULL, [{name: 'Go to Service Settings',},]);
                }
            } else if ((error.responseJSON || {}).error === 'NNCD_BUDGET_LIMIT_EXCEEDED') {
                editor_store.registerPopup('Failed to ' + jobType, language_store.language.REACHED_THE_UPPER_LIMIT, [{name: 'Go to Service Settings',},]);
            } else if ((error.responseJSON || {}).error === 'NNCD_CPU_LIMIT_EXCEEDED' ||
                (error.responseJSON || {}).error === 'NNCD_STORAGE_LIMIT_EXCEEDED') {
                if (definitions_store.Definitions.REGISTRABLE()) {
                    editor_store.registerPopup('Failed to ' + jobType,
                    language_store.language.YOU_HAVE_CONSUMED_ALL_FREE_CPU,
                        [{name: 'Enter credit card',},]);
                } else {
                    editor_store.popup('Failed to ' + jobType,
                    language_store.language.YOU_HAVE_CONSUMED_ALL_RESOURCES,
                        [{name: 'OK',},]);
                }
            } else if ((error.responseJSON || {}).error === 'NNCD_BAD_DATASET_ID') {
                editor_store.popup('Failed to ' + jobType,
                language_store.language.LINKED_DATASET_MIGHT_BE_DELETED,
                    [{name: 'OK',},]);
            } else if ((error.responseJSON || {}).error === 'NNCD_ABCI_MAINTENANCE_ERROR') {
                // 先に画面側でメンテナンス情報をチェックしているので、ここに入ることは基本ない
                const message = language_store.language.SORRY_ABCI_IS_UNABAILABLE;
                editor_store.popup('Error', message, [{name: 'OK',},]);
            /* nncd: add error info */
            } else if ((error.responseJSON || {}).error === 'NNCD_NNCD_BAD_REQUEST') {
                const message = error.responseJSON.message;
                editor_store.popup('Error', message, [{name: 'OK',},]);
            /*****************/
            } else {
                _handleXhrFailure(error, status, httpErrorThrown);
            }
        }
    }

    function save_configuration(atLast?: any) {
        if (editor_store.readOnly) {
            return;
        }
        var currentConfiguration = proj_convert_store.exportProject(_generateConfiguration(editor_store.configuration.networks), true);
        if (_lastSavedConfiguration.value === currentConfiguration) {
            if (atLast !== undefined) {
                // Save時の挙動を合わせるために、setTimeoutしている
                var show_dummy_loading = function() {
                    atLast();
                };
                setTimeout(show_dummy_loading, 500);
            }
            return;
        }
        _lastSavedConfiguration.value = currentConfiguration;
        _callApi({
            url: definitions_store.Definitions.CORE_API.usersUrl() + '/projects/' + editor_store.projectId + '/configuration',
            type: 'PUT',
            data: JSON.stringify({
                'configuration': currentConfiguration,
                'configuration_format': 'sdcproj'
            }),
            contentType: 'application/json',
        }, (result: any) => {
            if (result.status === 'locked') {
                if (!editor_store.readOnly) {
                    editor_store.readOnly = true;
                    editor_store.showReadOnlyDialog(result.last_modified_user_id);
                }
            }
            editor_store.isLoadEnd = true;
        }, () => {
            editor_store.isLoadEnd = true;
            _handleXhrFailure;
        }, atLast || (() => undefined));
    }

    function _getNetworkImage(svg: any, i: any) {
        var $def = $.Deferred();
        var data = btoa(unescape(encodeURI(new XMLSerializer().serializeToString(svg))));
        var $canvas: any = $('#canvas_network_' + i);
        var ctx = $canvas[0].getContext("2d");
        var image = new Image();
        image.onload = function() {
            ctx.drawImage(image, 0, 0);
            $def.resolve($canvas[0].toDataURL().split('data:image/png;base64,')[1]);
        }
        image.src = "data:image/svg+xml;charset=utf-8;base64," + data;
        return $def.promise();
    }

    function _getNetworkImages() {
        return new Promise((resolve) => {
            editor_store.showNetworkForReport = true;
            nextTick(() => {
                var $networks = $('.network_for_html');
                if (!$networks.length) {
                    debugger;
                    editor_store.showNetworkForReport = false;
                    return resolve([]);
                }

                var promiseList: any = [];
                $networks.each((i: any, network: any) => {
                    promiseList.push(_getNetworkImage(network, i));
                });

                Promise.all(promiseList).then((list) => {
                    resolve(list);
                    editor_store.showNetworkForReport = false;
                });
            });
        });
    }

    function _getGraphImage(jobId: any) {
        var $def = $.Deferred();
        if (!jobId) {
            setTimeout(() => { $def.resolve(''); });
            return $def.promise();
        }
        learning_curve_for_html_store.learningCurve(jobId);
        var $svg: any = $('#learning_curve_for_html > div > svg');
        if (!$svg.length) {
            setTimeout(() => { $def.resolve(''); });
            return $def.promise();
        }
        var data = btoa(unescape(encodeURI(new XMLSerializer().serializeToString($svg[0]))));
        var $canvas: any = $('#canvas_learning_curve_for_html');
        $canvas.attr('width', $svg.width());
        $canvas.attr('height', $svg.height());
        var ctx = $canvas[0].getContext("2d");
        var image = new Image();
        image.onload = function() {
            ctx.drawImage(image, 0, 0);
            $def.resolve($canvas[0].toDataURL().split('data:image/png;base64,')[1]);
        }
        image.src = "data:image/svg+xml;charset=utf-8;base64," + data;
        return $def.promise();
    }

    function _getReferences() {
        const configuration = editor_store.isCurrentNetwork ? editor_store.configuration : editor_store.jobConfiguration;

        if (!configuration || !configuration.networks) {
            return [];
        }
        const references: any = [];
        configuration.networks.forEach((network: any) => {
            if (!network || !network.nodes) {
                return;
            }
            network.nodes.forEach((node: any) => {
                if (_component(node.type).reference) {
                    if (references.findIndex((reference: any) => reference.ReferenceLayer === node.type) === -1) {
                        references.push({
                            ReferenceLayer: node.type,
                            Reference: _component(node.type).reference
                        });
                    }
                }
            });
        });
        configuration.optimizers.forEach((optimizer: any) => {
            try {
                const updaterName = optimizer.updater.name;
                const solver: any = nnabla_core_def_store.nnablaCore.solvers.find((solver: any) => solver.name === updaterName);
                if (solver.reference) {
                    if (references.findIndex((reference: any) => reference.ReferenceLayer === updaterName) === -1) {
                        references.push({
                            ReferenceLayer: updaterName,
                            Reference: solver.reference
                        });
                    }
                }
            } catch (e) {
                // 取得できない場合はなにもしない
            }
        });
        return references;
    }

    function s3_upload(s3: any, s3Params: any, successCallback: any, errorCallback: any) {
        s3.putObject(s3Params, (err: any) => {
            if (!err) {
              successCallback();
            } else {
              errorCallback();
            }
          });
    }

    function toUniqueName(name: any, list: any) {
        var index = 1;
        var duplicated = function (name: any) {
            return list.some((el: any) => el.name == name);
        };
        if (duplicated(name)){
            while (duplicated(name + '_' + index)) {
                index++;
            }
        } else {
            return name;
        }
        return name + '_' + index;
    }

    function _completeWeightParameter(sdcproj: any, jobId: any, callback: any) {
        if (_nnablamdaCalls.complete_weight_params) {
            _nnablamdaCalls.complete_weight_params.cancel();
        }
        var complete_weight_params = _nnablamda('get_parameter_name', sdcproj, {"-j": jobId,}, (sdcproj: any) => {
            if (_nnablamdaCalls.complete_weight_params === complete_weight_params) {
                delete _nnablamdaCalls.complete_weight_params;
            }
            try {
                if (callback) {
                    callback(proj_convert_store.importProject(sdcproj));
                }
            } catch (e) {
                // TODO retry, consider to avoid burst call.
                console.error(e);
            }
        });
        _nnablamdaCalls.complete_weight_params = complete_weight_params;
    }

    function _set_last_saved_configuration(configuration: any) {
        _lastSavedConfiguration.value = proj_convert_store.exportProject(configuration, true);
    }

    function set_auto_save() {
        var auto_save = function() {
            if (_networkConnectivity.value) {
                save_configuration();
            }
            setTimeout(auto_save, 10000);
        };
        auto_save();
    }

    function _generateNetworksCurrentEditingOnly() {
        var current = network_store.Graphs.flush(); // reflect current edit into data.
        return [current];
    }

    function _calcAndSetArrangedPositions() {
        if (graph_store.getLayers().length > 0) { // skip calculation, if there is no component on the graph.
            var configuration = _generateConfiguration(_generateNetworksCurrentEditingOnly());
            var sdcproj = proj_convert_store.exportProject(configuration);
            var graphName = configuration.networks[0].name;

            if (_nnablamdaCalls.value.arrange_layers) {
                _nnablamdaCalls.value.arrange_layers.cancel();
            }
            var arrange_layers = _nnablamda('arrange_layers', sdcproj, null, (sdcproj: any) => {
                if (_nnablamdaCalls.value.arrange_layers === arrange_layers) {
                    delete _nnablamdaCalls.value.arrange_layers;
                }
                try {
                    network_store.Graphs.arrange(graphName, proj_convert_store.importProject(sdcproj).networks[0]);
                } catch (e) {
                    // TODO retry, consider to avoid burst.
                    console.error(e);
                }
            });
            _nnablamdaCalls.value.arrange_layers = arrange_layers;
        }
    }

    function _exportPythonCode(callback?: any, errorCallback?: any) {
        var configuration = _generateConfiguration()
        var sdcproj = proj_convert_store.exportProject(configuration, true);

        _checkErrors(configuration, (errors: any) => {
            if (errors) {
                (errorCallback || ((errors: any) => undefined))(errors);
                return;
            }
            _callApi({
                url: definitions_store.Definitions.CORE_API.baseUrl() + "/misc/export_network",
                type: 'post',
                data: JSON.stringify({
                    configuration: sdcproj,
                    type: 'nnabla',
                }),
                contentType: 'application/json',
                dataType: 'json',
            }, (result: any) => {
                (callback || ((result: any) => undefined))(result);
            });
        });
    }

    function _exportCaffe(callback?: any, errorCallback?: any) {
        var configuration = _generateConfiguration(_generateNetworksCurrentEditingOnly());
        var sdcproj = proj_convert_store.exportProject(configuration);

        _checkErrors(configuration, (errors: any) => {
            if (errors) {
                (errorCallback || ((errors: any) => undefined))(errors);
                return;
            }
            _callApi({
                url: definitions_store.Definitions.CORE_API.baseUrl() + "/misc/export_network",
                type: 'post',
                data: JSON.stringify({
                    configuration: sdcproj,
                    type: 'caffe',
                }),
                contentType: 'application/json',
                dataType: 'json',
            }, (result: any) => {
                (callback || ((result: any) => undefined))(result);
            });
        });
    }

    function _nnablambda_version() {
        return _nnablamda('version', null, null, console.log);
    }

    function getNetworkConnectivity() {
        return _networkConnectivity.value
    }

    return { 
        params, 
        getParams,
        getProjectId,
        networkConnectivity: _networkConnectivity.value,
        setTimeoutWrapped, 
        load,
        move,
        callApi: _callApi,
        calculate_properties: _calcAndSetPropsAndErrors,
        serialize_configuration: _generateConfiguration,
        calcArrangeLayers: _calcArrangedPositions,
        format: _format,
        calc_props: _calcProps,
        getComponent: _component,
        handleXhrFailure: _handleXhrFailure,
        set_properties: _setCalcProps,
        allowedUserOperation: _allowedUserOperation,
        editTabIsActive: _editTabIsActive,
        indexOperator: _indexOperator,
        is_active: _is_active,
        getNewJobName,
        checkErrors: _checkErrors,
        showPopupIfLimitExceededOrHandleAsDefaultFailureFor: _handleLimitExceededAndCascadeDefault,
        save_configuration,
        getNetworkImages: _getNetworkImages,
        getGraphImage: _getGraphImage,
        getReferences: _getReferences,
        s3_upload,
        toUniqueName,
        completeWeightParameter: _completeWeightParameter,
        set_last_saved_configuration: _set_last_saved_configuration,
        getNetworkConnectivity,
        set_auto_save,
        arrange_layers: _calcAndSetArrangedPositions,
        exportPythonCode: _exportPythonCode,
        exportCaffe: _exportCaffe,
        nnablambda_version: _nnablambda_version
    }
})
