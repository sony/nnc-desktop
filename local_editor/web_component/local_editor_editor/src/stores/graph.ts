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
import {useSDUUtilsStore} from './editor/sduutils'
import {useEditorStore} from './editor'
import {useSelectionStore} from './selection'
import {useHistoryStore} from './history'
import {useUtilsStore} from './utils'
import {useSVGAreaStore} from './editor/svgarea'
import {useLinkStore} from './editor/link'
import {useLayerStore} from './editor/layer'
import SetSDU from "@/objects/SetSDU";

export const useGraphStore = defineStore('graph', () => {
  const sduutils_store = useSDUUtilsStore()
  const layer_store = useLayerStore()
  const link_store = useLinkStore()
  const editor_store = useEditorStore()
  const selection_store = useSelectionStore()
  const history_store = useHistoryStore()
  const utils_store = useUtilsStore()
  const svgarea_store = useSVGAreaStore()

  const layers = ref<any>()
  const links = ref<any>()
  const selection = ref<any>()
  const _linksToUpdate = ref<any>()
  const _timeoutId = ref<any>()

  function init() {
    layers.value = new SetSDU(sduutils_store)
    links.value = new SetSDU(sduutils_store)
    selection_store.init(layers.value)
    selection.value = selection_store
    _linksToUpdate.value = new SetSDU(sduutils_store)
  }

  /** レイヤーを取得する
   *
   * @param {Function} f すべてのレイヤーに関数 f を適用して結果を返す（オプション）
   * @return {[Layer]} グラフ上すべての Layer オブジェクト。引数 f を指定した場合 {[f(Layer)]}
   */
  function getLayers(f?: any) {
    return layers.value.apply(f || ((x: any) => x))
  }        
  
  /** @param {Layer} layer 管理対象に追加するレイヤー */
  function insertLayer(layer: any) {
    layers.value.insert(layer)
    editor_store.onAddedLayer(layer)
  }

  /** @param {Layer} layer 管理対象から外すレイヤー */
  function removeLayer(layer: any) {
    selection.value.layer.remove(layer);
    layers.value.remove(layer);
  }

  /** リンクを取得する
   *
   * @param {Function} f すべてのリンクに関数 f を適用して結果を返す（オプション）
   * @return {[Link]} グラフ上のすべての Link オブジェクト。引数 f を指定した場合 {[f(Link)]}
   */
  function getLinks(f?: any) {
    return links.value.apply(f || ((x: any) => x))
  }     

  /** @param {Link} link 管理対象に追加するレイヤー */
  function insertLink(link: any) {
    links.value.insert(link)
  }

  /** @param {Link} link 管理対象から外すリンク */
  function removeLink(link: any) {
    selection.value.link.remove(link);
    links.value.remove(link);
  }

  function getSelection() {
    return selection.value
  }

  /** 全選択 */
  function selectAll() {
    selection.value.append(getLayers());
  }

  /** 選択反転 */
  function invertSelection() {
    selection.value.invert(getLayers());
  }

  /** レイヤーまたはリンクの削除 */
  function deleteSelection(name: any) {
    const members = selection.value.members();
    // 削除すればレイヤー間に張られたリンクも消えるが Undo でこれらリンクを復元する必要があることに注意。
    const layers = members.nodes.map((layer: any) => layer.serialize());
    const links = members.links.map((link: any) => link.serialize());
    const allLinks = getLinks().map((link: any) => link.serialize());

    history_store.execute({
        type: 'push-and-execute',
        argument: {
            exec: () => {
                links.map(link_store.findObjectBySerialized).forEach((link: any) => link.remove());
                layers.map(layer_store.findObjectBySerialized).forEach((layer: any) => layer.remove());
                utils_store.serialize_configuration();
                svgarea_store.requestAdjustSize();
            },
            undo: () => {
                layers.forEach(layer_store.deserialize);
                getLinks().forEach((link: any) => link.remove());
                allLinks.forEach(link_store.deserialize);
                utils_store.serialize_configuration();
                svgarea_store.requestAdjustSize();
            },
            name: () => name,
        },
    });
  }

  // remove all layers and links from current graph.
  function clear() {
      getLayers((layer: any) => layer.remove());
      getLinks((link: any) => link.remove());
  }

  function setDirtyLinksOf(layer: any) {
    clearTimeout(_timeoutId.value);
    _timeoutId.value = setTimeout(() => {
      _linksToUpdate.value.apply((link: any) => link.updateLinkLine());
      _linksToUpdate.value.clear();
    }, 0);
    layer.allLinks().forEach((link: any) => {
      _linksToUpdate.value.insert(link)
    });
  } 


  return {
    init,
    clear,
    getSelection,
    getLayers,
    getLinks,
    insertLayer,
    removeLayer,
    insertLink,
    removeLink,
    selectAll,
    invertSelection,
    deleteSelection,
    setDirtyLinksOf
  }
})
