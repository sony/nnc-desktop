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
import { reactive, ref } from 'vue';
import {useConfigStore} from '@/stores/config'
import {useNNABLACoreDefStore} from '@/stores/nnabla_core_def'
import {useLanguageStore} from '@/stores/misc/languages'
import UpdaterInputNumber from './UpdaterInputNumber.vue'
import LrScheduler from './LrScheduler.vue'
import LrInputNumber from './LrInputNumber.vue'
import LrInputSelect from './LrInputSelect.vue'
import LrInputStep from './LrInputStep.vue'
const languages_store = useLanguageStore()
const config_store = useConfigStore()
const nnabla_core_def_store = useNNABLACoreDefStore()
const language = reactive(languages_store.language)
const {data, active} = storeToRefs(config_store)
const default_updaters = ref<any>(nnabla_core_def_store.nnablaCore.solvers)
const schedulerList = ref<any>([
    {name: 'Cosine'},
    {name: 'Exponential'},
    {name: 'Polynomial'},
    {name: 'Step'},
])
const intervalUnitList = ref<any>([
    {name: 'epoch', value: 0},
    {name: 'iteration', value: 1},
])

function changeUpdater(event: any) {
    config_store.set_default_updater(data.value[active.value.index].updater, nnabla_core_def_store.nnablaCore.solvers.find(updater => updater.name == event.target.value));
}

function showableMultiplier() {
    return ['Exponential', 'Step'].includes(data.value[active.value.index].scheduler);
}

function showablePower() {
    return ['Polynomial'].includes(data.value[active.value.index].scheduler);
}

function showableInterval() {
    return ['Exponential'].includes(data.value[active.value.index].scheduler);
}

function showableSteps() {
    return ['Step'].includes(data.value[active.value.index].scheduler);
}

</script>
<template>
<div v-if="data.length" class="updater-component">
    <span class="config-label">
        <label class="config-label">{{language.config.optimizer.UPDATER}}:</label>
    </span>
    <span class="config-optimizer-select">
        <label class="select_label optimizer">
            <select class="select_menu" name="updater-type" v-model="data[active.index].updater.name" @change="changeUpdater($event)">
                <option v-for="updater in default_updaters" :value="updater.name">
                    {{ updater.name }}
                </option>
            </select>
        </label>
    </span>
    <table style="margin-left:195px;">
        <UpdaterInputNumber
            class="config-update-interval"
            label="Update Interval"
            unit="iteration"
            v-model="data[active.index].updater.interval"
        />
        <template v-for="(val, key) in data[active.index].updater.parameters">
            <UpdaterInputNumber
                v-if="val.name != 'Interval'"
                class="config-parameter" 
                :key="key" 
                :label="val.name" 
                unit=""
                v-model="val.value"
            />
        </template>
        <UpdaterInputNumber
            class="config-parameter weight-decay" 
            label="Weight Decay" 
            unit=""
            v-model="data[active.index].weight_decay"
        />
        <LrScheduler
            label="Scheduler" 
            :option-list="schedulerList" 
            :value="data[active.index].warmup_length"
            :option-list-unit="intervalUnitList" :selected-unit="data[active.index].warmup_length_unit"
            class="config-parameter"
            @input="(value: any) => data[active.index].scheduler = value"
            @input_warmup_scheduler="(value: any) => data[active.index].warmup_scheduler = value"
            @input_warmup_length="(value: any) => data[active.index].warmup_length = value"
            @change="(value: any) => data[active.index].warmup_length_unit = value"
        />
        <LrInputNumber
            v-if="showableMultiplier()"
            class="config-parameter" 
            label="Multiplier" 
            unit=""
            v-model="data[active.index].learning_rate_multiplier"
        />
        <LrInputNumber
            v-if="showablePower()"
            class="config-parameter" 
            label="Power" 
            unit=""
            v-model="data[active.index].power"
        />
        <LrInputSelect
            v-if="showableInterval()"
            label="Update Interval" :option-list="intervalUnitList" :selected="data[active.index].update_interval_unit"
            :value="data[active.index].update_interval"
            class="config-parameter"
            @input="(value: any) => data[active.index].update_interval = value"
            @change="(value: any) => data[active.index].update_interval_unit = value"
        />
        <LrInputStep
            v-if="showableSteps()"
            label="Update Steps" :option-list="intervalUnitList" :selected="data[active.index].update_interval_unit"
            :value="data[active.index].steps"
            class="config-parameter"
            @input="(value: any) => data[active.index].steps = value"
            @change="(value: any) => data[active.index].update_interval_unit = value"
        />
    </table>
</div>
</template>