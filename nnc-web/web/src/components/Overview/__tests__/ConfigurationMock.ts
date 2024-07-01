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

/// <reference path="../../../@types/index.d.ts" />
export class ConfigurationMock {
  public static tutorial_basics_01_logistic_regression: IConfiguration = {
    "networks": [
      {
        "name": "Main",
        "nodes": [
          {
            "name": "Input",
            "properties": {
              "Size": "1,28,28",
              "Dataset": "x",
              "Generator": "None",
              "GeneratorMultiplier": "1.0"
            },
            "type": "Input",
            "x": 20,
            "y": 20
          },
          {
            "name": "Affine",
            "properties": {
              "OutShape": "1",
              "WithBias": "True",
              "ParameterScope": "*Name",
              "W.File": "",
              "W.Initializer": "NormalAffineGlorot",
              "W.InitializerMultiplier": "1",
              "W.LRateMultiplier": "1.0",
              "b.File": "",
              "b.Initializer": "Constant",
              "b.InitializerMultiplier": "0.0",
              "b.LRateMultiplier": "1.0"
            },
            "type": "Affine",
            "x": 20,
            "y": 60
          },
          {
            "name": "Sigmoid",
            "properties": {},
            "type": "Sigmoid",
            "x": 20,
            "y": 100
          },
          {
            "name": "BinaryCrossEntropy",
            "properties": {
              "T.Dataset": "y",
              "T.Generator": "None",
              "T.GeneratorMultiplier": "1.0"
            },
            "type": "BinaryCrossEntropy",
            "x": 20,
            "y": 140
          }
        ],
        "links": [
          {
            "from_node": "Affine",
            "from_name": null,
            "to_node": "Sigmoid",
            "to_name": null
          },
          {
            "from_node": "Sigmoid",
            "from_name": null,
            "to_node": "BinaryCrossEntropy",
            "to_name": null
          },
          {
            "from_node": "Input",
            "from_name": null,
            "to_node": "Affine",
            "to_name": null
          }
        ]
      }
    ],
    "main_dataset_name": "Training",
    "datasets": [
      {
        "id": "",
        "name": "Training",
        "original_name": "",
        "tobe_shuffled": true,
        "tobe_cached": true,
        "tobe_normalized_image": true,
        "samples": 0,
        "columns": 0
      },
      {
        "id": "",
        "name": "Validation",
        "original_name": "",
        "tobe_shuffled": false,
        "tobe_cached": true,
        "tobe_normalized_image": true,
        "samples": 0,
        "columns": 0
      }
    ],
    "description": "dataset-require=MNIST",
    "epoch": 100,
    "batch": 64,
    "precision": "Float",
    "monitor_interval": 10,
    "save_best": true,
    "structure_search": {
      "enable": true,
      "method": "Random",
      "optimize_for": "ErrorAndCalculation",
      "validation_min": -1,
      "validation_max": -1,
      "multiply_add_min": -1,
      "multiply_add_max": -1,
      "early_stopping": false,
      "time_limit": "",
      "attempt_hours": "2",
      "attempt_times": "100"
    },
    "optimizers": [
      {
        "name": "Optimizer",
        "network": "Main",
        "dataset": "Training",
        "weight_decay": 0,
        "scheduler": "Exponential",
        "warmup_scheduler": false,
        "warmup_length": "5",
        "warmup_length_unit": "0",
        "learning_rate_multiplier": 1,
        "power": 1,
        "steps": "",
        "update_interval": 1,
        "update_interval_unit": 1,
        "updater": {
          "interval": 1,
          "name": "Adam",
          "parameters": [
            {
              "_id": "alpha",
              "name": "Alpha",
              "value": "0.001"
            },
            {
              "_id": "beta1",
              "name": "Beta1",
              "value": "0.9"
            },
            {
              "_id": "beta2",
              "name": "Beta2",
              "value": "0.999"
            },
            {
              "_id": "epsilon",
              "name": "Epsilon",
              "value": "1e-08"
            }
          ]
        }
      }
    ],
    "monitors": [
      {
        "name": "train_error",
        "network": "MainValidation",
        "dataset": "Training"
      },
      {
        "name": "valid_error",
        "network": "MainValidation",
        "dataset": "Validation"
      }
    ],
    "executors": [
      {
        "name": "Executor",
        "network": "MainRuntime",
        "dataset": "Validation",
        "number_of_evaluation": 1,
        "adopt_result": "mean",
        "back_propagation": false
      }
    ]
  }

