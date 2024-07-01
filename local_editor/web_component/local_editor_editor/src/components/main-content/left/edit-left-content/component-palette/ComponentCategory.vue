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
import { ref, reactive, onMounted, computed } from 'vue'
import ComponentLayer from './ComponentLayer.vue'
import { useEditorStore } from '@/stores/editor'
import { useLanguageStore } from '@/stores/misc/languages'
const props = defineProps<{
    category: { components: string[]; name: string; },
    text: string
}>()
const editor_store = useEditorStore()
const language_store = useLanguageStore()
const tooltip = reactive(language_store.tooltip)

const expand = ref(true)

const filteredCategory = computed(() => {
    return props.category.components.filter(component => component.toLowerCase().indexOf((props.text || '').toLowerCase()) > -1);
})

const tooltip_component = computed(() => {
    return tooltip.network.component
})

function isIncludeCategoryName() {
    return (props.category.name || '').toLowerCase().indexOf((props.text || '').toLowerCase()) > -1
}

function trimCategoryName(name: string) {
    return name.replace(/\s+/g, '')
}
</script>

<template>
    <div class="category" v-if="isIncludeCategoryName()">
        <div class="nnc-invoker title" @click="expand = !expand;" :id="trimCategoryName(category.name)" :title="tooltip_component[category.name as keyof typeof tooltip_component]">
            <img v-if="expand" class="icon-small" src="@/assets/image/ArrowDown.svg">
            <img v-else class="icon-small" src="@/assets/image/Arrow.svg">
            {{ category.name }}
        </div>
        <div class="components" :style="{display: expand ? 'block' : 'none'}">
            <ComponentLayer
                v-for="name in category.components"
                :name="name"
                :key="name"
                :class="editor_store.selectedComponent === name ? 'active' : ''"
                @update:selected="(_name, shouldNotShowOverLay) => $emit('update:selected', name, shouldNotShowOverLay)"
                @hideOverLay="$emit('hideOverLay')"
            />
        </div>
    </div>

    <div class="category" v-else>
        <div class="nnc-invoker title" @click="expand = !expand;" :id="trimCategoryName(category.name)" :title="tooltip_component[category.name as keyof typeof tooltip_component]">
            <img v-if="expand" class="icon-small" src="@/assets/image/ArrowDown.svg">
            <img v-else class="icon-small" src="@/assets/image/Arrow.svg">
            {{ category.name }}
        </div>
        <div class="components" :style="{display: expand ? 'block' : 'none'}">
            <ComponentLayer
                v-for="name in filteredCategory"
                :name="name"
                :key="name"
                :class="editor_store.selectedComponent === name ? 'active' : ''"
                @update:selected="(_name, shouldNotShowOverLay) => $emit('update:selected', name, shouldNotShowOverLay)"
                @hideOverLay="$emit('hideOverLay')"
            />
        </div>
    </div>
</template>