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
import {useDefinitionsStore} from '@/stores/misc/definitions'
import {useResultStore} from '@/stores/result'
import { nextTick, reactive, ref } from 'vue';
import MenuAction from './MenuAction.vue'
import MenuSeparator from './MenuSeparator.vue'
import MenuSubmenu from './MenuSubmenu.vue'
const definitions_store = useDefinitionsStore()
const result_store = useResultStore()
const props = defineProps<{
    menuItems: any, 
    isSub: boolean
}>()
const emit = defineEmits([
    'closeMenu', 
])
const open = ref<boolean>(false)
const top = ref<any>(0)
const left = ref<any>(0)
const excludeClass = ref(null)
const $contextmenu = ref<any>(null)
defineExpose({
    open,
    top,
    left,
    excludeClass,
    open_menu, // open
    open_submenu, // open_submenu
    closeMenu // close_menu
})

function open_menu(params: any) {
    open.value = true;
    if (params && params.excludeClass) {
        excludeClass.value = params.excludeClass
    }
    nextTick(() => {
        var parentDom = params.parent;
        var x, y;
        var jqueryParentDom: any = $(parentDom)
        if(!params.point) {
            y = params.event.pageY - jqueryParentDom.offset().top;
            x = params.event.pageX - jqueryParentDom.offset().left;
            if (window.innerHeight < (y + $contextmenu.value.offsetHeight)) {
                y = window.innerHeight - $contextmenu.offsetHeight - 48;
            }
            if (window.innerWidth < (x + $contextmenu.value.offsetWidth)) {
                x = window.innerWidth - $contextmenu.value.offsetWidth - 48;
            }
        } else {
            y = params.event.pageY - jqueryParentDom.offset().top + 10;
            x = parentDom.offsetWidth - jqueryParentDom.offset().left - 40;
            if (window.innerHeight < (y + $contextmenu.value.offsetHeight)) {
                y -= $contextmenu.value.offsetHeight + 24;
            }
            if (window.innerWidth < (x + $contextmenu.value.offsetWidth)) {
                x -= $contextmenu.value.offsetWidth + 24;
            }
        }
        top.value = y + 'px';
        left.value = x + 'px';
    });
    clickListenStart();
}

function open_submenu(params: any) {
    open.value = true;
    nextTick(() => {
        var parentDom = params.parent;
        var x = $(parentDom).outerWidth();
        top.value = '0px';
        left.value = x + 'px';
    });
    clickListenStart();
}

function close_menu() {
    open.value = false;
    clickListenStop();
}

function clickListenStart() {
    window.addEventListener('click', onclick, true);
    window.addEventListener('contextmenu', onclick, true);
    window.addEventListener('keyup', onescape, true);
}

function onclick(e: any) {
    if (open.value && !$contextmenu.value.contains(e.target) && !(excludeClass.value === e.target.className)) {
        open.value = false;
        clickListenStop();
    }
}

function onescape(e: any) {
    if (e.keyCode === definitions_store.Definitions.KEY_CODE.ESC) onclick(e);
}

function clickListenStop() {
    window.removeEventListener('click', onclick, true);
    window.removeEventListener('contextmenu', onclick, true);
    window.removeEventListener('keyup', onescape, true);
}

function _shouldShowCheck(text: any) {
    const graphData = result_store.training_graph
    switch (text) {
        case definitions_store.Definitions.CONTEXT.TRAINING_AND_VALIDATION:
            return graphData.show_training_error && graphData.show_validation_error;
        case definitions_store.Definitions.CONTEXT.TRAINING:
            return graphData.show_training_error && !graphData.show_validation_error;
        case definitions_store.Definitions.CONTEXT.VALIDATION:
            return graphData.show_validation_error && !graphData.show_training_error;
        case definitions_store.Definitions.CONTEXT.LOG_SCALE_GRAPH:
            return graphData.scale === 'log';
        default:
            return false;
    }
}

function closeMenu(isMouseLeave: boolean) {
    close_menu()
    if (props.isSub) {
        emit('closeMenu', isMouseLeave);
    }
}

function submenuShow(params: any) {
    open.value = true
    open_submenu(params)
}

function submenuHide(isMouseLeave: boolean) {
    open.value = false
    closeMenu(isMouseLeave)
}

</script>

<template>
    <ul v-if="open" class="context-menu" ref="$contextmenu" tabindex="-1" v-bind:style="{ top: top, left: left }" >
        <li v-for="item in menuItems" class="context-menu-item">
            <span class="check-mark-context" v-if="_shouldShowCheck(item.text)">✓ </span>
            <MenuAction    
                v-if="item.type=='action'" 
                :text=item.text 
                :action=item.action 
                :disabled=item.disabled
                @close-menu="closeMenu"
            />
            <MenuSeparator v-if="item.type=='separator'"/>
            <MenuSubmenu   
                v-if="item.type=='submenu'" 
                :text=item.text 
                :action=item.action 
                :submenu=item.submenu
                @open-submenu="submenuShow"
                @close-menu="submenuHide"
            />
        </li>
    </ul>
</template>