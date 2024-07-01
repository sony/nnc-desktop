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
import Connector from './Connector'
// import * as d3 from "d3";

export default class Layer{
  _group: any
  _properties: any
  _sideConnector: any
  _inConnector: any
  _outConnector: any
  _selectFrame: any
  _userInputProperties: any
  _label: any
  _allProperties: any
  _grabbedPoint: any
  _startTouchPoint: any
  _startPosition: any
  _originalComponent: any
  _component: any
  _originalUserInputProperties: any
  _isParam: boolean
  _mainImage: any
  _warnImage: any
  _labelFirst: any
  _importantPropertyLabel: any
  _statisticsLabel: any
  _statisticsBar: any
  _importantProperty: any
  _orderList: any
  _orderArea: any
  _repeatArea: any
  _errorProperties: any
  displayComment: Function
  displayImportantProperty: Function

  svgarea_store: any
  utils_store: any
  definitions_store: any
  graph_store: any
  layer_store: any
  link_store: any
  connector_store: any
  sdneditor_store: any
  selection_store: any
  history_store: any
  sduutils_store: any
  editor_store: any
  nnabla_core_store: any
  network_store: any

  /**
   * Layer Constructor
   * @param opt 設定用オブジェクト。 {type: [required], name: [optional], properties: [optional], x: [optional], y: [optional]}
   * @param backgroud sdn.SvgArea オブジェクト。レイヤーを構成する SVG 部品の追加先を管理する。
   */
  constructor(opt: any, 
             _svgarea_store: any, 
             _utils_store: any, 
             _definitions_store: any,
             _graph_store: any,
             _layer_store: any,
             _link_store: any,
             _connector_store: any,
             _sdn_editor_store: any,
             _selection_store: any,
             _history_store: any,
             _sduutils_store: any,
             _editor_store: any,
             _nnabla_core_store: any,
             _network_store: any) {
    this.svgarea_store = _svgarea_store
    this.utils_store = _utils_store
    this.definitions_store = _definitions_store
    this.graph_store = _graph_store
    this.layer_store = _layer_store
    this.link_store = _link_store
    this.connector_store = _connector_store
    this.sdneditor_store = _sdn_editor_store
    this.selection_store = _selection_store
    this.history_store = _history_store
    this.sduutils_store = _sduutils_store
    this.editor_store = _editor_store
    this.nnabla_core_store = _nnabla_core_store
    this.network_store = _network_store

    var type = opt.type;
    var component = this.utils_store.getComponent(type);

    var theOthers = this.graph_store.getLayers();
    var layerName = this.layer_store.calcDefaultUniqueName(opt.name || null, type, theOthers);
    var x = opt.x || 0;
    var y = opt.y || 0;

    var _properties = component.property;
    var allProperties = () => {
      var properties: any = {};
      _properties.forEach((property: any) => properties[property.name] = property.value);
      return properties;
    };
    var editableProperties = () => {
        var properties: any = {};
        _properties.forEach((property: any) => {
            if (property.editable) {
                properties[property.name] = property.value;
            }
        });
        return properties;
    };

    this._allProperties = allProperties;

    this._grabbedPoint = null;
    this._startTouchPoint = null;
    this._startPosition = null;

    this._originalComponent = component;
    this._component = JSON.parse(JSON.stringify(component));

    this._properties = allProperties();
    this._originalUserInputProperties = JSON.parse(JSON.stringify(opt.properties || editableProperties()));
    delete this._originalUserInputProperties.Name;
    this._userInputProperties = JSON.parse(JSON.stringify(opt.properties || editableProperties()));
    delete this._userInputProperties.Name; // ommit Name from user input property; for it managed in _label.

    this._isParam = false;

    var self = this;

    var color = component.color.substring(2, 8);

    var _getId = this.sduutils_store.getId;

    var _linkFromFocusedIf = (predicate: any) => undefined;
    var _nullConnector = {canConnect: () => false};

    var _createDragContext = (posDragStart: any) => {
        // mousedown に先行して dragstart が呼ばれることを利用して、
        // 選択レイヤーが変わる前に現時点での主・副選択状態を記憶する
        var focused = this.selection_store.layer.focused();
        var _selecteds = this.selection_store.layer.apply((l: any) => l.serialize()); // undo/redo 用のため予めシリアライズする

        if (focused !== self) {
            var out = (focused || {getOutConnector: () => null}).getOutConnector() || _nullConnector;
            var in_ = self.getInConnector() || _nullConnector;
            if (out.canConnect() && in_.canConnect() && !out.connectedWith(in_)) {
                _linkFromFocusedIf = predicate => {
                    if (predicate()) {
                        // make link and serialize it for undo/redo
                        var _link = out.linkTo(in_).serialize();

                        // serialize to live undo/redo
                        var _focused = focused.serialize();
                        var _self = self.serialize();

                        // push command for undo/redo
                        this.history_store.execute({
                            type: 'push',
                            argument: {
                                name: () => 'Edit link',
                                undo: () => { // undo
                                    this.link_store.findObjectBySerialized(_link).remove();
                                    this.selection_store.layer.remove(this.layer_store.findObjectBySerialized(_self));
                                    _selecteds.map(this.layer_store.findObjectBySerialized).filter((x: any) => x).forEach((l: any) => this.selection_store.layer.insert(l));
                                    this.selection_store.layer.focus(this.layer_store.findObjectBySerialized(_focused));
                                },
                                exec: () => { // redo
                                    this.selection_store.layer.focus(this.layer_store.findObjectBySerialized(_self));
                                    this.link_store.deserialize(_link);
                                },
                            },
                        });
                    }
                };
            }
        }

        // 以下、レイヤー選択状態の切り替え。
        // 本来 mousedown ですべきだが、ドラッグ操作で選択中レイヤーをすべてキャプチャーする必要があること、
        // d3 dragstart は mousedown に先行して呼ばれてしまうことからここで実行する。
        var alreadySelected = this.selection_store.layer.members().some((focused: any) => {
            return toRaw(focused) === self;
        }); // 選択済みのレイヤー
        var pressedCtrl = d3.event.sourceEvent.ctrlKey || d3.event.sourceEvent.metaKey; // ctrlキーイベント
        var isClear = alreadySelected && pressedCtrl;
        if (isClear) {
            this.selection_store.layer.remove(self);
        } else {
            if (!alreadySelected && (!pressedCtrl || this.selection_store.link.focused())) {
                this.selection_store.clear();
            }
            this.selection_store.layer.insert(self); // まずメンバーに入れる
            this.selection_store.layer.focus(self);
        }

        var items = this.selection_store.layer.apply((layer: any) => {
            var position = layer.getPosition();
            return {
                target: layer,
                position: position, // memory all selected layer positions for moveLayers
                frame: this.svgarea_store.createLayerDestinationFrame(position),
            };
        });
        var layers = items.map((item: any) => item.target);
        return {
            move: (cursor: any) => {
                this.svgarea_store.showGrid();
                items.forEach((item: any) => {
                    var layer = item.target;

                    // translate layer positions
                    layer.setPosition({
                        x: item.position.x + cursor.x - posDragStart.x,
                        y: item.position.y + cursor.y - posDragStart.y,
                    });
                    this.utils_store.move(layer.name(), layer.getPosition());

                    item.frame.move(this.svgarea_store.calcLayerDropPosition(layer, layers));
                });
                this.svgarea_store.trackCursorMovement(cursor);
            },
            destroy: () => {
                // shift キー押下による dragstart 時の主選択レイヤーとの接続処理呼び出し。
                // 理想的には mousedown/mouseup で処理すべきだがドラッグイベントで処理している。
                // つまり、マウスをすばやく動かされることでレイヤー外で mouseup が発生し、これを
                // 受信できず mousedown 時に生成したオブジェクトを片付けそこねることへの対策。
                _linkFromFocusedIf(() => d3.event.sourceEvent.shiftKey);
                _linkFromFocusedIf = predicate => undefined; // restore to default handler

                var recipes = items.map((item: any) => ({
                    name: item.target.name(),
                    from: item.position,
                    to: item.frame.getPosition(),
                }));
                var dirty = recipes.some((recipe: any) => recipe.to.x !== recipe.from.x || recipe.to.y !== recipe.from.y);
                if (dirty) {
                    this.history_store.execute({
                        type: 'push-and-execute',
                        argument: {
                            exec: () => {
                                var allLayers = this.graph_store.getLayers();
                                var validItems = recipes.map((recipe: any) => ({
                                    target: allLayers.find((layer: any) => layer.name() == recipe.name),
                                    recipe: recipe,
                                })).filter((item: any) => !!item.target);
                                validItems.forEach((item: any) => {
                                    item.target.setPosition(item.recipe.to);
                                    this.utils_store.move(item.target.name(), item.recipe.to);
                                    item.recipe.links = item.target.autoLink();
                                });
                                this.svgarea_store.requestAdjustSize(validItems.map((item: any) => item.target));
                            },
                            undo: () => {
                                var allLayers = this.graph_store.getLayers();
                                var validItems = recipes.concat().reverse().map((recipe: any) => ({
                                    target: allLayers.find((layer: any) => layer.name() == recipe.name),
                                    recipe: recipe,
                                })).filter((item: any) => !!item.target);
                                validItems.forEach((item: any) => {
                                    item.recipe.links.undo();
                                    delete item.recipe.links;
                                    item.target.setPosition(item.recipe.from);
                                    this.utils_store.move(item.target.name(), item.recipe.to);
                                });
                                this.svgarea_store.requestAdjustSize(validItems.map((item: any) => item.target));
                            },
                            name: () => 'Drag Layer',
                        },
                    });
                } else {
                    // すべての位置が変わらない場合コマンドでは実行せず、位置だけもとに戻す
                    items.forEach((item: any) => {
                        item.target.setPosition(item.position)
                        this.utils_store.move(item.target.name(), item.position);
                    });
                    if (isClear) {
                        this.svgarea_store.requestAdjustSize();
                    } else {
                        this.svgarea_store.requestAdjustSize(layers);
                    }
                }

                items.forEach((item: any) => {
                    item.frame.destroy();
                });
                this.svgarea_store.hideGrid();
            },
        };
  };

  var _layerGroupNode = this.svgarea_store.layerGroup().node();
  var _dragEventHandlerAppender = d3.behavior.drag()
    .on("dragstart", () => {
      var mouse = d3.mouse(_layerGroupNode);
      var dragContext = _createDragContext({x: mouse[0], y: mouse[1]});
      this.svgarea_store.setDragContext(dragContext);
      // バブリングして上のレイヤーでもdragstartをcatchしてしまうと
      // d3以外でのdragendイベントが起きなくなる為イベントを止める
      d3.event.sourceEvent.stopPropagation();
    }).on("drag", () => {
      this.svgarea_store.drag();
    })
    .on("dragend", () => {
      this.svgarea_store.dragend();
    });

    var dlayer = this.definitions_store.Definitions.EDIT.LAYER;
    this._selectFrame = this.svgarea_store.focusGroup().append("rect")
      .attr("x", x) // mainImageとの相対座標
      .attr("y", y) // mainImageとの相対座標
      .attr("width", dlayer.FRAME.WIDTH)
      .attr("height", dlayer.FRAME.HEIGHT)
      .attr("pointer-events", "none")
      .style("fill", dlayer.FRAME.FILL_COLOR)
      .style("stroke", dlayer.FRAME.DEFAULT.STROKE_COLOR)
      .style("stroke-width", dlayer.FRAME.STROKE_WIDTH)
      .style("filter", dlayer.FRAME.DEFAULT.FILTER_URL);

    this._group = this.svgarea_store.layerGroup().append('g').attr('class', 'layer-component');

    var _this = this;

    var _onDblclickUnit = () => {
      var currentTarget = this.network_store.Graphs.target();
      if (this.network_store.Graphs.data().find((graph: any) => (graph.name === _this._userInputProperties.Network && graph.name !== currentTarget))) {
        this.network_store.Graphs.select(_this._userInputProperties.Network);
        d3.event.stopPropagation(); // layer追加防止の為
      }
    };

    this._mainImage = this._group.append("rect")
        .attr("width", dlayer.RECT_WIDTH)
        .attr("height", dlayer.RECT_HEIGHT)
        .style("fill", "#" + color)
        .style("stroke", "#" + color)
        .on("mouseenter", () => { this.sdneditor_store.stockLayer(self); })
        .on("mouseleave", () => { this.sdneditor_store.stockLayer(null); })
        .call(_dragEventHandlerAppender)
        .on('dblclick', () => {
            if (_this.type() === 'Unit') { // Unitの場合のみ
                _onDblclickUnit();
            }
        });
    this._warnImage = this._group.append("image")
            .attr("xlink:href", dlayer.WARN.IMAGE_SOURCE)
            .attr("x", dlayer.WARN.OFFSET_X)
            .attr("y", dlayer.WARN.OFFSET_Y)
            .attr("width", dlayer.WARN.WIDTH)
            .attr("height", dlayer.WARN.HEIGHT)
            .style("display", "none");

    var CONNECTOR_ACCEPTS = this.definitions_store.Definitions.EDIT.CONNECTOR.ACCEPTS;

    const filteredInputSideConnector = component.inputSideConnector.filter((inputSideConnector: any) => {
        // WithBiasがFalseの場合、bのサイドコネクターを表示しない
        if (opt.properties && (opt.properties.WithBias === 'False' || opt.properties.WithBias === false)) {
            if (inputSideConnector.name === 'b') {
                return false;
            }
        }
        return true;
    });

    // サイドコネクター（コンポーネント名に被らないように最初にappendする）
    var sideConnectorPosition = this.layer_store._sideConnectorPosition(filteredInputSideConnector.length);
    this._sideConnector = filteredInputSideConnector.map((connector: any) => new Connector(self,
        this._group,
        _linksLayer,
        _dragDelegate,
        this.definitions_store.Definitions.EDIT.CONNECTOR.IN,
        CONNECTOR_ACCEPTS.SINGLE,
        connector.name,
        connector.shortName || connector.name.substring(0, 1),
        dlayer.CONNECTOR.SIDE.FILL_COLOR,
        sideConnectorPosition.next(),
        this.definitions_store,
        this.graph_store,
        this.connector_store,
        this.svgarea_store,
        this.sdneditor_store,
        this.selection_store,
        this.link_store,
        this.history_store
    ));

    var _textGroup = this._group.append('g')
    .attr('clip-path', 'url(#' + dlayer.CLIP_PATH.ID + ')')
    .attr('transform', 'translate(' + dlayer.CLIP_PATH.OFFSET_X + ',' + this.definitions_store.Definitions.EDIT.LAYER.CLIP_PATH.OFFSET_Y + ')');

    // コンポーネント名
    this._label = _textGroup.append("text")
            .attr("x", dlayer.NAME_LABEL.OFFSET_X)
            .attr("y", dlayer.NAME_LABEL.OFFSET_Y)
            .attr("pointer-events", "none")
            .attr("fill", dlayer.NAME_LABEL.FONTCOLOR)
            .attr("font-size", dlayer.NAME_LABEL.FONTSIZE)
            .text(layerName);

    switch (this.type()) {

        case 'Unit':
            this._labelFirst = this._group.append("image")
                .call(_dragEventHandlerAppender)
                .on('dblclick', _onDblclickUnit)
                .attr("xlink:href", dlayer.UNIT.IMAGE_SOURCE)
                .attr("x", dlayer.UNIT.OFFSET_X)
                .attr("y", dlayer.UNIT.OFFSET_Y)
                .attr("width", dlayer.UNIT.WIDTH)
                .attr("height", dlayer.UNIT.HEIGHT);
                break;

        default:
            // コンポーネント名の頭文字
            this._labelFirst = this._group.append("text")
                    .attr("x", dlayer.DROPCAP_CHAR.OFFSET_X)
                    .attr("y", dlayer.DROPCAP_CHAR.OFFSET_Y)
                    .attr("fill", dlayer.DROPCAP_CHAR.FONTCOLOR)
                    .attr("font-size", dlayer.DROPCAP_CHAR.FONTSIZE)
                    .attr("pointer-events", "none")
                    .style("text-anchor", dlayer.DROPCAP_CHAR.TEXT_ANCHOR)
                    .text(type.substring(0, 1));
    }

    var _accepts = (num: number) => {
      switch (num) {
      case  0: return CONNECTOR_ACCEPTS.NONE;
      case  1: return CONNECTOR_ACCEPTS.SINGLE;
      default:
      case -1: return CONNECTOR_ACCEPTS.MULTIPLE;
      }
    };
    var _dragDelegate = {
        set: (context: any) => this.svgarea_store.setDragContext(context),
    };
    var _linksLayer = this.svgarea_store.linkGroup();
    if (component.input) {
        this._inConnector = new Connector(this,
            this._group,
            _linksLayer,
            _dragDelegate,
            this.definitions_store.Definitions.EDIT.CONNECTOR.IN,
            _accepts(component.input),
            '', // name
            '', // short name
            dlayer.CONNECTOR.STROKE_COLOR,
            { x: dlayer.CONNECTOR.OFFSET_X, y: 0, }, // mainImageとの相対座標
            this.definitions_store,
            this.graph_store,
            this.connector_store,
            this.svgarea_store,
            this.sdneditor_store,
            this.selection_store,
            this.link_store,
            this.history_store
        );
    }
    if (component.output) {
        this._outConnector = new Connector(this,
            this._group,
            _linksLayer,
            _dragDelegate,
            this.definitions_store.Definitions.EDIT.CONNECTOR.OUT,
            _accepts(component.output),
            '', // name
            '', // short name
            dlayer.CONNECTOR.STROKE_COLOR,
            { x: dlayer.CONNECTOR.OFFSET_X, y: dlayer.CONNECTOR.OUTPIN_OFFSET_Y, }, // mainImageとの相対座標
            this.definitions_store,
            this.graph_store,
            this.connector_store,
            this.svgarea_store,
            this.sdneditor_store,
            this.selection_store,
            this.link_store,
            this.history_store
        );
    }

    this._importantPropertyLabel = null;
    this._statisticsLabel = null;
    this._statisticsBar = null;
    this._importantProperty = '';

    var _label: any;
    switch(this.type()) {
        default:
            _label =_textGroup.append("text")
                .attr("x", dlayer.PROPERTY_LABEL.OFFSET_X)
                .attr("y", dlayer.PROPERTY_LABEL.OFFSET_Y)
                .attr('opacity', dlayer.PROPERTY_LABEL.OPACITY)
                .attr("pointer-events", "none")
                .style("fill", dlayer.PROPERTY_LABEL.FONTCOLOR)
                .style("font-size", dlayer.PROPERTY_LABEL.FONTSIZE)
                .style("font-weight", dlayer.PROPERTY_LABEL.FONTWEIGHT);
            this.displayComment = () => undefined;
            this.displayImportantProperty = () => {
                this._importantProperty = component.property.filter((prop: any) => prop.important).map((property: any) => {
                    var name = property.name;
                    return (property.shortName || name) + ' : ' + this._properties[name];
                }).filter((property: any) => {
                    return this.allLinks().findIndex((link: any) => link._destination && link._destination._name && link._destination._layer.name() === this.name() && property.startsWith(link._destination._name)) === -1;
                }).join(', ');
                _label.text(this._importantProperty);
            };
            this._importantPropertyLabel = _label;
            this.displayImportantProperty();
            break;
        case 'Comment':
            _label = this._group.append("foreignObject")
                .attr("width", dlayer.RECT_WIDTH)
                .attr("height", dlayer.RECT_HEIGHT)
                .append("xhtml:div")
                .style("font-size", dlayer.COMMENT.FONT_SIZE)
                .style("width", "100%")
                .style("height", "100%")
                .style("word-wrap", "break-word")
                .style("overflow", "hidden")
                .style("cursor", "default")
                .call(_dragEventHandlerAppender);
            this.displayComment = () => _label.text(this._userInputProperties.Comment || '');
            this.displayImportantProperty = () => undefined;
            this._mainImage.transition().style("fill", dlayer.COMMENT.FILL_COLOR);
            this._label.transition().style("display", "none");
            this._labelFirst.transition().style("display", "none");
            this._importantPropertyLabel = _label;
            this.displayComment();
            break;
    }

    this._statisticsBar = this._group.append("rect")
            .attr("x", dlayer.STATISTICS.BAR.OFFSET_X)
            .attr("y", dlayer.STATISTICS.BAR.OFFSET_Y)
            .attr("width", dlayer.STATISTICS.BAR.WIDTH)
            .attr("height", dlayer.STATISTICS.BAR.HEIGHT)
            .attr("pointer-events", "none")
            .style("fill", dlayer.STATISTICS.BAR.FILL_COLOR);
    this._statisticsLabel = this._group.append("text")
            .attr("x", dlayer.STATISTICS.LABEL.OFFSET_X)
            .attr("y", dlayer.STATISTICS.LABEL.OFFSET_Y)
            .attr("fill", dlayer.STATISTICS.LABEL.FONTCOLOR)
            .attr("font-size", dlayer.STATISTICS.LABEL.FONTSIZE)
            .attr("pointer-events", "none")
            .text("");

    this._orderList = [];

    this._orderArea = this._group.append('g');
    this._repeatArea = this._group.append("text")
            .attr('fill', dlayer.REPEAT.FONTCOLOR)
            .attr('font-size', dlayer.REPEAT.FONTSIZE)
            .attr('x', dlayer.REPEAT.OFFSET_X)
            .attr('y', dlayer.REPEAT.OFFSET_Y)
            .attr("pointer-events", "none")
            .text("");

    this._group.style("display", null);
    this.setPosition({x: x, y: y});

    this.graph_store.insertLayer(this);
  
  }

