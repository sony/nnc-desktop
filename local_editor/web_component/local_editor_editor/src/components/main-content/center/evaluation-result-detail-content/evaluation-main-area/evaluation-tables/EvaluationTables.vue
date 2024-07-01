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
import { computed, ref } from 'vue';
import {useEvaluationStore} from '@/stores/evaluation'
import {useDefinitionsStore} from '@/stores/misc/definitions'
import {useResultStore} from '@/stores/result'
import ContextMenu from'@/components/shared-components/context-menu/ContextMenu.vue'
import EvaluationConfusionMatrix from './EvaluationConfusionMatrix.vue'
import EvaluationClassificationMatrix from './EvaluationClassificationMatrix.vue'
import EvaluationLikelihoodGraph from './EvaluationLikelihoodGraph.vue'
import EvaluationOthers from './EvaluationOthers.vue'
const evaluation_store = useEvaluationStore()
const definitions_store = useDefinitionsStore()
const result_store = useResultStore()
const {
    data,
    active,
    graph
} = storeToRefs(result_store)
const {
    table_type,
    classification_label,
    rowIndex,
    colIndex
} = storeToRefs(evaluation_store)
const menu_items = ref<any>([
    { type: 'action', text: 'Save CSV as...', action: save_as_csv }
])
const context_menu = ref<any>(null)
const evaluation_tables_root = ref<any>(null)


const currentJob = computed(() => { 
    return data.value[active.value] || {}; 
})

function onscroll(e: any) {
    const confusionMatrixes = data.value[active.value].confusionMatrix.matrices[data.value[active.value].confusionMatrix.selectedModal];

    if ((e.target.scrollTop + e.target.offsetHeight) >= e.target.scrollHeight) {
        const rowLength = confusionMatrixes.length;
        if (rowLength > rowIndex.value) {
            rowIndex.value += definitions_store.Definitions.CONFUSION_MATRIX.ROW.INCREASE_AMOUNT_PER_SCROLL;
        }
    } else if (e.target.scrollTop === 0) {
        if (rowIndex.value > definitions_store.Definitions.CONFUSION_MATRIX.ROW.DEFAULT_NUMBER_OF_DISPLAY) {
            e.target.scrollTop = 10;
            rowIndex.value -= definitions_store.Definitions.CONFUSION_MATRIX.ROW.INCREASE_AMOUNT_PER_SCROLL;
        }
    }

    if ((e.target.scrollLeft + e.target.offsetWidth) >= e.target.scrollWidth) {
        const colLength = confusionMatrixes[0].length;
        if (colLength > colIndex.value) {
            colIndex.value += definitions_store.Definitions.CONFUSION_MATRIX.COLUMN.INCREASE_AMOUNT_PER_SCROLL;
        }
    }
    // 横の表示も100件限定としたいが上手くうごかない為、現時点では全表示とする
    // } else if (e.target.scrollLeft === 0) {
        // if (EvaluationTab.colIndex > definitions_store.Definitions.CONFUSION_MATRIX.COLUMN.DEFAULT_NUMBER_OF_DISPLAY) {
        //     e.target.scrollLeft = 10;
        //     EvaluationTab.colIndex -= definitions_store.Definitions.CONFUSION_MATRIX.COLUMN.INCREASE_AMOUNT_PER_SCROLL;
        // }
    // }
}

function open_menu(result: any, event: any) {
    event.preventDefault();
    context_menu.value.open_menu({ 'parent': evaluation_tables_root.value, 'event': event });
}

function save_as_csv() {
    var content = '';
    var a = document.createElement('a');
    if(table_type.value == "output_result") {
        a.download = "ouput_result.csv";
    } else {
        a.download = `${data.value[active.value].job_name}_Confusion_Matrixes.csv`;
        var confusionMatrixes = data.value[active.value].confusionMatrix.matrices[data.value[active.value].confusionMatrix.selectedModal];
        confusionMatrixes.forEach((row: any) => {
            row.forEach((column: any, index: any) => {
                content += column;
                if(row.length-1 != index) content += ", ";
            });
            content += "\n";
        });
    }
    var blob = new Blob([content], {"type": "text/csv"});
    var blobURL = window.URL.createObjectURL(blob);
    a.href = blobURL;
    a.click();
}

</script>
<template>
<div ref="evaluation_tables_root" class="evaluation-content-main-table scrollbar-macosx">
    <div class="confusion-matrix-content" v-if="data[active] && data[active].confusionMatrix.matrices" @contextmenu="open_menu('', $event)" @scroll="onscroll" v-show="table_type == 'confusion_matrix'">
        <EvaluationConfusionMatrix />
        <ContextMenu ref="context_menu" :menuItems="menu_items" :is-sub="false"/>
    </div>
    <div class="confusion-matrix-content" v-if="data[active] && data[active].classificationMatrix.matrices" v-show="table_type == 'classification_matrix'">
        <EvaluationClassificationMatrix />
    </div>
    <div class="confusion-matrix-content" v-show="data[active] && data[active].confusionMatrix.matrices && data[active].classificationResult && classification_label && table_type == 'likelihood_graph'">
        <EvaluationLikelihoodGraph :active-index="active" :selected-modal="classification_label" />
    </div>
    <div class="confusion-matrix-content" v-if="data[active] && table_type == 'others'">
        <EvaluationOthers
            :selectedPluginIdAndName="currentJob.selectedPluginIdAndName"
            :pluginResults="currentJob.pluginResults"
        />
    </div>
</div>
</template>