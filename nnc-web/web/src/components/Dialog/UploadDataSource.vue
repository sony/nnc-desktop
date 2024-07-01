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

<!-- src/components/Dialog/UploadDataSource.vue -->
<template>
  <div id="upload-data-source-dialog">
    <div id="upload-data-source-dialog-main">
      <div>{{title[operationType]}}</div>

      <div class="operation-type">
        <radio @input="onChangeOperationType" name="operationType" :value="operationType" choice="upload" :label="dialogTexts.UPLOAD" />
        <radio @input="onChangeOperationType" name="operationType" :value="operationType" choice="change" :label="dialogTexts.CHANGE" :disabled="isUploading" />
      </div>
      <div v-if="isUpload()" class="dialog-content">
        <div class="data-source-select">
          <div>{{dialogTexts.DATA_SOURCE_NAME}}</div>
          <label class="select-label">
            <select class="select-menu" @change="onChangeDataSourceName" :value="dataSourceName" :disabled="isUploading">
              <option v-for="(dataSource, i) in dataSourceList" :key="'dataSource' + i">{{dataSource.name}}</option>
            </select>
          </label>
        </div>
        <div>{{dialogTexts.SUPPORTED}}</div>
        <FileUpload
          :errorMessage="uploadErrorMessage"
          @select-file="onSelectFile"
          :disabled="isUploading"
          :fileName="(file || {}).name"
        />

        <div class="input-file-name-area" v-if="showFileNameInput">
          <div>{{dialogTexts.ENTER_FILE_NAME}}</div>
          <input class="input-file-name" v-model="inputtedFileName" :disabled="isUploading" />
          <div class="error-message" v-if="inputFileError">{{inputFileError}}</div>
        </div>

        <div id="data-upload-progress" v-if="isUploading">
          <div class="progress-area">
            <div class="progress-bar-area">
              <div class="progress-bar-container" />
              <div :class="['progress-bar-value', progress >= 100 ? 'full' : '']" :style="`width:${progress}%;`" />
            </div>
            <div class="value"><span>{{progress}}%</span></div>
          </div>
        </div>

        <Loading2 :isLoading="isUploadApiCall" />
      </div>
      <!-- data source change -->
      <div v-else class="dialog-content">
        <!-- <div>データソースリスト</div> -->
        <div v-for="(dataSource, i) in copiedDataSourceList" :key="'data' + i">
          <div class="data-source-name">
            <div class="title">{{vueTexts.DATA_SOURCE_NAME}}</div>
            <div class="name"><input :value="dataSource.name" :disabled="true"></div>
          </div>
          <div class="trigger-area">
            <div class="checkbox-area">
              <input
                type="checkbox"
                :id="'trigger' + i"
                class="checkbox"
                @click="onClickTrigger(i, $event.target.checked)"
                :checked="dataSource.trigger"
              >
              <label :for="'trigger' + i" @click.stop></label>
            </div>
            <div>{{ vueTexts.TRIGGER }}</div>
          </div>
        </div>
        <div v-if="!hasChecked" class="error-message">
          {{dialogTexts.CHECK_TRIGGER_ERROR}}
        </div>
      </div>
      <div class="button-area">
        <button class="button cancel" @click="onClickCancel" :disabled="isUploadApiCall">Cancel</button>
        <button v-if="isUpload()" class="button update" @click="onClickUpload" :disabled="disabledUploadButton">Upload</button>
        <button v-else class="button update" @click="onClickUpdate" :disabled="!hasChecked">Update</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./UploadDataSource.ts"></script>
