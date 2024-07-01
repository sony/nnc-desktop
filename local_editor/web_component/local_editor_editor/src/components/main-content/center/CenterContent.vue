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
import { computed } from 'vue'
import {useEditorStore} from '@/stores/editor'
import {useResultStore} from '@/stores/result'
import EditNetworkOperationContent from './edit-network-operation-content/EditNetworkOperationContent.vue'
import DatasetLinkDetailContent from './dataset-link-detail-content/DatasetLinkDetailContent.vue'
import ConfigItemContent from './config-item-content/ConfigItemContent.vue'
import TrainingResultDetailContent from './training-result-detail-content/TrainingResultDetailContent.vue'
import EvaluationResultDetailContent from './evaluation-result-detail-content/EvaluationResultDetailContent.vue'
import InferenceResultDetailContent from './inference-result-detail-content/InferenceResultDetailContent.vue'

const emit = defineEmits([
    'zoom', 
    'showLinkingDataset'
])
const editor_store = useEditorStore()
const result_store = useResultStore()

const dynamicComponentGen = computed(() => {
    if(editor_store.activeTabNameLowerCase === 'edit') { return EditNetworkOperationContent }
    if(editor_store.activeTabNameLowerCase === 'dataset') { return DatasetLinkDetailContent }
    if(editor_store.activeTabNameLowerCase === 'config') { return ConfigItemContent }
    if(editor_store.activeTabNameLowerCase === 'training') { return TrainingResultDetailContent }
    if(editor_store.activeTabNameLowerCase === 'evaluation') { return EvaluationResultDetailContent }
    if(editor_store.activeTabNameLowerCase === 'inference') { return InferenceResultDetailContent }
})

</script>

<template>
    <div class="center-content">
        <KeepAlive>
            <component :is="dynamicComponentGen" />
        </KeepAlive>
    </div>
</template>
