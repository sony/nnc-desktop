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
import { ref, reactive, onMounted, computed } from 'vue'
import LayerType from './LayerType.vue'
import SelectedLayers from './SelectedLayers.vue'
import LayerProperties from './layer-properties/LayerProperties.vue'
import { useLanguageStore } from '@/stores/misc/languages'
import { useEditorStore } from '@/stores/editor'
const editor_store = useEditorStore()
const language_store = useLanguageStore()
const language = reactive(language_store.language)

const layer = computed(() => {
    if (editor_store.selection.props) {
        editor_store.selection.props.props.find((prop: any) => {
            // propertyにWithBiasがあり、falseだった場合は、sselectionのpropertyからb.で始まるものを省く
            if ((prop.name === 'WithBias') && (prop.value === "False" || prop.value === false)) {
                editor_store.selection.props.props = editor_store.selection.props.props.filter((prop: any) => !prop.name.match(/^b\..*$/));
                return editor_store.selection.props;
            }
        })
    }
    return editor_store.selection.props;
})

</script>

<template>
    <div class="property-area">
        <div class="title">{{language.edit.LAYER_PROPERTY}}</div>
        <LayerType :layer="layer" />
        <SelectedLayers/>
        <LayerProperties class="app-row app-scroll-x app-scroll-y" style="top: 88px; bottom: 0;"
            :layer="layer"
        />
    </div>
</template>