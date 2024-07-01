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
import { storeToRefs } from 'pinia';
import { useDefinitionsStore } from '@/stores/misc/definitions'
import OpenNetworkMessage from './OpenNetworkMessage.vue'
import NoticeMessage from './NoticeMessage.vue'
import NoticeMessageWithLink from './NoticeMessageWithLink.vue'
import OpenNetworkWithWeightMessage from './OpenNetworkWithWeightMessage.vue'
import PluginParameterInput from './PluginParameterInput.vue'
import RetrainMessage from './RetrainMessage.vue'
import UnitSettingsInput from './UnitSettingsInput.vue'
import NncRadio from '@/components/shared-components/NncRadio.vue'
import NncCheckbox from '@/components/shared-components/NncCheckbox.vue'
import PublishApiDialog from '@/components/shared-components/PublishApiDialog.vue'
import CreatePipelineDialog from '@/components/shared-components/create-pipeline-dialog/CreatePipelineDialog.vue'
import { useLanguageStore } from '@/stores/misc/languages'
import { computed, onMounted, ref, reactive } from 'vue'
const language_store = useLanguageStore()
const language = reactive(language_store.language)
const definitions_store = useDefinitionsStore()
const props = defineProps<{
    data: any, 
}>()
const {currentLang} = storeToRefs(language_store)
const LANG = ref<string>(currentLang.value.toLocaleLowerCase())
const error_message = ref<string>('')
const metadata_error_message = ref<string>('')
const checked = ref<boolean>(false)
const privateChecked = ref<boolean>(false)
const unitValue = ref<any>({
    name: '',
    argName: '',
    value: '',
    type: 'Text',
    search: true
})
const unitTypeList = ref<any>([
    {name: 'Boolean', value: 'Boolean'},
    {name: 'BooleanOrMacro', value: 'BooleanOrMacro'},
    {name: 'Int', value: 'Int'},
    {name: 'IntArray', value: 'IntArray'},
    {name: 'PInt', value: 'PInt'},
    {name: 'PIntArray', value: 'PIntArray'},
    {name: 'PIntArrays', value: 'PIntArrays'},
    {name: 'UInt', value: 'UInt'},
    {name: 'UIntArray', value: 'UIntArray'},
    {name: 'Float', value: 'Float'},
    {name: 'FloatArray', value: 'FloatArray'},
    {name: 'FloatArrays', value: 'FloatArrays'},
    {name: 'Text', value: 'Text'},
    {name: 'File', value: 'File'},
])
const networkNameErrorMessage = ref<string>('can\'t be blank')
const argumentNameErrorMessage = ref<string>('')
const valueErrorMessage = ref<string>('')
const selectedTenant = ref<string>('')
const keywords = ref<string>('')
const isConfirm = ref<boolean>(false)
const pluginParameters = ref<any>([])
const userInput = ref<any>(null)
const userInputShareTenant = ref<any>(null)
const userInputTenant = ref<any>(null)
    

const lines = computed(() => {
    return props.data.message.split('\n');
})

const errorLines = computed(() => {
    return error_message.value.split('\n');
})

const getUserInput = computed(() => {
    return (userInput.value || {}).value;
})

const getUserInputShareTenant = computed(() => {
    const inputValue = {
        'projectName': (userInputShareTenant.value || {}).value,
        'tenantId': selectedTenant.value
    }
    return inputValue;
})

const getUserInputTenant = computed(() => {
    const inputValue = {
        'projectName': (userInputTenant.value || {}).value,
        'tenantId': props.data.tenantList[0].tenant_id
    }
    return inputValue;
})

const buttons = computed(() => {
    var actions = props.data.actions;
    return actions.slice(0, actions.length - 1);
})

const defaultButton = computed(() => {
    var actions = props.data.actions;
    return actions[actions.length - 1];
})

const isValidInput = computed(() => {
    return (!error_message.value);
})

const isValidCreateUnit = computed(() => {
    return (!networkNameErrorMessage.value) && (!argumentNameErrorMessage.value) && (!valueErrorMessage.value);
})

const inputType = computed(() => {
    return definitions_store.Definitions.PLUGIN.INPUT_TYPE;
})

const isValidPluginInput = computed(() => {
    return pluginParameters.value.findIndex((parameter: any) => !parameter.isValidChar || !parameter.isValidCharLength) === -1;
})

