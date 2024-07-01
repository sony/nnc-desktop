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
import { ref, reactive, onMounted, computed, nextTick } from 'vue'
import { useLanguageStore } from '@/stores/misc/languages'
const language_store = useLanguageStore()
const language = reactive(language_store.language)
</script>

<template>
    <div>{{language.YOU_HAVE_CONSUMED_ALL_FREE_CPU}}</div>
</template>