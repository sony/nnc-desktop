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

import { ref, computed, shallowRef } from 'vue'
import { defineStore } from 'pinia'
import {useBaseGraphStore} from './base_graph'
import {useResultStore} from '../result'
import {useEditorStore} from '../editor'
import {useDefinitionsStore} from '../misc/definitions'
import * as echarts from 'echarts';

export const useLRCurveGraphStore = defineStore('lr_curve_graph', () => {
    const base_graph_store = useBaseGraphStore()
    const result_store = useResultStore()
    const definitions_store = useDefinitionsStore()
    const editor_store = useEditorStore()

    const type = ref<string>('learning-curve');
    const margin = ref<any>(null)
    const width = ref<any>(null)
    const height = ref<any>(null)
    // グラフを表示するウィンドウ全体のサイズ
    const svgWidth = ref<any>(null)
    const svgHeight = ref<any>(null)
    // グラフを表示するエリアのサイズ
    const chartSVGWidth = ref<any>(null)
    const chartSVGHeight = ref<any>(null)
    const chart = shallowRef<any>(undefined)
    const end_x = ref<number>(100)

    const previous_scale = ref<number>(100) // zoomscale * 1e4
    const previous_yAxisScale = ref<string>('value') // 'value' or 'log'

    function init() {
        margin.value = definitions_store.Definitions.GRAPH.MARGIN
        width.value = definitions_store.Definitions.GRAPH.WINDOW_SIZE.WIDTH - definitions_store.Definitions.GRAPH.MARGIN.RIGHT - definitions_store.Definitions.GRAPH.MARGIN.LEFT
        height.value = definitions_store.Definitions.GRAPH.WINDOW_SIZE.HEIGHT - definitions_store.Definitions.GRAPH.MARGIN.TOP - definitions_store.Definitions.GRAPH.MARGIN.BOTTOM
        svgWidth.value = definitions_store.Definitions.GRAPH.WINDOW_SIZE.WIDTH
        svgHeight.value = definitions_store.Definitions.GRAPH.WINDOW_SIZE.HEIGHT
        chartSVGWidth.value = definitions_store.Definitions.GRAPH.SIZE.WIDTH
        chartSVGHeight.value = definitions_store.Definitions.GRAPH.SIZE.HEIGHT
    }
    
    function floatClose(a: number, b: number, tolerance: number): boolean {
        return Math.abs(a - b) <= tolerance;
    }
    

    /**
     * GraphAreaのLearningCurveGraphを表示する
     * @param resultId
     * @memberOf nnc.learningCurveGraph
     */
    function learningCurve(_resultId: any) {
        var {isShowableLearningCurve, xAxis, yAxisList, series} = base_graph_store._getLearningCurveData(_resultId, width.value, height.value, margin.value, type.value)
        if (!isShowableLearningCurve) {
            return;
        }
        if(!chart.value) {
            let chart_id = base_graph_store.addMainChartContainer(type.value, svgWidth.value, svgHeight.value);
            let chart_dom = document.getElementById(chart_id)
            
            if(chart_dom) {
                chart.value = echarts.init(document.getElementById(chart_id));
                chart.value.setOption(base_graph_store.getChartOption(xAxis, yAxisList, series))
                previous_yAxisScale.value = yAxisList[0].type
                chart.value.on('dataZoom', (e: any) => {
                    let scale = undefined
                    scale = Math.ceil(Math.abs((100 * 100) / (e.batch[0].start - e.batch[0].end)))
                    previous_scale.value = scale // avoid learningCurve.zoom callback
                    editor_store.zoomInfo.learningCurve.zoom(scale)
                    end_x.value = e.batch[0].end
                })
            }
        } else {
            if (end_x.value === 100 || previous_yAxisScale.value !== yAxisList[0].type) {
                chart.value.setOption(base_graph_store.getChartOption(xAxis, yAxisList, series), true)
                previous_yAxisScale.value = yAxisList[0].type
                end_x.value = 100
                editor_store.zoomInfo.learningCurve.zoom(100)
            }
        }

        base_graph_store.changeMainChartContainerSize(svgWidth.value, svgHeight.value)
        if(chart.value) {
            chart.value.resize()
            changeLegendSelect("Training Error", result_store.graph.show_training_error)
            changeLegendSelect("Training Error (Comparison)", result_store.graph.show_training_error)
            changeLegendSelect("Validation Error", result_store.graph.show_validation_error)
            changeLegendSelect("Validation Error (Comparison)", result_store.graph.show_validation_error)
        }
    }

    function changeLegendSelect(legendName: string, selected: boolean) {
        if(chart.value) {
            let action_type = selected ? 'legendSelect' : 'legendUnSelect'
            chart.value.dispatchAction({
                type: action_type,
                name: legendName
            })
        }
    }
    
    function disposeChart() {
        if(chart.value) {
            chart.value.dispose()
            chart.value = undefined
            $('.result-learning-curve div').remove();
        }
    }
    
    function zoom(scale: any) {
        // console.log("learning curve zoom: ", scale)
        if(chart.value && !floatClose(previous_scale.value, scale * 1e4, 1)) {
            let start = ((scale * 100 - 1) / (scale * 100 * 2)) * 100
            let end = 100 - start
            chart.value.dispatchAction(
                {
                    type: 'dataZoom',
                    batch: [
                        {
                            start: start,
                            end: end,
                            xAxisIndex: 0
                        },
                        {
                            start: start,
                            end: end,
                            yAxisIndex: [0, 1]
                        }
                    ]
                }
            )
        }
    }

    return { 
        width,
        height,
        svgWidth,
        svgHeight,
        chartSVGHeight,
        chartSVGWidth,
        margin,
        init,
        learningCurve,
        zoom,
        changeLegendSelect,
        disposeChart
    }
})