  // 入力コネクタを返す
  getInConnector(name?: any) {
    if (name) {
      return this._sideConnector.find((connector: any) => connector.name() === name);
    } else {
      return this._inConnector;
    }
  }

  // 出力コネクタを返す
  getOutConnector(name?: any) {
    if (name) {
      return null; // Day 1 時点で OutputSideConnector は存在しない
    } else {
      return this._outConnector;
    }
  }

  // サイドコネクタを含む全ての入力コネクタを返す
  getInConnectors() {
    let _valid = (x: any) => x;
    return this._sideConnector.concat(this._inConnector).filter(_valid);
  }

  // all link objects from connectors those lives in this layer.
  allLinks() {
    let _valid = (x: any) => x;
    var allConnectors = this._sideConnector.concat(this._inConnector, this._outConnector).filter(_valid);
    return allConnectors.map((c: any) => c.links()).reduce((a: any, b: any) => a.concat(b), []);
  };

  // 名前の設定と返却を行う
  name(name?: any) {
    var prev = this._label.text();
    if (name) this._label.text(name);
    return prev;
  }

  // 座標を返す
  getPosition() {
    var translate = this._group.attr('transform') || 'translate(0, 0)';
    var match = translate.match(/translate\((.+),(.+)\)/);
    return match ? {x: parseInt(match[1]), y: parseInt(match[2])} : {x: 0, y: 0};
  }

