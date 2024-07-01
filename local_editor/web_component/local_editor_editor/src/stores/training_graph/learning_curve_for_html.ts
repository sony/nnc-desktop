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
import {useEditorStore} from '../editor'
import {useDefinitionsStore} from '../misc/definitions'
import {useResultStore} from '../result'
import * as echarts from 'echarts';

export const useLRCurveGraphForHtmlStore = defineStore('learning_curve_for_html', () => {
    const base_graph_store = useBaseGraphStore()
    const editor_store = useEditorStore()
    const result_store = useResultStore()
    const definitions_store = useDefinitionsStore()

    const type = ref<string>('learning-curve_for_html');
    const resultId = ref<any>(undefined)
    const margin = ref<any>(null)
    const width = ref<any>(null)
    const height = ref<any>(null)
    // グラフを表示するウィンドウ全体のサイズ
    const svgWidth = ref<any>(null)
    const svgHeight = ref<any>(null)
    // グラフを表示するエリアのサイズ
    const chartSVGWidth = ref<any>(null)
    const chartSVGHeight = ref<any>(null)
    const zoomY = ref<any>(undefined)
    // svg element
    const svg = ref<any>(undefined)
    const chart = shallowRef<any>(undefined)

    function init() {
        margin.value = definitions_store.Definitions.GRAPH.MARGIN
        width.value = definitions_store.Definitions.GRAPH.WINDOW_SIZE.WIDTH - definitions_store.Definitions.GRAPH.MARGIN.RIGHT - definitions_store.Definitions.GRAPH.MARGIN.LEFT
        height.value = definitions_store.Definitions.GRAPH.WINDOW_SIZE.HEIGHT - definitions_store.Definitions.GRAPH.MARGIN.TOP - definitions_store.Definitions.GRAPH.MARGIN.BOTTOM
        svgWidth.value = definitions_store.Definitions.GRAPH.WINDOW_SIZE.WIDTH
        svgHeight.value = definitions_store.Definitions.GRAPH.WINDOW_SIZE.HEIGHT
        chartSVGWidth.value = definitions_store.Definitions.GRAPH.SIZE.WIDTH
        chartSVGHeight.value = definitions_store.Definitions.GRAPH.SIZE.HEIGHT
    }

    /**
     * GraphAreaのLearningCurveGraphを表示する
     * @param resultId
     * @memberOf nnc.learningCurveGraph
     */
    function learningCurve(_resultId: any) {
        var { isShowableLearningCurve, xAxis, yAxisList, series } = base_graph_store._getLearningCurveData(_resultId, width.value, height.value, margin.value, type.value);
        if (!isShowableLearningCurve) {
            return;
        }
        
        if(!chart.value) {
            let chart_dom = document.getElementById('learning_curve_for_html')
            if(chart_dom) {
                chart.value = echarts.init(chart_dom, null, { renderer: 'svg' });
                chart.value.setOption(base_graph_store.getChartOption(xAxis, yAxisList, series))
            }
        }
        base_graph_store.changeMainChartContainerSize(svgWidth.value, svgHeight.value)
        if(chart.value) {
            chart.value.resize()
            chart.value.setOption(base_graph_store.getChartOption(xAxis, yAxisList, series))
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
            $('.result-learning-curve_for_html div').remove();
        }
    }

    return { 
        init,
        learningCurve,
        disposeChart,
        changeLegendSelect
    }
})
