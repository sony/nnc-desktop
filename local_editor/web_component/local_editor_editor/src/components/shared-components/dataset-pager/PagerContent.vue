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
import ContextMenu from '@/components/shared-components/context-menu/ContextMenu.vue'
const editor_store = useEditorStore()
const dataset_store = useDatasetStore()
const definitions_store = useDefinitionsStore()
const languages_store = useLanguageStore()
const language = reactive(languages_store.language)
const props = defineProps<{
    offset: number, 
    getData: Function, 
    getNextColumnData: Function,
    total: number, 
    showLimitWarningOnControl: boolean,
    index: number, 
    isCopying: boolean, 
    isDatasetCacheNotFoundError: boolean,
    isInit: boolean,
    features: Object,
    menuItems: Object,
}>()
const emit = defineEmits([
    'updateSelectedIndex', 
    'first',
    'get-original-file'
])
const header = ref<any>([])
const table = ref<any>([])
const showLoading = ref<boolean>(true)
const maxColumn = ref<number>(0)
const minColumn = ref<number>(0)
const isUnavailableScroll = ref<boolean>(false)
const isCalledGetTableData = ref<boolean>(false)
const context_menu = ref<any>(null)
const pager_content_root = ref<any>(null)

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

watch(() => props.isInit, (newValue, oldValue) => {
    getTableData()
  }
)

function open_menu(event: any, rowIndex: any, colIndex: any) {
    event.preventDefault();
    if (!props.menuItems) {
        return;
    }
    emit('updateSelectedIndex', {
        x: rowIndex + props.offset,
        y: colIndex,
        // 表示上はindexに1を足したものになる
        name: (rowIndex + props.offset + 1) + ' - ' + header.value[colIndex],
    });
    context_menu.value.open_menu({ 'parent': pager_content_root.value, 'event': event });
}

