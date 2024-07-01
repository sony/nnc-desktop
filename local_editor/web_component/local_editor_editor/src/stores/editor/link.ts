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

import { ref } from 'vue'
import { defineStore } from 'pinia'
import {useDefinitionsStore} from '../misc/definitions'
import {useGraphStore} from '../graph'

export const useLinkStore = defineStore('link', () => {
  const graph_store = useGraphStore()
  const definition_store = useDefinitionsStore()

  const _nullLayer = ref<any>({ getInConnector: () => undefined, getOutConnector: () => undefined, })

  const abs = Math.abs;
  function _selectNearest(pos: any, src: any, dest: any) {
    const x = pos.x, y = pos.y;
    var p1, p2;
    p1 = src.getPosition().y;
    p2 = dest.getPosition().y;
    if (abs(p1 - y) < abs(y - p2)) {
        return src;
    } else {
        p1 = src.getPosition().x;
        p2 = dest.getPosition().x;
        if (abs(p1 - x) < abs(x - p2)) {
            return src;
        } else {
            return dest;
        }
    }
  }

  function _forceToNewFormat(serialized: any) {
    if ('source' in serialized) {
      return {
          from_node: serialized.source.nodeName,
          from_name: serialized.source.name,
          to_node: serialized.destination.nodeName,
          to_name: serialized.destination.name,
      };
    } else {
        return serialized;
    }
  }

  function _findConnector(type: any, nodeName: any, name: any) {
    var layer = graph_store.getLayers().find((layer: any) => layer.name() === nodeName) || _nullLayer.value;
    switch (type) {
      case definition_store.Definitions.EDIT.CONNECTOR.IN:  return layer.getInConnector(name);
      case definition_store.Definitions.EDIT.CONNECTOR.OUT: return layer.getOutConnector(name);
      default:  return undefined;
    }
  }
  
  function deserialize(serialized: any) {
    serialized = _forceToNewFormat(serialized);
    var source = _findConnector(definition_store.Definitions.EDIT.CONNECTOR.OUT, serialized.from_node, serialized.from_name);
    var destination = _findConnector(definition_store.Definitions.EDIT.CONNECTOR.IN, serialized.to_node, serialized.to_name);
    if (source && destination) {
        return source.linkTo(destination);
    } else {
        return null;
    }
  }

  function findObjectBySerialized(serialized: any) {
    serialized = _forceToNewFormat(serialized);
    var source = _findConnector(definition_store.Definitions.EDIT.CONNECTOR.OUT, serialized.from_node, serialized.from_name);
    if (source) {
        var destination = _findConnector(definition_store.Definitions.EDIT.CONNECTOR.IN, serialized.to_node, serialized.to_name);
        return source.links().find((l: any) => l.destination() === destination) || null;
    } else {
        return null;
    }
  }

  /**
   * リンクpathのデータを返す
   * @param posEnd リンク線末端の座標
   * @param root リンク元のコネクターオブジェクト
   * @param target リンクが接続済み、または接続候補があればそのリンク先コネクターオブジェクト
   */
  function getPathData(posEnd: any, root: any, target: any) {
    var max = Math.max;
    var GRID = definition_store.Definitions.EDIT.GRID.SIZE;
    var RAD = GRID / 2;
    var posRoot = root.getPosition();
    var targetRight = target ? target.getPosition().x + GRID * 7.5 : -Infinity;
    // Draw straight line if linked to Input Side Connector.
    if (root.name() || target && target.name()) {
        return 'M ' + posRoot.x + ',' + posRoot.y + ' L ' + posEnd.x + ',' + posEnd.y;
    }
    if (root.getType() === definition_store.Definitions.EDIT.CONNECTOR.OUT) {
        if (posRoot.y <= posEnd.y) {
            return 'M ' + posRoot.x + ',' + posRoot.y +
                  ' L ' + posEnd.x + ',' + posEnd.y;
        // } else if (posRoot.x + GRID * 8 <= posEnd.x) {
        //     return 'M ' + posRoot.x + ',' + posRoot.y +
        //           ' v ' + GRID +
        //           ' a ' + (RAD) + ',' + (RAD) + ' 0 0,0 ' + ( RAD) + ',' + ( RAD) +
        //           ' H ' + (posEnd.x - RAD) +
        //           ' a ' + (RAD) + ',' + (RAD) + ' 0 0,0 ' + ( RAD) + ',' + (-RAD) +
        //           ' V ' + posEnd.y;
        // } else if (posRoot.y - GRID * 1.5 >= posEnd.y) {
        //     return 'M ' + posRoot.x + ',' + posRoot.y +
        //           ' v ' + GRID +
        //           ' a ' + (RAD) + ',' + (RAD) + ' 0 0,0 ' + ( RAD) + ',' + ( RAD) +
        //           ' H ' + max(posRoot.x + GRID * 7.5, posEnd.x + GRID * 2.5, targetRight) +
        //           ' a ' + (RAD) + ',' + (RAD) + ' 0 0,0 ' + ( RAD) + ',' + (-RAD) +
        //           ' V ' + (posEnd.y + RAD) +
        //           ' a ' + (RAD) + ',' + (RAD) + ' 0 0,0 ' + (-RAD) + ',' + (-RAD) +
        //           ' H ' + posEnd.x;
        } else {
            return 'M ' + posRoot.x + ',' + posRoot.y +
                  ' v ' + GRID +
                  ' a ' + (RAD) + ',' + (RAD) + ' 0 0,0 ' + ( RAD) + ',' + ( RAD) +
                  ' H ' + max(posRoot.x + GRID * 7.5, posEnd.x + GRID * 2.5, targetRight) +
                  ' a ' + (RAD) + ',' + (RAD) + ' 0 0,0 ' + ( RAD) + ',' + (-RAD) +
                  ' V ' + (posEnd.y - GRID) +
                  ' a ' + (RAD) + ',' + (RAD) + ' 0 0,0 ' + (-RAD) + ',' + (-RAD) +
                  ' H ' + (posEnd.x + RAD)+
                  ' a ' + (RAD) + ',' + (RAD) + ' 0 0,0 ' + (-RAD) + ',' + ( RAD) +
                  ' V ' + posEnd.y;
        }
    } else {
        if (posRoot.y >= posEnd.y) {
            return 'M ' + posRoot.x + ',' + posRoot.y +
                  ' L ' + posEnd.x + ',' + posEnd.y;
        // } else if (posRoot.x + GRID * 8 <= posEnd.x) {
        //     return 'M ' + posRoot.x + ',' + posRoot.y +
        //           ' v ' + (-GRID) +
        //           ' a ' + (RAD) + ',' + (RAD) + ' 0 0,1 ' + ( RAD) + ',' + (-RAD) +
        //           ' H ' + (posEnd.x - RAD) +
        //           ' a ' + (RAD) + ',' + (RAD) + ' 0 0,1 ' + ( RAD) + ',' + ( RAD) +
        //           ' V ' + posEnd.y;
        // } else if (posRoot.y + GRID * 1.5 <= posEnd.y) {
        //     return 'M ' + posRoot.x + ',' + posRoot.y +
        //           ' v ' + (-GRID) +
        //           ' a ' + (RAD) + ',' + (RAD) + ' 0 0,1 ' + ( RAD) + ',' + (-RAD) +
        //           ' H ' + max(posRoot.x + GRID * 7.5, posEnd.x + GRID * 2.5, targetRight) +
        //           ' a ' + (RAD) + ',' + (RAD) + ' 0 0,1 ' + ( RAD) + ',' + ( RAD) +
        //           ' V ' + (posEnd.y - RAD) +
        //           ' a ' + (RAD) + ',' + (RAD) + ' 0 0,1 ' + (-RAD) + ',' + ( RAD) +
        //           ' H ' + posEnd.x;
        } else {
            return 'M ' + posRoot.x + ',' + posRoot.y +
                  ' v ' + (-GRID) +
                  ' a ' + (RAD) + ',' + (RAD) + ' 0 0,1 ' + ( RAD) + ',' + (-RAD) +
                  ' H ' + max(posRoot.x + GRID * 7.5, posEnd.x + GRID * 2.5, targetRight) +
                  ' a ' + (RAD) + ',' + (RAD) + ' 0 0,1 ' + ( RAD) + ',' + ( RAD) +
                  ' V ' + (posEnd.y + GRID) +
                  ' a ' + (RAD) + ',' + (RAD) + ' 0 0,1 ' + (-RAD) + ',' + ( RAD) +
                  ' H ' + (posEnd.x + RAD) +
                  ' a ' + (RAD) + ',' + (RAD) + ' 0 0,1 ' + (-RAD) + ',' + (-RAD) +
                  ' V ' + posEnd.y;
        }
    }
  }

  function _mkHalfOpenLinkPath(group: any, link: any) {
    group.append('path')
        .attr('d', getPathData(link._destination.getPosition(), link._source, link._destination))
        .attr('stroke-width', definition_store.Definitions.EDIT.LINK.FOCUSED_DRAG.STROKE_WIDTH)
        .attr('stroke', definition_store.Definitions.EDIT.LINK.FOCUSED_DRAG.STROKE_COLOR)
        .attr('fill', 'none');
  }

  /** リンク接続済みのコネクター作図*/
  function _mkLinkedCircle(group: any, cx: any, cy: any) {
    var circle_svg = group.append('circle')
      .attr('cx', cx)
      .attr('cy', cy)
      .attr('r', definition_store.Definitions.EDIT.LAYER.CONNECTOR.JOIN_RADIUS)
      .attr('fill', definition_store.Definitions.EDIT.LAYER.CONNECTOR.STROKE_COLOR)
      .attr("pointer-events", "none");
    return circle_svg;
  };

  return {
    deserialize,
    findObjectBySerialized,
    getPathData,
    _selectNearest,
    _mkHalfOpenLinkPath,
    _mkLinkedCircle
  }
})
