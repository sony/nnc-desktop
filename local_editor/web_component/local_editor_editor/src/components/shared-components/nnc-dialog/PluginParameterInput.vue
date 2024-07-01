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
import {useDefinitionsStore} from '@/stores/misc/definitions'
const definitions_store = useDefinitionsStore()
const props = defineProps<{
    title: string,
    description: string,
    value: string,
    onInput: any,
    errorMessage: string,
    readonly: boolean,
    format: string,
}>()
</script>

<template>
    <div>
        <div class="title">{{title + ' - ' + description}}</div>
        <div class="value" v-if="format !== definitions_store.Definitions.PLUGIN.INPUT_TYPE.BOOLEAN">
            <input style="width:100%;" :value="value" @input="(e: Event) => onInput((e.target as HTMLInputElement).value)" :class="definitions_store.Definitions.MODAL.TABBABLE_CLASS" :disabled="readonly">
            <div v-if="errorMessage" class="error-message">{{errorMessage}}</div>
        </div>
        <div class="value" v-else>
            <NncCheckbox
                :modelValue="value"
                :label="title"
                :disabled="readonly"
                @update:modelValue="(value: any) => onInput(value)"
            />
        </div>
    </div>
</template>