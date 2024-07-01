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
import { ref, computed } from 'vue'
const props = defineProps<{modal: any}>()

const buttonHome = ref<null | { click: () => null }>(null)

const tabIndex = computed(() => {
    return props.modal.show ? -1 : 0;
})

function navigateHome(): void {
    buttonHome.value?.click()
}

</script>

<template>
    <div class="nnc-invoker navbar-el" @click="navigateHome">
        <a href="/console/#/dashboard" title="Home" ref="buttonHome" :tabIndex="tabIndex">
            <img src="@/assets/image/HomeWhite.svg" class="navbar-img nnc-enabled"/>
        </a>
    </div>
</template>
