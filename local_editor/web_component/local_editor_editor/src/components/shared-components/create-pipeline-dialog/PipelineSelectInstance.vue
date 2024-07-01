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
import { useLanguageStore } from '@/stores/misc/languages'
import { useDefinitionsStore } from '@/stores/misc/definitions'
import NncRadio from '@/components/shared-components/NncRadio.vue'
import { computed, ref, reactive } from 'vue'
const definitions_store = useDefinitionsStore()
const language_store = useLanguageStore()
const language = reactive(language_store.language)
const props = defineProps<{
    title: string,
    instances: any,
    availableInstances: any,
    onInput: Function,
}>()

const standardInstances = computed(() => {
    return props.availableInstances.filter((instance: any) => instance.provider === 'aws');
})

const abciInstances = computed(() => {
    return props.availableInstances.filter((instance: any) => instance.provider === 'abci');
})

function onChangeType(value: any) {
    let instanceType;
    if (value === 'ABCI') {
        instanceType = (props.availableInstances.filter((instance: any) => instance.provider === 'abci')[0] || {}).instance_type;
    } else {
        instanceType = (props.availableInstances.filter((instance: any) => instance.provider === 'aws')[0] || {}).instance_type;
    }
    props.onInput({
        type: String(instanceType),
        selected: value
    });
}

function onChangeInstanceType(e: Event) {
    props.onInput({
        type: (e.target as HTMLInputElement).value,
        selected: props.instances.selected
    });
}

</script>

<template>
    <div>
        <div class="row">
            <div class="title">{{ title }}</div>
            <div class="value">
                <NncRadio class="nnc-modal-radio" :modelValue="instances.selected" @update:model-value="onChangeType" choice="Standard" label="Standard" :disabled="false"/>
                <NncRadio class="nnc-modal-radio" :modelValue="instances.selected" @update:model-value="onChangeType" choice="ABCI" label="ABCI" :disabled="!abciInstances.length" />
                <div v-if="instances.selected === 'Standard'">
                    <label class="select_label">
                        <select class="select_menu" id="select-label" name="select-label" @change="onChangeInstanceType">
                            <option v-for="instance in standardInstances" :value="instance.instance_type">
                                {{ instance.description['ja-JP'] }}
                            </option>
                        </select>
                    </label>
                </div>
                <div v-else>
                    <label class="select_label">
                        <select class="select_menu" id="select-label" name="select-label" @change="onChangeInstanceType">
                            <option v-for="instance in abciInstances" :value="instance.instance_type">
                                {{ instance.description['ja-JP'] }}
                            </option>
                        </select>
                    </label>
                </div>
            </div>
        </div>
    </div>
</template>