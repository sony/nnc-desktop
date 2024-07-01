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
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref, watch, reactive } from 'vue';
import NncRadio from '@/components/shared-components/NncRadio.vue'
import {useEvaluationStore} from '@/stores/evaluation'
import {useEditorStore} from '@/stores/editor'
import {useUtilsStore} from '@/stores/utils'
import {useLanguageStore} from '@/stores/misc/languages'
import {useDefinitionsStore} from '@/stores/misc/definitions'
import {useResultStore} from '@/stores/result'
const definitions_store = useDefinitionsStore()
const editor_store = useEditorStore()
const evaluation_store = useEvaluationStore()
const utils_store = useUtilsStore()
const languages_store = useLanguageStore()
const language = reactive(languages_store.language)
const props = defineProps<{
    activeIndex: number, 
    selectedModal: string
}>()
const result_store = useResultStore()
const {
    projectId
} = storeToRefs(editor_store)
const {
    data,
    active,
    graph
} = storeToRefs(result_store)
const {
    colIndex,
    rowIndex,
    classification_label,
    classification_filter,
    classification_sort_key,
    classification_sort_type,
    table_type
} = storeToRefs(evaluation_store)

const partition = ref<any>(definitions_store.Definitions.EVALUATION.GRAPH.PARTITION)
const plotData = ref<any>({
    labels: [],
    datasets: [{
        label: 'false',
        backgroundColor: definitions_store.Definitions.EVALUATION.GRAPH.BAR_COLOR_FALSE,
        borderColor: definitions_store.Definitions.EVALUATION.GRAPH.BAR_COLOR_FALSE,
        data: [],
    }, {
        label: 'true',
        backgroundColor: definitions_store.Definitions.EVALUATION.GRAPH.BAR_COLOR_TRUE,
        borderColor: definitions_store.Definitions.EVALUATION.GRAPH.BAR_COLOR_TRUE,
        data: [],
    }],
})
const normalizedData = ref<any>({
    labels: [],
    datasets: [{
        label: 'false',
        backgroundColor: definitions_store.Definitions.EVALUATION.GRAPH.BAR_COLOR_FALSE,
        borderColor: definitions_store.Definitions.EVALUATION.GRAPH.BAR_COLOR_FALSE,
        data: [],
    }, {
        label: 'true',
        backgroundColor: definitions_store.Definitions.EVALUATION.GRAPH.BAR_COLOR_TRUE,
        borderColor: definitions_store.Definitions.EVALUATION.GRAPH.BAR_COLOR_TRUE,
        data: [],
    }],
})
const plotGraph = ref<any>(undefined)
const normalizedGraph = ref<any>(undefined)
const isLoading = ref<boolean>(false)
const errorMessage = ref<string>('')

watch(() => props.activeIndex, (newValue, oldValue) => {
    createGraph()
  }
)

watch(() => props.selectedModal, (newValue, oldValue) => {
    createGraph()
  }
)

watch(partition, (newValue, oldValue) => {
    createGraph()
  }
)

onMounted(() => {
    if (props.selectedModal) {
        createGraph()
    }
})

function createGraph() {
    errorMessage.value = '';
    isLoading.value = true;

    // init data
    const _partition = Number(partition.value);
    const dataLabels = Array(_partition).fill(0).map((_, i) => (i + 1) * (100 / _partition) / 100);
    plotData.value.labels = dataLabels;
    plotData.value.datasets.forEach((datasets: any) => datasets.data = Array(_partition).fill(0));
    normalizedData.value.labels = dataLabels;
    normalizedData.value.datasets.forEach((datasets: any) => datasets.data = Array(_partition).fill(0));

    // init graph
    if (plotGraph.value) plotGraph.value.destroy();
    if (normalizedGraph.value) normalizedGraph.value.destroy();

    const job = data.value[props.activeIndex];
    getLikelihoodResult(job);
}

