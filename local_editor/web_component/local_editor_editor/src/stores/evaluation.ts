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
import {useEditorStore} from './editor'
import {useUtilsStore} from './utils'
import {useInferenceStore} from './inference'
import {useDefinitionsStore} from './misc/definitions'
import {useResultStore} from './result'
import { useLanguageStore } from '@/stores/misc/languages'

export const useEvaluationStore = defineStore('evaluation', () => {
  const definitions_store = useDefinitionsStore()
  const result_store = useResultStore()
  const editor_store = useEditorStore()
  const utils_store = useUtilsStore()
  const inference_store = useInferenceStore()
  const language_store = useLanguageStore()
  const language = reactive(language_store.language)

  const cur_row = ref<number>(0)
  const cur_col = ref<number>(0)
  const eval_offset = ref<number>(0)
  const table_type = ref<string>("output_result")
  const rowIndex = ref<number>(0)
  const colIndex = ref<number>(0)
  const isInit = ref<boolean>(false)
  const classification_label = ref<string>("")
  const classification_filter = ref<string>("")
  const classification_sort_key = ref<string>("")
  const classification_sort_type = ref<string>("")

  function resetConfusionMatrix() {
    rowIndex.value = definitions_store.Definitions.CONFUSION_MATRIX.ROW.DEFAULT_NUMBER_OF_DISPLAY;
    colIndex.value = definitions_store.Definitions.CONFUSION_MATRIX.COLUMN.DEFAULT_NUMBER_OF_DISPLAY;
    if ($('.confusion-matrix-content').length) {
        $('.confusion-matrix-content')[0].scrollTop = 0;
    }
  }

  function showEvaluationContent(job: any, callback?: any) {
    resetConfusionMatrix();
    getEvaluationResult(job, 0, 0, 1, 1, false, (result: any) => {
        var targetJob = result_store.data.find((_result: any) => _result.job_id == job.job_id);
        if (result.evaluation_result.confusion_matrix) {
            targetJob.confusionMatrix.selectedModal = Object.keys(result.evaluation_result.confusion_matrix)[0];
            targetJob.confusionMatrix.matrices = result.evaluation_result.confusion_matrix;
            targetJob.classificationResult.total = result.metadata.total;

            classification_label.value = targetJob.confusionMatrix.selectedModal;
            inference_store.classification_label = targetJob.confusionMatrix.selectedModal;
            getClassificationMatrix(job, (result: any) => {
                targetJob.classificationMatrix.selectedModal = Object.keys(result)[0];
                targetJob.classificationMatrix.matrices = result;
            });
        }
        targetJob.evaluation_logfile = result.evaluation_result.logfile || '';
        if (!result.evaluate_status) {
            result.evaluate_status = {};
        }
        delete result.evaluation_result.csv_header;
        delete result.evaluation_result.result;
        delete result.evaluation_result.logfile;
        Object.assign(targetJob, result.evaluation_result);
        if (callback) callback(result);
    });
  }

  function getEvaluationResult(job: any, row = 0, column = 0, numrows = 10, numcolumns = 10, excludeOption = false, callback: any = undefined) {
    var excludeFields = '';
    if (excludeOption) {
        excludeFields = '&exclude_fields=confusion_matrix';
    }
    if (['evaluate', 'inference'].includes(job.type)) {
      cur_row.value = row
      cur_col.value = column
      utils_store.callApi({
            url: definitions_store.Definitions.CORE_API.usersUrl() + "/projects/" + editor_store.projectId + "/jobs/" + job.job_id + "/evaluation_result?row=" + row + "&column=" + column + "&numrows=" + numrows + "&numcolumns=" + numcolumns + excludeFields,
            type: 'get',
            dataType: 'json',
        }, (result: any) => {
            if (callback) callback(result);
        }, (error: any, status: any, httpErrorThrown: any) => {
            if ((error.responseJSON || {}).error === 'NNCD_BAD_DATASET_ID') {
              // TODO: 文言一括対応時に文言修正する。デザイン確定時に表示位置変更する。
              job.evaluation_logfile = 'RESULT CANNOT BE RENDERED. THE DATASET USED BY EVALUATION SEEMS TO BE DELETED.';
            } else if (error.status === definitions_store.Definitions.HTTP_STATUS_CODE.GATEWAY_TIMEOUT) {
              editor_store.popup(
                language.DATA_LOADING_TIMED_OUT,
                language.THE_NUMBER_OF_LOADING,
                [{name: 'OK', action: () => {}, },]
              );
              if (callback) callback({
                  evaluation_result: {},
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
                    evaluation_result: {},
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
        url: definitions_store.Definitions.CORE_API.usersUrl() + "/projects/" + editor_store.projectId + "/jobs/" + job.job_id + "/evaluation_result/classification_result?label=" + classification_label.value  + "&row=" + cur_row.value + "&column=" + cur_col.value + "&offset=" + offset + "&limit=10" + filterFields + sortFields,
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
                evaluation_result: {},
            });
        } else {
            if (errorCallback) {
                errorCallback(error, status, httpErrorThrown);
            }
        }
    });
  }

  function getClassificationMatrix(job: any, callback: any = undefined) {
    utils_store.callApi({
        url: definitions_store.Definitions.CORE_API.usersUrl() + "/projects/" + editor_store.projectId + "/jobs/" + job.job_id + "/evaluation_result/classification_matrix",
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
                evaluation_result: {},
            });
        }
    });
  }

  function resetOffset() {
    eval_offset.value = 0
  }

  return { 
    eval_offset,
    table_type,
    isInit,
    rowIndex,
    colIndex,
    classification_label,
    classification_sort_key,
    classification_sort_type,
    classification_filter,
    showEvaluationContent,
    getEvaluationResult,
    getClassificationResult,
    resetConfusionMatrix,
    resetOffset
  }
})
