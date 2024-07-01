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
import { nextTick, reactive, ref, computed, onMounted } from 'vue';
import {useLanguageStore} from '@/stores/misc/languages'
import NncCheckbox from '@/components/shared-components/NncCheckbox.vue'
const languages_store = useLanguageStore()
const language = reactive(languages_store.language)
const props = defineProps<{
    value: any, 
}>()
const emit = defineEmits([
    'updateValue', 
    'updateNumParallel',
    'updateTimeLimit',
    'updateValueName'
])

const validation_min = computed({
    get: function() {
        return getMinMaxValue('validation_min');
    },
    set: function(newValue) {
        setMinMaxValue('validation_min', newValue);
    },
})

const validation_max = computed({
    get: function() {
        return getMinMaxValue('validation_max');
    },
    set: function(newValue) {
        setMinMaxValue('validation_max', newValue);
    },
})

const multiply_add_min = computed({
    get: function() {
        return getMinMaxValue('multiply_add_min');
    },
    set: function(newValue) {
        setMinMaxValue('multiply_add_min', newValue);
    },
})

const multiply_add_max = computed({
    get: function() {
        return getMinMaxValue('multiply_add_max');
    },
    set: function(newValue) {
        setMinMaxValue('multiply_add_max', newValue);
    },
})

function onBlurNumParallel(e: any) {
    var value = e.target.value;
    if (!value || value === '0') {
        // this.value.num_parallel = 1;
        emit('updateNumParallel', 1);
    }
    // this.value.num_parallel = parseInt(value, 10);
    emit('updateNumParallel', parseInt(value, 10));
}

function onUpdateMethod(e: any) {
    let value = e.target.value
    var _value: any = {method: value};
    if (value === 'Random') {
        _value.optimize_for = 'ErrorAndCalculation';
    }
    emit('updateValue', Object.assign(props.value, _value));
}

function onUpdateOptimizeFor(e: any) {
    let value = e.target.value
    emit('updateValue', Object.assign(props.value, {optimize_for: value}));
}

function onInputTimeLimit(event: any) {
    if (event.target.validity.valid) {
        // this.value.time_limit = event.target.value;
        emit('updateTimeLimit', event.target.value);
    }
}

function getMinMaxValue(name: any) {
    var num = props.value[name];
    return (!num || Number(num) < 0) ? "" : num;
}

function setMinMaxValue(name: any, newValue: any) {
    // this.value[name] = (!newValue || Number(newValue) < 0) ? -1 : newValue;
    emit('updateValueName', name, (!newValue || Number(newValue) < 0) ? -1 : newValue);
}
</script>
<template>
    <div>
        <table class="structure-search-table">
            <tr>
                <td class="structure-search-label">
                    <label class="config-label">{{language.config.global.STRUCTURE_SEARCH}}:</label>
                </td>
                <td>
                    <NncCheckbox 
                        :disabled="false"
                        :label="language.config.global.ENABLE" 
                        v-model="value.enable" 
                    />
                </td>
            </tr>
            <tr>
                <td/>
                <td class="method-label">
                    <label :class="value.enable ? 'config-label' : 'config-label disabled'">{{language.config.global.METHOD}}:</label>
                </td>
                <td class="config-global-select">
                    <label class="select_label">
                        <select class="select_menu"
                        :disabled="!value.enable"
                        :value="value.method"
                        @change="onUpdateMethod">
                            <option>Random</option>
                            <option value="NetworkFeatureAndGaussianProcess">Network Feature + Gaussian Process</option>
                        </select>
                    </label>
                </td>
            </tr>
            <tr>
                <td/>
                <td>
                    <label :class="value.enable ? 'config-label' : 'config-label disabled'">{{language.config.global.OPTIMIZE}}:</label>
                </td>
                <td class="config-global-select">
                    <label class="select_label">
                        <select class="select_menu"
                        :disabled="value.method === 'Random' || !value.enable"
                        :value="value.optimize_for"
                        @change="onUpdateOptimizeFor">
                            <option v-if="value.method !== 'Random'">Error</option>
                            <option value="ErrorAndCalculation">Error and Calculation</option>
                        </select>
                    </label>
                </td>
            </tr>
        </table>
        <table class="search-range-table">
            <tr>
                <td class="search-range"></td>
                <td class="search-range-label">
                    <label :class="value.enable ? 'config-label' : 'config-label disabled'">{{language.config.global.SEARCH_RANGE}}:</label>
                </td>
                <td/>
                <td :class="value.enable ? 'search-range-unit' : 'search-range-unit disabled'"><div>Min</div></td>
                <td :class="value.enable ? 'search-range-unit' : 'search-range-unit disabled'"><div>Max</div></td>
            </tr>
            <tr>
                <td/>
                <td/>
                <td class="validation-label">
                    <label :class="value.enable ? 'config-label' : 'config-label disabled'">Validation</label>
                </td>
                <td>
                    <input :disabled="!value.enable" type="number" class="config-short-input no-spin-buttons" v-model="validation_min" step="any" />
                </td>
                <td>
                    <input :disabled="!value.enable" type="number" class="config-short-input no-spin-buttons" v-model="validation_max" step="any" />
                </td>
            </tr>
            <tr>
                <td/>
                <td/>
                <td class="multiply-add-label">
                    <label :class="value.enable ? 'config-label' : 'config-label disabled'">Multiply Add</label>
                </td>
                <td>
                    <input :disabled="!value.enable" type="number" class="config-short-input no-spin-buttons" v-model="multiply_add_min" step="any" />
                </td>
                <td>
                    <input :disabled="!value.enable" type="number" class="config-short-input no-spin-buttons" v-model="multiply_add_max" step="any" />
                </td>
            </tr>
        </table>
        <table class="search-attempts-table">
            <tr>
                <td class="search-attempts"></td>
                <td class="search-attempts-label">
                    <label :class="value.enable ? 'config-label' : 'config-label disabled'">{{language.config.global.MAX_ATTEMPTS}}:</label>
                </td>
                <td>
                    <input :disabled="!value.enable" type="number" class="config-short-input no-spin-buttons" v-model="value.attempt_hours" step="any" />
                </td>
                <td :class="value.enable ? 'search-attempts-unit' : 'search-attempts-unit disabled'">
                    <span>{{language.config.global.HOURS}}</span>
                </td>
            </tr>
            <tr>
                <td/>
                <td/>
                <td>
                    <input :disabled="!value.enable" type="number" class="config-short-input no-spin-buttons" v-model="value.attempt_times" step="any" />
                </td>
                <td :class="value.enable ? 'search-attempts-unit' : 'search-attempts-unit disabled'">
                    <span>{{language.config.global.TIMES}}</span>
                </td>
            </tr>
        </table>
        <table class="search-num-parallel-table">
            <tr>
                <td class="search-num-parallel"></td>
                <td class="search-num-parallel-label">
                    <label :class="value.enable ? 'config-label' : 'config-label disabled'">{{language.config.global.NUMBER_OF_PARALLEL_JOBS}}:</label>
                </td>
                <td>
                    <input :disabled="!value.enable" type="number" class="config-short-input no-spin-buttons" v-model="value.num_parallel" step="any" @blur="onBlurNumParallel" />
                </td>
            </tr>
        </table>
    </div>
</template>