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
import { useEditorStore } from '@/stores/editor'
import { useLanguageStore } from '@/stores/misc/languages';
import { useSVGAreaStore } from '@/stores/editor/svgarea';
import { reactive, computed } from 'vue';
const props = defineProps<{
    name: string
}>()
const emit = defineEmits([
    'update:selected', 
    'hideOverLay'
])
const editor_store = useEditorStore()
const svgarea_store = useSVGAreaStore()
const language_store = useLanguageStore()
const tooltip = reactive(language_store.tooltip)

const tooltip_component = computed(() => {
    return tooltip.network.component
})

function _headLower(name: string): string {
    return name.substring(0, 1).toLowerCase() + name.substring(1)
}

function _setFocus(event: any) {
    event.target.focus()
    emit('update:selected', props.name)
}

function _addLayer(event: any) {
    editor_store.isLoadEnd = true
    if (editor_store.isLoadEnd){
        event.target.focus()
        emit('update:selected', props.name, true)
        svgarea_store.addLayer(props.name);
    }
}

function _hideOverRay() {
    emit('hideOverLay')
}

</script>

<template>
    <div @blur="_hideOverRay" class="nnc-invoker component"
        :tabIndex="editor_store.readOnly ? -1 : 1000"
        :id="_headLower(name)"
        draggable="true"
        @click.prevent="_setFocus"
        @dblclick.prevent="_addLayer"
        @keyup.enter.prevent="_addLayer"
        :title="tooltip_component[_headLower(name) as keyof typeof tooltip_component]"
    >
        {{ name }}
    </div>
</template>