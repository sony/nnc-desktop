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

<!-- src/components/ComputeResource.vue -->
<template>
  <div id="project-area" :class="hasShareTenant ? 'share' : ''">
    <div id="project-container">
      <div class="box box-align-center project-menu-height project-action">
        <div class="box box-align-center action-menu-area" @click="addResource">
          <div class="box box-align-center action-menu">
            <img src="/console/image/AddNew.svg" alt="Add">
            <div class="action-menu-string">
              <em>{{vueTexts.ADD_RESOURCE}}</em>
            </div>
          </div>
        </div>
        <div class="action-menu-area-filter-and-search">

          <!-- todo: add search box -->
          <!-- <div class="box box-align-center">
            <div class="box box-align-center action-menu">
              <div class="action-menu-string"></div>
              <input id="project-search" class="form-control" :value="keyword" @keyup="oninput($event.currentTarget.value)" @keyup.esc="initKeyword()" type="text" :placeholder="vueTexts.SEARCH" style="border:none;" :tabindex="isShowingDialog ? -1 : 0">
            </div>
          </div> -->
        </div>
      </div>
      <div class="border-top border-bottom project-heading-container">
        <div class="box box-align-center project-menu-height">
          <div class="project-name box box-align-center project-menu-height">
            <div class="checkbox-area">
              <input type="checkbox" id="select-all-checkbox" class="checkbox project-menu-height" @click="selectAll" :checked="allChecked || false">
              <label for="select-all-checkbox"></label>
            </div>
            <div class="select-all-string">{{vueTexts.NAME}}</div>
          </div>
          <div class="modified box box-align-center project-menu-height">
            <div>{{vueTexts.MODIFIED}}</div>
          </div>
          <!-- todo: add type block -->
          <div class="action box box-align-center box-pack-end project-menu-height">
            <div id="action-icon" class="box box-align-center pointer">
              <div>{{vueTexts.ACTION}}</div>
              <img src="/console/image/ArrowDownBlue.svg" alt="Action" class="action-icon">
            </div>
          </div>
        </div>
      </div>
      <div class="wh-100">
        <div class="project-list-container">
          <ul id="instance-list">
            <li v-for="(instance, i) in instanceList" v-bind:key="'instance' + i" class="project-list">
              <!-- Local Instance -->
              <div class="box box-align-center sample-project-content sample" v-if="instance.provider === 'local'">
                <div class="project-name box box-align-center">
                  <div class="sample-project-name-link ellipsis">
                    <span>{{instance.name}}</span>
                  </div>
                </div>
                <div class="modified box box-align-center">
                  <div class="sample-project">{{ vueTexts.LOCAL }}</div>
                </div>
              </div>
              <!-- Remote Instance -->
              <div v-else-if="instance.provider !== 'local'" v-bind:data-pid="instance.instance_type" class="box box-align-center project-area user-project project-content">
                <div class="project-name box box-align-center project-content">
                  <div class="checkbox-area-local">
                    <input v-bind:id="instance.instance_type" v-bind:data-pid="instance.instance_type" type="checkbox" v-bind:checked="instance.checked || false" class="checkbox project-content">
                    <label v-bind:data-pid="instance.instance_type" v-bind:for="instance.instance_type" @click="select"></label>
                  </div>
                  <div class="project-name-link ellipsis">
                    <span>{{instance.name}}</span>
                  </div>
                </div>
                <div class="modified box-align-center ellipsis">
                  <span>{{instance.update_datetime}}</span>
                </div>
                <div class="action box box-align-center box-pack-end">
                  <div class="action-image pointer">
                    <img v-bind:data-pid="instance.instance_type" src="/console/image/Delete.svg" alt="Delete" @click.stop="deleteInstance(instance)">  <!-- daozher-->
                  </div>
                </div>
              </div>

            </li>

          </ul>
        </div>
        <Loading2 :isLoading="isInstanceListLoading()" />
      </div>
    </div>
    <div id="right-menu-border" class="menu-border" @mousedown="resizeRightMenu"></div>
    <div id="project-job-list">
      <div id="overview-area">
        <div class="title">
          <em>{{vueTexts.OVERVIEW}}</em>
          <!-- <label class="select-label" v-if="networkList.length">
            <select class="select-menu" @change="changeNetwork" :value="networkIndex" :tabindex="isShowingDialog ? -1 : 0">
              <option v-for="(name, i) in networkList" :key="'option' + i" :value="i">{{name}}</option>
            </select>
          </label> -->
        </div>
      </div>
    </div>
    <div id="action-list">
      <ul class="action-list-area">
        <li v-bind:class="checked() ? 'action-list-item pointer' : 'action-list-item disabled'" @click="deleteAll">{{vueTexts.DELETE}}</li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" src="./ComputeResource.ts"></script>
