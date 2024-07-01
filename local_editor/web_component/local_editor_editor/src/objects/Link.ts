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

// import * as d3 from "d3";

export default class Link{
  _source: any
  _destination: any
  _linkLine: any
  linksLayer: any
  _clickableTransparentLine: any

  graph_store: any
  svgarea_store: any
  definitions_store: any
  connector_store: any
  history_store: any
  selection_store: any
  link_store: any
  sdneditor_store: any

  constructor(linksLayer: any, 
              dragDelegate: any, 
              sourceConnector: any, 
              destinationConnector: any,
              _graph_store: any,
              _svgarea_store: any,
              _definitions_store: any,
              _connector_store: any,
              _history_store: any,
              _selection_store: any,
              _link_store: any,
              _sdn_editor_store: any,
             ) {
    this.graph_store = _graph_store
    this.svgarea_store = _svgarea_store
    this.definitions_store = _definitions_store
    this.connector_store = _connector_store
    this.history_store = _history_store
    this.selection_store = _selection_store
    this.link_store = _link_store
    this.sdneditor_store = _sdn_editor_store

    this._source = sourceConnector
    this._destination = destinationConnector
    
    var _createDragContext = (cursor: any) => {
      /** リンク線の表示設定*/
      const _opacity = (value: any) => this._linkLine.attr('opacity', value);

      const src = this._source;
      const dest = this._destination;
      const dragging = this._selectNearest(cursor, src, dest);
      const root = dragging === src ? dest : src;
      _opacity(0);
      const draggingEnd = this.connector_store.mkLinkEdge(linksLayer, dragging.getPosition());
      const rootEnd = this.connector_store.mkLinkEdge(linksLayer, root.getPosition());
      var halfOpenLink = this._mkHalfOpenLinkPath(linksLayer, this); // 更新用のリンク線画像
      var target: any; // リンク先変更用 変更先のコネクタ
      this.selection_store.clear();
      this.selection_store.layer.focus(root.layer(), dragging.layer());

      return {
          move: (cursor: any) => {
            target = this._findConnectingTargetConnector(root);
            var posDragging;
            if (target && (target.canConnect() && !target.connectedWith(root)) || (target === dragging && target.connectedWith(root))) {
                posDragging = target.getPosition();
            } else {
                posDragging = cursor;
            }
            this._updateHalfOpenLink(root, target, halfOpenLink, draggingEnd, posDragging); // リンク線の接続先変更
            this.selection_store.layer.clear();
            this.selection_store.layer.focus(root.layer());
            if (target) {
              this.selection_store.layer.insert(target.layer());
            }
          },
          destroy: () => {
              var link;
              _opacity(null);
              if (target && target.canConnect() && !target.connectedWith(root)) {
                  var source, destination;
                  if (target.getType() === this.definitions_store.Definitions.EDIT.CONNECTOR.OUT) {
                      source = target; destination = root;
                  } else {
                      source = root; destination = target;
                  }
                  link = source.linkTo(destination);
                  const newLink = link.serialize();
                  const oldLink = this.serialize();
                  this.remove();
                  this.history_store.execute({
                      type: 'push',
                      argument: {
                          exec: () => {
                            this.link_store.deserialize(newLink);
                            this.link_store.findObjectBySerialized(oldLink).remove();
                          },
                          undo: () => {
                            this.link_store.findObjectBySerialized(newLink).remove();
                            this.link_store.deserialize(oldLink);
                          },
                          name: () => 'Edit link',
                      },
                  });
              } else {
                  link = this;
              }
              this.selection_store.clear();
              this.selection_store.link.focus(link);
              if (halfOpenLink) { // 更新用のリンク線画像を（描画対象から）削除する
                  halfOpenLink.remove();
                  halfOpenLink = undefined;
              }
              // ドラッグ用コネクターを（描画対象から）削除する
              this.connector_store.safeRemoveLinkingConnector(rootEnd);
              // リンク開始用のコネクター画像を（描画対象から）削除する
              this.connector_store.safeRemoveLinkingConnector(draggingEnd);
          },
      };
    };

    const _eventHandlerAppender = d3.behavior.drag()
      .on("dragstart", () => {
        // 左クリックの場合のみ
        if (d3.event.sourceEvent.buttons === 1) {
            const pos = d3.mouse(d3.event.target); // mousedownされた位置座標の取得
            dragDelegate.set(_createDragContext({x: pos[0], y: pos[1]}));
        }
        // バブリングして上のレイヤーでもdragstartをcatchしてしまうと
        // d3以外でのdragendイベントが起きなくなる為イベントを止める
        d3.event.sourceEvent.stopPropagation();
      }).on("drag", () => {
        this.svgarea_store.drag();
      })
      .on("dragend", () => {
          this.svgarea_store.dragend();
      });
    
    const path = this.link_store.getPathData(destinationConnector.getPosition(), sourceConnector, destinationConnector);


    this._linkLine = linksLayer.append('path')
      .attr('d', path)
      .style('stroke-width', this.definitions_store.Definitions.EDIT.LINK.DEFAULT.STROKE_WIDTH)
      .style('stroke', this.definitions_store.Definitions.EDIT.LINK.STROKE_COLOR)
      .style('fill', 'none');

    this._clickableTransparentLine = linksLayer.append('path')
      .attr('d', path)
      .style('stroke-width', this.definitions_store.Definitions.EDIT.LINK.CLICKABLE_STROKE_WIDTH)
      .style('stroke', 'transparent')
      .style('fill', 'none')
      .style('cursor', 'pointer')
      .call(_eventHandlerAppender);

    this.graph_store.insertLink(this);
  }

