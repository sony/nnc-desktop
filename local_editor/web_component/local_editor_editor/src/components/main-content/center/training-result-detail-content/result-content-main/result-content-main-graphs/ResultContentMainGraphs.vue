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
import { computed, reactive, ref } from 'vue';
import {useLanguageStore} from '@/stores/misc/languages'
import {useEditorStore} from '@/stores/editor'
import {useResultStore} from '@/stores/result'
import {useUtilsStore} from '@/stores/utils'
import { useBaseGraphStore } from '@/stores/training_graph/base_graph'
import JobCostAndErrors from '@/objects/JobCostAndErrors'
import {useDefinitionsStore} from '@/stores/misc/definitions'
import ContextMenu from'@/components/shared-components/context-menu/ContextMenu.vue'
import ResultLearningCurve from './result-learning-curve/ResultLearningCurve.vue'
import { storeToRefs } from 'pinia';
const definitions_store = useDefinitionsStore()
const editor_store = useEditorStore()
const base_graph_store = useBaseGraphStore()
const result_store = useResultStore()
const utils_store = useUtilsStore()
const languages_store = useLanguageStore()
const language = reactive(languages_store.language)
const emit = defineEmits([
    'zoomValue', 
])
const props = defineProps<{
    currentGraph: any, 
}>()
const {graph, data} = storeToRefs(result_store)
const context_menu = ref<any>(null)
const result_content_main_graphs_root = ref<any>(null)
const menu_items = computed(() => {
    return [
        { type: 'submenu', text: language.training.graphContextMenu.VIEW, submenu: [
            { type: 'action', text: definitions_store.Definitions.CONTEXT.TRAINING_AND_VALIDATION, action: show_training_validation },
            { type: 'action', text: definitions_store.Definitions.CONTEXT.TRAINING, action: show_training },
            { type: 'action', text: definitions_store.Definitions.CONTEXT.VALIDATION, action: show_validation }
        ]},
        { type: 'action', text: definitions_store.Definitions.CONTEXT.LOG_SCALE_GRAPH, action: change_scale },
        { type: 'submenu', text: language.training.graphContextMenu.ZOOM, submenu: [
            { type: 'action', text: language.training.graphContextMenu.ZOOM_DEFAULT, action: () => emit('zoomValue', 100) },
            { type: 'action', text: language.training.graphContextMenu.ZOOM_IN, action: () => emit('zoomValue', values.value.next), disabled: !values.value.canMoveNext, },
            { type: 'action', text: language.training.graphContextMenu.ZOOM_OUT, action: () => emit('zoomValue', values.value.prev), disabled: !values.value.canMovePrev, }
        ]},
        { type: 'separator' },
        { type: 'action', text: language.training.graphContextMenu.SAVE_CSV, action: save_as_csv },
    ];
})

const values = computed(() => {
    return utils_store.indexOperator(props.currentGraph.percentages, props.currentGraph.percentage); 
})

function open_menu(event: Event) {
    event.preventDefault();
    context_menu.value.open_menu({ 'parent': result_content_main_graphs_root.value, 'event': event });
}

function show_training_validation() {
    graph.value.show_training_error = true;
    graph.value.show_validation_error = true;
    base_graph_store.reloadChart()
}

function show_training() {
    graph.value.show_training_error = true;
    graph.value.show_validation_error = false;
    base_graph_store.reloadChart()
}

function show_validation() {
    graph.value.show_training_error = false;
    graph.value.show_validation_error = true;
    base_graph_store.reloadChart()
}

function change_scale() {
    graph.value.scale = graph.value.scale === 'linear' ? 'log' : 'linear';
    base_graph_store.reloadChart()
}

function save_as_csv() {
    var content = '';
    var a = document.createElement('a');
    if(graph.value.type === "Learning Curve") {
        var active_result = result_store.getActiveResult();
        a.download = active_result.job_name + "_" + graph.value.type + ".csv";
        content += "epoch,cost,train_error,valid_error\n";
        var training_errors = active_result.training_errors;
        var validation_errors = active_result.validation_errors;
        active_result.costs.forEach((cost: any, index: any) => {
            content += [
                (index + 1).toString(),
                cost,
                training_errors[index] !== undefined ? training_errors[index] : '',
                validation_errors[index] !== undefined ? validation_errors[index] : '',
            ].join(',') + '\n';
        });
    } else {
        a.download = graph.value.type + ".csv";
        content += "idx,name,terr,verr,pareto,Output,CostParameter,CostAdd,CostMultiply,CostMultiplyAdd,CostDivision,CostExp,CostIf\n";
        data.value.forEach((job: any, index: any) => {
            const stat = job.train_status || {};
            const costAndErrors = new JobCostAndErrors(job, graph.value.cost_type);
            content += [
                index.toString(),
                job.job_name,
                costAndErrors.training(''),
                costAndErrors.validationBest(''),
                (job.pareto_optimal ? 1 : 0).toString(),
                costAndErrors.output(''),
                costAndErrors.costParameter(''),
                costAndErrors.costAdd(''),
                costAndErrors.costMultiply(''),
                costAndErrors.costMultiplyAdd(''),
                costAndErrors.costDivision(''),
                costAndErrors.costExp(''),
                costAndErrors.costIf('')
            ].join(',') + '\n';
        });
    }
    var blob = new Blob([content], {"type": "text/csv"});
    var blobURL = window.URL.createObjectURL(blob);
    a.href = blobURL;
    a.click();
}

</script>
<template>
    <div ref="result_content_main_graphs_root" class="result-content-main-graphs">
        <div @contextmenu="open_menu($event)" class="result-content-main-graphs-contextmenu-area">
            <ResultLearningCurve :zoom-info="currentGraph" />
            <ContextMenu ref="context_menu" :menuItems="menu_items" :is-sub="false"/>
        </div>
    </div>
</template>