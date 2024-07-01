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
// import $ from "jquery";
import { ref, reactive, onMounted, onBeforeUpdate } from 'vue';
import CenterContent from './center/CenterContent.vue'
import LeftContent from './left/LeftContent.vue'
import RightContent from './right/RightContent.vue'
import { useEditorStore } from '@/stores/editor'
import { useDatasetStore } from '@/stores/dataset'
import { useDefinitionsStore } from '@/stores/misc/definitions'
const editor_store = useEditorStore()
const dataset_store = useDatasetStore()
const definitions_store = useDefinitionsStore()

const currentActiveTabName = ref<string>('');

// hooks
onMounted(() => {
    const MIN_WIDTH = definitions_store.Definitions.MIN_WIDTH;
    $('.left-content').resizable({
        handles: "e",
        alsoResizeReverse: '.center-content',
        minWidth: MIN_WIDTH.LEFT_PANE,
        start: function() {
            $(this).css({'min-width': MIN_WIDTH.LEFT_PANE})
        },
        stop: function() {
            $(this).css({'min-width': $(this).width()})
        }
    });
    $('.center-content').resizable({
        handles: "e",
        alsoResizeReverse: '.right-content',
        maxWidth: $(window).width() - $('.left-content').width() - MIN_WIDTH.RIGHT_PANE,
        start: function() {
            const $rightContent = $('#right-content');
            $rightContent.css({'min-width': MIN_WIDTH.RIGHT_PANE})
        },
        stop: function() {
            const $rightContent = $('#right-content');
            $rightContent.css({'min-width': $rightContent.width()})
        }
    });
})

onBeforeUpdate(() => {
    if (currentActiveTabName.value !== editor_store.activeTabName) {
        currentActiveTabName.value = editor_store.activeTabName;
        dataset_store.visibleLinkingDataset = false;
    }
})

</script>

<template>
    <div :class="editor_store.readOnly ? 'read-only main-content' : 'main-content'">
        <LeftContent />
        <CenterContent />
        <RightContent />
    </div>
</template>
