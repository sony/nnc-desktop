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
import { ref, nextTick, reactive, computed, onMounted } from 'vue';
import { useLanguageStore } from '@/stores/misc/languages'
import { useConfigStore } from '@/stores/config'
import { useDefinitionsStore } from '@/stores/misc/definitions'
import { useEditorStore } from '@/stores/editor'
import { storeToRefs } from 'pinia';
import NncRadioInstanceMenu from './NncRadioInstanceMenu.vue'
const language_store = useLanguageStore()
const config_store = useConfigStore()
const definitions_store = useDefinitionsStore()
const editor_store = useEditorStore()
const language = reactive(language_store.language)
const props = defineProps<{
    selectedInstanceType: string, 
    availableInstances: any, 
    isDisabled: boolean, 
    isLocal: boolean, 
    isABCIInstance: boolean, 
    numNodes: any, 
    instanceInfo: any, 
    activeJobId: string,
    freeCpuHours: any
}>()
const emit = defineEmits([
    'input',
    'selectNumNode'
])

const locale = computed<any>(() => {
    return definitions_store.Definitions.LOCALE;
})

function onChoiceChanged(choice: any) {
    emit('input', choice);
}

function onSelectNumNode(numNode: any) {
    emit('selectNumNode', numNode);
}

</script>

<template>
    <div class="job-instance-area">
        <ul class="job-action-control-dropdown-menu">
            <li class="dropdown-items" v-for="instance in availableInstances">
                <NncRadioInstanceMenu
                    :value="selectedInstanceType"
                    :choice="instance.instance_type"
                    :label="instance.description[locale]"
                    :available="instance.available && !instance.needs_agreement"
                    :free-cpu-hours="freeCpuHours"
                    :is-local="isLocal"
                    :display_free_cpu_hours="instance.instance_type === definitions_store.Definitions.DEFAULT_INSTANCE_GROUP"
                    :isDisabled="isDisabled"
                    :isABCIInstance="isABCIInstance"
                    :num-nodes="instance.num_nodes ? instance.num_nodes : {}"
                    :num-nodes-in-job="numNodes"
                    :instance-info="instanceInfo"
                    :active-job-id="activeJobId"
                    @input="onChoiceChanged"
                    @selectNumNode="onSelectNumNode"
                />
            </li>
        </ul>
    </div>
</template>