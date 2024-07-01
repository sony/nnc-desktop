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
import { ref, reactive, onMounted, computed } from 'vue'
import ReportNetwork from '@/components/report-network/ReportNetwork.vue'
import EditorApplicationBar from '@/components/editor-application-bar/EditorApplicationBar.vue'
import MainContent from '@/components/main-content/MainContent.vue'
import NncModalLoading from '@/components/shared-components/NncModalLoading.vue'
import NncDialog from '@/components/shared-components/nnc-dialog/NncDialog.vue'
import { useDefinitionsStore } from '@/stores/misc/definitions'
import {useProjConvertStore} from '@/stores/project_converter'
import { useEditorStore } from '@/stores/editor'
import { useDatasetStore } from '@/stores/dataset'
import { useUtilsStore } from '@/stores/utils'
import { useSVGAreaStore } from '@/stores/editor/svgarea'
import { useResultStore } from '@/stores/result'
import { useConfigStore } from '@/stores/config'
import { useLanguageStore } from '@/stores/misc/languages'
import { storeToRefs } from 'pinia'
// import $ from "jquery";
// import { RouterLink, RouterView } from 'vue-router'
// import HelloWorld from './components/HelloWorld.vue'

// store
const editor_store = useEditorStore()
const utils_store = useUtilsStore()
const config_store = useConfigStore()
const svgarea_store = useSVGAreaStore()
const dataset_store = useDatasetStore()
const result_store = useResultStore()
const definitions_store = useDefinitionsStore()
const proj_convert_store = useProjConvertStore()
const language_store = useLanguageStore()
const language = reactive(language_store.language)
const value = ref<any>(null);
const {
  projectName,
  isLocal,
  members,
  isCreateReport,
  services,
  nickname,
  editTabInstance,
  reportUrl,
  reportProgress,
  modal,
  isLoadEnd,
  readOnly,
  params,
  resumeInstance,
  hasShareTenant,
  isCopying,
  plugins,
  configuration,
  projectId,
  allInstances,
  isRegistered,
  downloadFormats,
  updateDetection,
  isWorkspaceExceeded,
  availableInstances,
  tenantId,
  tenantList,
  reportConfiguration,
  isFreeCpuExceeded,
  abciMaintenanceList,
  showNetworkForReport,
  reportCompletedConfiguration,
  shouldShowUploadDialog
} = storeToRefs(editor_store)

