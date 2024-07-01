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

<!-- src/components/JobHistory.vue -->
<template>
  <div id="job-history-area" :class="hasShareTenant ? 'share' : ''">
    <div id="job-history-container" :class="!isLocalTenant() ? 'share-tenant' : ''">
      <tenant-tabs
        v-if="hasShareTenant"
        :tenantList="tenantList"
        :selectedTenantId="selectedTenantId"
        :onClickTenantTab="onChangeTab"
        :warningList="[]"
        @apierror="(error, callback) => $emit('apierror', error, callback)"
      />
      <div class="box box-align-center job-history-menu-height job-history-title">
        <div class="title">
          <em>{{ vueTexts.TITLE }}</em>
        </div>
      </div>
      <div class="wh-100">
        <div class="border-top border-bottom job-history-headeing-container">
          <div class="box box-align-center job-history-menu-height">
            <div class="project-info box box-align-center job-history-menu-height">
              <div class="job-history-header-area">
                <span>{{ vueTexts.NAME }}</span>
                <img src="/console/image/SortArrowDown-gray.svg" class="pointer" v-if="shouldShowIcon('-job_name', false)" @click="onClickSort('-job_name')" />
                <img src="/console/image/SortArrowDown-blue.svg" class="pointer" v-if="shouldShowIcon('-job_name', true)" @click="onClickSort('-job_name')" />
                <img src="/console/image/SortArrowUp-gray.svg" class="pointer" v-if="shouldShowIcon('+job_name', false)" @click="onClickSort('+job_name')" />
                <img src="/console/image/SortArrowUp-blue.svg" class="pointer" v-if="shouldShowIcon('+job_name', true)" @click="onClickSort('+job_name')" />
              </div>
            </div>
            <div class="owner box box-align-center job-history-menu-height" v-if="!isLocalTenant()">
              <div class="job-history-header-area">
                <span>{{ vueTexts.OWNER_ID }}</span>
                <img src="/console/image/SortArrowDown-gray.svg" class="pointer" v-if="shouldShowIcon('-exec_user_id', false)" @click="onClickSort('-exec_user_id')" />
                <img src="/console/image/SortArrowDown-blue.svg" class="pointer" v-if="shouldShowIcon('-exec_user_id', true)" @click="onClickSort('-exec_user_id')" />
                <img src="/console/image/SortArrowUp-gray.svg" class="pointer" v-if="shouldShowIcon('+exec_user_id', false)" @click="onClickSort('+exec_user_id')" />
                <img src="/console/image/SortArrowUp-blue.svg" class="pointer" v-if="shouldShowIcon('+exec_user_id', true)" @click="onClickSort('+exec_user_id')" />
              </div>
            </div>
            <div class="processor-type box box-align-center job-history-menu-height">
              <div class="job-history-header-area">
                <span>{{ vueTexts.PROCESSOR }}</span>
              </div>
            </div>
            <div class="time box box-align-center job-history-menu-height">
              <div class="job-history-header-area">
                <span>{{ vueTexts.TIME }}</span>
                <img src="/console/image/SortArrowDown-gray.svg" class="pointer" v-if="shouldShowIcon('-elapsed_time', false)" @click="onClickSort('-elapsed_time')" />
                <img src="/console/image/SortArrowDown-blue.svg" class="pointer" v-if="shouldShowIcon('-elapsed_time', true)" @click="onClickSort('-elapsed_time')" />
                <img src="/console/image/SortArrowUp-gray.svg" class="pointer" v-if="shouldShowIcon('+elapsed_time', false)" @click="onClickSort('+elapsed_time')" />
                <img src="/console/image/SortArrowUp-blue.svg" class="pointer" v-if="shouldShowIcon('+elapsed_time', true)" @click="onClickSort('+elapsed_time')" />
              </div>
            </div>
            <div class="modified box box-align-center job-history-menu-height">
              <div class="job-history-header-area">
                <span>{{ vueTexts.MODIFIED }}</span>
                <img src="/console/image/SortArrowDown-gray.svg" class="pointer" v-if="shouldShowIcon('-update_datetime', false)" @click="onClickSort('-update_datetime')" />
                <img src="/console/image/SortArrowDown-blue.svg" class="pointer" v-if="shouldShowIcon('-update_datetime', true)" @click="onClickSort('-update_datetime')" />
                <img src="/console/image/SortArrowUp-gray.svg" class="pointer" v-if="shouldShowIcon('+update_datetime', false)" @click="onClickSort('+update_datetime')" />
                <img src="/console/image/SortArrowUp-blue.svg" class="pointer" v-if="shouldShowIcon('+update_datetime', true)" @click="onClickSort('+update_datetime')" />
              </div>
            </div>
          </div>
        </div>
        <div class="job-list-container"  @scroll="loadMoreJob" id="job-histroy-scroll">
          <ul>
            <li v-for="(job, i) in jobs" v-bind:key="'job' + i" v-bind:data-pid="job.jobId" class="box job-history-list">
              <div class="project-info box box-align-center webkit-box-vertical-start">
                <div class="box box-align-center project-name-area">
                  <canvas v-bind:id="'job-history-progress-' + i" width="24" height="24"></canvas>
                  <div class="job-history-project-name ellipsis project-name-link-area">
                    <span v-if="job.deleted">{{job.jobName}}</span>
                    <a v-else v-bind:href="getJobLink(job)">{{job.jobName}}</a>
                  </div>
                </div>
                <div class="project-name recent-job-info-mergin ellipsis">
                  <span v-if="job.deleted">{{job.projectName}}</span>
                  <a v-else v-bind:href="'./editor?project_id=' + job.projectId">{{job.projectName}}</a>
                </div>
                <div class="status-label-gray recent-job-info-mergin">{{capitalize(job.type)}}, {{capitalize(job.status)}}</div>
              </div>
              <div class="owner" v-if="!isLocalTenant()">
                <template v-if="isDeletedMember(job.execUserId) && getOwnerName(job.execUserId)">
                  <div class="ellipsis">{{job.execUserId}}</div>
                  <div class="ellipsis">{{getOwnerName(job.execUserId) + ' ' + '/'}}</div>
                  <div class="ellipsis" v-if="isDeletedMember(job.execUserId)">Missing user</div>
                </template>
                <template v-else-if="isDeletedMember(job.execUserId) && !getOwnerName(job.execUserId)">
                  <div class="ellipsis">{{job.execUserId}}</div>
                  <div class="ellipsis" v-if="isDeletedMember(job.execUserId)">Missing user</div>
                </template>
                <template v-else>
                  <div class="ellipsis">{{job.execUserId}}</div>
                  <div class="ellipsis" v-if="getOwnerName(job.execUserId)">{{getOwnerName(job.execUserId)}}</div>
                </template>
              </div>
              <div class="processor-type box-align-center ellipsis job-history-inner-list">
                <li v-for="(timeAndInstanceInfo, j) in job.elapsedTimeForEachInstance" v-bind:key="'timeAndInstanceInfo' + j" class="box box-align-center">
                  <div class="box box-align-center webkit-box-vertical-start">
                    {{getProcessorTypeString(timeAndInstanceInfo.instance_type)}}
                  </div>
                </li>
              </div>
              <div class="time box-align-center">
                <li v-for="(timeAndInstanceInfo, k) in job.elapsedTimeForEachInstance" v-bind:key="'timeAndInstanceInfo' + k" class="box box-align-center">
                  <div class="box box-align-center webkit-box-vertical-start">
                    {{getElapsedTime(timeAndInstanceInfo.elapsed_time)}}
                  </div>
                </li>
              </div>
              <div class="modified box-align-center">
                <div>{{job.updateDatetime || '-'}}</div>
              </div>
            </li>
          </ul>
        </div>
        <Loading2 :isLoading="isLoading()" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./JobHistory.ts"></script>
