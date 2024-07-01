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

import { ref, toRaw } from 'vue'
import { defineStore } from 'pinia'
import {useNNABLACoreDefStore} from './nnabla_core_def'
import {useConfigStore} from './config'

export const useProjConvertStore = defineStore('proj_convert', () => {
    const nnabla_core_def_store = useNNABLACoreDefStore()
    const config_store = useConfigStore()
    const emptyConfiguration = config_store.emptyConfiguration
    const TRUE = 1;
    const FALSE = 0;
    const UPDATE_INTERVAL_UNIT = {
        EPOCH: 0,
        ITERATION: 1
    };
    const MAX_EPOCH = 30000;
    const reSection = /^\[(.+)\]$/;
    const reKeyValue = /^([^;=][^=]*)(?:=(.*))?$/
    const _SVC_GRID = 20; // XXX avoid reference of nnc.Definitions.EDIT.GRID.SIZE for script's independency.
    const _APP_GRID = 24;

    const _inputSideConnector = ref<any>()

    function init() {
        _inputSideConnector.value = getInputSideConnector()
    }

    function __adjustPosForApplication(v: any) {
        return parseInt(String(Number(v) * _APP_GRID / _SVC_GRID))
    }

    function __adjustPosForService(v: any) {
        return parseInt(String(Number(v) * _SVC_GRID / _APP_GRID))
    }
    
    function getInputSideConnector() {
        // Helper object to convert between name and index of InputSideConnector of Layer Component.
        var map: any = {};
        nnabla_core_def_store.nnablaCore.layers.components.forEach((component: any) => {
            var isc = component.inputSideConnector;
            var len = isc.length;
            map[component.name] = {
                indexBy: (name: any) => {
                    var index = isc.findIndex((obj: any) => obj.name === name);
                    return index === -1 ? 0 : index + 1;
                },
                nameBy: (index: number) => {
                    return index > 0 && index - 1 < len ? isc[index - 1].name : null;
                },
            };
        });
        return {of: (type: any) => map[type] || {indexBy: (name: any) => 0, nameBy: (index: any) => null,}};
    }

    // get input side connector name from pin index.
    function _connectorIndexToName(type: any, pinIndex: any) {
        return _inputSideConnector.value.of(type).nameBy(pinIndex)
    }
    
    // get input side connector index from name.
    function _connectorNameToIndex(type: any, name: any) {
        return _inputSideConnector.value.of(type).indexBy(name)
    }

    function exportProject(configuration: any, is_create_job?: boolean, is_exclude_file_path?: boolean){
        var makeNetworkName = (network: any, index: any) => "Network_" + index + "=" + network.name;
        var makeNetworkSection = (network: any, index: any) => [
            "[" + network.name + "_Network_Global]",
            "NumLayer=" + network.nodes.length,
            "NumLink=" + network.links.length,
            network.nodes.map(makeNodeSectionFor(network)).join('\r\n'),
            network.links.map(makeLinkSectionFor(network)).join('\r\n'),
        ].join('\r\n');
        var makeNodeSectionFor = (network: any) => (node: any, index: any) => {
            let res = [
                "[" + network.name + "_Layer_" + index + "]",
                "ID=" + (node.id = index),
                "Type=" + node.type,
                "Position_0=" + __adjustPosForApplication(node.x),
                "Position_1=" + __adjustPosForApplication(node.y),
                "Position_2=" + 240,
                "Position_3=" + 48,
                "Property_0_Name=Name",
                "Property_0_Value=" + node.name,
                Object.keys(node.properties).map(makePropertyBodyFor(node)).join('\r\n'),
                "NumProperty=" + (Object.keys(node.properties).length + 1),
            ]
            return res.filter((node_param: any) => Boolean(node_param)).join('\r\n'); // for node.properties is empty.
        }
        var makeBooleanString = function(value: any) {
            return (typeof value === "boolean") ?  (value ? "True" : "False") : value;
        };
        var makePropertyBodyFor = (node: any) => ((property: any, index: any) => {
            if (property === 'SkipAtInspection') {
                property = 'SkipAtTest';
                if (!node.properties[property]) {
                    node.properties[property] = false;
                }
            }

            if (is_exclude_file_path) {
                var regexp = /.*File$/;
                if (regexp.test(property)) {
                    node.properties[property] = '';
                }
            }
            return "Property_" + (index + 1) + "_Name=" + property + "\r\n" +
            "Property_" + (index + 1) + "_Value=" + makeBooleanString(node.properties[property]);
        });
        var makeLinkSectionFor = (network: any) => (link: any, index: any) => {
            var source_node = network.nodes.find((node: any) => node.name == link.from_node);
            var destination_node = network.nodes.find((node: any) => node.name == link.to_node);
            return [
                "[" + network.name + "_Link_" + index + "]",
                "ID=" + index,
                "SourceLayerID=" + source_node.id,
                "SourcePinIndex=" + _connectorNameToIndex(source_node.type, link.from_name),
                "DestLayerID=" + destination_node.id,
                "DestPinIndex=" + _connectorNameToIndex(destination_node.type, link.to_name),
            ].join('\r\n');
        };
        var _mkDatasetUri = is_create_job ? (tenant: any, id: any) => (tenant && id ? tenant + '/' + id : '') : (tenant: any, id: any) => '';
        var makeDatasetSection = (dataset: any, index: any) => [
            "[Dataset_" + index + "]",
            "Name=" + dataset.name,
            "URI=" + _mkDatasetUri(dataset.tenant_id, dataset.id),
            "Shuffle=" + (dataset.tobe_shuffled ? TRUE : FALSE),
            "EnableCache=" + TRUE,
            "ImageNormalization=" + (dataset.tobe_normalized_image ? TRUE : FALSE),
            "NumData=" + (is_create_job ? dataset.samples : 0)
        ].join('\r\n');
        var makeOptimizerSection = (optimizer: any, index: any) => [
            "[Optimizer_" + index + "]",
            "RangeFrom=" + (optimizer.effective_range_from ? optimizer.effective_range_from : '-1'),
            "RangeTo=" + (optimizer.effective_range_to ? optimizer.effective_range_to : '-1'),
            "RangeUnit=" + optimizer.effective_range_unit_value,
            "Optimizer_Name=" + optimizer.name,
            "Optimizer_NetworkName=" + optimizer.network,
            "Optimizer_DatasetName=" + optimizer.dataset,
            "UpdateInterval=" + optimizer.updater.interval,
            "SolverName=" + optimizer.updater.name,
            "SolverParameterNum=" + optimizer.updater.parameters.length,
            optimizer.updater.parameters.map((parameter: any, index: any) => {
                return [
                    "SolverParameterName_" + index + "=" + parameter.name,
                    "SolverParameter_" + index + "=" + parameter.value,
                ].join('\r\n');
            }).join('\r\n'),
            "WeightDecay=" + optimizer.weight_decay,
            "LearningRateScheduler=" + (optimizer.scheduler || 'Exponential'),
            "LearningRateWarmupScheduler=" + (optimizer.warmup_scheduler ? 'Linear' : 'None'),
            "LearningRateWarmupLength=" + optimizer.warmup_length,
            "LearningRateWarmupLengthUnit=" + ((Number(optimizer.warmup_length_unit) === UPDATE_INTERVAL_UNIT.EPOCH) ? UPDATE_INTERVAL_UNIT.EPOCH : UPDATE_INTERVAL_UNIT.ITERATION),
            "LearningRateMultiplier=" + optimizer.learning_rate_multiplier,
            "LearningRateUpdateInterval=" + optimizer.update_interval,
            "LearningRateUpdateIntervalUnit=" + ((Number(optimizer.update_interval_unit) === UPDATE_INTERVAL_UNIT.EPOCH) ? UPDATE_INTERVAL_UNIT.EPOCH : UPDATE_INTERVAL_UNIT.ITERATION),
            "LearningRatePower=" + ((optimizer.power && optimizer.power !== 0) ? optimizer.power : 1),
            "LearningRateSteps=" + ((optimizer.steps && optimizer.steps !== 0) ? optimizer.steps : ''),
        ].join('\r\n');
        var makeMonitorSection = (monitor: any, index: any) => [
            "[Monitor_" + index + "]",
            "Monitor_Name=" + monitor.name,
            "Monitor_NetworkName=" + monitor.network,
            "Monitor_DatasetName=" + monitor.dataset,
        ].join('\r\n');
        var makeExecutorSection = (executor: any, index: any) => [
            "[Executor_" + index + "]",
            "Executor_Name=" + executor.name,
            "Executor_NetworkName=" + executor.network,
            "Executor_DatasetName=" + executor.dataset,
            "NumEvaluations=" + executor.number_of_evaluation,
            "RepeatEvaluationType=" + (executor.adopt_result == 'mean' ? 0 : 1),
            "NeedBackPropagation=" + (executor.back_propagation ? TRUE : FALSE),
        ].join('\r\n');

        return [
            "[Engine]",
            "SDeepEngineType=NNabla",
            "RNNTrainingMode=0",
            "[Global]",
            "NumNetwork=" + toRaw(configuration.networks).length,
            toRaw(configuration.networks).map(makeNetworkName).join('\r\n'),
            toRaw(configuration.networks).map(makeNetworkSection).join('\r\n'),
            "[Dataset]",
            "Num=" + configuration.datasets.length,
            "MainIndex=" + configuration.datasets.findIndex((dataset: any) => dataset.name == configuration.main_dataset_name),
            configuration.datasets.map(makeDatasetSection).join('\r\n'),
            "[Description]",
            "Text=" + configuration.description.replace(/\n/g, '\\n'),
            "[Config]",
            "MaxEpoch=" + (configuration.epoch > MAX_EPOCH ? MAX_EPOCH : configuration.epoch),
            "SaveBest=" + (configuration.save_best ? 1 : 0),
            "BatchSize=" + configuration.batch,
            "TypeConfig=" + (configuration.precision || 'Float'),
            "MonitorInterval=" + (Number(configuration.monitor_interval) ? Number(configuration.monitor_interval) : Number(configuration.monitor_interval) === 0 ? 0 : 10),
            "NumOptimizer=" + configuration.optimizers.length,
            "NumMonitor=" + configuration.monitors.length,
            "NumExecutor=" + configuration.executors.length,
            configuration.optimizers.map(makeOptimizerSection).join('\r\n'),
            configuration.monitors.map(makeMonitorSection).join('\r\n'),
            configuration.executors.map(makeExecutorSection).join('\r\n'),
            "[StructureSearch]",
            "Enabled=" + (configuration.structure_search.enable ? TRUE : FALSE),
            "Method=" + configuration.structure_search.method,
            "Objective=" + configuration.structure_search.optimize_for,
            "Validation_Min=" + configuration.structure_search.validation_min,
            "Validation_Max=" + configuration.structure_search.validation_max,
            "CostMultiplyAdd_Min=" + configuration.structure_search.multiply_add_min,
            "CostMultiplyAdd_Max=" + configuration.structure_search.multiply_add_max,
            "EarlyStopping=0", // XXX for Day1
            "TimeLimit=", // XXX for Day1
            "SetLearningRateOfConvolutionAsZero=0",
            "AttemptHours=" + (configuration.structure_search.attempt_hours || emptyConfiguration.structure_search.attempt_hours),
            "AttemptTimes=" + (configuration.structure_search.attempt_times || emptyConfiguration.structure_search.attempt_times),
            "NumParallel=" + (configuration.structure_search.num_parallel || emptyConfiguration.structure_search.num_parallel),
        ].join('\r\n');
    }

    function _iniToObject(iniText: any) {
        var project: any = {}
        var obj: any = {}

        iniText.replace(/\r\n/g, '\n').split('\n').forEach((line: any) => {
            const matchesSection = reSection.exec(line);
            if (matchesSection) {
                const section = matchesSection[1];
                obj = project[section] || {};
                project[section] = obj;
            } else {
                const matchesKeyValuePair = reKeyValue.exec(line);
                if (matchesKeyValuePair) {
                    const key = matchesKeyValuePair[1];
                    const val = matchesKeyValuePair[2];
                    obj[key] = val === undefined ? null : val;
                }
            }
        });
        return project
    }

    function getComponentType(project_content: any) {
        var project: any = {objects: function(section: any, number: any) {
            var array = [];
            number = Number(number);
            for (var i = 0; i < number; ++i) {
                array.push(this[section + '_' + i]);
            }
            return array;
        }, networks: function() {
            var array = [];
            for (var i = 0; i < this.Global.NumNetwork; ++i) {
                var name = this.Global["Network_" + i];
                var prefix = name ? name + '_' : '';
                array.push({
                    name: name || 'Main',
                    layers: this.objects(prefix + "Layer", this[prefix + "Network_Global"].NumLayer),
                    links: this.objects(prefix + "Link", this[prefix + "Network_Global"].NumLink),
                });
            }
            return array;
        }}
        Object.assign(project, _iniToObject(project_content));
        if (!('Global' in project)) {
            project.Global = {NumNetwork: 1, Network_0: ''};
        }

        var propertiesOf = function(layer: any) {
            var _layerName = '';
            for (var i = 0; i < layer.NumProperty; ++i) {
                var key = layer["Property_" + i + "_Name"];
                if (key === 'Name') {
                    _layerName = layer["Property_" + i + "_Value"];
                    break;
                }
            }

            var _property = [];
            var _propertyOrderList = [];

            var _parseType = (type: string) => type === 'File' ? 'Text' : type;
            var res: any = {};

            for (var j = 0; j < layer.NumProperty; ++j) {
                var _name = layer["Property_" + j + "_Name"];
                var _editable = layer["Property_" + j + "_Editable"] === "1";
                var _type = _parseType(layer["Property_" + j + "_Type"]);
                var _value = _parseType(layer["Property_" + j + "_Value"]);
                if (_editable !== undefined && _type) {
                    _property.push({
                        name: _name,
                        editable: _editable,
                        type: _type,
                        value: _value
                    });
                }
                if (_name !== 'IsParam') {
                    _propertyOrderList.push(_name);
                } else {
                    if (_value === 'True') {
                        res.parameter = _layerName;
                    }
                }
            }

            if (_property.length) {
                res.name = _layerName;
                res.type = layer.Type;
                res.property = _property;
                res.orderList = _propertyOrderList;
            }

            return res;

        };

        return project.networks().map((network: any) => {
            var components: any = {
                params: [],
                properties: []
            };
            network.layers.forEach((layer: any) => {
                var component = propertiesOf(layer);
                if (component.property) {
                    components.properties.push(component);
                }
                if (component.parameter) {
                    components.params.push(component.parameter);
                }
            });
            return components;
        });
    }

    function importProject(project_content: any, parseDatasetUri?: any) { // set global
        var project: any = {objects: function(section: any, number: any) {
            var array = [];
            number = Number(number);
            for (var i = 0; i < number; ++i) {
                array.push(this[section + '_' + i]);
            }
            return array;
        }, networks: function() {
            var array = [];
            for (var i = 0; i < this.Global.NumNetwork; ++i) {
                var name = this.Global["Network_" + i];
                var prefix = name ? name + '_' : '';
                array.push({
                    name: name || 'Main',
                    layers: this.objects(prefix + "Layer", this[prefix + "Network_Global"].NumLayer),
                    links: this.objects(prefix + "Link", this[prefix + "Network_Global"].NumLink),
                });
            }
            return array;
        }, updaterParameter: function(optimizer: any) {
            var array = [];
            for (var i = 0; i < optimizer.SolverParameterNum; ++i) {
                array.push({
                    name: optimizer["SolverParameterName_" + i],
                    value: optimizer["SolverParameter_" + i],
                });
            }
            return array;
        }};
        Object.assign(project, _iniToObject(project_content));
        if (!('Global' in project)) {
            project.Global = {NumNetwork: 1, Network_0: ''};
        }

        var propertiesOf = function(layer: any) {
            var _properties: any = {};
            for (var i = 0; i < layer.NumProperty; ++i) {
                var key = layer["Property_" + i + "_Name"];
                _properties[key] = layer["Property_" + i + "_Value"];
            }
            if (_properties.SkipAtInspection || _properties.SkipAtInspection === '') {
                _properties.SkipAtTest = _properties.SkipAtInspection || false;
                delete _properties.SkipAtInspection;
            }
            var name = _properties.Name;
            delete _properties.Name;
            return {name: name, properties: _properties};
        };
        // if parseDatasetUri is true, generate {id: yyy, tenante_id: xxx} from 'xxx/yyy' formatted string.
        var _parseDatasetUri = parseDatasetUri ? (uri: string) => {
            var match = /(.*)\/(.*)/.exec(uri);
            return match ? { tenant_id: match[1], id: match[2], } : {};
        } : (dataset: any) => {};
        var structure_search = project.StructureSearch;
        // return configuration converted from ProjectFile.
        return {
            networks: project.networks().map((network: any) => {
                var nodeMap: any = {};
                // build node map
                network.layers.forEach((layer: any) => nodeMap[layer.ID] = Object.assign(propertiesOf(layer), {
                    type: layer.Type,
                    x: __adjustPosForService(layer.Position_0),
                    y: __adjustPosForService(layer.Position_1),
                    repeatTimes: layer.RepeatTimes || ''
                }));
                return {
                    name: network.name,
                    nodes: Object.values(nodeMap), // extract all nodes
                    links: network.links.map((link: any) => {
                        var from_node = nodeMap[link.SourceLayerID];
                        var to_node = nodeMap[link.DestLayerID];
                        return {
                            from_node: from_node.name,
                            from_name: _connectorIndexToName(from_node.type, link.SourcePinIndex),
                            to_node: to_node.name,
                            to_name: _connectorIndexToName(to_node.type, link.DestPinIndex),
                        };
                    })
                };
            }),
            main_dataset_name: project['Dataset_' + project.Dataset.MainIndex].Name,
            datasets: project.objects("Dataset", project.Dataset.Num).map((dataset: any) => {
                return Object.assign({
                    id: '',
                    name: dataset.Name,
                    original_name: '',
                    tobe_shuffled: dataset.Shuffle !== '0',
                    tobe_cached: true,
                    tobe_normalized_image: dataset.ImageNormalization !== '0',
                    samples: 0,
                    columns: 0,
                }, _parseDatasetUri(dataset.URI));
            }),
            description: project.Description.Text.replace(/\\n/g, '\n'),
            epoch: Number(project.Config.MaxEpoch) > MAX_EPOCH ? MAX_EPOCH : Number(project.Config.MaxEpoch),
            batch: Number(project.Config.BatchSize),
            precision: project.Config.TypeConfig || 'Float',
            monitor_interval: Number(project.Config.MonitorInterval) ? Number(project.Config.MonitorInterval) : Number(project.Config.MonitorInterval) === 0 ? 0 : 10,
            save_best: project.Config.SaveBest !== '0',
            structure_search: {
                enable: structure_search.Enabled !== '0',
                method: (structure_search.Method === 'Random') ? structure_search.Method : 'NetworkFeatureAndGaussianProcess',
                optimize_for: (structure_search.Objective === 'Error') ? structure_search.Objective : 'ErrorAndCalculation',
                validation_min: Number(structure_search.Validation_Min),
                validation_max: Number(structure_search.Validation_Max),
                multiply_add_min: Number(structure_search.CostMultiplyAdd_Min),
                multiply_add_max: Number(structure_search.CostMultiplyAdd_Max),
                early_stopping: structure_search.EarlyStopping !== '0',
                time_limit: structure_search.TimeLimit,
                attempt_hours: structure_search.AttemptHours || emptyConfiguration.structure_search.attempt_hours,
                attempt_times: structure_search.AttemptTimes || emptyConfiguration.structure_search.attempt_times,
                num_parallel: structure_search.NumParallel || emptyConfiguration.structure_search.num_parallel,
            },
            optimizers: project.objects("Optimizer", project.Config.NumOptimizer).map((optimizer: any) => {
                return {
                    name: optimizer.Optimizer_Name,
                    effective_range_from: optimizer.RangeFrom !== '-1' ? optimizer.RangeFrom : '',
                    effective_range_to: optimizer.RangeTo !== '-1' ? optimizer.RangeTo : '',
                    effective_range_unit_value: optimizer.RangeUnit,
                    network: optimizer.Optimizer_NetworkName,
                    dataset: optimizer.Optimizer_DatasetName,
                    weight_decay: Number(optimizer.WeightDecay),
                    scheduler: optimizer.LearningRateScheduler || 'Exponential',
                    warmup_scheduler: optimizer.LearningRateWarmupScheduler === 'Linear',
                    warmup_length: optimizer.LearningRateWarmupLength,
                    warmup_length_unit: optimizer.LearningRateWarmupLengthUnit,
                    learning_rate_multiplier: Number(optimizer.LearningRateMultiplier),
                    power: Number(optimizer.LearningRatePower && optimizer.LearningRatePower !== 0 ? optimizer.LearningRatePower : 1),
                    steps: optimizer.LearningRateSteps || '',
                    update_interval: Number(optimizer.LearningRateUpdateInterval),
                    update_interval_unit: (Number(optimizer.LearningRateUpdateIntervalUnit) === UPDATE_INTERVAL_UNIT.EPOCH ? UPDATE_INTERVAL_UNIT.EPOCH : UPDATE_INTERVAL_UNIT.ITERATION),
                    updater: {
                        interval: Number(optimizer.UpdateInterval),
                        name: optimizer.SolverName,
                        parameters: project.updaterParameter(optimizer)
                            .map((updater: any) => Object.assign({_id: updater.name.toLowerCase()}, updater)),
                    }
                };
            }),
            monitors: project.objects("Monitor", project.Config.NumMonitor).map((monitor: any) => {
                return {
                    name: monitor.Monitor_Name,
                    network: monitor.Monitor_NetworkName,
                    dataset: monitor.Monitor_DatasetName
                };
            }),
            executors: project.objects("Executor", project.Config.NumExecutor).map((executor: any) => {
                return {
                    name: executor.Executor_Name,
                    network: executor.Executor_NetworkName,
                    dataset: executor.Executor_DatasetName,
                    number_of_evaluation: Number(executor.NumEvaluations),
                    adopt_result: executor.RepeatEvaluationType === '0' ? 'mean' : 'last',
                    back_propagation: executor.NeedBackPropagation === '1',
                };
            }),
        };
    }

    function importLayer(layer_content: any, parseDatasetUri?: any) {
        var project: any = {objects: function(section: any, number: any) {
            var array = [];
            number = Number(number);
            for (var i = 0; i < number; ++i) {
                array.push(this[section + '_' + i]);
            }
            return array;
        }, networks: function() {
            var array = [];
            for (var i = 0; i < this.Global.NumNetwork; ++i) {
                var name = this.Global["Network_" + i];
                var prefix = name ? name + '_' : '';
                array.push({
                    name: name || 'Main',
                    layers: this.objects(prefix + "Layer", this[prefix + "Network_Global"].NumLayer),
                    links: this.objects(prefix + "Link", this[prefix + "Network_Global"].NumLink),
                });
            }
            return array;
        }};
        Object.assign(project, _iniToObject(layer_content));
        if (!('Global' in project)) {
            project.Global = {NumNetwork: 1, Network_0: ''};
        }

        var propertiesOf = function(layer: any) {
            var _properties: any = {};
            for (var i = 0; i < layer.NumProperty; ++i) {
                var key = layer["Property_" + i + "_Name"];
                _properties[key] = layer["Property_" + i + "_Value"];
            }
            if (_properties.SkipAtInspection || _properties.SkipAtInspection === '') {
                _properties.SkipAtTest = _properties.SkipAtInspection || false;
                delete _properties.SkipAtInspection;
            }
            var name = _properties.Name;
            delete _properties.Name;
            return {name: name, properties: _properties};
        };

        return {
            networks: project.networks().map((network: any) => {
                var nodeMap: any = {};
                // build node map
                network.layers.forEach((layer: any) => nodeMap[layer.ID] = Object.assign(propertiesOf(layer), {
                    type: layer.Type,
                    x: __adjustPosForService(layer.Position_0),
                    y: __adjustPosForService(layer.Position_1),
                }));
                return {
                    name: network.name,
                    nodes: Object.values(nodeMap), // extract all nodes
                    links: network.links.map((link: any) => {
                        var from_node = nodeMap[link.SourceLayerID];
                        var to_node = nodeMap[link.DestLayerID];
                        return {
                            from_node: from_node.name,
                            from_name: _connectorIndexToName(from_node.type, link.SourcePinIndex),
                            to_node: to_node.name,
                            to_name: _connectorIndexToName(to_node.type, link.DestPinIndex),
                        };
                    })
                };
            }),
        };
    }

    function exportLayer(network: any){
        var makeNetworkSection = (network: any, index?: any) => [
            "[Network_Global]",
            "NumLayer=" + network.nodes.length,
            "NumLink=" + network.links.length,
            network.nodes.map(makeNodeSectionFor(network)).join('\n'),
            network.links.map(makeLinkSectionFor(network)).join('\n'),
        ].join('\n');
        var makeNodeSectionFor = (network: any) => (node: any, index: any) => [
            "[Layer_" + index + "]",
            "ID=" + (node.id = index),
            "Type=" + node.type,
            "Position_0=" + __adjustPosForApplication(node.x),
            "Position_1=" + __adjustPosForApplication(node.y),
            "Position_2=" + 240,
            "Position_3=" + 48,
            "Property_0_Name=Name",
            "Property_0_Value=" + node.name,
            Object.keys(node.properties).map(makePropertyBodyFor(node)).join('\n'),
            "NumProperty=" + (Object.keys(node.properties).length + 1),
        ].filter(node_param => Boolean(node_param)).join('\n'); // for node.properties is empty.
        var makeBooleanString = function(value: any) {
            return (typeof value === "boolean") ?  (value ? "True" : "False") : value;
        };
        var makePropertyBodyFor = (node: any) => ((property: any, index: any) => {
            if (property === 'SkipAtInspection') {
                property = 'SkipAtTest';
                if (!node.properties[property]) {
                    node.properties[property] = false;
                }
            }
            return "Property_" + (index + 1) + "_Name=" + property + "\n" +
            "Property_" + (index + 1) + "_Value=" + makeBooleanString(node.properties[property]);
        });
        var makeLinkSectionFor = (network: any) => (link: any, index: any) => {
            var source_node = network.nodes.find((node: any) => node.name == link.from_node);
            var destination_node = network.nodes.find((node: any) => node.name == link.to_node);
            return [
                "[Link_" + index + "]",
                "ID=" + index,
                "SourceLayerID=" + source_node.id,
                "SourcePinIndex=" + _connectorNameToIndex(source_node.type, link.from_name),
                "DestLayerID=" + destination_node.id,
                "DestPinIndex=" + _connectorNameToIndex(destination_node.type, link.to_name),
            ].join('\n');
        };

        return makeNetworkSection(network);
    }

    return { 
        init,
        importLayer,
        exportLayer,
        exportProject,
        importProject,
        getComponentType,
        parseIni: _iniToObject
    }
})
