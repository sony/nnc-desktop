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
          Please select your dataset csv file:
        </span>
      </div>
      <div class="remove-icon pointer" @click="close">
        <img src="/console/image/Remove.svg">
      </div>
    </div>
    <div id="upload-dataset-url-area" @click.stop>
      <label for="dataset-upload-input">
        <span>File Path:</span>
      </label>
      <div class="input-container">
        <button v-show="!datasetPath.length" class="button-area pointer input-part" @click="openFile">click to select</button>
        <input v-show="datasetPath" disabled class="input-part" id="upload-dataset-input" type="text"
          v-model="datasetPath" spellcheck="false" />
        <button v-show="datasetPath.length" class="clear-button" @click="clearDatasetPath">×</button>
      </div>
    </div>

    <div id="upload-dataset-button-area" class="box box-pack-justify">
      <button :disabled="!datasetPath.length || isUploading" class="button-area pointer" id='start-btn'
        @click="onClickStart">Start</button>
    </div>
  </div>

</template>

<script lang="ts" src="./CreateDataset.ts"></script>
<style scoped>
#upload-dataset-url-area {
  border: none;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

#upload-dataset-url-area .input-part {
  margin-left: 1rem;
  width: 100%;
  border: 0.1rem solid var(--color-gray2);
  border-radius: 0.2rem;
  padding-left: 0;
  color: initial;
  font-size: 1.5rem;
  padding-right: 2rem;
}

#upload-dataset-url-area label {
  width: 15%;
}

.input-container {
  position: relative;
  display: inline-flex;
  align-items: center;
  width: 85%;
}

.clear-button {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--color-gray2);
}

.clear-button:hover {
  color: #333;
}

#start-btn {
  width: 100%;
}

#start-btn[disabled] {
  opacity: 0.4;
}

#save-dir {
  color: var(--color-brand);
}
</style>