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

<!-- src/components/LeftMenu.vue -->
<template>
  <div id="menu-container" @click="hideMenuIcon">
    <div>
      <div id="title-area">
        <img src="/console/image/Title.svg" alt="Title">
      </div>
      <div class="empty-menu border-bottom"></div>
      <div class="empty-menu"></div>
      <div :class="getClassName('dashboard')" @click="$emit('clickMenu', 'dashboard')">
        <em>{{vueTexts.DASHBOARD}}</em>
      </div>
      <div :class="getClassName('project')" @click="$emit('clickMenu', 'project')" class="box box-pack-justify">
        <div><em class="left-menu-string">{{vueTexts.PROJECT}}</em></div>
        <!--nncd: add div-->
        <div v-if='this.isShowInLocalEditor' >
          <div v-if="isOverTheLimitProjectNum()" class="limit-message over-limit-message">
            <img src="/console/image/WarningRed.svg" class="limit-image" />
            <span class="left-menu-string">{{vueTexts.REACHED_FREE_LIMIT}}</span>
          </div>
          <div v-else-if="isCloseToTheLimitProjectNum()" class="limit-message close-to-the-limit-message">
            <img src="/console/image/WarningRed.svg" class="limit-image" />
            <span class="left-menu-string">{{vueTexts.CLOSE_TO_FREE_LIMIT}}</span>
          </div>
        </div>
      </div>
      <div :class="getClassName('dataset')" @click="$emit('clickMenu', 'dataset')" class="box box-pack-justify">
        <div><em class="left-menu-string">{{vueTexts.DATASET}}</em></div>
        <!--nncd: add div-->
        <div v-if='this.isShowInLocalEditor' >
          <div v-if="isOverTheLimitWorkspaceUsed()" class="limit-message over-limit-message">
            <img src="/console/image/WarningRed.svg" class="limit-image" />
            <span class="left-menu-string">{{vueTexts.REACHED_LIMIT}}</span>
          </div>
          <div v-else-if="isCloseToTheLimitWorkspaceUsed()" class="limit-message close-to-the-limit-message">
            <img src="/console/image/WarningRed.svg" class="limit-image" />
            <span class="left-menu-string">{{vueTexts.CLOSE_TO_LIMIT}}</span>
          </div>
        </div>
      </div>

      <div :class="getClassName('jobHistory')" @click="$emit('clickMenu', 'jobHistory')">
        <em>{{vueTexts.JOB_HISTORY}}</em>
      </div>
      <div class="empty-menu border-bottom"></div>
      <div class="empty-menu"></div>
      <div :class="getClassName('sampleProject')" @click="$emit('clickMenu', 'sampleProject')">
        <em>{{vueTexts.SAMPLE_PROJECT}}</em>
      </div>
      <div class="sample-project-balloon" v-if="shouldShowSampleProjectBalloon">
        <div class="message">{{vueTexts.WELCOME_TO_NNC}}<br>{{vueTexts.WHY_DONT_YOU_GET_STARTED}}</div>
        <div class="icon"><img src="/console/image/Remove.svg" @click="hideBalloon" /></div>
      </div>
    </div>
    <div>
      <div :class="shouldShowAccountMenu() ? 'menu account-menu selected' : 'menu account-menu'" @click.stop="onClickMenuIcon">
        <div id="account-menu-icon" :class="'icon-area' + (shouldShowAccountMenu() ? ' selected' : '')"></div>
        <!--nncd: moidify user-id-->
        <!-- <div id="user-id">ID: {{getUserId()}}</div> -->
        <div id="user-id">Help</div>
        <!------->
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./LeftMenu.ts"></script>
