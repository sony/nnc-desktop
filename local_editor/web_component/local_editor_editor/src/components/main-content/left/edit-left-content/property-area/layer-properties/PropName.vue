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
import { ref } from 'vue';
const props = defineProps<{
    property: any, 
}>()
const emit = defineEmits([
    'renamed', 
    'renaming'
])

const oldPropertyName = ref<string>("")

function onfocus(event: any) {
    oldPropertyName.value = event.target.value
    event.target.select()
}

function onblur(event: any) {
    if (event.target.value !== oldPropertyName.value) {
        emit('renamed', event.target.value);
    }
}

function onkeydown(event: any) {
    switch (event.key) {
    case '!': case '@': case '#': case '$': case '%': case '^': case '&': case '*':
    case '(': case ')': case '-': case '+': case '=': case '|': case '\\': case '~':
    case '`': case '{': case '}': case '[': case ']': case ':': case ';': case '"':
    case ',': case '.': case '<': case '>': case '/': case '?':
        event.preventDefault();
        break;
    }
    if (event.key === '#') {
        document.execCommand('insertText', false, '_'); // to enable editing undo/redo by Ctrl+Z
    }
    // delay event emission; for event.target.value does not updated during keypress event.
    setTimeout(function() {
        emit('renaming', event.target.value);
    });
}

function defocus(event: any) {
    event.target.blur()
}

</script>

<template>
    <input type="text" 
    :value="property.value"
    @focus="onfocus"
    @blur="onblur"
    @keyup.enter="defocus"
    @keyup.esc="defocus"
    @keydown="onkeydown"
    />
</template>