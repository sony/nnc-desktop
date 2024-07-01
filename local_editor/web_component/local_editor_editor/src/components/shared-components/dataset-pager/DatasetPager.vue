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
import {useInferenceStore} from '@/stores/inference'
import {useEvaluationStore} from '@/stores/evaluation'
import {useDefinitionsStore} from '@/stores/misc/definitions'
import { storeToRefs } from 'pinia';
import PagerActionBar from './PagerActionBar.vue'
import PagerContentClassification from './PagerContentClassification.vue'
import PagerContent from './PagerContent.vue'
import { computed, nextTick, onBeforeUpdate, onMounted, reactive, ref } from 'vue';
const inference_store = useInferenceStore()
const evaluation_store = useEvaluationStore()
const definitions_store = useDefinitionsStore()
const props = defineProps<{
    index: number,
    total: number,
    makeGetData: Function,
    makeGetNextColumnData: Function,
    showLimitWarningOnControl: boolean,
    isCopying: boolean,
    isDatasetCacheNotFoundError: boolean,
    isClassification: boolean,
    filter: string,
    sortKey: string,
    sortType: string,
    label: string,
    isEvaluationTab: boolean,
    isInferenceTab: boolean,
    isInit: boolean,
    features: any,
    menuItems: any,
}>()
const emit = defineEmits([
    'total', 
    'sort_key',
    'sort_type',
    'reset_condition',
    'get-original-file',
    'updateSelectedIndex'
])

const {
    infer_offset
} = storeToRefs(inference_store)

const {
    eval_offset
} = storeToRefs(evaluation_store)

const ds_offset = ref<number>(0)
const current = ref<number>(0)

onMounted(() => {
    current.value = props.index
})

onBeforeUpdate(() => {
    if(current.value !== props.index) {
        current.value = props.index;
        ds_offset.value = 0
    }
})

const itemsPerPage = computed(() => {
    return definitions_store.Definitions.ITEMS_PER_PAGE
})

const lastPage = computed(() => {
    return parseInt(String((props.total + itemsPerPage.value - 1) / itemsPerPage.value));
})

const lastOffset = computed(() => { 
    return (lastPage.value - 1) * itemsPerPage.value; 
})

function setOffset(offset: number) {
    if(props.isEvaluationTab) {
        eval_offset.value = offset
    } else if(props.isInferenceTab) {
        infer_offset.value = offset
    } else {
        ds_offset.value = offset
    }
}

function getOffset(): number {
    let offset = 0
    if(props.isEvaluationTab) {
        offset = eval_offset.value
    } else if(props.isInferenceTab) {
        offset = infer_offset.value
    } else {
        offset = ds_offset.value
    }
    return offset
}

function getIndex() {
    return getOffset() > props.total ? 0 : parseInt(String((getOffset() + itemsPerPage.value - 1) / itemsPerPage.value))
}

function updateTotal(_total: any) {
    emit('total', _total);
}

function getCenterContentClass() {
    let cls_name = ''
    if(props.isEvaluationTab) {
        cls_name = 'center-content-evaluation'
    }
    if(props.isInferenceTab) {
        cls_name = 'center-content-inference'
    }
    return cls_name
}

</script>
<template>
    <div class="position-relative">
        <div class="position-absolute">
            <div class="center-content-bar" :class="getCenterContentClass()">
                <div class="float-left">
                    <slot name="pager-header"/>
                </div>
                <PagerActionBar
                    v-if="total"
                    :index="getIndex()"
                    :pages="lastPage"
                    @first="setOffset(0)"
                    @next="setOffset(getOffset() + itemsPerPage)"
                    @prev="setOffset(getOffset() - itemsPerPage)"
                    @last="setOffset(lastOffset)"
                />
            </div>
            <PagerContentClassification 
                v-if="isClassification"
                :total="total"
                :offset="getOffset()"
                :index="index"
                :get-data="makeGetData(getOffset(), filter, sortKey, sortType, label)"
                :is-copying="isCopying"
                :filter="filter"
                :sort-key="sortKey"
                :sort-type="sortType"
                :label="label"
                :isInit="isInit"
                @first="setOffset(0)"
                @total="updateTotal"
                @sort_key="value => emit('sort_key', value)"
                @sort_type="value => emit('sort_type', value)"
                @reset_condition="emit('reset_condition')"
            />
            <PagerContent v-else
            :show-limit-warning-on-control="showLimitWarningOnControl"
            :total="total"
            :offset="getOffset()"
            :index="index"
            :get-data="makeGetData(getOffset() > total ? 0 : getOffset())"
            :get-next-column-data="makeGetNextColumnData(getOffset())"
            :is-copying="isCopying"
            :is-dataset-cache-not-found-error="isDatasetCacheNotFoundError"
            :isInit="isInit"
            :features="features"
            @get-original-file="(value: any) => $emit('get-original-file', value)"
            @first="setOffset(0)"
            :menuItems="menuItems"
            @updateSelectedIndex="(target: any) => $emit('updateSelectedIndex', target)"
            />
        </div>
    </div>
</template>