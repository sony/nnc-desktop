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
import { computed, nextTick, reactive, ref } from 'vue';
const props = defineProps<{
    index: number,
    pages: number
}>()

const onTheFirst = computed(() => { return props.index === 0; })

const onTheLast = computed(() => { return props.index === props.pages - 1; })

const enabled = computed(() => {return 'nnc-invoker pager-arrow nnc-enabled'})

const disabled = computed(() => {return 'pager-arrow nnc-disabled'})

</script>
<template>
    <div class="paging-menu pull-right">
        <img src="@/assets/image/ArrowLeft2.svg" v-if="onTheFirst" :class="disabled" />
        <img src="@/assets/image/ArrowLeft2.svg" v-else            :class="enabled" @click="$emit('first')" />
        <img src="@/assets/image/ArrowLeft.svg"  v-if="onTheFirst" :class="disabled"/>
        <img src="@/assets/image/ArrowLeft.svg"  v-else            :class="enabled" @click="$emit('prev')" />
        <span class="job-action-text">{{ 1 + index }} / {{ pages }}</span>
        <img src="@/assets/image/Arrow.svg"      v-if="onTheLast"  :class="disabled" />
        <img src="@/assets/image/Arrow.svg"      v-else            :class="enabled" @click="$emit('next')" />
        <img src="@/assets/image/Arrow2.svg"     v-if="onTheLast"  :class="disabled" />
        <img src="@/assets/image/Arrow2.svg"     v-else            :class="enabled" @click="$emit('last')" />
    </div>
</template>