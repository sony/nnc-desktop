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

<!-- src/components/TenantTabs.vue -->
<template>
  <div id="tenant-tabs">
    <div :class="isSelected(tenant.tenantId) ? 'tenant-tab selected' : 'tenant-tab pointer'" v-for="(tenant, i) in tenantList" :key="'tenant-list' + i" @click="onClick(tenant.tenantId)">
      <div class="text-area ellipsis rename" v-if="shouldShowRenameInput[tenant.tenantId]">
        <input class="tenant-name-input" :id="tenant.tenantId"  type="text" :value="inputedTenantName[tenant.tenantId]" @keydown="onKeydownTenantName" @input="inputTenantName(tenant.tenantId, $event.currentTarget.value)" @click.stop @blur="rename">
      </div>
      <div class="text-area ellipsis" v-else>
        <span>{{tenant.nickname || 'Personal'}}</span>
      </div>
      <img v-if="shouldShowEditIcon(tenant.tenantId)" class="tenant-tab-rename pointer" src="/console/image/Rename.svg" @click.stop="onClickRename($event, tenant.tenantId)"/>
      <img v-if="shouldShowWarningIcon(tenant.tenantId)" :class="hasAdminRoleForTenantTab(tenant.tenantId) && !isLocalTenantForTenantTab(tenant.tenantId)? 'tenant-tab-warning hidden' : 'tenant-tab-warning'" src="/console/image/WarningRed.svg" />
    </div>
  </div>
</template>

<script lang="ts" src="./TenantTabs.ts"></script>