function getTableData() {
    if (isCalledGetTableData.value) {
        return;
    }
    isCalledGetTableData.value = true;
    setTimeout(() => {
        isCalledGetTableData.value = false;
    }, 50);
    const SHOW_MAX_COLUMN = definitions_store.Definitions.DATASET.SHOW_MAX_COLUMN;
    props.getData({
        update: function(_header: any, _table: any, _maxColumn: any) {
            header.value = _header;
            table.value = _table;
            maxColumn.value = _maxColumn;
            minColumn.value = _maxColumn >= SHOW_MAX_COLUMN ? _maxColumn - SHOW_MAX_COLUMN : 0;
            showLoading.value = false;
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
    });
}

function onscroll(e: any) {
    const columnLength = header.value.length;

    if (e.target.scrollWidth <= e.target.offsetWidth) {
        // 表示切り替えなどでローディングが表示されると、スクロールバーがなくなり、
        // その際にスクロールイベントが走る為、無視する対応
        return;
    }

    if ((e.target.scrollLeft + e.target.offsetWidth) >= e.target.scrollWidth && !isUnavailableScroll.value) {
        if (maxColumn.value >= columnLength) {
            return;
        }
        isUnavailableScroll.value = true;
        showLoading.value = true;
        const SHOW_MAX_COLUMN = definitions_store.Definitions.DATASET.SHOW_MAX_COLUMN;
        const GET_COLUMN_INTERVAL = definitions_store.Definitions.DATASET.GET_COLUMN_INTERVAL;
        props.getNextColumnData({
            update: function(additionalTable: any, _maxColumn: any) {
                table.value = table.value.map((tab: any, i: any) => {
                    return tab.concat(additionalTable[i]);
                });
                maxColumn.value = _maxColumn;
                nextTick(() => {
                    // 追加カラムのサイズ
                    const remainScroll = e.target.scrollWidth - (e.target.scrollLeft + e.target.offsetWidth);

                    minColumn.value = _maxColumn >= SHOW_MAX_COLUMN ? _maxColumn - SHOW_MAX_COLUMN : 0;
                    table.value.forEach((tab: any, i: any) => {
                        tab.splice(0, GET_COLUMN_INTERVAL);
                    });

                    nextTick(() => {
                        e.target.scrollLeft -= remainScroll;
                        isUnavailableScroll.value = false;
                        showLoading.value = false;
                    });
                });
            },
            clear: function() {
                isUnavailableScroll.value = false;
                showLoading.value = false;
            }
        }, maxColumn.value);
    } else if ((e.target.scrollLeft === 0) && !isUnavailableScroll.value) {
        if (minColumn.value === 0) {
            return;
        }
        isUnavailableScroll.value = true;
        showLoading.value = true;
        const SHOW_MAX_COLUMN = definitions_store.Definitions.DATASET.SHOW_MAX_COLUMN;
        const GET_COLUMN_INTERVAL = definitions_store.Definitions.DATASET.GET_COLUMN_INTERVAL;
        props.getNextColumnData({
            update: function(additionalTable: any, _maxColumn: any) {
                table.value = table.value.map((tab: any, i: any) => {
                    return additionalTable[i].concat(tab);
                });
                const _minColumn = _maxColumn - GET_COLUMN_INTERVAL;
                minColumn.value = _minColumn;
                maxColumn.value = _minColumn + SHOW_MAX_COLUMN;
                nextTick(() => {
                    const indexOffsetLeft = $('#index-column')[0].offsetLeft;
                    const indexWidth: any = $('#index-column').width();
                    const dataLeft = $('#data_' + GET_COLUMN_INTERVAL)[0].offsetLeft - indexOffsetLeft - indexWidth - 1;
                    table.value.forEach((tab: any) => {
                        tab.splice(SHOW_MAX_COLUMN, GET_COLUMN_INTERVAL);
                    });
                    nextTick(() => {
                        e.target.scrollLeft += (dataLeft - indexOffsetLeft);
                        isUnavailableScroll.value = false;
                        showLoading.value = false;
                    });
                });
            },
            clear: function() {
                isUnavailableScroll.value = false;
                showLoading.value = false;
            }
        }, minColumn.value - GET_COLUMN_INTERVAL);
    }
}

function convertToShape(features: any, index: any) {
    if (features && features[index] && features[index].shape) {
        return features[index].shape.join(',');
    }
    return '';
}

</script>
<template>
    <div ref="pager_content_root" id="datasetContents" class="pager-content">
        <div class="table-wrapper" @scroll="onscroll">
            <table class="table table-bordered" v-if="table.length > 0 && !isDatasetCacheNotFoundError">
                <thead>
                    <tr>
                        <th id="index-column" class="index-column">Index</th>
                        <th v-for="(column, i) in header.slice(minColumn, maxColumn)" :id="'data_' + i">{{ column }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(row, row_index) in table">
                        <td class="number-line">{{ offset + row_index + 1 }}</td>
                        <td v-for="(column, column_index) in row" :class="column.original ? 'original' : ''" @click="emit('get-original-file', {original: column.original, row: offset + row_index, column: column_index})" @contextmenu="open_menu($event, row_index, column_index)">
                            <div v-if="column.type==='text/plain'">{{ column.data }}</div>
                            <div v-else class="img-shape">
                                <div>{{ column.path }}</div>
                                <span class="shape">{{convertToShape(features, column_index)}}</span>
                                <img v-bind:src="'data:' + column.type + ';base64,' + column.data" class="data-table-image" />
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <span v-else-if="isDatasetCacheNotFoundError">Some pieces of data for preview are preparing.<br>Please try again later.</span>
            <div v-else-if="isCopying" class="message">Evaluation results will be displayed after saving.\nPlease try again later.</div>
            <NncLoading v-if="showLoading" />
        </div>
        <ContextMenu 
            ref="context_menu" 
            :menuItems="menuItems" 
            :isSub="false"
        />
    </div>
</template>