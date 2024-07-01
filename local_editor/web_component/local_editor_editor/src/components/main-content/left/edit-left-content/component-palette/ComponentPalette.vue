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
import { ref, reactive, onMounted, onUpdated, computed } from 'vue'
import Layer from '@/objects/Layer'
import ComponentCategory from './ComponentCategory.vue'
import { useLanguageStore } from '@/stores/misc/languages'
import { useEditorStore } from '@/stores/editor'
import { useLayerStore } from '@/stores/editor/layer'
import { useGraphStore } from '@/stores/graph'
import { useHistoryStore } from '@/stores/history'
import { useSDNEditorStore } from '@/stores/editor/sdneditor'
import { useSDUUtilsStore } from '@/stores/editor/sduutils'
import { useLinkStore } from '@/stores/editor/link'
import { useSelectionStore } from '@/stores/selection'
import { useUtilsStore } from '@/stores/utils'
import { useNNABLACoreDefStore } from '@/stores/nnabla_core_def'
import { useSVGAreaStore } from '@/stores/editor/svgarea'
import { useDefinitionsStore } from '@/stores/misc/definitions'
import { useNetworkStore } from '@/stores/network'
import { useConnectorStore } from '@/stores/editor/connector'

const language_store = useLanguageStore()
const sduutils_store = useSDUUtilsStore()
const sdneditor_store = useSDNEditorStore()
const editor_store = useEditorStore()
const layer_store = useLayerStore()
const history_store = useHistoryStore()
const selection_store = useSelectionStore()
const nnabla_core_def_store = useNNABLACoreDefStore()
const connector_store = useConnectorStore()
const svgarea_store = useSVGAreaStore()
const definitions_store = useDefinitionsStore()
const network_store = useNetworkStore()
const utils_store = useUtilsStore()
const graph_store = useGraphStore()
const link_store = useLinkStore()

const text = ref('')
const selectedLayerName = ref('')
const language = reactive(language_store.language)

const filteredCategory = computed(() => {
    var categories = nnabla_core_def_store.nnablaCore.layers.categories;
    return categories.filter(category => {
        return ((category.name || '').toLowerCase().indexOf((text.value || '').toLowerCase()) > -1 || category.components.find(component => {
            return component.toLowerCase().indexOf((text.value || '').toLowerCase()) > -1;
        }) !== undefined)
    });
})

function keydown(e: { keyCode: number }) {
    if (e.keyCode === 27) { // Esc
        text.value = ''
    }
}

function onUpdateSelected(name: string, shouldNotShowOverLay: boolean) {
    // this.$emit('selected-component', name)
    editor_store.selectedComponent = name
    if (!shouldNotShowOverLay) {
        selectedLayerName.value = name
    } else {
        selectedLayerName.value = ''
    }
}

function hideOverLay() {
    selectedLayerName.value = ''
}

function getStyleForOverRay(selectedLayerNameInput: string): string {
    const lowerselectedLayerName = selectedLayerName.value.substring(0, 1).toLowerCase() + selectedLayerName.value.substring(1);
    const leftContentWidth = $('.left-content').width()
    const visibility = selectedLayerNameInput.length ? 'visible' : 'hidden'
    if (lowerselectedLayerName) {
        const pointerX: any = $('#' + lowerselectedLayerName).offset()
        return `left: ${leftContentWidth}px; top: ${pointerX.top}px; visibility: ${visibility}`
    } else {
        return `left: ${leftContentWidth}px; visibility: ${visibility}`
    }
}

