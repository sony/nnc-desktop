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
import { computed, ref } from 'vue';
import { useEditorStore } from '@/stores/editor'
import { useGraphStore } from '@/stores/graph'
import { useSelectionStore } from '@/stores/selection'
import { useNetworkStore } from '@/stores/network'
import { useUtilsStore } from '@/stores/utils'
import { useHistoryStore } from '@/stores/history'
import { storeToRefs } from 'pinia';
import PropBool from './PropBool.vue'
import PropFile from './PropFile.vue'
import PropImmutable from './PropImmutable.vue'
import PropName from './PropName.vue'
import PropSelect from './PropSelect.vue'
import PropText from './PropText.vue'
const editor_store = useEditorStore()
const network_store = useNetworkStore()
const history_store = useHistoryStore()
const utils_store = useUtilsStore()
const selection_store = useSelectionStore()
const graph_store = useGraphStore()
const props = defineProps<{
    layer: any, 
}>()

const rename = ref<any>(undefined)
const {selection} = storeToRefs(editor_store)

function getDynamicaComponent(type: string) {
    if(type) {
        if(type.toLowerCase() === 'immutable') { return PropImmutable }
        if(type.toLowerCase() === 'name') { return PropName }
        if(type.toLowerCase() === 'text') { return PropText }
        if(type.toLowerCase() === 'bool') { return PropBool }
        if(type.toLowerCase() === 'select') { return PropSelect }
        if(type.toLowerCase() === 'file') { return PropFile }
    }
}

function isLinked(property: any) {
    var selectedLayer = graph_store.getLayers().find((layer: any) => layer.name() === selection.value.main);
    var links = selectedLayer.allLinks();
    return links.findIndex((link: any) => {
        link._destination && link._destination._name && link._destination._layer.name() === selectedLayer.name() && property.name.startsWith(link._destination._name)
    }) === -1;
}

function onupdate(property: any) {
    const withBias = property.name === 'WithBias';
    var changes = selection_store.layer.apply((layer: any) => {
        var old = layer.getUserInputProperty(property.name);
        return property.value === old ? null : { layer: layer.name(), from: old, to: property.value, };
    }).filter((x: any) => x);
    var _changeTo = (dir: any) => {
        var layers = graph_store.getLayers();
        changes.forEach((change: any) => {
            var layer = layers.find((layer: any) => layer.name() === change.layer);
            if (layer) layer.setUserInputProperty(property.name, change[dir]);
            const networkTabIndex = network_store.Graphs.targetIndex();
            const nodeIndex = editor_store.configuration.networks[networkTabIndex].nodes.findIndex((layer: any) => layer.name === change.layer);
            if (nodeIndex !== -1) {
                if (editor_store.configuration.networks[networkTabIndex].nodes[nodeIndex].properties[property.name]) {
                    editor_store.configuration.networks[networkTabIndex].nodes[nodeIndex].properties[property.name] = change[dir];
                }
            }
        });
        if (withBias) {
            network_store.Graphs.reset(utils_store.serialize_configuration().networks);
            const targetLayer = graph_store.getLayers().find((graphLayer: any) => graphLayer.name() === property.selection.main);
            selection_store.layer.focus(targetLayer);
            const targetLayers: any = [];
            property.selection.all.forEach((layerName: any) => {
                targetLayers.push(graph_store.getLayers().find((graphLayer: any) => graphLayer.name() === layerName));
            });
            selection_store.change(targetLayers);
        }
    };
    if (changes.length) {
        var historyName = 'Edit property : ' + props.layer.type + ' -> ' + property.name;
        let command = {
            type: 'push-and-execute',
            argument: {
                name: () => historyName,
                exec: () => _changeTo('to'),
                undo: () => _changeTo('from'),
            },
        }
        history_store.execute(command)
    }
}

function onUpdateForPropText(property: any) {
    const filteredLayers = graph_store.getLayers().filter((layer: any) => property.selection.includes(layer.name()));
    var changes = filteredLayers.map((layer: any) => {
        var old = layer.getUserInputProperty(property.name);
        return property.value === old ? null : { layer: layer.name(), from: old, to: property.value, };
    }).filter((x: any) => x);
    var _changeTo = (dir: any) => {
        var layers = graph_store.getLayers();
        changes.forEach((change: any) => {
            var layer = layers.find((layer: any) => layer.name() === change.layer);
            if (layer) layer.setUserInputProperty(property.name, change[dir]);
            const networkTabIndex = network_store.Graphs.targetIndex();
            const nodeIndex = editor_store.configuration.networks[networkTabIndex].nodes.findIndex((layer: any) => layer.name === change.layer);
            if (nodeIndex !== -1) {
                if (editor_store.configuration.networks[networkTabIndex].nodes[nodeIndex].properties[property.name]) {
                    editor_store.configuration.networks[networkTabIndex].nodes[nodeIndex].properties[property.name] = change[dir];
                }
            }
        });
    };
    if (changes.length) {
        var historyName = 'Edit property : ' + property.main + ' -> ' + property.name;
        let command = {
            type: 'push-and-execute',
            argument: {
                name: () => historyName,
                exec: () => _changeTo('to'),
                undo: () => _changeTo('from'),
            },
        }
        history_store.execute(command)
    }
}

function onRenaming(value: any) {
    if (!rename.value) {
        var layers = selection_store.layer.members();
        var focused = selection_store.layer.focused();
        var items;
        if (focused) {
            items = [focused].concat(layers.filter((layer: any) => layer !== focused));
        } else {
            items = layers;
        }
        rename.value = {
            component: props.layer.type,
            items: items.map((item: any) => { return { layer: item, name: item.name(), }; }),
        };
    }
    rename.items.forEach((item: any) => item.layer.setUserInputProperty('Name', value));
    // this.rename = rename; // NOTE that rename object should not be reactive!
}

function onRenamed(value: any) {
    // var rename = this.rename;
    // delete this.rename;
    var changes = rename.value.items.map((item: any) => { return { from: item.name, to: item.layer.name(), }; })
    .filter((item: any) => item.from !== item.to);
    var _inverted = (changes: any) => changes.map((change: any) => { return { from: change.to, to: change.from, }; });
    var _exec = (changes: any) => {
        var layers = graph_store.getLayers();
        changes.forEach((item: any) => {
            layers.find((layer: any) => layer.name() === item.from).name(item.to);
            editor_store.onRenamed(changes)
        });
    };
    if(changes.length) {
        var historyName = 'Edit property : ' + rename.value.component + ' -> Name';
        let command = {
            type: 'push',
            argument: {
                name: () => historyName,
                exec: () => _exec(changes),
                undo: () => _exec(_inverted(changes)),
            },
        }
        history_store.execute(command)
    }
    editor_store.onRenamed(changes)
    rename.value = undefined
}

</script>

<template>
    <div>
        <div class="property" v-for="property in ((layer || {}).props || [])">
            <div class="content" v-if="isLinked(property)">
                <div class="name">{{ property.name }}</div>
                <component
                :is="getDynamicaComponent(property.type)"
                :property="property"
                :selection="selection"
                :class="'value' + (property.error ? ' warning' : '')"
                :title="property.error"
                @update="onupdate"
                @updateForPropText="onUpdateForPropText"
                @renaming="onRenaming"
                @renamed="onRenamed"
                />
            </div>
        </div>
    </div>
</template>