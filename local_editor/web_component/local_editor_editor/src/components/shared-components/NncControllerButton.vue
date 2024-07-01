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
import { ref, nextTick, reactive, computed } from 'vue';
const props = defineProps<{
    caption: string, 
    suspended: boolean, 
    disabled: boolean
}>()

const classValue = computed(() => {
    var value = 'job-action-control-content controller';
    if (props.suspended) {
        value += ' suspended';
    }
    if (props.disabled) {
        value += ' disabled';
    }
    return value;
})

</script>

<template>
    <div :class="classValue" @click.stop.prevent="$emit('pressed')">
        <span>{{ caption }}</span>
    </div>
</template>