onMounted(() => {
    if (props.data.tenantList) {
        selectedTenant.value = props.data.tenantList[0].tenant_id;
    }

    if (props.data.metaList) {
        // deepコピーする
        keywords.value = props.data.metaList.join(',');
    }

    if (props.data.plugin) {
        createDefaultParameters();
    }
})

function getPluginErrorMessage(param: any) {
    switch (param.format) {
        case inputType.value.PATH:
        case inputType.value.STRING:
            if (!param.isValidCharLength) {
                return language.NAME_IS_TOO_SHORT_OR_LONG;
            } else if (!param.isValidChar) {
                return language.INVALID_CHARACTERES_ARE_INCLUDED;
            }
            break;

        case inputType.value.INT:
            if (!param.isValidCharLength || !param.isValidChar) {
                return language.INVALID_INT_FORMAT;
            }
            break;

        default:
            break;
    }
    return '';
}

function omitUnnecessaryParameters() {
    return pluginParameters.value.map((plugin: any) => {
        let value = plugin.value;
        if (plugin.format === inputType.value.BOOLEAN) {
            value = String(value === 'True' || value === true);
        } else if (plugin.format === inputType.value.INT) {
            // 先頭の0を取るために一度numberに変換させて再度stringにする
            value = String(Number(value));
        }
        return {
            name: plugin.name,
            value,
        }
    });
}

