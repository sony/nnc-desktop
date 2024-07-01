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
import {computed} from 'vue'
import { useEditorStore } from '@/stores/editor'
import EditLeftContent from './edit-left-content/EditLeftContent.vue'
import DatasetLeftContent from './dataset-left-content/DatasetLeftContent.vue'
import ConfigLeftContent from './config-left-content/ConfigLeftContent.vue'
import JobsArea from './jobs-area/JobsArea.vue'

const editor_store = useEditorStore()

const DetailContent = {
    'edit-list': EditLeftContent,
    'dataset-list': DatasetLeftContent,
    'config-list': ConfigLeftContent,
    'job-list': JobsArea,
}

const listForEachTabRespectively = computed(() => {
    var tabName = editor_store.activeTabNameLowerCase
    return ['training', 'evaluation', 'inference'].includes(tabName) ? DetailContent['job-list'] : DetailContent[`${tabName}-list` as keyof typeof DetailContent];
})
</script>

<template>
    <div class="left-content">
        <component :is="listForEachTabRespectively"/>
    </div>
</template>
