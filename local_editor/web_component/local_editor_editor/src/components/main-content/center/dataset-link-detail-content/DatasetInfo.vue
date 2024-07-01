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
import { nextTick, reactive } from 'vue';
const editor_store = useEditorStore()
const dataset_store = useDatasetStore()
const languages_store = useLanguageStore()
const language = reactive(languages_store.language)
const {
    data,
    active,
    visibleLinkingDataset
} = storeToRefs(dataset_store)

function showDatasetList() {
    visibleLinkingDataset.value = true
    // this.$emit('show-linking-dataset', true);
    nextTick(function() {
        editor_store.windowInit()
    });
}
</script>
<template>
    <div class="center-content-bar">
        <div v-if="data.length">
            <img src="@/assets/image/Linked.svg" class="bar-image nnc-enabled"/>
            <span bar-text>{{language.dataset.LINK_DATASET}}</span>
            <span class="dataset-original-name-link nnc-invoker" v-on:click="showDatasetList">
                {{ data[active.index].original_name || language.dataset.NOT_SET }}
            </span>
            <img src="@/assets/image/Exchange.svg" class="data-selector-open-image nnc-enabled nnc-invoker pull-right" v-on:click="showDatasetList"/>
        </div>
    </div>
</template>