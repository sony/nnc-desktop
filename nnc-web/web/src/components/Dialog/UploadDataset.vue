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

<!-- src/components/UploadDataset.vue -->
<template>
  <div id="label-dialog">
    <div id="label-dialog-main">
      <div>{{title}}</div>
      <div class="drop-area" :class="isOnArea ? 'on-area' : ''" @dragover.prevent="onArea" @drop.prevent="dropFile" @dragleave.prevent="offArea" @dragend.prevent="offArea" @click="clickInput">
        <label class="label-upload-dataset" @click.stop>
          <img class="upload-img" src="/console/image/upload.svg" alt="Upload">
          {{vueTexts.DROP_OR_CLICK}}
          <input id="input-upload-dataset" @change="dropFile" type="file" style="display:none">
        </label>
      </div>
      <div v-if="!isChecked" class="file-name-area">
        {{fileName}}
      </div>
      <div class="upload-msg-area">
        <div>{{dialogTexts.UPLOAD_DATASET_FILE_SIZE_IS_EXCEEDED}}</div>
        <div><a href="https://support.dl.sony.com/docs-ja/dataupload" target="_blank">{{dialogTexts.ABOUT_DATASET_UPLOAD}}</a></div>
      </div>
      <div v-if="uploadErrorMessage.length" class="upload-error-msg-area">
        {{uploadErrorMessage}}
      </div>
      <div v-else-if="messageInvalid.length" class="upload-error-msg-area">
        {{messageInvalid}}
      </div>
      <div class="new-dataset-name-area" v-if="isChecked">
        {{vueTexts.ENTER_NEW_DATASET_NAME}}
        <div  class="edit-dataset-name-area">
          <input :id="(!isInvalid) ? 'new-dataset-name' : 'error-new-dataset-name'" @input="inputNewName($event.target.value)"  maxlength="255" :value="newDatasetName"/>
        </div>
      </div>
      <div class="invalid-dataset-name" v-if="isInvalid">
        {{vueTexts.INVALID_CHARACTER_INCLUDED}}
      </div>
      <div class="invalid-dataset-name" v-else-if="isTooShortOrLong">
        {{vueTexts.NAME_IS_TOO_SHORT_OR_LONG}}
      </div>
      <div class="button-area">
        <button class="button cancel" @click="cancelCallback">Cancel</button>
        <button :disabled="!isChecked || (isInvalid || isTooShortOrLong || isExceededDatasetLimitSize())" class="button update" @click="onClickUpload">Upload</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./UploadDataset.ts"></script>
