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
import { useResultStore } from '@/stores/result'
import { storeToRefs } from 'pinia';
const language_store = useLanguageStore()
const config_store = useConfigStore()
const result_store = useResultStore()
const definitions_store = useDefinitionsStore()
const editor_store = useEditorStore()
const language = reactive(language_store.language)
const props = defineProps<{
    value: string, 
    choice: string, 
    label: string, 
    available: boolean, 
    freeCpuHours: number, 
    display_free_cpu_hours: boolean, 
    isLocal: boolean, 
    isDisabled: boolean, 
    isABCIInstance: boolean, 
    numNodes: any, 
    numNodesInJob: any, 
    instanceInfo: any, 
    activeJobId: string
}>()
const emit = defineEmits([
    'selectNumNode',
    'input'
])
const {
    isShowInLocalEditor,
} = storeToRefs(editor_store)

const selectedNumNode = ref<any>(getSelectedNumNode())

const processor = computed(() => {
    var searchWord = props.isABCIInstance ? ' GPU x' : ' x';
    var label = props.label;
    var last_index = label.lastIndexOf(searchWord);
    return label.substr(0,last_index);
})

const cores = computed(() => {
    var searchWord = props.isABCIInstance ? ' GPU x' : ' x';
    var label = props.label;
    var last_index = label.lastIndexOf(searchWord);
    return label.substr(last_index);
})

function changeSelectedNumNode(e: any) {
    emit('selectNumNode', e.target.value);
}

function getSelectedNumNode(activeJobId ?: any) {
    if (editor_store.activeTabName === 'EDIT') {
        return definitions_store.DefaultNumNode;
    }
    if (props.value !== props.choice) {
        if (!props.numNodes || !props.numNodes.enum || !props.numNodes.enum.length) {
            return definitions_store.DefaultNumNode;
        }
        // available instancesからnumNodeの情報が取れる場合、その最小値を返す
        return props.numNodes.enum[0];
    }
    const activeResult = result_store.getActiveResult();
    if (!activeResult|| !activeResult.job_id) {
        return definitions_store.DefaultNumNode;
    }
    if (!activeJobId) {
        activeJobId = activeResult.job_id;
    }

    // レスポンスから取得したジョブ情報に選択中のノード数が存在しているか
    if (!props.numNodesInJob[activeJobId] || !props.numNodesInJob[activeJobId][props.choice]) {
        // instanceInfo(resumeInstance)に保管されているノード数のオブジェクトにactivejobIdが存在しているか
        if (props.instanceInfo.selectedNumNodes && props.instanceInfo.selectedNumNodes[activeJobId] && props.instanceInfo.selectedNumNodes[activeJobId][props.choice]) {
            return props.instanceInfo.selectedNumNodes[activeJobId][props.choice];
        } else {
            // TRANINGタブに遷移したタイミングではinstanceInfo.selectedNumNodesにまだ新ジョブIDが登録されていないため、
            // firstNumNodeで値が保持されるようにしている
            if (props.instanceInfo.firstNumNode && props.instanceInfo.firstNumNode[props.choice]) {
                return props.instanceInfo.firstNumNode[props.choice];
            } else {
                return definitions_store.DefaultNumNode;
            }
        }
    }
    if (props.numNodesInJob[activeJobId] && props.numNodesInJob[activeJobId] && props.numNodesInJob[activeJobId][props.choice]) {
        return props.numNodesInJob[activeJobId][props.choice];
    }
}

</script>

<template>
    <label v-if="available" class="radio-label radio-label-for-instance-menu" :class="{ active: value === choice }">
        <!--nncd: add v-if-->
        <div v-if="display_free_cpu_hours && isLocal && isShowInLocalEditor" class="free-cpu-annotation">{{ freeCpuHours }} H Free</div>
        <input type="radio" :checked="value === choice" @change="$emit('input', choice)" v-if="isDisabled" disabled>
        <input type="radio" :checked="value === choice" @change="$emit('input', choice)" v-else>
        <span class="instance-processor">{{ processor }}</span>
        <div class="instance-cores num_node" v-if="numNodes && numNodes.enum && numNodes.enum.length" @click="$emit('input', choice)"> x
            <label class="select_label">
                <select class="select_menu num_node" v-model="selectedNumNode" @change="changeSelectedNumNode">
                    <option v-for="(option, i) in numNodes.enum" :value="option">{{option}}</option>
                </select>
            </label>
        </div>
        <div class="instance-cores" :class="{ active: value === choice }">{{ cores }}</div>
    </label>
    <label v-else class="radio-label radio-label-for-instance-menu-disabled" @click.stop.prevent >
        <input type="radio" disabled>
        <span class="nnc-disabled instance-processor">{{ processor }}</span>
        <div class="nnc-disabled instance-cores">{{ cores }}</div>
    </label>
</template>