  // 座標を設定する
  setPosition(position: any) {
    var x = position.x;
    var y = position.y;
    this._group.attr("transform", "translate(" + x + "," + y + ")");
    this._selectFrame.attr("x", x).attr("y", y);
    this.graph_store.setDirtyLinksOf(this);
  }

  frameSize() {
    var size = {
      width: this.definitions_store.Definitions.EDIT.LAYER.FRAME.WIDTH,
      height: this.definitions_store.Definitions.EDIT.LAYER.FRAME.HEIGHT,
    };
    return size;
  }

  // Typeを返す
  type() {
    return this._component.name;
  }

  // Component を返す
  component() {
    return this._component;
  }

  // Propertiesを設定する
  setProperties(properties: any, components = []) {
    Object.assign(this._properties, properties);

    var component: any = components.find((property: any) => property.name === this.name());
    if (component) {
        // completeする前の情報を全て保持しておく。
        var _userInputPropertiesBackUp = JSON.parse(JSON.stringify(this._userInputProperties));

        this._component = JSON.parse(JSON.stringify(this._originalComponent));
        var _userInputProperties = JSON.parse(JSON.stringify(this._originalUserInputProperties));
        // completeによって追加されていないパラメータの値を引き継ぐ
        for (var prop in _userInputProperties) {
            _userInputProperties[prop] = this._userInputProperties[prop];
        }
        this._userInputProperties = _userInputProperties;

        component.orderList.forEach((propName: any, i: any) => {
            if (!this._component.property.find((property: any) => property.name === propName)) {
                var _component = component.property.find((property: any) => property.name === propName);
                this._component.property.splice(i, 0, _component);
                if (_component.editable) {
                    var value = _userInputPropertiesBackUp[_component.name];
                    if (value === undefined) {
                        this._userInputProperties[_component.name] = _component.value;
                    } else {
                        this._userInputProperties[_component.name] = value;
                    }
                }
            }
        });
    }
  }

