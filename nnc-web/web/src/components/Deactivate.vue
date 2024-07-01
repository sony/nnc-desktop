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

<!-- src/components/Deactivate.vue -->
<template>
  <div id="deactivate-area">
    <div id="deactivate-container">
      <div class="box deactivate-title-component">
        <div class="deactivate-title-text">{{vueTexts.WITHDRAW_FROM_NURAL_NETWORK_CONSOLE}}</div>
      </div>

      <div class="deactivate-message-component">
        {{vueTexts.THANK_YOU_FOR_USING_NNC}}
        <br>
        {{vueTexts.BE_SURE_TO_READ_THE_FOLLOWING}}
        <br>
        {{vueTexts.IF_YOU_AGREE_WITH_ALL_OF_THESE}}
        <br>
        {{vueTexts.WE_ARE_WAITING_FOR_YOUR_FEEDBACK}}
      </div>

      <div class="community-page-link-area">
        <div class="box box-align-center" v-if="language === 'en'">
          <img src="/console/image/DiscussionBlue.svg"></img>
          <a href="https://dl.sony.com/community/" target="_blank" class="setting-name ellipsis">Community Page</a>
        </div>
        <div class="box box-align-center" v-else-if="language === 'ja'">
          <img src="/console/image/DiscussionBlue.svg"></img>
          <a href="https://dl.sony.com/ja/community/" target="_blank" class="setting-name ellipsis">コミュニティ</a>
        </div>
      </div>

      <div class="deactivate-border">
        <hr></hr>
      </div>


      <div class="agreement-area">
        <em>{{vueTexts.NOTES}}</em>
        <ul>
          <li class="deactivate-list">{{vueTexts.TRAINING_AND_EVALUATION_DURING_EXECUTION}}</li>
          <li class="deactivate-list">{{vueTexts.ALL_PREVIOUS_RESULTS}}</li>
          <li class="deactivate-list">{{vueTexts.ONCE_APPLYING_FOR_WITHDRAWING}}</li>
          <li class="deactivate-list">{{vueTexts.EVEN_IF_YOU_WITHDRAW_NNC}}</li>
        </ul>
        <div class="deactivate-agree-checkbox-area box">
          <div class="checkbox-area">
            <input id="agree" type="checkbox" :disabled="isShareTenantOwner" @click="setChecked($event.currentTarget.checked)" class="deactivate-agree-text checkbox">
            <label for="agree"></label>
          </div>
          <div class="dataset-name-area">
            <span>{{vueTexts.I_AGREE}}</span>
          </div>
        </div>
        <div v-if="isShareTenantOwner" class="warning-text">{{vueTexts.YOU_CANNOT_WITHDRAW}}</div>
      </div>

      <div class="deactivate-button-component box box-align-center">
        <button v-on:click="onClickMenu" data-menu="serviceSettings" type="button" class="deactivate-cancel-button deactivate-cancel-button-enabled pointer">Back to Service Settings</button>
        <div v-if="agreed && !isShareTenantOwner">
          <button type="button" v-on:click="deactivate" class="deactivate-quit-button pointer">Withdraw</button>
        </div>
        <div v-else>
          <button type="button" class="deactivate-quit-button disabled">Withdraw</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./Deactivate.ts"></script>
