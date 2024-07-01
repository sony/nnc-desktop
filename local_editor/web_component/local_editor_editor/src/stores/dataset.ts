/* Copyright 2024 Sony Group Corporation. */
/**
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
*/

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import {useUtilsStore} from './utils'
import {useLanguageStore} from './misc/languages'
import {useDefinitionsStore} from './misc/definitions'
import {useEditorStore} from './editor'

export const useDatasetStore = defineStore('dataset', () => {
  const utils_store = useUtilsStore()
  const lang_store = useLanguageStore()
  const definitions_store = useDefinitionsStore()
  const editor_store = useEditorStore()

  const cache = ref<any>({
    sample: [],
    user: [],
    userTotal: 0
  })
  const data = ref<any>([])
  const active = ref<any>({
    index: 0
  })
  const visibleLinkingDataset = ref<boolean>(false)

  function update_data(main_dataset_name: string, datasets: any[]) {
    data.value.splice(0, data.value.length);
    datasets.forEach((dataset, index) => {
        if(index === 0) {
            dataset.active = true; // 先頭データセットをactiveにする
        } else {
            dataset.active = false;
        }
        dataset.is_main = main_dataset_name == dataset.name;

        if (dataset.id) {
            utils_store.callApi({
                url: definitions_store.Definitions.CORE_API.usersUrl() + "/datasets/" + dataset.id + "?row=0&numrows=1&column=0&numcolumns=1",
                type: 'GET',
                dataType: 'json',
            }, undefined,
            (error: any, status: any, httpErrorThrown: any) => {
                if ((error.responseJSON || {}).error === 'NNCD_BAD_DATASET_ID') {
                    Object.assign(dataset, {
                        id: '',
                        tenant_id: '',
                        original_name: '',
                        samples: 0,
                        columns: 0,
                        header: [],
                        contents: [],
                    });
                } else {
                  utils_store.handleXhrFailure(error, status, httpErrorThrown);
                }
            });
        }
        data.value.push(dataset);
    });
  }

  function serialize_data() {
    let datasets = data.value.map((dataset: any) => {
      var _dataset = Object.assign({}, dataset);
      delete _dataset.active;
      delete _dataset.is_main;
      return _dataset;
    })
    let main_dataset_name = data.value.length > 0 ? data.value.find((dataset: any) => dataset.is_main).name : ""
    return {
        datasets: datasets,
        main_dataset_name: main_dataset_name
    }
  }

  function getOriginalFile(original: any, currentRow: any, currentColumn: any, datasetId: any) {
    if(!original) {
        return;
    }
    utils_store.callApi({
        url: definitions_store.Definitions.CORE_API.usersUrl() + "/datasets/" + datasetId + "/original?row=" + currentRow + "&column=" + currentColumn,
        type: 'GET',
        dataType: 'json',
    }, (result: any) => {
        const anchor = document.createElement('a');
        anchor.href = result.download_url;
        anchor.target = '_blank';
        anchor.click();
    },
    (error: any, status: any, httpErrorThrown: any) => {
        if ((error.responseJSON || {}).error === 'NNCD_ORIGINAL_FILE_NOT_FOUND') {
            const message = lang_store.language.YOU_CAN_NOT_DOWNLOAD;
            const title = lang_store.language.NOTICE;
            editor_store.popup(title, message, [{name: 'OK',},]);
        } else {
          utils_store.handleXhrFailure(error, status, httpErrorThrown);
        }
    });
  }

  return { 
    data,
    active,
    cache,
    visibleLinkingDataset,
    serialize_data,
    getOriginalFile,
    update_data
  }
})