  // return property value identified by parameter 'name'.
  getProperty(name: any) { 
    return this._properties[name]; 
  }

  // UserInputPropertiesを返す
  getUserInputProperty(name: any) {
      if (name === 'Name') {
          return this.name();
      } else {
          return this._userInputProperties[name];
      }
  }

  // UserInputPropertiesを設定する
  setUserInputProperty(name: any, value: any) {
      switch (name) {
          case 'Name':
              this.calcAndSetUniqueName(value);
              break;
          default:
              this._userInputProperties[name] = value;
              this.displayComment();
              this.editor_store.onChangedProperty(this.name(), name, value);
              break;
      }
  }

  /**
   * 選択状態を更新する
   *
   * @param {Boolean} setOrNot true: 選択状態にする, false: 選択状態を解除する
   */
  select(setOrNot: any) {
    const STROKE_DEFAULT = this.definitions_store.Definitions.EDIT.LAYER.FRAME.DEFAULT.STROKE_COLOR;
    const STROKE_FOCUSED = this.definitions_store.Definitions.EDIT.LAYER.FRAME.FOCUSED.STROKE_COLOR;
    this._selectFrame.style('stroke', setOrNot ? STROKE_FOCUSED : STROKE_DEFAULT);
    this.editor_store.onChangedSelection(this.selection_store.layer);
  }

