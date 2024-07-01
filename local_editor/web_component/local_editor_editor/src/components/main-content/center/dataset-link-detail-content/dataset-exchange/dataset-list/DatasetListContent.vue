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
import {useDatasetStore} from '@/stores/dataset'
const dataset_store = useDatasetStore()
const props = defineProps<{
    dataset: any, 
}>()
const emit = defineEmits([
    'showLinkingDataset',
    'setPreviewDataset'
])

function selectDataset(dataset: any) {
    var activeDataset = dataset_store.data[dataset_store.active.index];
    Object.assign(activeDataset, {
        id: dataset.id,
        original_name: dataset.original_name,
        datasource: dataset.data_source,
        file_location: dataset.file_location,
        samples: dataset.samples,
        columns: dataset.columns,
        tenant_id: dataset.tenant_id,
        features: dataset.features
    });
    dataset_store.visibleLinkingDataset = false
}

</script>
<template>
    <div :class="['dataset-list-item', dataset.linked ? 'dataset-linked' : '']" @click="emit('setPreviewDataset', dataset)">
        <div class="dataset-item clearfix">
            <div class="dataset-list-name">
                <div class="item-name">{{ dataset.original_name }}</div>
                <div class="item-property">
                    <div class="dataset-item-property"><img class="dataset-property-img" src="@/assets/image/TableRow.svg" /><span>{{ dataset.samples }} Rows</span></div>
                    <div class="dataset-item-property"><img class="dataset-property-img" src="@/assets/image/TableCol.svg" /><span>{{ dataset.columns }} Cols</span></div>
                    <div class="dataset-item-property"><img class="dataset-property-img" src="@/assets/image/Load.svg" /><span>{{ dataset.update_datetime }}</span></div>
                    <div class="dataset-item-property-label putted-labels-area"><span class="putted-labels" v-for="label in dataset.labels">{{ label }}</span></div>
                </div>
                <div class="item-description"><span>{{ dataset.description }}</span></div>
            </div>
            <div class="nnc-invoker dataset-list-action">
                <img src="@/assets/image/Linked.svg" class="data-selector-link-image " @click="selectDataset(dataset)" />
            </div>
        </div>
    </div>
</template>