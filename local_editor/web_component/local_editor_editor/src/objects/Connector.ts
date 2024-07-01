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

import { toRaw } from 'vue'
import Link from './Link'
// import * as d3 from "d3";

export default class Connector{
  _layer: any
  _type: any
  _name: any
  links: any
  connectedWith: any
  linkTo: any
  _mainImage: any
  _label: any
  linkingLimit: any

  definitions_store: any
  graph_store: any
  connector_store: any
  svgarea_store: any
  sdneditor_store: any
  selection_store: any
  link_store: any
  history_store: any

  constructor(layer: any, 
              group: any, 
              linksLayer: any, 
              dragDelegate: any, 
              type: any, 
              accepts: any, 
              name: any, 
              shortName: any, 
              color: any, 
              offset: any,
              _definitions_store: any,
              _graph_store: any,
              _connector_store: any,
              _svgarea_store: any,
              _sdn_editor_store: any,
              _selection_store: any,
              _link_store: any,
              _history_store: any) {

        this.definitions_store = _definitions_store
        this.graph_store = _graph_store
        this.connector_store = _connector_store
        this.svgarea_store = _svgarea_store
        this.sdneditor_store = _sdn_editor_store
        this.selection_store = _selection_store
        this.link_store = _link_store
        this.history_store = _history_store

        const OUT = this.definitions_store.Definitions.EDIT.CONNECTOR.OUT;
        const _linksFrom = (connector: any) => this.graph_store.getLinks().filter((link: any) => toRaw(toRaw(link)._source) === connector);
        const _linksTo = (connector: any) => this.graph_store.getLinks().filter((link: any) => toRaw(toRaw(link)._destination) === connector);
    
        const _linkToFunctionFrom = (thisConnector: any, linksLayer: any, dragDelegate: any) => (connector: any) => {
        if (connector._type === OUT) {
            throw "ERROR: attempted making link to Output connector.";
        } else if (thisConnector.connectedWith(connector)) {
            throw "ERROR: attempted making link with already linked Input connector.";
        } else {
            return new Link(
                linksLayer, 
                dragDelegate, 
                thisConnector, 
                connector,
                this.graph_store,
                this.svgarea_store,
                this.definitions_store,
                this.connector_store,
                this.history_store,
                this.selection_store,
                this.link_store,
                this.sdneditor_store
            );
        }
        }
        const _linkToFromInput = () => { throw "ERROR: attempted making link from Input connector."; };
        
        this._layer = layer; // parent layer
        this._type = type;
        this._name = name;

        if (type === OUT) {
            // function, returns links from this connector.
            this.links = () => _linksFrom(this);
            // function, checks this is connected with given connector.
            this.connectedWith = (connector: any) => _linksFrom(this).some((link: any) => link._destination === connector);
        } else {
            // function, returns links from this connector.
            this.links = () => _linksTo(this);
            // function, checks this is connected with given connector.
            this.connectedWith = (connector: any) => _linksTo(this).some((link: any) => link._source === connector);
        }

        /**
         * makes link from this (out/source layer side) connector to input (destination layer side) connector.
         *
         * @param inConnector input pin or input side connector.
         * @return sdn.Link object.
         * @throws Error descripting string if trying to make link from Input, or to Output.
         */
        this.linkTo = type === OUT ? _linkToFunctionFrom(this, linksLayer, dragDelegate) : _linkToFromInput;

        color = color.replace(/0x/, '#');
        this._mainImage = this.connector_store._mkConnectorCircle(group, offset.x, offset.y, color);
        if (!shortName) { // Input/Output Pin
            this._mainImage
                .call(this._makeEventAttacher(dragDelegate, linksLayer));
        } else { // Side Connector
            this._mainImage
                .attr('r', this.definitions_store.Definitions.EDIT.LAYER.CONNECTOR.SIDE.RADIUS)
                .style('stroke-width', this.definitions_store.Definitions.EDIT.LAYER.CONNECTOR.STROKE_WIDTH)
                .style('opacity', this.definitions_store.Definitions.EDIT.LAYER.CONNECTOR.SIDE.OPACITY)
                .call(this.bindEvent, this);
            this._label = group.append('text')
                .attr('x', offset.x) // mainImageとの相対座標
                .attr('y', offset.y + this.definitions_store.Definitions.EDIT.LAYER.CONNECTOR.SIDE.LABEL.OFFSET_Y) // mainImageとの相対座標
                .attr('pointer-events', 'none')
                .text(shortName)
                .style('fill', this.definitions_store.Definitions.EDIT.LAYER.CONNECTOR.SIDE.LABEL.FONTCOLOR)
                .style('font-size', this.definitions_store.Definitions.EDIT.LAYER.CONNECTOR.SIDE.LABEL.FONTSIZE)
                .style("font-weight", this.definitions_store.Definitions.EDIT.LAYER.CONNECTOR.SIDE.LABEL.FONTWEIGHT)
                .style('text-anchor', 'middle')
                .style('opacity', this.definitions_store.Definitions.EDIT.LAYER.CONNECTOR.SIDE.LABEL.OPACITY);
        }

        this.linkingLimit = () => {
        if (this.isDefault()) {
            return type === this.definitions_store.Definitions.EDIT.CONNECTOR.IN ? layer.component().input : layer.component().output;
        } else {
            return 1;
        }
        }
    }

