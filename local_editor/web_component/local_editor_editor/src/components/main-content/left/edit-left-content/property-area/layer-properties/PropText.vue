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
import { ref } from 'vue';
import {useSelectionStore} from '@/stores/selection'
import {useEditorStore} from '@/stores/editor'
const props = defineProps<{
    property: any, 
}>()
const emit = defineEmits([
    'updateForPropText', 
])
const selection_store = useSelectionStore()
const editor_store = useEditorStore()

const selection = ref({})
const main = ref<string>('')

function onfocus(event: any) {
    event.target.value = props.property.value; // switch user's raw input value
    event.target.select();
    selection.value = selection_store.layer.members().map((layer: any) => layer.name());
    main.value = editor_store.selection.main;
}

function onblur(event: any) {
    emit('updateForPropText', { name: props.property.name, value: event.target.value.replace(/[^\x20-\x7E]+/g, ''), selection: selection.value, main: main.value });
    event.target.value = props.property.computed; // this value will be overwritten by calculation.
}

function defocus(event: any) {
    event.target.blur()
}

</script>

<template>
    <div>
        <input type="text" :value="property.computed"
        @focus="onfocus"
        @blur="onblur"
        @keyup.enter="defocus"
        @keyup.esc="defocus"
        />
    </div>
</template>