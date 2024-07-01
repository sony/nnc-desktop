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

import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'
import {useResultStore} from './result'
import {useEditorStore} from './editor'
import {useUtilsStore} from './utils'
import {useDatasetStore} from './dataset'
import {useDefinitionsStore} from './misc/definitions'
import { useLanguageStore } from '@/stores/misc/languages'

export const useInferenceStore = defineStore('inference', () => {
  const result_store = useResultStore()
  const dataset_store = useDatasetStore()
  const definitions_store = useDefinitionsStore()
  const editor_store = useEditorStore()
  const utils_store = useUtilsStore()
  const language_store = useLanguageStore()
  const language = reactive(language_store.language)

  const infer_offset = ref<number>(0)
  const cur_row = ref<number>(0)
  const cur_col = ref<number>(0)
  const table_type = ref<string>("output_result")
  const isInit = ref<boolean>(false)
  const classification_label = ref<string>("")
  const classification_filter = ref<string>("")
  const classification_sort_key = ref<string>("")
  const classification_sort_type = ref<string>("")
  const isUploaded = ref<boolean>(false)
  const uploaded_inputs = ref<string[]>([])
  const supported_input_ext = ref<string[]>([
      '.bmp',
      '.jpg',
      '.jpeg',
      '.png',
      '.gif',
      '.tif',
      '.tiff',
      '.dcm',
      '.csv',
      '.npy',
      '.wav'
  ])

  function showInferContent(job: any, callback?: any) {
    getInferResult(job, 0, 0, 1, 1, false, (result: any) => {
      var targetJob = result_store.data.find((_result: any) => _result.job_id == job.job_id);
      targetJob.inference_logfile = result.inference_result.logfile || '';
      if (!result.inference_result) {
        result.inference_result = {};
      }
      delete result.inference_result.result;
      delete result.inference_result.logfile;
      Object.assign(targetJob, result.inference_result);
      if (callback) callback(result);
    });
  }

  function getInferResult(job: any, row = 0, column = 0, numrows = 10, numcolumns = 10, excludeOption = false, callback: any = undefined) {
    var excludeFields = '';
    if (excludeOption) {
        // excludeFields = '&exclude_fields=confusion_matrix';
    }
    if (['evaluate', 'inference'].includes(job.type)) {
      cur_row.value = row
      cur_col.value = column
      utils_store.callApi({
            url: definitions_store.Definitions.CORE_API.usersUrl() + "/projects/" + editor_store.projectId + "/jobs/" + job.job_id + "/inference_result?row=" + row + "&column=" + column + "&numrows=" + numrows + "&numcolumns=" + numcolumns + excludeFields,
            type: 'get',
            dataType: 'json',
        }, (result: any) => {
            if (callback) callback(result);
        }, (error: any, status: any, httpErrorThrown: any) => {
            if ((error.responseJSON || {}).error === 'NNCD_BAD_DATASET_ID') {
              // TODO: 文言一括対応時に文言修正する。デザイン確定時に表示位置変更する。
              job.inference_logfile = 'RESULT CANNOT BE RENDERED. THE DATASET USED BY EVALUATION SEEMS TO BE DELETED.';
            } else if (error.status === definitions_store.Definitions.HTTP_STATUS_CODE.GATEWAY_TIMEOUT) {
              editor_store.popup(
                language.DATA_LOADING_TIMED_OUT,
                language.THE_NUMBER_OF_LOADING,
                [{name: 'OK', action: () => {}, },]
              );
              if (callback) callback({
                inference_result: {},
              });
            } else if ((error.responseJSON || {}).error === 'NNCD_JOB_DELETED') {
                editor_store.popup(
                  language.ERROR,
                  language.THE_JOB_IS_ALREADY_DELETED,
                  [{
                    name: 'OK', action: () => {
                      result_store.deleteResult(job.job_id, false);
                      }
                    }
                  ])
                if (callback) callback({
                  inference_result: {},
                });
            } else {
              utils_store.handleXhrFailure(error, status, httpErrorThrown);
            }
        });
    }
  }

  function getClassificationResult(job: any, offset = 0, filter = undefined, sort_key = undefined, sort_type = undefined, callback: any = undefined, errorCallback: any = undefined) {
    var filterFields = '';
    if (filter) {
        filterFields = '&filter=' + filter;
    }
    var sortFields = '';
    if (sort_key) {
        sortFields = '&sort_by=' + sort_key + ' ' + sort_type;
    }
    utils_store.callApi({
        url: definitions_store.Definitions.CORE_API.usersUrl() + "/projects/" + editor_store.projectId + "/jobs/" + job.job_id + "/inference_result/classification_result?label=" + classification_label.value + "&row=" + cur_row.value + "&column=" + cur_col.value + "&offset=" + offset + "&limit=10" + filterFields + sortFields,
        type: 'get',
        dataType: 'json',
    }, (result: any) => {
        if (callback) callback(result);
    }, (error: any, status: any, httpErrorThrown: any) => {
        if (error.status === definitions_store.Definitions.HTTP_STATUS_CODE.GATEWAY_TIMEOUT) {
            editor_store.popup(
              language.DATA_LOADING_TIMED_OUT,
              language.THE_NUMBER_OF_LOADING,
              [{name: 'OK', action: () => {}, },]
            );
            if (callback) callback({
              inference_result: {},
            });
        } else {
            if (errorCallback) {
                errorCallback(error, status, httpErrorThrown);
            }
        }
    });
  }

  function resetOffset() {
    infer_offset.value = 0
  }

  return { 
    infer_offset,
    table_type,
    uploaded_inputs,
    supported_input_ext,
    isUploaded,
    isInit,
    classification_sort_type,
    classification_sort_key,
    classification_label,
    classification_filter,
    showInferContent,
    getInferResult,
    getClassificationResult,
    resetOffset
  }
})
