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
import { ref, nextTick, reactive, computed } from 'vue';
import { useLanguageStore } from '@/stores/misc/languages'
import { useDefinitionsStore } from '@/stores/misc/definitions'
import { useConfigStore } from '@/stores/config'
import { storeToRefs } from 'pinia';
import NncCheckbox from '@/components/shared-components/NncCheckbox.vue'
import NncRadio from '@/components/shared-components/NncRadio.vue'
const language_store = useLanguageStore()
const config_store = useConfigStore()
const definitions_store = useDefinitionsStore()
const language = reactive(language_store.language)
const props = defineProps<{
    data: any, 
    buttons: any, 
    defaultButton: any, 
}>()

const API_TYPE = {
    LITE: 0,
    RESIDENT: 1,
};

const PROCESSER_TYPE = {
    CPU: 0,
    GPU: 1,
};

const OPERATION_TYPE = {
    ALWAYS: 0,
    SCHEDULE: 1,
};

const supportPage = 'https://support.dl.sony.com/docs-ja/%E3%83%A2%E3%83%87%E3%83%ABapi%E5%85%AC%E9%96%8B%E6%A9%9F%E8%83%BD/';
const supportPageEng = 'https://support.dl.sony.com/docs/%E3%83%A2%E3%83%87%E3%83%ABapi%E5%85%AC%E9%96%8B%E6%A9%9F%E8%83%BD/';
const {currentLang} = storeToRefs(language_store)
const LANG = ref<string>(currentLang.value.toLocaleLowerCase())
const type = ref<number>(API_TYPE.LITE)
const processerType = ref<number>(PROCESSER_TYPE.CPU)
const operationType = ref<number>(OPERATION_TYPE.ALWAYS)
const weekList = ref<any>([
    {id: 'Mon', text: 'Mon', value: false},
    {id: 'Tue', text: 'Tue', value: false},
    {id: 'Wed', text: 'Wed', value: false},
    {id: 'Thu', text: 'Thu', value: false},
    {id: 'Fri', text: 'Fri', value: false},
    {id: 'Sat', text: 'Sat', value: false},
    {id: 'Sun', text: 'Sun', value: false},
])

const startTime = ref<any>({
    HH: definitions_store.Definitions.EVALUATION.PUBLISH_API.DEFAULT_START_TIME,
    mm: '00',
})

const endTime = ref<any>({
    HH: definitions_store.Definitions.EVALUATION.PUBLISH_API.DEFAULT_END_TIME,
    mm: '00',
})

const parameters = computed(() => {
    if (isLite()) {
        return {
            type: 'serverless'
        }
    } else {
        const checkedWeeksList: any = [];
        weekList.value.forEach((week: any) => {
            if (week.value) {
            checkedWeeksList.push(week.text);
            }
        });
        const checkedWeeks = checkedWeeksList.join(',');
        const serverSpec: any = {
            type: processerType.value === 0 ? 'cpu' : 'gpu',
            number_of_instances: 1,
        };
        if (isSchedule()) {
            serverSpec.schedule = true;
            serverSpec.schedule_rule = {
                start_on: startTime.value.HH + ':' + startTime.value.mm,
                end_on: endTime.value.HH + ':' + endTime.value.mm,
                day_of_week: checkedWeeks
            };
        } else {
            serverSpec.schedule = false;
        }
        return serverSpec;
    }
})

const message = computed(() => {
    if (isTimeError()) {
        return text.value.TIME_ERROR;
    }

    if (isWeekError()) {
        return text.value.WEEK_ERROR;
    }

    return '';
})

const disabled = computed(() => {
    return isWeekError() || isTimeError();
})

const text = computed(() => {
    return language.PUBLISH_API;
})

function isSchedule() {
    return type.value === API_TYPE.RESIDENT && operationType.value === OPERATION_TYPE.SCHEDULE;
}

function isValidTime() {
    // start time < end time
    return Number(startTime.value.HH + startTime.value.mm) < Number(endTime.value.HH + endTime.value.mm);
}

function isValidDayOfWeek() {
    // checkboxに一つ以上チェックが含まれている
    return weekList.value.some((day: any) => day.value);
}

function isWeekError() {
    return isSchedule() && !isValidDayOfWeek();
}

function isTimeError() {
    return isSchedule() && !isValidTime();
}

function onChangeType(_type: number) {
    type.value = _type
}

function onChangeProcesserType(_processerType: number) {
    processerType.value = _processerType;
}

function onChangeOperationType(_operationType: number) {
    operationType.value = _operationType;
}

function onInput(id: any, value: any) {
    const day = weekList.value.find((day: any) => day.id === id);
    if (day) {
        day.value = value;
    }
}

function onBlur() {
    startTime.value.HH = startTime.value.HH || '00';
    startTime.value.mm = startTime.value.mm || '00';
    endTime.value.HH = endTime.value.HH || '00';
    endTime.value.mm = endTime.value.mm || '00';
}

function isLite() {
    return type.value === API_TYPE.LITE;
}

</script>

