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
import { storeToRefs } from 'pinia';
import { useDefinitionsStore } from '@/stores/misc/definitions'
import {useInferenceStore} from '@/stores/inference'
import { useEditorStore } from '@/stores/editor'
import { useLanguageStore } from '@/stores/misc/languages'
import uploadSvg from "@/assets/image/upload.svg"
import { computed, onMounted, ref, reactive } from 'vue'
import * as path from 'path-browserify';
const editor_store = useEditorStore()
const inference_store = useInferenceStore()
const language_store = useLanguageStore()
const language = reactive(language_store.language)
const definitions_store = useDefinitionsStore()
const props = defineProps<{
    title: string, 
    callback: Function,
    cancelCallback: Function
}>()
const {
  uploaded_inputs,
  supported_input_ext
} = storeToRefs(inference_store)
const {currentLang} = storeToRefs(language_store)
const LANG = ref<string>(currentLang.value.toLocaleLowerCase())

const isOnArea = ref<boolean>(false)
const files = ref<any>([])
const isChecked = ref<boolean>(false)
const uploadErrorMessage = ref<string>('')
const uploaded = ref<any>([])

const noUploadedInputs = computed(() => {
    return uploaded.value.length <= 0
})

function onArea() {
    isOnArea.value = true
}

function dropFile(e: any) {
  isOnArea.value = false;
  if (e.target.files) {
      files.value = e.target.files;
  } else if (e.dataTransfer.files) {
      files.value = e.dataTransfer.files;
  }
  isChecked.value = false;
  checkFile(files.value);
}

function offArea() {
    isOnArea.value = false;
}

function checkFile(files: any) {
  uploaded.value = []
  for (let i = 0; i < files.length; i++) {
    const input = files[i].path;
    if(supported_input_ext.value.indexOf(path.extname(input)) >= 0) {
      uploaded.value.push(input)
    }
  }
  uploaded_inputs.value = uploaded.value
  if(uploaded.value.length > 0) {
    isChecked.value = true
  }
}

function clickInput() {
  const inputId: HTMLElement | null = document.getElementById('input-upload-inference');
  if (inputId) {
    inputId.click();
  }
}

function onClickUpload() {
    editor_store.shouldShowUploadDialog = false
    props.callback()
    uploaded.value = []
}

function onClickCancel() {
  uploaded.value = []
  props.cancelCallback()
}

</script>

<template>
    <div id="label-dialog">
        <div id="label-dialog-main">
            <div>{{title}}</div>
            <div class="drop-area" :class="isOnArea ? 'on-area' : ''" @dragover.prevent="onArea" @drop.prevent="dropFile" @dragleave.prevent="offArea" @dragend.prevent="offArea" @click="clickInput">
              <label class="label-upload-inference" @click.stop>
                  <img class="upload-img" src="@/assets/image/upload.svg" alt="Upload">
                  {{language.inference.DROP_OR_CLICK}}
                  <input id="input-upload-inference" @change="dropFile" type="file" multiple style="display:none">
              </label>
            </div>

            <div v-if="!noUploadedInputs" class="inputs-list-container">
              <div class="overflow-y-auto">
                <div v-for="input in uploaded" style="padding: 3px 6px;">
                  <p class="ellipsis-text" style="margin-bottom: 0;" :title="input" >{{input}}</p>
                </div>
              </div>

            </div>

            <div v-if="uploadErrorMessage.length" class="upload-error-msg-area">
                {{uploadErrorMessage}}
            </div>

            <div class="button-area">
                <button class="button cancel" @click="onClickCancel()">Cancel</button>
                <button :disabled="noUploadedInputs" class="button update" @click="onClickUpload()">Run</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
#label-dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 100;
  background-color: rgba(38, 38, 38, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

#label-dialog-main {
  width: 29.2rem;
  padding: 1.6rem;
  background: var(--color-gray0);
  font-family: "SSTUI-Medium", sans-serif;
  padding-top: 1.3rem;
  padding-bottom: 1rem;
}

.ellipsis-text {
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

#label-dialog .button-area {
  margin-top: 1rem;
  text-align: right;
}

.inputs-list-container {
  overflow-y: overlay;
  overflow-x: auto;
  height: 8rem;
  margin-top: 1rem;
  border: 1px solid #c6c6c6; 
}

.inputs-list {
  padding: 0; 
  max-height: 8rem;
}

#label-dialog .button {
  font-family: "SSTUI-Medium", sans-serif;
  width: 6.2rem;
  height: 2rem;
  border: none;
  border-radius: 1.6rem;
  margin-right: 1rem;
  outline: none;
  cursor: pointer;
}

#label-dialog .button:hover {
  opacity: 0.75;
}

#label-dialog .button.cancel {
  color: var(--color-brand);
  background: var(--color-gray1);
}

#label-dialog .button.update {
  color: var(--color-gray0);
  background: var(--color-brand);
  margin-right: 0;
}

#label-dialog .button.update[disabled] {
  color: var(--color-gray0);
  background: var(--color-brand);
  opacity: 0.4;
  margin-right: 0;
}

#label-dialog-main .input-area {
  margin-top: 2rem;
  margin-bottom: 2rem;
}

.drop-area {
  margin-top: 1rem;
  padding: 1rem;
  text-align: center;
  border: 1px dashed #c6c6c6;
  background-color: #f9f9f9;
  height: 8rem;
  cursor: pointer;

  label {
    display: block;
  }

  &.small {
    height: auto;
    padding: 0.8rem 0.16rem;
    margin-top: 0;

    label {
      line-height: normal;
    }
    & + .file-name-area {
      margin-top: 0;
      margin-bottom: 0;
    }
  }

  &.disabled {
    opacity: 0.5;
    cursor: auto;
    label {
      cursor: auto;
    }
  }
}

.on-area {
  border: 2px dashed #bcbcbc;
  background-color: #fafdff;
}

.label-upload-inference {
  cursor: pointer;
  line-height: 6rem;
}

.upload-img {
  width: 1.5rem;
  vertical-align: middle;
}

</style>