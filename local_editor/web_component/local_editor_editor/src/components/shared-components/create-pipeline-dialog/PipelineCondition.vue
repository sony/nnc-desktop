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
import { useLanguageStore } from '@/stores/misc/languages'
import { useDefinitionsStore } from '@/stores/misc/definitions'
import NncCheckbox from '@/components/shared-components/NncCheckbox.vue'
import { computed, ref, reactive } from 'vue'
const definitions_store = useDefinitionsStore()
const language_store = useLanguageStore()
const language = reactive(language_store.language)
const props = defineProps<{
    title: string,
    value: string,
    onInput: Function,
    errorMessage: string,
    trigger: boolean,
    withTrigger: boolean,
    onChangeTrigger: Function,
}>()

const text = computed(() => {
    return language.CREATE_PIPELINE;
})

</script>

<template>
    <div>
        <div class="row">
            <div class="title">{{title}}</div>
            <div class="value">
                <input :value="value" @input="onInput(($event.target as HTMLInputElement).value)" :class="definitions_store.Definitions.MODAL.TABBABLE_CLASS">
                <div v-if="errorMessage" class="error-message">{{errorMessage}}</div>
            </div>
        </div>
        <div>
            <NncCheckbox :label="text.TRIGGER" :modelValue="trigger" @update:model-value="value => onChangeTrigger(value)" :disabled="false"/>
        </div>
    </div>
</template>