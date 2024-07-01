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
import { ref, nextTick, reactive, computed } from 'vue';
import { useLanguageStore } from '@/stores/misc/languages'
import { useConfigStore } from '@/stores/config'
import { storeToRefs } from 'pinia';
import NncCheckbox from '@/components/shared-components/NncCheckbox.vue'
const language_store = useLanguageStore()
const config_store = useConfigStore()
const language = reactive(language_store.language)
const props = defineProps<{
    selectedType: string, 
    availableTypes: any, 
    isDisabled: boolean, 
    numParallel: number
}>()

const {data} = storeToRefs(config_store)

const structureSearchLabel = computed(() => {
    if (props.numParallel > 1) {
        return language.controller.STRUCTURE_SEARCH + ' ' + 'x ' + props.numParallel;
    } else {
        return language.controller.STRUCTURE_SEARCH;
    }
})

</script>

<template>
    <div class="job-type-area">
        <div v-if="availableTypes.indexOf('profile') !== -1" :class="selectedType === 'profile' ? 'selected' : ''" @click="() => $emit('selectJobType', 'profile')">
            <img v-if="selectedType === 'profile'" src="@/assets/image/ControlerProfile.svg" />
            <img v-else src="@/assets/image/ControlerProfile.svg" />
            <span>{{language.controller.PROFILE}}</span>
        </div>
        <div v-else class="disabled">
            <img src="@/assets/image/ControlerProfile.svg" />
            <span>{{language.controller.PROFILE}}</span>
        </div>

        <div v-if="availableTypes.indexOf('train') !== -1" :class="selectedType === 'train' ? 'train-area selected' : 'train-area'" @click="() => $emit('selectJobType', 'train')">
            <div>
                <img v-if="selectedType === 'train'" src="@/assets/image/ControlerTrain.svg" />
                <img v-else src="@/assets/image/ControlerTrain.svg" />
                <span>{{language.controller.TRAIN}}</span>
            </div>
            <NncCheckbox 
                v-if="!isDisabled" 
                v-model="data[0].structure_search.enable" 
                :label="structureSearchLabel" 
                :disabled="isDisabled" 
            />
            <NncCheckbox 
                v-else 
                v-model="data[0].structure_search.enable" 
                :label="structureSearchLabel" 
                :disabled="isDisabled" 
            />
        </div>
        <div v-else class="disabled train-area">
            <div>
                <img src="@/assets/image/ControlerTrain.svg" />
                <span>{{language.controller.TRAIN}}</span>
            </div>
            <NncCheckbox 
                v-model="data[0].structure_search.enable" 
                :label="structureSearchLabel" 
                :disabled="false" 
            />
        </div>

        <div v-if="availableTypes.indexOf('evaluate') !== -1" :class="selectedType === 'evaluate' ? 'selected' : ''" @click="() => $emit('selectJobType', 'evaluate')">
            <img v-if="selectedType === 'evaluate'" class="selected" src="@/assets/image/ControlerEvaluate.svg" />
            <img v-else src="@/assets/image/ControlerEvaluate.svg" />
            <span>{{language.controller.EVALUATE}}</span>
        </div>
        <div v-else class="disabled">
            <img src="@/assets/image/ControlerEvaluate.svg" />
            <span>{{language.controller.EVALUATE}}</span>
        </div>
    </div>
</template>