  /**
   * 主選択状態を更新する
   *
   * @param {Boolean} setOrNot true: 主選択状態にする, false: 主選択状態を解除する
   */
  flagAsMain(setOrNot: any) {
    const FILTER_DEFAULT = this.definitions_store.Definitions.EDIT.LAYER.FRAME.DEFAULT.FILTER_URL;
    const FILTER_FOCUSED = this.definitions_store.Definitions.EDIT.LAYER.FRAME.FOCUSED.FILTER_URL;
    this._selectFrame.style('filter', setOrNot ? FILTER_FOCUSED : FILTER_DEFAULT);
    this.editor_store.onChangedSelection(this.selection_store.layer);
  };

  /**
   * 選択状態にあるかテストする
   *
   * @return {Boolean} 選択状態なら true、そうでなければ false
   */
  selected() {
    const STROKE_FOCUSED = this.definitions_store.Definitions.EDIT.LAYER.FRAME.FOCUSED.STROKE_COLOR;
    return this._selectFrame.style('stroke') === STROKE_FOCUSED;
  };

  // 削除する
  remove() {
    this.editor_store.onDeletedLayer(this.name());

    // viewの削除
    this.svgarea_store.hideAndRemove(this._mainImage);
    this.svgarea_store.hideAndRemove(this._warnImage);
    this.svgarea_store.hideAndRemove(this._selectFrame);
    this.svgarea_store.hideAndRemove(this._label);
    this.svgarea_store.hideAndRemove(this._labelFirst);
    [].concat(this._inConnector, this._outConnector, this._sideConnector)
    .filter(x => x).forEach((connector: any) => connector.remove());
    this.svgarea_store.hideAndRemove(this._importantPropertyLabel);
    this.svgarea_store.hideAndRemove(this._statisticsLabel);
    this.svgarea_store.hideAndRemove(this._statisticsBar);
    this.svgarea_store.hideAndRemove(this._group);

    // 管理対象から削除
    this.graph_store.removeLayer(this);

    // 不要になった参照を削除する
    delete this._grabbedPoint;
    delete this._startTouchPoint;
    delete this._startPosition;
    // delete this._selected;
    delete this._group;
    delete this._mainImage;
    delete this._warnImage;
    delete this._selectFrame;
    delete this._label;
    delete this._labelFirst;
    delete this._inConnector;
    delete this._sideConnector;
    delete this._outConnector;
    delete this._importantPropertyLabel;
    delete this._statisticsLabel;
    delete this._statisticsBar;
    // delete this._gridPosition;
  };

