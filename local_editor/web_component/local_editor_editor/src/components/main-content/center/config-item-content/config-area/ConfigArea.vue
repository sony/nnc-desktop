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
import {useConfigStore} from '@/stores/config'
import { computed } from 'vue';
import ConfigGlobal from './config-global/ConfigGlobal.vue'
import ConfigOptimizer from './config-optimizer/ConfigOptimizer.vue'
import ConfigMonitor from './config-monitor/ConfigMonitor.vue'
import ConfigExecutor from './config-executor/ConfigExecutor.vue'
const config_store = useConfigStore()
const {data, active} = storeToRefs(config_store)

const dynamicComponentGen = computed(() => {
    let config_type = data.value[active.value.index].type
    if(config_type.toLowerCase() === 'global') { return ConfigGlobal }
    if(config_type.toLowerCase() === 'optimizer') { return ConfigOptimizer }
    if(config_type.toLowerCase() === 'monitor') { return ConfigMonitor }
    if(config_type.toLowerCase() === 'executor') { return ConfigExecutor }
})

function onUpdate(_value: any) {
    data.value[active.value.index] = _value
}
</script>
<template>
    <div class="config-content">
        <component 
            :is="dynamicComponentGen"  
            v-on:update:value="onUpdate">
        </component>
    </div>
</template>