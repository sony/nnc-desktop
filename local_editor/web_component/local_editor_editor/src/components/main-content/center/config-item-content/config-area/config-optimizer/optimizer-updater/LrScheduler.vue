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
import { storeToRefs } from 'pinia'
import NncCheckbox from '@/components/shared-components/NncCheckbox.vue'
import {useConfigStore} from '@/stores/config'
const config_store = useConfigStore()
const props = defineProps<{
    label: string, 
    optionList: any, 
    value: string, 
    optionListUnit: any, 
    selectedUnit: string
}>()
const {data, active} = storeToRefs(config_store)

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
            <select class="select_menu" name="updater-type" @change="(event: any) => $emit('input', event.target.value)" v-model="data[active.index].scheduler">
                <option v-for="option in optionList" :value="option.name">
                    {{ option.name }}
                </option>
            </select>
        </label>
    </td>
    <td style="padding-right: 5px;"></td>
    <NncCheckbox 
        label="Warmup" 
        v-model="data[active.index].warmup_scheduler" 
        :disabled="false"
    />
    <td style="padding-right: 5px;">
        <input :disabled="!data[active.index].warmup_scheduler" type="number" class="config-short-input no-spin-buttons" :value="value" @input="(event: any) => $emit('input_warmup_length', event.target.value)" step="any" >
    </td>
    <td class="config-optimizer-select" style="padding-right: 5px;">
        <label class="select_label optimizer">
            <select :disabled="!data[active.index].warmup_scheduler" class="select_menu" name="updater-type" @change="(event: any) => $emit('change', event.target.value)" :value="selectedUnit">
                <option v-for="option in optionListUnit" :value="option.value">
                    {{ option.name }}
                </option>
            </select>
        </label>
    </td>
</tr>
</template>