function setEvent() {
    // configure drag event handler for component palette item.
    var _dragContext: any

    var emitChangeSelectedComponent = (name: string) => {onUpdateSelected(name, true)}

    var callbackAddLayer = function(cursor: { x: number; y: number }) {
        // 二回目以降の SVG 領域への Enter イベントで、再追加しないようコールバックを外す
        svgarea_store.unsubscribeMouseEnter(callbackAddLayer);

        var type = editor_store.selectedComponent

        // 既存選択の解除
        selection_store.clear();

        var offseted = {
            x: cursor.x - definitions_store.Definitions.EDIT.LAYER.RECT_WIDTH / 2,
            y: cursor.y - definitions_store.Definitions.EDIT.LAYER.RECT_HEIGHT / 2,
        };
        _dragContext = (() => {
            // レイヤー追加
            var option = {type: type, x: offseted.x, y: offseted.y};
            var layerAddedMouseEnter = new Layer(option, 
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
            var properties = Object.assign({}, layerAddedMouseEnter._allProperties());
            delete properties.Name;
            const networkTabIndex = network_store.Graphs.targetIndex();
            editor_store.configuration.networks[networkTabIndex].nodes.push({
                name: layerAddedMouseEnter.name(),
                properties: properties,
                type: option.type,
                x: option.x,
                y: option.y
            });
            selection_store.layer.focus(layerAddedMouseEnter);
            layerAddedMouseEnter.autoLink();

            // 移動予測位置追加
            svgarea_store.showGrid();
            var frame = svgarea_store.createLayerDestinationFrame(offseted);
            return {
                move: (cursor: { x: number; y: number }) => {
                    var position = {
                        x: cursor.x - definitions_store.Definitions.EDIT.LAYER.RECT_WIDTH / 2,
                        y: cursor.y - definitions_store.Definitions.EDIT.LAYER.RECT_HEIGHT / 2,
                    };
                    utils_store.move(layerAddedMouseEnter.name(), position);
                    layerAddedMouseEnter.setPosition(position);
                    frame.move(svgarea_store.calcLayerDropPosition(layerAddedMouseEnter));
                    svgarea_store.trackCursorMovement(cursor);
                },
                destroy: () => {
                    svgarea_store.hideGrid();
                    var dropPosition = svgarea_store.calcLayerDropPosition(layerAddedMouseEnter);
                    layerAddedMouseEnter.setPosition(dropPosition);
                    var autoLinked = layerAddedMouseEnter.autoLink();
                    frame.destroy();
                    svgarea_store.requestAdjustSize();

                    var serialized = layerAddedMouseEnter.serialize();
                    let command = {
                        exec: () => {
                            var layer = layer_store.deserialize(serialized);
                            selection_store.clear();
                            selection_store.layer.focus(layer);
                            autoLinked.redo();
                            svgarea_store.requestAdjustSize();
                        },
                        undo: () => {
                            autoLinked.undo();
                            layer_store.findObjectBySerialized(serialized).remove();
                            svgarea_store.requestAdjustSize();
                        },
                        name: () => 'Add layer : ' + type,
                    }
                    history_store.execute({type: 'push', argument: command})
                },
            };
        })();
    };

    d3.selectAll('.component').call(
        d3.behavior.drag()
        .on("dragstart", () => {
            let target = d3.event.sourceEvent.target
            var type = $(target).text();
            $(target)[0].focus();
            emitChangeSelectedComponent(type);

            // create null context
            _dragContext = {
                move: (cursor: any) => undefined,
                destroy: () => undefined,
            };

            // マウスカーソルが編集領域に入ったときにはじめて、レイヤーを追加する
            svgarea_store.subscribeMouseEnter(callbackAddLayer);
        })
        .on("drag", function() {
            // レイヤーの移動
            var mouse = d3.mouse(d3.select(definitions_store.Definitions.EDIT.SVG_ID).node());
            _dragContext.move({x: mouse[0], y: mouse[1]});
        })
        .on("dragend", function() {
            _dragContext.destroy();
            _dragContext = undefined;

            svgarea_store.unsubscribeMouseEnter(callbackAddLayer);
        })
    );

}

// hooks
onMounted(() => {
    setEvent()
})

onUpdated(() => {
    setEvent()
})

</script>

<template>
    <div>
        <div class="title components-area">
            <span>{{language.edit.COMPONENTS}}</span>
            <input v-model="text" :placeholder="language.edit.SEARCH" @keydown="keydown" :disabled="editor_store.readOnly">
        </div>
        <div class="app-row app-scroll-x app-scroll-y" style="top: 70px; bottom: 0; padding: 0 16px 0 16px;">
            <ComponentCategory
                v-for="category in filteredCategory"
                :key="category.name"
                :category="category"
                :text="text"
                @update:selected="onUpdateSelected"
                @hideOverLay="hideOverLay"
                />
        </div>
        <div class="layer-overray" :style="getStyleForOverRay(selectedLayerName)">
            <iframe @mousedown.stop :src="language.LAYER_REFER + selectedLayerName" width="100%" height="100%" />
        </div>
    </div>
</template>