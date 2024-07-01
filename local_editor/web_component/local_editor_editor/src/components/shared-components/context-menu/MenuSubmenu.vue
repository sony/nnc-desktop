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
import { computed, nextTick, reactive, ref } from 'vue';
import ContextMenu from './ContextMenu.vue'
const definitions_store = useDefinitionsStore()
const result_store = useResultStore()
const props = defineProps<{
    text: any,
    action: any, 
    submenu: any
}>()
const emit = defineEmits([
    'openSubmenu',
    'closeMenu'
])

const submenu_cm = ref<any>(null)
const submenu_root = ref<any>(null)

const active = computed(() => {
    return props.submenu.some((val: any) => { return (val.type == 'action' && !val.disabled) });
})

function submenu_show(e: any) {
    e.preventDefault();
    submenu_cm.value.open_submenu({ 'parent': submenu_root.value })
}

function submenu_hide(e: any) {
    submenu_cm.value.closeMenu(true)
}

function close_menu(isMouseLeave: any) {
    if (!isMouseLeave) {
        emit('closeMenu', '');
    }
}

</script>

<template>
    <span ref="submenu_root" v-if="active" v-on:click.prevent.stop="submenu_show"
        @mouseenter="submenu_show"
        @mouseleave="submenu_hide"
        class="item-text item-submenu">{{ text }}
        <ContextMenu ref="submenu_cm" :menuItems="submenu" :isSub="true" @closeMenu="close_menu"/>
    </span>
    <span v-else class="item-text disabled">{{ text }}</span>
</template>