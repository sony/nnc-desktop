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
import { ref, nextTick, reactive, computed } from 'vue';
import { useDefinitionsStore } from '@/stores/misc/definitions'
import { useLanguageStore } from '@/stores/misc/languages'
import { useConfigStore } from '@/stores/config'
import { storeToRefs } from 'pinia';
import Network from '@/components/shared-components/network/Network.vue'
const definitions_store = useDefinitionsStore()
const language_store = useLanguageStore()
const config_store = useConfigStore()
const language = reactive(language_store.language)
const props = defineProps<{
    configuration: any, 
    completedConfiguration: any
}>()

function getNetworkSize(index: any) {
    const LAYER = definitions_store.Definitions.EDIT.LAYER;
    const LINK_CURVE_HEIGHT = 20;
    const paddingRight = 80;
    const paddingTop = 20;
    const nodes = props.configuration.networks[index].nodes;
    const xArray = nodes.map((node: any) => node.x);
    const yArray = nodes.map((node: any) => node.y);
    const maxX = Math.max.apply(null, xArray);
    const maxY = Math.max.apply(null, yArray) + LINK_CURVE_HEIGHT;
    const x = Math.max(maxX, 0) + LAYER.RECT_WIDTH + LAYER.STATISTICS.BAR.MAXWIDTH + paddingRight;
    const y = Math.max(maxY, 0) + LAYER.RECT_HEIGHT + paddingTop;
    return {x, y};
}

</script>

<template>
<div>
    <svg class="network_for_html" v-for="i in configuration.networks.length" :id="'network_' + (i - 1)" :width="getNetworkSize(i -1).x" :height="getNetworkSize(i - 1).y">
        <Network
            :configuration="configuration"
            :completedConfiguration="completedConfiguration"
            :targetIndex="i - 1"
            :selection="{}"
            activeStatisticName="Output"
            :isEditTab="false"
            :isOverview="false"
        />
    </svg>
    <canvas class="canvas_network_for_html" v-for="i in configuration.networks.length" :id="'canvas_network_' + (i -1) " :width="getNetworkSize(i -1).x" :height="getNetworkSize(i - 1).y" />
</div>
</template>