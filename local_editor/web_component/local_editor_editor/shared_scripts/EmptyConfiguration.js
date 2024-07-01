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

var nnc = Object.assign(nnc || {}, {
    emptyConfiguration: {
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
    }
});
