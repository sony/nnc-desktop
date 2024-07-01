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
import { storeToRefs } from 'pinia'
import { nextTick, reactive, ref, computed, onMounted } from 'vue';
import {useLanguageStore} from '@/stores/misc/languages'
import {useEditorStore} from '@/stores/editor'
import {useUtilsStore} from '@/stores/utils'
import {useDefinitionsStore} from '@/stores/misc/definitions'
import {useConfigStore} from '@/stores/config'
import StructureSearch from './StructureSearch.vue'
import NncCheckbox from '@/components/shared-components/NncCheckbox.vue'
const config_store = useConfigStore()
const utils_store = useUtilsStore()
const editor_store = useEditorStore()
const definitions_store = useDefinitionsStore()
const languages_store = useLanguageStore()
const language = reactive(languages_store.language)
const {data, active, meta} = storeToRefs(config_store)

const config = ref<any>(data.value[active.value.index])
const default_precision = ref<any>([
    {
        name: 'Float',
        value: 'Float'
    },
    {
        name: 'Half',
        value: 'Half'
    }
])
const max_display_metadata_length = ref<number>(20)

function onUpdateStructureSearch(v: any) {
    config_store.setActivedConfig(Object.assign(config_store.getActivedConfig(), {structure_search: v}))
    // this.$emit('update:value', Object.assign(this.config, {structure_search: v}));
}

function stripMultiByteChar(e: any) {
    let v = e.target.value
    var newValue = v.replace(/[^\x00-\x7E]+/g, ''); // leave control character in textarea
    config_store.setActivedConfig(newValue, 'description')
    // this.config.description = newValue;
}

function overWriteMaxEpoch(e: any) {
    let v = e.target.value
    if (v > definitions_store.Definitions.CONFIG.MAX_EPOCH) {
        config_store.setActivedConfig(definitions_store.Definitions.CONFIG.MAX_EPOCH, 'epoch')
        // this.config.epoch = definitions_store.Definitions.CONFIG.MAX_EPOCH;
    } else {
        config_store.setActivedConfig(v, 'epoch')
        // this.config.epoch = v;
    }
}

function showDialog() {
    editor_store.showMetaDialog(config_store.meta, [{name: 'Cancel',},{name: 'Update', action: (values: any) => {
        var metadata = values.split(',').map((value: any) => value.trim()).filter((value: any) => value);
        utils_store.callApi({
            url: definitions_store.Definitions.CORE_API.usersUrl() + '/projects/' + editor_store.projectId + '/metadata/tags',
            type: 'PUT',
            data: JSON.stringify({ "values": metadata }),
            contentType: 'application/json',
            dataType: 'json',
        }, () => {
            config_store.setMetaData(metadata);
        }, (error: any, status: any, httpErrorThrown: any) => {
            utils_store.handleXhrFailure(error, status, httpErrorThrown);
        });
    }}]);
}

</script>
<template>
    <div class="config-tab-global">
        <table class="description-table">
            <tr>
                <td class="project-description-label">
                    <label class="config-label">{{language.config.global.PROJECT_DESCRIPTION}}:</label>
                </td>
                <td class="project-description-textarea">
                    <textarea name="description" class="config-input-textarea" rows="5" cols="90" v-model="config.description" @blur="stripMultiByteChar" ></textarea>
                </td>
            </tr>
            <tr>
                <td class="project-tag-area">
                    <label class="config-label">{{language.config.global.PROJECT_TAG}}:</label>
                </td>
                <td>
                    <div class="project-metadata">
                        <template v-if="meta.length > max_display_metadata_length">
                            <div v-for="(_meta, i) in meta">
                                <div  class="project-tag" v-if="i < max_display_metadata_length">
                                    {{_meta}}
                                </div>
                            </div>
                            <div><a @click="showDialog">More</a><span class="more-info">({{meta.length - max_display_metadata_length}} data)</span></div>
                        </template>
                        <template v-else-if="meta.length > 0">
                            <div v-for="(_meta, i) in meta" class="project-tag">{{_meta}}</div>
                            <a @click="showDialog">{{language.config.global.EDIT}}</a>
                        </template>
                        <template v-else>
                            <a @click="showDialog">{{language.config.global.EDIT}}</a>
                        </template>
                    </div>
                </td>
            </tr>
        </table>
        <table class="epoch-batchsize-table">
            <tr>
                <td class="max-epoch-label">
                    <label class="config-label">{{language.config.global.MAX_EPOCH}}:</label>
                </td>
                <td class="max-epoch-input">
                    <input type="number" class="config-short-input no-spin-buttons" v-model="config.epoch" step="any" @blur="overWriteMaxEpoch" />
                </td>
                <td class="save-best-checkbox">
                    <NncCheckbox 
                        :label="language.config.global.SAVE_BEST" 
                        :disabled="false"
                        v-model="config.save_best" />
                </td>
            </tr>
            <tr>
                <td class="batch-size-label">
                    <label class="config-label">{{language.config.global.BATCH_SIZE}}:</label>
                </td>
                <td>
                    <input type="number" class="config-short-input no-spin-buttons" v-model="config.batch" step="any" />
                </td>
            </tr>
            <tr>
                <td class="batch-size-label">
                    <label class="config-label">{{language.config.global.PRECISION}}:</label>
                </td>
                <td class="config-global-select">
                    <label class="select_label" id="precision_label">
                        <select class="select_menu" id="precision" name="precision-type" v-model="config.precision">
                            <option v-for="precision in default_precision" :value="precision.value">
                                {{ precision.name }}
                            </option>
                        </select>
                    </label>
                </td>
            </tr>
            <tr>
                <td class="monitor-interval-label">
                    <label class="config-label">{{language.config.global.MONITOR_INTERVAL}}:</label>
                </td>
                <td>
                    <input type="number" class="config-short-input no-spin-buttons" v-model="config.monitor_interval" step="any" />
                </td>
                <td class="monitor-interval-unit">
                    <span>{{language.config.global.EPOCH}}</span>
                </td>
            </tr>
        </table>
        <StructureSearch
            :value="config.structure_search" 
            @update-value="onUpdateStructureSearch"
            @update-num-parallel=""
            @update-time-limit=""
            @update-value-name=""
        />
    </div>
</template>