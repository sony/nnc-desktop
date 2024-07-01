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
import { storeToRefs } from 'pinia';
import DatasetInfo from './DatasetInfo.vue'
import DatasetContent from './dataset-content/DatasetContent.vue'
import DatasetExchange from './dataset-exchange/DatasetExchange.vue'
const editor_store = useEditorStore()
const dataset_store = useDatasetStore()
const {
    visibleLinkingDataset
} = storeToRefs(dataset_store)
</script>
<template>
<div id="dataset-area">
    <div v-if="!visibleLinkingDataset">
        <DatasetInfo/>
        <DatasetContent/>
    </div>
    <div v-else class="height-max">
        <DatasetExchange/>
    </div>
</div>
</template>