  /**
   * 選択状態を更新する
   *
   * @param {Boolean} setOrNot true: 選択状態にする, false: 選択状態を解除する
   */
  select(setOrNot: any) {
    const COLOR_FOCUSED = this.definitions_store.Definitions.EDIT.LINK.FOCUSED.STROKE_COLOR;
    const COLOR_DEFAULT = this.definitions_store.Definitions.EDIT.LINK.STROKE_COLOR;
    this._linkLine.style('stroke', setOrNot ? COLOR_FOCUSED : COLOR_DEFAULT);
    this.source().select(setOrNot);
    this.destination().select(setOrNot);
  }

  /**SourceConnectorを返す */
  source() {
    return this._source; 
  }

  /**DestinationConnectorを返す */
  destination() {
    return this._destination; 
  }

  /**
   * リンクの両端の情報をオブジェクトとして返す
   * @returns {{source: serialized-connector, destination: serialized-connector}}
   */
  serialize() {
    return {
      from_node: this._source.layer().name(),
      from_name: this._source.name(),
      to_node: this._destination.layer().name(),
      to_name: this._destination.name(),
    }
  }

  /**
   * 更新する
   * @memberOf sdn.Link
   */
  updateLinkLine() {
    var src = this._source;
    var dst = this._destination;
    if (src && dst) {
        const path = this.link_store.getPathData(dst.getPosition(), src, dst);
        this._linkLine.attr('d', path);
        this._clickableTransparentLine.attr('d', path);
    }
  }

  /**
   * リンクの接続先を変更する
   * @memberOf sdn.Link
   */
  resetConnectors(source: any, destination: any) {
    this._source = source;
    this._destination = destination;
    const path = this.link_store.getPathData(destination.getPosition(), source, destination);
    this._linkLine.attr('d', path);
    this._clickableTransparentLine.attr('d', path);
  }

  /**
   * 削除
   * @memberOf sdn.Link
   */
  remove() {
    // DOM の削除
    this.svgarea_store.hideAndRemove(this._linkLine);
    this.svgarea_store.hideAndRemove(this._clickableTransparentLine);

    // 管理対象から削除
    this.graph_store.removeLink(this);

    // 不要になった参照を削除
    delete this._source;
    delete this._destination;
    delete this._linkLine;
    delete this._clickableTransparentLine;
  }

  _selectNearest(pos: any, src: any, dest: any) {
    const x = pos.x, y = pos.y;
    var p1, p2;
    p1 = src.getPosition().y;
    p2 = dest.getPosition().y;
    if (Math.abs(p1 - y) < Math.abs(y - p2)) {
        return src;
    } else {
        p1 = src.getPosition().x;
        p2 = dest.getPosition().x;
        if (Math.abs(p1 - x) < Math.abs(x - p2)) {
            return src;
        } else {
            return dest;
        }
    }
  }

  _mkHalfOpenLinkPath(group: any, link: any) {
    const WIDTH_DRAG_LINK = this.definitions_store.Definitions.EDIT.LINK.FOCUSED_DRAG.STROKE_WIDTH;
    const COLOR_DRAG_LINK = this.definitions_store.Definitions.EDIT.LINK.FOCUSED_DRAG.STROKE_COLOR;
    return group.append('path')
                .attr('d', this.link_store.getPathData(link._destination.getPosition(), link._source, link._destination))
                .attr('stroke-width',WIDTH_DRAG_LINK)
                .attr('stroke', COLOR_DRAG_LINK)
                .attr('fill', 'none');
  }

  _same_parent(conn1: any, conn2: any) {
    return conn1.layer() === conn2.layer()
  }

  _findConnectingTargetConnector(rootConnector: any) {
    const OUT_CONECTOR = this.definitions_store.Definitions.EDIT.CONNECTOR.OUT;
    const connector = this.sdneditor_store.touchingConnector();
    if (connector && !this._same_parent(connector, rootConnector)) {
        const type = rootConnector.getType();
        if (type === OUT_CONECTOR || connector.isDefault()) {
            return connector;
        }
    }
    const layer = this.sdneditor_store.stockedLayer();
    if (layer) { // リンク先がレイヤーの内側に入っていたらコネクタへ接続する
        const type = rootConnector.getType();
        const candidate = type === OUT_CONECTOR ? layer._inConnector : layer._outConnector;
        if (candidate && !this._same_parent(candidate, rootConnector)) {
            return candidate;
        }
    }
    return undefined;
  }

  /** リンクの接続先変更 半開リンク更新 */
  _updateHalfOpenLink(root: any, target: any, link: any, dragging: any, posDragging: any) {
    link.attr('d', this.link_store.getPathData(posDragging, root, target));
    dragging.attr('cx', posDragging.x).attr('cy', posDragging.y);
  }
}