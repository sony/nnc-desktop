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
import { ref, reactive } from 'vue';
import {useLanguageStore} from '@/stores/misc/languages'
import {useConfigStore} from '@/stores/config'
import { storeToRefs } from 'pinia';
const config_store = useConfigStore()
const languages_store = useLanguageStore()
const language = reactive(languages_store.language)
const {data, active} = storeToRefs(config_store)
const effectiveRangeUnitList = ref<any>([
    {name: 'epoch', value: 0},
    {name: 'iteration', value: 1},
])

function changeUnit(value: any) {
    data.value[active.value.index].effective_range_unit_value = value;
}

function inputFrom(value: any) {
    data.value[active.value.index].effective_range_from = value;
}

function inputTo(value: any) {
    data.value[active.value.index].effective_range_to = value;
}

function validate(v: any) {
    let newValue;
    if (!v.length || v === '0') {
        newValue = '';
    } else {
        var pattern = /^\d*$/;
        newValue = pattern.test(v) ? Number(v) : '';
    }
    return newValue;
}

</script>
<template>
<div>
    <span class="config-label">
        <label class="config-label">{{language.config.optimizer.EFFECTIVE_RANGE}}:</label>
    </span>
    <span>
        <label class="config-label">from</label>
        <input type="number" step="any" class="config-input-effective-range" :value="data[active.index].effective_range_from" @input="(event: any) => inputFrom(event.target.value)" @blur="(event: any) => inputFrom(validate(event.target.value))">
        <label class="config-label">to</label>
        <input type="number" step="any" class="config-input-effective-range" :value="data[active.index].effective_range_to" @input="(event: any) => inputTo(event.target.value)" @blur="(event: any) => inputTo(validate(event.target.value))">
        <span class="config-optimizer-select">
            <label class="select_label">
                <select class="select_menu" id="effective_range_unit" @change="(event: any) => changeUnit(event.target.value)" v-model="data[active.index].effective_range_unit_value">
                    <option v-for="unit in effectiveRangeUnitList" :value="unit.value">
                        {{ unit.name }}
                    </option>
                </select>
            </label>
        </span>
    </span>
</div>
</template>