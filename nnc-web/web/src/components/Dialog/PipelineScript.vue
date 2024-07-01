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

<!-- src/components/Dialog/PipelineScript.vue -->
<template>
  <div id="upload-data-source-dialog">
    <div id="upload-data-source-dialog-main">
      <div>{{dialogTexts.TITLE}}</div>

      <div class="dialog-content">
        <div>
          <div>{{dialogTexts.PRE_PROCESS}}</div>
          <FileUpload
            id="pre-process-input"
            :small="true"
            :fileName="preProcessFile.name || ''"
            :errorMessage="preProcessError"
            @select-file="(file) => onSelectFile(file, true)"
          />
          <template v-if="currentPreProcess.scriptId">
          <div class="current-script-info">
            <div>{{dialogTexts.UPDATE_DATE}} : {{currentPreProcess.updateDatetime}}</div>
            <div class="img-area">
              <img v-if="isCompleted(currentPreProcess)" src="/console/image/Download.svg" alt="Download" @click.stop="$emit('download', currentPreProcess.scriptId)">
            </div>
          </div>
          <div v-if="!isCompleted(currentPreProcess)">{{dialogTexts.UPLOADING_OR_FAILED}}</div>
          <div v-if="isRollbackCompleted(currentPreProcess)">{{dialogTexts.ROLLBACK_COMPLETED}}</div>
          </template>
        </div>
        <div class="post-process-area">
          <div>{{dialogTexts.POST_PROCESS}}</div>
          <FileUpload
            id="post-process-input"
            :small="true"
            :fileName="postProcessFile.name || ''"
            :errorMessage="postProcessError"
            @select-file="(file) => onSelectFile(file, false)"
          />
          <template v-if="currentPostProcess.scriptId">
          <div class="current-script-info">
            <div>{{dialogTexts.UPDATE_DATE}} : {{currentPostProcess.updateDatetime}}</div>
            <div class="img-area">
              <img v-if="isCompleted(currentPostProcess)" src="/console/image/Download.svg" alt="Download" @click.stop="$emit('download', currentPostProcess.scriptId)">
            </div>
          </div>
          <div v-if="!isCompleted(currentPostProcess)">{{dialogTexts.UPLOADING_OR_FAILED}}</div>
          <div v-if="isRollbackCompleted(currentPostProcess)">{{dialogTexts.ROLLBACK_COMPLETED}}</div>
          </template>
        </div>
        <div>
          <div class="file-names">{{ dialogTexts.FILE_NAME }}</div>
          <div v-for="(resultFile, i) in inputtedResultFiles" :key="'file' + i">
            <input class="output-file-name" :value="resultFile.value" @input="onInputName($event.target.value, i)" />
            <div class="error-message" v-if="resultFile.errorMessage">{{resultFile.errorMessage}}</div>
          </div>
          <div class="add-area" v-if="!isMaxFileName">
              <img class="add-img" src="/console/image/AddNew.svg" @click="addFileName" />
          </div>
        </div>
      </div>

      <div class="button-area">
        <button class="button cancel" @click="$emit('cancel')">Cancel</button>
        <button class="button update" @click="onClickUpdate" :disabled="disabled">Update</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./PipelineScript.ts"></script>
