<!-- Copyright 2024 Sony Group Corporation. -->
<!--
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
-->

<script setup lang="ts">
import NetworkAction from './network-action/NetworkAction.vue'
import NetworkTabs from './network-tabs/NetworkTabs.vue'
import ContextMenu from './network-action/ContextMenu.vue'
import Layer from '@/objects/Layer'
import { useEditorStore } from '@/stores/editor'
import { useUtilsStore } from '@/stores/utils'
import { useHistoryStore } from '@/stores/history'
import { useLayerStore } from '@/stores/editor/layer'
import { useConnectorStore } from '@/stores/editor/connector'
import { useSDNEditorStore } from '@/stores/editor/sdneditor'
import { useSDUUtilsStore } from '@/stores/editor/sduutils'
import { useLinkStore } from '@/stores/editor/link'
import { useNetworkStore } from '@/stores/network'
import { useNNABLACoreDefStore } from '@/stores/nnabla_core_def'
import { useSVGAreaStore } from '@/stores/editor/svgarea'
import { useContextMenuStore } from '@/stores/editor/context_menu'
import { useGraphStore } from '@/stores/graph'
import { useDefinitionsStore } from '@/stores/misc/definitions'
import { useSelectionStore } from '@/stores/selection'
import { computed, ref, nextTick, onMounted, onUnmounted } from 'vue'
const editor_store = useEditorStore()
const network_store = useNetworkStore()
const sduutils_store = useSDUUtilsStore()
const utils_store = useUtilsStore()
const nnabla_core_def_store = useNNABLACoreDefStore()
const sdneditor_store = useSDNEditorStore()
const connector_store = useConnectorStore()
const svgarea_store = useSVGAreaStore()
const selection_store = useSelectionStore()
const layer_store = useLayerStore()
const link_store = useLinkStore()
const history_store = useHistoryStore()
const graph_store = useGraphStore()
const definitions_store = useDefinitionsStore()
const context_menu_store = useContextMenuStore()


const uop = utils_store.allowedUserOperation;
const dl = () => svgarea_store.draggingLayer(); // sdn.s.svgArea have not been exist yet... (SDUApp.js loaded last)

const layerTextClipId = ref(definitions_store.Definitions.EDIT.LAYER.CLIP_PATH.ID)
const layerTextClipWidth = ref(definitions_store.Definitions.EDIT.LAYER.CLIP_PATH.WIDTH)
const layerTextClipHeight = ref(definitions_store.Definitions.EDIT.LAYER.CLIP_PATH.HEIGHT)
const contextMenuElement = ref(null);
const container = ref(document.createElement("div"));
const containerLeft = ref(0)
const containerTop = ref(40)

const values = computed(() => {
    return utils_store.indexOperator(editor_store.zoomInfo.networkGraph.percentages, editor_store.zoomInfo.networkGraph.percentage)
})

function onscroll() {
    editor_store.updateDetection = !editor_store.updateDetection;
}

function deleteLayerKeepingLinks() {
    if (uop() && !dl() && 0 < selection_store.layer.members().length) {
        var _links = (connector: any) => connector ? connector.links() : [];
        var _serialize = (object: any) => object.serialize();
        var _concat = (a: any, b: any) => b.concat(a);

        // 主選択レイヤーと全てのリンクを取得する
        var layer = selection_store.layer.focused();

        // generate undo info (to recover current graph)
        var _undoInfo = {
            layer: layer.serialize(),
            links: layer.allLinks().map(_serialize),
        };

        // extract source and destination connector.
        var _defaultPin = (connector: any) => connector.isDefault();
        var pinsOfSrcOut = _links(layer.getInConnector()).map((link: any) => link.source()).filter(_defaultPin);
        var pinsOfDestIn = _links(layer.getOutConnector()).map((link: any) => link.destination()).filter(_defaultPin);

        // execute remove and reconnect
        layer.remove(); // remove its connected links also.
        var reconnecteds; // gather up newly created links.
        if (pinsOfSrcOut.length) {
            var out = pinsOfSrcOut[0];
            const safeLinkTo = (connector: any) => {
                try {
                    return out.linkTo(connector);
                } catch(e) {
                    return null;
                }
            };
            reconnecteds = pinsOfDestIn.map(safeLinkTo).filter(Boolean);
        } else {
            reconnecteds = [];
        }
        // generate redo info.
        var _redoInfo = {
            links: reconnecteds.map(_serialize),
        };

        var _restoreLayer = (serialized: any) => layer_store.deserialize(serialized);
        var _restoreLinks = (array: any) => array.forEach(link_store.deserialize);
        var _removeLinks = (array: any) => array.map(link_store.findObjectBySerialized).filter((x: any) => x).forEach((l: any) => l.remove());
        var _removeLayer = (serialized: any) => (layer_store.findObjectBySerialized(serialized) || {remove: () => undefined}).remove();

        // push command (prepare next undo/redo)
        var command = {
            type: 'push',
            argument: {
                name: () => 'Delete',
                exec: () => {
                    _removeLinks(_undoInfo.links);
                    _removeLayer(_undoInfo.layer);
                    _restoreLinks(_redoInfo.links);
                },
                undo: () => {
                    _removeLinks(_redoInfo.links);
                    _restoreLayer(_undoInfo.layer);
                    _restoreLinks(_undoInfo.links);
                },
            }
        }
        history_store.execute(command)
    }
}

