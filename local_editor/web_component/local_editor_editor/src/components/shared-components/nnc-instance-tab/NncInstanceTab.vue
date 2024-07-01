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
import NncInstance from './nnc-instance/NncInstance.vue'
import NncPriceLink from './NncPriceLink.vue'
const language_store = useLanguageStore()
const config_store = useConfigStore()
const definitions_store = useDefinitionsStore()
const editor_store = useEditorStore()
const language = reactive(language_store.language)
const props = defineProps<{
    instanceInfo: any, 
    priority: number, 
    isDisabled: boolean,
    activeJobId: any
}>()
const emit = defineEmits([
    'input', 
    'selectNumNode',
    'selectPriority'
])

const {
    availableInstances, 
    services, 
    freeCpuHours,
    isShowInLocalEditor,
    isRegistered,
    isLocal,
    hasShareTenant,
    tenantId,
    numNodes
} = storeToRefs(editor_store)
const availableABCI = ref(definitions_store.Definitions.AVAILABLE_ABCI)
const buttonRegist = ref<any>(null)

// hooks
onMounted(() => {
    editor_store.updateCpuFreeHours()
})

const locale = computed(() => {
    return definitions_store.Definitions.LOCALE;
})

function getProviderName(priority: any) {
    const type = props.instanceInfo.selected;
    const instances = (availableInstances.value[type] || []).filter((instance: any) => instance.priority === priority);
    const provider = ((instances[0] || {}).provider || '');
    return provider === 'aws' ? 'Standard' : provider.toUpperCase();
}

function isABCIInstance(instances: any) {
    return instances.findIndex((instance: any) => instance.provider === 'abci') !== -1;
}

function isNeedAgreement(priority: any) {
    const type = props.instanceInfo.selected;
    const instances = (availableInstances.value[type] || []).filter((instance: any) => instance.priority === priority);
    const isABCIInstance = instances.findIndex((instance: any) => instance.provider === 'abci') !== -1;
    const isAvailableABCIInstance = services.value.indexOf('abci') !== -1;
    const isNeedAgreement = instances.findIndex((instance: any) => instance.needs_agreement) !== -1;
    return isNeedAgreement;
}

function filteredInstances(priority: any) {
    const type = props.instanceInfo.selected;
    return (availableInstances.value[type] || []).filter((instance: any) => instance.priority === priority);
}

function selectedInstance(priority: any) {
    var selectedInstance = props.instanceInfo.priorities[priority];
    const type = props.instanceInfo.selected;
    var filteredInstances = (availableInstances.value[type] || []).filter((instance: any) => instance.priority === priority);
    if (filteredInstances.findIndex((instance: any) => (instance.instance_type === selectedInstance) && instance.available) !== -1) {
        return selectedInstance;
    } else {
        const defaultInstance = (filteredInstances[0] || {}).instance_type;
        emit('input', defaultInstance, priority);
        return defaultInstance;
    }
}

function isJPUser(): boolean {
    return locale.value === 'ja-JP';
}

function instanceItemOnClick(selectPriority: number) {
    if (!props.isDisabled) {
        emit('selectPriority', selectPriority)
    }
}


</script>

