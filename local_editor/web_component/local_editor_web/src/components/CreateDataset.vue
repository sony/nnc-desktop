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

<!-- src/components/CreateDataset.vue -->
<template>
  
  <div id="copy-area" @click.stop>
    <div class="box box-pack-justify">
      <div id="upload-dataset-message">
        <span>
          Please copy or move the dataset folder to 
          <span id="save-dir">{{save_dir}}</span>, and then enter that folder name below.
        </span>
      </div>
      <div class="remove-icon pointer" @click="close">
        <img src="/console/image/Remove.svg">
      </div>
    </div>
    <div id="upload-dataset-url-area" @click.stop>
      <label for="dataset-upload-input" id="dataset-upload-input-label">
        <span>Folder Name </span>
      </label>
      <input id="upload-dataset-input" type='text' v-model="datasetPath" spellcheck="false">
    </div>

    <div id="upload-dataset-button-area" class="box box-pack-justify">
      <button :disabled="!datasetPath.length || isUploading" class="button-area pointer" id='start-btn' @click="onClickStart">Start</button>
    </div>
  </div>

</template>

<script lang="ts" src="./CreateDataset.ts"></script>>
<style scoped>
  #upload-dataset-url-area {
    border: none;
  }
  #upload-dataset-input {
    border: 0.1rem solid var(--color-gray2);
    border-radius: 0.2rem;
    padding-left: 0;
    color: initial;
    font-size: 1.5rem;
    width: 30.8rem;
  }
  #dataset-upload-input-label {
    padding-right: 0.2rem;
  }
  #start-btn {
    width: 100%;
  }
  #start-btn[disabled] {
    opacity: 0.4;
  }
  #save-dir{
    color: var(--color-brand);
  }
</style>