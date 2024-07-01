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
import {useUtilsStore} from '../utils'
import {useLanguageStore} from './languages'
import {useSVGAreaStore} from '../editor/svgarea'
import {useLRCurveGraphStore} from '../training_graph/learning_curve_graph'
import {useTradeOffGraphStore} from '../training_graph/trade_off_graph'
import WarningSvgUrl from '@/assets/image/Warning.svg'
import UnitWhiteSvgUrl from '@/assets/image/UnitWhite.svg'

export const useDefinitionsStore = defineStore('definitions', () => {
    const util_store = useUtilsStore()
    const lang_store = useLanguageStore()
    const svgarea_store = useSVGAreaStore()
    const learning_curve_graph_store = useLRCurveGraphStore()
    const trade_off_graph_store = useTradeOffGraphStore()

    const CoreDomain = `http://${window.location.host}/`
    const color = {
        system3: rgbColor('#00FFFF'),
        gray0: rgbColor('#ffffff'),
        gray1: rgbColor('#f2f2f2'),
        gray4: rgbColor('#8C8C8C'),
        gray5: rgbColor('#262626'),
        layer3: rgbColor('#7a997a'),
    }

    const Languages = ['en', 'ja']
    const DefaultLanguage = 'ja'
    const DefaultNumNode = ref<number>(1)

    const Definitions = ref({
        MIN_WIDTH: {
            LEFT_PANE: 280,
            RIGHT_PANE: 320
        },
        USER: {
            ID: function() {
                return localStorage.getItem('u');
            },
            ACCOUNT: function() {
                return localStorage.getItem('a');
            }
        },
        AVAILABLE_ABCI: true,
        CORE_API: {
            VERSION: 'v1',
            baseUrl: function () {
                return CoreDomain + this.VERSION;
            },
            usersUrl: function() {
                return this.baseUrl() + '/users/' + localStorage.getItem('u');
            },
        },
        HTTP_STATUS_CODE: {
            GATEWAY_TIMEOUT: 504
        },
        DEFAULT_INSTANCE_GROUP: 1,
        PRECISION_UNSUPPORTED_INSTANCES: [1, 2],
        LOCALE: localStorage.getItem('l'),
        AGREED_BILLING_SYSTEM: function() {
            return localStorage.getItem('s') === 'true'
        },
        AGREED_PRIVATE_BILLING: function() {
            return localStorage.getItem('p') === 'true'
        },
        REGISTRABLE: function () {
            // return this.LOCALE === 'ja-JP';
            return true;
        },
        KEY_CODE: {
            ENTER: 13,
            SHIFT: 16,
            CTRL: 17,
            ESC: 27,
            LEFT: 37,
            UP: 38,
            RIGHT: 39,
            DOWN: 40,
            DEL: 46,
            A: 65,
            C: 67,
            L: 76,
            R: 82,
            S: 83,
            T: 84,
            V: 86,
            X: 88,
            Y: 89,
            Z: 90,
            CMD: 91,
            F5: 116,
            BACKSPACE: 8,
            TAB: 9,
            INSERT: 45,
            ZERO: 48,
            PLUS_MAC: 186,
            PLUS_WIN: 187,
            MINUS: 189
        },
        strings: {
            menu_training_extract_network: 'Open in EDIT Tab',
            menu_training_extract_network_w_weight: 'Open in EDIT Tab with Weight',
            menu_retrain_not_in_place: 'Retrain',
            prompt_message: function(type: any) {
                return util_store.format(lang_store.language.ENTER_NEW_PROJECT_NAME, type);
            }
        },
        GRAPH: {
            MARGIN: {
                TOP: 25,
                RIGHT: 20,
                BOTTOM: 30,
                LEFT: 50,
            },
            WINDOW_SIZE: {
                WIDTH: 928,
                HEIGHT: 522,
            },
            SIZE: {
                WIDTH: 809,
                HEIGHT: 442,
            },
            TRADE_OFF_PROT_SIZE: 8,
        },
        CONFUSION_MATRIX: {
            ROW: {
                DEFAULT_NUMBER_OF_DISPLAY: 100,
                INCREASE_AMOUNT_PER_SCROLL: 50
            },
            COLUMN: {
                DEFAULT_NUMBER_OF_DISPLAY: 100,
                INCREASE_AMOUNT_PER_SCROLL: 50
            },
        },
        ZOOM_INFO: {
            'Editor': {
                percentages: [25, 33, 50, 67, 75, 80, 90, 100, 110, 125, 150, 175, 200, 250, 300, 400, 500],
                callback: () => svgarea_store.requestAdjustSize(),
            },
            'Learning Curve': {
                percentages: [100, 141, 200, 282, 400, 565, 800, 1131, 1600],
                callback: (percentage: number) => learning_curve_graph_store.zoom(percentage / 100),
            },
            'Trade-off Graph': {
                percentages: [100, 141, 200, 282, 400, 565, 800, 1131, 1600],
                callback: (percentage: number) => trade_off_graph_store.zoom(percentage / 100),
            },
            'trainParamsVisualization': {
                percentages: [100, 141, 200, 282, 400, 565, 800, 1131, 1600],
                callback: (percentage: number) => trade_off_graph_store.zoom(percentage / 100),
            },
        },
        PREVIEWABLE_DATA_NUM: 500,
        ITEMS_PER_PAGE: 10,
        COLOR: color,
        EDIT: {
            SVG_ID: 'svg#network-editor',
            GRID: {
                RADIUS: 2,
                SIZE: 20,
            },
            CONNECTOR: {
                IN: 'in',
                OUT: 'out',
                ACCEPTS: {
                    MULTIPLE: 'Multiple',
                    NONE: 'None',
                    SINGLE: 'Single',
                },
            },
            LINK: {
                STROKE_COLOR: color.gray5,
                CLICKABLE_STROKE_WIDTH: 12,
                DEFAULT: {
                    STROKE_WIDTH: 2,
                },
                FOCUSED: {
                    STROKE_WIDTH: 3,
                    STROKE_COLOR: color.system3,
                },
                FOCUSED_DRAG: {
                    STROKE_WIDTH: 2,
                    STROKE_COLOR: color.system3,
                    FILTER_URL: ''
                },
            },
            LAYER: (() => {
                var GRID = 20; // XXX should be changed to refer this EDIT.GRID.SIZE
                var WIDTH = GRID * 10;
                var HEIGHT = GRID * 2;

                return {
                    RECT_WIDTH: WIDTH,
                    RECT_HEIGHT: HEIGHT,
                    RECT_BORDER_WIDTH: 1,

                    UNIT: {
                        OFFSET_X: 4,
                        OFFSET_Y: 4,
                        WIDTH: 32,
                        HEIGHT: 32,
                        IMAGE_SOURCE: UnitWhiteSvgUrl
                    },

                    WARN: {
                        OFFSET_X: -8,
                        OFFSET_Y: 11,
                        WIDTH: 16,
                        HEIGHT: 16,
                        IMAGE_SOURCE: WarningSvgUrl,
                    },

                    DROPCAP_CHAR: {
                        OFFSET_X: GRID * 1,
                        OFFSET_Y: 32,
                        FONTCOLOR: 'white',
                        FONTSIZE: '32px',
                        OPACITY: 0.5,
                        TEXT_ANCHOR: 'middle',
                    },

                    NAME_LABEL: {
                        OFFSET_X:0,
                        OFFSET_Y: 12,
                        FONTCOLOR: 'white',
                        FONTSIZE: '12px',
                    },

                    PROPERTY_LABEL: {
                        OFFSET_X: 0,
                        OFFSET_Y: GRID + 8,
                        FONTCOLOR: 'white',
                        FONTSIZE: '11px',
                        OPACITY: 1,
                    },

                    CONNECTOR: {
                        OFFSET_X: WIDTH / 2,
                        OUTPIN_OFFSET_Y: HEIGHT,
                        RADIUS: 4,
                        JOIN_RADIUS: 2,
                        STROKE_COLOR: color.gray5,
                        STROKE_WIDTH: 2, // リンク接続ありのコネクタとサイドコネクタは円に枠を付けている

                        SIDE: {
                            RADIUS: 10,
                            OPACITY: 0.5,
                            FILL_COLOR: 'gray',
                            START_OFFSET_X: 186,
                            START_OFFSET_Y: 26,
                            MARGIN_X: 16,
                            MARGIN_Y: 13,
                            LABEL: {
                                OFFSET_X: 1,
                                OFFSET_Y: 3,
                                FONTCOLOR: 'white',
                                FONTSIZE: '9px',
                                FONTWEIGHT: 'bold',
                                OPACITY: 0.75,
                            },
                        },
                    },

                    STATISTICS: {
                        BAR: {
                            OFFSET_X: WIDTH + 4,
                            OFFSET_Y: GRID * 2 - 4,
                            WIDTH: 0,
                            MAXWIDTH: GRID * 3, // レイヤー統計量（レイヤー右側のバー）
                            HEIGHT: 4, // レイヤー統計量（レイヤー右側のバー）
                            FILL_COLOR: color.gray4,
                        },
                        LABEL: {
                            OFFSET_X: WIDTH + 4,
                            OFFSET_Y: GRID * 2 - 8,
                            FONTCOLOR: color.gray5,
                            PARAMFONTCOLOR: color.layer3,
                            FONTSIZE: '12px',
                        },
                    },

                    ORDER: {
                        FONTCOLOR: color.gray5,
                        FONTSIZE: '12px',
                        OFFSET_X: (WIDTH / 2) + 5,
                        OFFSET_Y: HEIGHT + 15
                    },

                    REPEAT: {
                        FONTCOLOR: color.gray5,
                        FONTSIZE: '12px',
                        OFFSET_X: WIDTH + 4,
                        OFFSET_Y: GRID - 5,
                    },

                    BOUNDING_BOX: {
                        WIDTH: WIDTH + GRID * 4,
                        HEIGHT: HEIGHT,
                    },

                    FRAME: {
                        WIDTH: WIDTH,
                        HEIGHT: HEIGHT,
                        FILL_COLOR: 'none',
                        STROKE_WIDTH: 1,
                        DEFAULT: {
                            STROKE_COLOR: null,
                            FILTER_URL: null
                        },
                        FOCUSED: {
                            STROKE_COLOR: color.system3,
                            FILTER_URL: 'url(#frameshadow)',
                        },
                    },

                    DESTINATION_FRAME: {
                        WIDTH: WIDTH,
                        HEIGHT: HEIGHT,
                        FILL_COLOR: 'none',
                        STROKE_COLOR: color.gray1,
                        STROKE_WIDTH: 2,
                    },

                    CLIP_PATH: {
                        ID: 'nnc-layer-text-clipper',
                        WIDTH: GRID * 8,
                        HEIGHT: (GRID - 4) * 2,
                        OFFSET_X: GRID * 2,
                        OFFSET_Y: 4,
                    },

                    COMMENT: {
                        FILL_COLOR: color.gray0,
                        FONT_SIZE: '14px',
                    },
                };
            })(),
            LASSO: {
                FILL_COLOR: 'none',
                STROKE_COLOR: 'gray',
                STROKE_WIDTH: 2,
            },
            NETWORK_HIDDEN_TIME: 300
        },
        TRAINING: {
            VISUALIZATION: {
                POINT_SIZE: 1,
                MAX_WEIGHT: 1024
            },
            PERFORMANCE_GRAPH: {
                FONT_COLOR: 'rgb(38, 38, 38)',
                FONT_SIZE: 20,
                BACKGROUND_COLOR: 'rgba(0, 102, 153, 0.2)',
                BORDER_COLOR: 'rgb(0, 102, 153)',
                BORDER_WIDTH: 4,
                LINE_TENSION: 0,
                PADDING: 16,
                DISPLAY_FORMATS: 'HH:mm:ss',
                MAX_TICKS_LIMIT: 5,
            },
        },
        DATASET: {
            SAMPLE_DATASET_TENANT_ID: 'ccbf15a0-bcb6-4ba6-b10e-27fc877c4348',
            GET_DATASETS_LIMIT: 50,
            SHOW_MAX_COLUMN: 50,
            GET_COLUMN_INTERVAL: 10
        },
        CONFIG: {
            UPDATE_INTERVAL_UNIT: {
                EPOCH: 0,
                ITERATION: 1
            },
            MAX_EPOCH: 30000,
            METADATA: {
                MAX_LENGTH: 128
            }
        },
        MODAL: {
            TABBABLE_CLASS: 'modal-tabbable'
        },
        EVALUATION: {
            GRAPH: {
                BAR_CHART_THICKNESS: 0.4,
                BAR_PERCENTAGE: 1,
                BAR_COLOR_TRUE: '#009994',
                BAR_COLOR_FALSE: '#990048',
                LABEL: {
                    WIDTH: 30,
                    PADDING: 20
                },
                TOOL_TIP: {
                    TITLE_SIZE: 0,
                    BACKGROUND_COLOR: 'white',
                    BORDER_COLOR: 'rgb(216, 216, 216)',
                    BORDER_WIDTH: 1,
                    CORNER_RADIUS: 4,
                    BODY_COLOR: 'rgb(38, 38, 38)'
                },
                PARTITION: '20'
            },
            PUBLISH_API: {
                DEFAULT_START_TIME: '09',
                DEFAULT_END_TIME: '17',
                MINUTE_INTERVAL: 15,
            },
        },
        CONTEXT: {
            TRAINING_AND_VALIDATION: 'Training&Validation',
            TRAINING: 'Training',
            VALIDATION: 'Validation',
            LOG_SCALE_GRAPH: 'Log Scale Graph',
        },
        PLUGIN: {
            LOG_POLLING_INTERVAL: 5 * 1000,
            GET_RESULT_POLLING_INTERVAL: 10 * 1000,
            // 5分
            MAX_POLLING_TIME: 300 * 1000,
            INPUT_TYPE: {
                SELECT: 'select',
                INT: 'int',
                STRING: 'str',
                PATH: 'path',
                BOOLEAN: 'bool',
            }
        },
        ABCI_USE_RATE: {
            POLLING_INTERVAL: 5 * 60 * 1000,
            THRESHOLD: 90
        }
    })

    function rgb_from(hex: string) {
        return parseInt(hex, 16)
    }

    function rgbColor(hex: string) {
        const _color = /#(..)(..)(..)/.exec(hex)
        if(_color) {
        return 'rgb(' + [rgb_from(_color[1]!), rgb_from(_color[2]), rgb_from(_color[3]),].join(', ') + ')'
        }
    }

    return { 
        Definitions,
        CoreDomain,
        DefaultNumNode
    }
})
