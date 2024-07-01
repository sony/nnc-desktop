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
import { useDefinitionsStore } from '@/stores/misc/definitions'
import { useUtilsStore } from '@/stores/utils'
import { computed } from 'vue';
const definitions_store = useDefinitionsStore()
const utils_store = useUtilsStore()
const props = defineProps<{
    layer: any, 
    links: any, 
    completedLayer: any, 
    graphLayer: any, 
}>()

const clipPath = computed(() => {
    const CLIP_PATH = definitions_store.Definitions.EDIT.LAYER.CLIP_PATH;
    return {
        id: `url(#${CLIP_PATH.ID})`,
        transform: `translate(${CLIP_PATH.OFFSET_X}, ${CLIP_PATH.OFFSET_Y})`
    }
}) 

const nameLabel = computed(() => {
    const NAME_LABEL = definitions_store.Definitions.EDIT.LAYER.NAME_LABEL;
    return {
        x: NAME_LABEL.OFFSET_X,
        y: NAME_LABEL.OFFSET_Y,
        style: `pointer-events: none; fill: ${NAME_LABEL.FONTCOLOR}; font-size: ${NAME_LABEL.FONTSIZE}`
    }
}) 

const importantProperty = computed(() => {
    const PROPERTY_LABEL = definitions_store.Definitions.EDIT.LAYER.PROPERTY_LABEL;
    return {
        x: PROPERTY_LABEL.OFFSET_X,
        y: PROPERTY_LABEL.OFFSET_Y,
        style: `pointer-events: none; fill: ${PROPERTY_LABEL.FONTCOLOR}; font-size: ${PROPERTY_LABEL.FONTSIZE}`,
        value: getImportantValue()
    }
}) 

function getImportantValue() {
    if (props.graphLayer) {
        return props.graphLayer._importantProperty;
    } else {
        var component: any = utils_store.getComponent(props.layer.type);
        var links = props.links.filter((link: any) => link.to_node === props.layer.name);
        return component.property.filter((property: any) => property.important).map((property: any) => {
            const name = property.name;
            if (props.completedLayer) {
                return (property.shortName || name) + ' : ' + props.completedLayer.properties[name];
            } else {
                return (property.shortName || name) + ' : ' + props.layer.properties[name];
            }
        }).filter((property: any) => links.findIndex((link: any) => link.to_node === props.layer.name && link.to_name && property.startsWith(link.to_name)) === -1).join(', ');
    }
}

</script>

<template>
    <g :clip-path="clipPath.id" :transform="clipPath.transform">
        <text :x="nameLabel.x" :y="nameLabel.y" :style="nameLabel.style">{{layer.name}}</text>
        <text :x="importantProperty.x" :y="importantProperty.y" :style="importantProperty.style">{{importantProperty.value}}</text>
    </g>
</template>