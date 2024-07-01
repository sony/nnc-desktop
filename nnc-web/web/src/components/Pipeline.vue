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

<!-- src/components/Pipeline.vue -->
<template>
  <div id="pipeline-area" @click.stop="onClickPage">
    <div id="pipeline-container" :class="!isLocalTenant() ? 'share-tenant' : ''">
      <tenant-tabs
        v-if="hasShareTenant"
        :tenantList="tenantList"
        :selectedTenantId="selectedTenantId"
        :onClickTenantTab="onChangeTab"
        :warningList="[]"
        @apierror="(error, callback) => $emit('apierror', error, callback)"
      />
      <div class="pipeline-title border-bottom">{{ vueTexts.TITLE }}</div>
      <template>
      <div class="min-width">
        <div class="pipeline-header border-bottom">
          <div class="pipeline-item name">
            <div class="checkbox-area">
              <input type="checkbox" id="select-all-checkbox" class="checkbox" @click="selectCheckboxAll($event.target.checked)">
              <label for="select-all-checkbox" @click.stop></label>
            </div>
            <div>{{ vueTexts.NAME }}</div>
          </div>
          <div class="pipeline-item modified">{{ vueTexts.MODIFIED }}</div>
          <div id="action-icon" class="pipeline-item action pointer" @click.stop="onClickAction">
            <div id="action-text">{{ vueTexts.ACTION }}</div>
            <img src="/console/image/ArrowDownBlue.svg" alt="Action" class="action-icon">
          </div>
        </div>
      </div>
      <div class="wh-100 min-width publish-api">
        <div class="pipeline-container">
          <Pipeline-list
            :selectedWorkflowId="selectedWorkflowId"
            :pipelineList="pipelineList"
            :workflowList="workflowList"
            @select-checkbox="selectCheckbox"
            @select="select"
            @click-rename="onClickRenameIcon"
            @click-data-source="onClickDatasource"
            @click-script="onClickScript"
            @input-workflow-name="inputWorkflowName"
            @delete="deleteWorkflow"
          />
        </div>
        <Loading2 :isLoading="isPipelineListLoading" />
      </div>
      </template>
    </div>

    <div id="right-menu-border" class="menu-border" @mousedown.prevent="resizeRightMenu" />
    <PipelineRightPane
      :language="language"
      :workflowJobList="workflowJobList"
      :detailWorkflowJob="detailWorkflowJob"
      :selectedJobId="selectedWorkflowJobId"
      :isLoading="isLoadingRightPane"
      @show-detail="showDetail"
      @show-error-msg="showErrorMsg"
      @suspend="suspend"
      @resume="resume"
      @download="download"
    />

    <div id="action-list">
      <ul class="action-list-area">
        <li
          :class="checked() ? 'action-list-item pointer' : 'action-list-item disabled'"
          @click="deleteAll"
        >
          {{vueTexts.DELETE}}
        </li>
      </ul>
    </div>

    <UploadDataSourceDialog
      v-if="showUploadDataSourceDialog"
      @apierror="(error) => $emit('apierror', error)"
      @update-trigger="updateTrigger"
      @cancel="hideUploadDataSourceDialog"
      :dataSourceList="dataSourceList"
      :selectedTenantId="selectedTenantId"
      :userId="userId"
      :workflowId="selectedWorkflowIdForDialog"
    />

    <PipelineScriptDialog
      v-if="showPipelineScriptDialog"
      :scripts="scripts"
      :preProcessScriptId="pipeline.preProcessScriptId"
      :postProcessScriptId="pipeline.postProcessScriptId"
      :resultFiles="resultFiles"
      @cancel="hidePipelineScriptDialog"
      @update-script="updateScript"
      @download="downloadScript"
    />

    <PipelineChangeDialog
      v-if="showChangePipelineDialog"
      :name="workflowInfo.name"
      :trainInstanceType="workflowInfo.trainInstanceType"
      :evaluateInstanceType="workflowInfo.evaluateInstanceType"
      :isSendMail="workflowInfo.isSendMail"
      :trainAvailableInstance="trainInstance"
      :evaluateAvailableInstance="evaluateInstance"
      @cancel="hideChangePipelineDialog"
      @change-pipeline="changePipeline"
    />

  </div>
</template>

<script lang="ts" src="./Pipeline.ts"></script>
