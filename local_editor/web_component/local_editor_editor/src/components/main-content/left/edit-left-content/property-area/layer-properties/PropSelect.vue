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
const props = defineProps<{
    property: any, 
}>()
const emit = defineEmits([
    'update', 
])

function onchange(event: any) {
    emit('update', { name: props.property.name, value: event.target.value, });
}
</script>

<template>
    <div class="select_layer layer_property">
        <select :value="property.value" @change="onchange">
            <option v-for="value in property.choice" :checked="value === property.value">{{ value }}</option>
        </select>
    </div>
</template>