function grabAllLayers() {
    if (uop()) {
        graph_store.selectAll();
    }
}

function deleteLayer() {
    if (uop() && !dl()) {
        graph_store.deleteSelection('Delete')
    }
}

function insertLayer() {
    var component = editor_store.selectedComponent;
    if (uop() && component && selection_store.layer.focused()) {
        // レイヤー名からレイヤーオブジェクトを取得する
        var _findLayerByName = (name: any) => {
            return graph_store.getLayers().find((layer: any) => layer.name() == name);
        };

        var LAYER_HEIGHT = definitions_store.Definitions.EDIT.LAYER.RECT_HEIGHT;
        var focused = selection_store.layer.focused();
        var focusedPosition = focused.getPosition();
        var _offsetHeight = (position: any) => { return {x: position.x, y: position.y + LAYER_HEIGHT}; };
        var movedLayers = graph_store.getLayers((layer: any) => {
            var position = layer.getPosition();
            if (focusedPosition.y <= position.y) {
                layer.setPosition(_offsetHeight(position));
                return {name: layer.name(), position: position};
            } else {
                return null;
            }
        }).filter((x: any) => x);
        var links = (focused.getInConnector() || {links: () => []}).links();
        var outConnectors = links.map((l: any) => l.source());
        var oldLinks = links.map((l: any) => l.serialize());
        links.forEach((link: any) => link.remove());

        // Componentで選択しているレイヤーをフォーカスレイヤーがいた位置に挿入する
        var layer = new Layer(
            {
                type: component,
                x: focusedPosition.x,
                y: focusedPosition.y,
            }, 
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
            network_store
        );

        // リンクの接続先変更または削除を行う
        var in_ = layer.getInConnector();
        var out_ = layer.getOutConnector();
        var newLinks: any;
        if (in_) {
            const _makeLinkToIn = (out: any) => out.linkTo(in_);
            const _serialize = (link: any) => link.serialize();
            const takeLastIfInputLimited = (connectors: any) => in_.linkingLimit() === 1 ? connectors.splice(connectors.length - 1, 1) : connectors;
            newLinks = takeLastIfInputLimited(outConnectors).map(_makeLinkToIn).map(_serialize);
        } else {
            newLinks = [];
        }
        if (out_ && (links.length > 0 || focused.getInConnector())) {
            var link = out_.linkTo(focused.getInConnector());
            newLinks.push(link.serialize());
        }

        var inserted = layer.serialize();

        let command = {
            type: 'push',
            argument: {
                exec: () => {
                    movedLayers.forEach((layer: any) => _findLayerByName(layer.name).setPosition(_offsetHeight(layer.position)));
                    oldLinks.map(link_store.findObjectBySerialized).forEach((l: any) => l.remove());
                    layer_store.deserialize(inserted);
                    newLinks.forEach(link_store.deserialize);
                },
                undo: () => {
                    newLinks.map(link_store.findObjectBySerialized).forEach((link: any) => link.remove());
                    layer_store.findObjectBySerialized(inserted).remove();
                    oldLinks.forEach(link_store.deserialize);
                    movedLayers.forEach((layer: any) => _findLayerByName(layer.name).setPosition(layer.position));
                },
                name: () => { return "Insert layer : " + component; },
            },
        }
        history_store.execute(command)
    }
}