  // 隣接する上のレイヤーとの自動接続
  _deleteLinkBeforeExceedsLimit(linkTarget: any){
    var links = linkTarget.links();
    if (links.length === 1 && linkTarget.linkingLimit() === 1) {
        const target = links[0];
        const serialized = target.serialize();
        target.remove();
        return {
            destroy: () => this.link_store.findObjectBySerialized(serialized).remove(),
            repair: () => this.link_store.deserialize(serialized),
        };
    } else {
        return { destroy: () => undefined, repair: () => undefined, }; // nothing to do on Undo
    }
  }

  autoLink() {
    const LAYER_HEIGHT = this.definitions_store.Definitions.EDIT.LAYER.RECT_HEIGHT;
    var NullLayer = { getInConnector: () => null, getOutConnector: () => null, }
    var srcLink: any, dstLink: any;
    var linkTarget: any, linkOrigin: any;
    var target = this.getPosition();
    const deletedLinks = new Array(4);
    var layers = this.graph_store.getLayers();
    if ((linkOrigin = this.getInConnector())) {
        var onSourcePosition = (layer: any) => {
            var position = layer.getPosition();
            return position.x === target.x && position.y + LAYER_HEIGHT === target.y;
        };
        linkTarget = (layers.find(onSourcePosition) || NullLayer).getOutConnector();
        if (!linkTarget || linkTarget.links().find((l: any) => l.destination() === linkOrigin)) {
            srcLink = null;
        } else {
            deletedLinks[0] = this._deleteLinkBeforeExceedsLimit(linkOrigin);
            deletedLinks[1] = this._deleteLinkBeforeExceedsLimit(linkTarget);
            srcLink = linkTarget.linkTo(linkOrigin).serialize();
        }
    }
    if ((linkOrigin = this.getOutConnector())) {
        var onDestinationPosition = (layer: any) => {
            var position = layer.getPosition();
            return position.x === target.x && position.y - LAYER_HEIGHT === target.y;
        };
        linkTarget = (layers.find(onDestinationPosition) || NullLayer).getInConnector();
        if (!linkTarget || linkTarget.links().find((l: any) => l.source() === linkOrigin)) {
            dstLink = null;
        } else {
            deletedLinks[2] = this._deleteLinkBeforeExceedsLimit(linkOrigin);
            deletedLinks[3] = this._deleteLinkBeforeExceedsLimit(linkTarget);
            dstLink = linkOrigin.linkTo(linkTarget).serialize();
        }
    }
    return {
        redo: () => {
            deletedLinks.forEach(l => l.destroy());
            if (srcLink) this.link_store.deserialize(srcLink);
            if (dstLink) this.link_store.deserialize(dstLink);
        },
        undo: () => {
            if (srcLink) this.link_store.findObjectBySerialized(srcLink).remove();
            if (dstLink) this.link_store.findObjectBySerialized(dstLink).remove();
            deletedLinks.forEach(l => l.repair());
        },
    };
  }

