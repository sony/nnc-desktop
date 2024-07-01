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
const definitions_store = useDefinitionsStore()
const evaluation_store = useEvaluationStore()
const result_store = useResultStore()
const {
    data,
    active,
    graph
} = storeToRefs(result_store)
const {
    colIndex,
    rowIndex
} = storeToRefs(evaluation_store)

function changePrecisionIfNumber(value: any) {
    // Make the effective figure after the decimal point to 4 digits.
    // if passed value is a number, re-apply Number to strip trailing zeros.
    var number = Number(value);
    return (value && !isNaN(number)) ? Number(number.toFixed(4)) : value;
}

</script>
<template>
<table id="datasetTable" class="table table-bordered" style="margin: 0;" v-if="data.length">
    <tbody>
        <tr v-for="(row, row_index) in data[active].confusionMatrix.matrices[data[active].confusionMatrix.selectedModal].slice(0, rowIndex)" v-show="row_index >= rowIndex - 100">
            <td v-for="(column, column_index) in row.slice(0, colIndex)">
                <div>{{ changePrecisionIfNumber(column) }}</div>
            </td>
        </tr>
    </tbody>
</table>
</template>