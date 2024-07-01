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
import { computed, ref, reactive } from 'vue';
import {useResultStore} from '@/stores/result'
import {useEditorStore} from '@/stores/editor'
import {useLanguageStore} from '@/stores/misc/languages'
import {useConfigStore} from '@/stores/config'
import { storeToRefs } from 'pinia';
import NncRegister from '@/components/shared-components/nnc-register/NncRegister.vue'
import NncControllerButton from '@/components/shared-components/NncControllerButton.vue'
import NncJobType from '@/components/shared-components/NncJobType.vue'
import NncInstanceTab from '@/components/shared-components/nnc-instance-tab/NncInstanceTab.vue'
const result_store = useResultStore()
const editor_store = useEditorStore()
const config_store = useConfigStore()
const languages_store = useLanguageStore()
const language = reactive(languages_store.language)
const props = defineProps<{
    activeJobId: string
}>()
const emit = defineEmits([
    'updateJobId'
])
const numNode = ref<any>({})
const {
    availableInstances,
    resumeInstance,
    forceRegister,
    hasShareTenant,
    tenantId
} = storeToRefs(editor_store)
const {
    data
} = storeToRefs(config_store)

const disabled = computed(() => {
    return result_store.getActiveResult() === undefined;
})

const activeJobType = computed(() => {
    return (result_store.getActiveResult()) ? result_store.getActiveResult().type : 'train';
})

const instanceInfo = computed(() => {
    if (result_store.getActiveResult() && props.activeJobId !== result_store.getActiveResult().job_id) {
        const selected = getAvailableType()[0];
        const currentJobType = result_store.getActiveResult().type;
        const group = result_store.getActiveResult().instance_group; // 1
        const priorities = (availableInstances.value[currentJobType] || []).filter((instance: any) => instance.instance_type === group);
        var priority;
        if (priorities.length) {
            priority = priorities[0].priority;
        } else {
            priority = 0;
        }
        editor_store.onJobTypeChanged(selected, 'resume')
        editor_store.onChoiceChanged(group, priority, 'resume')
        editor_store.onPriorityChanged(priority, 'resume')
        emit('updateJobId', result_store.getActiveResult().job_id);
    }
    return resumeInstance.value
})

function getNumNode(selectedInstance: any, _numNode: any) {
    numNode.value = _numNode;
    const type = selectedInstance.selected;
    const priority = selectedInstance.activePriority;
    let group = selectedInstance.priorities[priority];
    editor_store.changedNumNode(type, Number(group), Number(numNode.value))
}

function suspended(selectedType: any) {
    return getButtonName(selectedType) === language.controller.SUSPEND;
}

function getButtonName(selectedType: any) { // 実行中
    if (pausable()) {
        return language.controller.SUSPEND
    } else if (resumable()) {
        if (selectedType === 'evaluate') {
            return language.controller.RUN;
        }
        return language.controller.RESUME;
    } else {
        return language.controller.RUN;
    }
}

function availableType(currentType: any) {
    const availableType = getAvailableType();
    if (availableType.indexOf(currentType) === -1) {
        editor_store.onJobTypeChanged(availableType[0], 'resume')
    }
    return availableType;
}

function getAvailableType() {
    const type = (result_store.getActiveResult()) ? result_store.getActiveResult().type : 'train';
    switch (type) {
        case 'profile':
            if (pausable()) {
                return ['profile'];
            } else {
                return ['profile', 'train'];
            }
        case 'train':
            if (resumable()) {
                if (evaluatable()) {
                    return ['train', 'evaluate'];
                } else {
                    return ['train']
                }
            } else if (evaluatable()) {
                return ['evaluate'];
            } else {
                return ['train'];
            }
        case 'evaluate':
        case 'inference':
            return ['evaluate'];
        default:
            return [];
    }
}

function resumable() {
    return result_store.resumable()
}

function pausable() {
    return result_store.pausable()
}

function uneditable() {
    return result_store.uneditable()
}

function evaluatable() {
    return result_store.evaluatable()
}

function onTriggeredJob(selectedInstance: any, selectedNumNodes: any) {
    if (disabled.value) {
        return;
    }
    if (pausable()) {
        editor_store.onTriggeredJob('suspend')
        return;
    }

    const type = selectedInstance.selected;
    const priority = selectedInstance.activePriority;
    let group = selectedInstance.priorities[priority];

    var job = result_store.getActiveResult();
    if (['train', 'inference'].includes(job.type) && ['failed', 'suspended', 'finished'].includes(job.status) && type === 'evaluate') {
        editor_store.onTriggeredJob('evaluate', Number(group), Number(selectedNumNodes))
    } else if (job.type === 'profile' && ['failed', 'suspended', 'finished'].includes(job.status) && type === 'train') {
        editor_store.onTriggeredJob('resumeTrain', Number(group), Number(selectedNumNodes))
    } else {
        editor_store.onTriggeredJob('resume', Number(group), Number(selectedNumNodes))
    }
}

function selectJobType(jobType: any) {
    editor_store.onJobTypeChanged(jobType, 'resume')
}

function input(group: any, priority: any) {
    editor_store.onChoiceChanged(group, priority, 'resume')
}

function selectPriority(priority: any) {
    editor_store.onPriorityChanged(priority, 'resume')
}

</script>

<template>
<!--nncd: add style-->
<div class="job-action-control training-controller-content" style="min-height: 20%">
    <template v-if="forceRegister">
        <div class="title job-action-control-title">{{language.controller.CONTROLLER}}</div>
        <NncRegister/>
    </template>
    <template v-else>
        <div class="title job-action-control-title">
            <span>{{language.controller.CONTROLLER}}</span>
            <NncControllerButton
                :caption="getButtonName(resumeInstance.selected)"
                :suspended="suspended(resumeInstance.selected)"
                :disabled="disabled"
                @pressed="onTriggeredJob(resumeInstance, numNode)"
            />
        </div>

        <NncJobType
            :selectedType="resumeInstance.selected"
            :availableTypes="availableType(resumeInstance.selected)"
            :isDisabled="pausable()"
            @selectJobType="selectJobType"
            :numParallel="Number(data[0].structure_search.num_parallel)"
        />

        <NncInstanceTab
            v-if="availableInstances.train"
            :instanceInfo="instanceInfo"
            :priority="instanceInfo.activePriority"
            :isDisabled="pausable()"
            :active-job-id="activeJobId"
            @selectNumNode="(numNode: any) => getNumNode(resumeInstance, numNode)"
            @input="input"
            @selectPriority="selectPriority"
        />
    </template>
</div>
</template>