  // 警告マークを表示するか設定する
  setErrorProperties(errorList: any) {
    var displayStyle;
    if (errorList && errorList.length) {
        displayStyle = null; // show icon.
        this._errorProperties = errorList;
    } else {
        displayStyle = 'none'; // hide icon.
        delete this._errorProperties;
    }
    this._warnImage.style("display", displayStyle);
  }

  // Propertyの値を変更する
  changePropertyValue(name: any, value: any) {
    if (name === 'Name') {
        this.calcAndSetUniqueName(this.layer_store.stripForbiddenCharactersForName(value));
    } else {
        if (name && name in this._properties) {
            this._userInputProperties[name] = value;
        }
    }
  }

  // Layerの情報をJson形式で返す
  serialize () {
    var position = this.getPosition();
    var properties = Object.assign({}, this._userInputProperties);
    delete properties.Name;
    return {
        name: this.name(),
        x: position.x,
        y: position.y,
        type: this.type(),
        properties: properties,
    }
  }

  errors() {
    return this._errorProperties || [];
  }

  // Statisticsを更新する
  updateStatistics(activeStatistics: any) {
    const STATBAR_WIDTH = this.definitions_store.Definitions.EDIT.LAYER.STATISTICS.BAR.MAXWIDTH;
    const product = (value: any) => (value || '0').split(',').map((x: any) => Number(x) || 0).reduce((a: any, b: any) => a * b, 1);
    const value = this._properties[activeStatistics.name] || '';
    const productValue = product(value);

    if (productValue === 0) {
        this._statisticsBar.transition().style("opacity", 0);
        this._statisticsLabel.transition().style("opacity", 0);
    } else {
        const maxValue = activeStatistics.max || 1;

        var dlayer = this.definitions_store.Definitions.EDIT.LAYER;
        const fontColor = this._isParam ? dlayer.STATISTICS.LABEL.PARAMFONTCOLOR : dlayer.STATISTICS.LABEL.FONTCOLOR;

        this._statisticsLabel.transition().style("opacity", 1);
        this._statisticsLabel.attr("fill", fontColor)
        this._statisticsLabel.text(value);
        this._statisticsBar.style("opacity", 1);
        this._statisticsBar.transition().duration(500).attr("width", (productValue / maxValue) * STATBAR_WIDTH);
    }
    this.displayImportantProperty();
  }

