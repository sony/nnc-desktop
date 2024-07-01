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
import { ref, nextTick, reactive } from 'vue';
import {useEditorStore} from '@/stores/editor'
import {useContextMenuStore} from '@/stores/editor/context_menu'
import { useLanguageStore } from '@/stores/misc/languages'
import { useConfigStore } from '@/stores/config'
import NncRegister from '@/components/shared-components/nnc-register/NncRegister.vue'
import NncControllerButton from '@/components/shared-components/NncControllerButton.vue'
import NncJobType from '@/components/shared-components/NncJobType.vue'
import NncInstanceTab from '@/components/shared-components/nnc-instance-tab/NncInstanceTab.vue'

import { storeToRefs } from 'pinia';
const editor_store = useEditorStore()
const context_menu_store = useContextMenuStore()
const language_store = useLanguageStore()
const config_store = useConfigStore()
const language = reactive(language_store.language)
const props = defineProps<{
    activeJobId: any, 
}>()


const numNodesObj = ref<any>({})
const {editTabInstance, availableInstances} = storeToRefs(editor_store)

function getNumNode(selectedInstance: any, numNode: any) {
    const type = selectedInstance.selected;
    const priority = selectedInstance.activePriority;
    let group = selectedInstance.priorities[priority];
    numNodesObj.value[group] = numNode;
    editor_store.changedNumNode(type, Number(group), Number(numNodesObj.value[group]))
    // this.$emit('changed-num-node', type, Number(group), Number(numNodesObj.value[group]));
}

function openStructureSearchConfig(configs: any) {
    context_menu_store.setContextMenuShown(false)
    configs.data.forEach((config: any, index: any) => {
        if (config.type === 'Global') {
            config.active = true;
            configs.active.index = index;
        } else {
            config.active = false;
        }
    });
    editor_store.activeTabName = 'CONFIG';
    nextTick(() => {
        editor_store.windowInit();
    });
}

function onTriggeredJob(selectedInstance: any) {
    const type = selectedInstance.selected;
    const priority = selectedInstance.activePriority;
    let group = selectedInstance.priorities[priority];
    editor_store.onTriggeredJob(type, Number(group), Number(numNodesObj.value[group]))
}
</script>

<template>
    <!--nncd: add style-->
    <div class="job-action-control edit-controller-content" style="min-height: 20%">
        <template v-if="editor_store.forceRegister">
            <div class="title job-action-control-title">Controller</div>
            <NncRegister/>
        </template>
        <template v-else>
            <div class="title job-action-control-title">
                <span>{{language.controller.CONTROLLER}}</span>
                <NncControllerButton 
                :caption="language.controller.RUN" 
                :suspended="false"
                :disabled="false"
                @pressed="onTriggeredJob(editor_store.editTabInstance)" 
                />
            </div>

            <NncJobType
                :selectedType="editTabInstance.selected"
                :availableTypes="['profile', 'train']"
                @selectJobType="(jobType: any) => editor_store.onJobTypeChanged(jobType, 'edit-tab')"
                :numParallel="Number(config_store.data[0].structure_search.num_parallel)"
                :is-disabled="false"
            />

            <NncInstanceTab
                v-if="availableInstances.train"
                :instanceInfo="editTabInstance"
                :priority="editTabInstance.activePriority"
                :isDisabled="false"
                :active-job-id="activeJobId"
                @input="(choice, priority) => editor_store.onChoiceChanged(choice, priority, 'edit-tab')"
                @selectNumNode="(numNode) => getNumNode(editTabInstance, numNode)"
                @selectPriority="priority => editor_store.onPriorityChanged(priority, 'edit-tab')"
            />
        </template>
    </div>
</template>