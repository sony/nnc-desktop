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
import {useBaseGraphStore} from './base_graph'
import {useEditorStore} from '../editor'
import {useDefinitionsStore} from '../misc/definitions'
import {useResultStore} from '../result'
import JobCostAndErrors from '@/objects/JobCostAndErrors'

export const useTradeOffGraphStore = defineStore('trade_off_graph', () => {
    const base_graph_store = useBaseGraphStore()
    const editor_store = useEditorStore()
    const definitions_store = useDefinitionsStore()
    const result_store = useResultStore()

    const type = ref<string>('trade-off');
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
     * GraphAreaのTradeOffGraphを表示する
     * @memberOf sdt.TradeOffGraph
     */
    function tradeOff() {
        var copyArray = function (data: any) {
            return JSON.parse(JSON.stringify(data));
        };

        var getMaxMultiplyAdd = function (data: any) {
            return d3.max(data, function (d: any) {
                return d.multiplyAdd;
            });
        };

        var getMinMultiplyAdd = function (data: any) {
            return d3.min(data, function (d: any) {
                return d.multiplyAdd;
            });
        };

        var getMaxValue = function (data: any) {
            var validationMax: any = d3.max(data, function (d: any) {
                return d.validationError;
            });
            var trainingMax: any = d3.max(data, function (d: any) {
                return d.trainingError;
            });

            return validationMax > trainingMax ? validationMax : trainingMax;
        };

        const getMinValue = (data: any) => Math.min.apply(undefined,
            data.map((d: any) => d.validationError)
            .concat(data.map((d: any) => d.trainingError))
            .filter((x: any) => x !== undefined && x > 0));

        var clearLargeData = function (minData: any) {
            for (var i = minData.length - 1; i >= 0; i--) {
                var currentData = minData[i];
                for (var j = i - 1; j >= 0; j--) {
                    var beforeData = minData[j];
                    if (currentData.validationError > beforeData.validationError) {
                        minData.splice(i, 1);
                        break;
                    }
                }
            }

            return minData;
        };

        var generateLineValue = function (allData: any) {
            var minValues = [];
            for (var i = 0; i < allData.length; i++) {
                var data = allData[i];
                for (var j = 0; j < data.length; j++) {
                    var obj = data[j];
                    var exist = false;
                    for (var k = 0; k < minValues.length; k++) {
                        var minObj = minValues[k];
                        if (obj.multiplyAdd !== minObj.multiplyAdd) {
                            continue;
                        }

                        exist = true;
                        if (obj.validationError < minObj.validationError) {
                            minObj.validationError = obj.validationError;
                            break;
                        }
                    }

                    if (!exist) {
                        minValues.push(obj);
                    }
                }
            }

            minValues = clearLargeData(minValues);
            return minValues;
        };

        var multiplyAddFn = function (d: any) {
            return d.multiplyAdd;
        };
        var validationFn = function (d: any) {
            return d.validationError;
        };
        var trainingFn = function (d: any) {
            return d.trainingError;
        };

        var size = definitions_store.Definitions.GRAPH.TRADE_OFF_PROT_SIZE;

        var colors = ['limegreen', 'pink', 'skyblue', 'darkred'];

        var byTradeOffType = (() => {
            switch (result_store.graph.trade_off_type) {
                case 'All':
                    return (job: any) => true;
                case 'Previous':
                    var activeIndexIn = (array: any) => {
                        var activeId = result_store.getActiveResult().job_id;
                        var index = array.findIndex((job: any) => job.job_id === activeId);
                        activeIndexIn = array => index; // 二回目以降、計算を終えた定数 activeIndex を返すよう関数を書き換え
                        return index;
                    };
                    return (job: any, index: any, filtered: any) => activeIndexIn(filtered) <= index;
                case 'Pareto Only':
                    return (job: any) => job.pareto_optimal;
            }
        })();

        var isShowableTradeOff = (job: any) => {
            const stat = job.train_status;
            return job.type !== 'profile' && job.status !== 'failed' && (stat &&
                (stat.last && stat.last.train_error !== undefined) && // train_errorの値チェック
                ((stat.best && stat.best.valid_error !== undefined) || (stat.last && stat.last.valid_error !== undefined)) && // valid_errorの値チェック
                (stat.statistics || {})[result_store.graph.cost_type]); // statisticsの値チェック
        };

        // データを集める
        var dataset = result_store.data
        .filter(isShowableTradeOff)
        .filter(byTradeOffType)
        .map((job: any) => {
            const costAndErrors: any = new JobCostAndErrors(job, result_store.graph.cost_type);
            return {
                id: job.job_id,
                name: job.job_name,
                trainingError: costAndErrors.training(),
                validationError: costAndErrors.validationBest(),
                multiplyAdd: costAndErrors.cost(),
            };
        });

        // add index for color to keep color after sort.
        for (var i = 0; i < dataset.length; ++i) {
            dataset[i].colorIdx = i;
        }

        dataset.sort((a: any, b: any) => a.multiplyAdd - b.multiplyAdd);

        // TradeOffGraphに表示する演算量(X軸),誤差(Y軸)の領域を計算する
        var domainMultiplyAdd = _calcTradeOffGraphDomain(getMinMultiplyAdd(dataset), getMaxMultiplyAdd(dataset));
        var minMultiplyAdd = domainMultiplyAdd.min;
        var maxMultiplyAdd = domainMultiplyAdd.max;
        var domainError = _calcTradeOffGraphDomain(getMinValue(dataset), getMaxValue(dataset));
        var minError = domainError.min;
        var maxError = domainError.max;

        if (width.value <= margin.value.LEFT || height.value <= margin.value.BOTTOM) {
            $('.result-trade-off svg').remove();
            return;
        };
        var x1 = d3.scale.log().range([margin.value.LEFT, width.value]).domain([minMultiplyAdd, maxMultiplyAdd]);
        var y1 = result_store.graph.scale === 'log' ? d3.scale.log().range([height.value, margin.value.BOTTOM]).domain([minError, maxError])
            : d3.scale.linear().range([height.value, margin.value.BOTTOM]).domain([minError, maxError]);

        var xAxis = d3.svg.axis().scale(x1).orient('bottom').ticks(10, 0);
        var y1Axis = d3.svg.axis().scale(y1).orient('left').ticks(5);
        var line = base_graph_store.createLinePath(x1, y1, multiplyAddFn, validationFn, margin.value, type.value);

        const graphInfo = editor_store.zoomInfo.tradeOffGraph;
        const percentages = graphInfo.percentages;
        const minScale = percentages[0] / 100;
        const maxScale = percentages[percentages.length - 1] / 100;
        var _translate = zoomY.value ? zoomY.value.translate() : [0, 0];
        zoomY.value = d3.behavior.zoom()
            .scaleExtent([minScale, maxScale])
            .on('zoom', function () {
                // マウスホイール操作による拡縮の場合、indexを更新する
                if (d3.event.sourceEvent) graphInfo.percentage = Math.round(zoomY.value.scale() * 100);
                // scaleを更新する
                zoomY.value.scale(graphInfo.percentage / 100);
                zoomY2.scale(graphInfo.percentage / 100);
                // yのtranslateを変更
                zoomY.value.translate(base_graph_store.calcTranslate(zoomY.value, svgHeight.value));
                zoomY2.translate(base_graph_store.calcTranslate(zoomY.value, svgHeight.value));
                // 目盛り位置の変更
                d3.select('.y.axis.trade-off').call(y1Axis);
                // 罫線位置の変更
                d3.select('.y.grid.trade-off').call(yGrid);
                // パレート最適間を結ぶ線の位置の変更
                path.attr('d', line(generateLineValue([copyArray(dataset)])));
                // プロット位置の変更
                dataset.forEach(updateData);
            })
            .scale(graphInfo.percentage / 100);
        var zoomY2 = d3.behavior.zoom().y(y1)
            .scale(graphInfo.percentage / 100);

        // svgタグを生成
        $('.result-trade-off svg').remove();
        svg.value = base_graph_store.addSVG(zoomY.value, type.value, svgWidth.value, svgHeight.value);

        // x, y軸の目盛設定
        var xAxisScale = base_graph_store.addAxisScale(svg.value, xAxis, 'x axis', 'translate(0, ' + height.value + ')', 'black', type.value);
        xAxisScale.selectAll('text')
            .attr({
                transform: 'rotate(20)'
            })
            .style('text-anchor', 'start');
        var y1AxisScale = base_graph_store.addAxisScale(svg.value, y1Axis, 'y axis', 'translate(' + margin.value.LEFT + ', 0)', '#FF6666', type.value);
        d3.select('.result-trade-off .x.axis > path').attr('stroke', 'black').attr('fill', 'none')
        d3.select('.result-trade-off .y.axis > path').attr('stroke', '#006699').attr('fill', 'none')

        // グラフ描画エリアを追加する
        var chartSVG = base_graph_store.addChartSVG(svg.value, chartSVGWidth.value, chartSVGHeight.value, margin.value);

        // パレート最適を結ぶ線の設定
        var path = base_graph_store.addPath(chartSVG, line(generateLineValue([copyArray(dataset)])), 'rgba(255, 127, 80, .5)', 5, "", { 'class': 'line bottom' });

        // ラベル
        base_graph_store.addLabel('.y.axis', 'Error', -40, height.value + 35, type.value);

        x1.domain([minMultiplyAdd, maxMultiplyAdd]);
        y1.domain([minError, maxError]);

        xAxis.scale(x1);
        y1Axis.scale(y1);

        xAxisScale.call(xAxis);
        y1AxisScale.call(y1Axis);

        // xの目盛り線を引く
        var xGrid = d3.svg.axis().scale(x1).orient('bottom').ticks(10, 0).tickSize(-(height.value - margin.value.BOTTOM), 0, 0).tickFormat('');
        base_graph_store.addGrid(svg.value, xGrid, 'x grid', 'translate(0, ' + height.value + ')', type.value);
        // yの目盛り線を引く
        var yGrid = d3.svg.axis().scale(y1).orient('left').ticks(5).tickSize(-(width.value - margin.value.LEFT), 0, 0).tickFormat('');
        base_graph_store.addGrid(svg.value, yGrid, 'y grid', 'translate(' + margin.value.LEFT + ', 0)', type.value);

        var updateData = function (data: any) {
            var validatorClass = 'validation' + (data.colorIdx + 1);
            var validationRectangles = 0 < data.validationError ? chartSVG.selectAll('rect.' + validatorClass).data([data]) : null;
            var trainingClass = 'training' + (data.colorIdx + 1);
            var trainingRectangles = 0 < data.trainingError ? chartSVG.selectAll('rect.' + trainingClass).data([data]) : null;

            var active_size = size * 2;
            var _size = (name: any) => name == result_store.getActiveResult().name ? active_size : size;

            var _show = function (rectangles: any, type: any, params: any) {
                rectangles.enter()
                    .append('rect')
                    .attr('width', _size(data.name))
                    .attr('height', _size(data.name))
                    .attr(params)
                    .on('mouseover', function (d: any) {
                        var error = type == 'Validation' ? d.validationError : d.trainingError;
                        var text = d.name + '<br>' + type + ' Error = ' + error + '<br>' + 'Multiply Add = ' + d.multiplyAdd;
                        var top = d3.event.pageY - 20,
                            left = d3.event.pageX + 10,
                            tooltipWidth: any = $('#tooltip').outerWidth(true),
                            tooltipRight = left + tooltipWidth;
                        if (tooltipRight > window.innerWidth) {
                            left -= tooltipWidth + 20;
                        }
                        return d3.select('#tooltip')
                            .style('visibility', 'visible')
                            .style('top', top + 'px')
                            .style('left', left + 'px')
                            .html(text);
                    })
                    .on('mouseout', function () {
                        return d3.select('#tooltip').style('visibility', 'hidden');
                    })
                    .on('click', function () {
                        result_store.changeActive(result_store.data.find((result: any) => result.job_id == data.id).job_id);
                    });

                // Errorの移動処理
                rectangles.transition()
                    .attr('x', function (d: any) {
                        var x = x1(multiplyAddFn(d));
                        return x - _size(data.name) / 2 // プロットサイズ分のズレを修正
                            - margin.value.LEFT; // x軸方向のズレを修正
                    })
                    .attr('y', function (d: any) {
                        var y = y1(type == "Validation" ? validationFn(d) : trainingFn(d));
                        return y - _size(data.name) / 2 // プロットサイズ分のズレを修正
                            - margin.value.TOP; // y軸方向のズレを修正
                    });
            }

            // ValidationErrorの表示及びツールチップのイベント追加、移動処理
            if (result_store.graph.show_validation_error && validationRectangles) {
                _show(validationRectangles, 'Validation', {
                    'fill': colors[data.colorIdx % colors.length],
                    'class': validatorClass
                });
            }

            // TrainingErrorの表示及びツールチップのイベント追加、移動処理
            if (result_store.graph.show_training_error && trainingRectangles) {
                _show(trainingRectangles, 'Training', {
                    'fill': 'rgba(0, 0, 0, 0)',
                    'stroke': colors[data.colorIdx % colors.length],
                    'class': trainingClass
                });
            }
        };

        zoomY.value.translate(_translate);
        zoomY2.translate(_translate);
        // 目盛り位置の変更
        d3.select('.y.axis.trade-off').call(y1Axis);
        // 罫線位置の変更
        d3.select('.y.grid.trade-off').call(yGrid);
        // パレート最適間を結ぶ線の位置の変更
        path.attr('d', line(generateLineValue([copyArray(dataset)])));

        dataset.forEach(updateData);
    }

    /**
     * TradeOffGraphに表示する領域を求める
     * @param min
     * @param max
     * @returns {min, max}
     * @memberOf sdt.TradeOffGraph
     */
    function _calcTradeOffGraphDomain(min: any, max: any) {
        if(min !== 0) {
            var logMpx = Math.log(max / min);
            if (min < max && Math.log(10.0) <= logMpx) {
                min /= Math.exp(logMpx / 20);
                max *= Math.exp(logMpx / 20);
            } else {
                var center = Math.log(min * max) * 0.5;
                min = Math.exp(center - Math.log(10.0) * 0.5);
                max = Math.exp(center + Math.log(10.0) * 0.5);
            }
        }
        if (max === 0) max = 1;
        return { min: min, max: max }
    }

    /**
     * 拡縮率を変更する
     * @param scale
     */
    function zoom(scale: any) {
        zoomY.value.scale(scale);
        zoomY.value.event(svg.value);
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
        tradeOff,
        zoom
    }
})