function getLikelihoodResult(job: any) {
    utils_store.callApi({
        url: `${definitions_store.Definitions.CORE_API.usersUrl()}/projects/${projectId.value}/jobs/${job.job_id}/evaluation_result/likelihood_result?label=${props.selectedModal}&partition=${partition.value}`,
        type: 'get',
        dataType: 'json',
    }, (result: any) => {
        result.likelihood_result.forEach((likelihoodResult: any) => {
            const partitionIndex = likelihoodResult.partition_index;
            const trueCount = likelihoodResult.true_count;
            const falseCount = likelihoodResult.false_count;
            plotData.value.datasets[0].data[partitionIndex] = falseCount;
            plotData.value.datasets[1].data[partitionIndex] = trueCount;

            const totalCount = trueCount + falseCount;
            const truePercentage = (trueCount / totalCount) * 100;
            const falsePercentage = 100 - truePercentage;
            normalizedData.value.datasets[0].data[partitionIndex] = falsePercentage;
            normalizedData.value.datasets[1].data[partitionIndex] = truePercentage;
        });

        plotGraph.value = drawChart(false);
        normalizedGraph.value = drawChart(true);

        errorMessage.value = '';
        isLoading.value = false;
    }, (error: any, status: any, httpErrorThrown: any) => {
        if (error && error.responseJSON && error.responseJSON.error === 'AWS_S3_NOT_FOUND') {
            errorMessage.value = language.NOT_FOUND_GRAPH_DATA;
            isLoading.value = false;
        } else {
            errorMessage.value = language.AN_UNEXPECTED_ERROR_OCCURED;
            isLoading.value = false;
        }
    });
}

function drawChart(isNormalized: boolean) {
    var GRAPH = definitions_store.Definitions.EVALUATION.GRAPH;
    var ctx = document.getElementById(isNormalized ? 'likelihood-normalized-graph' : 'likelihood-graph');
    if(!ctx) {return undefined}
    return new Chart(ctx, {
        type: 'bar',
        data: isNormalized ? normalizedData.value : plotData.value,
        options: {
            animation: false,
            title: {
                display: true,
                text: isNormalized ? 'normalized' : 'plot'
            },
            scales: {
                xAxes: [{
                        stacked: true,
                        categoryPercentage: GRAPH.BAR_CHART_THICKNESS,
                        barPercentage: GRAPH.BAR_PERCENTAGE,
                        gridLines: {
                            display: false
                        }
                }],
                yAxes: [{
                    stacked: true
                }]
            },
            legend: {
                labels: {
                    boxWidth: GRAPH.LABEL.WIDTH,
                    padding: GRAPH.LABEL.PADDING
                },
                display: true
            },
            tooltips:{
                mode: 'x',
                titleFontSize: GRAPH.TOOL_TIP.TITLE_SIZE,
                backgroundColor: GRAPH.TOOL_TIP.BACKGROUND_COLOR,
                borderColor: GRAPH.TOOL_TIP.BORDER_COLOR,
                borderWidth: GRAPH.TOOL_TIP.BORDER_WIDTH,
                cornerRadius: GRAPH.TOOL_TIP.CORNER_RADIUS,
                bodyFontColor: GRAPH.TOOL_TIP.BODY_COLOR,
                displayColors: true,
                intersect: false
            },
            maintainAspectRatio: false,
            responsive: true
        }
    });
}

</script>
<template>
<div style="height:100%;">
    <nnc-loading v-if="isLoading" />
    <template v-if="errorMessage">
        <div>{{errorMessage}}</div>
    </template>
    <template v-else>
        <div style="height:50%;">
            <canvas id="likelihood-graph" />
        </div>
        <div style="height:50%;">
            <canvas id="likelihood-normalized-graph" />
        </div>
        <div style="position: absolute; top: 8px;">
            <span>
                <NncRadio v-model="partition" choice="10" label="10 Partitions" :disabled="false"/>
                <NncRadio v-model="partition" choice="20" label="20 Partitions" :disabled="false"/>
                <NncRadio v-model="partition" choice="50" label="50 Partitions" :disabled="false"/>
            </span>
        </div>
    </template>
</div>
</template>