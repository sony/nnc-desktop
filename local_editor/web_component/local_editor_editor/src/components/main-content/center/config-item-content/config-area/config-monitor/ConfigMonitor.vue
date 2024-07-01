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
import {useLanguageStore} from '@/stores/misc/languages'
import ConfigInput from '@/components/shared-components/config/ConfigInput.vue'
const languages_store = useLanguageStore()
const config_store = useConfigStore()
const language = reactive(languages_store.language)
const {data, active} = storeToRefs(config_store)
</script>
<template>
    <div class="config-tab-monitor">
        <ConfigInput :label="language.config.NETWORK" v-model="data[active.index].network" />
        <ConfigInput :label="language.config.DATASET" v-model="data[active.index].dataset" />
    </div>
</template>