<template>
    <div class="nnc-modal-container">
        <div class="nnc-modal-header">{{ data.title }}</div>
        <div class="nnc-modal-body">
            <dl>
                <dt>
                    <!-- <NncRadio @input="onChangeType" :value="type" :choice="API_TYPE.LITE" :label="text.API_TYPE_LITE" /> -->
                    <NncRadio v-model="type" :choice="API_TYPE.LITE" :label="text.API_TYPE_LITE" :disabled="false"/>
                </dt>
                <dd>{{text.API_TYPE_LITE_DESCRIPTION}}</dd>
                <dt>
                    <NncRadio v-if="!data.isRegistered" v-model="type" :choice="API_TYPE.RESIDENT" :label="text.API_TYPE_RESIDENT" disabled/>
                    <NncRadio v-if="data.isRegistered" v-model="type" :choice="API_TYPE.RESIDENT" :label="text.API_TYPE_RESIDENT" :disabled="false"/>
                </dt>
                <dd>{{text.API_TYPE_RESIDENT_DESCRIPTION}}</dd>
            </dl>

            <div v-if="LANG === 'en'">
                Click <a :href="supportPageEng" target="_blank">{{text.PRICE_LINK}} </a>{{text.PRICE}}
            </div>

            <div v-if="LANG === 'ja'">
                {{text.PRICE}}<a :href="supportPage" target="_blank">{{text.PRICE_LINK}}</a>。
            </div>

            <div v-if="type === API_TYPE.RESIDENT" class="publish-api-settings">
                <dl>
                    <dt>{{text.PROCESSOR_TYPE}}</dt>
                    <dd>
                        <NncRadio v-model="processerType" :choice="PROCESSER_TYPE.CPU" label="CPU" :disabled="false"/>
                        <NncRadio v-model="processerType" :choice="PROCESSER_TYPE.GPU" label="GPU" :disabled="false"/>
                    </dd>

                    <dt>{{text.OPERATION_TYPE}}</dt>
                    <dd>
                        <NncRadio v-model="operationType" :choice="OPERATION_TYPE.ALWAYS" label="Always" :disabled="false"/>
                        <NncRadio v-model="operationType" :choice="OPERATION_TYPE.SCHEDULE" label="Schedule" :disabled="false"/>
                    </dd>

                    <template v-if="operationType === OPERATION_TYPE.SCHEDULE">
                        <dt>{{text.START_TIME}}</dt>
                        <dd>
                            <vue-timepicker
                                v-model="startTime"
                                :minute-interval="definitions_store.Definitions.EVALUATION.PUBLISH_API.MINUTE_INTERVAL"
                                close-on-complete="true"
                                hide-clear-button="true"
                                :input-class="definitions_store.Definitions.MODAL.TABBABLE_CLASS"
                                @blur="onBlur"
                            />
                        </dd>
                        <dt>{{text.END_TIME}}</dt>
                        <dd>
                            <vue-timepicker
                                v-model="endTime"
                                :minute-interval="definitions_store.Definitions.EVALUATION.PUBLISH_API.MINUTE_INTERVAL"
                                close-on-complete="true"
                                hide-clear-button="true"
                                :input-class="definitions_store.Definitions.MODAL.TABBABLE_CLASS"
                                @blur="onBlur"
                            />
                        </dd>
                        <dt>{{text.WEEK}}</dt>
                        <dd class="day-of-week-checkbox">
                            <NncCheckbox
                                v-for="day in weekList"
                                :modelValue="day.value"
                                :label="day.text"
                                @update:model-value="(value) => onInput(day.id, value)"
                                :disabled="false"
                            />
                        </dd>
                    </template>
                </dl>
            </div>
            <div class="publish-api-message-error">{{message}}</div>
            <div v-if="type === API_TYPE.RESIDENT" class="publish-api-message">
                {{text.RESIDENT_MESSAGE1}}<br>
                {{text.RESIDENT_MESSAGE2}}
            </div>
            <div v-if="!data.isRegistered && LANG === 'ja'" class="publish-api-message">
                {{text.REGISTER_ERROR1}}
                <span>(
                    <a href="/console/#/serviceSettings">
                        {{text.REGISTER_ERROR2}}
                    </a>)
                </span>
                {{text.REGISTER_ERROR3}}
                <span>(
                    <a href="https://dl.sony.com/ja/business/">
                    {{text.REGISTER_ERROR4}}
                    </a>)
                </span>
                {{text.REGISTER_ERROR5}}
            </div>
            <div v-if="!data.isRegistered && LANG === 'en'" class="publish-api-message">
                <span>(
                    <a href="/console/#/serviceSettings">
                        {{text.REGISTER_ERROR2}}
                    </a>)
                </span>
                {{text.REGISTER_ERROR3}}
                <span>(
                    <a href="https://dl.sony.com/ja/business/">
                    {{text.REGISTER_ERROR4}}
                    </a>)
                </span>
                {{text.REGISTER_ERROR1}}
                {{text.REGISTER_ERROR5}}
            </div>
        </div>
        <template v-if="type === API_TYPE.LITE">
            <div>{{ text.NOTICE }}</div>
            <div>{{ text.DICOM }}</div>
            <div>{{ text.AUDIO }}</div>
            <div>{{ text.OVER30 }}</div>
            <div>{{ text.OVER64 }}</div>
        </template>
        <div class="nnc-modal-footer">
            <button :class="'nnc-modal-button' + ' ' + definitions_store.Definitions.MODAL.TABBABLE_CLASS" v-for="btn in buttons" @click="btn.action()">{{ btn.name }}</button>
            <button v-if="disabled" :disabled="true" class="nnc-modal-button disabled default">{{ defaultButton.name }}</button>
            <button v-else :class="'nnc-modal-button default' + ' ' + definitions_store.Definitions.MODAL.TABBABLE_CLASS" @click="defaultButton.action(parameters)">{{ defaultButton.name }}</button>
        </div>
    </div>
</template>