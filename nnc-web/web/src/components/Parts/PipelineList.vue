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

<!-- src/components/PipelineList.vue -->
<template>
  <ul id="pipeline-list">
    <li
      v-for="(workflow, i) in workflowList"
      :class="['pipeline-items', 'border-bottom', isSelected(workflow) ? 'selected' : '']"
      @click.stop="$emit('select', workflow.id)"
      :key="'pipeline' + i"
    >
      <div class="pipeline-item name">
        <div class="pipeline-name-area">
          <div class="checkbox-area">
            <input
              type="checkbox"
              :id="'pipeline-checkbox' + i"
              class="checkbox"
              :checked="!!workflow.checked"
              @click.stop="$emit('select-checkbox', {id: workflow.id, checked: $event.target.checked})"
            />
            <label :for="'pipeline-checkbox' + i" @click.stop />
          </div>
          <div class="pipeline-name ellipsis">{{workflow.name}}</div>
        </div>
      </div>
      <div class="pipeline-item modified">
        <div>{{workflow.updateDatetime}}</div>
      </div>

      <div class="pipeline-item action">
        <img class="pointer" src="/console/image/Rename.svg" alt="Rename" @click.stop="$emit('click-rename', workflow.id)" />
        <img class="pointer" src="/console/image/upload.svg" alt="DataSource" @click.stop="$emit('click-data-source', workflow.id)" />
        <img class="pointer" src="/console/image/Project.svg" alt="Script" @click.stop="$emit('click-script', workflow.id)" />
        <img class="pointer" src="/console/image/Delete.svg" alt="Delete" @click.stop="$emit('delete', workflow.id)" />
      </div>
    </li>
  </ul>
</template>

<script lang="ts" src="./PipelineList.ts"></script>
