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
import {useDefinitionsStore} from '@/stores/misc/definitions'
const definitions_store = useDefinitionsStore()
const props = defineProps<{
    title: string, 
    value: string, 
    onInput: any, 
    errorMessage: string
}>()
</script>

<template>
    <div class="row">
        <div class="title">{{title}}</div>
        <div class="value">
            <input :value="value" @input="onInput" :class="definitions_store.Definitions.MODAL.TABBABLE_CLASS">
            <div v-if="errorMessage" class="error-message">{{errorMessage}}</div>
        </div>
    </div>
</template>