    /**
     * イベント追加
     */
    bindEvent(selection: any, self: any) {
        selection.on({
            'mouseenter': () => {
                self.sdneditor_store.stockLayer(self._layer);
                self.sdneditor_store.touchConnector(self);
            },
            'mouseleave': () => {
                self.sdneditor_store.stockLayer(null);
                self.sdneditor_store.touchConnector(null);
            }
        })
    }

    _makeEventAttacher(dragDelegate: any, linksLayer: any) {
        var _createDragContext = () => {
            var layer = this._layer;
            var type = this._type;
            var self = this;

            var position = self.getPosition();
            // コネクター用 DOM 要素を生成し（描画させるため）親要素に追加
            var connectorEnd = this.connector_store.mkLinkEdge(linksLayer, position); // リンク開始用のコネクター画像
            var draggingEnd = this.connector_store.mkLinkEdge(linksLayer, position); // トラッキング用のコネクター画像
            // リンク線用 DOM 要素を生成し（描画させるため）親要素に追加
            var pathImage = this.connector_store._mkLinkPath(linksLayer, position.x, position.y); // リンク線用直線画像
            this.selection_store.clear(); // 全てのレイヤー、リンク線のselect状態を外す
            this.selection_store.layer.focus(layer);
            return {
                move: (cursor: any) => {
                    var connector;
                    var posDragging;
                    const target_layer = this.sdneditor_store.stockedLayer();
                    if (!target_layer || target_layer === layer) { // 他レイヤー内に入っていなければ、マウスカーソル位置に向けてリンク線を移動する
                        posDragging = cursor;
                        this.selection_store.layer.clear();
                        this.selection_store.layer.focus(layer);
                    } else {
                        if(type === this.definitions_store.Definitions.EDIT.CONNECTOR.OUT) {
                            // リンク先がレイヤーの内側に入っていたらコネクタへ接続する
                            connector = this.sdneditor_store.touchingConnector() || target_layer._inConnector;
                        } else {
                            connector = target_layer._outConnector;
                        }
                        if (connector && connector.canConnect()) {
                            posDragging = connector.getPosition();
                            this.selection_store.layer.focus(layer);
                        } else {
                            posDragging = cursor;
                        }
                    }
                    // リンク線とドラッグ用コネクターの描画位置を更新
                    pathImage.attr('d', this.link_store.getPathData(posDragging, self, connector));
                    draggingEnd.attr('cx', posDragging.x).attr('cy', posDragging.y);
                },
                destroy: () => {
                    // NOTE 「この」コネクターの「上」でドラッグが終了しないことに注意
                    const link = self.connect();
                    this.selection_store.clear();
                    if (link) {
                        this.selection_store.link.focus(link);
                    }
                    // リンク線用直線画像を（描画対象から）削除する
                    if (pathImage) { pathImage.remove(); pathImage = undefined; }
                    // ドラッグ用コネクターを（描画対象から）削除する
                    this.connector_store.safeRemoveLinkingConnector(draggingEnd);
                    // リンク開始用のコネクター画像を（描画対象から）削除する
                    this.connector_store.safeRemoveLinkingConnector(connectorEnd);
                }
            };
        };
        return d3.behavior.drag()
            .on("dragstart", () => {
                dragDelegate.set(_createDragContext());
                // バブリングして上のレイヤーでもdragstartをcatchしてしまうと
                // d3以外でのdragendイベントが起きなくなる為イベントを止める
                d3.event.sourceEvent.stopPropagation();
            })
            .on("drag", () => {
                this.svgarea_store.drag();
            })
            .on("dragend", () => {
                this.svgarea_store.dragend();
            });
    }

    /**
     * 座標を返す
     * @returns {{x: (number|*), y: (*|number)}}
     */
    getPosition() {
        var position = this._layer.getPosition();
        var circle = this._mainImage;
        return {x: position.x + Number(circle.attr('cx')), y: position.y + Number(circle.attr('cy'))}
    }

