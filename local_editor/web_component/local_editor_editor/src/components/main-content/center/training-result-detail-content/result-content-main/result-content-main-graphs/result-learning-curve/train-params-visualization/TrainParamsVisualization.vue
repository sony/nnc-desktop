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
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import {useLanguageStore} from '@/stores/misc/languages'
import {useResultStore} from '@/stores/result'
import {useEditorStore} from '@/stores/editor'
import {useUtilsStore} from '@/stores/utils'
import {useDefinitionsStore} from '@/stores/misc/definitions'
import NncLoading from '@/components/shared-components/NncLoading.vue'
import NncRadio from '@/components/shared-components/NncRadio.vue'
import TrainParamsCanvas from './TrainParamsCanvas.vue'
const languages_store = useLanguageStore()
const result_store = useResultStore()
const definitions_store = useDefinitionsStore()
const editor_store = useEditorStore()
const utils_store = useUtilsStore()
const language = reactive(languages_store.language)
const props = defineProps<{
    zoomInfo: any,
}>()
const {selectedLayer} = storeToRefs(result_store)
const isLargeWeight = ref<boolean>(false)
const params = ref<any>([])
const type = ref<string>('Normalize')
const gainValue = ref<number>(20)
const maxValue = ref<number>(0)

const layerName = computed(() => {
    return selectedLayer.value.name;
})

onMounted(() => {
    utils_store.callApi({
        url: definitions_store.Definitions.CORE_API.usersUrl() + '/projects/' + editor_store.projectId + '/jobs/' + result_store.getActiveResult().job_id + '/train_result/param?file_name=' + selectedLayer.value.request,
        type: 'get',
        dataType: 'json',
    }, (result: any) => {
        if (result.download_url) {
            utils_store.callApi({
                url: result.download_url,
                type: 'get',
                headers: null,
                xhrFields: { withCredentials: false },
            }, (text: any) => {
                var convertedParams = convertTrainParams(text);
                params.value = convertedParams.array;
                maxValue.value = convertedParams.maxValue;
                isLargeWeight.value = convertedParams.isLargeWeight;
            });
        } else {
            editor_store.popup(language.ERROR, language.NOT_FOUND_PARAMETER, [{name: 'OK', action: () => {
                result_store.initSelectedLayer();
            }},]);
        }
    }, (error: any) => {
        editor_store.popup(language.ERROR, language.NOT_FOUND_PARAMETER, [{name: 'OK', action: () => {
            result_store.initSelectedLayer();
        }},]);
    }, () => {
    });
})

const parsedGainValue = computed(() => {
    const gainRanges = ['0.01', '0.01', '0.02', '0.02', '0.03', '0.03', '0.04', '0.05', '0.06', '0.08', '0.10', '0.13', '0.16', '0.20', '0.25', '0.32', '0.40', '0.50', '0.63', '0.79', '1.00', '1.26', '1.58', '2.00', '2.51', '3.16', '3.98', '5.01', '6.31', '7.94', '10.00', '12.59', '15.85', '19.95', '25.12', '31.62', '39.81', '50.12', '63.10', '79.43', '100.00'];
    return gainRanges[gainValue.value];
})

function onChangeType(value: any) {
    type.value = value;
}

function onChangeValue(e: any) {
    gainValue.value = e.target.value;
}

function convertTrainParams(params: any) {
    var xNum = 1;
    var yNum = 1;
    var rows = 1;
    var colums = 1;
    var maxValue = 0;
    var array: any = [];
    var splitedParams = params.replace(/\r\n/g, '\n').split('\n');
    var firstLine = splitedParams[0];
    var parsedLine = firstLine.replace(/[\(\)]/g, '').split(',');
    if (parsedLine.length === 2) {
      colums = Number(parsedLine[0]);
      rows = Number(parsedLine[1]);
    } else {
      // 逆さにするときは、0, 1を反対にすればよい。
      xNum = Number(parsedLine[0]);
      yNum = Number(parsedLine[1]);
      rows = Number(parsedLine[2]);
      colums = Number(parsedLine[3]);
    }

    array = new Array(yNum).fill(0);
    for (let y = 0; y < yNum; y++) {
      array[y] = new Array(xNum).fill(0);
      for (let x = 0; x < xNum; x++) {
        array[y][x] = new Array(rows).fill(0);
        for (let row = 0; row < rows; row++) {
          array[y][x][row] = new Array(colums).fill(0);
        }
      }
    }
    // 先頭行はループの対象にしたくないので削除
    splitedParams.shift();
    splitedParams.forEach((line: any, i: any) => {
      const lineNum = Number(line);
      if (maxValue < Math.abs(lineNum)) {
        maxValue = Math.abs(lineNum);
      }

      if (parsedLine.length === 2) {
        var row = i % rows;
        var col = Math.floor(i / rows);
        array[0][0][row][col] = lineNum;
      } else {
        var filterNum = rows * colums;
        var outRow = Math.floor(i / (filterNum * xNum));
        var outCol = Math.floor(i / filterNum) % xNum;

        var row = Math.floor(i / colums) % rows;
        var col = i % colums;

        array[outRow][outCol][row][col] = lineNum;
      }
    });
    return {array, maxValue, isLargeWeight: (colums > definitions_store.Definitions.TRAINING.VISUALIZATION.MAX_WEIGHT || rows > definitions_store.Definitions.TRAINING.VISUALIZATION.MAX_WEIGHT)};
}

</script>
<template>
    <div class="train-params-visualization-area">
        <div v-if="!params.length">
            <NncLoading />
        </div>
        <div v-else id="params-visualization-area">
            <div class="header">
                <div>{{ layerName }} -> Weight</div>
                <div class="type">
                    <NncRadio :modelValue="type" @input="onChangeType" choice="Normalize" label="Normalize" :disabled="false"/>
                    <NncRadio :modelValue="type" @input="onChangeType" choice="Gain"      label="Gain" :disabled="false"/>
                    <div id="gain_range_area">
                        <span id="gain_range_bar" />
                        <input type="range" min="0" max="40" step="1" :value="gainValue" @input="onChangeValue" />
                    </div>
                    <div class="value">{{ parsedGainValue }} x</div>
                </div>
            </div>
            <div class="plot">
                <div v-for="param in params">
                    <TrainParamsCanvas v-for="targetParam in param" :param="targetParam" :gainValue="Number(parsedGainValue)" :type="type" :maxValue="maxValue" :zoom="zoomInfo.percentage / 100" />
                </div>
                <div v-if="isLargeWeight" class="note">
                    * For large weights, up to 1,024 weights are displayed in each width and height.
                </div>
            </div>
        </div>
    </div>
</template>