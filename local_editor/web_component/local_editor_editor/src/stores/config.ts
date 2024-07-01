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

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import {useDefinitionsStore} from './misc/definitions'

export const useConfigStore = defineStore('config', () => {
    const definition_store = useDefinitionsStore()

    var DEFAULT_OPTIMIZER_POWWER = 1;
    var DEFAULT_OPTIMIZER_STEPS = '';
    var DEFAULT_OPTIMIZER_SCHEDULER = 'Exponential';
    var DEFAULT_OPTIMIZER_WARMUP_LENGTH = 5;
    var DEFAULT_OPTIMIZER_RANGE_UNIT_VALUE = 0;

    const emptyConfiguration= ref<any>({
        networks: [
            {
                name: "Main",
                nodes: [],
                links: [],
            }
        ],
        datasets: [
            {
                id: "",
                name: "Training",
                original_name: "",
                tobe_shuffled: true,
                tobe_normalized_image: true,
                samples: 0,
                columns: 0,
                tenant_id: '',
            },
            {
                id: "",
                name: "Validation",
                original_name: "",
                tobe_shuffled: false,
                tobe_normalized_image: true,
                samples: 0,
                columns: 0,
                tenant_id: '',
            },
        ],
        main_dataset_name: "Training",
        description: "",
        epoch: 100,
        batch: 64,
        precision: 'Float',
        monitor_interval: 10,
        save_best: true,
        structure_search: {
            enable: false,
            method: "Random",
            optimize_for: "ErrorAndCalculation",
            validation_min: -1,
            validation_max: -1,
            multiply_add_min: -1,
            multiply_add_max: -1,
            early_stopping: false,
            time_limit: "",
            attempt_hours: 2,
            attempt_times: 100,
            num_parallel: 1,
        },
        optimizers: [
            {
                name: "Optimizer",
                effective_range_from: -1,
                effective_range_to: -1,
                effective_range_unit_value: 0,
                network: "Main",
                dataset: "Training",
                weight_decay: 0,
                learning_rate_multiplier: 1,
                update_interval: 1,
                updater: {
                    interval: 1,
                    name: "Adam",
                    parameters: [
                        {
                            _id: "alpha",
                            name: "Alpha",
                            value: "0.001",
                        },
                        {
                            _id: "beta1",
                            name: "Beta1",
                            value: "0.9",
                        },
                        {
                            _id: "beta2",
                            name: "Beta2",
                            value: "0.999",
                        },
                        {
                            _id: "epsilon",
                            name: "Epsilon",
                            value: "1e-08",
                        }
                    ]
                }
            }
        ],
        monitors: [
            {
                name: "train_error",
                network: "MainValidation",
                dataset: "Training",
            },
            {
                name: "valid_error",
                network: "MainValidation",
                dataset: "Validation",
            }
        ],
        executors: [
            {
                name: "Executor",
                network: "MainRuntime",
                dataset: "Validation",
                number_of_evaluation: 1,
                adopt_result: "mean",
                back_propagation: false,
            }
        ],
    })
    
    const data = ref([Object.assign({
            active: true, type: 'Global', name: 'Global Config',
            description: emptyConfiguration.value.description,
            epoch: emptyConfiguration.value.epoch,
            save_best: emptyConfiguration.value.save_best,
            batch: emptyConfiguration.value.batch,
            structure_search: emptyConfiguration.value.structure_search,
            monitor_interval: emptyConfiguration.value.monitor_interval,
            precision: 'Float'
        })]
    )
    const meta = ref([])
    const active = ref({index: 0})

    function setMetaData(metadata: any) {
        meta.value = metadata
    }

    function set_data(configuration: any) {
        data.value.length = 1;
        var globalConfig = data.value[0];
        var updateIntervalUnit = definition_store.Definitions.CONFIG.UPDATE_INTERVAL_UNIT;
        Object.assign(globalConfig, {
            description: configuration.description,
            epoch: configuration.epoch,
            save_best: configuration.save_best,
            batch: configuration.batch,
            monitor_interval: configuration.monitor_interval === 0 ? 0 : configuration.monitor_interval || emptyConfiguration.value.monitor_interval,
            precision: configuration.precision || 'Float',
            active: true
        });
        Object.assign(globalConfig.structure_search, configuration.structure_search);
        configuration.optimizers.forEach((optimizer: any) => {
            optimizer.type = 'Optimizer';
            optimizer.active = false;
            optimizer.scheduler = optimizer.scheduler || DEFAULT_OPTIMIZER_SCHEDULER;
            optimizer.warmup_scheduler = optimizer.warmup_scheduler || false;
            optimizer.warmup_length = optimizer.warmup_length || DEFAULT_OPTIMIZER_WARMUP_LENGTH;
            optimizer.warmup_length_unit = Number(optimizer.warmup_length_unit) === updateIntervalUnit.ITERATION ? updateIntervalUnit.ITERATION : updateIntervalUnit.EPOCH;
            optimizer.update_interval_unit = Number(optimizer.update_interval_unit) === updateIntervalUnit.EPOCH ? updateIntervalUnit.EPOCH : updateIntervalUnit.ITERATION;
            optimizer.power = (optimizer.power && optimizer.power !== 0) ? optimizer.power : DEFAULT_OPTIMIZER_POWWER;
            optimizer.steps = optimizer.steps || DEFAULT_OPTIMIZER_STEPS;
            optimizer.effective_range_from = optimizer.effective_range_from ? optimizer.effective_range_from : '';
            optimizer.effective_range_to = optimizer.effective_range_to ? optimizer.effective_range_to : '';
            optimizer.effective_range_unit_value = optimizer.effective_range_unit_value ? optimizer.effective_range_unit_value : DEFAULT_OPTIMIZER_RANGE_UNIT_VALUE;
            data.value.push(optimizer);
        });
        configuration.monitors.forEach((monitor: any) => {
            monitor.type = 'Monitor';
            monitor.active = false;
            data.value.push(monitor);
        });
        configuration.executors.forEach((executor: any) => {
            executor.type = 'Executor';
            executor.active = false;
            data.value.push(executor);
        });
        active.value.index = 0;
    }

    function serialize_data() {
        var delete_unnecessary_param = function(config: any) {
            var _config = Object.assign({}, config);
            delete _config.active;
            delete _config.type;
            return _config;
        };
        var global_config = data.value.find((config: any) => config.type == 'Global');
        return {
            description: global_config.description,
            epoch: global_config.epoch > definition_store.Definitions.CONFIG.MAX_EPOCH ? definition_store.Definitions.CONFIG.MAX_EPOCH : global_config.epoch,
            batch: global_config.batch,
            monitor_interval: global_config.monitor_interval === 0 ? 0 : global_config.monitor_interval,
            precision: global_config.precision,
            save_best: global_config.save_best,
            structure_search: global_config.structure_search,
            optimizers: data.value.filter((config: any) => config.type == "Optimizer").map(delete_unnecessary_param),
            monitors: data.value.filter((config: any) => config.type == "Monitor").map(delete_unnecessary_param),
            executors: data.value.filter((config: any) => config.type == "Executor").map(delete_unnecessary_param)
        };
    }

    function set_default_updater(updater: any, defaultUpdater: any) {
        updater.name = defaultUpdater.name;
        updater.parameters = defaultUpdater.parameters.map((parameter: any) => Object.assign({}, parameter, { value: parameter.initial_value}));
    }

    function setActivedConfig(value: any, key?: any) {
        if(key) {
            data.value[active.value.index][key] = value
        } else {
            data.value[active.value.index] = value
        }
    }

    function getActivedConfig() {
        return data.value[active.value.index]
    }

    return { 
        data,
        meta,
        active,
        emptyConfiguration,
        setMetaData,
        set_data,
        serialize_data,
        set_default_updater,
        setActivedConfig,
        getActivedConfig
    }
})
