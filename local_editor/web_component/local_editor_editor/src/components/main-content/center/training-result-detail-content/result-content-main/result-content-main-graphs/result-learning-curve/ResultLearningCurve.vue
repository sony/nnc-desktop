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
import { computed, nextTick, reactive, ref, toRaw } from 'vue';
import {useResultStore} from '@/stores/result'
import {useLanguageStore} from '@/stores/misc/languages'
import {useLRCurveGraphStore} from '@/stores/training_graph/learning_curve_graph'
import {useBaseGraphStore} from '@/stores/training_graph/base_graph'
import { storeToRefs } from 'pinia';
import JobCostAndErrors from '@/objects/JobCostAndErrors'
import JobErrorContent from './JobErrorContent.vue'
import NncLoading from '@/components/shared-components/NncLoading.vue'
import NncCheckbox from '@/components/shared-components/NncCheckbox.vue'
import { useLRCurveGraphForHtmlStore } from '@/stores/training_graph/learning_curve_for_html'
import TrainParamsVisualization from './train-params-visualization/TrainParamsVisualization.vue'
const result_store = useResultStore()
const learning_curve_graph_store = useLRCurveGraphStore()
const base_graph_store = useBaseGraphStore()
const languages_store = useLanguageStore()
const learning_curve_for_html_store = useLRCurveGraphForHtmlStore()
const language = reactive(languages_store.language)
const props = defineProps<{
    zoomInfo: any
}>()
const {
    data,
    active,
    graph
} = storeToRefs(result_store)
const cost_types = ref<any>([
    "Output",
    "CostParameter",
    "CostAdd",
    "CostMultiply",
    "CostMultiplyAdd",
    "CostDivision",
    "CostExp",
    "CostIf",
])

const isShowableLoading = computed(() => {
    const activeData = data.value[active.value];
    if (activeData.type === 'evaluate') {
        return false;
    } else if (activeData.type === 'profile') {
        return ['queued', 'preprocessing', 'processing'].includes(activeData.status);
    } else {
        return ['queued', 'preprocessing'].includes(activeData.status);
    }
})

const hasErrorMessage = computed(() => {
    const activeData = data.value[active.value];
    return activeData.status === 'failed' && activeData.train_status && activeData.train_status.last_error && activeData.train_status.last_error.code;
})

const error = computed(() => {
    const activeData = data.value[active.value];
    return {
        code: activeData.train_status.last_error.code,
        message: activeData.train_status.last_error.message
    };
})

const isShowableLearningCurve = computed(() => {
    const job = data.value[active.value] || {};
    const peek = (name: any) => job[name] || 0;
    for (var i=0; i<(job.current_epoch || -1); ++i) {
        if (peek('costs')[i] > 0 || peek('training_errors')[i] > 0 || peek('validation_errors')[i] > 0) {
            nextTick(() => { base_graph_store.reloadChart() });
            return true;
        }
    }
    return false;
})

const isShowableTradeOff = computed(() => {
    const d = toRaw(data.value)
    return d.some((job: any) => {
        const costAndErrors = new JobCostAndErrors(job, graph.value.cost_type);
        nextTick(() => { 
            base_graph_store.reloadChart() 
        });
        return costAndErrors.validationBest(0) > 0 || costAndErrors.training(0) > 0;
    });
})

function changeLegendSelect(legendName: string, selected: boolean) {
    base_graph_store.changeLegendSelect(legendName, selected)
}

</script>
<template>
    <div class="result-graph-area">
        <div class="learning-curve-area" v-show="graph.type=='Learning Curve'">
            <JobErrorContent v-if="hasErrorMessage" :errorCode="error.code" :errorMessage="error.message" />
            <NncLoading v-else-if="isShowableLoading" />
            <div v-else-if="data[active].type === 'profile'"></div>
            <div v-else-if="!isShowableLearningCurve">
                <span>{{language.training.GRAPH_CANNOT_BE_DISPLAYED}}</span>
            </div>
            <div v-else>
                <div class="legend">
                    <span class="legend-item">
                        <span class="legend-label-cost">
                            Cost
                        </span>
                    </span>
                    <span class="legend-item">
                        <NncCheckbox label="" v-model="graph.show_training_error" :disabled="false" @input="(checked) => changeLegendSelect('Training Error', checked)" />
                        <span class="legend-label-training">
                            Training Error
                        </span>
                    </span>
                    <span class="legend-item">
                        <NncCheckbox label="" v-model="graph.show_validation_error" :disabled="false" @input="(checked) => changeLegendSelect('Validation Error', checked)" />
                        <span class="legend-label-validation">
                            Validation Error
                        </span>
                    </span>
                </div>
                <div class="result-learning-curve"></div>
            </div>
        </div>
        <div v-show="graph.type=='Trade-off Graph'">
            <div v-if="!isShowableTradeOff">
                <span>{{language.training.GRAPH_CANNOT_BE_DISPLAYED}}</span>
            </div>
            <div v-else>
                <div class="legend">
                    <span class="legend-item">
                        <span class="legend-trade-off">□</span>
                        Training Error
                    </span>
                    <span class="legend-item">
                        <span class="legend-trade-off">■</span>
                        Best Validation Error
                    </span>
                </div>
                <div class="result-trade-off"></div>
                <div class="result-trade-off-cost-type">
                    <label class="select_label">
                        <select class="select_menu" v-model="graph.cost_type">
                            <option v-for="option in cost_types" :value="option">
                                {{ option }}
                            </option>
                        </select>
                    </label>
                </div>
            </div>
        </div>
        <TrainParamsVisualization v-if="graph.type === 'TrainParamsVisualization'" :zoom-info="zoomInfo" />
    </div>
</template>