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
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue';
import {useLanguageStore} from '@/stores/misc/languages'
import { storeToRefs } from 'pinia';
import NncLoading from '@/components/shared-components/NncLoading.vue'
const languages_store = useLanguageStore()
const props = defineProps<{
    errorCode: string,
    errorMessage: string
}>()
const {
    currentLang
} = storeToRefs(languages_store)
const message = ref<any>({
    ja: '',
    en: '',
})
const image1 = ref<string>('')
const image2 = ref<string>('')
const isLoading = ref<boolean>(true)

onMounted(() => {
    init()
    getErrorMessage()
})

watch(() => props.errorCode, (newValue, oldValue) => {
    init()
    getErrorMessage()
  }
)

const isShowableLoading = computed(() => {
    return isLoading.value;
})

function init() {
    isLoading.value = true;
    message.value.ja = '';
    message.value.en = '';
    image1.value = '';
    image2.value = '';
}

function getErrorMessage() {
    $.ajax({
        type: 'get',
        url: `/console/error/job/${props.errorCode}.json`
    }).then((response) => {
        message.value.ja = response.message.ja;
        message.value.en = response.message.en;
        image1.value = response.image_1;
        image2.value = response.image_2;
        isLoading.value = false;
    }, (response) => {
        if (response && (response.status === 403 || response.status === 404)) {
            message.value.ja = props.errorMessage;
            message.value.en = props.errorMessage;
            image1.value = '';
            image2.value = '';
            isLoading.value = false;
        }
    });
}

</script>
<template>
    <div class="job-error-area">
        <NncLoading v-if="isShowableLoading" />
        <div class="error-message">{{message[currentLang.toLocaleLowerCase()]}}</div>
        <div class="imgs-area">
            <div v-if="image1" class="img-area">
                <img :src="image1" />
            </div>
            <div v-if="image2" class="img-area">
                <img :src="image2" />
            </div>
        </div>
    </div>
</template>