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
const props = defineProps<{
    label: string, 
    modelValue: string, 
    unit: string
}>()
const emit = defineEmits([
    'update:modelValue', 
])

function updateValue(e: Event) {
    emit('update:modelValue', (e.target as HTMLInputElement).value)
}

</script>
<template>
<span>
    <span class="config-label">
        <label class="config-label">{{ label }}:</label>
    </span>
    <span>
        <input type="number" class="config-short-input no-spin-buttons" :value="modelValue" @input="updateValue" step="any" >
        <span class="config-unit">{{ unit ? unit : "" }}</span>
    </span>
</span>
</template>