  updateOrderDisplay() {
    var dlayer = this.definitions_store.Definitions.EDIT.LAYER;
    var allLinks = this.allLinks();
    if (!allLinks.length) {
        this._orderArea.selectAll('*').remove();
        this._orderList = [];
        return;
    }

    var _hasMultiLink = (destinationLayer: any) => {
        return destinationLayer.allLinks().length <= 1;
    }
    var _MULTI_INPUTTABLE = -1;

    var appendList: any = [];
    this.allLinks().forEach((link: any) => {
        var destinationLayer = link.destination().layer();
        if (destinationLayer.name() === this.name()) { // 入力はあるが、出力がない場合は出力名に自レイヤーの名前が書かれる
            return;
        }

        if (_hasMultiLink(destinationLayer)) {
            return;
        }

        var component = this.nnabla_core_store.nnablaCore.layers.components.find((component: any) => component.name === destinationLayer.type());
        if (!component || component.input !== _MULTI_INPUTTABLE) {
            return;
        }

        var order = destinationLayer.allLinks().findIndex((link: any) => link.source().layer().name() === this.name());
        appendList.push(order + 1); // 表示に使う値とindexでずれが生じる為1を足す
    });

    if (!appendList.length) {
        this._orderArea.selectAll('*').remove();
        this._orderList = [];
        return;
    }

    this._orderArea.selectAll('*').remove();
    this._orderList = [];
    appendList.forEach((order: any) => {
        this._orderArea.append('text')
                .attr('fill', dlayer.ORDER.FONTCOLOR)
                .attr('font-size', dlayer.ORDER.FONTSIZE)
                .attr('x', dlayer.ORDER.OFFSET_X)
                .attr('y', dlayer.ORDER.OFFSET_Y)
                .text(order);
        this._orderList.push(order);
    });
  }

  updateRepeatDisplay() {
    let repeatCount = "";
    switch(this.type()) {
        case 'RepeatStart':
            repeatCount = this._properties.Times;
            this.displayRepeat(repeatCount, this._properties.ID, 'RepeatEnd');
            break;
        case 'RecurrentInput':
            repeatCount = this._properties.Input.split(',')[this._properties.Axis];
            if (repeatCount) {
                this.displayRepeat(repeatCount, this._properties.ID, 'RecurrentOutput');
            }
            break;
    }
  }

  displayRepeat(repeatCount: any, startId: any, endType: any, appendList: any = []) {
    // LoopControl開始レイヤーに対応する終了レイヤーの場合はスキップ
    if (this.type() === endType && this._properties.ID === startId) {
        return;
    }

    // リピート回数が空じゃない場合は追記
    if (this._repeatArea.text()) {
        this._repeatArea.text(this._repeatArea.text() + ' ' + repeatCount);
    } else {
        this._repeatArea.text('x' + repeatCount);
    }

    // 通ったレイヤーの名前を保存
    appendList.push(this.name());

    const allLinks = this.allLinks();
    allLinks.forEach((link: any) => {
        const destinationLayer = link.destination().layer();
        // 自レイヤーへのリンク、既に通ったレイヤーの場合はスキップ
        if (destinationLayer.name() === this.name() || appendList.indexOf(destinationLayer.name()) !== -1) {
            return;
        }
        destinationLayer.displayRepeat(repeatCount, startId, endType, appendList);
    });
  }

  deleteRepeatDisplay() {
    this._repeatArea.text("");
  }

  setIsParam(isParam: any) {
      this._isParam = isParam;
  }

  // ユニークなレイヤー名を計算してpropertiesにセットする
  calcAndSetUniqueName(name: any) {
    var others = this.graph_store.getLayers().filter((layer: any) => layer != this);
    var uniqueName = this.layer_store.stripForbiddenCharactersForName(this.layer_store.calcDefaultUniqueName(name, this.type(), others));
    this.name(uniqueName);
  }

  /** returns property list for PropertyPanel */
  typedProperties() {
    return this._component.property.map((original: any) => {
        return Object.assign({}, original, {value: this.getProperty(original.name)});
    });
  };

}
