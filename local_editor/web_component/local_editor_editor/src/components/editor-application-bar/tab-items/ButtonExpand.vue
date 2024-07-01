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
interface Document {
    exitFullscreen: () => void;
    mozCancelFullScreen: () => void;
    webkitExitFullscreen: () => void;
    fullscreenElement: () => void;
    mozFullScreenElement: () => void;
    webkitFullscreenElement: () => void;
}

function onClick() {
    let document_any:any 
    document_any = document
    if (document_any.webkitIsFullScreen) {
        if (document_any.webkitExitFullscreen) {
            document_any.webkitExitFullscreen();
        }
    } else {
        let elem: any
        elem = document.querySelector('body');
        if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        }
    }
}
</script>

<template>
    <div class="nnc-invoker navbar-el" @click.prevent="onClick">
        <img src="@/assets/image/ExpandWhite.svg" class="navbar-img nnc-enabled" title="Full screen (F11)" />
    </div>
</template>