    /**
     * コネクタをつなげる
     * @returns リンクが確立できた場合 sdn.Link オブジェクト。条件に適合せず確立できない場合 null。
     */
    connect() {
        var originConnector = this;
        var targetConnector =  this.sdneditor_store.touchingConnector();
        if (!targetConnector) {
            const passingLayer = this.sdneditor_store.stockedLayer();
            if (passingLayer) {
                // NOTE レイヤー通過中に、リンクを動かすもとになったドラッグ操作から、入力ピンか出力ピンか
                // あるいは入力サイドコネクターかを判定して connectorSnapTo を決めておくほうがよい。
                if (originConnector.getType() === this.definitions_store.Definitions.EDIT.CONNECTOR.IN) {
                    targetConnector = passingLayer.getOutConnector();
                } else {
                    targetConnector = passingLayer.getInConnector();
                }
            }
        }
        if (!targetConnector) {
            // リンク先が決まらなければ接続できない。
            return null;
        }
        if (targetConnector._layer === originConnector._layer) {
            // 同じレイヤー内のコネクターは接続できない。
            return null;
        }
        if (targetConnector.getType() === originConnector.getType()) {
            // 入力同士・出力同士を結ばせない
            return null;
        }
        if (targetConnector.connectedWith(originConnector)) {
            // すでにリンクが存在していたら接続させない。
            return null;
        }
        if (targetConnector.getType() === this.definitions_store.Definitions.EDIT.CONNECTOR.OUT) {
            // 接続先コネクターが入力側になるよう入れ替え。
            var swapping = originConnector;
            originConnector = targetConnector;
            targetConnector = swapping;
        }
        if (!targetConnector.isDefault() && targetConnector.links().length > 0) {
            // NOTE プロトタイプ v2.3 相当では、サイドコネクターはリンクオリジンにならないため
            // ターゲットコネクターのチェックだけで済ませる。
            // サイドコネクターはリンクをひとつしか受け入れられない。
            return null;
        }

        // 接続上限数 1 に達している場合、これを取り除いてリンク可能にする
        const removedLinks: any = [];
        if (!originConnector.canConnect()) { // Day 1 時点で接続不能になるのは、上限 1 でリンク確立したコネクターのみ
            let links = originConnector.links();
            removedLinks.push(links[0].serialize());
        }
        if (!targetConnector.canConnect()) {
            let links = targetConnector.links();
            removedLinks.push(links[0].serialize());
        }
        // 既存リンクを削除してからリンクを作成する
        removedLinks.forEach((link: any) => this.link_store.findObjectBySerialized(link).remove());
        const link = originConnector.linkTo(targetConnector).serialize();
        this.history_store.execute({
            type: 'push',
            argument: {
                exec: () => {
                    // 旧リンクを取り除いて新規リンクを確立する
                    removedLinks.forEach((link: any) => this.link_store.findObjectBySerialized(link).remove());
                    this.link_store.deserialize(link);
                },
                undo: () => {
                    // 新規リンクを削除して旧リンクを復旧する
                    this.link_store.findObjectBySerialized(link).remove();
                    removedLinks.forEach(this.link_store.deserialize);
                },
                name: () => 'Edit link',
            },
        });
    }

    /**
     * タイプを返す
     * @returns {null|*}
     */
    getType() {
        return this._type;
    }

    /**
     * 削除
     */
    remove() {
        this.svgarea_store.hideAndRemove(this._mainImage);
        this.svgarea_store.hideAndRemove(this._label);

        // リンク削除
        this.links().forEach((link: any) => link.remove());
    }

    name() {
        return this._name;
    }
    
    layer() {
        return this._layer;
    }

    /**
     * 新しくリンクを作成可能か否かを返す
     * @return true:接続可 false:接続不可
     */
    canConnect() {
        var limit = this.linkingLimit();
        return limit === -1 || (limit === 1 && this.links().length === 0);
    }

    /**
     * デフォルトピンであるか否かを返す
     * @return true:デフォルトピン false:サイドコネクタ
     */
    isDefault() {
        return this._name === '';
    }

    /**
     * 選択状態を更新する
     *
     * @param {Boolean} setOrNot true: 選択状態にする, false: 選択状態を解除する
     */
    select(setOrNot: boolean) {
        const COLOR_FOCUSED = this.definitions_store.Definitions.EDIT.LINK.FOCUSED.STROKE_COLOR;
        const COLOR_DEFAULT = this.definitions_store.Definitions.EDIT.LAYER.CONNECTOR.STROKE_COLOR;
        if (this.isDefault()) {
            this._mainImage.attr('fill', setOrNot ? COLOR_FOCUSED : COLOR_DEFAULT);
        }
    }

}
