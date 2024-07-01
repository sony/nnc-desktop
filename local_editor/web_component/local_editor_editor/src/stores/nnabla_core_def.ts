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

export const useNNABLACoreDefStore = defineStore('nnabla_core_def', () => {
    let nnablaCore = {
        "layers": {
          "components": [
            {
              "reference": null,
              "color": "0x262626",
              "inputSideConnector": [],
              "input": 0,
              "layout": "Top",
              "name": "Input",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "Input",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Size",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "1,28,28",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Dataset",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "x",
                  "important": true,
                  "shortName": "",
                  "type": "Dataset"
                },
                {
                  "name": "Generator",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "None",
                  "shortName": "",
                  "type": "Option",
                  "option": [
                    "None",
                    "Normal",
                    "Uniform",
                    "Constant",
                    "Range"
                  ]
                },
                {
                  "name": "GeneratorMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Size",
                  "shortName": "",
                  "type": "PIntArray"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xb2b2b2",
              "inputSideConnector": [
                {
                  "color": "0x00a0b0",
                  "kind": "Data",
                  "enable": true,
                  "shape": "*Input",
                  "name": "T"
                }
              ],
              "input": 1,
              "layout": null,
              "name": "SquaredError",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "SquaredError",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "T.Dataset",
                  "argumentName": "",
                  "required": false,
                  "editable": true,
                  "value": "y",
                  "important": true,
                  "shortName": "",
                  "type": "Dataset"
                },
                {
                  "name": "T.Generator",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "None",
                  "shortName": "",
                  "type": "Option",
                  "option": [
                    "None",
                    "Normal",
                    "Uniform",
                    "Constant"
                  ]
                },
                {
                  "name": "T.GeneratorMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "IsLossFunction",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": true,
                  "shortName": "",
                  "type": "Boolean"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xb2b2b2",
              "inputSideConnector": [
                {
                  "color": "0x00a0b0",
                  "kind": "Data",
                  "enable": true,
                  "shape": "*Input",
                  "name": "T"
                }
              ],
              "input": 1,
              "layout": null,
              "name": "HuberLoss",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "HuberLoss",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Delta",
                  "argumentName": "huber_loss_param.delta",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "T.Dataset",
                  "argumentName": "",
                  "required": false,
                  "editable": true,
                  "value": "y",
                  "important": true,
                  "shortName": "",
                  "type": "Dataset"
                },
                {
                  "name": "T.Generator",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "None",
                  "shortName": "",
                  "type": "Option",
                  "option": [
                    "None",
                    "Normal",
                    "Uniform",
                    "Constant"
                  ]
                },
                {
                  "name": "T.GeneratorMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "IsLossFunction",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": true,
                  "shortName": "",
                  "type": "Boolean"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xb2b2b2",
              "inputSideConnector": [
                {
                  "color": "0x00a0b0",
                  "kind": "Data",
                  "enable": true,
                  "shape": "*Input",
                  "name": "T"
                }
              ],
              "input": 1,
              "layout": null,
              "name": "AbsoluteError",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "AbsoluteError",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "T.Dataset",
                  "argumentName": "",
                  "required": false,
                  "editable": true,
                  "value": "y",
                  "important": true,
                  "shortName": "",
                  "type": "Dataset"
                },
                {
                  "name": "T.Generator",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "None",
                  "shortName": "",
                  "type": "Option",
                  "option": [
                    "None",
                    "Normal",
                    "Uniform",
                    "Constant"
                  ]
                },
                {
                  "name": "T.GeneratorMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "IsLossFunction",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": true,
                  "shortName": "",
                  "type": "Boolean"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xb2b2b2",
              "inputSideConnector": [
                {
                  "color": "0x00a0b0",
                  "kind": "Data",
                  "enable": true,
                  "shape": "*Input",
                  "name": "T"
                }
              ],
              "input": 1,
              "layout": null,
              "name": "EpsilonInsensitiveLoss",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "EpsilonInsensitiveLoss",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Epsilon",
                  "argumentName": "epsilon_insensitive_loss_param.epsilon",
                  "required": true,
                  "editable": true,
                  "value": "0.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "T.Dataset",
                  "argumentName": "",
                  "required": false,
                  "editable": true,
                  "value": "y",
                  "important": true,
                  "shortName": "",
                  "type": "Dataset"
                },
                {
                  "name": "T.Generator",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "None",
                  "shortName": "",
                  "type": "Option",
                  "option": [
                    "None",
                    "Normal",
                    "Uniform",
                    "Constant"
                  ]
                },
                {
                  "name": "T.GeneratorMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "IsLossFunction",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": true,
                  "shortName": "",
                  "type": "Boolean"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xb2b2b2",
              "inputSideConnector": [
                {
                  "color": "0x00a0b0",
                  "kind": "Data",
                  "enable": true,
                  "shape": "*Input",
                  "name": "T"
                }
              ],
              "input": 1,
              "layout": null,
              "name": "BinaryCrossEntropy",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "BinaryCrossEntropy",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "T.Dataset",
                  "argumentName": "",
                  "required": false,
                  "editable": true,
                  "value": "y",
                  "important": true,
                  "shortName": "",
                  "type": "Dataset"
                },
                {
                  "name": "T.Generator",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "None",
                  "shortName": "",
                  "type": "Option",
                  "option": [
                    "None",
                    "Normal",
                    "Uniform",
                    "Constant"
                  ]
                },
                {
                  "name": "T.GeneratorMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "IsLossFunction",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": true,
                  "shortName": "",
                  "type": "Boolean"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xb2b2b2",
              "inputSideConnector": [
                {
                  "color": "0x00a0b0",
                  "kind": "Data",
                  "enable": true,
                  "shape": "*Input",
                  "name": "T"
                }
              ],
              "input": 1,
              "layout": null,
              "name": "SigmoidCrossEntropy",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "SigmoidCrossEntropy",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "T.Dataset",
                  "argumentName": "",
                  "required": false,
                  "editable": true,
                  "value": "y",
                  "important": true,
                  "shortName": "",
                  "type": "Dataset"
                },
                {
                  "name": "T.Generator",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "None",
                  "shortName": "",
                  "type": "Option",
                  "option": [
                    "None",
                    "Normal",
                    "Uniform",
                    "Constant"
                  ]
                },
                {
                  "name": "T.GeneratorMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "IsLossFunction",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": true,
                  "shortName": "",
                  "type": "Boolean"
                },
                {
                  "name": "CostAdd",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                },
                {
                  "name": "CostDivision",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                },
                {
                  "name": "CostExp",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xb2b2b2",
              "inputSideConnector": [
                {
                  "color": "0x00a0b0",
                  "kind": "Data",
                  "enable": true,
                  "shape": "*SoftmaxLabelShape",
                  "name": "T"
                }
              ],
              "input": 1,
              "layout": null,
              "name": "CategoricalCrossEntropy",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "CategoricalCrossEntropy",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Axis",
                  "argumentName": "categorical_cross_entropy_param.axis -a",
                  "required": true,
                  "editable": true,
                  "value": "0",
                  "shortName": "",
                  "type": "UInt"
                },
                {
                  "name": "T.Dataset",
                  "argumentName": "",
                  "required": false,
                  "editable": true,
                  "value": "y",
                  "important": true,
                  "shortName": "",
                  "type": "Dataset"
                },
                {
                  "name": "T.Generator",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "None",
                  "shortName": "",
                  "type": "Option",
                  "option": [
                    "None",
                    "Normal",
                    "Uniform",
                    "Constant"
                  ]
                },
                {
                  "name": "T.GeneratorMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*CCEOutputSize",
                  "shortName": "",
                  "type": "UIntArray"
                },
                {
                  "name": "IsLossFunction",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": true,
                  "shortName": "",
                  "type": "Boolean"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xb2b2b2",
              "inputSideConnector": [
                {
                  "color": "0x00a0b0",
                  "kind": "Data",
                  "enable": true,
                  "shape": "*SoftmaxLabelShape",
                  "name": "T"
                }
              ],
              "input": 1,
              "layout": null,
              "name": "SoftmaxCrossEntropy",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "SoftmaxCrossEntropy",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Axis",
                  "argumentName": "softmax_cross_entropy_param.axis -a",
                  "required": true,
                  "editable": true,
                  "value": "0",
                  "shortName": "",
                  "type": "UInt"
                },
                {
                  "name": "T.Dataset",
                  "argumentName": "",
                  "required": false,
                  "editable": true,
                  "value": "y",
                  "important": true,
                  "shortName": "",
                  "type": "Dataset"
                },
                {
                  "name": "T.Generator",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "None",
                  "shortName": "",
                  "type": "Option",
                  "option": [
                    "None",
                    "Normal",
                    "Uniform",
                    "Constant"
                  ]
                },
                {
                  "name": "T.GeneratorMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*CCEOutputSize",
                  "shortName": "",
                  "type": "UIntArray"
                },
                {
                  "name": "IsLossFunction",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": true,
                  "shortName": "",
                  "type": "Boolean"
                },
                {
                  "name": "CostAdd",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                },
                {
                  "name": "CostExp",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                },
                {
                  "name": "CostDivision",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xb2b2b2",
              "inputSideConnector": [
                {
                  "color": "0x00a0b0",
                  "kind": "Data",
                  "enable": true,
                  "shape": "*Input",
                  "name": "q"
                }
              ],
              "input": 1,
              "layout": null,
              "name": "KLMultinomial",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "KLMultinomial",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "BaseAxis",
                  "argumentName": "kl_multinomial_param.base_axis -a",
                  "required": true,
                  "editable": true,
                  "value": "0",
                  "shortName": "",
                  "type": "UInt"
                },
                {
                  "name": "q.Dataset",
                  "argumentName": "",
                  "required": false,
                  "editable": true,
                  "value": "y",
                  "important": true,
                  "shortName": "",
                  "type": "Dataset"
                },
                {
                  "name": "q.Generator",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "None",
                  "shortName": "",
                  "type": "Option",
                  "option": [
                    "None",
                    "Normal",
                    "Uniform",
                    "Constant"
                  ]
                },
                {
                  "name": "q.GeneratorMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "1",
                  "shortName": "",
                  "type": "UInt"
                },
                {
                  "name": "IsLossFunction",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": true,
                  "shortName": "",
                  "type": "Boolean"
                }
              ]
            },
            {
              "reference": null,
              "color": "0x7a997a",
              "inputSideConnector": [],
              "input": 0,
              "layout": null,
              "name": "Parameter",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "Parameter",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Size",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "*GraphOutput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "File",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "",
                  "shortName": "",
                  "type": "File"
                },
                {
                  "name": "Initializer",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "Normal",
                  "shortName": "",
                  "type": "Option",
                  "option": [
                    "Normal",
                    "NormalAffineHeForward",
                    "NormalAffineHeBackward",
                    "NormalAffineGlorot",
                    "NormalConvolutionHeForward",
                    "NormalConvolutionHeBackward",
                    "NormalConvolutionGlorot",
                    "NormalCLConvHeForward",
                    "NormalCLConvHeBackward",
                    "NormalCLConvGlorot",
                    "Uniform",
                    "UniformAffineGlorot",
                    "UniformConvolutionGlorot",
                    "UniformCLConvGlorot",
                    "Constant"
                  ]
                },
                {
                  "name": "InitializerMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "0.01",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "LRateMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Size",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostParameter",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Output",
                  "shortName": "",
                  "type": "UInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0x7a997a",
              "inputSideConnector": [],
              "input": -1,
              "layout": null,
              "name": "WorkingMemory",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "WorkingMemory",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Size",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "1,28,28",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "File",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "",
                  "shortName": "",
                  "type": "File"
                },
                {
                  "name": "Initializer",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "Normal",
                  "shortName": "",
                  "type": "Option",
                  "option": [
                    "Normal",
                    "Uniform",
                    "Constant"
                  ]
                },
                {
                  "name": "InitializerMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "LRateMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "0.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Size",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostParameter",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Output",
                  "shortName": "",
                  "type": "UInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0x6aa1bd",
              "inputSideConnector": [
                {
                  "color": "0xa8a800",
                  "kind": "Parameter",
                  "enable": true,
                  "shape": "*AffineWeightShape",
                  "name": "W"
                },
                {
                  "color": "0xa8a800",
                  "kind": "Parameter",
                  "enable": "*WithBias",
                  "shape": "*OutShape",
                  "name": "b"
                }
              ],
              "input": 1,
              "layout": null,
              "name": "Affine",
              "outputSideConnector": [],
              "parameterScope": "affine",
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "Affine",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "OutShape",
                  "argumentName": "n_outmaps -f",
                  "required": true,
                  "editable": true,
                  "searchParameter": true,
                  "value": "100",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "BaseAxis",
                  "argumentName": "affine_param.base_axis -a -n",
                  "required": true,
                  "editable": false,
                  "value": "0",
                  "shortName": "",
                  "type": "UInt"
                },
                {
                  "name": "WithBias",
                  "argumentName": "with_bias -n",
                  "required": true,
                  "editable": true,
                  "value": true,
                  "shortName": "",
                  "type": "Boolean"
                },
                {
                  "name": "ParameterScope",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "*Name",
                  "shortName": "",
                  "type": "Text"
                },
                {
                  "name": "W.File",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "",
                  "shortName": "",
                  "type": "File"
                },
                {
                  "name": "W.Initializer",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "NormalAffineGlorot",
                  "shortName": "",
                  "type": "Option",
                  "option": [
                    "Normal",
                    "NormalAffineHeForward",
                    "NormalAffineHeBackward",
                    "NormalAffineGlorot",
                    "Uniform",
                    "UniformAffineGlorot",
                    "Constant"
                  ]
                },
                {
                  "name": "W.InitializerMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "W.LRateMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "b.File",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "",
                  "shortName": "",
                  "type": "File"
                },
                {
                  "name": "b.Initializer",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "Constant",
                  "shortName": "",
                  "type": "Option",
                  "option": [
                    "Normal",
                    "Uniform",
                    "Constant"
                  ]
                },
                {
                  "name": "b.InitializerMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "0.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "b.LRateMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*OutShape",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostParameter",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*SumParameterSize",
                  "shortName": "",
                  "type": "UInt"
                },
                {
                  "name": "CostAdd",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*WithBias:**OutShape",
                  "shortName": "",
                  "type": "UInt"
                },
                {
                  "name": "CostMultiplyAdd",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input:**OutShape",
                  "shortName": "",
                  "type": "UInt"
                }
              ]
            },
            {
              "reference": "Chen et al., DeepLab: Semantic Image Segmentation with Deep Convolutional Nets, Atrous Convolution, and Fully Connected CRFs. https://arxiv.org/abs/1606.00915\\nYu et al., Multi-Scale Context Aggregation by Dilated Convolutions. https://arxiv.org/abs/1511.07122",
              "color": "0x6aa1bd",
              "inputSideConnector": [
                {
                  "color": "0xa8a800",
                  "kind": "Parameter",
                  "enable": true,
                  "shape": "*ConvolutionWeightShape",
                  "name": "W"
                },
                {
                  "color": "0xa8a800",
                  "kind": "Parameter",
                  "enable": "*WithBias",
                  "shape": "*OutMaps",
                  "name": "b"
                }
              ],
              "input": 1,
              "layout": null,
              "name": "Convolution",
              "outputSideConnector": [],
              "parameterScope": "conv",
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "Convolution",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "OutMaps",
                  "argumentName": "outmaps",
                  "required": true,
                  "editable": true,
                  "searchParameter": true,
                  "value": "16",
                  "shortName": "Maps",
                  "type": "PInt"
                },
                {
                  "name": "KernelShape",
                  "argumentName": "kernel",
                  "required": true,
                  "editable": true,
                  "searchParameter": true,
                  "important": true,
                  "value": "3,3",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "BorderMode",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "same",
                  "shortName": "",
                  "type": "Option",
                  "option": [
                    "valid",
                    "full",
                    "same"
                  ]
                },
                {
                  "name": "Padding",
                  "argumentName": "convolution_param.pad",
                  "required": true,
                  "editable": true,
                  "value": "*ConvolutionPaddingSize",
                  "shortName": "",
                  "type": "UIntArray"
                },
                {
                  "name": "Strides",
                  "argumentName": "convolution_param.stride",
                  "required": true,
                  "editable": true,
                  "value": "1,1",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Dilation",
                  "argumentName": "convolution_param.dilation",
                  "required": true,
                  "editable": true,
                  "value": "1,1",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Group",
                  "argumentName": "convolution_param.group",
                  "required": true,
                  "editable": true,
                  "value": "1",
                  "shortName": "",
                  "type": "PInt"
                },
                {
                  "name": "ChannelLast",
                  "argumentName": "convolution_param.channel_last",
                  "required": true,
                  "editable": true,
                  "value": false,
                  "shortName": "",
                  "type": "Boolean"
                },
                {
                  "name": "BaseAxis",
                  "argumentName": "convolution_param.base_axis -a -n",
                  "required": true,
                  "editable": false,
                  "value": "0",
                  "shortName": "",
                  "type": "UInt"
                },
                {
                  "name": "WithBias",
                  "argumentName": "with_bias -n",
                  "required": true,
                  "editable": true,
                  "value": true,
                  "shortName": "",
                  "type": "Boolean"
                },
                {
                  "name": "ParameterScope",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "*Name",
                  "shortName": "",
                  "type": "Text"
                },
                {
                  "name": "W.File",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "",
                  "shortName": "",
                  "type": "File"
                },
                {
                  "name": "W.Initializer",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "NormalConvolutionGlorot",
                  "shortName": "",
                  "type": "Option",
                  "option": [
                    "Normal",
                    "NormalConvolutionHeForward",
                    "NormalConvolutionHeBackward",
                    "NormalConvolutionGlorot",
                    "NormalCLConvHeForward",
                    "NormalCLConvHeBackward",
                    "NormalCLConvGlorot",
                    "Uniform",
                    "UniformConvolutionGlorot",
                    "UniformCLConvGlorot",
                    "Constant"
                  ]
                },
                {
                  "name": "W.InitializerMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "W.LRateMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "b.File",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "",
                  "shortName": "",
                  "type": "File"
                },
                {
                  "name": "b.Initializer",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "Constant",
                  "shortName": "",
                  "type": "Option",
                  "option": [
                    "Normal",
                    "Uniform",
                    "Constant"
                  ]
                },
                {
                  "name": "b.InitializerMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "0.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "b.LRateMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*ConvolutionOutputSize",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostParameter",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*SumParameterSize",
                  "shortName": "",
                  "type": "UInt"
                },
                {
                  "name": "CostAdd",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*WithBias:**Output",
                  "shortName": "",
                  "type": "UInt"
                },
                {
                  "name": "CostMultiplyAdd",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*ConvolutionMultiplyAddSize",
                  "shortName": "",
                  "type": "UInt"
                }
              ]
            },
            {
              "reference": "F. Chollet: Chollet, Francois. \"Xception: Deep Learning with Depthwise Separable Convolutions. https://arxiv.org/abs/1610.02357",
              "color": "0x6aa1bd",
              "inputSideConnector": [
                {
                  "color": "0xa8a800",
                  "kind": "Parameter",
                  "enable": true,
                  "shape": "Input[0]*Multiplier,KernelShape[0],KernelShape[1]",
                  "name": "W"
                },
                {
                  "color": "0xa8a800",
                  "kind": "Parameter",
                  "enable": "*WithBias",
                  "shape": "*OutMaps",
                  "name": "b"
                }
              ],
              "input": 1,
              "layout": null,
              "name": "DepthwiseConvolution",
              "outputSideConnector": [],
              "parameterScope": "depthwise_conv",
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "DepthwiseConvolution",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "OutMaps",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "Input[0]*Multiplier",
                  "shortName": "",
                  "type": "PInt"
                },
                {
                  "name": "KernelShape",
                  "argumentName": "kernel",
                  "required": true,
                  "editable": true,
                  "searchParameter": true,
                  "important": true,
                  "value": "5,5",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "BorderMode",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "valid",
                  "shortName": "",
                  "type": "Option",
                  "option": [
                    "valid",
                    "full",
                    "same"
                  ]
                },
                {
                  "name": "Padding",
                  "argumentName": "depthwise_convolution_param.pad",
                  "required": true,
                  "editable": true,
                  "value": "*ConvolutionPaddingSize",
                  "shortName": "",
                  "type": "UIntArray"
                },
                {
                  "name": "Strides",
                  "argumentName": "depthwise_convolution_param.stride",
                  "required": true,
                  "editable": true,
                  "value": "1,1",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Dilation",
                  "argumentName": "depthwise_convolution_param.dilation",
                  "required": true,
                  "editable": true,
                  "value": "1,1",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Group",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "Input[0]",
                  "visible": false,
                  "shortName": "",
                  "type": "PInt"
                },
                {
                  "name": "Multiplier",
                  "argumentName": "depthwise_convolution_param.multiplier",
                  "required": true,
                  "editable": true,
                  "value": "1",
                  "shortName": "",
                  "type": "PInt"
                },
                {
                  "name": "BaseAxis",
                  "argumentName": "depthwise_convolution_param.base_axis -a -n",
                  "required": true,
                  "editable": false,
                  "value": "0",
                  "shortName": "",
                  "type": "UInt"
                },
                {
                  "name": "WithBias",
                  "argumentName": "with_bias -n",
                  "required": true,
                  "editable": true,
                  "value": true,
                  "shortName": "",
                  "type": "Boolean"
                },
                {
                  "name": "ParameterScope",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "*Name",
                  "shortName": "",
                  "type": "Text"
                },
                {
                  "name": "W.File",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "",
                  "shortName": "",
                  "type": "File"
                },
                {
                  "name": "W.Initializer",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "NormalConvolutionGlorot",
                  "shortName": "",
                  "type": "Option",
                  "option": [
                    "Normal",
                    "NormalConvolutionHeForward",
                    "NormalConvolutionHeBackward",
                    "NormalConvolutionGlorot",
                    "Uniform",
                    "UniformConvolutionGlorot",
                    "Constant"
                  ]
                },
                {
                  "name": "W.InitializerMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "W.LRateMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "b.File",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "",
                  "shortName": "",
                  "type": "File"
                },
                {
                  "name": "b.Initializer",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "Constant",
                  "shortName": "",
                  "type": "Option",
                  "option": [
                    "Normal",
                    "Uniform",
                    "Constant"
                  ]
                },
                {
                  "name": "b.InitializerMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "0.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "b.LRateMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*ConvolutionOutputSize",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostParameter",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*SumParameterSize",
                  "shortName": "",
                  "type": "UInt"
                },
                {
                  "name": "CostAdd",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*WithBias:**Output",
                  "shortName": "",
                  "type": "UInt"
                },
                {
                  "name": "CostMultiplyAdd",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*ConvolutionMultiplyAddSize",
                  "shortName": "",
                  "type": "UInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0x6aa1bd",
              "inputSideConnector": [
                {
                  "color": "0xa8a800",
                  "kind": "Parameter",
                  "enable": true,
                  "shape": "*ConvolutionWeightShapeDeconvolution",
                  "name": "W"
                },
                {
                  "color": "0xa8a800",
                  "kind": "Parameter",
                  "enable": "*WithBias",
                  "shape": "*OutMaps",
                  "name": "b"
                }
              ],
              "input": 1,
              "layout": null,
              "name": "Deconvolution",
              "outputSideConnector": [],
              "parameterScope": "deconv",
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "Deconvolution",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "OutMaps",
                  "argumentName": "outmaps -f",
                  "required": true,
                  "editable": true,
                  "searchParameter": true,
                  "value": "16",
                  "shortName": "Maps",
                  "type": "PInt"
                },
                {
                  "name": "KernelShape",
                  "argumentName": "kernel -f",
                  "required": true,
                  "editable": true,
                  "searchParameter": true,
                  "important": true,
                  "value": "5,5",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Padding",
                  "argumentName": "deconvolution_param.pad",
                  "required": true,
                  "editable": true,
                  "value": "0,0",
                  "shortName": "",
                  "type": "UIntArray"
                },
                {
                  "name": "Strides",
                  "argumentName": "deconvolution_param.stride",
                  "required": true,
                  "editable": true,
                  "value": "1,1",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Dilation",
                  "argumentName": "deconvolution_param.dilation",
                  "required": true,
                  "editable": true,
                  "value": "1,1",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Group",
                  "argumentName": "deconvolution_param.group",
                  "required": true,
                  "editable": true,
                  "value": "1",
                  "shortName": "",
                  "type": "PInt"
                },
                {
                  "name": "BaseAxis",
                  "argumentName": "deconvolution_param.base_axis -a -n",
                  "required": true,
                  "editable": false,
                  "value": "0",
                  "shortName": "",
                  "type": "UInt"
                },
                {
                  "name": "WithBias",
                  "argumentName": "with_bias -n",
                  "required": true,
                  "editable": true,
                  "value": true,
                  "shortName": "",
                  "type": "Boolean"
                },
                {
                  "name": "ParameterScope",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "*Name",
                  "shortName": "",
                  "type": "Text"
                },
                {
                  "name": "W.File",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "",
                  "shortName": "",
                  "type": "File"
                },
                {
                  "name": "W.Initializer",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "NormalConvolutionHeForward",
                  "shortName": "",
                  "type": "Option",
                  "option": [
                    "Normal",
                    "NormalConvolutionHeForward",
                    "NormalConvolutionHeBackward",
                    "NormalConvolutionGlorot",
                    "Uniform",
                    "UniformConvolutionGlorot",
                    "Constant"
                  ]
                },
                {
                  "name": "W.InitializerMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "W.LRateMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "b.File",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "",
                  "shortName": "",
                  "type": "File"
                },
                {
                  "name": "b.Initializer",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "Constant",
                  "shortName": "",
                  "type": "Option",
                  "option": [
                    "Normal",
                    "Uniform",
                    "Constant"
                  ]
                },
                {
                  "name": "b.InitializerMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "0.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "b.LRateMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*DeconvolutionOutputSize",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostParameter",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*SumParameterSize",
                  "shortName": "",
                  "type": "UInt"
                },
                {
                  "name": "CostAdd",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*WithBias:**Output",
                  "shortName": "",
                  "type": "UInt"
                },
                {
                  "name": "CostMultiplyAdd",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*ConvolutionMultiplyAddSize",
                  "shortName": "",
                  "type": "UInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0x6aa1bd",
              "inputSideConnector": [
                {
                  "color": "0xa8a800",
                  "kind": "Parameter",
                  "enable": true,
                  "shape": "Input[0]*Divisor,KernelShape[0],KernelShape[1]",
                  "name": "W"
                },
                {
                  "color": "0xa8a800",
                  "kind": "Parameter",
                  "enable": "*WithBias",
                  "shape": "*OutMaps",
                  "name": "b"
                }
              ],
              "input": 1,
              "layout": null,
              "name": "DepthwiseDeconvolution",
              "outputSideConnector": [],
              "parameterScope": "depthwise_deconv",
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "DepthwiseDeconvolution",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "OutMaps",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "Input[0]/Divisor",
                  "shortName": "",
                  "type": "PInt"
                },
                {
                  "name": "KernelShape",
                  "argumentName": "kernel -f",
                  "required": true,
                  "editable": true,
                  "searchParameter": true,
                  "important": true,
                  "value": "5,5",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Padding",
                  "argumentName": "depthwise_deconvolution_param.pad",
                  "required": true,
                  "editable": true,
                  "value": "0,0",
                  "shortName": "",
                  "type": "UIntArray"
                },
                {
                  "name": "Strides",
                  "argumentName": "depthwise_deconvolution_param.stride",
                  "required": true,
                  "editable": true,
                  "value": "1,1",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Dilation",
                  "argumentName": "depthwise_deconvolution_param.dilation",
                  "required": true,
                  "editable": true,
                  "value": "1,1",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Group",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "Input[0]",
                  "visible": false,
                  "shortName": "",
                  "type": "PInt"
                },
                {
                  "name": "Divisor",
                  "argumentName": "depthwise_deconvolution_param.divisor",
                  "required": true,
                  "editable": true,
                  "value": "1",
                  "shortName": "",
                  "type": "PInt"
                },
                {
                  "name": "BaseAxis",
                  "argumentName": "depthwise_deconvolution_param.base_axis -a -n",
                  "required": true,
                  "editable": false,
                  "value": "0",
                  "shortName": "",
                  "type": "UInt"
                },
                {
                  "name": "WithBias",
                  "argumentName": "with_bias -n",
                  "required": true,
                  "editable": true,
                  "value": true,
                  "shortName": "",
                  "type": "Boolean"
                },
                {
                  "name": "ParameterScope",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "*Name",
                  "shortName": "",
                  "type": "Text"
                },
                {
                  "name": "W.File",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "",
                  "shortName": "",
                  "type": "File"
                },
                {
                  "name": "W.Initializer",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "NormalConvolutionHeForward",
                  "shortName": "",
                  "type": "Option",
                  "option": [
                    "Normal",
                    "NormalConvolutionHeForward",
                    "NormalConvolutionHeBackward",
                    "NormalConvolutionGlorot",
                    "Uniform",
                    "UniformConvolutionGlorot",
                    "Constant"
                  ]
                },
                {
                  "name": "W.InitializerMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "W.LRateMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "b.File",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "",
                  "shortName": "",
                  "type": "File"
                },
                {
                  "name": "b.Initializer",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "Constant",
                  "shortName": "",
                  "type": "Option",
                  "option": [
                    "Normal",
                    "Uniform",
                    "Constant"
                  ]
                },
                {
                  "name": "b.InitializerMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "0.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "b.LRateMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*DeconvolutionOutputSize",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostParameter",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*SumParameterSize",
                  "shortName": "",
                  "type": "UInt"
                },
                {
                  "name": "CostAdd",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*WithBias:**Output",
                  "shortName": "",
                  "type": "UInt"
                },
                {
                  "name": "CostMultiplyAdd",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*ConvolutionMultiplyAddSize",
                  "shortName": "",
                  "type": "UInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0x6aa1bd",
              "inputSideConnector": [
                {
                  "color": "0xa8a800",
                  "kind": "Parameter",
                  "enable": true,
                  "shape": "*EmbeddingWeightSize",
                  "name": "W"
                }
              ],
              "input": 1,
              "layout": null,
              "name": "Embed",
              "outputSideConnector": [],
              "parameterScope": "embed",
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "Embed",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "NumClass",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "100",
                  "important": true,
                  "shortName": "",
                  "type": "PInt"
                },
                {
                  "name": "Shape",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "searchParameter": true,
                  "important": true,
                  "value": "32",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "ParameterScope",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "*Name",
                  "shortName": "",
                  "type": "Text"
                },
                {
                  "name": "W.File",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "",
                  "shortName": "",
                  "type": "File"
                },
                {
                  "name": "W.Initializer",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "Uniform",
                  "shortName": "",
                  "type": "Option",
                  "option": [
                    "Normal",
                    "Uniform",
                    "Constant"
                  ]
                },
                {
                  "name": "W.InitializerMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "W.LRateMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*EmbeddingOutputSize",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostParameter",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*SumParameterSize",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xa58e7f",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "MaxPooling",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "MaxPooling",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "KernelShape",
                  "argumentName": "max_pooling_param.kernel -f",
                  "required": true,
                  "editable": true,
                  "searchParameter": true,
                  "important": true,
                  "value": "2,2",
                  "shortName": "Shape",
                  "type": "PIntArray"
                },
                {
                  "name": "Strides",
                  "argumentName": "max_pooling_param.stride -f",
                  "required": true,
                  "editable": true,
                  "value": "*KernelShape",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "IgnoreBorder",
                  "argumentName": "max_pooling_param.ignore_border",
                  "required": true,
                  "editable": true,
                  "value": true,
                  "shortName": "",
                  "type": "Boolean"
                },
                {
                  "name": "Padding",
                  "argumentName": "max_pooling_param.pad",
                  "required": true,
                  "editable": true,
                  "value": "0,0",
                  "shortName": "",
                  "type": "UIntArray"
                },
                {
                  "name": "ChannelLast",
                  "argumentName": "max_pooling_param.channel_last",
                  "required": true,
                  "editable": true,
                  "value": false,
                  "shortName": "",
                  "type": "Boolean"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*PoolingOutputSize",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostIf",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Output:**KernelShape",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xa58e7f",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "AveragePooling",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "AveragePooling",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "KernelShape",
                  "argumentName": "average_pooling_param.kernel -f",
                  "required": true,
                  "editable": true,
                  "searchParameter": true,
                  "important": true,
                  "value": "2,2",
                  "shortName": "Shape",
                  "type": "PIntArray"
                },
                {
                  "name": "Strides",
                  "argumentName": "average_pooling_param.stride -f",
                  "required": true,
                  "editable": true,
                  "value": "*KernelShape",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "IgnoreBorder",
                  "argumentName": "average_pooling_param.ignore_border",
                  "required": true,
                  "editable": true,
                  "value": true,
                  "shortName": "",
                  "type": "Boolean"
                },
                {
                  "name": "Padding",
                  "argumentName": "average_pooling_param.pad",
                  "required": true,
                  "editable": true,
                  "value": "0,0",
                  "shortName": "",
                  "type": "UIntArray"
                },
                {
                  "name": "ChannelLast",
                  "argumentName": "average_pooling_param.channel_last",
                  "required": true,
                  "editable": true,
                  "value": false,
                  "shortName": "",
                  "type": "Boolean"
                },
                {
                  "name": "IncludingPad",
                  "argumentName": "average_pooling_param.including_pad",
                  "required": true,
                  "editable": true,
                  "value": true,
                  "shortName": "",
                  "type": "Boolean"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*PoolingOutputSize",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostAdd",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                },
                {
                  "name": "CostMultiply",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Output",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xa58e7f",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "GlobalAveragePooling",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "GlobalAveragePooling",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "Input[0],1,1",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostAdd",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                },
                {
                  "name": "CostMultiply",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Output",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xa58e7f",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "SumPooling",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "SumPooling",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "KernelShape",
                  "argumentName": "sum_pooling_param.kernel -f",
                  "required": true,
                  "editable": true,
                  "searchParameter": true,
                  "important": true,
                  "value": "2,2",
                  "shortName": "Shape",
                  "type": "PIntArray"
                },
                {
                  "name": "Strides",
                  "argumentName": "sum_pooling_param.stride -f",
                  "required": true,
                  "editable": true,
                  "value": "*KernelShape",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "IgnoreBorder",
                  "argumentName": "sum_pooling_param.ignore_border",
                  "required": true,
                  "editable": true,
                  "value": true,
                  "shortName": "",
                  "type": "Boolean"
                },
                {
                  "name": "Padding",
                  "argumentName": "sum_pooling_param.pad",
                  "required": true,
                  "editable": true,
                  "value": "0,0",
                  "shortName": "",
                  "type": "UIntArray"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*PoolingOutputSize",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostAdd",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xa58e7f",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "Unpooling",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "Unpooling",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "KernelShape",
                  "argumentName": "unpooling_param.kernel -f",
                  "required": true,
                  "editable": true,
                  "searchParameter": true,
                  "important": true,
                  "value": "2,2",
                  "shortName": "Shape",
                  "type": "PIntArray"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*UnpoolingOutputSize",
                  "shortName": "",
                  "type": "PIntArray"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xd77b6a",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "Tanh",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "Tanh",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostAdd",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input:+*Input",
                  "shortName": "",
                  "type": "PInt"
                },
                {
                  "name": "CostDivision",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                },
                {
                  "name": "CostExp",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xd77b6a",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "HardTanh",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "HardTanh",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostIf",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input:*2",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xd77b6a",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "TanhShrink",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "TanhShrink",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostAdd",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input:*3",
                  "shortName": "",
                  "type": "PInt"
                },
                {
                  "name": "CostDivision",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                },
                {
                  "name": "CostExp",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xd77b6a",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "Sigmoid",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "Sigmoid",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostAdd",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                },
                {
                  "name": "CostDivision",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                },
                {
                  "name": "CostExp",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xd77b6a",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "HardSigmoid",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "HardSigmoid",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostAdd",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                },
                {
                  "name": "CostMultiply",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                },
                {
                  "name": "CostIf",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input:*2",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xd77b6a",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "LogSigmoid",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "LogSigmoid",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostAdd",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                },
                {
                  "name": "CostDivision",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                },
                {
                  "name": "CostExp",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input:*2",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xd77b6a",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "Abs",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "Abs",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostIf",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": "Vinod Nair, Geoffrey E. Hinton. Rectified Linear Units Improve Restricted Boltzmann Machines. http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.165.6419&rep=rep1&type=pdf",
              "color": "0xd77b6a",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "ReLU",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "ReLU",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "InPlace",
                  "argumentName": "relu_param.inplace",
                  "required": true,
                  "editable": true,
                  "value": "*AutoInPlaceOnce",
                  "shortName": "",
                  "type": "BooleanOrMacro"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostIf",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": "Wenling Shang, Kihyuk Sohn, Diogo Almeida, Honglak Lee. Understanding and Improving Convolutional Neural Networks via Concatenated Rectified Linear Units. https://arxiv.org/abs/1603.05201",
              "color": "0xd77b6a",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "CReLU",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "CReLU",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Axis",
                  "argumentName": "crelu_param.axis -a",
                  "required": true,
                  "editable": true,
                  "value": "0",
                  "shortName": "",
                  "type": "UInt"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*ConcatenateActivationOutputSize",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostIf",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Output",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": "Andrew L. Maas, Awni Y. Hannun, Andrew Y. Ng. Rectifier Nonlinearities Improve Neural Network Acoustic Models. https://ai.stanford.edu/~amaas/papers/relu_hybrid_icml2013_final.pdf",
              "color": "0xd77b6a",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "LeakyReLU",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "LeakyReLU",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Alpha",
                  "argumentName": "leaky_relu_param.alpha",
                  "required": true,
                  "editable": true,
                  "value": "0.1",
                  "important": true,
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "InPlace",
                  "argumentName": "leaky_relu_param.inplace",
                  "required": true,
                  "editable": true,
                  "value": "*AutoInPlaceOnce",
                  "shortName": "",
                  "type": "BooleanOrMacro"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostIf",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                },
                {
                  "name": "CostMultiply",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": "Kaiming He, Xiangyu Zhang, Shaoqing Ren, Jian Sun. Delving Deep into Rectifiers: Surpassing Human-Level Performance on ImageNet Classification. https://arxiv.org/abs/1502.01852",
              "color": "0xd77b6a",
              "inputSideConnector": [
                {
                  "color": "0xa8a800",
                  "kind": "Parameter",
                  "enable": true,
                  "shape": "*PReluParameterSize",
                  "name": "slope"
                }
              ],
              "input": 1,
              "layout": null,
              "name": "PReLU",
              "outputSideConnector": [],
              "parameterScope": "prelu",
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "PReLU",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "BaseAxis",
                  "argumentName": "prelu_param.base_axis -a -f",
                  "required": true,
                  "editable": true,
                  "value": "0",
                  "shortName": "",
                  "type": "Int"
                },
                {
                  "name": "Shared",
                  "argumentName": "shared -f",
                  "required": true,
                  "editable": false,
                  "value": false,
                  "shortName": "",
                  "type": "Boolean"
                },
                {
                  "name": "ParameterScope",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "*Name",
                  "shortName": "",
                  "type": "Text"
                },
                {
                  "name": "slope.File",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "",
                  "shortName": "",
                  "type": "File"
                },
                {
                  "name": "slope.Initializer",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "Constant",
                  "shortName": "",
                  "type": "Option",
                  "option": [
                    "Normal",
                    "Uniform",
                    "Constant"
                  ]
                },
                {
                  "name": "slope.InitializerMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "0.25",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "slope.LRateMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostParameter",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*SumParameterSize",
                  "shortName": "",
                  "type": "UInt"
                },
                {
                  "name": "CostIf",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                },
                {
                  "name": "CostMultiplyAdd",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xd77b6a",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "ReLU6",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "ReLU6",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostIf",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input:*2",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": "Clevart et al., Fast and Accurate Deep Network Learning by Exponential Linear Units (ELUs). http://arxiv.org/abs/1511.07289",
              "color": "0xd77b6a",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "ELU",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "ELU",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Alpha",
                  "argumentName": "elu_param.alpha",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "important": true,
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostIf",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                },
                {
                  "name": "CostAdd",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                },
                {
                  "name": "CostMultiply",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                },
                {
                  "name": "CostExp",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xd77b6a",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "CELU",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "CELU",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Alpha",
                  "argumentName": "celu_param.alpha",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "important": true,
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Axis",
                  "argumentName": "celu_param.axis -a",
                  "required": true,
                  "editable": true,
                  "value": "0",
                  "shortName": "",
                  "type": "UInt"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*ConcatenateActivationOutputSize",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostIf",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Output",
                  "shortName": "",
                  "type": "PInt"
                },
                {
                  "name": "CostAdd",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Output",
                  "shortName": "",
                  "type": "PInt"
                },
                {
                  "name": "CostMultiply",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Output",
                  "shortName": "",
                  "type": "PInt"
                },
                {
                  "name": "CostExp",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Output",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": "Element-wise Scaled Exponential Linear Unit (SELU) function by Klambauer et al. (2017).",
              "color": "0xd77b6a",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "SELU",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "SELU",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Scale",
                  "argumentName": "selu_param.scale",
                  "required": true,
                  "editable": true,
                  "value": "1.05070098735548",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Alpha",
                  "argumentName": "selu_param.alpha",
                  "required": true,
                  "editable": true,
                  "value": "1.673263242354377",
                  "important": true,
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostIf",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                },
                {
                  "name": "CostAdd",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                },
                {
                  "name": "CostMultiply",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input:+*Input",
                  "shortName": "",
                  "type": "PInt"
                },
                {
                  "name": "CostExp",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": "Dan Hendrycks, Kevin Gimpel, Gaussian Error Linear Units (GELUs). https://arxiv.org/abs/1606.08415",
              "color": "0xd77b6a",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "GELU",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "GELU",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostAdd",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input:*2",
                  "shortName": "",
                  "type": "PInt"
                },
                {
                  "name": "CostMultiply",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input:*6",
                  "shortName": "",
                  "type": "PInt"
                },
                {
                  "name": "CostExp",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input:*2",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xd77b6a",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "SoftPlus",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "SoftPlus",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostAdd",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                },
                {
                  "name": "CostExp",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input:*2",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xd77b6a",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "SoftSign",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "SoftSign",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostAdd",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                },
                {
                  "name": "CostDivision",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                },
                {
                  "name": "CostIf",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xd77b6a",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "Sinc",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "Sinc",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostDivision",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                },
                {
                  "name": "CostIf",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": "Prajit Ramachandran, Barret Zoph, and Quoc V. Le, SEARCHING FOR ACTIVATION FUNCTIONS. https://arxiv.org/abs/1710.05941",
              "color": "0xd77b6a",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "Swish",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "Swish",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostAdd",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                },
                {
                  "name": "CostMultiply",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                },
                {
                  "name": "CostDivision",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                },
                {
                  "name": "CostExp",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": "Diganta Misra, Mish: A Self Regularized Non-Monotonic Activation Function https://arxiv.org/abs/1908.08681",
              "color": "0xd77b6a",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "Mish",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "Mish",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostAdd",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input:*2",
                  "shortName": "",
                  "type": "PInt"
                },
                {
                  "name": "CostMultiply",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                },
                {
                  "name": "CostDivision",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                },
                {
                  "name": "CostExp",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input:*3",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xd77b6a",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "Softmax",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "Softmax",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Axis",
                  "argumentName": "softmax_param.axis -a",
                  "required": true,
                  "editable": true,
                  "value": "0",
                  "shortName": "",
                  "type": "UInt"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostAdd",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                },
                {
                  "name": "CostExp",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                },
                {
                  "name": "CostDivision",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xa18fb2",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "RepeatStart",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "RepeatStart",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Times",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "searchParameter": true,
                  "value": "3",
                  "shortName": "",
                  "type": "PInt"
                },
                {
                  "name": "ID",
                  "argumentName": "repeat_param.repeat_id",
                  "required": true,
                  "editable": false,
                  "value": "*Name",
                  "shortName": "",
                  "type": "Text"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xa18fb2",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "RepeatEnd",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "RepeatEnd",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "ID",
                  "argumentName": "repeat_param.repeat_id",
                  "required": true,
                  "editable": false,
                  "value": "RepeatStart",
                  "shortName": "",
                  "type": "Text"
                },
                {
                  "name": "Times",
                  "argumentName": "repeat_param.times",
                  "required": true,
                  "editable": false,
                  "value": "*RepeatTimes",
                  "shortName": "",
                  "type": "PInt"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xa18fb2",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "RecurrentInput",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "RecurrentInput",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Axis",
                  "argumentName": "recurrent_param.axis -a",
                  "required": true,
                  "editable": true,
                  "value": "0",
                  "shortName": "",
                  "type": "UInt"
                },
                {
                  "name": "ID",
                  "argumentName": "recurrent_param.repeat_id",
                  "required": true,
                  "editable": false,
                  "value": "*Name",
                  "shortName": "",
                  "type": "Text"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*ShapeExceptAxis",
                  "shortName": "",
                  "type": "PIntArray"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xa18fb2",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "RecurrentOutput",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "RecurrentOutput",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Axis",
                  "argumentName": "recurrent_param.axis -a",
                  "required": true,
                  "editable": true,
                  "value": "0",
                  "shortName": "",
                  "type": "UInt"
                },
                {
                  "name": "ID",
                  "argumentName": "recurrent_param.repeat_id",
                  "required": true,
                  "editable": false,
                  "value": "RecurrentInput",
                  "shortName": "",
                  "type": "Text"
                },
                {
                  "name": "Length",
                  "argumentName": "recurrent_param.length",
                  "required": true,
                  "editable": false,
                  "value": "*RecurrentLength",
                  "shortName": "",
                  "type": "PInt"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*RecurrentOutputSize",
                  "shortName": "",
                  "type": "PIntArray"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xa18fb2",
              "inputSideConnector": [
                {
                  "color": "0x00a0b0",
                  "kind": "Data",
                  "enable": true,
                  "shape": "*Size",
                  "name": "Initial"
                }
              ],
              "input": 1,
              "layout": null,
              "name": "Delay",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "Delay",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Size",
                  "argumentName": "size",
                  "required": true,
                  "editable": true,
                  "value": "*Input",
                  "important": true,
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Initial.Dataset",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "c",
                  "shortName": "",
                  "type": "Dataset"
                },
                {
                  "name": "Initial.Generator",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "Constant",
                  "shortName": "",
                  "type": "Option",
                  "option": [
                    "None",
                    "Normal",
                    "Uniform",
                    "Constant"
                  ]
                },
                {
                  "name": "Initial.GeneratorMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "0.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "ID",
                  "argumentName": "recurrent_param.repeat_id",
                  "required": true,
                  "editable": false,
                  "value": "",
                  "shortName": "",
                  "type": "Text"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Size",
                  "shortName": "",
                  "type": "PIntArray"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xb2b2b2",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "FixedPointQuantize",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "FixedPointQuantize",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphIO",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Sign",
                  "argumentName": "fixed_point_quantize_param.sign",
                  "required": true,
                  "editable": true,
                  "value": true,
                  "shortName": "",
                  "type": "Boolean"
                },
                {
                  "name": "N",
                  "argumentName": "fixed_point_quantize_param.n",
                  "required": true,
                  "editable": true,
                  "value": "8",
                  "shortName": "",
                  "type": "PInt"
                },
                {
                  "name": "Delta",
                  "argumentName": "fixed_point_quantize_param.delta",
                  "required": true,
                  "editable": true,
                  "value": "0.0625",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "STEFineGrained",
                  "argumentName": "fixed_point_quantize_param.ste_fine_grained",
                  "required": true,
                  "editable": true,
                  "value": true,
                  "shortName": "",
                  "type": "Boolean"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                }
              ]
            },
            {
              "reference": "Miyashita Daisuke, Lee H. Edward, Murmann Boris. Convolutional Neural Networks using Logarithmic Data Representation. https://arxiv.org/abs/1603.01025\\nAojun Zhou, Anbang Yao, Yiwen Guo, Lin Xu, Yurong Chen. Incremental Network Quantization: Towards Lossless CNNs with Low-precision Weights. https://arxiv.org/abs/1702.03044",
              "color": "0xb2b2b2",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "Pow2Quantize",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "Pow2Quantize",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphIO",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Sign",
                  "argumentName": "pow2_quantize_param.sign",
                  "required": true,
                  "editable": true,
                  "value": true,
                  "shortName": "",
                  "type": "Boolean"
                },
                {
                  "name": "WithZero",
                  "argumentName": "pow2_quantize_param.with_zero",
                  "required": true,
                  "editable": true,
                  "value": true,
                  "shortName": "",
                  "type": "Boolean"
                },
                {
                  "name": "N",
                  "argumentName": "pow2_quantize_param.n",
                  "required": true,
                  "editable": true,
                  "value": "8",
                  "shortName": "",
                  "type": "PInt"
                },
                {
                  "name": "M",
                  "argumentName": "pow2_quantize_param.m",
                  "required": true,
                  "editable": true,
                  "value": "1",
                  "shortName": "",
                  "type": "UInt"
                },
                {
                  "name": "STEFineGrained",
                  "argumentName": "pow2_quantize_param.ste_fine_grained",
                  "required": true,
                  "editable": true,
                  "value": true,
                  "shortName": "",
                  "type": "Boolean"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                }
              ]
            },
            {
              "reference": "M. Courbariaux, Y. Bengio, and J.-P. David. BinaryConnect: Training Deep Neural Networks with binary weights during propagations. https://arxiv.org/abs/1511.00363",
              "color": "0x6aa1bd",
              "inputSideConnector": [
                {
                  "color": "0xa8a800",
                  "kind": "Parameter",
                  "enable": true,
                  "shape": "*AffineWeightShape",
                  "name": "W"
                },
                {
                  "kind": "Parameter",
                  "enable": true,
                  "name": "Wb",
                  "color": "0xa8a800",
                  "shortName": "Wb",
                  "shape": "*AffineWeightShape"
                },
                {
                  "color": "0xa8a800",
                  "kind": "Parameter",
                  "enable": "*WithBias",
                  "shape": "*OutShape",
                  "name": "b"
                }
              ],
              "input": 1,
              "layout": null,
              "name": "BinaryConnectAffine",
              "outputSideConnector": [],
              "parameterScope": "bicon_affine",
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "BinaryConnectAffine",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "OutShape",
                  "argumentName": "outshape",
                  "required": true,
                  "editable": true,
                  "searchParameter": true,
                  "value": "100",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "WithBias",
                  "argumentName": "with_bias",
                  "required": true,
                  "editable": true,
                  "value": true,
                  "shortName": "",
                  "type": "Boolean"
                },
                {
                  "name": "BaseAxis",
                  "argumentName": "binary_connect_affine_param.base_axis -a",
                  "required": true,
                  "editable": false,
                  "value": "0",
                  "shortName": "",
                  "type": "UInt"
                },
                {
                  "name": "ParameterScope",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "*Name",
                  "shortName": "",
                  "type": "Text"
                },
                {
                  "name": "W.File",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "",
                  "shortName": "",
                  "type": "File"
                },
                {
                  "name": "W.Initializer",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "UniformAffineGlorot",
                  "shortName": "",
                  "type": "Option",
                  "option": [
                    "Normal",
                    "NormalAffineHeForward",
                    "NormalAffineHeBackward",
                    "NormalAffineGlorot",
                    "Uniform",
                    "UniformAffineGlorot",
                    "Constant"
                  ]
                },
                {
                  "name": "W.InitializerMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "W.LRateMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Wb.File",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "",
                  "shortName": "",
                  "type": "File"
                },
                {
                  "name": "Wb.Initializer",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "Constant",
                  "shortName": "",
                  "type": "Option",
                  "option": [
                    "Normal",
                    "NormalAffineHeForward",
                    "NormalAffineHeBackward",
                    "NormalAffineGlorot",
                    "Uniform",
                    "UniformAffineGlorot",
                    "Constant"
                  ]
                },
                {
                  "name": "Wb.InitializerMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "0.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Wb.LRateMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "0.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "b.File",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "",
                  "shortName": "",
                  "type": "File"
                },
                {
                  "name": "b.Initializer",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "Constant",
                  "shortName": "",
                  "type": "Option",
                  "option": [
                    "Normal",
                    "Uniform",
                    "Constant"
                  ]
                },
                {
                  "name": "b.InitializerMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "0.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "b.LRateMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*OutShape",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostAdd",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input:**OutShape",
                  "shortName": "",
                  "type": "UInt"
                },
                {
                  "name": "CostParameter",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*AffineParameterSizeDiv32",
                  "shortName": "",
                  "type": "UInt"
                }
              ]
            },
            {
              "reference": "M. Courbariaux, Y. Bengio, and J.-P. David. BinaryConnect: Training Deep Neural Networks with binary weights during propagations. https://arxiv.org/abs/1511.00363",
              "color": "0x6aa1bd",
              "inputSideConnector": [
                {
                  "color": "0xa8a800",
                  "kind": "Parameter",
                  "enable": true,
                  "shape": "*ConvolutionWeightShape",
                  "name": "W"
                },
                {
                  "kind": "Parameter",
                  "enable": true,
                  "name": "Wb",
                  "color": "0xa8a800",
                  "shortName": "Wb",
                  "shape": "*ConvolutionWeightShape"
                },
                {
                  "color": "0xa8a800",
                  "kind": "Parameter",
                  "enable": "*WithBias",
                  "shape": "*OutMaps",
                  "name": "b"
                }
              ],
              "input": 1,
              "layout": null,
              "name": "BinaryConnectConvolution",
              "outputSideConnector": [],
              "parameterScope": "bicon_conv",
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "BinaryConnectConvolution",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "OutMaps",
                  "argumentName": "outmaps",
                  "required": true,
                  "editable": true,
                  "searchParameter": true,
                  "value": "16",
                  "shortName": "Maps",
                  "type": "PInt"
                },
                {
                  "name": "KernelShape",
                  "argumentName": "kernel",
                  "required": true,
                  "editable": true,
                  "searchParameter": true,
                  "important": true,
                  "value": "5,5",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "WithBias",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": true,
                  "shortName": "",
                  "type": "Boolean"
                },
                {
                  "name": "BorderMode",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "valid",
                  "shortName": "",
                  "type": "Option",
                  "option": [
                    "valid",
                    "full",
                    "same"
                  ]
                },
                {
                  "name": "Padding",
                  "argumentName": "binary_connect_convolution_param.pad",
                  "required": true,
                  "editable": true,
                  "value": "*ConvolutionPaddingSize",
                  "shortName": "",
                  "type": "UIntArray"
                },
                {
                  "name": "Strides",
                  "argumentName": "binary_connect_convolution_param.stride",
                  "required": true,
                  "editable": true,
                  "value": "1,1",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Dilation",
                  "argumentName": "binary_connect_convolution_param.dilation",
                  "required": true,
                  "editable": true,
                  "value": "1,1",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Group",
                  "argumentName": "binary_connect_convolution_param.group",
                  "required": true,
                  "editable": false,
                  "value": "1",
                  "shortName": "",
                  "type": "PInt"
                },
                {
                  "name": "BaseAxis",
                  "argumentName": "binary_connect_convolution_param.base_axis -a",
                  "required": true,
                  "editable": false,
                  "value": "0",
                  "shortName": "",
                  "type": "UInt"
                },
                {
                  "name": "ParameterScope",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "*Name",
                  "shortName": "",
                  "type": "Text"
                },
                {
                  "name": "W.File",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "",
                  "shortName": "",
                  "type": "File"
                },
                {
                  "name": "W.Initializer",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "UniformConvolutionGlorot",
                  "shortName": "",
                  "type": "Option",
                  "option": [
                    "Normal",
                    "NormalConvolutionHeForward",
                    "NormalConvolutionHeBackward",
                    "NormalConvolutionGlorot",
                    "NormalCLConvHeForward",
                    "NormalCLConvHeBackward",
                    "NormalCLConvGlorot",
                    "Uniform",
                    "UniformConvolutionGlorot",
                    "UniformCLConvGlorot",
                    "Constant"
                  ]
                },
                {
                  "name": "W.InitializerMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "W.LRateMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Wb.File",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "",
                  "shortName": "",
                  "type": "File"
                },
                {
                  "name": "Wb.Initializer",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "Constant",
                  "shortName": "",
                  "type": "Option",
                  "option": [
                    "Normal",
                    "NormalConvolutionHeForward",
                    "NormalConvolutionHeBackward",
                    "NormalConvolutionGlorot",
                    "Uniform",
                    "UniformConvolutionGlorot",
                    "Constant"
                  ]
                },
                {
                  "name": "Wb.InitializerMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "0.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Wb.LRateMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "0.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "b.File",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "",
                  "shortName": "",
                  "type": "File"
                },
                {
                  "name": "b.Initializer",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "Constant",
                  "shortName": "",
                  "type": "Option",
                  "option": [
                    "Normal",
                    "Uniform",
                    "Constant"
                  ]
                },
                {
                  "name": "b.InitializerMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "0.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "b.LRateMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*ConvolutionOutputSize",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostParameter",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*ConvolutionParameterSizeDiv32",
                  "shortName": "",
                  "type": "UInt"
                },
                {
                  "name": "CostAdd",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*ConvolutionMultiplyAddSize",
                  "shortName": "",
                  "type": "UInt"
                }
              ]
            },
            {
              "reference": "Rastegari, Mohammad, et al. XNOR-Net: ImageNet Classification Using Binary Convolutional Neural Networks. https://arxiv.org/abs/1603.05279",
              "color": "0x6aa1bd",
              "inputSideConnector": [
                {
                  "color": "0xa8a800",
                  "kind": "Parameter",
                  "enable": true,
                  "shape": "*AffineWeightShape",
                  "name": "W"
                },
                {
                  "kind": "Parameter",
                  "enable": true,
                  "name": "Wb",
                  "color": "0xa8a800",
                  "shortName": "Wb",
                  "shape": "*AffineWeightShape"
                },
                {
                  "color": "0xa8a800",
                  "kind": "Parameter",
                  "enable": "*WithBias",
                  "shape": "*OutShape",
                  "name": "b"
                }
              ],
              "input": 1,
              "layout": null,
              "name": "BinaryWeightAffine",
              "outputSideConnector": [],
              "parameterScope": "bwn_affine",
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "BinaryWeightAffine",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "OutShape",
                  "argumentName": "outshape",
                  "required": true,
                  "editable": true,
                  "searchParameter": true,
                  "value": "100",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "WithBias",
                  "argumentName": "with_bias",
                  "required": true,
                  "editable": true,
                  "value": true,
                  "shortName": "",
                  "type": "Boolean"
                },
                {
                  "name": "BaseAxis",
                  "argumentName": "binary_weight_affine_param.base_axis -a",
                  "required": true,
                  "editable": false,
                  "value": "0",
                  "shortName": "",
                  "type": "UInt"
                },
                {
                  "name": "ParameterScope",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "*Name",
                  "shortName": "",
                  "type": "Text"
                },
                {
                  "name": "W.File",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "",
                  "shortName": "",
                  "type": "File"
                },
                {
                  "name": "W.Initializer",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "UniformAffineGlorot",
                  "shortName": "",
                  "type": "Option",
                  "option": [
                    "Normal",
                    "NormalAffineHeForward",
                    "NormalAffineHeBackward",
                    "NormalAffineGlorot",
                    "Uniform",
                    "UniformAffineGlorot",
                    "Constant"
                  ]
                },
                {
                  "name": "W.InitializerMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "W.LRateMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Wb.File",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "",
                  "shortName": "",
                  "type": "File"
                },
                {
                  "name": "Wb.Initializer",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "Constant",
                  "shortName": "",
                  "type": "Option",
                  "option": [
                    "Normal",
                    "NormalAffineHeForward",
                    "NormalAffineHeBackward",
                    "NormalAffineGlorot",
                    "Uniform",
                    "UniformAffineGlorot",
                    "Constant"
                  ]
                },
                {
                  "name": "Wb.InitializerMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "0.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Wb.LRateMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "0.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "b.File",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "",
                  "shortName": "",
                  "type": "File"
                },
                {
                  "name": "b.Initializer",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "Constant",
                  "shortName": "",
                  "type": "Option",
                  "option": [
                    "Normal",
                    "Uniform",
                    "Constant"
                  ]
                },
                {
                  "name": "b.InitializerMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "0.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "b.LRateMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*OutShape",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostAdd",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input:**OutShape",
                  "shortName": "",
                  "type": "UInt"
                },
                {
                  "name": "CostParameter",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*AffineParameterSizeDiv32",
                  "shortName": "",
                  "type": "UInt"
                }
              ]
            },
            {
              "reference": "Rastegari, Mohammad, et al. XNOR-Net: ImageNet Classification Using Binary Convolutional Neural Networks. https://arxiv.org/abs/1603.05279",
              "color": "0x6aa1bd",
              "inputSideConnector": [
                {
                  "color": "0xa8a800",
                  "kind": "Parameter",
                  "enable": true,
                  "shape": "*ConvolutionWeightShape",
                  "name": "W"
                },
                {
                  "kind": "Parameter",
                  "enable": true,
                  "name": "Wb",
                  "color": "0xa8a800",
                  "shortName": "Wb",
                  "shape": "*ConvolutionWeightShape"
                },
                {
                  "color": "0xa8a800",
                  "kind": "Parameter",
                  "enable": "*WithBias",
                  "shape": "*OutMaps",
                  "name": "b"
                }
              ],
              "input": 1,
              "layout": null,
              "name": "BinaryWeightConvolution",
              "outputSideConnector": [],
              "parameterScope": "bwn_conv",
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "BinaryWeightConvolution",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "OutMaps",
                  "argumentName": "outmaps",
                  "required": true,
                  "editable": true,
                  "searchParameter": true,
                  "value": "16",
                  "shortName": "Maps",
                  "type": "PInt"
                },
                {
                  "name": "KernelShape",
                  "argumentName": "kernel",
                  "required": true,
                  "editable": true,
                  "searchParameter": true,
                  "important": true,
                  "value": "5,5",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "WithBias",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": true,
                  "shortName": "",
                  "type": "Boolean"
                },
                {
                  "name": "BorderMode",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "valid",
                  "shortName": "",
                  "type": "Option",
                  "option": [
                    "valid",
                    "full",
                    "same"
                  ]
                },
                {
                  "name": "Padding",
                  "argumentName": "binary_weight_convolution_param.pad",
                  "required": true,
                  "editable": true,
                  "value": "*ConvolutionPaddingSize",
                  "shortName": "",
                  "type": "UIntArray"
                },
                {
                  "name": "Strides",
                  "argumentName": "binary_weight_convolution_param.stride",
                  "required": true,
                  "editable": true,
                  "value": "1,1",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Dilation",
                  "argumentName": "binary_weight_convolution_param.dilation",
                  "required": true,
                  "editable": true,
                  "value": "1,1",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Group",
                  "argumentName": "binary_weight_convolution_param.group",
                  "required": true,
                  "editable": false,
                  "value": "1",
                  "shortName": "",
                  "type": "PInt"
                },
                {
                  "name": "BaseAxis",
                  "argumentName": "binary_weight_convolution_param.base_axis -a",
                  "required": true,
                  "editable": false,
                  "value": "0",
                  "shortName": "",
                  "type": "UInt"
                },
                {
                  "name": "ParameterScope",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "*Name",
                  "shortName": "",
                  "type": "Text"
                },
                {
                  "name": "W.File",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "",
                  "shortName": "",
                  "type": "File"
                },
                {
                  "name": "W.Initializer",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "UniformConvolutionGlorot",
                  "shortName": "",
                  "type": "Option",
                  "option": [
                    "Normal",
                    "NormalConvolutionHeForward",
                    "NormalConvolutionHeBackward",
                    "NormalConvolutionGlorot",
                    "NormalCLConvHeForward",
                    "NormalCLConvHeBackward",
                    "NormalCLConvGlorot",
                    "Uniform",
                    "UniformConvolutionGlorot",
                    "UniformCLConvGlorot",
                    "Constant"
                  ]
                },
                {
                  "name": "W.InitializerMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "W.LRateMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Wb.File",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "",
                  "shortName": "",
                  "type": "File"
                },
                {
                  "name": "Wb.Initializer",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "Constant",
                  "shortName": "",
                  "type": "Option",
                  "option": [
                    "Normal",
                    "NormalConvolutionHeForward",
                    "NormalConvolutionHeBackward",
                    "NormalConvolutionGlorot",
                    "Uniform",
                    "UniformConvolutionGlorot",
                    "Constant"
                  ]
                },
                {
                  "name": "Wb.InitializerMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "0.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Wb.LRateMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "0.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "b.File",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "",
                  "shortName": "",
                  "type": "File"
                },
                {
                  "name": "b.Initializer",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "Constant",
                  "shortName": "",
                  "type": "Option",
                  "option": [
                    "Normal",
                    "Uniform",
                    "Constant"
                  ]
                },
                {
                  "name": "b.InitializerMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "0.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "b.LRateMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*ConvolutionOutputSize",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostParameter",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*ConvolutionParameterSizeDiv32",
                  "shortName": "",
                  "type": "UInt"
                },
                {
                  "name": "CostAdd",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*ConvolutionMultiplyAddSize",
                  "shortName": "",
                  "type": "UInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xd77b6a",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "BinaryTanh",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "BinaryTanh",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostAdd",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input:*2",
                  "shortName": "",
                  "type": "PInt"
                },
                {
                  "name": "CostMultiply",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input:*2",
                  "shortName": "",
                  "type": "PInt"
                },
                {
                  "name": "CostIf",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xd77b6a",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "BinarySigmoid",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "BinarySigmoid",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostAdd",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                },
                {
                  "name": "CostMultiply",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                },
                {
                  "name": "CostIf",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0x262626",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "Unit",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "Unit",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Network",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "",
                  "important": true,
                  "shortName": "Net",
                  "type": "Text"
                },
                {
                  "name": "ParameterScope",
                  "argumentName": "",
                  "required": false,
                  "editable": true,
                  "value": "*Name",
                  "shortName": "",
                  "type": "Text"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*UnitOutput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostParameter",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "0",
                  "shortName": "",
                  "type": "UInt"
                },
                {
                  "name": "CostAdd",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "0",
                  "shortName": "",
                  "type": "UInt"
                },
                {
                  "name": "CostMultiply",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "0",
                  "shortName": "",
                  "type": "UInt"
                },
                {
                  "name": "CostMultiplyAdd",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "0",
                  "shortName": "",
                  "type": "UInt"
                },
                {
                  "name": "CostDivision",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "0",
                  "shortName": "",
                  "type": "UInt"
                },
                {
                  "name": "CostExp",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "0",
                  "shortName": "",
                  "type": "UInt"
                },
                {
                  "name": "CostIf",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "0",
                  "shortName": "",
                  "type": "UInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xb2b2b2",
              "inputSideConnector": [],
              "input": 0,
              "layout": null,
              "name": "Argument",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": 0,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "Argument",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Value",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "1",
                  "important": true,
                  "shortName": "",
                  "type": "Text"
                },
                {
                  "name": "Type",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "Text",
                  "shortName": "",
                  "type": "Option",
                  "option": [
                    "Boolean",
                    "BooleanOrMacro",
                    "Int",
                    "IntArray",
                    "PInt",
                    "PIntArray",
                    "PIntArrays",
                    "UInt",
                    "UIntArray",
                    "Float",
                    "FloatArray",
                    "FloatArrays",
                    "Text",
                    "File"
                  ]
                },
                {
                  "name": "Search",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": false,
                  "shortName": "",
                  "type": "Boolean"
                }
              ]
            },
            {
              "reference": null,
              "color": "0x6aa1bd",
              "inputSideConnector": [
                {
                  "color": "0x00a0b0",
                  "kind": "Data",
                  "enable": true,
                  "shape": "*Size",
                  "name": "H.Initial"
                },
                {
                  "color": "0x00a0b0",
                  "kind": "Data",
                  "enable": true,
                  "shape": "*Size",
                  "name": "C.Initial"
                },
                {
                  "kind": "Parameter",
                  "enable": true,
                  "name": "Affine.W",
                  "color": "0xa8a800",
                  "parameterScope": "Affine/affine/W",
                  "shape": "*LSTMWeightShape",
                  "shortName": "AW"
                },
                {
                  "kind": "Parameter",
                  "enable": true,
                  "name": "Affine.b",
                  "color": "0xa8a800",
                  "parameterScope": "Affine/affine/b",
                  "shape": "*Size",
                  "shortName": "Ab"
                },
                {
                  "kind": "Parameter",
                  "enable": true,
                  "name": "IGate.W",
                  "color": "0xa8a800",
                  "parameterScope": "IGate/affine/W",
                  "shape": "*LSTMWeightShape",
                  "shortName": "IW"
                },
                {
                  "kind": "Parameter",
                  "enable": true,
                  "name": "IGate.b",
                  "color": "0xa8a800",
                  "parameterScope": "IGate/affine/b",
                  "shape": "*Size",
                  "shortName": "Ib"
                },
                {
                  "kind": "Parameter",
                  "enable": true,
                  "name": "FGate.W",
                  "color": "0xa8a800",
                  "parameterScope": "FGate/affine/W",
                  "shape": "*LSTMWeightShape",
                  "shortName": "FW"
                },
                {
                  "kind": "Parameter",
                  "enable": true,
                  "name": "FGate.b",
                  "color": "0xa8a800",
                  "parameterScope": "FGate/affine/b",
                  "shape": "*Size",
                  "shortName": "Fb"
                },
                {
                  "kind": "Parameter",
                  "enable": true,
                  "name": "OGate.W",
                  "color": "0xa8a800",
                  "parameterScope": "OGate/affine/W",
                  "shape": "*LSTMWeightShape",
                  "shortName": "OW"
                },
                {
                  "kind": "Parameter",
                  "enable": true,
                  "name": "OGate.b",
                  "color": "0xa8a800",
                  "parameterScope": "OGate/affine/b",
                  "shape": "*Size",
                  "shortName": "Ob"
                }
              ],
              "input": 1,
              "layout": null,
              "name": "LSTM",
              "outputSideConnector": [],
              "parameterScope": "lstm",
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "LSTM",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Size",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "100",
                  "important": true,
                  "shortName": "",
                  "type": "UIntArray"
                },
                {
                  "name": "Axis",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "0",
                  "shortName": "",
                  "type": "UInt"
                },
                {
                  "name": "RecurrentGroupID",
                  "argumentName": "recurrent_param.repeat_id",
                  "required": true,
                  "editable": true,
                  "value": "*Name",
                  "important": true,
                  "shortName": "RGID",
                  "type": "Text"
                },
                {
                  "name": "InnerShape",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*ShapeExceptAxis",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Length",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*AxisSize",
                  "shortName": "",
                  "type": "PInt"
                },
                {
                  "name": "ParameterScope",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "*Name",
                  "shortName": "",
                  "type": "Text"
                },
                {
                  "name": "H.Initial.Dataset",
                  "argumentName": "",
                  "required": false,
                  "editable": true,
                  "value": "h",
                  "shortName": "",
                  "type": "Dataset"
                },
                {
                  "name": "H.Initial.Generator",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "Constant",
                  "shortName": "",
                  "type": "Option",
                  "option": [
                    "None",
                    "Normal",
                    "Uniform",
                    "Constant"
                  ]
                },
                {
                  "name": "H.Initial.GeneratorMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "0.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "C.Initial.Dataset",
                  "argumentName": "",
                  "required": false,
                  "editable": true,
                  "value": "c",
                  "shortName": "",
                  "type": "Dataset"
                },
                {
                  "name": "C.Initial.Generator",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "Constant",
                  "shortName": "",
                  "type": "Option",
                  "option": [
                    "None",
                    "Normal",
                    "Uniform",
                    "Constant"
                  ]
                },
                {
                  "name": "C.Initial.GeneratorMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "0.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Affine.W.File",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "",
                  "shortName": "",
                  "type": "File"
                },
                {
                  "name": "Affine.W.Initializer",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "NormalAffineGlorot",
                  "shortName": "",
                  "type": "Option",
                  "option": [
                    "Normal",
                    "NormalAffineHeForward",
                    "NormalAffineHeBackward",
                    "NormalAffineGlorot",
                    "Uniform",
                    "UniformAffineGlorot",
                    "Constant"
                  ]
                },
                {
                  "name": "Affine.W.InitializerMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Affine.W.LRateMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Affine.b.File",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "",
                  "shortName": "",
                  "type": "File"
                },
                {
                  "name": "Affine.b.Initializer",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "Constant",
                  "shortName": "",
                  "type": "Option",
                  "option": [
                    "Normal",
                    "Uniform",
                    "Constant"
                  ]
                },
                {
                  "name": "Affine.b.InitializerMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "0.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Affine.b.LRateMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "IGate.W.File",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "",
                  "shortName": "",
                  "type": "File"
                },
                {
                  "name": "IGate.W.Initializer",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "NormalAffineGlorot",
                  "shortName": "",
                  "type": "Option",
                  "option": [
                    "Normal",
                    "NormalAffineHeForward",
                    "NormalAffineHeBackward",
                    "NormalAffineGlorot",
                    "Uniform",
                    "UniformAffineGlorot",
                    "Constant"
                  ]
                },
                {
                  "name": "IGate.W.InitializerMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "IGate.W.LRateMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "IGate.b.File",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "",
                  "shortName": "",
                  "type": "File"
                },
                {
                  "name": "IGate.b.Initializer",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "Constant",
                  "shortName": "",
                  "type": "Option",
                  "option": [
                    "Normal",
                    "Uniform",
                    "Constant"
                  ]
                },
                {
                  "name": "IGate.b.InitializerMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "0.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "IGate.b.LRateMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "FGate.W.File",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "",
                  "shortName": "",
                  "type": "File"
                },
                {
                  "name": "FGate.W.Initializer",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "NormalAffineGlorot",
                  "shortName": "",
                  "type": "Option",
                  "option": [
                    "Normal",
                    "NormalAffineHeForward",
                    "NormalAffineHeBackward",
                    "NormalAffineGlorot",
                    "Uniform",
                    "UniformAffineGlorot",
                    "Constant"
                  ]
                },
                {
                  "name": "FGate.W.InitializerMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "FGate.W.LRateMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "FGate.b.File",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "",
                  "shortName": "",
                  "type": "File"
                },
                {
                  "name": "FGate.b.Initializer",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "Constant",
                  "shortName": "",
                  "type": "Option",
                  "option": [
                    "Normal",
                    "Uniform",
                    "Constant"
                  ]
                },
                {
                  "name": "FGate.b.InitializerMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "0.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "FGate.b.LRateMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "OGate.W.File",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "",
                  "shortName": "",
                  "type": "File"
                },
                {
                  "name": "OGate.W.Initializer",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "NormalAffineGlorot",
                  "shortName": "",
                  "type": "Option",
                  "option": [
                    "Normal",
                    "NormalAffineHeForward",
                    "NormalAffineHeBackward",
                    "NormalAffineGlorot",
                    "Uniform",
                    "UniformAffineGlorot",
                    "Constant"
                  ]
                },
                {
                  "name": "OGate.W.InitializerMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "OGate.W.LRateMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "OGate.b.File",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "",
                  "shortName": "",
                  "type": "File"
                },
                {
                  "name": "OGate.b.Initializer",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "Constant",
                  "shortName": "",
                  "type": "Option",
                  "option": [
                    "Normal",
                    "Uniform",
                    "Constant"
                  ]
                },
                {
                  "name": "OGate.b.InitializerMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "0.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "OGate.b.LRateMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*RecurrentOutputSize2",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostParameter",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*SumParameterSize",
                  "shortName": "",
                  "type": "PInt"
                },
                {
                  "name": "CostAdd",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Size:**Length:*4",
                  "shortName": "",
                  "type": "PInt"
                },
                {
                  "name": "CostMultiplyAdd",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*InnerShape:+*Size:**Size:**Length:*4",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xb2b2b2",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "FFT",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "FFT",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "SignalNDim",
                  "argumentName": "fft_param.signal_ndim",
                  "required": true,
                  "editable": true,
                  "value": "2",
                  "shortName": "",
                  "type": "PInt"
                },
                {
                  "name": "Normalized",
                  "argumentName": "fft_param.normalized",
                  "required": true,
                  "editable": true,
                  "value": false,
                  "shortName": "",
                  "type": "Boolean"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostMultiply",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Calc +*Input:**Normalized",
                  "shortName": "",
                  "type": "UInt"
                },
                {
                  "name": "CostMultiplyAdd",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*FFTMultiplyAddSize",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xb2b2b2",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "IFFT",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "IFFT",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "SignalNDim",
                  "argumentName": "ifft_param.signal_ndim",
                  "required": true,
                  "editable": true,
                  "value": "2",
                  "shortName": "",
                  "type": "PInt"
                },
                {
                  "name": "Normalized",
                  "argumentName": "ifft_param.normalized",
                  "required": true,
                  "editable": true,
                  "value": false,
                  "shortName": "",
                  "type": "Boolean"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostMultiply",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Calc +*Input:**Normalized",
                  "shortName": "",
                  "type": "UInt"
                },
                {
                  "name": "CostMultiplyAdd",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*FFTMultiplyAddSize",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xb2b2b2",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "Sum",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "Sum",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Axes",
                  "argumentName": "sum_param.axes -a",
                  "required": true,
                  "editable": true,
                  "value": "0",
                  "shortName": "",
                  "type": "UIntArray"
                },
                {
                  "name": "KeepDims",
                  "argumentName": "sum_param.keep_dims",
                  "required": true,
                  "editable": true,
                  "value": false,
                  "shortName": "",
                  "type": "Boolean"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*SumOutputSize",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostAdd",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xb2b2b2",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "Mean",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "Mean",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Axes",
                  "argumentName": "mean_param.axes -a",
                  "required": true,
                  "editable": true,
                  "value": "0",
                  "shortName": "",
                  "type": "UIntArray"
                },
                {
                  "name": "KeepDims",
                  "argumentName": "mean_param.keep_dims",
                  "required": true,
                  "editable": true,
                  "value": false,
                  "shortName": "",
                  "type": "Boolean"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*SumOutputSize",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostAdd",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xb2b2b2",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "Prod",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "Prod",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Axes",
                  "argumentName": "prod_param.axes -a",
                  "required": true,
                  "editable": true,
                  "value": "0",
                  "shortName": "",
                  "type": "UIntArray"
                },
                {
                  "name": "KeepDims",
                  "argumentName": "prod_param.keep_dims",
                  "required": true,
                  "editable": true,
                  "value": false,
                  "shortName": "",
                  "type": "Boolean"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*SumOutputSize",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostMultiply",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xb2b2b2",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "Max",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "Max",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Axes",
                  "argumentName": "max_param.axes -a",
                  "required": true,
                  "editable": true,
                  "value": "0",
                  "shortName": "",
                  "type": "UIntArray"
                },
                {
                  "name": "KeepDims",
                  "argumentName": "max_param.keep_dims",
                  "required": true,
                  "editable": true,
                  "value": false,
                  "shortName": "",
                  "type": "Boolean"
                },
                {
                  "name": "WithIndex",
                  "argumentName": "max_param.with_index",
                  "required": true,
                  "editable": false,
                  "value": false,
                  "shortName": "",
                  "type": "Boolean"
                },
                {
                  "name": "OnlyIndex",
                  "argumentName": "max_param.only_index",
                  "required": true,
                  "editable": true,
                  "value": false,
                  "shortName": "",
                  "type": "Boolean"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*SumOutputSize",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostIf",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xb2b2b2",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "Min",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "Min",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Axes",
                  "argumentName": "min_param.axes -a",
                  "required": true,
                  "editable": true,
                  "value": "0",
                  "shortName": "",
                  "type": "UIntArray"
                },
                {
                  "name": "KeepDims",
                  "argumentName": "min_param.keep_dims",
                  "required": true,
                  "editable": true,
                  "value": false,
                  "shortName": "",
                  "type": "Boolean"
                },
                {
                  "name": "WithIndex",
                  "argumentName": "min_param.with_index",
                  "required": true,
                  "editable": false,
                  "value": false,
                  "shortName": "",
                  "type": "Boolean"
                },
                {
                  "name": "OnlyIndex",
                  "argumentName": "min_param.only_index",
                  "required": true,
                  "editable": true,
                  "value": false,
                  "shortName": "",
                  "type": "Boolean"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*SumOutputSize",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostIf",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xb2b2b2",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "Log",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "Log",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphIO",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostExp",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xb2b2b2",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "Exp",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "Exp",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphIO",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostExp",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xb2b2b2",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "Sign",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "Sign",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphIO",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Alpha",
                  "argumentName": "sign_param.alpha",
                  "required": true,
                  "editable": true,
                  "value": "0.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostIf",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xb2b2b2",
              "inputSideConnector": [
                {
                  "color": "0x00a0b0",
                  "kind": "Data",
                  "enable": true,
                  "shape": "*Input",
                  "name": "R"
                }
              ],
              "input": 1,
              "layout": null,
              "name": "BatchMatmul",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "BatchMatmul",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Inputs",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInputs",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*MatmulOutputSize",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostMultiplyAdd",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*MatmulMultiplyAddSize",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xb2b2b2",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "BatchInv",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "BatchInv",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostAdd",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "Input[1]*(Input[1]-1)*(Input[1]-1)",
                  "shortName": "",
                  "type": "PInt"
                },
                {
                  "name": "CostMultiplyAdd",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "Input[1]*Input[1]*Input[1]",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xb2b2b2",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "Round",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "Round",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphIO",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xb2b2b2",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "Ceil",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "Ceil",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphIO",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xb2b2b2",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "Floor",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "Floor",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphIO",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xb2b2b2",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "Sin",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "Sin",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphIO",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xb2b2b2",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "Cos",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "Cos",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphIO",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xb2b2b2",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "Tan",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "Tan",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphIO",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xb2b2b2",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "Sinh",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "Sinh",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphIO",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xb2b2b2",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "Cosh",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "Cosh",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphIO",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xb2b2b2",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "ASin",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "ASin",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphIO",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xb2b2b2",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "ACos",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "ACos",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphIO",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xb2b2b2",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "ATan",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "ATan",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphIO",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xb2b2b2",
              "inputSideConnector": [
                {
                  "color": "0x00a0b0",
                  "kind": "Data",
                  "enable": true,
                  "shape": "*Input",
                  "name": "x"
                }
              ],
              "input": 1,
              "layout": null,
              "name": "ATan2",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "ATan2",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "x.Dataset",
                  "argumentName": "",
                  "required": false,
                  "editable": true,
                  "value": "",
                  "important": true,
                  "shortName": "",
                  "type": "Dataset"
                },
                {
                  "name": "x.Generator",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "Constant",
                  "shortName": "",
                  "type": "Option",
                  "option": [
                    "None",
                    "Normal",
                    "Uniform",
                    "Constant"
                  ]
                },
                {
                  "name": "x.GeneratorMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xb2b2b2",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "ASinh",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "ASinh",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphIO",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xb2b2b2",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "ACosh",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "ACosh",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphIO",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xb2b2b2",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "ATanh",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "ATanh",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphIO",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                }
              ]
            },
            {
              "reference": null,
              "color": "0x848484",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "AddScalar",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "AddScalar",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphIO",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Value",
                  "argumentName": "add_scalar_param.val",
                  "required": true,
                  "editable": true,
                  "value": "0.0",
                  "important": true,
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostAdd",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0x848484",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "MulScalar",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "MulScalar",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphIO",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Value",
                  "argumentName": "mul_scalar_param.val",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "important": true,
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostMultiply",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0x848484",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "RSubScalar",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "RSubScalar",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphIO",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Value",
                  "argumentName": "r_sub_scalar_param.val",
                  "required": true,
                  "editable": true,
                  "value": "0.0",
                  "important": true,
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostAdd",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0x848484",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "RDivScalar",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "RDivScalar",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphIO",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Value",
                  "argumentName": "r_div_scalar_param.val",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "important": true,
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostDivision",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0x848484",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "PowScalar",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "PowScalar",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphIO",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Value",
                  "argumentName": "pow_scalar_param.val",
                  "required": true,
                  "editable": true,
                  "value": "2.0",
                  "important": true,
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostMultiply",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                },
                {
                  "name": "CostExp",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input:+*Input",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0x848484",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "RPowScalar",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "RPowScalar",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphIO",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Value",
                  "argumentName": "r_pow_scalar_param.val",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "important": true,
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostMultiply",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                },
                {
                  "name": "CostExp",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input:+*Input",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0x848484",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "MaximumScalar",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "MaximumScalar",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphIO",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Value",
                  "argumentName": "maximum_scalar_param.val",
                  "required": true,
                  "editable": true,
                  "value": "0.0",
                  "important": true,
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostIf",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0x848484",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "MinimumScalar",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "MinimumScalar",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphIO",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Value",
                  "argumentName": "minimum_scalar_param.val",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "important": true,
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostIf",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0x848484",
              "inputSideConnector": [],
              "input": -1,
              "layout": null,
              "name": "Add2",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "Add2",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Inputs",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInputs",
                  "shortName": "",
                  "type": "PIntArrays"
                },
                {
                  "name": "InPlace",
                  "argumentName": "add2_param.inplace",
                  "required": true,
                  "editable": true,
                  "value": "*AutoInPlace",
                  "shortName": "",
                  "type": "BooleanOrMacro"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*BasicMathOutputSizewBC",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostAdd",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Output",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0x848484",
              "inputSideConnector": [
                {
                  "color": "0x00a0b0",
                  "kind": "Data",
                  "enable": true,
                  "shape": "*Input",
                  "name": "R"
                }
              ],
              "input": 1,
              "layout": null,
              "name": "Sub2",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "Sub2",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "R.Dataset",
                  "argumentName": "",
                  "required": false,
                  "editable": true,
                  "value": "",
                  "important": true,
                  "shortName": "",
                  "type": "Dataset"
                },
                {
                  "name": "R.Generator",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "Constant",
                  "shortName": "",
                  "type": "Option",
                  "option": [
                    "None",
                    "Normal",
                    "Uniform",
                    "Constant"
                  ]
                },
                {
                  "name": "R.GeneratorMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostAdd",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Output",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0x848484",
              "inputSideConnector": [],
              "input": -1,
              "layout": null,
              "name": "Mul2",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "Mul2",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Inputs",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInputs",
                  "shortName": "",
                  "type": "PIntArrays"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*BasicMathOutputSizewBC",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostMultiply",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Output",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0x848484",
              "inputSideConnector": [
                {
                  "color": "0x00a0b0",
                  "kind": "Data",
                  "enable": true,
                  "shape": "*Input",
                  "name": "R"
                }
              ],
              "input": 1,
              "layout": null,
              "name": "Div2",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "Div2",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "R.Dataset",
                  "argumentName": "",
                  "required": false,
                  "editable": true,
                  "value": "",
                  "important": true,
                  "shortName": "",
                  "type": "Dataset"
                },
                {
                  "name": "R.Generator",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "Constant",
                  "shortName": "",
                  "type": "Option",
                  "option": [
                    "None",
                    "Normal",
                    "Uniform",
                    "Constant"
                  ]
                },
                {
                  "name": "R.GeneratorMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostDivision",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Output",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0x848484",
              "inputSideConnector": [
                {
                  "color": "0x00a0b0",
                  "kind": "Data",
                  "enable": true,
                  "shape": "*Input",
                  "name": "R"
                }
              ],
              "input": 1,
              "layout": null,
              "name": "Pow2",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "Pow2",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "R.Dataset",
                  "argumentName": "",
                  "required": false,
                  "editable": true,
                  "value": "",
                  "important": true,
                  "shortName": "",
                  "type": "Dataset"
                },
                {
                  "name": "R.Generator",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "Constant",
                  "shortName": "",
                  "type": "Option",
                  "option": [
                    "None",
                    "Normal",
                    "Uniform",
                    "Constant"
                  ]
                },
                {
                  "name": "R.GeneratorMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostMultiply",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Output",
                  "shortName": "",
                  "type": "PInt"
                },
                {
                  "name": "CostExp",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Output:+*Output",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0x848484",
              "inputSideConnector": [],
              "input": -1,
              "layout": null,
              "name": "Maximum2",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "Maximum2",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Inputs",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInputs",
                  "shortName": "",
                  "type": "PIntArrays"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*BasicMathOutputSizewBC",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostIf",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Output",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0x848484",
              "inputSideConnector": [],
              "input": -1,
              "layout": null,
              "name": "Minimum2",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "Minimum2",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Inputs",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInputs",
                  "shortName": "",
                  "type": "PIntArrays"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*BasicMathOutputSizewBC",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostIf",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Output",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0x848484",
              "inputSideConnector": [],
              "input": -1,
              "layout": null,
              "name": "AddN",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "AddN",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Inputs",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInputs",
                  "shortName": "",
                  "type": "PIntArrays"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*BasicMathOutputSizewBC",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostAdd",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Output",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0x848484",
              "inputSideConnector": [],
              "input": -1,
              "layout": null,
              "name": "MulN",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "MulN",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Inputs",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInputs",
                  "shortName": "",
                  "type": "PIntArrays"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*BasicMathOutputSizewBC",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostMultiply",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Output",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0x848484",
              "inputSideConnector": [],
              "input": -1,
              "layout": null,
              "name": "LogicalAnd",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "LogicalAnd",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Inputs",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInputs",
                  "shortName": "",
                  "type": "PIntArrays"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*BasicMathOutputSizewBC",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostIf",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Output",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0x848484",
              "inputSideConnector": [],
              "input": -1,
              "layout": null,
              "name": "LogicalOr",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "LogicalOr",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Inputs",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInputs",
                  "shortName": "",
                  "type": "PIntArrays"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*BasicMathOutputSizewBC",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostIf",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Output",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0x848484",
              "inputSideConnector": [],
              "input": -1,
              "layout": null,
              "name": "LogicalXor",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "LogicalXor",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Inputs",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInputs",
                  "shortName": "",
                  "type": "PIntArrays"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*BasicMathOutputSizewBC",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostIf",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Output",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0x848484",
              "inputSideConnector": [],
              "input": -1,
              "layout": null,
              "name": "Equal",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "Equal",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Inputs",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInputs",
                  "shortName": "",
                  "type": "PIntArrays"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*BasicMathOutputSizewBC",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostIf",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Output",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0x848484",
              "inputSideConnector": [],
              "input": -1,
              "layout": null,
              "name": "NotEqual",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "NotEqual",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Inputs",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInputs",
                  "shortName": "",
                  "type": "PIntArrays"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*BasicMathOutputSizewBC",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostIf",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Output",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0x848484",
              "inputSideConnector": [
                {
                  "color": "0x00a0b0",
                  "kind": "Data",
                  "enable": true,
                  "shape": "*Input",
                  "name": "R"
                }
              ],
              "input": 1,
              "layout": null,
              "name": "GreaterEqual",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "GreaterEqual",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "R.Dataset",
                  "argumentName": "",
                  "required": false,
                  "editable": true,
                  "value": "",
                  "important": true,
                  "shortName": "",
                  "type": "Dataset"
                },
                {
                  "name": "R.Generator",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "Constant",
                  "shortName": "",
                  "type": "Option",
                  "option": [
                    "None",
                    "Normal",
                    "Uniform",
                    "Constant"
                  ]
                },
                {
                  "name": "R.GeneratorMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostIf",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Output",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0x848484",
              "inputSideConnector": [
                {
                  "color": "0x00a0b0",
                  "kind": "Data",
                  "enable": true,
                  "shape": "*Input",
                  "name": "R"
                }
              ],
              "input": 1,
              "layout": null,
              "name": "Greater",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "Greater",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "R.Dataset",
                  "argumentName": "",
                  "required": false,
                  "editable": true,
                  "value": "",
                  "important": true,
                  "shortName": "",
                  "type": "Dataset"
                },
                {
                  "name": "R.Generator",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "Constant",
                  "shortName": "",
                  "type": "Option",
                  "option": [
                    "None",
                    "Normal",
                    "Uniform",
                    "Constant"
                  ]
                },
                {
                  "name": "R.GeneratorMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostIf",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Output",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0x848484",
              "inputSideConnector": [
                {
                  "color": "0x00a0b0",
                  "kind": "Data",
                  "enable": true,
                  "shape": "*Input",
                  "name": "R"
                }
              ],
              "input": 1,
              "layout": null,
              "name": "LessEqual",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "LessEqual",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "R.Dataset",
                  "argumentName": "",
                  "required": false,
                  "editable": true,
                  "value": "",
                  "important": true,
                  "shortName": "",
                  "type": "Dataset"
                },
                {
                  "name": "R.Generator",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "Constant",
                  "shortName": "",
                  "type": "Option",
                  "option": [
                    "None",
                    "Normal",
                    "Uniform",
                    "Constant"
                  ]
                },
                {
                  "name": "R.GeneratorMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostIf",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Output",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0x848484",
              "inputSideConnector": [
                {
                  "color": "0x00a0b0",
                  "kind": "Data",
                  "enable": true,
                  "shape": "*Input",
                  "name": "R"
                }
              ],
              "input": 1,
              "layout": null,
              "name": "Less",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "Less",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "R.Dataset",
                  "argumentName": "",
                  "required": false,
                  "editable": true,
                  "value": "",
                  "important": true,
                  "shortName": "",
                  "type": "Dataset"
                },
                {
                  "name": "R.Generator",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "Constant",
                  "shortName": "",
                  "type": "Option",
                  "option": [
                    "None",
                    "Normal",
                    "Uniform",
                    "Constant"
                  ]
                },
                {
                  "name": "R.GeneratorMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostIf",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Output",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0x848484",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "LogicalAndScalar",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "LogicalAndScalar",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphIO",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Value",
                  "argumentName": "logical_and_scalar_param.val",
                  "required": true,
                  "editable": true,
                  "value": "0.0",
                  "important": true,
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostIf",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0x848484",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "LogicalOrScalar",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "LogicalOrScalar",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphIO",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Value",
                  "argumentName": "logical_or_scalar_param.val",
                  "required": true,
                  "editable": true,
                  "value": "0.0",
                  "important": true,
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostIf",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0x848484",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "LogicalXorScalar",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "LogicalXorScalar",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphIO",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Value",
                  "argumentName": "logical_xor_scalar_param.val",
                  "required": true,
                  "editable": true,
                  "value": "0.0",
                  "important": true,
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostIf",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0x848484",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "EqualScalar",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "EqualScalar",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphIO",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Value",
                  "argumentName": "equal_scalar_param.val",
                  "required": true,
                  "editable": true,
                  "value": "0.0",
                  "important": true,
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostIf",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0x848484",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "NotEqualScalar",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "NotEqualScalar",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphIO",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Value",
                  "argumentName": "not_equal_scalar_param.val",
                  "required": true,
                  "editable": true,
                  "value": "0.0",
                  "important": true,
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostIf",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0x848484",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "GreaterEqualScalar",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "GreaterEqualScalar",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphIO",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Value",
                  "argumentName": "greater_equal_scalar_param.val",
                  "required": true,
                  "editable": true,
                  "value": "0.0",
                  "important": true,
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostIf",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0x848484",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "GreaterScalar",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "GreaterScalar",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphIO",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Value",
                  "argumentName": "greater_scalar_param.val",
                  "required": true,
                  "editable": true,
                  "value": "0.0",
                  "important": true,
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostIf",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0x848484",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "LessEqualScalar",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "LessEqualScalar",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphIO",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Value",
                  "argumentName": "less_equal_scalar_param.val",
                  "required": true,
                  "editable": true,
                  "value": "0.0",
                  "important": true,
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostIf",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0x848484",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "LessScalar",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "LessScalar",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphIO",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Value",
                  "argumentName": "less_scalar_param.val",
                  "required": true,
                  "editable": true,
                  "value": "0.0",
                  "important": true,
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostIf",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0x848484",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "LogicalNot",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "LogicalNot",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostIf",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0x848484",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "IsNaN",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "IsNaN",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphIO",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostIf",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0x848484",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "IsInf",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "IsInf",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphIO",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostIf",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xb2b2b2",
              "inputSideConnector": [
                {
                  "color": "0x00a0b0",
                  "kind": "Data",
                  "enable": true,
                  "shape": "*Input",
                  "name": "T"
                }
              ],
              "input": 1,
              "layout": null,
              "name": "BinaryError",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "BinaryError",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "T.Dataset",
                  "argumentName": "",
                  "required": false,
                  "editable": true,
                  "value": "y",
                  "important": true,
                  "shortName": "",
                  "type": "Dataset"
                },
                {
                  "name": "T.Generator",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "None",
                  "shortName": "",
                  "type": "Option",
                  "option": [
                    "None",
                    "Normal",
                    "Uniform",
                    "Constant"
                  ]
                },
                {
                  "name": "T.GeneratorMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "IsLossFunction",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": true,
                  "shortName": "",
                  "type": "Boolean"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xb2b2b2",
              "inputSideConnector": [
                {
                  "color": "0x00a0b0",
                  "kind": "Data",
                  "enable": true,
                  "shape": "*SoftmaxLabelShape",
                  "name": "T"
                }
              ],
              "input": 1,
              "layout": null,
              "name": "TopNError",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "TopNError",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Axis",
                  "argumentName": "top_n_error_param.axis -a",
                  "required": true,
                  "editable": true,
                  "value": "0",
                  "shortName": "",
                  "type": "UInt"
                },
                {
                  "name": "N",
                  "argumentName": "top_n_error_param.n",
                  "required": true,
                  "editable": true,
                  "value": "1",
                  "important": true,
                  "shortName": "",
                  "type": "UInt"
                },
                {
                  "name": "T.Dataset",
                  "argumentName": "",
                  "required": false,
                  "editable": true,
                  "value": "y",
                  "important": true,
                  "shortName": "",
                  "type": "Dataset"
                },
                {
                  "name": "T.Generator",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "None",
                  "shortName": "",
                  "type": "Option",
                  "option": [
                    "None",
                    "Normal",
                    "Uniform",
                    "Constant"
                  ]
                },
                {
                  "name": "T.GeneratorMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*CCEOutputSize",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "IsLossFunction",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": true,
                  "shortName": "",
                  "type": "Boolean"
                }
              ]
            },
            {
              "reference": "Ioffe and Szegedy, Batch Normalization: Accelerating Deep Network Training by Reducing Internal Covariate Shift. https://arxiv.org/abs/1502.03167",
              "color": "0xb2b2b2",
              "inputSideConnector": [
                {
                  "color": "0xa8a800",
                  "kind": "Parameter",
                  "enable": true,
                  "shape": "*BatchNormalizationShape",
                  "name": "beta"
                },
                {
                  "color": "0xa8a800",
                  "kind": "Parameter",
                  "enable": true,
                  "shape": "*BatchNormalizationShape",
                  "name": "gamma"
                },
                {
                  "color": "0xa8a800",
                  "kind": "Parameter",
                  "enable": true,
                  "shape": "*BatchNormalizationShape",
                  "name": "mean"
                },
                {
                  "color": "0xa8a800",
                  "kind": "Parameter",
                  "enable": true,
                  "shape": "*BatchNormalizationShape",
                  "name": "var"
                }
              ],
              "input": 1,
              "layout": null,
              "name": "BatchNormalization",
              "outputSideConnector": [],
              "parameterScope": "bn",
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "BatchNormalization",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Axes",
                  "argumentName": "batch_normalization_param.axes -a",
                  "required": true,
                  "editable": true,
                  "value": "0",
                  "shortName": "",
                  "type": "UIntArray"
                },
                {
                  "name": "DecayRate",
                  "argumentName": "batch_normalization_param.decay_rate",
                  "required": true,
                  "editable": true,
                  "value": "0.9",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Epsilon",
                  "argumentName": "batch_normalization_param.eps",
                  "required": true,
                  "editable": true,
                  "value": "0.0001",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "BatchStat",
                  "argumentName": "batch_normalization_param.batch_stat -test=False",
                  "required": true,
                  "editable": true,
                  "value": true,
                  "shortName": "",
                  "type": "BooleanOrMacro"
                },
                {
                  "name": "ParameterScope",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "*Name",
                  "shortName": "",
                  "type": "Text"
                },
                {
                  "name": "beta.File",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "",
                  "shortName": "",
                  "type": "File"
                },
                {
                  "name": "beta.Initializer",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "Constant",
                  "shortName": "",
                  "type": "Option",
                  "option": [
                    "Normal",
                    "Uniform",
                    "Constant"
                  ]
                },
                {
                  "name": "beta.InitializerMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "0.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "beta.LRateMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "gamma.File",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "",
                  "shortName": "",
                  "type": "File"
                },
                {
                  "name": "gamma.Initializer",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "Constant",
                  "shortName": "",
                  "type": "Option",
                  "option": [
                    "Normal",
                    "Uniform",
                    "Constant"
                  ]
                },
                {
                  "name": "gamma.InitializerMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "gamma.LRateMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "mean.File",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "",
                  "shortName": "",
                  "type": "File"
                },
                {
                  "name": "mean.Initializer",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "Constant",
                  "shortName": "",
                  "type": "Option",
                  "option": [
                    "Normal",
                    "Uniform",
                    "Constant"
                  ]
                },
                {
                  "name": "mean.InitializerMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "0.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "mean.LRateMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "0.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "var.File",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "",
                  "shortName": "",
                  "type": "File"
                },
                {
                  "name": "var.Initializer",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "Constant",
                  "shortName": "",
                  "type": "Option",
                  "option": [
                    "Normal",
                    "Uniform",
                    "Constant"
                  ]
                },
                {
                  "name": "var.InitializerMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "0.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "var.LRateMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "0.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostParameter",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*SumParameterSize",
                  "shortName": "",
                  "type": "UInt"
                },
                {
                  "name": "CostAdd",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                },
                {
                  "name": "CostMultiply",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": "Ioffe and Szegedy, Batch Normalization: Accelerating Deep Network Training by Reducing Internal Covariate Shift. https://arxiv.org/abs/1502.03167",
              "color": "0xb2b2b2",
              "inputSideConnector": [
                {
                  "color": "0xa8a800",
                  "kind": "Parameter",
                  "enable": true,
                  "shape": "*BatchNormalizationShape",
                  "name": "beta"
                },
                {
                  "color": "0xa8a800",
                  "kind": "Parameter",
                  "enable": true,
                  "shape": "*BatchNormalizationShape",
                  "name": "gamma"
                },
                {
                  "color": "0xa8a800",
                  "kind": "Parameter",
                  "enable": true,
                  "shape": "*BatchNormalizationShape",
                  "name": "mean"
                },
                {
                  "color": "0xa8a800",
                  "kind": "Parameter",
                  "enable": true,
                  "shape": "*BatchNormalizationShape",
                  "name": "var"
                }
              ],
              "input": 1,
              "layout": null,
              "name": "FusedBatchNormalization",
              "outputSideConnector": [],
              "parameterScope": "bn",
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "FusedBatchNormalization",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Axes",
                  "argumentName": "fused_batch_normalization_param.axes -a -n",
                  "required": true,
                  "editable": true,
                  "value": "0",
                  "shortName": "",
                  "type": "UIntArray"
                },
                {
                  "name": "DecayRate",
                  "argumentName": "fused_batch_normalization_param.decay_rate -n",
                  "required": true,
                  "editable": true,
                  "value": "0.9",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Epsilon",
                  "argumentName": "fused_batch_normalization_param.eps -n",
                  "required": true,
                  "editable": true,
                  "value": "0.0001",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "BatchStat",
                  "argumentName": "fused_batch_normalization_param.batch_stat -n -test=False",
                  "required": true,
                  "editable": true,
                  "value": true,
                  "shortName": "",
                  "type": "BooleanOrMacro"
                },
                {
                  "name": "Nonlinearity",
                  "argumentName": "fused_batch_normalization_param.nonlinearity -n",
                  "required": true,
                  "editable": true,
                  "value": "relu",
                  "shortName": "",
                  "type": "Option",
                  "option": [
                    "relu"
                  ]
                },
                {
                  "name": "ParameterScope",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "*Name",
                  "shortName": "",
                  "type": "Text"
                },
                {
                  "name": "beta.File",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "",
                  "shortName": "",
                  "type": "File"
                },
                {
                  "name": "beta.Initializer",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "Constant",
                  "shortName": "",
                  "type": "Option",
                  "option": [
                    "Normal",
                    "Uniform",
                    "Constant"
                  ]
                },
                {
                  "name": "beta.InitializerMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "0.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "beta.LRateMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "gamma.File",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "",
                  "shortName": "",
                  "type": "File"
                },
                {
                  "name": "gamma.Initializer",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "Constant",
                  "shortName": "",
                  "type": "Option",
                  "option": [
                    "Normal",
                    "Uniform",
                    "Constant"
                  ]
                },
                {
                  "name": "gamma.InitializerMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "gamma.LRateMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "mean.File",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "",
                  "shortName": "",
                  "type": "File"
                },
                {
                  "name": "mean.Initializer",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "Constant",
                  "shortName": "",
                  "type": "Option",
                  "option": [
                    "Normal",
                    "Uniform",
                    "Constant"
                  ]
                },
                {
                  "name": "mean.InitializerMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "0.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "mean.LRateMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "0.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "var.File",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "",
                  "shortName": "",
                  "type": "File"
                },
                {
                  "name": "var.Initializer",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "Constant",
                  "shortName": "",
                  "type": "Option",
                  "option": [
                    "Normal",
                    "Uniform",
                    "Constant"
                  ]
                },
                {
                  "name": "var.InitializerMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "0.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "var.LRateMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "0.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostParameter",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*SumParameterSize",
                  "shortName": "",
                  "type": "UInt"
                },
                {
                  "name": "CostAdd",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                },
                {
                  "name": "CostMultiply",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xb2b2b2",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "Dropout",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "Dropout",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "P",
                  "argumentName": "dropout_param.p",
                  "required": true,
                  "editable": true,
                  "searchParameter": true,
                  "important": true,
                  "value": "0.5",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Seed",
                  "argumentName": "dropout_param.seed",
                  "required": true,
                  "editable": true,
                  "value": "-1",
                  "shortName": "",
                  "type": "Int"
                },
                {
                  "name": "SkipAtTest",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": true,
                  "shortName": "",
                  "type": "Boolean"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostMultiply",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xb2b2b2",
              "inputSideConnector": [],
              "input": -1,
              "layout": null,
              "name": "Concatenate",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "Concatenate",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Inputs",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInputs",
                  "shortName": "",
                  "type": "PIntArrays"
                },
                {
                  "name": "Axis",
                  "argumentName": "concatenate_param.axis -a -n -f",
                  "required": true,
                  "editable": true,
                  "value": "0",
                  "shortName": "",
                  "type": "UInt"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*ConcatenateOutputSize",
                  "shortName": "",
                  "type": "PIntArray"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xb2b2b2",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "Reshape",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "Reshape",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "OutShape",
                  "argumentName": "reshape_param.shape -b",
                  "required": true,
                  "editable": true,
                  "value": "100",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*ReshapeOutputSize",
                  "shortName": "",
                  "type": "PIntArray"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xb2b2b2",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "Broadcast",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "Broadcast",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "OutShape",
                  "argumentName": "broadcast_param.shape -b",
                  "required": true,
                  "editable": true,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*OutShape",
                  "shortName": "",
                  "type": "PIntArray"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xb2b2b2",
              "inputSideConnector": [
                {
                  "color": "0x00a0b0",
                  "kind": "Data",
                  "enable": true,
                  "shape": "*Input",
                  "name": "y"
                }
              ],
              "input": 1,
              "layout": null,
              "name": "BroadcastTo",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "BroadcastTo",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "y.Dataset",
                  "argumentName": "",
                  "required": false,
                  "editable": true,
                  "value": "",
                  "important": true,
                  "shortName": "",
                  "type": "Dataset"
                },
                {
                  "name": "y.Generator",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "Constant",
                  "shortName": "",
                  "type": "Option",
                  "option": [
                    "None",
                    "Normal",
                    "Uniform",
                    "Constant"
                  ]
                },
                {
                  "name": "y.GeneratorMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Axis",
                  "argumentName": "broadcast_to_param.axis -a",
                  "required": true,
                  "editable": true,
                  "value": "-1",
                  "shortName": "",
                  "type": "Int"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xb2b2b2",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "Tile",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "Tile",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Reps",
                  "argumentName": "tile_param.reps -f -r",
                  "required": true,
                  "editable": true,
                  "value": "2",
                  "important": true,
                  "shortName": "Shape",
                  "type": "PIntArray"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*UnpoolingOutputSize",
                  "shortName": "",
                  "type": "PIntArray"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xb2b2b2",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "Pad",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "Pad",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "PadWidth",
                  "argumentName": "pad_param.pad_width -r",
                  "required": true,
                  "editable": true,
                  "value": "0,0,0,0",
                  "important": true,
                  "shortName": "",
                  "type": "UIntArray"
                },
                {
                  "name": "Mode",
                  "argumentName": "pad_param.mode",
                  "required": true,
                  "editable": true,
                  "value": "constant",
                  "shortName": "",
                  "type": "Option",
                  "option": [
                    "constant",
                    "reflect"
                  ]
                },
                {
                  "name": "ConstantValue",
                  "argumentName": "pad_param.constant_value",
                  "required": true,
                  "editable": true,
                  "value": "0.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*PadOutputSize",
                  "shortName": "",
                  "type": "PIntArray"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xb2b2b2",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "Flip",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "Flip",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Axes",
                  "argumentName": "flip_param.axes -a",
                  "required": true,
                  "editable": true,
                  "value": "0",
                  "important": true,
                  "shortName": "",
                  "type": "UIntArray"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xb2b2b2",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "Shift",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "Shift",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Shift",
                  "argumentName": "shift_param.shifts -r",
                  "required": true,
                  "editable": true,
                  "value": "0,0",
                  "important": true,
                  "shortName": "",
                  "type": "IntArray"
                },
                {
                  "name": "BorderMode",
                  "argumentName": "shift_param.border_mode",
                  "required": true,
                  "editable": true,
                  "value": "nearest",
                  "important": true,
                  "shortName": "",
                  "type": "Option",
                  "option": [
                    "nearest",
                    "reflect"
                  ]
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xb2b2b2",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "Transpose",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "Transpose",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Axes",
                  "argumentName": "transpose_param.axes -a -0",
                  "required": true,
                  "editable": true,
                  "value": "0,1,2",
                  "important": true,
                  "shortName": "",
                  "type": "UIntArray"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*TransposeOutputSize",
                  "shortName": "",
                  "type": "PIntArray"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xb2b2b2",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "Slice",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "Slice",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Start",
                  "argumentName": "slice_param.start -r -f",
                  "required": true,
                  "editable": true,
                  "value": "0,0,0",
                  "important": true,
                  "shortName": "",
                  "type": "UIntArray"
                },
                {
                  "name": "Stop",
                  "argumentName": "slice_param.stop -r -f",
                  "required": true,
                  "editable": true,
                  "value": "*Input",
                  "important": true,
                  "shortName": "",
                  "type": "UIntArray"
                },
                {
                  "name": "Step",
                  "argumentName": "slice_param.step -r -f",
                  "required": true,
                  "editable": true,
                  "value": "1,1,1",
                  "shortName": "",
                  "type": "UIntArray"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*SliceOutputSize",
                  "shortName": "",
                  "type": "PIntArray"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xb2b2b2",
              "inputSideConnector": [],
              "input": -1,
              "layout": null,
              "name": "Stack",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "Stack",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Inputs",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInputs",
                  "shortName": "",
                  "type": "PIntArrays"
                },
                {
                  "name": "Axis",
                  "argumentName": "stack_param.axis -a",
                  "required": true,
                  "editable": true,
                  "value": "0",
                  "shortName": "",
                  "type": "UInt"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*StackOutputSize",
                  "shortName": "",
                  "type": "PIntArray"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xb2b2b2",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "MatrixDiag",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "MatrixDiag",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*MatrixDiagOutputSize",
                  "shortName": "",
                  "type": "PIntArray"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xb2b2b2",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "MatrixDiagPart",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "MatrixDiagPart",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*MatrixDiagPartOutputSize",
                  "shortName": "",
                  "type": "PIntArray"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xb2b2b2",
              "inputSideConnector": [
                {
                  "color": "0x00a0b0",
                  "kind": "Data",
                  "enable": true,
                  "shape": "*Input",
                  "name": "min"
                },
                {
                  "color": "0x00a0b0",
                  "kind": "Data",
                  "enable": true,
                  "shape": "*Input",
                  "name": "Max"
                }
              ],
              "input": 1,
              "layout": null,
              "name": "ClipGradByValue",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "ClipGradByValue",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "min.Dataset",
                  "argumentName": "",
                  "required": false,
                  "editable": true,
                  "value": "",
                  "important": true,
                  "shortName": "",
                  "type": "Dataset"
                },
                {
                  "name": "min.Generator",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "Constant",
                  "shortName": "",
                  "type": "Option",
                  "option": [
                    "None",
                    "Normal",
                    "Uniform",
                    "Constant"
                  ]
                },
                {
                  "name": "min.GeneratorMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "-1.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Max.Dataset",
                  "argumentName": "",
                  "required": false,
                  "editable": true,
                  "value": "",
                  "important": true,
                  "shortName": "",
                  "type": "Dataset"
                },
                {
                  "name": "Max.Generator",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "Constant",
                  "shortName": "",
                  "type": "Option",
                  "option": [
                    "None",
                    "Normal",
                    "Uniform",
                    "Constant"
                  ]
                },
                {
                  "name": "Max.GeneratorMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xb2b2b2",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "ClipGradByNorm",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "ClipGradByNorm",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "ClipNorm",
                  "argumentName": "clip_grad_by_norm_param.clip_norm",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Axes",
                  "argumentName": "clip_grad_by_norm_param.axes -a",
                  "required": true,
                  "editable": true,
                  "value": "0",
                  "shortName": "",
                  "type": "UIntArray"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xb2b2b2",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "TopKData",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "TopKData",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "K",
                  "argumentName": "top_k_data_param.k",
                  "required": true,
                  "editable": true,
                  "value": "1",
                  "important": true,
                  "shortName": "",
                  "type": "PInt"
                },
                {
                  "name": "Abs",
                  "argumentName": "top_k_data_param.abs",
                  "required": true,
                  "editable": true,
                  "value": false,
                  "shortName": "",
                  "type": "Boolean"
                },
                {
                  "name": "Reduce",
                  "argumentName": "top_k_data_param.reduce",
                  "required": true,
                  "editable": true,
                  "value": true,
                  "shortName": "",
                  "type": "Boolean"
                },
                {
                  "name": "BaseAxis",
                  "argumentName": "top_k_data_param.base_axis -a",
                  "required": true,
                  "editable": true,
                  "value": "0",
                  "shortName": "",
                  "type": "UInt"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*TopKDataOutputSize",
                  "shortName": "",
                  "type": "PIntArray"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xb2b2b2",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "TopKGrad",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "TopKGrad",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "K",
                  "argumentName": "top_k_grad_param.k",
                  "required": true,
                  "editable": true,
                  "value": "1",
                  "important": true,
                  "shortName": "",
                  "type": "PInt"
                },
                {
                  "name": "Abs",
                  "argumentName": "top_k_grad_param.abs",
                  "required": true,
                  "editable": true,
                  "value": false,
                  "shortName": "",
                  "type": "Boolean"
                },
                {
                  "name": "BaseAxis",
                  "argumentName": "top_k_grad_param.base_axis -a",
                  "required": true,
                  "editable": true,
                  "value": "0",
                  "shortName": "",
                  "type": "UInt"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xb2b2b2",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "Sort",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "Sort",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Axis",
                  "argumentName": "sort_param.axis -a -f",
                  "required": true,
                  "editable": true,
                  "value": "0",
                  "important": true,
                  "shortName": "",
                  "type": "Int"
                },
                {
                  "name": "Reverse",
                  "argumentName": "sort_param.reverse",
                  "required": true,
                  "editable": true,
                  "value": false,
                  "shortName": "",
                  "type": "Boolean"
                },
                {
                  "name": "WithIndex",
                  "argumentName": "sort_param.with_index",
                  "required": true,
                  "editable": false,
                  "value": false,
                  "shortName": "",
                  "type": "Boolean"
                },
                {
                  "name": "OnlyIndex",
                  "argumentName": "sort_param.only_index",
                  "required": true,
                  "editable": true,
                  "value": false,
                  "shortName": "",
                  "type": "Boolean"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xb2b2b2",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "Prune",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "Prune",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Rate",
                  "argumentName": "prune_param.rate",
                  "required": true,
                  "editable": true,
                  "value": "0.9",
                  "important": true,
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xb2b2b2",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "Interpolate",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "Interpolate",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "OutputSize",
                  "argumentName": "interpolate_param.output_size -r -f",
                  "required": true,
                  "editable": true,
                  "value": "32,32",
                  "important": true,
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Mode",
                  "argumentName": "interpolate_param.mode",
                  "required": true,
                  "editable": true,
                  "value": "linear",
                  "shortName": "",
                  "type": "Option",
                  "option": [
                    "linear"
                  ]
                },
                {
                  "name": "AlignCorners",
                  "argumentName": "interpolate_param.align_corners",
                  "required": true,
                  "editable": true,
                  "value": true,
                  "shortName": "",
                  "type": "Boolean"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "Input[0],OutputSize[0],OutputSize[1]",
                  "shortName": "",
                  "type": "PIntArray"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xb2b2b2",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "ResetNaN",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "ResetNaN",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xb2b2b2",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "ResetInf",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "ResetInf",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                }
              ]
            },
            {
              "reference": "Joseph Redmon, Ali Farhadi, YOLO9000: Better, Faster, Stronger. https://arxiv.org/abs/1612.08242",
              "color": "0xb2b2b2",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "NmsDetection2d",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "NmsDetection2d",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Thresh",
                  "argumentName": "nms_detection2d_param.thresh",
                  "required": true,
                  "editable": true,
                  "value": "0.5",
                  "important": true,
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "NMS",
                  "argumentName": "nms_detection2d_param.nms",
                  "required": true,
                  "editable": true,
                  "value": "0.45",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "NMSPerClass",
                  "argumentName": "nms_detection2d_param.nms_per_class",
                  "required": true,
                  "editable": true,
                  "value": true,
                  "shortName": "",
                  "type": "Boolean"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                }
              ]
            },
            {
              "reference": "Miyato et.al, Distributional Smoothing with Virtual Adversarial Training. https://arxiv.org/abs/1507.00677",
              "color": "0xb2b2b2",
              "inputSideConnector": [
                {
                  "color": "0x00a0b0",
                  "kind": "Data",
                  "enable": true,
                  "shape": "*Input",
                  "name": "Buf"
                }
              ],
              "input": 1,
              "layout": null,
              "name": "VATNoise",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "VATNoise",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "BaseAxis",
                  "argumentName": "vat_noise_param.base_axis -a",
                  "required": true,
                  "editable": true,
                  "value": "0",
                  "shortName": "",
                  "type": "UInt"
                },
                {
                  "name": "Epsilon",
                  "argumentName": "vat_noise_param.eps",
                  "required": true,
                  "editable": true,
                  "value": "0.0001",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Buf.Dataset",
                  "argumentName": "",
                  "required": false,
                  "editable": true,
                  "value": "buf",
                  "important": true,
                  "shortName": "",
                  "type": "Dataset"
                },
                {
                  "name": "Buf.Generator",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "None",
                  "shortName": "",
                  "type": "Option",
                  "option": [
                    "None",
                    "Normal",
                    "Uniform",
                    "Constant"
                  ]
                },
                {
                  "name": "Buf.GeneratorMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xb2b2b2",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "Unlink",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "Unlink",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xb2b2b2",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "Identity",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "Identity",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xb2b2b2",
              "inputSideConnector": [],
              "input": 0,
              "layout": null,
              "name": "Comment",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": 0,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "Comment",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Comment",
                  "argumentName": "",
                  "required": false,
                  "editable": true,
                  "value": "",
                  "shortName": "",
                  "type": "Text"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xb2b2b2",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "Output",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": 0,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "Output",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "VariableName",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "y",
                  "shortName": "",
                  "type": "Text"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xb2b2b2",
              "inputSideConnector": [],
              "input": -1,
              "layout": null,
              "name": "Unsupported",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "Unsupported",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphIO",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphIO",
                  "shortName": "",
                  "type": "PIntArrays"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xb2b2b2",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "OneHot",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "OneHot",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Shape",
                  "argumentName": "one_hot_param.shape",
                  "required": true,
                  "editable": true,
                  "value": "100",
                  "important": true,
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*OneHotOutputSize",
                  "shortName": "",
                  "type": "PIntArray"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xb2b2b2",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "RandomCrop",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "RandomCrop",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Shape",
                  "argumentName": "random_crop_param.shape",
                  "required": true,
                  "editable": true,
                  "value": "*Input",
                  "important": true,
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "BaseAxis",
                  "argumentName": "random_crop_param.base_axis -a",
                  "required": true,
                  "editable": false,
                  "value": "0",
                  "shortName": "",
                  "type": "UInt"
                },
                {
                  "name": "Seed",
                  "argumentName": "random_crop_param.seed",
                  "required": true,
                  "editable": true,
                  "value": "-1",
                  "shortName": "",
                  "type": "Int"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Shape",
                  "shortName": "",
                  "type": "PIntArray"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xb2b2b2",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "RandomFlip",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "RandomFlip",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Axes",
                  "argumentName": "random_flip_param.axes -a",
                  "required": true,
                  "editable": true,
                  "value": "0",
                  "important": true,
                  "shortName": "",
                  "type": "UIntArray"
                },
                {
                  "name": "BaseAxis",
                  "argumentName": "random_flip_param.base_axis -a",
                  "required": true,
                  "editable": false,
                  "value": "0",
                  "shortName": "",
                  "type": "UInt"
                },
                {
                  "name": "Seed",
                  "argumentName": "random_flip_param.seed",
                  "required": true,
                  "editable": true,
                  "value": "-1",
                  "shortName": "",
                  "type": "Int"
                },
                {
                  "name": "SkipAtTest",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": true,
                  "shortName": "",
                  "type": "Boolean"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xb2b2b2",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "RandomShift",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "RandomShift",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Shift",
                  "argumentName": "random_shift_param.shifts -r",
                  "required": true,
                  "editable": true,
                  "value": "0,0",
                  "important": true,
                  "shortName": "",
                  "type": "IntArray"
                },
                {
                  "name": "BorderMode",
                  "argumentName": "random_shift_param.border_mode",
                  "required": true,
                  "editable": true,
                  "value": "nearest",
                  "important": true,
                  "shortName": "",
                  "type": "Option",
                  "option": [
                    "nearest",
                    "reflect"
                  ]
                },
                {
                  "name": "BaseAxis",
                  "argumentName": "random_shift_param.base_axis -a",
                  "required": true,
                  "editable": false,
                  "value": "0",
                  "shortName": "",
                  "type": "UInt"
                },
                {
                  "name": "Seed",
                  "argumentName": "random_shift_param.seed",
                  "required": true,
                  "editable": true,
                  "value": "-1",
                  "shortName": "",
                  "type": "Int"
                },
                {
                  "name": "SkipAtTest",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": true,
                  "shortName": "",
                  "type": "Boolean"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xb2b2b2",
              "inputSideConnector": [
                {
                  "color": "0xa8a800",
                  "kind": "Parameter",
                  "enable": true,
                  "shape": "*RunningMeanShape",
                  "name": "mean"
                },
                {
                  "color": "0xa8a800",
                  "kind": "Parameter",
                  "enable": true,
                  "shape": "1",
                  "name": "t"
                }
              ],
              "input": 1,
              "layout": null,
              "name": "MeanSubtraction",
              "outputSideConnector": [],
              "parameterScope": "mean_subtraction",
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "MeanSubtraction",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "BaseAxis",
                  "argumentName": "mean_subtraction_param.base_axis -a",
                  "required": true,
                  "editable": true,
                  "value": "0",
                  "shortName": "",
                  "type": "UInt"
                },
                {
                  "name": "UpdateRunningMean",
                  "argumentName": "mean_subtraction_param.update_running_mean -test=False",
                  "required": true,
                  "editable": true,
                  "value": true,
                  "shortName": "",
                  "type": "Boolean"
                },
                {
                  "name": "ParameterScope",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "*Name",
                  "shortName": "",
                  "type": "Text"
                },
                {
                  "name": "mean.File",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "",
                  "shortName": "",
                  "type": "File"
                },
                {
                  "name": "mean.Initializer",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "Constant",
                  "shortName": "",
                  "type": "Option",
                  "option": [
                    "Normal",
                    "Uniform",
                    "Constant"
                  ]
                },
                {
                  "name": "mean.InitializerMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "0.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "mean.LRateMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "0.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "t.File",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "",
                  "shortName": "",
                  "type": "File"
                },
                {
                  "name": "t.Initializer",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "Constant",
                  "shortName": "",
                  "type": "Option",
                  "option": [
                    "Normal",
                    "Uniform",
                    "Constant"
                  ]
                },
                {
                  "name": "t.InitializerMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "0.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "t.LRateMultiplier",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": "0.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Input",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "CostAdd",
                  "argumentName": "",
                  "required": false,
                  "editable": false,
                  "value": "*Calc +*Input",
                  "shortName": "",
                  "type": "PInt"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xb2b2b2",
              "inputSideConnector": [],
              "input": 1,
              "layout": null,
              "name": "ImageAugmentation",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": -1,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "ImageAugmentation",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Input",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*GraphInput",
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Shape",
                  "argumentName": "image_augmentation_param.shape",
                  "required": true,
                  "editable": true,
                  "value": "*Input",
                  "important": true,
                  "shortName": "",
                  "type": "PIntArray"
                },
                {
                  "name": "Pad",
                  "argumentName": "image_augmentation_param.pad",
                  "required": true,
                  "editable": true,
                  "value": "0,0",
                  "shortName": "",
                  "type": "UIntArray"
                },
                {
                  "name": "MinScale",
                  "argumentName": "image_augmentation_param.min_scale",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "MaxScale",
                  "argumentName": "image_augmentation_param.max_scale",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Angle",
                  "argumentName": "image_augmentation_param.angle",
                  "required": true,
                  "editable": true,
                  "value": "0.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "AspectRatio",
                  "argumentName": "image_augmentation_param.aspect_ratio",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Distortion",
                  "argumentName": "image_augmentation_param.distortion",
                  "required": true,
                  "editable": true,
                  "value": "0.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "FlipLR",
                  "argumentName": "image_augmentation_param.flip_lr",
                  "required": true,
                  "editable": true,
                  "value": false,
                  "shortName": "",
                  "type": "Boolean"
                },
                {
                  "name": "FlipUD",
                  "argumentName": "image_augmentation_param.flip_ud",
                  "required": true,
                  "editable": true,
                  "value": false,
                  "shortName": "",
                  "type": "Boolean"
                },
                {
                  "name": "Brightness",
                  "argumentName": "image_augmentation_param.brightness",
                  "required": true,
                  "editable": true,
                  "value": "0.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "BrightnessEach",
                  "argumentName": "image_augmentation_param.brightness_each",
                  "required": true,
                  "editable": true,
                  "value": false,
                  "shortName": "",
                  "type": "Boolean"
                },
                {
                  "name": "Contrast",
                  "argumentName": "image_augmentation_param.contrast",
                  "required": true,
                  "editable": true,
                  "value": "1.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "ContrastCenter",
                  "argumentName": "image_augmentation_param.contrast_center",
                  "required": true,
                  "editable": true,
                  "value": "0.5",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "ContrastEach",
                  "argumentName": "image_augmentation_param.contrast_each",
                  "required": true,
                  "editable": true,
                  "value": false,
                  "shortName": "",
                  "type": "Boolean"
                },
                {
                  "name": "Noise",
                  "argumentName": "image_augmentation_param.noise",
                  "required": true,
                  "editable": true,
                  "value": "0.0",
                  "shortName": "",
                  "type": "Float"
                },
                {
                  "name": "Seed",
                  "argumentName": "image_augmentation_param.seed",
                  "required": true,
                  "editable": true,
                  "value": "-1",
                  "shortName": "",
                  "type": "Int"
                },
                {
                  "name": "SkipAtTest",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": true,
                  "shortName": "",
                  "type": "Boolean"
                },
                {
                  "name": "Output",
                  "argumentName": "",
                  "required": true,
                  "editable": false,
                  "value": "*Shape",
                  "shortName": "",
                  "type": "PIntArray"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xb2b2b2",
              "inputSideConnector": [],
              "input": 0,
              "layout": null,
              "name": "TestNetwork",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": 0,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "TestNetwork",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "ModifyForTesting",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": true,
                  "important": true,
                  "shortName": "",
                  "type": "Boolean"
                }
              ]
            },
            {
              "reference": null,
              "color": "0xb2b2b2",
              "inputSideConnector": [],
              "input": 0,
              "layout": null,
              "name": "StructureSearch",
              "outputSideConnector": [],
              "parameterScope": null,
              "output": 0,
              "property": [
                {
                  "name": "Name",
                  "argumentName": "name",
                  "required": true,
                  "editable": true,
                  "value": "StructureSearch",
                  "shortName": "Name",
                  "type": "Text"
                },
                {
                  "name": "Search",
                  "argumentName": "",
                  "required": true,
                  "editable": true,
                  "value": true,
                  "important": true,
                  "shortName": "",
                  "type": "Boolean"
                }
              ]
            }
          ],
          "categories": [
            {
              "name": "IO",
              "components": [
                "Input"
              ]
            },
            {
              "name": "Loss",
              "components": [
                "SquaredError",
                "HuberLoss",
                "AbsoluteError",
                "EpsilonInsensitiveLoss",
                "BinaryCrossEntropy",
                "SigmoidCrossEntropy",
                "CategoricalCrossEntropy",
                "SoftmaxCrossEntropy",
                "KLMultinomial"
              ]
            },
            {
              "name": "Parameter",
              "components": [
                "Parameter",
                "WorkingMemory"
              ]
            },
            {
              "name": "Basic",
              "components": [
                "Affine",
                "Convolution",
                "DepthwiseConvolution",
                "Deconvolution",
                "DepthwiseDeconvolution",
                "Embed"
              ]
            },
            {
              "name": "Pooling",
              "components": [
                "MaxPooling",
                "AveragePooling",
                "GlobalAveragePooling",
                "SumPooling",
                "Unpooling"
              ]
            },
            {
              "name": "Activation",
              "components": [
                "Tanh",
                "HardTanh",
                "TanhShrink",
                "Sigmoid",
                "HardSigmoid",
                "LogSigmoid",
                "Abs",
                "ReLU",
                "CReLU",
                "LeakyReLU",
                "PReLU",
                "ReLU6",
                "ELU",
                "CELU",
                "SELU",
                "GELU",
                "SoftPlus",
                "SoftSign",
                "Sinc",
                "Swish",
                "Mish",
                "Softmax"
              ]
            },
            {
              "name": "LoopControl",
              "components": [
                "RepeatStart",
                "RepeatEnd",
                "RecurrentInput",
                "RecurrentOutput",
                "Delay"
              ]
            },
            {
              "name": "Quantize",
              "components": [
                "FixedPointQuantize",
                "Pow2Quantize",
                "BinaryConnectAffine",
                "BinaryConnectConvolution",
                "BinaryWeightAffine",
                "BinaryWeightConvolution",
                "BinaryTanh",
                "BinarySigmoid"
              ]
            },
            {
              "name": "Unit",
              "components": [
                "Unit",
                "Argument",
                "LSTM"
              ]
            },
            {
              "name": "Spectral",
              "components": [
                "FFT",
                "IFFT"
              ]
            },
            {
              "name": "Math",
              "components": [
                "Sum",
                "Mean",
                "Prod",
                "Max",
                "Min",
                "Log",
                "Exp",
                "Sign",
                "BatchMatmul",
                "BatchInv",
                "Round",
                "Ceil",
                "Floor"
              ]
            },
            {
              "name": "Trigonometric",
              "components": [
                "Sin",
                "Cos",
                "Tan",
                "Sinh",
                "Cosh",
                "ASin",
                "ACos",
                "ATan",
                "ATan2",
                "ASinh",
                "ACosh",
                "ATanh"
              ]
            },
            {
              "name": "Arithmetic (Scalar)",
              "components": [
                "AddScalar",
                "MulScalar",
                "RSubScalar",
                "RDivScalar",
                "PowScalar",
                "RPowScalar",
                "MaximumScalar",
                "MinimumScalar"
              ]
            },
            {
              "name": "Arithmetic (2 Inputs)",
              "components": [
                "Add2",
                "Sub2",
                "Mul2",
                "Div2",
                "Pow2",
                "Maximum2",
                "Minimum2"
              ]
            },
            {
              "name": "Arithmetic (N Inputs)",
              "components": [
                "AddN",
                "MulN"
              ]
            },
            {
              "name": "Logical",
              "components": [
                "LogicalAnd",
                "LogicalOr",
                "LogicalXor",
                "Equal",
                "NotEqual",
                "GreaterEqual",
                "Greater",
                "LessEqual",
                "Less",
                "LogicalAndScalar",
                "LogicalOrScalar",
                "LogicalXorScalar",
                "EqualScalar",
                "NotEqualScalar",
                "GreaterEqualScalar",
                "GreaterScalar",
                "LessEqualScalar",
                "LessScalar",
                "LogicalNot",
                "IsNaN",
                "IsInf"
              ]
            },
            {
              "name": "Validation",
              "components": [
                "BinaryError",
                "TopNError"
              ]
            },
            {
              "name": "Others",
              "components": [
                "BatchNormalization",
                "FusedBatchNormalization",
                "Dropout",
                "Concatenate",
                "Reshape",
                "Broadcast",
                "BroadcastTo",
                "Tile",
                "Pad",
                "Flip",
                "Shift",
                "Transpose",
                "Slice",
                "Stack",
                "MatrixDiag",
                "MatrixDiagPart",
                "ClipGradByValue",
                "ClipGradByNorm",
                "TopKData",
                "TopKGrad",
                "Sort",
                "Prune",
                "Interpolate",
                "ResetNaN",
                "ResetInf",
                "NmsDetection2d",
                "VATNoise",
                "Unlink",
                "Identity",
                "Comment"
              ]
            },
            {
              "name": "Others(Pre Process)",
              "components": [
                "OneHot",
                "RandomCrop",
                "RandomFlip",
                "RandomShift",
                "MeanSubtraction",
                "ImageAugmentation"
              ]
            },
            {
              "name": "Setting",
              "components": [
                "TestNetwork",
                "StructureSearch"
              ]
            }
          ]
        },
        "solvers": [
          {
            "default": false,
            "reference": "Matthew D. Zeiler. ADADELTA: An Adaptive Learning Rate Method. https://arxiv.org/abs/1212.5701",
            "_id": "adadelta_param",
            "name": "Adadelta",
            "parameters": [
              {
                "_id": "lr",
                "name": "LearningRate",
                "initial_value": "1.0"
              },
              {
                "_id": "decay",
                "name": "Decay",
                "initial_value": "0.95"
              },
              {
                "_id": "eps",
                "name": "Epsilon",
                "initial_value": "1.0e-6s"
              }
            ]
          },
          {
            "default": false,
            "reference": "John Duchi, Elad Hazan and Yoram Singer (2011). Adaptive Subgradient Methods for Online Learning and Stochastic Optimization. http://www.jmlr.org/papers/volume12/duchi11a/duchi11a.pdf",
            "_id": "adagrad_param",
            "name": "Adagrad",
            "parameters": [
              {
                "_id": "lr",
                "name": "LearningRate",
                "initial_value": "0.01"
              },
              {
                "_id": "eps",
                "name": "Epsilon",
                "initial_value": "1.0e-8"
              }
            ]
          },
          {
            "default": true,
            "reference": "Kingma and Ba, Adam: A Method for Stochastic Optimization. https://arxiv.org/abs/1412.6980",
            "_id": "adam_param",
            "name": "Adam",
            "parameters": [
              {
                "_id": "alpha",
                "name": "Alpha",
                "initial_value": "0.001"
              },
              {
                "_id": "beta1",
                "name": "Beta1",
                "initial_value": "0.9"
              },
              {
                "_id": "beta2",
                "name": "Beta2",
                "initial_value": "0.999"
              },
              {
                "_id": "eps",
                "name": "Epsilon",
                "initial_value": "1.0e-8"
              }
            ]
          },
          {
            "default": false,
            "reference": "Ilya Loshchilov, Frank Hutter. Decoupled Weight Decay Regularization. https://arxiv.org/abs/1711.05101",
            "_id": "adamw_param",
            "name": "AdamW",
            "parameters": [
              {
                "_id": "alpha",
                "name": "Alpha",
                "initial_value": "0.001"
              },
              {
                "_id": "beta1",
                "name": "Beta1",
                "initial_value": "0.9"
              },
              {
                "_id": "beta2",
                "name": "Beta2",
                "initial_value": "0.999"
              },
              {
                "_id": "eps",
                "name": "Epsilon",
                "initial_value": "1.0e-8"
              },
              {
                "_id": "wd",
                "name": "Weight Decay",
                "initial_value": "0.0001"
              }
            ]
          },
          {
            "default": false,
            "reference": "Kingma and Ba, Adam: A Method for Stochastic Optimization. https://arxiv.org/abs/1412.6980",
            "_id": "adamax_param",
            "name": "Adamax",
            "parameters": [
              {
                "_id": "alpha",
                "name": "Alpha",
                "initial_value": "0.002"
              },
              {
                "_id": "beta1",
                "name": "Beta1",
                "initial_value": "0.9"
              },
              {
                "_id": "beta2",
                "name": "Beta2",
                "initial_value": "0.999"
              },
              {
                "_id": "eps",
                "name": "Epsilon",
                "initial_value": "1.0e-8"
              }
            ]
          },
          {
            "default": false,
            "reference": "L. Luo, Y. Xiong, Y. Liu and X. Sun. Adaptive Gradient Methods with Dynamic Bound of Learning Rate. https://arxiv.org/abs/1902.09843",
            "_id": "adabound_param",
            "name": "AdaBound",
            "parameters": [
              {
                "_id": "alpha",
                "name": "Alpha",
                "initial_value": "0.001"
              },
              {
                "_id": "beta1",
                "name": "Beta1",
                "initial_value": "0.9"
              },
              {
                "_id": "beta2",
                "name": "Beta2",
                "initial_value": "0.999"
              },
              {
                "_id": "eps",
                "name": "Epsilon",
                "initial_value": "1.0e-8"
              },
              {
                "_id": "final_lr",
                "name": "FinalLR",
                "initial_value": "0.1"
              },
              {
                "_id": "gamma",
                "name": "Gamma",
                "initial_value": "0.001"
              }
            ]
          },
          {
            "default": false,
            "reference": "Reddi et al. On the convergence of ADAM and beyond. https://openreview.net/pdf?id=ryQu7f-RZ",
            "_id": "amsgrad_param",
            "name": "AMSGRAD",
            "parameters": [
              {
                "_id": "alpha",
                "name": "Alpha",
                "initial_value": "0.001"
              },
              {
                "_id": "beta1",
                "name": "Beta1",
                "initial_value": "0.9"
              },
              {
                "_id": "beta2",
                "name": "Beta2",
                "initial_value": "0.999"
              },
              {
                "_id": "eps",
                "name": "Epsilon",
                "initial_value": "1.0e-8"
              }
            ]
          },
          {
            "default": false,
            "reference": "L. Luo, Y. Xiong, Y. Liu and X. Sun. Adaptive Gradient Methods with Dynamic Bound of Learning Rate. https://arxiv.org/abs/1902.09843",
            "_id": "amsbound_param",
            "name": "AMSBound",
            "parameters": [
              {
                "_id": "alpha",
                "name": "Alpha",
                "initial_value": "0.001"
              },
              {
                "_id": "beta1",
                "name": "Beta1",
                "initial_value": "0.9"
              },
              {
                "_id": "beta2",
                "name": "Beta2",
                "initial_value": "0.999"
              },
              {
                "_id": "eps",
                "name": "Epsilon",
                "initial_value": "1.0e-8"
              },
              {
                "_id": "final_lr",
                "name": "FinalLR",
                "initial_value": "0.1"
              },
              {
                "_id": "gamma",
                "name": "Gamma",
                "initial_value": "0.001"
              }
            ]
          },
          {
            "default": false,
            "reference": "Yang You, Igor Gitman, Boris Ginsburg. Large Batch Training of Convolutional Networks. https://arxiv.org/abs/1708.03888",
            "_id": "lars_param",
            "name": "Lars",
            "parameters": [
              {
                "_id": "lr",
                "name": "LearningRate",
                "initial_value": "0.001"
              },
              {
                "_id": "momentum",
                "name": "Momentum",
                "initial_value": "0.9"
              },
              {
                "_id": "coefficient",
                "name": "Coefficient",
                "initial_value": "0.001"
              },
              {
                "_id": "eps",
                "name": "Epsilon",
                "initial_value": "1.0e-6"
              }
            ]
          },
          {
            "default": false,
            "reference": "Ning Qian : On the Momentum Term in Gradient Descent Learning Algorithms. http://www.columbia.edu/~nq6/publications/momentum.pdf",
            "_id": "momentum_param",
            "name": "Momentum",
            "parameters": [
              {
                "_id": "lr",
                "name": "LearningRate",
                "initial_value": "0.01"
              },
              {
                "_id": "momentum",
                "name": "Momentum",
                "initial_value": "0.9"
              }
            ]
          },
          {
            "default": false,
            "reference": "Yurii Nesterov. A method for unconstrained convex minimization problem with the rate of convergence :math:`o(1/k2)",
            "_id": "nesterov_param",
            "name": "Nesterov",
            "parameters": [
              {
                "_id": "lr",
                "name": "LearningRate",
                "initial_value": "0.01"
              },
              {
                "_id": "momentum",
                "name": "Momentum",
                "initial_value": "0.9"
              }
            ]
          },
          {
            "default": false,
            "reference": "Geoff Hinton. Lecture 6a : Overview of mini-batch gradient descent. http://www.cs.toronto.edu/~tijmen/csc321/slides/lecture_slides_lec6.pdf",
            "_id": "rmsprop_param",
            "name": "RMSprop",
            "parameters": [
              {
                "_id": "lr",
                "name": "LearningRate",
                "initial_value": "0.001"
              },
              {
                "_id": "decay",
                "name": "Decay",
                "initial_value": "0.9"
              },
              {
                "_id": "eps",
                "name": "Epsilon",
                "initial_value": "1.0e-8"
              }
            ]
          },
          {
            "default": false,
            "reference": null,
            "_id": "sgd_param",
            "name": "Sgd",
            "parameters": [
              {
                "_id": "lr",
                "name": "LearningRate",
                "initial_value": "0.01"
              }
            ]
          },
          {
            "default": false,
            "reference": "Ilya Loshchilov, Frank Hutter. Decoupled Weight Decay Regularization. https://arxiv.org/abs/1711.05101",
            "_id": "sgdw_param",
            "name": "SgdW",
            "parameters": [
              {
                "_id": "lr",
                "name": "LearningRate",
                "initial_value": "0.001"
              },
              {
                "_id": "momentum",
                "name": "Momentum",
                "initial_value": "0.9"
              },
              {
                "_id": "wd",
                "name": "Weight Decay",
                "initial_value": "0.0001"
              }
            ]
          }
        ]
    };

    return { nnablaCore }
})
