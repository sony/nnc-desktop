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
import ComponentPalette from './component-palette/ComponentPalette.vue'
import PropertyArea from './property-area/PropertyArea.vue'
</script>

<template>
    <div class="app-row edit-left-content" style="top: 0; bottom: 0;">
        <ComponentPalette class="app-row" style="top: 0; bottom: 310px; border-bottom: 1px solid var(--color-gray2); padding: 12px 16px;"
        />
        <PropertyArea class="app-row" style="height: 310px; bottom: 0;"
        />
    </div>
</template>