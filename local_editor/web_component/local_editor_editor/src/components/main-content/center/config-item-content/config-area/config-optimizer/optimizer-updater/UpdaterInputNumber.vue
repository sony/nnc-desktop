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
    modelValue: string, 
    label: string,
    unit: string
}>()
</script>
<template>
<tr>
    <td style="padding-right: 5px;">
        <label class="config-label">{{ label }}</label>
    </td>
    <td style="padding-right: 5px;">
        <input 
            type="number" 
            class="config-short-input no-spin-buttons" 
            :value="modelValue" 
            @input="(event: any) => $emit('input', event.target.value)" 
            step="any" 
        >
    </td>
    <td v-if="unit">
        <span class="config-unit">{{unit}}</span>
    </td>
</tr>
</template>