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
import { ref, computed } from 'vue';
const props = defineProps<{
    imageName: string, 
    disabled: boolean
}>()

const imagePath = computed(() => {
    return "src/assets/image/Zoom" + props.imageName + ".svg"
})

</script>
<template>
    <div v-if="imageName === 'Out'">
        <img v-if="disabled" :src="imagePath" class="icon nnc-disabled" />
        <img v-else          :src="imagePath" class="icon nnc-enabled nnc-invoker" @click.stop.prevent="$emit('pressed')" />
    </div>
    <div v-else>
        <img v-if="disabled" :src="imagePath" class="icon nnc-disabled" />
        <img v-else          :src="imagePath" class="icon nnc-enabled nnc-invoker" @click.stop.prevent="$emit('pressed')" />
    </div>
</template>