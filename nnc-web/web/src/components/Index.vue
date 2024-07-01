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

<!-- src/components/Index.vue -->
<template>
  <div id="index" :class="language === 'ja' ? 'ja' : 'en'">
    <div v-if="isInitialized()">
      <div id="main" class="box">
        <left-menu
          @clickMenu="onClickLeftMenu"
          :selectedComponent="getSelectedComponent()"
          :selectedTenantId="getSelectedTenant()"
          :isLocalTenant="isLocalTenant"
          :tenantList="getTenantList()"
          :language="language"
        />
        <div id="left-menu-border" class="menu-border" @mousedown="resizeLeftMenu"></div>
        <account-menu
          :shouldShowAccountMenu="shouldShowAccountMenu()"
          :version="getTOSVersion()"
          :countryCode="getCountryCode()"
          :locale="getLocale()"
          :language="language"
        />
        <router-view
          @clickMenu="onClickLeftMenu"
          @apierror="onApiError"
          :language="language"
          :userId="userId"
          :tenantList="getTenantList()"
          :selectedTenantId="getSelectedTenant()"
          :hasShareTenant="hasShareTenant()"
          :onClickTenantTab="onClicktenantTab"
          :isLocalTenant="isLocalTenant"
        />
      </div>
    </div>
    <Loading :isLoading="!isInitialized() || isLoading()" />
  </div>
</template>

<script lang="ts" src="./Index.ts"></script>
