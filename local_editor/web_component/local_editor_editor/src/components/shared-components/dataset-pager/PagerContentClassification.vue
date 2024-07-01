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
import {useEditorStore} from '@/stores/editor'
import {useDatasetStore} from '@/stores/dataset'
import {useLanguageStore} from '@/stores/misc/languages'
import {useDefinitionsStore} from '@/stores/misc/definitions'
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue';
import NncLoading from '@/components/shared-components/NncLoading.vue'
const editor_store = useEditorStore()
const dataset_store = useDatasetStore()
const definitions_store = useDefinitionsStore()
const languages_store = useLanguageStore()
const language = reactive(languages_store.language)
const props = defineProps<{
    offset: number, 
    getData: Function, 
    total: number, 
    index: number, 
    isCopying: boolean, 
    filter: string, 
    sortKey: string, 
    sortType: string, 
    label: string, 
    isInit: boolean
}>()
const emit = defineEmits([
    'total', 
    'first',
    'sort_key',
    'sort_type',
    'reset_condition'
])
const header = ref<any>([])
const table = ref<any>([])
const showLoading = ref<boolean>(true)
const sortable = ref<any>([])
const errorMessage = ref<string>('')

onMounted(() => {
    getTableData();
})

watch(() => props.index, (newValue, oldValue) => {
    getTableData()
  }
)

watch(() => props.offset, (newValue, oldValue) => {
    getTableData()
  }
)

watch(() => props.filter, (newValue, oldValue) => {
    getTableData()
  }
)

watch(() => props.sortKey, (newValue, oldValue) => {
    getTableData()
  }
)

watch(() => props.sortType, (newValue, oldValue) => {
    getTableData()
  }
)

watch(() => props.label, (newValue, oldValue) => {
    getTableData()
  }
)

watch(() => props.isInit, (newValue, oldValue) => {
    getTableData()
  }
)

function getTableData() {
    props.getData({
        update: function(header_update: any, table_update: any, total_update: any, sortable_update: any) {
            header.value = header_update;
            table.value = table_update;
            showLoading.value = true;
            emit('total', total_update);
            sortable.value = sortable_update;
        },
        clear: function() {
            if (table.value.length !== 0) { // skip change to avoid infinite update loop.
                // XXX instead of assign 0 to Array's length directly, use splice to notify Vue change.
                // Please refer https://vuejs.org/v2/guide/list.html#Caveats for more details.
                table.value.splice(0, table.value.length);
                showLoading.value = true;
            }
        },
        showLoading: function() {
            showLoading.value = true;
        },
        hideLoading: function() {
            showLoading.value = false;
        },
        showError: function(errorMessageIn: any) {
            showLoading.value = false;
            errorMessage.value = errorMessageIn;
        },
        hideError: function() {
            errorMessage.value = '';
        }
    });
}

function sortableColumn(column_index: any) {
    return sortable.value[column_index];
}

function sortResult(column: any) {
    if (column === props.sortKey) {
        emit('sort_key', column);
        emit('sort_type', props.sortType === 'asc' ? 'desc' : 'asc');
    } else {
        emit('sort_key', column);
        emit('sort_type', 'asc');
    }
}

function resetCondition() {
    emit('reset_condition');
}
</script>
<template>
    <div id="datasetContents" class="pager-content">
        <div class="table-wrapper">
            <div v-if="errorMessage">{{errorMessage}}</div>
            <div class="table-condition" v-if="table.length > 0">
                <span class="reset-condition-button" :class="(filter || sortKey) ? 'nnc-enabled' : 'nnc-disabled'" @click="resetCondition">Reset Condition</span>
                <span v-if="filter" class="result-filter">filtered by: {{ filter }}</span>
            </div>
            <table class="table table-bordered" v-if="table.length > 0">
                <thead>
                    <tr>
                        <th>Index</th>
                        <th v-for="(column, column_index) in header" :class="sortableColumn(column_index) ? 'sortable-column' : ''"
                            @click="sortableColumn(column_index) && sortResult(column)">
                            <span>{{ column }}</span>
                            <span v-if="column === sortKey && sortType === 'asc'">
                                <img src="@/assets/image/SortArrowUp-blue.svg" class="sort-image" />
                            </span>
                            <span v-else-if="column === sortKey && sortType === 'desc'">
                                <img src="@/assets/image/SortArrowDown-blue.svg" class="sort-image" />
                            </span>
                            <span v-else-if="sortable[column_index]">
                                <img src="@/assets/image/SortArrowUp-gray.svg" class="sort-image" />
                            </span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(row, row_index) in table">
                        <td>{{ offset + row_index + 1 }}</td>
                        <td v-for="(column, column_index) in row">
                            <div v-if="column.type==='text/plain'">{{ column.data }}</div>
                            <div v-else>
                                <div>{{ column.path }}</div>
                                <img :src="column.data" class="data-table-image" />
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <NncLoading v-else-if="showLoading" />
            <div v-else-if="isCopying" class="message">Evaluation results will be displayed after saving.\nPlease try again later.</div>
        </div>
    </div>
</template>