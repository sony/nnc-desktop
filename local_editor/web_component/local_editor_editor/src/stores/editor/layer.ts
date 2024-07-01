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

import { defineStore } from 'pinia'
import {useUtilsStore} from '../utils'
import {useSVGAreaStore} from './svgarea'
import {useLinkStore} from './link'
import { useConnectorStore } from './connector'
import {useDefinitionsStore} from '../misc/definitions'
import {useGraphStore} from '../graph'
import {useEditorStore} from '../editor'
import { useSelectionStore } from '../selection'
import { useNetworkStore } from '../network'
import { useSDUUtilsStore } from './sduutils'
import { useSDNEditorStore } from './sdneditor'
import { useHistoryStore } from '../history'
import {useNNABLACoreDefStore} from '../nnabla_core_def'
import Layer from "@/objects/Layer";

export const useLayerStore = defineStore('layer', () => {
  const utils_store = useUtilsStore()
  const graph_store = useGraphStore()
  const editor_store = useEditorStore()
  const network_store = useNetworkStore()
  const sduutils_store = useSDUUtilsStore()
  const svgarea_store = useSVGAreaStore()
  const definitions_store = useDefinitionsStore()
  const nnabla_core_store = useNNABLACoreDefStore()
  const link_store = useLinkStore()
  const connector_store = useConnectorStore()
  const sdneditor_store = useSDNEditorStore()
  const selection_store = useSelectionStore()
  const history_store = useHistoryStore()
  
  // restore layer by serialized data.
  function deserialize(serialized: any) {
    if (serialized && serialized.type && utils_store.getComponent(serialized.type)) {
        return new Layer(
          serialized, 
          svgarea_store,
          utils_store,
          definitions_store,
          graph_store,
          useLayerStore(),
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
    }
  };

  /**
   * find layer by serialized data.
   */
  function findObjectBySerialized(serialized: any) {
    var _same = (a: any, b: any) => Object.keys(a).every(k => a[k] === b[k]) && Object.keys(a).length == Object.keys(b).length;
    var layer = graph_store.getLayers().find((layer: any) => layer.name() === serialized.name);
    if (layer && _same(layer._userInputProperties, serialized.properties)) {
        return layer;
    } else {
        return null;
    }
  }

  function splitName(name: any) {
    var split = function(name: string) {
        var index = name.lastIndexOf('_');
        if (index >= 0) {
            return {name: name.substring(0, index), suffix: name.substring(index + 1)};
        } else {
            return {name: name, suffix: ''};
        }
    }

    var splitted = split(name);
    var num = Number(splitted.suffix);
    if (num > 0 && num === parseInt(String(num)) && splitted.suffix === String(num)) {
        // 1 以上の整数と解釈できる文字列で、 1.0 など小数点を含まない文字列であれば
        // 末尾の '_' の前を名前、後ろを数値として返す。
        return {name: splitted.name, number: num};
    } else {
        return {name: name, number: 1};
    }
  }

  function findGap(numbers: any) {
    /* ソート済みの数値配列から、数値が不連続になったインデックスを返す */
    // ソート済み配列を対象にして、インデックスと要素の値が同じなら、
    // そこまでの数字は使われているという事実を使って二分探索する
    var beg = 0;
    var end = numbers.length; // 末尾要素の隣のインデックスを検索範囲とする
    while (beg != end - 1) { // 検索範囲が 1 要素に確定するまでループを回す
        var mid = parseInt(String((beg + end) / 2));
        if (numbers[mid] == mid) beg = mid; else end = mid;
    }
    return end; // 末尾要素のインデックスの隣が使われていない数字
  }

  function uniqueSuffixedName(name: any, layers: any) {
    var splitted = splitName(name);
    var numbers = layers.map((layer: any) => splitName(layer.name())) // レイヤー名と末尾数値の組に変換
        .filter((pair: any) => pair.name == splitted.name) // 名前が等しいものを抽出
        .map((pair: any) => pair.number); // 分離した末尾の数字に変換
    if (numbers.find((n: any) => n === splitted.number)) {
        numbers.sort((a: any, b: any) => a - b); // ソート
        // [0] + [1,...] という配列にする
        numbers.unshift(0);
        // 既存のレイヤーで使われている数字から、（無印を 1 として） 1 以上の使われていない数字を検索
        var newNumber = findGap(numbers);
        // 使われていない数字が 1 以外なら _N というサフィックスを追加して返却
        return splitted.name + (newNumber === 1 ? '' : '_' + newNumber);
    } else {
        return name; // 重複がないので、もとの名前をそのまま返す
    }
  }

  function calcDefaultUniqueName(originalValue: any, type: any, layers: any) {
    var name = originalValue || type;
    return uniqueSuffixedName(name, layers);
  }

  /**
   * InputSideConnector の位置を取得するオブジェクトを生成する。
   * @param length 生成する位置の数。
   */
  function _sideConnectorPosition(length: number) {
    var MARGIN_X = definitions_store.Definitions.EDIT.LAYER.CONNECTOR.SIDE.MARGIN_X;
    var MARGIN_Y = definitions_store.Definitions.EDIT.LAYER.CONNECTOR.SIDE.MARGIN_Y;
    var START_OFFSET_X = definitions_store.Definitions.EDIT.LAYER.CONNECTOR.SIDE.START_OFFSET_X;
    var START_OFFSET_Y = definitions_store.Definitions.EDIT.LAYER.CONNECTOR.SIDE.START_OFFSET_Y;
    var maxConnectors = Math.max.apply(null, nnabla_core_store.nnablaCore.layers.components.map((comp: any) => comp.inputSideConnector.length));
    var x = (() => { var x = START_OFFSET_X, _; return () => ([x, _] = [x - MARGIN_X, x])[1]; })();
    var y = (() => { var y = START_OFFSET_Y, _ = y - MARGIN_Y; return () => ([y, _] = [_, y])[1]; })();
    var positions = Array(maxConnectors).fill(null).map(_ => { return { x: x(), y: y(), }; });
    var ps = positions.slice(0, length).reverse();
    return { next: (() => { var i = 0; return () => ps[i++]; })(), };
  }

  // レイヤー名のエスケープ
  function stripForbiddenCharactersForName(name: any) {
    return name.replace(/[^A-Za-z0-9'_#]/g, '').replace(/#/g, '_');
  };

  return {
    deserialize,
    findObjectBySerialized,
    calcDefaultUniqueName,
    _sideConnectorPosition,
    uniqueSuffixedName,
    splitName,
    findGap,
    stripForbiddenCharactersForName
  }
})
