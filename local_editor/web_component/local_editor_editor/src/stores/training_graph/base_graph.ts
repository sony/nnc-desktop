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

import { ref, computed, toRaw } from 'vue'
import { defineStore } from 'pinia'
import {useEditorStore} from '../editor'
import {useResultStore} from '../result'
import { useLRCurveGraphStore } from '@/stores/training_graph/learning_curve_graph'
import { useLRCurveGraphForHtmlStore } from '@/stores/training_graph/learning_curve_for_html'
import { useTradeOffGraphStore } from '@/stores/training_graph/trade_off_graph'

export const useBaseGraphStore = defineStore('base_graph', () => {
    const result_store = useResultStore()
    const learning_curve_graph_store = useLRCurveGraphStore()
    const trade_off_graph_store = useTradeOffGraphStore()
    const learning_curve_for_html_store = useLRCurveGraphForHtmlStore()

    /**
     * translateの計算
     * @param zoomY
     * @returns translate
     */
    function calcTranslate(zoomY: any, svgHeight: any) {
        var trans = zoomY.translate();
        var min = svgHeight * (1 - zoomY.scale());
        if (0 < trans[1]) return [0, 0];
        if (trans[1] < min) return [0, min];
        return trans;
    }

    /**
         * svgタグの追加
         * @param svgWidth
         * @param svgHeight
         * @param zoomY
         * @returns svg
         */
    function addSVG(zoomY: any, type: any, svgWidth: any, svgHeight: any) {
        return d3.select('.result-' + type)
        .append('svg')
        .attr('width', svgWidth)
        .attr('height', svgHeight)
        .style('background-color', 'white')
        .call(zoomY);
    }

    
    function addMainChartContainer(type: any, svgWidth: any, svgHeight: any) {
        let chart_id = 'mainchart'
        d3.select('.result-' + type)
            .append('div')
            .attr('id', 'mainchart')
            .style('width', '100%')
            .style('height', svgHeight + 'px')
            .style('background-color', 'white')
        return chart_id
    }

    function changeMainChartContainerSize(svgWidth: any, svgHeight: any) {
        d3.select('#mainchart')
            .style('width', '100%')
            .style('height', svgHeight + 'px')
    }

    /**
     * 目盛りの追加
     * @param svg
     * @param axis
     * @param className
     * @param transform
     * @param stroke
     * @returns axisScale
     */
    function addAxisScale(svg: any, axis: any, className: any, transform: any, color: any, type: any) {
        return svg.append('g').attr({
            'class': className + ' ' + type,
            'transform': transform,
            'stroke': 'none',
            'fill': color
        }).call(axis);
    }

    /**
     * 目盛り線の追加
     * @param svg
     * @param grid
     * @param className
     * @param translate
     */
    function addGrid(svg: any, grid: any, className: any, translate: any, type: any, stroke?: any) {
        svg.append('g').attr({
            'class': className + ' ' + type,
            'transform': translate,
            'stroke': stroke,
        }).call(grid);
    }

    /**
     * 折れ線グラフの追加
     * @param chartSVG
     * @param d
     * @param stroke
     * @param strokeWidth
     * @param datum
     * @param specificData
     * @returns path
     */
    function addPath(chartSVG: any, d: any, stroke: any, strokeWidth: any, datum: any, specificData: any) {
        var path = chartSVG.append('path');
        if (datum) path.datum(datum);
        // 共通データをセットする
        path.attr({
            'd': d,
            'stroke': stroke,
            'fill': 'none',
            'stroke-width': strokeWidth
        });
        // 個別データがある場合はセットする
        if (specificData) path.attr(specificData);
        return path;
    }

    /**
     * グラフ線の座標を生成する
     * @param x
     * @param y
     * @param funcX
     * @param funcY
     * @returns line
     */
    function createLinePath(x: any, y: any, funcX: any, funcY: any, margin: any, type: any) {
        var line = d3.svg.line()
            .x(function (d: any) {
                return x(funcX(d)) - margin.LEFT; // x軸方向のズレを修正
            })
            .y(function (d: any) {
                return y(funcY(d)) - margin.TOP; // y軸方向のズレを修正
            });
        if (type == 'trade-off') line.interpolate('step-after');
        return line;
    }

    /**
     * ラベルの追加
     * @param className
     * @param labelText
     * @param x
     * @param y
     */
    function addLabel(className: any, labelText: any, x: any, y: any, type: any) {
        d3.select(className + '.' + type)
            .append('text')
            .text(labelText)
            .attr('x', x)
            .attr('y', y);
    }

    /**
     * グラフ描画エリアの追加
     * @param svg
     * @returns chartSVG
     */
    function addChartSVG(svg: any, chartSVGWidth: any, chartSVGHeight: any, margin: any) {
        return svg.append('svg').attr({
            'width': chartSVGWidth,
            'height': chartSVGHeight,
            'x': margin.LEFT,
            'y': margin.TOP
        });
    }

    function _getLearningCurveData(resultId: any, width: any, height: any, margin: any, type: any): any {
        // 初期データ作成
        margin = toRaw(margin)
        var resultData = result_store.data.find(function (training_result: any) { return training_result.job_id == resultId; });
        var comparisonData = result_store.graph.comparison_id ? result_store.data.find((result: any) => result.job_id == result_store.graph.comparison_id) : null;
    
        var isShowableLearningCurve = (job: any) => {
            return ( (job.train_status && job.costs && job.training_errors && job.validation_errors && job.train_status.epoch)
                        && job.type !== 'profile');
        };
    
        if (!isShowableLearningCurve(resultData)) {
            return {
                isShowableLearningCurve: false
            };
        }
    
        var costsValues = resultData.costs;
        var trainingErrorsValues = resultData.training_errors;
        var validationErrorsValues = resultData.validation_errors;
        var currentEpoch = (resultData.train_status.epoch || {}).current;
    
        if (!currentEpoch) {
            currentEpoch = 1;
            costsValues = [0];
            trainingErrorsValues = [0];
            validationErrorsValues = [0];
        }
        let xAxis: any = {
            type: 'category',
            boundaryGap: false,
            name: 'Epoch',
            data: [],
            nameLocation: 'middle',
            nameGap: 30,
            axisLine: {
                lineStyle: {
                    width: 2
                }
            },
            splitLine: {
                show: true,
            },
            // axisLabel: {
            //     formatter: ((num_epoch: any) => {
            //         if(num_epoch % 10 === 0) {
            //           return num_epoch
            //         }
            //     })
            // },
        }
        let yAxis: any = {
            type: result_store.graph.scale === 'log' ? 'log' : 'value',
            logBase: 2,
            name: 'Cost',
            nameLocation: 'start',
            nameGap: 30,
            axisLine: {
                show: true,
                lineStyle: {
                    color: '#006699',
                    width: 2
                }
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: '#00669966',
                }
            }
        }
        let yAxis2: any = {
            type: result_store.graph.scale === 'log' ? 'log' : 'value',
            logBase: 2,
            name: 'Error',
            nameLocation: 'start',
            nameGap: 30,
            axisLine: {
                show: true,
                lineStyle: {
                    color: '#ff6666',
                    width: 2
                }
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: '#ff666666',
                }
            }
        }
        let seriesCost: any = {
            name: 'Cost',
            type: 'line',
            showSymbol: false,
            connectNulls: true,
            yAxisIndex: 0,
            data: [],
            lineStyle: {
                normal: {
                  color: '#006699',
                  width: 3,
                }
            }
        }
        let seriesTrainError: any = {
            name: 'Training Error',
            type: 'line',
            showSymbol: false,
            connectNulls: true,
            yAxisIndex: 1,
            data: [],
            lineStyle: {
                normal: {
                  color: '#ff6666',
                  width: 3,
                }
            }
        }
        let seriesValError: any = {
            name: 'Validation Error',
            type: 'line',
            showSymbol: false,
            connectNulls: true,
            yAxisIndex: 1,
            data: [],
            lineStyle: {
                normal: {
                  color: '#ff6666',
                  width: 3,
                  type: 'dashed'
                }
            }
        }
        let yAxisList = [yAxis, yAxis2]

        for(let i = 0; i < currentEpoch; i++) {
            xAxis.data.push(i + 1)
            seriesCost.data.push(Number(costsValues[i]))
            if (trainingErrorsValues[i] !== undefined) {
                seriesTrainError.data.push(Number(trainingErrorsValues[i]))
            } else {
                seriesTrainError.data.push(null)
            }

            if (validationErrorsValues[i] !== undefined) {
                seriesValError.data.push(Number(validationErrorsValues[i]))
            } else {
                seriesValError.data.push(null)
            }
        }
        let series = [seriesCost, seriesTrainError, seriesValError]

        // comparisonが設定されている場合
        let seriesComparisonCost: any = {
            name: 'Cost (Comparison)',
            type: 'line',
            showSymbol: false,
            connectNulls: true,
            yAxisIndex: 0,
            data: [],
            lineStyle: {
                normal: {
                  color: '#00669966',
                  width: 3,
                }
            }
        }
        let seriesComparisonTrainError: any = {
            name: 'Training Error (Comparison)',
            type: 'line',
            showSymbol: false,
            connectNulls: true,
            yAxisIndex: 1,
            data: [],
            lineStyle: {
                normal: {
                  color: '#ff666666',
                  width: 3,
                }
            }
        }
        let seriesComparisonValError: any = {
            name: 'Validation Error (Comparison)',
            type: 'line',
            showSymbol: false,
            connectNulls: true,
            yAxisIndex: 1,
            data: [],
            lineStyle: {
                normal: {
                  color: '#ff666666',
                  width: 3,
                  type: 'dashed'
                }
            }
        }
        if (comparisonData && isShowableLearningCurve(comparisonData) && resultId !== comparisonData.job_id) {
            var comparisonDataCosts = comparisonData.costs;
            var comparisonDataTrainingErrors = comparisonData.training_errors;
            var comparisonDataValidationErrors = comparisonData.validation_errors;
            const comparisonDataCurrentEpoch = (comparisonData.train_status.epoch || {}).current;
            if(comparisonDataCurrentEpoch > currentEpoch) {
                xAxis.data = []
            }
            for (let i = 0; i < comparisonDataCurrentEpoch; i++) {
                if(comparisonDataCurrentEpoch > currentEpoch) {
                    xAxis.data.push(i + 1)
                }

                var _comparisonCost = comparisonDataCosts[i];
                if (_comparisonCost) {
                    seriesComparisonCost.data.push(_comparisonCost)
                }else {
                    seriesComparisonCost.data.push(null)
                }

                var _comparisonTrainingError = comparisonDataTrainingErrors[i];
                if (_comparisonTrainingError && _comparisonTrainingError !== 0) {
                    seriesComparisonTrainError.data.push(_comparisonTrainingError)
                } else {
                    seriesComparisonTrainError.data.push(null)
                }

                var _comparisonValidationError = comparisonDataValidationErrors[i];
                if (_comparisonValidationError && _comparisonValidationError !== 0) {
                    seriesComparisonValError.data.push(_comparisonValidationError)
                } else {
                    seriesComparisonValError.data.push(null)
                }
            }
            series = series.concat([seriesComparisonCost, seriesComparisonTrainError, seriesComparisonValError])
        }
    
        return {
            isShowableLearningCurve: true,
            xAxis, yAxisList,
            series
        }
    }

    function getChartOption(xAxis: any, yAxis: any, series: any) {
        return {
            dataZoom: [
                {
                    type: 'inside',
                    filterMode: 'none',
                    xAxisIndex: 0,
                    minSpan: 0,
                    moveOnMouseWheel:false
                },
                {
                    type: 'inside',
                    filterMode: 'none',
                    yAxisIndex: [0, 1],
                    minSpan: 0,
                    moveOnMouseWheel:false
                }
            ],
            legend: {
                show: false
            },
            tooltip: {
                trigger: 'none',
                axisPointer: {
                  type: 'cross'
                }
            },
            xAxis: xAxis,
            yAxis: yAxis,
            series: series
        }
    }

    function disposeChart() {
        learning_curve_graph_store.disposeChart()
        learning_curve_for_html_store.disposeChart()
    }

    function reloadChart() {
        learning_curve_graph_store.learningCurve(result_store.getActiveResult().job_id)
        trade_off_graph_store.tradeOff()
    }

    function changeLegendSelect(legendName: string, selected: boolean) {
        learning_curve_graph_store.changeLegendSelect(legendName, selected)
        learning_curve_graph_store.changeLegendSelect(`${legendName} (Comparison)`, selected)
        learning_curve_for_html_store.changeLegendSelect(legendName, selected)
        learning_curve_for_html_store.changeLegendSelect(`${legendName} (Comparison)`, selected)
    }

    return { 
        getChartOption,
        addChartSVG,
        calcTranslate,
        addLabel,
        createLinePath,
        addPath,
        addGrid,
        addAxisScale,
        addSVG,
        addMainChartContainer,
        changeMainChartContainerSize,
        _getLearningCurveData,
        disposeChart,
        reloadChart,
        changeLegendSelect
    }
})
