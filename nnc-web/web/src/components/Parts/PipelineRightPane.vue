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

<!-- src/components/Parts/PipelineRightPane.vue -->
<template>
  <div id="pipeline-details">
    <div id="history-area">
      <div class="title">
        <em>{{ vueTexts.HISTORY }}</em>
      </div>
      <div id="job-list" :class="!selectedJobId ? 'full' : ''">
        <ul v-if="workflowJobList.length">
          <li
            :class="['job-list', selectedJobId === workflowJob.jobId ? 'selected' : '']"
            v-for="(workflowJob, i) in workflowJobList"
            :key="'workflowJob' + i"
            @click="$emit('show-detail', workflowJob)"
          >
            <canvas :id="'job-history-progress-' + i" width="24" height="24" />
            <div class="job-info">
              <div class="ellipsis">{{workflowJob.jobName}}</div>
              <div class="ellipsis">{{workflowJob.status}}</div>
              <div class="ellipsis">{{vueTexts.START}}: {{parseTime(workflowJob.startAt)}}</div>
              <div class="ellipsis" v-if="workflowJob.endAt">{{vueTexts.END}}: {{parseTime(workflowJob.endAt)}}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <div id="job-detail-area" v-if="selectedJobId">
      <div class="detail-title">
        <div class="title">
          <em>{{ vueTexts.DETAIL }}</em>
        </div>
        <div v-if="suspendable" class="primary-button" @click="$emit('suspend', detailWorkflowJob)">
          <span>{{ vueTexts.SUSPEND }}</span>
        </div>
        <div v-else-if="resumable" class="primary-button" @click="$emit('resume', detailWorkflowJob)">
          <span>{{ vueTexts.RESUME }}</span>
        </div>
        <div v-else-if="downloadable" class="primary-button" @click="$emit('download', detailWorkflowJob)">
          <span>{{vueTexts.DOWNLOAD}}</span>
        </div>
        <div v-else />
      </div>
      <div class="progress">
        <div class="task" v-for="(task, i) in detailWorkflowJob.tasks" :key="'task' + i">
          <div class="ellipsis">{{task.name}}</div>
          <div class="status">
            {{vueTexts.STATUS}}: <span :class="task.status">{{task.status}}</span>
            <span v-if="task.status === 'failed' && detailWorkflowJob.errorDetails">
              <img src="/console/image/Warning.svg" @click="$emit('show-error-msg', detailWorkflowJob.errorDetails)">
            </span>
          </div>
          <div class="ellipsis">{{vueTexts.START}}: {{parseTime(task.startAt)}}</div>
          <div class="ellipsis" v-if="task.endAt">{{vueTexts.END}}: {{parseTime(task.endAt)}}</div>
        </div>
      </div>
    </div>
    <Loading2 :isLoading="isLoading" />
  </div>
</template>

<script lang="ts" src="./PipelineRightPane.ts"></script>
