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
import {useEditorStore} from '@/stores/editor'
import {useDatasetStore} from '@/stores/dataset'
import {useLanguageStore} from '@/stores/misc/languages'
import { storeToRefs } from 'pinia';
import NncCheckbox from '@/components/shared-components/NncCheckbox.vue'
import { nextTick, reactive, ref } from 'vue';
const editor_store = useEditorStore()
const dataset_store = useDatasetStore()
const languages_store = useLanguageStore()
const language = reactive(languages_store.language)

const {
    data,
    active
} = storeToRefs(dataset_store)

function mainChange(_active_dataset: any, event: any) {
    data.value.forEach((dataset: any) => {
        dataset.is_main = dataset.name == _active_dataset.name;
    });
}

</script>
<template>
    <div class="dataset-property">
        <label calss="checkbox-label" :class="[data[active.index].is_main ? 'disabled' : '']">
            <input type="checkbox" class="checkbox-input" v-model="data[active.index].is_main" v-bind:disabled="data[active.index].is_main" @click="mainChange(data[active.index], $event)">
            <span class="checkbox-label-span">Main</span>
        </label>
        <NncCheckbox 
            label="Shuffle" 
            :disabled="false"
            v-model="data[active.index].tobe_shuffled" 
        />
        <NncCheckbox 
            label="Image Normalization(1.0/255.0)" 
            :disabled="false"
            v-model="data[active.index].tobe_normalized_image" 
        />
    </div>
</template>