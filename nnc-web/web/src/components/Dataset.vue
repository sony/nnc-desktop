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

<!-- src/components/Dataset.vue -->
<template>
  <div id="dataset-area" :class="hasShareTenant ? 'share' : ''">
    <div id="dataset-container" :class="!isLocalTenant() ? 'share-tenant' : ''">
      <tenant-tabs
        v-if="hasShareTenant"
        :tenantList="tenantList"
        :selectedTenantId="selectedTenantId"
        :onClickTenantTab="onChangeTab"
        :warningList="getWarningList()"
        @apierror="(error, callback) => $emit('apierror', error, callback)"
      />
      <div class="dataset-menu-height border-bottom dataset-action">
        <div class="box box-align-center action-menu-area">
          <div id="upload-dataset-area" class="box box-align-center action-menu" @click="uploadDataset">
            <img src="/console/image/upload.svg" alt="Upload">
            <div class="action-menu-string">
              <em>{{vueTexts.UPLOAD_DATASET}}</em>
            </div>
          </div>
          <div class="box box-align-center action-menu upload-dataset-browser">
            <img src="/console/image/upload.svg" alt="Upload">
            <div class="action-menu-string">
              <em>{{vueTexts.UPLOAD_DATASET_FROM_BROWSER}}</em>
            </div>
            <label class="upload-dataset-browser-label" id="dataset-uploader-label" for="dataset-uploader">
              <input class="upload-dataset-input" id="dataset-uploader" @click="openUploadDialog">
            </label>
          </div>

          <div id="copy-area" @click.stop v-if="shouldShowCopyArea">
            <div class="box box-pack-justify">
              <div id="upload-dataset-message">
                <span>{{vueTexts.COPY_THE_FOLLOWING}}</span>
              </div>
              <div class="remove-icon pointer" @click="close">
                <img src="/console/image/Remove.svg">
              </div>
            </div>
            <div id="upload-dataset-url-area" @click.stop>
              <input id="upload-dataset-input" v-bind:value="token" readonly>
              <div id="upload-dataset-copy-button-area">
                <button @click="copyUrl" class="pointer">
                  <img src="/console/image/Copy.svg">
                </button>
              </div>
            </div>
            <div id="upload-dataset-button-area" class="box box-pack-justify">
              <button class="button-area pointer" @click="onClickGetUploader">Get Uploader</button>
              <button class="button-area pointer" @click="onClickCheckCommand">Check Command</button>
            </div>
          </div>
        </div>
        <div class="action-menu-area-filter-and-search" id="dataset">
          <div class="box box-align-center action-menu">
            <div class="action-menu-string"></div>
            <label class="select-label">
              <select class="select-menu" @change="changeLabel" :tabindex="isShowingDialog ? -1 : 0" @focus="onFocus">
                <option v-for="(name, i) in labelList" :key="'option' + i" :value="name">{{convertToNickName(name)}}</option>
              </select>
            </label>
          </div>
          <div class="box box-align-center action-menu-area-search-dataset">
            <div id="search-dataset-area" class="box box-align-center action-menu">
              <div class="action-menu-string">
                <input id="dataset-search" class="form-control" :value="keyword" @keyup="oninput($event.currentTarget.value)" @keyup.esc="initKeyword()" type="text" :placeholder="vueTexts.SEARCH" style="border:none;" :tabindex="isShowingDialog ? -1 : 0">
              </div>
            </div>
          </div>
          <div id="workspace-info-area" class="box box-align-center">
            <img src="/console/image/upload.svg">
            <div class="dataset_workspace_information">
              <img src="/console/image/Database.svg" />
              <em :class="isCloseToTheLimitWorkspace() ? 'warning-text' : ''">{{getWorkspaceUsedString()}}</em><em>/{{getWorkspaceQuotaString()}}GB</em>
            </div>
          </div>
        </div>
      </div>
      <div class="border-bottom dataset-heading-container">
        <div class="box box-align-center dataset-menu-height">
          <div class="dataset-name box box-align-center dataset-menu-height">
            <div class="checkbox-area">
              <input type="checkbox" id="select-all-checkbox" class="checkbox project-menu-height" @click="selectAll" :checked="allChecked || false">
              <label for="select-all-checkbox"></label>
            </div>
            <div class="select-all-string">{{vueTexts.NAME}}</div>
          </div>
          <div class="action box box-align-center box-pack-end dataset-menu-height">
            <div id="action-icon" class="box box-align-center pointer">
              <div>{{vueTexts.ACTION}}</div>
              <img src="/console/image/ArrowDownBlue.svg" alt="Action" class="action-icon">
            </div>
          </div>
        </div>
      </div>
      <div class="wh-100">
        <div class="dataset-list-container">
          <ul id="dataset-list">
            <li v-for="(dataset, i) in datasetList" v-bind:key="'dataset' + i" v-bind:class="isPreviewDatasetID(dataset.dataset_id) ? 'box dataset-list dataset-content preview' : 'box dataset-list dataset-content'">
              <div v-if="dataset.status === 'completed'" v-bind:data-did="dataset.dataset_id" class="box user-dataset-list dataset-list pointer" @click="onClickDataset">
                <div class="dataset-name box box-align-center dataset-content">
                  <div class="dataset-area">
                    <div class="box ellipsis">
                      <div :class="!isSampleDataset(dataset.owner_user_id) ? 'checkbox-area' : 'checkbox-area-sample-dataset'">
                        <input v-bind:id="dataset.dataset_id" v-bind:data-did="dataset.dataset_id" v-bind:data-owner-userid="dataset.owner_user_id" type="checkbox" v-bind:checked="dataset.checked || false" class="checkbox">
                        <label v-bind:data-did="dataset.dataset_id" @click="select" v-bind:for="dataset.dataset_id"></label>
                      </div>
                      <div class="dataset-name-area ellipsis" v-if="dataset.shouldShowInput">
                        <span>
                          <input id="dataset-name-input" :data-pid="dataset.dataset_id" type="text" :value="dataset.inputValue" @keydown="onKeydownDatasetName" @input="inputDatasetName(dataset.dataset_id, $event.currentTarget.value)" @click.stop @blur="rename($event, dataset.dataset_id)">
                        </span>
                      </div>
                      <div class="dataset-name-area ellipsis" v-else>
                        <span>{{dataset.dataset_name}}</span>
                      </div>
                    </div>
                    <div class="dataset-additional-info-list box">
                      <div class="dataset-additional-info owner-user-id box ellipsis" v-if="!isLocalTenant()">
                        <div>
                          <img class="dataset-additional-info-icon" src="/console/image/Account.svg">
                        </div>
                        <div class="dataset-additional-info-value ellipsis">
                          <span>{{getOwnerName(dataset.owner_user_id)}}</span>
                        </div>
                      </div>
                      <div class="dataset-additional-info sample-dataset-personal box ellipsis" v-else-if="isLocalTenant() && isSampleDataset(dataset.owner_user_id)">
                        <div class="dataset-additional-info-value ellipsis">
                          <span>{{ commonVueTexts.SAMPLE }}</span>
                        </div>
                      </div>
                      <div class="dataset-additional-info box ellipsis">
                        <div>
                          <img class="dataset-additional-info-icon" src="/console/image/Database.svg">
                        </div>
                        <div class="dataset-additional-info-value ellipsis">
                          <span>{{calcDatasetStorage(dataset.storage_used)}}</span>
                        </div>
                      </div>
                      <div :class="isSampleDataset(dataset.owner_user_id) && isLocalTenant() ? 'dataset-additional-info-columns-area-sample box' : 'dataset-additional-info-columns-area box'">
                        <div>
                          <img class="dataset-additional-info-icon" src="/console/image/Load.svg">
                        </div>
                        <div class="dataset-additional-info-columns ellipsis">
                          <span class="update-datetime-area">{{dataset.update_datetime}}</span>
                          <div class="putted-labels-area">
                            <span class="putted-labels" v-for="(label, i) in dataset.labels" :key="'option' + i">{{label}}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="action box box-pack-end">
                  <div class="action-image" v-if="shouldShowCopyIcon()">
                    <img :data-did="dataset.dataset_id" src="/console/image/Copy.svg" alt="Copy" @click.stop="onClickCopy(dataset.dataset_id, dataset.owner_user_id, dataset.dataset_name)">
                  </div>
                  <div class="action-image label-icon pointer" v-if="!isSampleDataset(dataset.owner_user_id)"><img v-bind:data-pid="dataset.dataset_id" src="/console/image/Tag.svg" alt="Label" @click.stop="onClickLabel(dataset.dataset_id)"></div>
                  <div class="action-image pointer" v-if="!isSampleDataset(dataset.owner_user_id)"><img v-bind:data-pid="dataset.dataset_id" src="/console/image/Rename.svg" alt="Rename" @click.stop="onClickRenameIcon(dataset.dataset_id, dataset.owner_user_id)"></div>
                  <div class="action-image pointer"><img v-bind:data-did="dataset.dataset_id" v-bind:data-owner-userid="dataset.owner_user_id" src="/console/image/Delete.svg" alt="Delete" @click.stop="deleteDataset(dataset.dataset_id, dataset.owner_user_id)"></div>
                </div>
              </div>
              <div v-else-if="dataset.status === 'ready' || dataset.status === 'extracting'" v-bind:data-did="dataset.dataset_id"  class="box user-dataset-list dataset-list">
                <div class="dataset-name box box-align-center dataset-content">
                  <div class="dataset-area">
                    <div class="box ellipsis">
                      <div :class="!isSampleDataset(dataset.owner_user_id) ? 'checkbox-area' : 'checkbox-area-sample-dataset'">
                        <input v-bind:id="dataset.dataset_id" v-bind:data-did="dataset.dataset_id" v-bind:data-owner-userid="dataset.owner_user_id" type="checkbox" v-bind:checked="dataset.checked || false" class="checkbox">
                        <label v-bind:data-did="dataset.dataset_id" @click="select" v-bind:for="dataset.dataset_id"></label>
                      </div>
                      <div class="dataset-name-area ellipsis" v-if="dataset.shouldShowInput">
                        <span>
                          <input id="dataset-name-input" :data-pid="dataset.dataset_id" type="text" :value="dataset.inputValue" @keydown="onKeydownDatasetName" @input="inputDatasetName(dataset.dataset_id, $event.currentTarget.value)" @click.stop @blur="rename($event, dataset.dataset_id)">
                        </span>
                      </div>
                      <div class="dataset-name-area ellipsis" v-else>
                        <span>{{dataset.dataset_name}}</span>
                      </div>
                    </div>
                    <div v-if="dataset.status === 'ready'" class="dataset-additional-info-list box uploading">
                      <div class="dataset-additional-info owner-user-id box ellipsis" v-if="!isLocalTenant()">
                        <div>
                          <img class="dataset-additional-info-icon" src="/console/image/Account.svg">
                        </div>
                        <div class="dataset-additional-info-value ellipsis">
                          <span>{{getOwnerName(dataset.owner_user_id)}}</span>
                        </div>
                      </div>
                      <div class="dataset-additional-info sample-dataset-personal box ellipsis" v-else-if="isLocalTenant() && isSampleDataset(dataset.owner_user_id)">
                        <div class="dataset-additional-info-value ellipsis">
                          <span>{{ commonVueTexts.SAMPLE }}</span>
                        </div>
                      </div>
                      <div>
                        <span class="active" v-if="dataset.progress === 0">{{vueTexts.UPLOADING}}</span>
                        <span class="active" v-else>{{`${vueTexts.UPLOADING} : ${dataset.progress}%`}}</span>
                        <span class="arrow">→</span>
                        <span class="inactive">{{vueTexts.EXPANDING}}</span>
                        <span class="arrow">→</span>
                        <span class="inactive">{{vueTexts.FINISH}}</span>
                      </div>
                      <div class="putted-labels-area label-ready-extracting status-ready">
                        <span class="putted-labels" v-for="(label, i) in dataset.labels" :key="'option' + i">{{label}}</span>
                      </div>
                    </div>
                    <!-- extracting -->
                    <div v-else class="dataset-additional-info-list box uploading">
                      <div class="dataset-additional-info owner-user-id box ellipsis" v-if="!isLocalTenant()">
                        <div>
                          <img class="dataset-additional-info-icon" src="/console/image/Account.svg">
                        </div>
                        <div class="dataset-additional-info-value ellipsis">
                          <span>{{getOwnerName(dataset.owner_user_id)}}</span>
                        </div>
                      </div>
                      <div class="dataset-additional-info sample-dataset-personal box ellipsis" v-else-if="isLocalTenant() && isSampleDataset(dataset.owner_user_id)">
                        <div class="dataset-additional-info-value ellipsis">
                          <span>{{ commonVueTexts.SAMPLE }}</span>
                        </div>
                      </div>
                      <div>
                        <span class="inactive">{{vueTexts.UPLOADING}}</span>
                        <span class="arrow">→</span>
                        <span class="active">{{`${vueTexts.EXPANDING} : ${dataset.extract_progress}%`}}</span>
                        <span class="arrow">→</span>
                        <span class="inactive">{{vueTexts.FINISH}}</span>
                      </div>
                      <div class="putted-labels-area label-ready-extracting expanding">
                        <span class="putted-labels" v-for="(label, i) in dataset.labels" :key="'option' + i">{{label}}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="action box box-pack-end">
                  <div class="action-image label-icon pointer" v-if="!isSampleDataset(dataset.owner_user_id)"><img v-bind:data-pid="dataset.dataset_id" src="/console/image/Tag.svg" alt="Label" @click.stop="onClickLabel(dataset.dataset_id)"></div>
                  <div class="action-image pointer" v-if="!isSampleDataset(dataset.owner_user_id)"><img v-bind:data-pid="dataset.dataset_id" src="/console/image/Rename.svg" alt="Rename" @click.stop="onClickRenameIcon(dataset.dataset_id, dataset.owner_user_id)"></div>
                  <div class="action-image pointer"><img v-bind:data-did="dataset.dataset_id" src="/console/image/Delete.svg" alt="Delete" @click.stop="deleteDataset(dataset.dataset_id, dataset.owner_user_id)"></div>
                </div>
              </div>
              <div v-else-if="dataset.status === 'copying'" v-bind:data-did="dataset.dataset_id"  class="box user-dataset-list dataset-list">
                <div class="dataset-name box box-align-center dataset-content">
                  <div class="dataset-area">
                    <div class="box ellipsis">
                      <div :class="!isSampleDataset(dataset.owner_user_id) ? 'checkbox-area' : 'checkbox-area-sample-dataset'">
                        <input :id="dataset.dataset_id" :data-did="dataset.dataset_id" :data-owner-userid="dataset.owner_user_id" type="checkbox" :checked="dataset.checked || false" class="checkbox">
                        <label :data-did="dataset.dataset_id" @click="select" :for="dataset.dataset_id"></label>
                      </div>
                      <div class="dataset-name-area ellipsis" v-if="dataset.shouldShowInput">
                        <span>
                          <input id="dataset-name-input" :data-pid="dataset.dataset_id" type="text" :value="dataset.inputValue" @keydown="onKeydownDatasetName" @input="inputDatasetName(dataset.dataset_id, $event.currentTarget.value)" @click.stop @blur="rename($event, dataset.dataset_id)">
                        </span>
                      </div>
                      <div class="dataset-name-area ellipsis" v-else>
                        <span>{{dataset.dataset_name}}</span>
                      </div>
                    </div>
                    <div class="dataset-additional-info-list box">
                      <div class="dataset-additional-info owner-user-id box ellipsis" v-if="!isLocalTenant()">
                        <div>
                          <img class="dataset-additional-info-icon" src="/console/image/Account.svg">
                        </div>
                        <div class="dataset-additional-info-value ellipsis">
                          <span>{{getOwnerName(dataset.owner_user_id)}}</span>
                        </div>
                      </div>
                      <div class="dataset-additional-info sample-dataset-personal box ellipsis" v-else-if="isLocalTenant() && isSampleDataset(dataset.owner_user_id)">
                        <div class="dataset-additional-info-value ellipsis">
                          <span>{{ commonVueTexts.SAMPLE }}</span>
                        </div>
                      </div>
                      <div v-if="dataset.copy_status === 'ready'" class="box uploading">
                        <span class="active">{{vueTexts.SAVING}}</span>
                      </div>
                      <div v-else class="box uploading">
                        <span class="active">{{`${vueTexts.SAVING} : ${dataset.copy_progress}%`}}</span>
                      </div>
                      <div class="putted-labels-area label-copying">
                        <span class="putted-labels" v-for="(label, i) in dataset.labels" :key="'option' + i">{{label}}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="action box box-pack-end">
                  <div class="action-image label-icon pointer" v-if="!isSampleDataset(dataset.owner_user_id)"><img v-bind:data-pid="dataset.dataset_id" src="/console/image/Tag.svg" alt="Label" @click.stop="onClickLabel(dataset.dataset_id)"></div>
                  <div class="action-image pointer" v-if="!isSampleDataset(dataset.owner_user_id)"><img v-bind:data-pid="dataset.dataset_id" src="/console/image/Rename.svg" alt="Rename" @click.stop="onClickRenameIcon(dataset.dataset_id, dataset.owner_user_id)"></div>
                  <div class="action-image pointer"><img v-bind:data-did="dataset.dataset_id" src="/console/image/Delete.svg" alt="Delete" @click.stop="deleteDataset(dataset.dataset_id, dataset.owner_user_id)"></div>
                </div>
              </div>
              <div v-else v-bind:data-did="dataset.dataset_id" class="box user-dataset-list dataset-list">
                <div class="dataset-name box box-align-center dataset-content">
                  <div class="dataset-area">
                    <div class="box ellipsis">
                      <div :class="!isSampleDataset(dataset.owner_user_id) ? 'checkbox-area' : 'checkbox-area-sample-dataset'">
                        <input v-bind:id="dataset.dataset_id" v-bind:data-did="dataset.dataset_id" v-bind:data-owner-userid="dataset.owner_user_id" type="checkbox" v-bind:checked="dataset.checked || false" class="checkbox">
                        <label v-bind:data-did="dataset.dataset_id" @click="select" v-bind:for="dataset.dataset_id"></label>
                      </div>
                      <div class="dataset-name-area ellipsis" v-if="dataset.shouldShowInput">
                        <span>
                          <input id="dataset-name-input" :data-pid="dataset.dataset_id" type="text" :value="dataset.inputValue" @keydown="onKeydownDatasetName" @input="inputDatasetName(dataset.dataset_id, $event.currentTarget.value)" @click.stop @blur="rename($event, dataset.dataset_id)">
                        </span>
                      </div>
                      <div class="dataset-name-area ellipsis" v-else>
                        <span>{{dataset.dataset_name}}</span>
                      </div>
                    </div>
                    <div class="dataset-additional-info-list box failed">
                      <div class="dataset-additional-info owner-user-id box ellipsis" v-if="!isLocalTenant()">
                        <div>
                          <img class="dataset-additional-info-icon" src="/console/image/Account.svg">
                        </div>
                        <div class="dataset-additional-info-value ellipsis">
                          <span>{{getOwnerName(dataset.owner_user_id)}}</span>
                        </div>
                      </div>
                      <div class="dataset-additional-info sample-dataset-personal box ellipsis" v-else-if="isLocalTenant() && isSampleDataset(dataset.owner_user_id)">
                        <div class="dataset-additional-info-value ellipsis">
                          <span>{{ commonVueTexts.SAMPLE }}</span>
                        </div>
                      </div>
                      <div>
                        {{vueTexts.FAILED_TO_UPLOAD}} <img src="/console/image/Warning.svg" @click="showUploadErrorMsg(dataset.error_code)">
                      </div>
                      <div class="putted-labels-area elipsis label-failed">
                        <span class="putted-labels" v-for="(label, i) in dataset.labels" :key="'option' + i">{{label}}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="action box box-pack-end">
                  <div class="action-image label-icon pointer" v-if="!isSampleDataset(dataset.owner_user_id)"><img v-bind:data-pid="dataset.dataset_id" src="/console/image/Tag.svg" alt="Label" @click.stop="onClickLabel(dataset.dataset_id)"></div>
                  <div class="action-image pointer" v-if="!isSampleDataset(dataset.owner_user_id)"><img v-bind:data-pid="dataset.dataset_id" src="/console/image/Rename.svg" alt="Rename" @click.stop="onClickRenameIcon(dataset.dataset_id, dataset.owner_user_id)"></div>
                  <div class="action-image pointer"><img v-bind:data-did="dataset.dataset_id" src="/console/image/Delete.svg" alt="Delete" @click.stop="deleteDataset(dataset.dataset_id, dataset.owner_user_id)"></div>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <Loading2 :isLoading="isDatasetListLoading()" />
      </div>
    </div>
    <div id="right-menu-border" class="menu-border" @mousedown="resizeRightMenu"></div>
    <div id="dataset-data-list">
      <div id="dataset-data-container">
        <div id="preview-header-area" class="dataset-data-title box box-align-center border-bottom">
          <div>
            <em>{{vueTexts.PREVIEW}}</em>
          </div>
          <div v-if="(previewHeader && previewHeader.length && previewList && previewList.length) || isDatasetCacheNotFoundErrorFromStore()">
            <img :class="previewPage === 1 ? '' : 'pointer'" src="/console/image/ArrowLeft2.svg" @click="getFirstPage">
            <img :class="previewPage === 1 ? '' : 'pointer'" src="/console/image/ArrowLeft.svg" @click="getPreviousPage">
            <input :value="previewPage" @blur="getPreviewPage" :tabindex="isShowingDialog ? -1 : 0">
            <span>/ {{getMaxPage()}}</span>
            <img :class="previewPage === getMaxPage() ? '' : 'pointer'" src="/console/image/Arrow.svg" @click="getNextPage">
            <img :class="previewPage === getMaxPage() ? '' : 'pointer'" src="/console/image/Arrow2.svg" @click="getLastPage">
          </div>
        </div>
        <div id="dataset-name-area" class="border-bottom ellipsis" v-if="(previewHeader && previewHeader.length && previewList && previewList.length) || isDatasetCacheNotFoundErrorFromStore()">
          <div class="ellipsis">
            <img class="dataset-additional-info-icon" src="/console/image/TableRow.svg">
            <span>{{getPreviewColumnAndRows().row}} {{ vueTexts.ROWS }}</span>
          </div>
          <div class="ellipsis">
            <img class="dataset-additional-info-icon" src="/console/image/TableCol.svg">
            <span>{{getPreviewColumnAndRows().column}} {{ vueTexts.COLS }}</span>
          </div>
        </div>
        <div id="dataset-preview-area">
          <div id="dataset-preview-list" @scroll="onscroll">
            <table v-if="previewHeader && previewHeader.length && previewList && previewList.length && !isDatasetCacheNotFoundErrorFromStore()">
              <thead>
                <tr>
                  <th id="index-column" class="dataset-preview-heading index-column"></th>
                  <th v-for="(header, i) in previewHeader" :key="'header' + i" :id="'data_' + i" class="dataset-preview-heading">{{header}}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(preview, rowIndex) in previewList" :key="'preview' + rowIndex">
                  <td class="dataset-preview-content line-number">
                    <div>{{previewOffset + rowIndex + 1}}</div>
                  </td>
                  <td v-for="(column, columnIndex) in preview" :key="'column' + columnIndex" :class="['dataset-preview-content', column.original ? 'pointer' : '']" @click="getOriginalFile(column.original, rowIndex, columnIndex)">
                    <div v-if="column.type == 'text/plain'">{{column.data}}</div>
                    <div v-else>
                      <span class="shape">{{convertToShape(columnIndex)}}</span>
                      <img v-bind:src="`data:${column.type};base64,${column.data}`">
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <span v-else-if="isDatasetCacheNotFoundErrorFromStore()">{{vueTexts.SOME_PIECES_OF_DATA}}<br>{{vueTexts.TRY_AGAIN}}</span>
          </div>
          <div id="dataset-preview-loading-area" v-if="isDatasetPreviewLoading()">
            <Loading2 :isLoading="isDatasetPreviewLoading()" />
          </div>
        </div>
      </div>
    </div>
    <div id="action-list">
      <ul class="action-list-area">
        <li v-bind:class="checked() ? 'action-list-item pointer' : 'action-list-item disabled'" @click="deleteAll">{{vueTexts.DELETE}}</li>
      </ul>
    </div>
    <label-dialog
      v-if="shouldShowDialog"
      :title="vueTexts.LABEL_TITLE"
      :labelList="getDatasetLabelList()"
      :allLabelList="getAllLabelList()"
      :vueTexts="vueTexts"
      :selectOptionLabels="getSelectOptionlabels()"
      :callback="onUpdate"
      :createNewLabelCallback="onCreateLabel"
      :cancelCallback="onCancel"
    />
    <upload-dataset-dialog
      v-if="shouldShowUploadDialog"
      :title="vueTexts.UPLOAD_DATASET_TITLE"
      :vueTexts="vueTexts"
      :dialogTexts="dialogTexts"
      :callback="uploadDatasetFromBrowser"
      :cancelCallback="onCancelUploadDataset"
    />
  </div>
</template>

<script lang="ts" src="./Dataset.ts"></script>