// hooks
onMounted(() => {
  editor_store.members = []
  editor_store.windowInit()
  editor_store.windowBind()
  $.ajaxSetup({
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
      xhrFields: { withCredentials: true },
      beforeSend: function(jqXHR: any, settings: any) {
          jqXHR.requestURL = settings.url;
          jqXHR.requestType = settings.type;
      }
  });

  projectId.value = utils_store.getProjectId;
  
  params.value = utils_store.getParams;

  var _setIsLocal = () => {
      const tenant = tenantList.value.find((tenant: any) => tenant.tenant_id === tenantId.value);
      if (tenant) {
          isLocal.value = tenant.purpose === 'private';
      }
  }

  var _getProject = (isFirst: boolean) => {
    var $def = $.Deferred();
    utils_store.callApi({
        url: definitions_store.Definitions.CORE_API.usersUrl() + '/projects/' + projectId.value,
        type: 'get',
        dataType: 'json',
    }, (result: any) => {
        tenantId.value = result.tenant_id;
        projectName.value = result.project_name;
        isCopying.value = (result.status === 'ready' || result.status === 'processing');
        if (isCopying.value) {
            setTimeout(_getProject, 3000);
        } else {
            if (!isFirst) {
              editor_store.fetchResultsAll(true);
            }
        }
        $def.resolve();
    }, (error: any, status: any, httpErrorThrown: any) => {
        if (((error.responseJSON || {}).error === 'NNCD_BAD_REQUEST') && ((error.responseJSON || {}).message === 'Not found project')) {
            editor_store.popup(language.ERROR, language.THE_PROJECT_MIGHT_BE_DELETED,
                [{name: 'OK', action: () => {document.location.href = '/console/#/project'}}]);
        } else {
            isLoadEnd.value = true;
            utils_store.handleXhrFailure(error, status, httpErrorThrown);
        }
    });
    return $def.promise();
  };

  var _getMembers = () => {
    var $def = $.Deferred();
    // テナント一覧を取得
    utils_store.callApi({
        url: definitions_store.Definitions.CORE_API.usersUrl() + '/tenants',
        type: 'get',
        dataType: 'json',
    }, (result: any) => {
        tenantList.value = result.tenants;
        hasShareTenant.value = result.tenants.length > 1;

        if ((tenantList.value.find((tenant: any) => tenant.purpose === 'share') || {}).tenant_id === tenantId.value) {
            _setIsLocal();
            utils_store.callApi({
                url: `${definitions_store.Definitions.CORE_API.usersUrl()}/tenants/${tenantId.value}/members`,
                type: 'get',
                dataType: 'json',
            }, (result: any) => {
                members.value = result.members;
                $def.resolve();
            }, (error: any, status: any, httpErrorThrown: any) => {
                utils_store.handleXhrFailure(error, status, httpErrorThrown);
            });
        } else {
            // promiseの後にresolveするために少し遅らせる
            const TIMER = 50;
            setTimeout(() => { $def.resolve(); }, TIMER);
        }
    }, (error: any, status: any, httpErrorThrown: any) => {
        utils_store.handleXhrFailure(error, status, httpErrorThrown);
    });
    return $def.promise();
  };

  _getProject(true).then(() => {
        // configuration取得
        utils_store.callApi({
            url: definitions_store.Definitions.CORE_API.usersUrl() + '/projects/' + projectId.value + '/configuration?configuration_format=sdcproj',
            type: 'get',
            dataType: 'json',
        }, (result: any) => {
            editor_store.windowInit()
            var _configuration: any;
            if (result.configuration_format === 'json') {
                var sdcproj = proj_convert_store.exportProject(JSON.parse(result.configuration), true);
                _configuration = proj_convert_store.importProject(sdcproj, true);
            } else {
                _configuration = proj_convert_store.importProject(result.configuration, true);
            }
            utils_store.set_last_saved_configuration(_configuration);
            const readOnly = result.readonly;
            if (readOnly) {
                readOnly.value = true;
                _getMembers().then(() => {
                    editor_store.showReadOnlyDialog(result.last_modified_user_id);
                });
            }
            config_store.set_data(_configuration);
            utils_store.callApi({
                url: definitions_store.Definitions.CORE_API.usersUrl() + '/projects/' + projectId.value + '/metadata',
                type: 'get',
                dataType: 'json',
            }, (result: any) => {
                if (result.metadata.tags) {
                    // tagが1つの場合は文字列で取得される為、配列に入れてから渡す。
                    if ((typeof result.metadata.tags).toLowerCase() === 'string') {
                    config_store.setMetaData([result.metadata.tags]);
                    } else {
                    config_store.setMetaData(result.metadata.tags);
                    }
                }
            }, (error: any, status: any, httpErrorThrown: any) => {
                utils_store.handleXhrFailure(error, status, httpErrorThrown);
            });

            Promise.all(_configuration.datasets.map((dataset: any) => {
                return editor_store.isCompletedDataset(dataset.id);
            })).then((datasetResults) => {
                datasetResults.forEach((datasetResult, i) => {
                    if (datasetResult.isCompleted) {
                        const dataset = datasetResult.dataset;
                        _configuration.datasets[i] = Object.assign(_configuration.datasets[i], {
                            id: dataset.dataset_id,
                            original_name: dataset.dataset_name,
                            data_source: dataset.datasource,
                            file_location: dataset.local_filepath,
                            samples: dataset.data_num,
                            columns: dataset.column_num,
                            tenant_id: dataset.tenant_id,
                            features: dataset.features
                        });
                    } else {
                        const configurationDataset = _configuration.datasets[i];
                        _configuration.datasets[i] = {
                            id: '',
                            name: configurationDataset.name || '',
                            original_name: '',
                            tobe_shuffled: configurationDataset.tobe_shuffled === true,
                            tobe_normalized_image: configurationDataset.tobe_normalized_image,
                            samples: 0,
                            columns: 0,
                            tenant_id: '',
                        };
                    }
                });
                dataset_store.update_data(_configuration.main_dataset_name, _configuration.datasets);
                utils_store.load(_configuration.networks);
                configuration.value = _configuration
                editor_store.updateIsLoadEnd({ configuration: true });
            });
        }, (error: any, status: any, httpErrorThrown: any) => {
            editor_store.updateIsLoadEnd({ configuration: true });
            utils_store.handleXhrFailure(error, status, httpErrorThrown);
        });

        // ワークスペース超過判定
        utils_store.callApi({
            url: definitions_store.Definitions.CORE_API.usersUrl() + '/tenants/' + tenantId.value + '/workspace',
            type: 'get',
            dataType: 'json',
        }, (result: any) => isWorkspaceExceeded.value = (result.job_workspace_used + result.dataset_workspace_used >= result.workspace_quota) ? true : false);

        // 予算取得
        utils_store.callApi({
            url: definitions_store.Definitions.CORE_API.usersUrl() + '/tenants/' + tenantId.value + '/plan',
            type: 'get',
            dataType: 'json',
        }, (result: any) => {
            services.value = result.plan.services || [];
            isRegistered.value = (result.plan.services || []).includes('aws');
        });

        // 利用可能インスタンスタイプ一覧取得
        utils_store.callApi({
            url: definitions_store.Definitions.CORE_API.usersUrl() + '/tenants/' + tenantId.value + '/instance',
            type: 'get',
            dataType: 'json',
        }, (result: any) => {
            allInstances.value = result.instance_type;
            if (definitions_store.Definitions.REGISTRABLE()) {
                let _availableInstances: any = {};
                for (var jobType in result.instance_type) {
                _availableInstances[jobType] = result.instance_type[jobType].filter((_instance: any) => !_instance.deprecated);
                }
                availableInstances.value = _availableInstances;
            } else {
                var _availableInstances: any = {};
                for (var jobType in result.instance_type) {
                _availableInstances[jobType] = result.instance_type[jobType].filter((type: any) => type.instance_type === 1);
                }
                availableInstances.value = _availableInstances;
            }
            var getDefaultInstance = (type: any, priority: any) => {
                const instances = result.instance_type[type];
                if (instances && instances.filter((instance: any) => instance.priority === priority).length) {
                    return instances.filter((instance: any) => instance.priority === priority)[0].instance_type;
                } else {
                    return definitions_store.Definitions.DEFAULT_INSTANCE_GROUP;
                }
            }
            editTabInstance.value.priorities[0] = getDefaultInstance('train', 0);
            editTabInstance.value.priorities[1] = getDefaultInstance('train', 1);
            resumeInstance.value.priorities[0] = getDefaultInstance('train', 0);
            resumeInstance.value.priorities[1] = getDefaultInstance('train', 1);
        }, (error: any, status: any, httpErrorThrown: any) => {
            utils_store.handleXhrFailure(error, status, httpErrorThrown);
        });

        _getMembers();

        // plugin一覧取得
        utils_store.callApi({
            url: definitions_store.Definitions.CORE_API.usersUrl() + '/tenants/' + tenantId.value +'/plugins',
            type: 'get',
            dataType: 'json',
        }, (result: any) => {
            plugins.value = result.plugins;
        });
    });

    // 学習結果取得
    var offset = 0;
    editor_store.fetchResults(() => {
        var jobs = result_store.data;
        var fetchJobsUntilFound = (job_id: any) => {
            if (!job_id || jobs.find((job: any) => job.job_id === job_id) || jobs.length === result_store.metadata.total) {
                editor_store.updateIsLoadEnd({ jobs: true });
                result_store.changeActive(job_id);
            } else {
                offset += definitions_store.Definitions.ITEMS_PER_PAGE;
                editor_store.fetchResults(() => { fetchJobsUntilFound(job_id); }, offset);
            }
        };

        fetchJobsUntilFound(params.value.job_id || (jobs[0] || {}).job_id);
        editor_store.setPollingForFetchResults();
    }, offset);

    // メンテナンス情報を取得
    utils_store.callApi({
        url: definitions_store.Definitions.CORE_API.baseUrl() + '/misc/info?what_text=maintenance',
        type: 'get',
        dataType: 'json',
    }, (result: any) => {
        abciMaintenanceList.value = result.maintenance.abci;
    });

    // ダウンロードのフォーマット一覧を取得
    utils_store.callApi({
        url: definitions_store.Definitions.CORE_API.baseUrl() + '/misc/download_formats',
        type: 'get',
        dataType: 'json',
    }, (result: any) => {
        downloadFormats.value = result.formats;
    });

    // 無料CPU時間超過判定
    utils_store.callApi({
        url: definitions_store.Definitions.CORE_API.usersUrl() + '/account/process_resource',
        type: 'get',
        dataType: 'json',
    }, (result: any) => isFreeCpuExceeded.value = (result.process_resource >= result.max_process_resource) ? true : false);

    // 設定の取得
    utils_store.callApi({
        url: definitions_store.Definitions.CORE_API.usersUrl() + '/settings',
        type: 'get',
        dataType: 'json',
    }, (result: any) => {
        localStorage.removeItem('s');
        localStorage.removeItem('p');
        if ((result || {}).flag_job_includes_preparation_agreed !== undefined) {
            localStorage.setItem('s', result.flag_job_includes_preparation_agreed);
        }
        if ((result || {}).flag_billing_notification_already_agreed !== undefined) {
            localStorage.setItem('p', result.flag_billing_notification_already_agreed);
        }
    });

    // 設定の取得
    utils_store.callApi({
        url: definitions_store.Definitions.CORE_API.usersUrl() + '/account/nickname',
        type: 'get',
        dataType: 'json',
    }, (result: any) => {
        nickname.value = result.nickname;
    });

    editor_store.getUseRate();
    setInterval(editor_store.getUseRate, definitions_store.Definitions.ABCI_USE_RATE.POLLING_INTERVAL);

    $(window).on('resize', () => {
        // resizeするたびにオーバービューの表示領域の計算を行う為の処理
        updateDetection.value = !updateDetection.value;
    });
    $(window).on('mousedown', () => {
        // mousedown時にオーバーレイを非表示にする為の処理
        const $layerHelpIcon = $('.layer-help-icon');
        if ($layerHelpIcon[0]) {
            $layerHelpIcon[0].blur();
        }
    });

    svgarea_store.init()
})

</script>

<template>
  <div>
    <EditorApplicationBar 
      :project-name="projectName"
      :is-local="isLocal"
      :is-create-report="isCreateReport"
      :report-url="reportUrl"
      :report-progress="reportProgress"
      :modal="modal"
      @save="editor_store.onSave"
      @save-as="editor_store.onSaveAs"
      @publish-project="editor_store.onPublishProject"
      @pipeline="editor_store.createPipeline"
      @show-download-dialog="editor_store.showAvailableDownloadHtmlDialog"
    />
    <MainContent/>
    <NncModalLoading v-if="!isLoadEnd" />
    <NncDialog v-if="modal.show" :data="modal" />
    <div v-if="reportConfiguration.networks" class="test" style="display:none;">
        <div id="learning_curve_for_html" class="result-learning-curve_for_html" />
        <canvas id="canvas_learning_curve_for_html" />
        <ReportNetwork v-if="showNetworkForReport" :configuration="reportConfiguration" :completedConfiguration="reportCompletedConfiguration" />
    </div>
  </div>
</template>

<style scoped>
div#learning_curve_for_html {
    width: 928px;
    height: 522px;
    background-color: white;
}
</style>
