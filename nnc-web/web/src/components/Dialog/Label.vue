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

<!-- src/components/Label.vue -->
<template>
  <div id="label-dialog">
    <div id="label-dialog-main">
      <div>{{title}}</div>
      <div>
        <div class="input-area">
          <input :id="(!isInvalid) ? 'search-label' : 'error-search-label'" @input="inputKeyword($event.target.value)"  maxlength="128" :value="keyword"/>
        </div>
        <div class="invalid-label" v-if="isInvalid">
          {{vueTexts.INVALID_CHARACTER_INCLUDED}}
        </div>
        <div class="label-list-area">
          <ul id="label-list">
            <li v-for="(label, i) in filteredLabels" :key="'label' + i">
              <div class="checkbox-area">
                <input type="checkbox" :id="label.labelName" class="checkbox" @click="selectLabel" :checked="label.checked || false" :value="label.labelName">
                <label :for="label.labelName"></label>
              </div>
              {{label.labelName || ''}}
            </li>
          </ul>
          <div class="create-labels-area" v-if="!isInvalid">
            <div v-if="keyword && !isAlreadyExistLabel()" class="create-label" @click="createLabels">
              {{'"' + keyword + '"'}} {{vueTexts.CREATE_LABEL}}
            </div>
          </div>
        </div>
        <div class="button-area">
          <button class="button cancel" @click="cancelCallback">Cancel</button>
          <button :disabled="!allLabelList.length || !filteredLabelList.length || isInvalid" class="button update" @click="onClickUpdate">Update</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./Label.ts"></script>