  public static completed_tutorial_basics_01_logistic_regression = {
    "networks": [
      {
        "name": "Main",
        "nodes": [
          {
            "name": "Input",
            "properties": {
              "IsParam": "False",
              "Size": "1,28,28",
              "Dataset": "x",
              "Generator": "None",
              "GeneratorMultiplier": "1",
              "Output": "1,28,28"
            },
            "type": "Input",
            "x": 20,
            "y": 20
          },
          {
            "name": "Affine",
            "properties": {
              "IsParam": "False",
              "Input": "1,28,28",
              "OutShape": "1",
              "BaseAxis": "0",
              "WithBias": "True",
              "ParameterScope": "Affine",
              "W.File": "",
              "W.Initializer": "NormalAffineGlorot",
              "W.InitializerMultiplier": "1",
              "W.LRateMultiplier": "1",
              "b.File": "",
              "b.Initializer": "Constant",
              "b.InitializerMultiplier": "0",
              "b.LRateMultiplier": "1",
              "Output": "1",
              "CostParameter": "785",
              "CostAdd": "1",
              "CostMultiplyAdd": "784"
            },
            "type": "Affine",
            "x": 20,
            "y": 60
          },
          {
            "name": "Sigmoid",
            "properties": {
              "IsParam": "False",
              "Input": "1",
              "Output": "1",
              "CostAdd": "1",
              "CostDivision": "1",
              "CostExp": "1"
            },
            "type": "Sigmoid",
            "x": 20,
            "y": 140
          },
          {
            "name": "BinaryCrossEntropy",
            "properties": {
              "IsParam": "False",
              "Input": "1",
              "T.Dataset": "y",
              "T.Generator": "None",
              "T.GeneratorMultiplier": "1",
              "Output": "1",
              "IsLossFunction": "True"
            },
            "type": "BinaryCrossEntropy",
            "x": 20,
            "y": 180
          },
          {
            "name": "BatchNormalization",
            "properties": {
              "IsParam": "False",
              "Input": "1",
              "Axes": "0",
              "DecayRate": "0.9",
              "Epsilon": "0.0001",
              "BatchStat": "True",
              "ParameterScope": "BatchNormalization",
              "beta.File": "",
              "beta.Initializer": "Constant",
              "beta.InitializerMultiplier": "0",
              "beta.LRateMultiplier": "1",
              "gamma.File": "",
              "gamma.Initializer": "Constant",
              "gamma.InitializerMultiplier": "1",
              "gamma.LRateMultiplier": "1",
              "mean.File": "",
              "mean.Initializer": "Constant",
              "mean.InitializerMultiplier": "0",
              "mean.LRateMultiplier": "0",
              "var.File": "",
              "var.Initializer": "Constant",
              "var.InitializerMultiplier": "0",
              "var.LRateMultiplier": "0",
              "Output": "1",
              "CostParameter": "4",
              "CostAdd": "1",
              "CostMultiply": "1"
            },
            "type": "BatchNormalization",
            "x": 20,
            "y": 100
          }
        ],
        "links": [
          {
            "from_node": "Sigmoid",
            "from_name": null,
            "to_node": "BinaryCrossEntropy",
            "to_name": null
          },
          {
            "from_node": "Affine",
            "from_name": null,
            "to_node": "BatchNormalization",
            "to_name": null
          },
          {
            "from_node": "BatchNormalization",
            "from_name": null,
            "to_node": "Sigmoid",
            "to_name": null
          },
          {
            "from_node": "Input",
            "from_name": null,
            "to_node": "Affine",
            "to_name": null
          }
        ]
      }
    ],
    statistics: [
      [
        {
          max: '784',
          name: 'Output',
          sum: '787'
        },
        {
          max: '785',
          name: 'CostParameter',
          sum: '785'
        },
        {
          max: '1',
          name: 'CostAdd',
          sum: '2'
        },
        {
          max: '0',
          name: 'CostMultiply',
          sum: '0'
        },
        {
          max: '784',
          name: 'CostMultiplyAdd',
          sum: '784'
        },
        {
          max: '1',
          name: 'CostDivision',
          sum: '1'
        },
        {
          max: '1',
          name: 'CostExp',
          sum: '1'
        },
        {
          max: '0',
          name: 'CostIf',
          sum: '0'
        }
      ]
    ]
  }
}