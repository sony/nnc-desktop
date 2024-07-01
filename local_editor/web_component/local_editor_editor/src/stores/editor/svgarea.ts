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

import { ref, isProxy, toRaw } from 'vue'
import { defineStore } from 'pinia'
import {useSDUUtilsStore} from './sduutils'
import {useLayerStore} from './layer'
import {useLinkStore} from './link'
import {useUtilsStore} from '../utils'
import {useDefinitionsStore} from '../misc/definitions'
import {useEditorStore} from '../editor'
import {useHistoryStore} from '../history'
import { useConnectorStore } from './connector'
import { useSDNEditorStore } from './sdneditor'
import {useSelectionStore} from '../selection'
import {useGraphStore} from '../graph'
import { useNetworkStore } from '../network'
import {useNNABLACoreDefStore} from '../nnabla_core_def'
import Layer from '@/objects/Layer'
import SetSDU from "@/objects/SetSDU";
// import $ from "jquery";
// import * as d3 from "d3";

export const useSVGAreaStore = defineStore('svgarea', () => {
    const sduutils_store = useSDUUtilsStore()
    const definitions_store = useDefinitionsStore()
    const graph_store = useGraphStore()
    const link_store = useLinkStore()
    const editor_store = useEditorStore()
    const history_store = useHistoryStore()
    const layer_store = useLayerStore()
    const selection_store = useSelectionStore()
    const utils_store = useUtilsStore()
    const connector_store = useConnectorStore()
    const sdneditor_store = useSDNEditorStore()
    const network_store = useNetworkStore()
    const nnabla_core_store = useNNABLACoreDefStore()

    const _svgTopLevel = ref<any>()
    const _svgBackground = ref<any>()
    const _svgLayers = ref<any>()
    const _svgLinks = ref<any>()
    const _svgFocuses = ref<any>()
    const _svgDots = ref<any>()
    const _svgDom = ref<any>()
    const _svgDefs = ref<any>()
    const _svgPatterns = ref<any>()
    const _svgScroller = ref<any>()
    const _dragContext = ref<any>()
    const _eventCallbacksMouseEnter = ref<any>(new SetSDU(sduutils_store))
    const _isInit = ref<boolean>(false)

    function init() {
        if(!_isInit.value) {
            const GRID = definitions_store.Definitions.EDIT.GRID.SIZE
            const RADIUS = definitions_store.Definitions.EDIT.GRID.RADIUS
            _svgTopLevel.value = d3.select(definitions_store.Definitions.EDIT.SVG_ID);
            _svgBackground.value = _svgTopLevel.value.append('g').attr('name', 'background');
            _svgLayers.value = _svgTopLevel.value.append('g').attr('name', 'layers').attr('id', 'network-editor-nodes');
            _svgLinks.value = _svgTopLevel.value.append('g').attr('name', 'links').attr('id', 'network-editor-links');
            _svgFocuses.value = _svgTopLevel.value.append('g').attr('name', 'focuses').attr('id', 'network-editor-focuses');
            _svgDots.value = _svgBackground.value.append('g').attr('name', 'grid-dots');
    
            _svgDefs.value = _svgTopLevel.value.append('defs');
            _svgPatterns.value = _svgDefs.value.append('pattern').attr('id', 'grid-pattern').attr('patternUnits', 'userSpaceOnUse').attr('width', GRID).attr('height', GRID);
            _svgPatterns.value.append('circle')
                .attr('cx', '0').attr('cy', '0').attr('r', RADIUS).attr('pointer-events', 'none')
                .style('fill', 'lightgray');
    
            _svgDots.value.append('rect').attr('fill', 'url(#grid-pattern)').attr('width', '100%').attr('height', '100%');
            _svgDots.value.style('display', 'none');
            
            _svgTopLevel.value.on('mouseenter', () => {
                var mouse = d3.mouse(d3.event.target);
                _eventCallbacksMouseEnter.value.apply((callback: any) => callback({x: mouse[0], y: mouse[1]}));
            }).on('click', () => {
                if(!_svgDom.value) {
                    _svgDom.value = document.getElementById('network-editor');
                }
                _svgDom.value.focus();
            }).call(d3.behavior.drag()
                .on("dragstart", () => {
                    _dragContext.value = _createLassoSelectionContext(_mouseToWorldCoordinate(d3.event.sourceEvent.target));
                })
                .on("drag", () => {
                    _dragContext.value.move(_mouseToWorldCoordinate(_svgDom.value));
                })
                .on("dragend", () => {
                    _dragContext.value.destroy();
                    _dragContext.value = undefined;
                })
            );
            _isInit.value = true
        }
    }

    // リンク線を管理する SVG グループへの参照を返す
    function linkGroup() {
        return _svgLinks.value
    }

    // フォーカスを管理する SVG グループへの参照を返す
    function focusGroup() {
        return _svgFocuses.value
    }

    // レイヤーを管理する SVG グループへの参照を返す
    function layerGroup() {
        return _svgLayers.value
    }

    function showGrid() {
        _svgDots.value.style('display', null)
    } 

    function hideGrid() {
        _svgDots.value.style('display', 'none')
    } 

    // widthを返す
    function width() {
        return parseInt(_svgTopLevel.value.style("width"))
    }

    // heightを返す
    function height() {
        return parseInt(_svgTopLevel.value.style("height"))
    }

    // widthとheightを設定する
    var _setSize = (width: any, height: any) => {
        if(!_svgTopLevel.value) {
            init()
        }
        _svgTopLevel.value.style("width", width);
        _svgTopLevel.value.style("height", height);
    };

    function _windowWidth() {
        if(!_svgScroller.value) {
            _svgScroller.value = $('.network-editor-scroller');
        }
        return _svgScroller.value.width()
    }

    function _windowHeight() {
        if(!_svgScroller.value) {
            _svgScroller.value = $('.network-editor-scroller');
        }
        return _svgScroller.value.height()
    }

    /**
     * Layerの位置を計算して、他のLayerに重ならないようにする
     * @param type
     * @returns {{x: number, y: number}}
     */
    function calcNewLayerPosition(type: any){
        const GRID = definitions_store.Definitions.EDIT.GRID.SIZE
        var component: any = utils_store.getComponent(type);
        var x = GRID, y = GRID;
        if (component.layout == "top") {
            x = searchPositionX(x, y);
        } else {
            var focusedLayer = selection_store.layer.focused();
            if (focusedLayer) {
                x = focusedLayer.getPosition().x;
                if (focusedLayer.component().output === 0) {
                    y = focusedLayer.getPosition().y + definitions_store.Definitions.EDIT.LAYER.BOUNDING_BOX.HEIGHT + GRID;
                } else {
                    y = focusedLayer.getPosition().y + definitions_store.Definitions.EDIT.LAYER.BOUNDING_BOX.HEIGHT;
                }
                x = searchPositionX(x, y);
            } else {
                y = searchPositionY(x, y);
            }
        }
        return {x: x, y: y};
    }

    /**
     * LayerのX軸について、他のLayerと重なっていないかチェックする
     * @param x
     * @param y
     * @param exceptingLayers チェック対象から除外するレイヤーの配列
     * @returns {*}
     */
    function searchPositionX(x: any, y: any, exceptingLayers?: any) {
        const GRID = definitions_store.Definitions.EDIT.GRID.SIZE;
        var toStr = (position: any) => '(' + position.x + ', ' + position.y + ')';
        var compList = graph_store.getLayers().filter((layer: any) => {
            let handledLayer = layer
            if(exceptingLayers && !isProxy(exceptingLayers[0]) && isProxy(layer)) {
                handledLayer = toRaw(layer)
            }
            return ((!exceptingLayers || exceptingLayers.indexOf(handledLayer) == -1)
                && (y - GRID - 1) < layer.getPosition().y
                && layer.getPosition().y < (y + definitions_store.Definitions.EDIT.LAYER.BOUNDING_BOX.HEIGHT));
        });
        compList.sort((a: any, b: any) => a.getPosition().x - b.getPosition().x);
        var i;
        var checkPosX = x;
        if (compList.length === 0) {
            return checkPosX;
        }
        if (compList[0].getPosition().x - definitions_store.Definitions.EDIT.LAYER.BOUNDING_BOX.WIDTH >= checkPosX) {
            return checkPosX;
        }
        for (i = 1; i < compList.length; i++) {
            var layer1 = compList[i - 1];
            var layer2 = compList[i];
    //            if(layer1.getPositionX)
            var compX = layer1.getPosition().x + definitions_store.Definitions.EDIT.LAYER.BOUNDING_BOX.WIDTH > checkPosX ? layer1.getPosition().x + definitions_store.Definitions.EDIT.LAYER.BOUNDING_BOX.WIDTH : checkPosX;
            if (layer2.getPosition().x - compX >= definitions_store.Definitions.EDIT.LAYER.BOUNDING_BOX.WIDTH) {
                return compX;
            }
        }
        if (compList[compList.length - 1].getPosition().x + definitions_store.Definitions.EDIT.LAYER.BOUNDING_BOX.WIDTH <= checkPosX) {
            return checkPosX;
        } else {
            return compList[compList.length - 1].getPosition().x + definitions_store.Definitions.EDIT.LAYER.BOUNDING_BOX.WIDTH;
        }
    }

    /**
     * LayerのY軸について、他のLayerと重なっていないかチェックする
     * @param x
     * @param y
     * @returns {*}
     */
    var searchPositionY = (x: any, y: any) => {
        const GRID = definitions_store.Definitions.EDIT.GRID.SIZE;
        var compList = graph_store.getLayers().filter((layer: any) => {
            var layerX = layer.getPosition().x;
            var layerRightX = layerX + definitions_store.Definitions.EDIT.LAYER.BOUNDING_BOX.WIDTH;
            var xRight = x + definitions_store.Definitions.EDIT.LAYER.BOUNDING_BOX.WIDTH - GRID;
            if ((x >= layerX && x <= layerRightX) || (xRight >= layerX && xRight <= layerRightX)) {
                return true;
            }
            return false;
        });
        if (compList.length === 0) {
            return y;
        }
        compList.sort((a: any, b: any) => a.getPosition().x - b.getPosition().x);
        var checkPosY = y;
        for (var i = 0; i < compList.length; i++) {
            var layer = compList[i];
            var checkBottomPosY = checkPosY + definitions_store.Definitions.EDIT.LAYER.BOUNDING_BOX.HEIGHT;
            var layerPosY = layer.getPosition().y;
            var layerBottomPosY = layerPosY + definitions_store.Definitions.EDIT.LAYER.BOUNDING_BOX.HEIGHT;
            if (checkPosY >= layerPosY || checkBottomPosY > layerPosY || checkPosY <= layerBottomPosY) {
                checkPosY = layerPosY;
            }
        }
        return checkPosY + definitions_store.Definitions.EDIT.LAYER.BOUNDING_BOX.HEIGHT + GRID;
    }

    /**
     * ネットワーク構成の描画に必要なサイズ取得
     */
    var _calcBoundingBox = (positions: any[], margin: number) => {
        var min = (array: number[]) => Math.min.apply(null, array);
        var max = (array: number[]) => Math.max.apply(null, array);
        var positionsX = positions.map(p => p.x);
        var positionsY = positions.map(p => p.y);
        // 最大値をLayerの位置で計算しているが、Linkの線が最大値になることがある為、その分を考慮する
        var maxLinkPosition = 16;
        return {
            left:  min(positionsX) - margin, // 左端マージンを引いた座標
            top: min(positionsY) - margin, // 上端マージンを引いた座標
            right:  max(positionsX) + definitions_store.Definitions.EDIT.LAYER.BOUNDING_BOX.WIDTH + margin + maxLinkPosition, // LayerのBoundingBoxサイズと右端マージンを加えた座標
            bottom: max(positionsY) + definitions_store.Definitions.EDIT.LAYER.BOUNDING_BOX.HEIGHT + margin + maxLinkPosition, // 下端マージンを加えた座標
        };
    }

    /**
     * calculate grid-aligned position.
     * @param position {x: ..., y: ...} object
     * @return Grid aligned position
     */
    function align(position: any) {
        const GRID = definitions_store.Definitions.EDIT.GRID.SIZE;
        var align = (p: any) => Math.max(0, parseInt(((p + GRID/2) / GRID).toString()) * GRID);
        return {x: align(position.x), y: align(position.y)};
    }

    /**
     * レイヤーの移動位置を計算する
     * @param layer 移動するレイヤー
     * @param exceptingLayers 干渉判定から除外するレイヤーの配列
     * @return 移動位置
     */
    function calcLayerDropPosition(layer: any, exceptingLayers?: any) {
        var alignedPosition = align(layer.getPosition());
        var x = searchPositionX(alignedPosition.x, alignedPosition.y, exceptingLayers || [layer]);
        return { x: x, y: alignedPosition.y };
    }

    /**
     * レイヤーの外接領域変更から SvgArea のサイズを調整
     * @param boundingBox 全レイヤーの外接矩形
     */
    function _adjustSizeToBoundingBox(boundingBox: any) {
        const ratio = editor_store.zoomInfo.networkGraph.percentage / 100;
        var width = Math.max(_windowWidth(), boundingBox.right * ratio);
        var height = Math.max(_windowHeight(), boundingBox.bottom * ratio);
        var viewBoxWidth = width / ratio;
        var viewBoxHeight = height / ratio;
        if(!_svgDom.value) {
            _svgDom.value = document.getElementById('network-editor');
        }
        _svgDom.value.setAttribute('viewBox', '0 0 ' + viewBoxWidth + ' ' + viewBoxHeight);
        _setSize(width, height);
    }

    /** SvgArea のサイズを調整 */
    function _requestAdjustSize(trackingLayers?: any) {
        const GRID = definitions_store.Definitions.EDIT.GRID.SIZE;
        var totalBoundingBox = _calcBoundingBox(graph_store.getLayers((layer: any) => layer.getPosition()), GRID);
        _adjustSizeToBoundingBox(totalBoundingBox);
        if (trackingLayers) {
            var selectionLayer = graph_store.getLayers((layer: any) => layer).filter((layer: any) => layer.name() === editor_store.selection.main)[0];
            if (!selectionLayer) {
                return;
            }
            var selectionTrackingBoundingBox = _calcBoundingBox([selectionLayer.getPosition()], 0);
            const ratio = editor_store.zoomInfo.networkGraph.percentage / 100;
            selectionTrackingBoundingBox.left *= ratio;
            selectionTrackingBoundingBox.right *= ratio;
            selectionTrackingBoundingBox.top *= ratio;
            selectionTrackingBoundingBox.bottom *= ratio;
            var windowWidth = _windowWidth();
            var windowHeight = _windowHeight();
            var scrollLeft = _svgScroller.value.scrollLeft();
            var scrollRight = scrollLeft + windowWidth;
            if (selectionTrackingBoundingBox.left < scrollLeft) {
                _svgScroller.value.scrollLeft(selectionTrackingBoundingBox.left);
            } else if (scrollRight < selectionTrackingBoundingBox.right) {
                _svgScroller.value.scrollLeft(selectionTrackingBoundingBox.right - windowWidth);
            }
            var scrollTop = _svgScroller.value.scrollTop();
            var scrollBottom = scrollTop + windowHeight;
            if (selectionTrackingBoundingBox.top < scrollTop) {
                _svgScroller.value.scrollTop(selectionTrackingBoundingBox.top);
            } else if (scrollBottom < selectionTrackingBoundingBox.bottom) {
                _svgScroller.value.scrollTop(selectionTrackingBoundingBox.bottom - windowHeight);
            }
        }
    }

    function trackCursorMovement(cursor: any) {
        var windowWidth = _windowWidth();
        var windowHeight = _windowHeight();
        var ratio = editor_store.zoomInfo.networkGraph.percentage / 100;
        var x = cursor.x * ratio;
        var y = cursor.y * ratio;

        var scrollLeft = _svgScroller.value.scrollLeft();
        var scrollRight = scrollLeft + windowWidth;
        var scrollTop = _svgScroller.value.scrollTop();
        var scrollBottom = scrollTop + windowHeight;
        if (scrollRight < x || scrollBottom < y) {
            _requestAdjustSize();
        }

        if (x < scrollLeft) {
            _svgScroller.value.scrollLeft(x);
        } else if (scrollRight < x) {
            _svgScroller.value.scrollLeft(x - windowWidth);
        }

        if (y < scrollTop) {
            _svgScroller.value.scrollTop(y);
        } else if (scrollBottom < y) {
            _svgScroller.value.scrollTop(y - windowHeight);
        }
    }

    /**
     * レイヤーを追加する位置を計算してaddLayerコマンドを実行する
     * @param type component type
     */
    function addLayer(type: any) {
        var serialized: any, autoLinked: any;
        return history_store.execute({
            type: 'push-and-execute',
            argument: {
                exec: () => {
                    var layer: any;
                    if (serialized) {
                        layer = layer_store.deserialize(serialized);
                    } else {
                        const pos = calcNewLayerPosition(type);
                        layer = new Layer(
                            {type: type, x: pos.x, y: pos.y}, 
                            useSVGAreaStore(),
                            utils_store,
                            definitions_store,
                            graph_store,
                            layer_store,
                            link_store,
                            connector_store,
                            sdneditor_store,
                            selection_store,
                            history_store,
                            sduutils_store,
                            editor_store,
                            nnabla_core_store,
                            network_store
                        );
                        serialized = layer.serialize();
                    }
                    selection_store.clear();
                    selection_store.layer.focus(layer);
                    autoLinked = layer.autoLink();
                    _requestAdjustSize([layer]);
                },
                undo: () => {
                    autoLinked.undo();
                    autoLinked = undefined;
                    layer_store.findObjectBySerialized(serialized).remove();
                    _requestAdjustSize();
                },
                name: () => 'Add layer : ' + type,
            },
        });
    }

    /**
     * レイヤー設置予測位置の枠を追加する
     * @param position 表示位置
     */
    function createLayerDestinationFrame(position: any) {
        var rectDom = _svgBackground.value.append("rect")
            .attr("x", position.x)
            .attr("y", position.y)
            .attr("width", definitions_store.Definitions.EDIT.LAYER.DESTINATION_FRAME.WIDTH)
            .attr("height", definitions_store.Definitions.EDIT.LAYER.DESTINATION_FRAME.HEIGHT)
            .style("fill", definitions_store.Definitions.EDIT.LAYER.DESTINATION_FRAME.FILL_COLOR)
            .style("stroke", definitions_store.Definitions.EDIT.LAYER.DESTINATION_FRAME.STROKE_COLOR)
            .style("stroke-width", definitions_store.Definitions.EDIT.LAYER.DESTINATION_FRAME.STROKE_WIDTH);
        return {
            move: (position: any) => {
                rectDom.attr("x", position.x).attr("y", position.y);
            },
            getPosition: () => {
                return { x: parseInt(rectDom.attr("x")), y: parseInt(rectDom.attr("y")), };
            },
            destroy: () => {
                hideAndRemove(rectDom);
                rectDom = undefined;
            },
        }
    }

    function _createLasso() {
        var dom = _svgFocuses.value.append("rect")
            .style("fill", definitions_store.Definitions.EDIT.LASSO.FILL_COLOR)
            .style("stroke", definitions_store.Definitions.EDIT.LASSO.STROKE_COLOR)
            .style("stroke-width", definitions_store.Definitions.EDIT.LASSO.STROKE_WIDTH);
        return {
            move: function(from: any, to: any) {
                var left = Math.min(from.x, to.x);
                var top = Math.min(from.y, to.y);
                var right = Math.max(from.x, to.x);
                var bottom = Math.max(from.y, to.y);
                var include = (rect: any) => left <= rect.left && rect.right <= right && top <= rect.top && rect.bottom <= bottom;
                dom.attr("x", left).attr("y", top).attr("width", right - left).attr("height", bottom - top);
                return include;
            },
            destroy: function() {
                hideAndRemove(dom);
                dom = undefined;
            },
        };
    }

    function _createLassoSelectionContext(from: any) {
        // 左クリックの場合のみ
        if (d3.event.sourceEvent.buttons === 1) {
            selection_store.clear();
        }
        var items = graph_store.getLayers((layer: any) => {
            var position = layer.getPosition();
            var size = layer.frameSize();
            return {
                target: layer,
                rect: {
                    left: position.x,
                    top: position.y,
                    right: position.x + size.width,
                    bottom: position.y + size.height,
                },
            };
        });

        var lasso: any = _createLasso();
        return {
            move: function(to: any) {
                var lassoCovers = lasso.move(from, to);
                var covered = items.filter((item: any) => lassoCovers(item.rect)).map((item: any) => item.target);
                selection_store.change(covered);
            },
            destroy: function() {
                lasso.destroy();
                lasso = undefined;
            },
        };
    }

    function setDragContext(dragContext: any) {
        if (_dragContext.value) {
            // XXX Unexpected situation!!
            throw 'Error: previous context not cleared correctly.';
        }
        _dragContext.value = dragContext;
    }

    function drag(){
        var networkEditorD3Obj = d3.select('#network-editor')[0][0];
        _dragContext.value.move(_mouseToWorldCoordinate(networkEditorD3Obj));
    }

    function dragend(){
        _dragContext.value.destroy();
        _dragContext.value = undefined;
    }

    function draggingLayer(){
        return !!_dragContext.value
    }

    function _mouseToWorldCoordinate(d3obj: any){
        var mouse = d3.mouse(d3obj);
        return {x: mouse[0], y: mouse[1]};
    }

    function subscribeMouseEnter(callback: any) {
        _eventCallbacksMouseEnter.value.insert(callback);
    }

    function unsubscribeMouseEnter(callback: any) {
        _eventCallbacksMouseEnter.value.remove(callback);
    }

    /**
     * オブジェクトを非表示にする
     * @param obj
     * @memberOf sdn.SvgArea
     */
    function hideAndRemove(obj: any) {
        if(obj) {
            obj.transition().style('opacity', 0).each('end', () => obj.remove()); 
        }
    }

    return { 
        init,
        drag, 
        width,
        height,
        dragend,
        subscribeMouseEnter,
        unsubscribeMouseEnter,
        hideAndRemove,
        requestAdjustSize: _requestAdjustSize,
        draggingLayer,
        addLayer,
        showGrid,
        createLayerDestinationFrame,
        calcLayerDropPosition,
        trackCursorMovement,
        hideGrid,
        linkGroup,
        setDragContext,
        focusGroup,
        layerGroup,
        _createLasso,
        _createLassoSelectionContext
    }
})
