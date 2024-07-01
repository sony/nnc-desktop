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
import { ref, nextTick, reactive, computed } from 'vue';
import { useDefinitionsStore } from '@/stores/misc/definitions'
import { useLanguageStore } from '@/stores/misc/languages'
import { useEditorStore } from '@/stores/editor'
import ShowMessageRegistrable from './ShowMessageRegistrable.vue'
import ShowMessageNonRegistrable from './ShowMessageNonRegistrable.vue'
const definitions_store = useDefinitionsStore()
const editor_store = useEditorStore()
const language_store = useLanguageStore()
const language = reactive(language_store.language)
const {
    hasShareTenant,
    tenantId
} = storeToRefs(editor_store)
const buttonRegist = ref<any>(null)

const registrable = computed(() => {
    return definitions_store.Definitions.REGISTRABLE();
})

function buttonRegistOnClick() {
    buttonRegist.value.click()
}

</script>

<template>
    <div class="job-action-control-regist">
        <template v-if="registrable">
            <div class="dropdown-message">
                <ShowMessageRegistrable />
            </div>
            <div class="btn-regist" @click="buttonRegistOnClick">
                <div><a :href="hasShareTenant ? '/console/#/serviceSettings?tenant_id=' + tenantId : '/console/#/serviceSettings'" ref="buttonRegist">{{language.controller.ENTER_CREDIT_CARD}}</a></div>
            </div>
        </template>
        <template v-else>
            <div class="dropdown-message">
                <ShowMessageNonRegistrable />
            </div>
        </template>
    </div>
</template>