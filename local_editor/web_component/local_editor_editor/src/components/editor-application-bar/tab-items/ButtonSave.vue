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
import { useEditorStore } from '@/stores/editor';
const editor_store = useEditorStore()
</script>

<template>
    <div class="nnc-invoker navbar-el">
        <img v-if="editor_store.isLoadEnd" src="@/assets/image/SaveWhite.svg" class="navbar-img nnc-enabled" title="Save (Ctrl+S)" @click="$emit('click')" />
        <img v-else        src="@/assets/image/SaveWhite.svg" class="navbar-img nnc-disabled" />
    </div>
</template>
