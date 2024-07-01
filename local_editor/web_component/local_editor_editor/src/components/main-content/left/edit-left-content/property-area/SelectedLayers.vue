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
import { useEditorStore } from '@/stores/editor'
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
const editor_store = useEditorStore()
const {selection}  = storeToRefs(editor_store)

const number = computed(() => {
    return Math.max(0, selection.value.all.length - 1)
})

const total = computed(() => {
    return (selection.value.all || []).length
})

function text(number: number) {
    return 'layer' + (number === 1 ? ' is' : 's are') + ' selected.'
}

</script>

<template>
    <div style="height: 24px; padding-left: 48px;">
        <span v-if="selection.main"><span v-if="number">and {{ number }} more {{ text(number) }}</span></span>
        <span v-else-if="total">{{ total }} {{ text(total) }}</span>
    </div>
</template>