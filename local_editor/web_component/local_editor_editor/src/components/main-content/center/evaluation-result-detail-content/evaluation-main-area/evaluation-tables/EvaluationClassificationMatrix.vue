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
    rowIndex,
    classification_label,
    classification_filter,
    classification_sort_key,
    classification_sort_type,
    table_type
} = storeToRefs(evaluation_store)

function changePrecisionIfNumber(value: any) {
    // Make the effective figure after the decimal point to 4 digits.
    // if passed value is a number, re-apply Number to strip trailing zeros.
    var number = Number(value);
    return (value && !isNaN(number)) ? Number(number.toFixed(4)) : value;
}

function filterResult(row: any, index: any) {
    if ((index !== 0) && row[0] && row[index]) {
        let condition1 = "";
        let condition2 = "";

        if ((index + 1) === row.length) {
            // otherの場合、同じ列からフィルター対象外とする値を取得する。
            condition1 = toCondition(row[0]);
            condition2 = makeNotCondition(row, index);
        } else if (isNaN(row[index])) {
            condition1 = toCondition(row[0]);
            condition2 = toCondition(row[index]);
        } else {
            return;
        }

        classification_label.value = data.value[active.value].classificationMatrix.selectedModal.split(':')[0];
        classification_filter.value = condition1 + " and " + condition2;
        classification_sort_key.value = "";
        classification_sort_type.value = "";
        table_type.value = "classification_result";
    }
}

function toCondition(value: any) {
    return getKey(value) + " = " + getValue(value);
}

function makeNotCondition(row: any, index: any) {
    let key = getKey(row[index - 4]);
    let exclude_list = [];
    for (let i of [1, 2, 3, 4]) {
        exclude_list.push(getValue(row[index - i]));
    }
    return key + " not in (" + exclude_list + ")";
}

function getKey(value: any) {
    if (value.indexOf("=") !== -1) {
        return value.split("=")[0];
    } else {
        return "y'__1st";
    }
}

function getValue(value: any) {
    if (value.indexOf("=") !== -1) {
        return value.split("=")[1].match(/[^:]*/)[0];
    } else {
        return value.match(/[^:]*/)[0].split("__")[1];
    }
}

</script>
<template>
<table id="datasetTable" class="table table-bordered" style="margin: 0;" v-if="data.length">
    <tbody>
        <tr v-for="(row, row_index) in data[active].classificationMatrix.matrices[data[active].classificationMatrix.selectedModal].slice(0, rowIndex)" v-show="row_index >= rowIndex - 100">
            <td v-for="(column, column_index) in row.slice(0, colIndex)" @click="filterResult(row, column_index)">
                <div>{{ changePrecisionIfNumber(column) }}</div>
            </td>
        </tr>
    </tbody>
</table>
</template>