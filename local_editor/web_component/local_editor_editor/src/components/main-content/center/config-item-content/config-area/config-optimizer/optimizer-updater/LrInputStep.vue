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
    value: string, 
    selected: string
    optionList: any
}>()
const emit = defineEmits([
    'input', 
    'change'
])

function restrictInput(v: any) {
    var newValue = v.replace(/[^0-9,]+/g, '');
    return newValue;
}

function removeComma(v: any) {
    var newValue = v.replace(/,+/g, ',');
    newValue = newValue.replace(/,$/g,'');
    // this.value = newValue;
    emit('input', newValue);
}

</script>
<template>
<tr>
    <td style="padding-right: 5px;"></td>
    <td style="padding-right: 5px;">
        <label class="config-label">{{ label }}</label>
    </td>
    <td style="padding-right: 5px;">
        <input 
            type="text" 
            class="config-short-input no-spin-buttons" 
            :value="restrictInput(value)" 
            @input="(event: any) => $emit('input', event.target.value)" 
            @blur="(event: any) => removeComma(restrictInput(event.target.value))" 
        >
    </td>
    <td class="config-optimizer-select" style="padding-right: 5px;">
        <label class="select_label optimizer">
            <select class="select_menu" name="updater-type" @change="(event: any) => $emit('change', event.target.value)" :value="selected">
                <option v-for="option in optionList" :value="option.value">
                    {{ option.name }}
                </option>
            </select>
        </label>
    </td>
</tr>
</template>