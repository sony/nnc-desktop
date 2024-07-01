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

<!-- src/components/TenantMembers.vue -->
<template>
  <div id="tenant-members-container">
    <div class="tenant-member-title">
      <span class="title">
        <em>{{componentTitle}}</em>
      </span>
      <span>
        <a v-if="hasAdminRole()" class="service-settings-button pointer" @click="onClickInvite">{{vueTexts.ADD_NEW}}</a>
      </span>
    </div>
    <div class="member-info">
      <span class="member-info-area">{{label}}</span>
    </div>
    <div class="border-top border-bottom tenant-member-heading-container">
      <div class="user-id">
        <div class="checkbox-area">
          <input id="member-all-check" type="checkbox" :checked="allChecked() || false" class="checkbox" @click="selectAll($event)">
          <label for="member-all-check"></label>
        </div>
        <div class="user-id-area ellipsis">
          <span>ID</span>
        </div>
      </div>
      <div class="user-name">{{vueTexts.NAME}}</div>
      <div class="role">{{vueTexts.TYPE}}</div>
      <div class="storage">{{vueTexts.WORKSPACE_USAGE}}</div>
      <div class="amount">
        <div id="tenant-members-amount" class="box box-align-center pointer">
          <div>{{vueTexts.JOB_AMOUNT}}</div>
          <div class="select-area">
            <label class="select-label">
              <select class="select-menu" @change="onChangeAmountType" :value="selectedAmountType">
                <option value="total">{{vueTexts.TOTAL}}</option>
                <option value="thisMonth">{{vueTexts.THIS_MONTH}}</option>
                <option value="lastMonth">{{vueTexts.LAST_MONTH}}</option>
              </select>
            </label>
          </div>
        </div>
      </div>
      <div class="action">
        <div id="action-icon-tenant-members" class="box box-align-center pointer" @click.stop="onClickAction">
          <div>{{vueTexts.ACTION}}</div>
          <img src="/console/image/ArrowDownBlue.svg" alt="Action" class="action-icon">
        </div>
      </div>
    </div>
    <div class="member-list-container">
      <ul>
        <li v-for="(member, i) in getMemberList()" v-bind:key="'member' + i" class="box member-list">
          <div class="user-id ellipsis">
            <div class="checkbox-area">
              <input :id="'member' + member.userId" type="checkbox" :disabled="!isDeletableUser(member.userId, member.role)" :checked="member.checked || false" class="checkbox" @click="select($event, member.userId)">
              <label :data-pid="member.userId" :for="'member' + member.userId"></label>
            </div>
            <div class="user-id-area ellipsis">
              <span>{{member.userId}}</span>
            </div>
          </div>
          <div class="user-name ellipsis">
            <span>{{member.nickname || ''}}</span>
          </div>
          <div class="role box-align-center ellipsis">
            {{getTypeName(member.role)}}
            <span v-if="isPending(member.status)">(Inviting)</span>
            <span v-if="isFailed(member.status)">(Failed)</span>
            <span v-if="isExpired(member.status)">(Expired)</span>
          </div>
          <div class="storage box-align-center">
            {{convertWorkspaceUsed(member.workspaceUsed)}}
          </div>
          <div class="amount box-align-center pointer" v-if="shouldShowCurrencySymbol(member.elapsedTimeForEachInstances)" @click="showDetails(member.elapsedTimeForEachInstances)">
            <a>
              <span v-html="getCurrencySymbol() + ' '"></span>
              {{getPrice(member.elapsedTimeForEachInstances)}}
            </a>
          </div>
          <div class="amount box-align-center" v-else>-</div>
          <div class="action box-align-center">
            <div class="action-image">
              <img v-if="isChangeableRole(member.userId, member.role, member.status) && hasAdminRole()" src="/console/image/Rename.svg" alt="ChangeRole" @click="changeRole(member.userId, member.nickname, member.role)">
              <img v-else src="/console/image/Rename.svg" alt="ChangeRole" class="disabled">
            </div>
            <div class="action-image">
              <img v-if="isDeletableUser(member.userId, member.role) && hasAdminRole()" src="/console/image/Remove.svg" alt="Delete" @click="deleteUser(member.userId, member.nickname)">
              <img v-else src="/console/image/Remove.svg" alt="Delete" class="disabled">
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div id="action-list-tenant-members">
      <ul class="action-list-area">
        <li v-if="checked() && hasAdminRole()" class="action-list-item pointer" @click="deleteAll">{{vueTexts.DELETE}}</li>
        <li v-else class="action-list-item disabled" @click.stop>{{vueTexts.DELETE}}</li>
      </ul>
    </div>
    <Loading2 :isLoading="isLoading" />
  </div>
</template>

<script lang="ts" src="./TenantMembers.ts"></script>
