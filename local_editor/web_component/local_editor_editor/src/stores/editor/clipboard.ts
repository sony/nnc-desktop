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
import { useSelectionStore } from '../selection'
import { useGraphStore } from '../graph'
import { useProjConvertStore } from '../project_converter'
import { useDefinitionsStore } from '../misc/definitions'
import { useConnectorStore } from './connector'
import { useSDUUtilsStore } from './sduutils'
import { useSDNEditorStore } from './sdneditor'
import { useEditorStore } from '../editor'
import { useNetworkStore } from '@/stores/network'
import { useHistoryStore } from '../history'
import { useNNABLACoreDefStore } from '@/stores/nnabla_core_def'
import { useUtilsStore } from '../utils'
import {useSVGAreaStore} from './svgarea'
import {useLayerStore} from './layer'
import {useLinkStore} from './link'
import Layer from "@/objects/Layer";

export const useClipboardStore = defineStore('clipboard', () => {
    const selection_store = useSelectionStore()
    const sduutils_store = useSDUUtilsStore()
    const editor_store = useEditorStore()
    const connector_store = useConnectorStore()
    const sdneditor_store = useSDNEditorStore()
    const graph_store = useGraphStore()
    const proj_convert_store = useProjConvertStore()
    const definitions_store = useDefinitionsStore()
    const network_store = useNetworkStore()
    const svgarea_store = useSVGAreaStore()
    const history_store = useHistoryStore()
    const layer_store = useLayerStore()
    const link_store = useLinkStore()
    const utils_store = useUtilsStore()
    const nnabla_core_def_store = useNNABLACoreDefStore()

    const _copiedData = ref<any>()

    /** Make test function whether link's source and destination are contained in layers. */
    function linkedWithin(layers: any) {
        return (link: any) => {
            const source = link.source().layer();
            const destination = link.destination().layer();
            return layers.includes(source) && layers.includes(destination);
        }
    }

    function _serialize() {
        const layers = selection_store.layer.members();
        const links = graph_store.getLinks().filter(linkedWithin(layers));
        return {
            nodes: layers.map((layer: any) => layer.serialize()),
            links: links.map((link: any) => link.serialize()),
        }
    }

    function _deserialize(clipped: any) {
        try {
            const clipboardData = proj_convert_store.importLayer(clipped).networks[0];
            const layers = graph_store.getLayers(); // エディター上の既存の全レイヤー

            // 復元用に現時点での選択状態を記憶する
            const focused = selection_store.layer.focused();
            const previouslySelecteds = selection_store.layer.apply((l: any) => l.serialize());
            const previouslyFocused = focused ? focused.serialize() : null;

            // 選択されているレイヤーまたはリンクがある場合は解除する
            selection_store.clear();
            // エディター上で最右端のレイヤーの右端座標を算出する
            const xs = layers.map((layer: any) => layer.getPosition().x);
            const offsetX = Math.max.apply(null, xs.concat(0)) + definitions_store.Definitions.EDIT.LAYER.BOUNDING_BOX.WIDTH;
            // クリップボード上データの最左端レイヤーの左端座標を得る
            const minX = Math.min.apply(null, clipboardData.nodes.map((node: any) => node.x));
            // エディター上の最右端レイヤーの隣にレイヤーを追加
            const layersInfo = clipboardData.nodes.map((data: any) => {
                // XXX omit serialization knowledge from here.
                // NOTE new sdn.Layer affects nnc.components.Editor's propMap data.
                // Be careful to change code here!
                const _data = Object.assign({}, data, {x: data.x + offsetX - minX});
                const newLayer = new Layer(_data, 
                                            svgarea_store,
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
                                            nnabla_core_def_store,
                                            network_store);
                return { layer: newLayer, name: data.name, };
            });

            // リンクを作成する
            const _findNode = (name: any) => layersInfo.find((info: any) => info.name === name).layer;
            const copiedLinks = clipboardData.links.map((link: any) => _findNode(link.from_node).getOutConnector(link.from_name)
                .linkTo(_findNode(link.to_node).getInConnector(link.to_name)).serialize());
                const copiedNodes = layersInfo.map((info: any) => info.layer.serialize());

            // フォーカス状態の変更
            // 最後に作成したレイヤーを主選択状態にする
            const _setFocusToCopied = (layers: any) => {
                selection_store.change(layers);
                if (layers.length) {
                    var layer = layers[layers.length - 1];
                    selection_store.layer.focus(layer);
                }
            };
            selection_store.layer.clear();
            _setFocusToCopied(layersInfo.map((info: any) => info.layer));
            history_store.execute({
                type: 'push',
                argument: {
                    name: () => 'Paste',
                    exec: () => {
                        selection_store.layer.clear();

                        var copiedLayers = copiedNodes.map(layer_store.deserialize);
                        copiedLinks.forEach(link_store.deserialize);

                        _setFocusToCopied(copiedLayers);
                    },
                    undo: () => {
                        selection_store.layer.clear();
                        copiedNodes.map(layer_store.findObjectBySerialized).forEach((layer: any) => layer.remove());
                        // 選択状態の復元
                        previouslySelecteds.map(layer_store.findObjectBySerialized).forEach((layer: any) => {
                            selection_store.layer.insert(layer);
                        });
                        if (previouslyFocused) {
                            var layer = layer_store.findObjectBySerialized(previouslyFocused);
                            selection_store.layer.focus(layer);
                        }
                    },
                },
            });
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * カット処理（マウス操作）
     */
    function cut() {
        document.execCommand('cut')
    }

    /**
     * コピー処理（マウス操作）
     */
    function copy() {
        document.execCommand('copy')
    }

    function _copy(e: any) {
        e.preventDefault();
        const serializedData = proj_convert_store.exportLayer(_serialize());
        e.clipboardData.setData('text', serializedData);
        _copiedData.value = serializedData;
    }

    /**
     * ペースト処理（マウス操作）
     */
    function paste(osData?: any) {
        if (![osData, _copiedData.value].find((data: any) => _deserialize(data))) {
            console.warn('Nothing is copied. Please copy layers and try again.');
        }
    }

    return {
        cut,
        copy,
        _copy,
        paste
    }
})