function freeGrabbedLayers() {
    if (uop()) {
        selection_store.clear();
    }
}

function zooming(event: any) {
    var percentage;
    switch (event.keyCode) {
        case definitions_store.Definitions.KEY_CODE.ZERO:
            percentage = 100;
            break;

        case definitions_store.Definitions.KEY_CODE.PLUS_WIN:
        case definitions_store.Definitions.KEY_CODE.PLUS_MAC:
            if (values.value.canMoveNext) {
                percentage = values.value.next;
            }
            break;

        case definitions_store.Definitions.KEY_CODE.MINUS:
            if (values.value.canMovePrev) {
                percentage = values.value.prev;
            }
            break;
    }
    if (uop() && percentage) {
        let operation = {name: 'Editor', percentage: percentage}
        editor_store.operateZooming(operation)
    }
}

function zoomingByWheel(event: any) {
    event.preventDefault();
    event.stopPropagation();
    const percentage = event.wheelDelta <= -120 && values.value.canMovePrev ? values.value.prev : event.wheelDelta >= 120 && values.value.canMoveNext ? values.value.next : undefined;
    if (percentage) {
        let operation = {name: 'Editor', percentage: percentage}
        editor_store.operateZooming(operation)
    }
}

function addLayer() {
    var component = editor_store.selectedComponent;
    if (component) {
        svgarea_store.addLayer(component);
    }
}

const getOuterHeight = (element: HTMLElement , includeMargin = false) => {
  let height = element.offsetHeight;

  if (includeMargin) {
    const style = getComputedStyle(element);
    height += parseInt(style.marginTop) + parseInt(style.marginBottom);
  }

  return height;
};


function popUpMenu(e: any) {
    if (e.buttons === 2) {
        let x = e.offsetX;
        let y = e.pageY - containerTop.value;
        const contextMenu = contextMenuElement.value;
        const target = contextMenu ? contextMenu.$refs.contextMC : null
        if (target) {
            context_menu_store.setContextMenuShown(true)
            nextTick(() => {
                const menuBottom = e.pageY + getOuterHeight(target, true);
                if (menuBottom > window.innerHeight) {
                    y = e.pageY - (menuBottom - window.innerHeight);
                }
                context_menu_store.setContextMenuPos({
                    menuleft: x,
                    menutop: y
                })
            });
        }
    } else {
        context_menu_store.setContextMenuShown(false)
    }
}

const updatePosition = () => {
  if (container.value) {
    const { left, top } = container.value.getBoundingClientRect()
    containerLeft.value = left
    containerTop.value = top
  }
};

onMounted(() => {
  const observer = new ResizeObserver(() => {
    updatePosition();
  });

  if (container.value) {
    observer.observe(container.value);
    updatePosition();
  }

  onUnmounted(() => {
    if (container.value) {
      observer.unobserve(container.value);
    }
  });
})

</script>
<template>
    <div ref="container" class="edit-network-operation-content">
        <NetworkTabs/>
        <NetworkAction :edit-container-left="containerLeft" :edit-container-top="containerTop"/>
        <ContextMenu ref="contextMenuElement" v-show="context_menu_store.contextMenuShown"/>
        <div class="tab-content network-editor-scroller" @scroll="onscroll">
            <svg id="network-editor" tabindex="0"
            @keydown.ctrl.a.prevent="grabAllLayers"
            @keydown.meta.a.prevent="grabAllLayers"
            @keyup.backspace="deleteLayerKeepingLinks"
            @keyup.delete="deleteLayer"
            @keyup.insert="insertLayer"
            @keyup.esc="freeGrabbedLayers"
            @keydown.alt="zooming"
            @mousewheel.alt="zoomingByWheel"
            @dblclick="addLayer"
            @mousedown="popUpMenu"
            >
                <clipPath :id="layerTextClipId">
                    <rect :x="0" :y="0" :width="layerTextClipWidth" :height="layerTextClipHeight" />
                </clipPath>
                <defs>
                    <filter id="frameshadow" filterUnits="userSpaceOnUse">
                        <feGaussianBlur result="blurOut" stdDeviation="1"></feGaussianBlur>
                        <feOffset result="offOut" in="blurOut"></feOffset>
                        <feBlend in="offOut" mode="normal"></feBlend>
                    </filter>
                </defs>
            </svg>
        </div>
    </div>
</template>