function onInputParameter(value: any, i: any) {
    switch (pluginParameters.value[i].format) {
        case inputType.value.PATH:
            pluginParameters.value[i].isValidCharLength = (1 <= value.length && value.length <= 64);
            pluginParameters.value[i].isValidChar = !value.match(/[^a-zA-Z0-9_ !#$%&\'\()+,\.\-=@\[\]^`{}~]+/g);
            break;

        case inputType.value.STRING:
            pluginParameters.value[i].isValidCharLength = (1 <= value.length && value.length <= 255);
            pluginParameters.value[i].isValidChar = !value.match(/[^a-zA-Z0-9_ !#$%&\'\()+,\.\-=@\[\]^`{}~]+/g);
            break;

        case inputType.value.INT:
            const MAX_INT_VALUE = 2147483647;
            pluginParameters.value[i].isValidCharLength = !!value && (-MAX_INT_VALUE <= Number(value) && Number(value) <= MAX_INT_VALUE);
            pluginParameters.value[i].isValidChar = !!value.match(/^[+,-]?\d*$/g);
            break;

        default:
            pluginParameters.value[i].isValidCharLength = true;
            pluginParameters.value[i].isValidChar = true;
    }
    pluginParameters.value[i].value = value;
}

function createDefaultParameters() {
    pluginParameters.value = props.data.plugin.parameters.map((parameter: any) => {
        const isSelect = parameter.format === inputType.value.SELECT;
        const value = isSelect ? `${props.data.target.x},${props.data.target.y}` : parameter.default;
        // 選択した画像を表すために使用。(valueとしてはindexで0,0などだが、1-x:imageのように表示する為)
        const displayValue = isSelect ? props.data.target.name : '';
        return {
            name: parameter.name,
            direction: parameter.direction,
            format: parameter.format,
            value,
            displayValue,
            readonly: parameter.readonly || isSelect,
            isValidChar: true,
            isValidCharLength: true,
            description: parameter.description,
        };
    });
}

function downloadHtmlAndClose() {
    document.location.href = props.data.htmlDownload.link;
    defaultButton.value.action();
}

function toggleIsConfirm() {
    isConfirm.value = !isConfirm.value;
}

function validateInput(value: any) {
    if (value.length < 1 || value.length > 255) {
        error_message.value = language.NAME_IS_TOO_SHORT_OR_LONG;
    } else if (value.match(/[^a-zA-Z0-9_ !#$%&\'\()+,\.\-=@\[\]^`{}~]+/g)) {
        error_message.value = language.INVALID_CHARACTERES_ARE_INCLUDED;
    } else {
        error_message.value = '';
    }
    props.data.initialValue = value;
}

function onTypeChanged(value: any) {
    props.data.selectedAction = value;
}

function onChangeRadioValue(value: any) {
    props.data.selected = value;
}

function _getErrorMessage(value: any, regExp: any) {
    if (!value.length) {
        return 'can\'t be blank';
    } else if (value.match(regExp)) {
        return 'Includes invalid characters.';
    } else {
        return '';
    }
}

function validateNetworkName(e: any) {
    const value = e.target.value;
    unitValue.value.name = value;
    networkNameErrorMessage.value = _getErrorMessage(value, /[^\x20-\x7E]+/g);
}

function validateArgumentName(e: any) {
    const value = e.target.value;
    unitValue.value.argName = value;
    if (!unitValue.value.argName && !unitValue.value.value) {
        argumentNameErrorMessage.value = '';
        valueErrorMessage.value = '';
        return;
    } else if (!unitValue.value.argName && unitValue.value.value) {
        argumentNameErrorMessage.value = 'can\'t be blank';
    } else if (unitValue.value.argName && !unitValue.value.value) {
        valueErrorMessage.value = 'can\'t be blank';
    }
    argumentNameErrorMessage.value = _getErrorMessage(value, /[^a-zA-Z0-9_\']+/g);
}

function validateValue(e: any) {
    const value = e.target.value;
    unitValue.value.value = value;
    if (!unitValue.value.argName && !unitValue.value.value) {
        argumentNameErrorMessage.value = '';
        valueErrorMessage.value = '';
        return;
    } else if (!unitValue.value.argName && unitValue.value.value) {
        argumentNameErrorMessage.value = 'can\'t be blank';
    } else if (unitValue.value.argName && !unitValue.value.value) {
        valueErrorMessage.value = 'can\'t be blank';
    }
    valueErrorMessage.value = _getErrorMessage(value, /[^\x20-\x7E]+/g);
}

function validateMetadataInput() {
    var metaList = keywords.value.split(',').map((keyword: any) => keyword.trim());
    var lengthError = metaList.findIndex(meta => meta.length > definitions_store.Definitions.CONFIG.METADATA.MAX_LENGTH);
    var invalidCharacter = metaList.findIndex(meta => meta.match(/[^a-zA-Z0-9_ !#$%&\'\()+,\.\-=@\[\]^`{}~]+/g));
    if (lengthError !== -1) {
        metadata_error_message.value = language.NAME_IS_TOO_SHORT_OR_LONG;
    } else if (invalidCharacter !== -1) {
        metadata_error_message.value = language.INVALID_CHARACTERES_ARE_INCLUDED;
    } else {
        metadata_error_message.value = '';
    }
}

</script>

<template>
    <transition name="nnc-modal">
        <div>
            <div class="nnc-modal-mask" />
            <div class="nnc-modal-background">
                <div class="nnc-modal-wrapper">
                    <PublishApiDialog v-if="data.type === 'publishAPI'"
                        :data="data"
                        :buttons="buttons"
                        :defaultButton="defaultButton"
                    />
                    <CreatePipelineDialog v-else-if="data.type === 'createPipeline'"
                        :data="data"
                        :buttons="buttons"
                        :defaultButton="defaultButton"
                    />
                    <div class="nnc-modal-container" v-else>
                        <div :class="data.agreeBillingSystem ? 'nnc-modal-header center-bold' : 'nnc-modal-header'"><img v-if="data.titleIcon" :src="data.titleIcon" />{{ data.title }}</div>
                        <div class="nnc-modal-body">
                        <div v-if="data.message && data.link" class="message"><span>{{ data.message }}</span><a :href="data.link.url" :class="definitions_store.Definitions.MODAL.TABBABLE_CLASS">{{data.link.name}}</a>.</div>
                        <div v-else-if="data.message" class="message"><span v-for="line in lines">{{ line }}<br /></span></div>
                        <div class="nnc-modal-reedit" v-else-if="data.selectedAction">
                            <NncRadio class="nnc-modal-radio" v-model="data.selectedAction" choice="Open in Edit Tab" :label="language.OPEN_IN_EDIT_TAB" :disabled="false"/>
                            <OpenNetworkMessage />
                            <div style="border-bottom: solid 1px var(--color-gray2);padding-bottom: 12px;"></div>
                            <NncRadio class="nnc-modal-radio" v-model="data.selectedAction" choice="Open in Edit Tab with Weight" :label="language.OPEN_IN_EDIT_TAB_WITH_WEIGHT" :disabled="false"/><br />
                            <OpenNetworkWithWeightMessage />
                            <div style="border-bottom: solid 1px var(--color-gray2);padding-bottom: 12px;"></div>
                            <NncRadio class="nnc-modal-radio" v-model="data.selectedAction" choice="Re-train" :label="language.RE_TRAIN" :disabled="false"/>
                            <RetrainMessage />
                        </div>
                        <div v-else-if="data.agreeBillingSystem" class="nnc-modal-billing-system">
                            <template v-for="(message, index) in data.agreeBillingSystem.messages">
                                <NoticeMessageWithLink v-if="index === 0" :message="message" :linkName="data.agreeBillingSystem.priceLinkName" :linkURI="data.agreeBillingSystem.priceLink" />
                                <NoticeMessage v-else :message="message" />
                            </template>
                            <div>
                                <a :href="data.agreeBillingSystem.tipsLinkURI" :class="definitions_store.Definitions.MODAL.TABBABLE_CLASS" target="_blank">{{ data.agreeBillingSystem.tipsLinkName }}</a><br>
                            </div>
                            <NoticeMessage class="nnc-modal-confirm-message" :message="data.agreeBillingSystem.confirmMessage" />
                            <NncCheckbox :label="data.agreeBillingSystem.checkboxMessage" v-model="checked" :disabled="false"/>
                        </div>
                        <div v-else-if="data.agreePrivateBilling" class="nnc-modal-billing-system">
                            <template v-for="(message, index) in data.agreePrivateBilling.messages">
                                <NoticeMessage :message="message" />
                            </template>
                            <NoticeMessage class="nnc-modal-confirm-message" :message="data.agreePrivateBilling.confirmMessage" />
                            <NncCheckbox :label="data.agreePrivateBilling.checkboxMessage" v-model="privateChecked" :disabled="false"/>
                        </div>
                        <div v-else-if="data.unit" class="nnc-modal-unit-area">
                            <UnitSettingsInput
                                title="Network name"
                                :value="unitValue.name"
                                :onInput="validateNetworkName"
                                :errorMessage="networkNameErrorMessage"
                            />
                            <UnitSettingsInput
                                title="Argument name"
                                :value="unitValue.argName"
                                :onInput="validateArgumentName"
                                :errorMessage="argumentNameErrorMessage"
                            />
                            <UnitSettingsInput
                                title="Value"
                                :value="unitValue.value"
                                :onInput="validateValue"
                                :errorMessage="valueErrorMessage"
                            />
                            <div class="row">
                                <div class="title">Type</div>
                                <div class="value">
                                    <label class="select_label">
                                        <select :class="'select_menu' + ' ' + definitions_store.Definitions.MODAL.TABBABLE_CLASS" v-model="unitValue.type">
                                            <option v-for="(option, i) in unitTypeList" :value="option.value">{{option.name}}</option>
                                        </select>
                                    </label>
                                </div>
                            </div>
                            <div class="row">
                                <div class="title">Search</div>
                                <div class="value">
                                    <NncRadio class="nnc-modal-radio" v-model="unitValue.search" :choice="true" label="True" :disabled="false"/>
                                    <NncRadio class="nnc-modal-radio" v-model="unitValue.search" :choice="false" label="False" :disabled="false"/>
                                </div>
                            </div>
                        </div>
                        <div v-else-if="data.tenantList && data.tenantList.length === 1" class="nnc-modal-unit-area">
                            <input
                                ref="userInputTenant"
                                type="text"
                                @keyup.enter="!isValidInput || defaultButton.action(getUserInputTenant)"
                                :value="data.initialValue"
                                @input="validateInput(($event.target as HTMLInputElement).value)"
                                :class="error_message ? 'nnc-modal-input with-error' + ' ' + definitions_store.Definitions.MODAL.TABBABLE_CLASS : 'nnc-modal-input' + ' ' + definitions_store.Definitions.MODAL.TABBABLE_CLASS"
                            />
                            <span class="error-message" v-if="error_message" v-for="line in errorLines">{{ line }}<br /></span>
                        </div>
                        <div v-else-if="data.tenantList && data.tenantList.length > 1" class="nnc-modal-unit-area">
                            <input
                                ref="userInputShareTenant"
                                type="text"
                                @keyup.enter="!isValidInput || defaultButton.action(getUserInputShareTenant)"
                                :value="data.initialValue"
                                @input="validateInput(($event.target as HTMLInputElement).value)"
                                :class="error_message ? 'nnc-modal-input with-error' + ' ' + definitions_store.Definitions.MODAL.TABBABLE_CLASS : 'nnc-modal-input' + ' ' + definitions_store.Definitions.MODAL.TABBABLE_CLASS"
                            />
                            <span class="error-message" v-if="error_message" v-for="line in errorLines">{{ line }}<br /></span>
                            <span class="select_message">Select a workspace from the list.<br /></span>
                            <div class="nnc-modal-unit-area">
                                <div class="value">
                                    <label class="select_label select_tenant">
                                        <select :class="'select_menu' + ' ' + definitions_store.Definitions.MODAL.TABBABLE_CLASS" class="select_tenant" v-model="selectedTenant">
                                            <option v-for="(tenant, i) in data.tenantList" :value="tenant.tenant_id">{{tenant.nickname || 'Personal'}}</option>
                                        </select>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div v-else-if="data.radioList">
                            <div class="message"><span>{{ data.text }}</span></div>
                            <template v-for="radio in data.radioList">
                                <NncRadio class="nnc-modal-radio" v-model="data.selected" label="" :choice="radio.value" :disabled="radio.disabled" />
                                <div :class="radio.disabled ? 'nnc-modal-radio-description disabled' : 'nnc-modal-radio-description'">{{radio.description}}</div>
                            </template>
                            <div v-if="data.isPublish && LANG === 'en'" class="terms">
                                <span>{{language.PLEASE_SEE_THE}}<a href="/tos/publish.html" target="_blank">{{language.LINK}}</a>{{language.FOR_THE_TERM_OF_USE}}</span>
                            </div>
                            <div v-if="data.isPublish && LANG === 'ja'" class="terms">
                                <span>{{language.PLEASE_SEE_THE}}<a href="/ja/tos/publish.html" target="_blank">{{language.LINK}}</a>{{language.FOR_THE_TERM_OF_USE}}</span>
                            </div>
                        </div>
                        <div v-else-if="data.metaList" id="meta-list">
                            <div class="message"><span>{{ data.text }}</span></div>
                            <div class="meta-list">
                                <textarea :class="definitions_store.Definitions.MODAL.TABBABLE_CLASS" @input="validateMetadataInput" v-model="keywords" placeholder="tag1,tag2,tag3" />
                            </div>
                            <div v-if="metadata_error_message">
                                <span class="error">{{metadata_error_message}}</span>
                            </div>
                        </div>
                        <div v-else-if="data.htmlDownload">
                            <div v-if="!isConfirm" class="message"><span>{{ data.htmlDownload.message }}</span></div>
                            <div v-if="isConfirm" class="message"><span>{{language.ARE_YOU_SURE_YOU_WANT_CANCEL_DOWNLOAD}}</span></div>
                        </div>
                        <div v-else-if="data.plugin" style="margin-top: 16px" class="plugin-input-area">
                            <div>
                                <PluginParameterInput
                                    v-for="(param, i) in pluginParameters"
                                    :title="param.name"
                                    :description="param.description"
                                    :value="param.displayValue || param.value"
                                    :onInput="(value: any) => onInputParameter(value, i)"
                                    :errorMessage="getPluginErrorMessage(param)"
                                    :readonly="param.readonly"
                                    :format="param.format"
                                />
                            </div>
                        </div>
                        <div v-else class="nnc-modal-unit-area">
                            <input
                                ref="userInput"
                                type="text"
                                @keyup.enter="!isValidInput || defaultButton.action(getUserInput)"
                                :value="data.initialValue"
                                @input="validateInput(($event.target as HTMLInputElement).value)"
                                :class="error_message ? 'nnc-modal-input with-error' + ' ' + definitions_store.Definitions.MODAL.TABBABLE_CLASS : 'nnc-modal-input' + ' ' + definitions_store.Definitions.MODAL.TABBABLE_CLASS"
                            />
                            <span class="error-message" v-if="error_message" v-for="line in errorLines">{{ line }}<br /></span>
                        </div>
                        </div>
                        <div class="nnc-modal-footer">
                        <button v-if="data.htmlDownload && !isConfirm" :class="'nnc-modal-button' + ' ' + definitions_store.Definitions.MODAL.TABBABLE_CLASS" v-for="btn in buttons" @click="toggleIsConfirm">{{ btn.name }}</button>
                        <button v-else-if="data.htmlDownload && isConfirm" :class="'nnc-modal-button' + ' ' + definitions_store.Definitions.MODAL.TABBABLE_CLASS" v-for="btn in buttons" @click="toggleIsConfirm">Back</button>
                        <button v-else :class="'nnc-modal-button' + ' ' + definitions_store.Definitions.MODAL.TABBABLE_CLASS" v-for="btn in buttons" @click="btn.action()">{{ btn.name }}</button>

                        <button v-if="data.agreeBillingSystem" :class="'nnc-modal-button default' + ' ' + definitions_store.Definitions.MODAL.TABBABLE_CLASS" @click="defaultButton.action(checked)">{{ defaultButton.name }}</button>
                        <button v-else-if="data.plugin && !isValidPluginInput" class="nnc-modal-button default disabled" disabled>{{ defaultButton.name }}</button>
                        <button v-else-if="data.plugin" :class="'nnc-modal-button default' + ' ' + definitions_store.Definitions.MODAL.TABBABLE_CLASS" @click="defaultButton.action(omitUnnecessaryParameters())">{{ defaultButton.name }}</button>
                        <button v-else-if="data.agreePrivateBilling" :class="'nnc-modal-button default' + ' ' + definitions_store.Definitions.MODAL.TABBABLE_CLASS" @click="defaultButton.action(privateChecked)">{{ defaultButton.name }}</button>
                        <button v-else-if="data.unit && isValidCreateUnit" :class="'nnc-modal-button default' + ' ' + definitions_store.Definitions.MODAL.TABBABLE_CLASS" @click="defaultButton.action(unitValue)">{{ defaultButton.name }}</button>
                        <button v-else-if="data.unit" disabled class="nnc-modal-button disabled">{{ defaultButton.name }}</button>
                        <button v-else-if="data.selectedAction" :class="'nnc-modal-button default' + ' ' + definitions_store.Definitions.MODAL.TABBABLE_CLASS" @click="defaultButton.action(data.selectedAction)">{{ defaultButton.name }}</button>
                        <button v-else-if="data.radioList" :class="'nnc-modal-button default' + ' ' + definitions_store.Definitions.MODAL.TABBABLE_CLASS" @click="defaultButton.action(data.selected)">{{ defaultButton.name }}</button>
                        <button v-else-if="data.metaList && !metadata_error_message" :class="'nnc-modal-button default' + ' ' + definitions_store.Definitions.MODAL.TABBABLE_CLASS" @click="defaultButton.action(keywords)">{{ defaultButton.name }}</button>
                        <button v-else-if="data.metaList && metadata_error_message" disabled class="nnc-modal-button disabled" >{{ defaultButton.name }}</button>
                        <button v-else-if="data.htmlDownload && !isConfirm" :class="'nnc-modal-button default' + ' ' + definitions_store.Definitions.MODAL.TABBABLE_CLASS" @click="downloadHtmlAndClose">{{ defaultButton.name }}</button>
                        <button v-else-if="data.htmlDownload && isConfirm" :class="'nnc-modal-button default' + ' ' + definitions_store.Definitions.MODAL.TABBABLE_CLASS" @click="defaultButton.action()">OK</button>
                        <button v-else-if="isValidInput && data.tenantList && data.tenantList.length === 1" :class="'nnc-modal-button default' + ' ' + definitions_store.Definitions.MODAL.TABBABLE_CLASS" @click="defaultButton.action(getUserInputTenant)">{{ defaultButton.name }}</button>
                        <button v-else-if="isValidInput && data.tenantList && data.tenantList.length > 1" :class="'nnc-modal-button default' + ' ' + definitions_store.Definitions.MODAL.TABBABLE_CLASS" @click="defaultButton.action(getUserInputShareTenant)">{{ defaultButton.name }}</button>
                        <button v-else-if="isValidInput" :class="'nnc-modal-button default' + ' ' + definitions_store.Definitions.MODAL.TABBABLE_CLASS" @click="defaultButton.action(getUserInput)">{{ defaultButton.name }}</button>
                        <button v-else disabled class="nnc-modal-button disabled" @click.stop.prevent="">{{ defaultButton.name }}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>