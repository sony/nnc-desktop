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

<!-- src/components/AccountMenu.vue -->
<template>
  <div v-if="shouldShowAccountMenu" id="account-menu-area">
    <!--nncd: add v-if-->
    <ul id="account-menu-list" v-if="this.isShowInLocalEditor">
      <li v-if="isSonyAccount()" class="account-menu-list-content box box-pack-justify pointer" @click="onClickAccountSettings">
        <div>{{vueTexts.ACCOUNT_SETTINGS}}</div>
        <div><img src="/console/image/LinkWhite.svg"></div>
      </li>
      <li class="account-menu-list-content box box-pack-justify pointer" @click="onClickServiceSettings">
        <div>{{vueTexts.SERVICE_SETTINGS}}</div>
      </li>
      <li class="account-menu-list-content box box-pack-justify pointer" @click="onClickHelp">
        <div>{{vueTexts.DOCS}}</div>
        <div><img src="/console/image/LinkWhite.svg"></div>
      </li>
      <li class="account-menu-list-content box box-pack-justify pointer" @click="onClickTOS">
        <div>{{vueTexts.TERMS_OF_SERVICE}}</div>
        <div><img src="/console/image/LinkWhite.svg"></div>
      </li>
      <li class="account-menu-list-content box box-pack-justify pointer" @click="onClickLicenses">
        <div>{{vueTexts.LICENSES}}</div>
        <div><img src="/console/image/LinkWhite.svg"></div>
      </li>
      <li class="account-menu-list-content box box-pack-justify pointer" @click="onClickLogout">
        <div>{{vueTexts.LOGOUT}}</div>
      </li>
    </ul>
    <!--nncd: add ul and support tag-->
    <ul id="account-menu-list">
      <li class="account-menu-list-content box box-pack-justify pointer" onclick="window.open('/docs/', '_blank');">
        <div>{{vueTexts.DOCS}}</div>
        <div><img src="/console/image/LinkWhite.svg"></div>
      </li>
      <li class="account-menu-list-content box box-pack-justify pointer" onclick="window.open('/docs/about.html', '_blank');">
        <div>{{vueTexts.ABOUT}}</div>
        <div><img src="/console/image/LinkWhite.svg"></div>
      </li>
    </ul>
    <!-------->
  </div>
</template>

<script lang="ts" src="./AccountMenu.ts"></script>
