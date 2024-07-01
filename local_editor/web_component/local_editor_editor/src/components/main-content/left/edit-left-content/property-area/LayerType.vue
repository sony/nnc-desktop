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
// import $ from "jquery";
import { computed, ref, reactive } from 'vue';
import { useLanguageStore } from '@/stores/misc/languages'
const props = defineProps<{
    layer: any, 
}>()

const language_store = useLanguageStore()
const language = reactive(language_store.language)

const isHovering = ref<boolean>(false)

const style = computed<any>(() => {
    return props.layer ? {} : {visibility: 'hidden'}
})

const color = computed<any>(() => {
    return props.layer ? props.layer.color : 'transparent'
})

const type = computed<any>(() => {
    return props.layer ? props.layer.type : ''
})

function showOverRay(e: any) {
    e.currentTarget.focus()
    isHovering.value = true
}

function hideOverRay() {
    isHovering.value = false
}

function getStyleForOverRay() {
    const leftContentWidth = $('.left-content').width()
    return 'left: ' + leftContentWidth + 'px;'
}

</script>

<template>
    <div class="layer" :style="style">
        <div v-if="type === 'Unit'" class="drop-cap" :style="{'background-color': color}">
            <img src="@/assets/image/Unit.svg">
        </div>
        <div v-else class="drop-cap" :style="{'background-color': color}">
            {{ type.substring(0, 1) }}
        </div>
        <div class="name">{{ type }}</div>
        <a @mouseover="showOverRay" 
           @blur="hideOverRay" 
           class="layer-help-icon" 
           title="Refer documentation" 
           :href="language.LAYER_REFER + type" 
           target="_blank" 
        />
        <div v-show="isHovering" class="layer-overray" :style="getStyleForOverRay()">
            <iframe @mousedown.stop :src="language.LAYER_REFER + type" width="100%" height="100%" />
        </div>
    </div>
</template>