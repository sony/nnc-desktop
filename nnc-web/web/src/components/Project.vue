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

<!-- src/components/Project.vue -->
<template>
  <div id="project-area" :class="hasShareTenant ? 'share' : ''">
    <div id="project-container" :class="!isLocalTenant() ? 'share-tenant' : ''">
      <tenant-tabs
        v-if="hasShareTenant"
        :tenantList="tenantList"
        :selectedTenantId="selectedTenantId"
        :onClickTenantTab="onChangeTab"
        :warningList="getWarningList()"
        @apierror="(error, callback) => $emit('apierror', error, callback)"
      />
      <div class="box box-align-center project-menu-height project-action">
        <div class="box box-align-center action-menu-area" @click="createProject">
          <div class="box box-align-center action-menu">
            <img src="/console/image/AddNew.svg" alt="Add">
            <div class="action-menu-string">
              <em>{{vueTexts.NEW_PROJECT}}</em>
            </div>
          </div>
        </div>
        <div class="box box-align-center action-menu-area">
          <div class="box box-align-center action-menu">
            <img src="/console/image/upload.svg" alt="Upload">
            <div class="action-menu-string">
              <em>{{vueTexts.UPLOAD_PROJECT}}</em>
            </div>
            <label id="project-uploader-label" for="project-uploader">
              <input id="project-uploader" @click="openUploadDialog" style="display:none">
            </label>
          </div>
        </div>
        <div class="action-menu-area-filter-and-search">
          <div class="box box-align-center action-menu">
            <label class="select-label">
              <select class="select-menu sample-sort" @change="onChangeOrder" :value="getCurrentSort()" @focus="onFocus" :tabindex="isShowingDialog ? -1 : 0">
                <option v-for="(option, i) in selectOptions" :key="'option' + i" :value="option.value">{{option.key[language]}}</option>
              </select>
            </label>
          </div>
          <div class="box box-align-center action-menu-area-filter-by-label">
            <div class="box box-align-center action-menu">
              <div class="action-menu-string"></div>
              <label class="select-label">
                <select class="select-menu" @change="changeLabel" :value="getSelectedLabel()" :tabindex="isShowingDialog ? -1 : 0">
                  <option v-for="(name, i) in labelList" :key="'name' + i" :value="name">{{convertToNickName(name)}}</option>
                </select>
              </label>
            </div>
          </div>
          <div class="box box-align-center">
            <div class="box box-align-center action-menu">
              <div class="action-menu-string"></div>
              <input id="project-search" class="form-control" :value="keyword" @keyup="oninput($event.currentTarget.value)" @keyup.esc="initKeyword()" type="text" :placeholder="vueTexts.SEARCH" style="border:none;" :tabindex="isShowingDialog ? -1 : 0">
            </div>
          </div>
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
          <ul id="project-list">
            <li v-for="(project, i) in projectList" v-bind:key="'project' + i" class="project-list">
              <!-- サンプルプロジェクト -->
              <div class="box box-align-center sample-project-content sample" v-if="project.isSample">
                <div class="project-name box box-align-center project-content">
                  <div @click.stop class="sample-project-name-link ellipsis">
                    <a v-bind:data-pid="project.project_id" href="/" @click.prevent="onClickSampleProject(project.project_id, project.project_name)" :tabindex="isShowingDialog ? -1 : 0" >{{project.project_name}}</a>
                    <div class="count-area">
                      <div class="copy-count-area" title="Copy">
                        <div class="copy-img-area"><img src="/console/image/Copy.svg"></div>
                        <div class="copy-count">{{project.copy_count}}</div>
                      </div>
                      <div class="star-count-area" title="Likes">
                        <div :class="project.starred ? 'star selected' : 'star'" @click.stop.prevent="addOrDeleteStar(project.project_id, project.starred)"></div>
                        <div class="star-count">{{project.star_count}}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="modified box box-align-center">
                  <div class="sample-project">{{ commonVueTexts.SAMPLE }}</div>
                </div>
                <div class="action box box-align-center box-pack-end">
                  <div class="action-image pointer" v-if="project.starred"><img src="/console/image/Like-on.svg" alt="Favorite" @click.stop="addOrDeleteStar(project.project_id, project.starred)" /></div>
                  <div class="action-image pointer" v-else><img src="/console/image/Like-off.svg" alt="Favorite" @click.stop="addOrDeleteStar(project.project_id, project.starred)" /></div>
                </div>
              </div>
              <!-- ユーザープロジェクト -->
              <!-- ready -->
              <div v-else-if="project.status === 'ready' || project.status === 'processing'" v-bind:data-pid="project.project_id" class="box box-align-center project-area user-project project-content pointer" @click.prevent="onClickProject(project.project_id)">
                <div class="project-name project-content" v-if="project.shouldShowInput && !isLocalTenant()">
                  <div class="project-name-link saving ellipsis">
                    <input id="project-name-input" :data-pid="project.project_id" type="text" :value="project.inputValue" @keydown="onKeydownProjectName" @input="inputProjectName(project.project_id, $event.currentTarget.value)" @click.stop @blur="rename($event, project.project_id)">
                  </div>
                  <div class="project-additional-info">
                    <div :class="project.readonly ? 'editing owner-area ellipsis' : 'owner-area ellipsis'">
                      <div><img src="/console/image/Account.svg"></div>
                      <div class="owner-name-area ellipsis">{{getUserName(project.owner_user_id)}}</div>
                    </div>
                    <div v-if="project.readonly" class="editing-user-area ellipsis">Editing by: {{getUserName(project.last_modified_user_id)}}</div>
                  </div>
                  <div class="job-storage-used-area ellipsis">
                    <div>
                      <img src="/console/image/Database.svg">
                    </div>
                    <div class="job-storage-used-area-value ellipsis">
                      <span>{{calcJobStorage(project.storage_used)}}</span>
                    </div>
                  </div>
                </div>
                <div class="project-name box box-align-center project-content" v-else-if="project.shouldShowInput && isLocalTenant()">
                  <div class="project-name-link saving ellipsis">
                    <input id="project-name-input" :data-pid="project.project_id" type="text" :value="project.inputValue" @keydown="onKeydownProjectName" @input="inputProjectName(project.project_id, $event.currentTarget.value)" @click.stop @blur="rename($event, project.project_id)">
                    <div class="job-storage-used-area-local ellipsis">
                      <div>
                        <img src="/console/image/Database.svg">
                      </div>
                      <div class="job-storage-used-area-value ellipsis">
                        <span>{{calcJobStorage(project.storage_used)}}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="project-name project-content" v-else-if="!isLocalTenant()">
                  <div class="project-name-link saving ellipsis">
                    <a @click.stop v-bind:href="'./editor?project_id=' + project.project_id" :tabindex="isShowingDialog ? -1 : 0">{{project.project_name}}</a>
                  </div>
                  <div class="project-additional-info">
                    <div :class="project.readonly ? 'editing owner-area ellipsis' : 'owner-area ellipsis'">
                      <div><img src="/console/image/Account.svg"></div>
                      <div class="owner-name-area ellipsis">{{getUserName(project.owner_user_id)}}</div>
                    </div>
                    <div v-if="project.readonly" class="editing-user-area ellipsis">Editing by: {{getUserName(project.last_modified_user_id)}}</div>
                  </div>
                  <div class="job-storage-used-area ellipsis">
                    <div>
                      <img src="/console/image/Database.svg">
                    </div>
                    <div class="job-storage-used-area-value ellipsis">
                      <span>{{calcJobStorage(project.storage_used)}}</span>
                    </div>
                  </div>
                </div>
                <div class="project-name box box-align-center project-content" v-else>
                  <div class="project-name-link saving ellipsis">
                    <a @click.stop v-bind:href="'./editor?project_id=' + project.project_id" :tabindex="isShowingDialog ? -1 : 0">{{project.project_name}}</a>
                    <div class="job-storage-used-area-local ellipsis">
                      <div>
                        <img src="/console/image/Database.svg">
                      </div>
                      <div class="job-storage-used-area-value ellipsis">
                        <span>{{calcJobStorage(project.storage_used)}}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="modified box-align-center ellipsis saving">
                  <span v-if="!project.progress" class="active">{{vueTexts.SAVING}}</span>
                  <span v-else class="active">{{`${vueTexts.SAVING} : ${project.progress}%`}}</span>
                  <div class="putted-labels-area">
                    <span class="putted-labels" v-for="(label, i) in project.labels" :key="'option' + i">{{label}}</span>
                  </div>
                </div>
                <div class="action box box-align-center box-pack-end">
                  <div class="action-image label-icon"><img v-bind:data-pid="project.project_id" src="/console/image/Tag.svg" alt="Label" @click.stop="onClickLabel(project.project_id)"></div>
                  <div class="action-image"><img v-bind:data-pid="project.project_id" src="/console/image/Copy.svg" alt="Copy" @click.stop="onClickCopy(project.project_id, project.project_name)"></div>
                  <div class="action-image"><img v-bind:data-pid="project.project_id" src="/console/image/Rename.svg" alt="Rename" @click.stop="onClickRenameIcon(project.project_id, project.owner_user_id)"></div>
                  <div class="action-image"><img v-bind:data-pid="project.project_id" src="/console/image/Download.svg" alt="Download" @click.stop="download(project.project_id)"></div>
                </div>
              </div>
              <!-- failed -->
              <div v-else-if="project.status === 'failed'" v-bind:data-pid="project.project_id" class="box box-align-center project-area user-project project-content">
                <div class="project-name project-content" v-if="!isLocalTenant()">
                  <div class="project-name-area">
                    <div class="checkbox-area">
                      <input v-bind:id="project.project_id" v-bind:data-pid="project.project_id" type="checkbox" v-bind:checked="project.checked || false" class="checkbox project-content">
                      <label v-bind:data-pid="project.project_id" v-bind:for="project.project_id" @click="select"></label>
                    </div>
                    <div class="project-name-link ellipsis">
                      <span>{{project.project_name}}</span>
                    </div>
                  </div>
                  <div class="project-additional-info">
                    <div :class="project.readonly ? 'editing owner-area ellipsis' : 'owner-area ellipsis'">
                      <div><img src="/console/image/Account.svg"></div>
                      <div class="owner-name-area ellipsis">{{getUserName(project.owner_user_id)}}</div>
                    </div>
                    <div v-if="project.readonly" class="editing-user-area ellipsis">Editing by: {{getUserName(project.last_modified_user_id)}}</div>
                  </div>
                  <div class="job-storage-used-area ellipsis">
                    <div>
                      <img src="/console/image/Database.svg">
                    </div>
                    <div class="job-storage-used-area-value ellipsis">
                      <span>{{calcJobStorage(project.storage_used)}}</span>
                    </div>
                  </div>
                </div>
                <div class="project-name box box-align-center project-content" v-else>
                  <div class="checkbox-area-local">
                    <input v-bind:id="project.project_id" v-bind:data-pid="project.project_id" type="checkbox" v-bind:checked="project.checked || false" class="checkbox project-content">
                    <label v-bind:data-pid="project.project_id" v-bind:for="project.project_id" @click="select"></label>
                  </div>
                  <div class="project-name-link ellipsis">
                    <span>{{project.project_name}}</span>
                    <div class="job-storage-used-area-local ellipsis">
                      <div>
                        <img src="/console/image/Database.svg">
                      </div>
                      <div class="job-storage-used-area-value ellipsis">
                        <span>{{calcJobStorage(project.storage_used)}}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="modified box-align-center ellipsis saving">
                  <span class="failed">{{vueTexts.FAILED_TO_SAVE}}</span>
                  <div class="putted-labels-area">
                    <span class="putted-labels" v-for="(label, i) in project.labels" :key="'option' + i">{{label}}</span>
                  </div>
                </div>
                <div class="action box box-align-center box-pack-end">
                  <div class="action-image pointer"><img v-bind:data-pid="project.project_id" src="/console/image/Delete.svg" alt="Delete" @click.stop="deleteProject(project.project_id, project.owner_user_id)"></div>
                </div>
              </div>
              <!-- upload status ready -->
              <div v-else-if="isImporting(project)" v-bind:data-pid="project.project_id" class="box box-align-center project-area user-project project-content">
                <div class="project-name project-content" v-if="!isLocalTenant()">
                  <div class="project-name-area">
                    <div class="checkbox-area">
                      <input v-bind:id="project.project_id" v-bind:data-pid="project.project_id" type="checkbox" v-bind:checked="project.checked || false" class="checkbox project-content">
                      <label v-bind:data-pid="project.project_id" v-bind:for="project.project_id" @click="select"></label>
                    </div>
                    <div class="project-name-link ellipsis">
                      <span>{{project.project_name}}</span>
                    </div>
                  </div>
                  <div class="project-additional-info">
                    <div :class="project.readonly ? 'editing owner-area ellipsis' : 'owner-area ellipsis'">
                      <div><img src="/console/image/Account.svg"></div>
                      <div class="owner-name-area ellipsis">{{getUserName(project.owner_user_id)}}</div>
                    </div>
                    <div v-if="project.readonly" class="editing-user-area ellipsis">Editing by: {{getUserName(project.last_modified_user_id)}}</div>
                  </div>
                  <div class="job-storage-used-area ellipsis">
                    <div>
                      <img src="/console/image/Database.svg">
                    </div>
                    <div class="job-storage-used-area-value ellipsis">
                      <span>{{calcJobStorage(project.storage_used)}}</span>
                    </div>
                  </div>
                </div>
                <div class="project-name box box-align-center project-content" v-else>
                  <div class="checkbox-area-local">
                    <input v-bind:id="project.project_id" v-bind:data-pid="project.project_id" type="checkbox" v-bind:checked="project.checked || false" class="checkbox project-content">
                    <label v-bind:data-pid="project.project_id" v-bind:for="project.project_id" @click="select"></label>
                  </div>
                  <div class="project-name-link ellipsis">
                    <span>{{project.project_name}}</span>
                    <div class="job-storage-used-area-local ellipsis">
                      <div>
                        <img src="/console/image/Database.svg">
                      </div>
                      <div class="job-storage-used-area-value ellipsis">
                        <span>{{calcJobStorage(project.storage_used)}}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="modified box-align-center ellipsis saving">
                  <span class="active">{{vueTexts.SAVING}}</span>
                  <div class="putted-labels-area">
                    <span class="putted-labels" v-for="(label, i) in project.labels" :key="'option' + i">{{label}}</span>
                  </div>
                </div>
                <div class="action box box-align-center box-pack-end">
                  <div class="action-image label-icon"><img v-bind:data-pid="project.project_id" src="/console/image/Tag.svg" alt="Label" @click.stop="onClickLabel(project.project_id)"></div>
                  <div class="action-image pointer"><img v-bind:data-pid="project.project_id" src="/console/image/Delete.svg" alt="Delete" @click.stop="deleteProject(project.project_id, project.owner_user_id)"></div>
                </div>
              </div>
              <!-- upload status failed -->
              <div v-else-if="isImportFailed(project)" v-bind:data-pid="project.project_id" class="box box-align-center project-area user-project project-content">
                <div class="project-name project-content" v-if="!isLocalTenant()">
                  <div class="project-name-area">
                    <div class="checkbox-area">
                      <input v-bind:id="project.project_id" v-bind:data-pid="project.project_id" type="checkbox" v-bind:checked="project.checked || false" class="checkbox project-content">
                      <label v-bind:data-pid="project.project_id" v-bind:for="project.project_id" @click="select"></label>
                    </div>
                    <div class="project-name-link ellipsis">
                      <span>{{project.project_name}}</span>
                    </div>
                  </div>
                  <div class="project-additional-info">
                    <div :class="project.readonly ? 'editing owner-area ellipsis' : 'owner-area ellipsis'">
                      <div><img src="/console/image/Account.svg"></div>
                      <div class="owner-name-area ellipsis">{{getUserName(project.owner_user_id)}}</div>
                    </div>
                    <div v-if="project.readonly" class="editing-user-area ellipsis">Editing by: {{getUserName(project.last_modified_user_id)}}</div>
                  </div>
                  <div class="job-storage-used-area ellipsis">
                    <div>
                      <img src="/console/image/Database.svg">
                    </div>
                    <div class="job-storage-used-area-value ellipsis">
                      <span>{{calcJobStorage(project.storage_used)}}</span>
                    </div>
                  </div>
                </div>
                <div class="project-name box box-align-center project-content" v-else>
                  <div class="checkbox-area-local">
                    <input v-bind:id="project.project_id" v-bind:data-pid="project.project_id" type="checkbox" v-bind:checked="project.checked || false" class="checkbox project-content">
                    <label v-bind:data-pid="project.project_id" v-bind:for="project.project_id" @click="select"></label>
                  </div>
                  <div class="project-name-link ellipsis">
                    <span>{{project.project_name}}</span>
                    <div class="job-storage-used-area-local ellipsis">
                      <div>
                        <img src="/console/image/Database.svg">
                      </div>
                      <div class="job-storage-used-area-value ellipsis">
                        <span>{{calcJobStorage(project.storage_used)}}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="modified box-align-center ellipsis saving">
                  <span class="failed">{{vueTexts.FAILED_TO_SAVE}}
                    <img src="/console/image/Warning.svg" @click="showImportErrorMsg(project.import_error_msg)">
                  </span>
                  <div class="putted-labels-area">
                    <span class="putted-labels" v-for="(label, i) in project.labels" :key="'option' + i">{{label}}</span>
                  </div>
                </div>
                <div class="action box box-align-center box-pack-end">
                  <div class="action-image pointer"><img v-bind:data-pid="project.project_id" src="/console/image/Delete.svg" alt="Delete" @click.stop="deleteProject(project.project_id, project.owner_user_id)"></div>
                </div>
              </div>
              <!-- completed -->
              <div v-else v-bind:data-pid="project.project_id" class="box box-align-center project-area user-project project-content pointer" @click.prevent="onClickProject(project.project_id)">
                <div class="project-name project-content" v-if="project.shouldShowInput && !isLocalTenant()">
                  <div class="project-name-area">
                    <div class="checkbox-area">
                      <input v-bind:id="project.project_id" v-bind:data-pid="project.project_id" type="checkbox" v-bind:checked="project.checked || false" class="checkbox project-content">
                      <label v-bind:data-pid="project.project_id" v-bind:for="project.project_id" @click="select"></label>
                    </div>
                    <div class="project-name-link ellipsis">
                      <input id="project-name-input" :data-pid="project.project_id" type="text" :value="project.inputValue" @keydown="onKeydownProjectName" @input="inputProjectName(project.project_id, $event.currentTarget.value)" @click.stop @blur="rename($event, project.project_id)">
                    </div>
                  </div>
                  <div class="project-additional-info">
                    <div :class="project.readonly ? 'editing owner-area ellipsis' : 'owner-area ellipsis'">
                      <div><img src="/console/image/Account.svg"></div>
                      <div class="owner-name-area ellipsis">{{getUserName(project.owner_user_id)}}</div>
                    </div>
                    <div v-if="project.readonly" class="editing-user-area ellipsis">Editing by: {{getUserName(project.last_modified_user_id)}}</div>
                  </div>
                  <div class="job-storage-used-area ellipsis">
                    <div>
                      <img src="/console/image/Database.svg">
                    </div>
                    <div class="job-storage-used-area-value ellipsis">
                      <span>{{calcJobStorage(project.storage_used)}}</span>
                    </div>
                  </div>
                </div>
                <div class="project-name box box-align-center project-content" v-else-if="project.shouldShowInput && isLocalTenant()">
                  <div class="checkbox-area-local">
                    <input v-bind:id="project.project_id" v-bind:data-pid="project.project_id" type="checkbox" v-bind:checked="project.checked || false" class="checkbox project-content">
                    <label v-bind:data-pid="project.project_id" v-bind:for="project.project_id" @click="select"></label>
                  </div>
                  <div class="project-name-link ellipsis">
                    <input id="project-name-input" :data-pid="project.project_id" type="text" :value="project.inputValue" @keydown="onKeydownProjectName" @input="inputProjectName(project.project_id, $event.currentTarget.value)" @click.stop @blur="rename($event, project.project_id)">
                    <div class="job-storage-used-area-local ellipsis">
                      <div>
                        <img src="/console/image/Database.svg">
                      </div>
                      <div class="job-storage-used-area-value ellipsis">
                        <span>{{calcJobStorage(project.storage_used)}}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="project-name project-content" v-else-if="!isLocalTenant()">
                  <div class="project-name-area">
                    <div class="checkbox-area">
                      <input v-bind:id="project.project_id" v-bind:data-pid="project.project_id" type="checkbox" v-bind:checked="project.checked || false" class="checkbox project-content">
                      <label v-bind:data-pid="project.project_id" v-bind:for="project.project_id" @click="select"></label>
                    </div>
                    <div class="project-name-link ellipsis">
                      <a @click.stop v-bind:href="'./editor?project_id=' + project.project_id" :tabindex="isShowingDialog ? -1 : 0">{{project.project_name}}</a>
                    </div>
                  </div>
                  <div class="project-additional-info">
                    <div :class="project.readonly ? 'editing owner-area ellipsis' : 'owner-area ellipsis'">
                      <div><img src="/console/image/Account.svg"></div>
                      <div class="owner-name-area ellipsis">{{getUserName(project.owner_user_id)}}</div>
                    </div>
                    <div v-if="project.readonly" class="editing-user-area ellipsis">Editing by: {{getUserName(project.last_modified_user_id)}}</div>
                  </div>
                  <div class="job-storage-used-area ellipsis">
                    <div>
                      <img src="/console/image/Database.svg">
                    </div>
                    <div class="job-storage-used-area-value ellipsis">
                      <span>{{calcJobStorage(project.storage_used)}}</span>
                    </div>
                  </div>
                </div>
                <div class="project-name box box-align-center project-content" v-else>
                  <div class="checkbox-area-local">
                    <input v-bind:id="project.project_id" v-bind:data-pid="project.project_id" type="checkbox" v-bind:checked="project.checked || false" class="checkbox project-content">
                    <label v-bind:data-pid="project.project_id" v-bind:for="project.project_id" @click="select"></label>
                  </div>
                  <div class="project-name-link ellipsis">
                    <a @click.stop v-bind:href="'./editor?project_id=' + project.project_id" :tabindex="isShowingDialog ? -1 : 0">{{project.project_name}}</a>
                    <div class="job-storage-used-area-local ellipsis">
                      <div>
                        <img src="/console/image/Database.svg">
                      </div>
                      <div class="job-storage-used-area-value ellipsis">
                        <span>{{calcJobStorage(project.storage_used)}}</span>
                      </div>
                    </div>
                  </div>

                </div>
                <div class="modified box-align-center ellipsis">
                  <span>{{project.update_datetime}}</span>
                  <div class="putted-labels-area">
                    <span class="putted-labels" v-for="(label, i) in project.labels" :key="'option' + i">{{label}}</span>
                  </div>
                </div>
                <div class="action box box-align-center box-pack-end">
                  <div class="action-image label-icon"><img v-bind:data-pid="project.project_id" src="/console/image/Tag.svg" alt="Label" @click.stop="onClickLabel(project.project_id)"></div>
                  <div class="action-image"><img v-bind:data-pid="project.project_id" src="/console/image/Copy.svg" alt="Copy" @click.stop="onClickCopy(project.project_id, project.project_name)"></div>
                  <div class="action-image"><img v-bind:data-pid="project.project_id" src="/console/image/Rename.svg" alt="Rename" @click.stop="onClickRenameIcon(project.project_id, project.owner_user_id)"></div>
                  <div class="action-image"><img v-bind:data-pid="project.project_id" src="/console/image/Download.svg" alt="Download" @click.stop="download(project.project_id)"></div>
                  <div class="action-image"><img v-bind:data-pid="project.project_id" src="/console/image/Delete.svg" alt="Delete" @click.stop="deleteProject(project.project_id, project.owner_user_id)"></div>
                </div>
              </div>
            </li>

          </ul>
        </div>
        <Loading2 :isLoading="isProjectListLoading()" />
      </div>
    </div>
    <div id="right-menu-border" class="menu-border" @mousedown="resizeRightMenu"></div>
    <div id="project-job-list">
      <div id="overview-area">
        <div class="title">
          <em>{{vueTexts.OVERVIEW}}</em>
          <label class="select-label" v-if="networkList.length">
            <select class="select-menu" @change="changeNetwork" :value="networkIndex" :tabindex="isShowingDialog ? -1 : 0">
              <option v-for="(name, i) in networkList" :key="'option' + i" :value="i">{{name}}</option>
            </select>
          </label>
        </div>
        <overview
          :configuration="configuration"
          :completedConfiguration="completedConfiguration"
          :networkIndex="networkIndex"
          :width="rightWidth"
        />
      </div>
      <div id="job-container">
        <div class="job-title box box-align-center">
          <em>{{vueTexts.JOB_LIST}}</em>
        </div>
        <ul id="job-list">
          <li v-for="(job, i) in jobs" v-bind:key="'job' + i" class="pointer job-list box box-align-center" @click="onClickJobList(getJobLink(job))">
            <div class="job-list-content box box-align-center">
              <canvas v-bind:id="'job-history-progress-' + i" width="24" height="24"></canvas>
              <div class="job-content">
                <div class="action-image"><img src="/console/image/Delete.svg" alt="Delete" @click.stop="deleteJob(job.jobId, job.jobName)"></div>
                <div class="name ellipsis">{{job.jobName}}</div>
                <div class="status ellipsis">{{getTypeAndStatus(job)}}</div>
                <div class="job-storage-used-area ellipsis">
                  <div>
                    <img src="/console/image/Database.svg">
                  </div>
                  <div class="job-storage-used-area-value ellipsis">
                    <span>{{calcJobStorage(job.storageUsed)}}</span>
                  </div>
                </div>
              </div>
              <div class="project-job-link">
                <img src="/console/image/Arrow.svg" alt="Arrow">
              </div>
            </div>
          </li>
          <li v-if="jobs.length < jobTotal" id="job-list-load-more" class="box box-align-center load-more">
            <div v-bind:data-pid="jobs[0].projectId" class="box box-align-center load-more-area" @click="loadMoreJob">
              <img src="/console/image/Load.svg" alt="Load">
              <div class="load-more-string">
                <span>Load More</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <Loading2 :isLoading="isProjectJobLoading()" />
    </div>
    <div id="action-list">
      <ul class="action-list-area">
        <li v-bind:class="checked() ? 'action-list-item pointer' : 'action-list-item disabled'" @click="deleteAll">{{vueTexts.DELETE}}</li>
      </ul>
    </div>
    <label-dialog
      v-if="shouldShowDialog"
      :title="vueTexts.LABEL_TITLE"
      :labelList="getProjectLabelList()"
      :allLabelList="getAllLabelList()"
      :vueTexts="vueTexts"
      :selectOptionLabels="getSelectOptionlabels()"
      :callback="onUpdate"
      :createNewLabelCallback="onCreateLabel"
      :cancelCallback="onCancel"
    />
    <upload-project-dialog
      v-if="shouldShowUploadDialog"
      :title="vueTexts.UPLOAD_PROJECT_TITLE"
      :vueTexts="vueTexts"
      :callback="uploadProject"
      :cancelCallback="onCancelUploadProject"
    />
  </div>
</template>

<script lang="ts" src="./Project.ts"></script>
