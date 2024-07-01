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
}>()
const emit = defineEmits([
    'input', 
])

function stripMultiByteChar(value: any) {
    var newValue = value.replace(/[^\x20-\x7E]+/g, '');
    // this.value = newValue;
    emit('input', newValue);
}
</script>
<template>
<div>
    <span class="config-label">
        <label class="config-label">{{ label }}:</label>
    </span>
    <span>
        <input 
            type="text" 
            class="config-input" 
            :value="modelValue" 
            @input="(event: any) => $emit('input', event.target.value)" 
            @blur="(event: any) => stripMultiByteChar(event.target.value)" >
    </span>
</div>
</template>