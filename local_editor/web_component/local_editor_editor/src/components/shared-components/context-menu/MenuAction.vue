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
import {useDatasetStore} from '@/stores/dataset'
import {useEditorStore} from '@/stores/editor'
import {useDefinitionsStore} from '@/stores/misc/definitions'
import {useUtilsStore} from '@/stores/utils'
import {useResultStore} from '@/stores/result'
import { storeToRefs } from 'pinia';
import { nextTick, reactive, ref } from 'vue';
const definitions_store = useDefinitionsStore()
const result_store = useResultStore()
const props = defineProps<{
    text: any,
    action: any, 
    disabled: boolean
}>()
const emit = defineEmits([
    'closeMenu' 
])

function _action(e: any) {
    if (typeof props.action == 'function') { props.action(e); };
    emit('closeMenu', false);
}

</script>

<template>
    <span v-if="!disabled" v-on:click.prevent.stop="_action" class="item-text">{{ text }}</span>
    <span v-else class="item-text disabled">{{ text }}</span>
</template>