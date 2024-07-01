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
import { useLanguageStore } from '@/stores/misc/languages'
import { useDefinitionsStore } from '@/stores/misc/definitions'
import NncRadio from '@/components/shared-components/NncRadio.vue'
import { computed, ref, reactive } from 'vue'
const definitions_store = useDefinitionsStore()
const language_store = useLanguageStore()
const language = reactive(language_store.language)
const props = defineProps<{
    title: string,
    file: any,
    onInput: any,
    onClear: any,
    errorMessage: string,
}>()

const isOnArea = ref<boolean>(false)

const fileName = computed(() => {
    return props.file ? props.file.name : ''
})

const text = computed(() => {
    return language.CREATE_PIPELINE;
})

function dropFile(e: any) {
    isOnArea.value = false;
    // dropと選択でtarget, dataTransferが分かれる
    const files = e.target.files || e.dataTransfer.files;
    const file = files[0];
    props.onInput(file);
    e.target.value = '';
}

function onArea() {
    isOnArea.value = true;
}

function offArea() {
    isOnArea.value = false;
}

</script>

<template>
    <div>
        <div class="row">
            <div class="title">{{title}}</div>
            <div class="value">
                <div :class="['drop-area', isOnArea ? 'on-area' : '']" @dragover.prevent="onArea" @drop.prevent="dropFile" @dragleave.prevent="offArea" @dragend.prevent="offArea" for="input-upload-project">
                    <label class="label-upload-project" @click.stop>
                        {{text.DROP_OR_CLICK}}
                        <input id="input-upload-project" @change="dropFile" type="file" style="display:none">
                    </label>
                </div>
                <div class="file-area" v-if="file">
                    <div>{{fileName}}</div>
                    <div><img class="delete-file" src="@/assets/image/Remove.svg" @click="onClear"/></div>
                </div>
                <div v-if="errorMessage" class="error-message">{{errorMessage}}</div>
            </div>
        </div>
    </div>
</template>