<template>
    <div>
        <div :class="isDisabled ? 'instance-tab disabled' : 'instance-tab'" v-if="availableInstances.train">
            <div v-if="!availableABCI || !isJPUser()">
                <div class="instance-tab-content only" id="instance_priority_0-content">
                    <NncInstance
                        :selectedInstanceType="selectedInstance(0)"
                        :availableInstances="filteredInstances(0)"
                        :isDisabled="isDisabled"
                        :is-local="isLocal"
                        :isABCIInstance="isABCIInstance(filteredInstances(0))"
                        :num-nodes="numNodes"
                        :instance-info="instanceInfo"
                        :active-job-id="activeJobId"
                        :free-cpu-hours="freeCpuHours"
                        @input="(choice: any) => $emit('input', choice, '0')"
                        @selectNumNode="(numNode: any) => $emit('selectNumNode', numNode)"
                    />
                </div>

                <NncPriceLink
                    v-if="isRegistered && isJPUser() || !isLocal"
                    :linkName="language.controller.SEE_SPEC_PRICE"
                    :linkUrl="isABCIInstance(filteredInstances(0)) ? '/ja/cloud/abci/index.html' : '/ja/cloud/price_jp.html'"
                />

                <div v-if="!isRegistered && isJPUser() && isLocal" class="register-message">
                    <div>{{language.YOU_FREE_CPU_COMPUTE_HOURS}}<span style="color: var(--color-system1);">{{ freeCpuHours }} {{language.HOURS}}</span>{{language.IF_YOU_WANT_TO_USE_GPU}}</div>
                    <div class="btn-regist" @click="buttonRegist.click()">
                        <div><a :href="hasShareTenant ? '/console/#/serviceSettings?tenant_id=' + tenantId : '/console/#/serviceSettings'" ref="buttonRegist">{{language.controller.ENTER_CREDIT_CARD}}</a></div>
                    </div>
                </div>
            </div>
            <template v-else>
                <input v-if="priority === 0" id="instance_priority_0" type="radio" name="instance-item" :checked="priority === 0" :disabled="isDisabled">
                <input v-else id="instance_priority_0" type="radio" name="instance-item" :disabled="isDisabled" :checked="priority === 0">
                <label class="instance-item" for="instance_priority_0" @click="instanceItemOnClick(0)">
                    {{getProviderName(0)}}
                </label>
                <!-- nncd: add div -->
                <div v-if="isShowInLocalEditor">
                    <input v-if="priority === 1" id="instance_priority_1" type="radio" name="instance-item" :disabled="isDisabled" :checked="priority === 1">
                    <input v-else id="instance_priority_1" type="radio" name="instance-item" :disabled="isDisabled" :checked="priority === 1">
                    <label class="instance-item" for="instance_priority_1" @click="instanceItemOnClick(1)">{{getProviderName(1)}}</label>
                </div>
                <div class="tab-line"></div>
                <div class="instance-tab-content" id="instance_priority_0-content">
                <!-- ABCIインスタンスだがテナントが承認していない、もしくは個人が同意していない場合 -->
                <template v-if="(isABCIInstance(filteredInstances(0)) && services.indexOf('abci') === -1) || (isABCIInstance(filteredInstances(0)) && isNeedAgreement(0))">
                    <NncInstance
                        :selectedInstanceType="selectedInstance(0)"
                        :availableInstances="filteredInstances(0)"
                        :isDisabled="isDisabled"
                        :free-cpu-hours="freeCpuHours"
                        :is-local="isLocal"
                        :num-nodes="numNodes"
                        :instance-info="instanceInfo"
                        :active-job-id="activeJobId"
                        @input="(choice: any) => $emit('input', choice, '0')"
                        @selectNumNode="(numNode: any) => $emit('selectNumNode', numNode)"
                        :isABCIInstance="isABCIInstance(filteredInstances(0))"
                    />
                    <div>
                        <div>{{language.ABCI_IS_A_WORLD_CLASS_COMPUTING}}</div>
                        <div>{{language.SIGN_UP_FOR_AIST}}</div>
                    </div>
                    <NncPriceLink
                        :linkName="language.controller.LEARN_MORE_ABCI"
                        linkUrl="/ja/cloud/abci/index.html"
                    />
                </template>
                <!-- ABCIインスタンス、もしくはAWSのインスタンスの場合 -->
                <template v-else>
                    <NncInstance
                        :selectedInstanceType="selectedInstance(0)"
                        :availableInstances="filteredInstances(0)"
                        :isDisabled="isDisabled"
                        :free-cpu-hours="freeCpuHours"
                        :is-local="isLocal"
                        :num-nodes="numNodes"
                        :instance-info="instanceInfo"
                        :active-job-id="activeJobId"
                        @input="(choice: any) => $emit('input', choice, '0')"
                        @selectNumNode="(numNode: any) => $emit('selectNumNode', numNode)"
                        :isABCIInstance="isABCIInstance(filteredInstances(0))"
                    />
                    <!--nncd: add div-->
                    <div v-if="isShowInLocalEditor">
                        <NncPriceLink
                            v-if="isRegistered && isJPUser() || !isLocal"
                            :linkName="language.controller.SEE_SPEC_PRICE"
                            :linkUrl="isABCIInstance(filteredInstances(0)) ? '/ja/cloud/abci/index.html' : '/ja/cloud/price_jp.html'"
                        />
                        <div v-if="!isRegistered && isJPUser() && isLocal" class="register-message">
                            <div>{{language.YOU_FREE_CPU_COMPUTE_HOURS}} <span style="color: var(--color-system1);">{{ freeCpuHours }} {{language.HOURS}}</span>{{language.IF_YOU_WANT_TO_USE_GPU}}</div>
                            <div class="btn-regist" @click="buttonRegist.click()">
                                <div><a :href="hasShareTenant ? '/console/#/serviceSettings?tenant_id=' + tenantId : '/console/#/serviceSettings'" ref="buttonRegist">{{language.controller.ENTER_CREDIT_CARD}}</a></div>
                            </div>
                        </div>
                    </div>
                </template>
                </div>
                <div class="instance-tab-content" id="instance_priority_1-content">
                    <!-- ABCIインスタンスだがテナントが承認していない、もしくは個人が同意していない場合 -->
                    <template v-if="(isABCIInstance(filteredInstances(1)) && services.indexOf('abci') === -1) || (isABCIInstance(filteredInstances(1)) && isNeedAgreement(1))">
                        <NncInstance
                            :selectedInstanceType="selectedInstance(1)"
                            :availableInstances="filteredInstances(1)"
                            :isDisabled="isDisabled"
                            :free-cpu-hours="freeCpuHours"
                            :is-local="isLocal"
                            :num-nodes="numNodes"
                            :instance-info="instanceInfo"
                            :active-job-id="activeJobId"
                            @input="(choice: any) => $emit('input', choice, '1')"
                            @selectNumNode="(numNode: any) => $emit('selectNumNode', numNode)"
                            :isABCIInstance="isABCIInstance(filteredInstances(1))"
                        />
                        <div>
                            <div>{{language.ABCI_IS_A_WORLD_CLASS_COMPUTING}}</div>
                            <div>{{language.SIGN_UP_FOR_AIST}}</div>
                        </div>
                        <NncPriceLink
                            :linkName="language.controller.LEARN_MORE_ABCI"
                            linkUrl="/ja/cloud/abci/index.html"
                        />
                    </template>
                    <!-- ABCIインスタンス、もしくはAWSのインスタンスの場合 -->
                    <template v-else>
                        <NncInstance
                            :selectedInstanceType="selectedInstance(1)"
                            :availableInstances="filteredInstances(1)"
                            :isDisabled="isDisabled"
                            :free-cpu-hours="freeCpuHours"
                            :is-local="isLocal"
                            :num-nodes="numNodes"
                            :instance-info="instanceInfo"
                            :active-job-id="activeJobId"
                            @input="(choice: any) => $emit('input', choice, '1')"
                            @selectNumNode="(numNode: any) => $emit('selectNumNode', numNode)"
                            :isABCIInstance="isABCIInstance(filteredInstances(1))"
                        />
                        <NncPriceLink
                            v-if="isRegistered && isJPUser() || !isLocal"
                            :linkName="language.controller.SEE_SPEC_PRICE"
                            :linkUrl="isABCIInstance(filteredInstances(1)) ? '/ja/cloud/abci/index.html' : '/ja/cloud/price_jp.html'"
                        />
                        <div v-if="!isRegistered && isJPUser() && isLocal" class="register-message">
                            <div>{{language.YOU_FREE_CPU_COMPUTE_HOURS}} <span style="color: var(--color-system1);">{{ freeCpuHours }} {{language.HOURS}}</span>{{language.IF_YOU_WANT_TO_USE_GPU}}</div>
                            <div class="btn-regist" @click="buttonRegist.click()">
                                <div><a :href="hasShareTenant ? '/console/#/serviceSettings?tenant_id=' + tenantId : '/console/#/serviceSettings'" ref="buttonRegist">{{language.controller.ENTER_CREDIT_CARD}}</a></div>
                            </div>
                        </div>
                    </template>
                </div>
            </template>
        </div>
    </div>
</template>