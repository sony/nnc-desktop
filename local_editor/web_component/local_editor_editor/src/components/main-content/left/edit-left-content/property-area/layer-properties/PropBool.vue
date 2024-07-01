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
import {useEditorStore} from '@/stores/editor'
const editor_store = useEditorStore()
const props = defineProps<{
    property: any, 
}>()

const check = ref<any>(null)

const checked = computed(() => {
    return String(props.property.value || false).toLowerCase() === 'true'
}) 

const emit = defineEmits([
    'update', 
])
function onclick() {
    check.value.click();
}

function onchange(event: any) {
    emit('update', { name: props.property.name, value: Boolean(event.target.checked), selection: editor_store.selection });
}
</script>

<template>
    <div @click.self="onclick">
        <label><input type="checkbox" ref="check" :checked="checked" @change="onchange" /><span /></label>
    </div>
</template>