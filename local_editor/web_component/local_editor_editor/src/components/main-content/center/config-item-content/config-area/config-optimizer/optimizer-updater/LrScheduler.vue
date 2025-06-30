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
import NncCheckbox from '@/components/shared-components/NncCheckbox.vue'

const props = defineProps<{
    label: string, 
    optionList: any, 
    warmup_length: number,
    optionListUnit: any, 
    selectedUnit: string,
    warmup_scheduler: boolean,
    scheduler: string
}>()

const emit = defineEmits<{
    (event: 'update:warmup_length', value: number): void;
    (event: 'update:selectedUnit', value: string): void;
    (event: 'update:scheduler', value: string): void;
    (event: 'update:warmup_scheduler', value: boolean): void;
}>()

const handleCheck = (event: Event) => {
    emit('update:warmup_scheduler', event)
};

const handleInput = (event: Event) => {
    const value = (event.target as HTMLInputElement).valueAsNumber;
    emit('update:warmup_length', isNaN(value) ? 1 : value);
}
</script>
<template>
<tr>
    <td style="padding-right: 5px;">
        <label class="config-label">Learning Rate</label>
    </td>
    <td style="padding-right: 5px;">
        <label class="config-label">{{ label }}</label>
    </td>
    <td class="config-optimizer-select" style="padding-right: 5px;">
        <label class="select_label optimizer">
            <select class="select_menu" name="updater-type"
                :value="scheduler"
                @change="$emit('update:scheduler', $event.target.value)">
                <option v-for="option in optionList" :key="option.name" :value="option.name">
                    {{ option.name }}
                </option>
            </select>
        </label>
    </td>
    <td style="padding-right: 5px;"></td>
    <NncCheckbox 
        label="Warmup" 
        :modelValue="warmup_scheduler"
        @update:modelValue="handleCheck"
        :disabled="false"
    />
    <td style="padding-right: 5px;">
        <input :disabled="!warmup_scheduler"
        type="number"
        class="config-short-input no-spin-buttons"
        :value="warmup_length"
        @input="handleInput"
        step="any" />
    </td>
    <td class="config-optimizer-select" style="padding-right: 5px;">
        <label class="select_label optimizer">
            <select :disabled="!warmup_scheduler" class="select_menu" name="updater-type"
                @change="$emit('update:selectedUnit', $event.target.value)"
                :value="selectedUnit">
                <option v-for="option in optionListUnit" :value="option.value">
                    {{ option.name }}
                </option>
            </select>
        </label>
    </td>
</tr>
</template>