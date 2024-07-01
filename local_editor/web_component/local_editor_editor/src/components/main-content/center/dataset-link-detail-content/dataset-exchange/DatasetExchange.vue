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
import {useDefinitionsStore} from '@/stores/misc/definitions'
import {useUtilsStore} from '@/stores/utils'
import {useLanguageStore} from '@/stores/misc/languages'
import { storeToRefs } from 'pinia';
import { nextTick, reactive, ref, computed, onMounted } from 'vue';
import DatasetList from './dataset-list/DatasetList.vue'
import DatasetPreview from './DatasetPreview.vue'
const editor_store = useEditorStore()
const definitions_store = useDefinitionsStore()
const dataset_store = useDatasetStore()
const utils_store = useUtilsStore()
const languages_store = useLanguageStore()
const language = reactive(languages_store.language)

const isLoading = ref<boolean>(false)
const previewDataset = ref<any>({
    id: null,
    samples: 0,
    index: null,
})
previewDataset.value.id = null;
previewDataset.value.samples = 0;
previewDataset.value.index = null;
const isDatasetCacheNotFoundError = ref<boolean>(false)
const selectedLabel = ref<string>('')

onMounted(() => {
    $('.dataset-list').resizable({
        handles: "e",
        alsoResizeReverse: '.dataset-preview',
    });
    if (dataset_store.cache.sample.length && dataset_store.cache.user.length === dataset_store.cache.userTotal) {
        return;
    }

    isLoading.value = true;

    const GET_DATASETS_LIMIT = definitions_store.Definitions.DATASET.GET_DATASETS_LIMIT;
    const limit = GET_DATASETS_LIMIT ? String(GET_DATASETS_LIMIT) : '50';
    const getDataset = (isSample?: any) => {
        const $def = $.Deferred();
        let url = `${definitions_store.Definitions.CORE_API.usersUrl()}/datasets?sort_by=-update_datetime&offset=0`;
        if (isSample) {
            url += `&tenant_ids=${definitions_store.Definitions.DATASET.SAMPLE_DATASET_TENANT_ID}`;
        } else {
            url += `&tenant_ids=${editor_store.tenantId}`;
            url += `&limit=${limit}`;
        }

        utils_store.callApi({
            url: url,
            type: 'GET',
            dataType: 'json',
        }, (result: any) => {
            $def.resolve(result);
        }, (error: any) => {
            $def.reject(error);
        });
        return $def.promise();
    };
    Promise.all([
        getDataset(),
        getDataset(true)
    ]).then((response) => {
        dataset_store.cache.user = response[0].datasets;
        dataset_store.cache.sample = response[1].datasets;
        dataset_store.cache.userTotal = response[0].metadata.total;

        if (dataset_store.cache.userTotal > Number(limit)) {
            var _getDatasetForParallel = (offset: any, limit: any) => {
                var $def = $.Deferred();
                utils_store.callApi({
                    url: `${definitions_store.Definitions.CORE_API.usersUrl()}/datasets?sort_by=-update_datetime&tenant_ids=${editor_store.tenantId}&limit=${limit}&offset=${offset}`,
                    type: 'GET',
                    dataType: 'json',
                }, (result: any) => $def.resolve(result), $def.reject);
                return $def.promise();
            };
            const promiseList = [];
            for (let i = Number(limit); i < dataset_store.cache.userTotal; i += Number(limit)) {
                promiseList.push(_getDatasetForParallel(String(i), limit));
            }

            Promise.all(promiseList).then((responses) => {
                responses.forEach((response) => {
                    dataset_store.cache.user = dataset_store.cache.user.concat(response.datasets);
                });
            });
        }
    }, result => {
        // this.filteredDatasets = [];
        isLoading.value = false;
        utils_store.handleXhrFailure(result);
    }).finally(() => { isLoading.value = false; });
})

function selectOptionLabels() {
    const selectOptionLabels: any = [];
    selectOptionLabels.push(language.dataset.ALL);
    const tenantList = editor_store.tenantList;
    const tenant = tenantList.find((tenant: any) => tenant.tenant_id === editor_store.tenantId);
    let isLocal = false;
    if (tenant) {
        isLocal = tenant.purpose === 'private';
    }
    filteredDatasets.value.forEach((dataset: any) => {
        if (selectOptionLabels.indexOf(dataset.owner_user_id) === -1 && !isLocal && dataset.tenant_id !== definitions_store.Definitions.DATASET.SAMPLE_DATASET_TENANT_ID) {
            selectOptionLabels.push(dataset.owner_user_id);
        }
    })
    filteredDatasets.value.forEach((dataset: any) => {
        dataset.labels.forEach((label: any) => {
            if (selectOptionLabels.indexOf(label) === -1) {
                selectOptionLabels.push(label);
            }
        });
    });
    return selectOptionLabels;
}

const features = computed((index) => {
    const convertedFeatures: any = [];
    const features = (filteredDatasets.value[previewDataset.value.index] || {}).features;
    if (features) {
        features.forEach((feat: any) => {
            if (feat.type === 'Array of image' || feat.type === 'Vector') {
                // vectorの場合shapeを表示しないため不要
                const count = feat.shape[0];
                const copiedFeat = JSON.parse(JSON.stringify(feat));
                copiedFeat.shape.shift();
                for (let i = 1; i <= count; i++) {
                    convertedFeatures.push(copiedFeat);
                }
            } else {
                convertedFeatures.push(feat);
            }
        });
        return convertedFeatures;
    }
})

const filteredDatasets = computed(() => {
    const _datasets = dataset_store.cache.user.concat(dataset_store.cache.sample);
    return _datasets.filter((dataset: any) => dataset.status === 'completed').map((dataset: any) => {
        return {
            id: dataset.dataset_id,
            original_name: dataset.dataset_name,
            data_source: dataset.datasource,
            file_location: dataset.local_filepath,
            samples: dataset.data_num,
            columns: dataset.column_num,
            tenant_id: dataset.tenant_id,
            update_datetime: dataset.update_datetime,
            csv_header: dataset.csv_header,
            linked: (dataset_store.data.find((_dataset: any) => _dataset.id === dataset.dataset_id) !== undefined),
            labels: dataset.labels,
            owner_user_id: dataset.owner_user_id,
            features: dataset.features,
            description: dataset.description
        };
    });
})

function setPreviewDataset(dataset: any) {
    previewDataset.value.id = dataset.id;
    previewDataset.value.samples = dataset.samples;
    previewDataset.value.index = filteredDatasets.value.findIndex((_dataset: any) => _dataset.id === dataset.id);
}

</script>
<template>
    <div class="height-max position-relative">
        <DatasetList
            :datasets="filteredDatasets" :is-loading="isLoading"
            :selectOptionLabels="selectOptionLabels()"
            @set-preview-dataset="setPreviewDataset"
        />
        <DatasetPreview 
            :preview-dataset="previewDataset" 
            :features="features"
            :is-dataset-cache-not-found-error="false"
        />
    </div>
</template>