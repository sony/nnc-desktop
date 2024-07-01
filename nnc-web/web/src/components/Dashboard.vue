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

<!-- src/components/Dashboard.vue -->
<template>
  <div id="dashboard-area" class="box">
    <div id="dashboard-container">
      <div id="dashboard-job-history-container">
        <div>
          <div class="box box-align-center table-title job-history-menu-height ellipsis">
            <em>{{ vueTexts.RECENT_PROJECT }}</em>
          </div>
          <div class="job-list-container">
            <ul>
              <div v-if="isExistsProjects()">
                <li v-for="(project, i) in projectList" v-bind:key="'project' + i" v-bind:data-pid="project.project_id" class="box box-align-center recent-projects-list">
                  <div class="project-info box box-align-center">
                    <div class="box box-align-center project-name-area">
                      <div class="action-menu-string ellipsis project-name-link-area">
                        <span v-if="project.deleted || isFailed(project) || isImporting(project)">{{project.project_name}}</span>
                        <a v-else v-bind:href="getProjectLink(project)" class="pointer">{{project.project_name}}</a>
                      </div>
                    </div>
                  </div>
                  <div class="modified box-align-center">
                    <div>{{project.update_datetime || '-'}}</div>
                  </div>
                </li>
              </div>
              <div v-else class="empty-data-message">{{ vueTexts.NO_PROJECT }}</div>
            </ul>
          </div>
        </div>

        <div>
          <div class="box box-align-center table-title job-history-menu-height ellipsis">
            <em>{{ vueTexts.RECENT_JOB }}</em>
          </div>
          <div class="job-list-container">
            <ul>
              <div v-if="isExistsJobs()">
                <li v-for="(job, i) in jobList" v-bind:key="'job' + i" v-bind:data-pid="job.jobId" class="box box-align-center recent-job-list">
                  <div class="project-info box box-align-center webkit-box-vertical-start">
                    <div class="box box-align-center project-name-area">
                      <canvas v-bind:id="'job-history-progress-' + i" width="24" height="24"></canvas>
                      <div class="job-history-project-name ellipsis project-name-link-area">
                        <span v-if="job.deleted">{{job.jobName}}</span>
                        <a v-else v-bind:href="getJobLink(job)">{{job.jobName}}</a>
                      </div>
                    </div>
                    <div class="project-name recent-job-info-mergin ellipsis">
                      <span>{{job.projectName}}</span>
                    </div>
                    <div class="status-label-gray recent-job-info-mergin">{{capitalize(job.type)}}, {{capitalize(job.status)}}</div>
                  </div>
                  <div class="modified-recent-job box-align-center">
                    <div>{{job.updateDatetime || '-'}}</div>
                  </div>
                </li>
              </div>
              <div v-else class="empty-data-message">{{ vueTexts.NO_JOB }}</div>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div id="right-menu-border" class="menu-border" @mousedown="resizeRightMenu"></div>
    <div id="right-menu-area" class="right-menu-area">
      <div class="right-menu-dashboard">
        <div class="box right-menu-title">
          <img src="/console/image/Information2.svg" />
          <span>{{ vueTexts.INFORMATION }}</span>
        </div>
      </div>
      <div id="info-area">
        <div id="info-text" v-if="infoText" v-html="infoText" :class="supportContents.length ? 'info-text half' : 'info-text'"></div>
        <template v-if="supportContents.length">
          <div v-if="infoText" class="border-area"><hr></div>
          <div id="support-text" :class="supportContents.length ? 'info-text half' : 'info-text'" v-html="supportContent"></div>
        </template>
      </div>
    </div>
    <Loading :isLoading="isLoading()" />
  </div>
</template>

<script lang="ts" src="./Dashboard.ts"></script>
