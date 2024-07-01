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

<!-- src/components/Dialog/PipelineChange.vue -->
<template>
  <div class="pipeline-dialog">
    <div class="pipeline-dialog-main">
      <div>{{dialogTexts.TITLE}}</div>

      <div class="dialog-content">
        <div class="row">
          <div class="name">{{ dialogTexts.PIPELINE_NAME }}</div>
          <div class="value">
            <input v-model="inputtedName" @input="onChangeName($event.target.value)" />
            <div class="error-message" v-if="errorMessage">{{errorMessage}}</div>
          </div>
        </div>

        <div class="row">
          <div class="name">{{ dialogTexts.IS_SEND_MAIL }}</div>
          <div class="value">
            <radio @input="onChangeSendMail" name="sendMail" :value="inputtedIsSendMail" :choice="true" label="ON" />
            <radio @input="onChangeSendMail" name="sendMail" :value="inputtedIsSendMail" :choice="false" label="OFF" />
          </div>
        </div>

        <div class="row">
          <div class="name">{{ dialogTexts.TRAIN_INSTANCE }}</div>
          <div class="value">
            <radio @input="(value) => onChangeProvider(value, true)" name="train-provider" :value="selectedTrainInstanceProvider" choice="standard" label="Standard" />
            <radio @input="(value) => onChangeProvider(value, true)" name="train-provider" :value="selectedTrainInstanceProvider" choice="abci" label="ABCI" :disabled="!abciInstance.length" />
            <div>
              <label class="select-label">
                <select class="select-menu" name="select-label" @change="onChangeInstanceType($event.target.value, true)" :value="selectedTrainInstanceType">
                  <option v-for="(instance, i) in trainInstance" :value="instance.instanceType" :key="'train_option'+ i">
                    {{ instance.description['ja-JP'] }}
                  </option>
                </select>
              </label>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="name">{{ dialogTexts.EVALUATE_INSTANCE }}</div>
          <div class="value">
            <radio @input="(value) => onChangeProvider(value, false)" name="evaluate-provider" :value="selectedEvaluateInstanceProvider" choice="standard" label="Standard" />
            <radio @input="(value) => onChangeProvider(value, false)" name="evaluate-provider" :value="selectedEvaluateInstanceProvider" choice="abci" label="ABCI" :disabled="!abciInstance.length" />
            <div>
              <label class="select-label">
                <select class="select-menu" name="select-label" @change="onChangeInstanceType($event.target.value, false)" :value="selectedEvaluateInstanceType">
                  <option v-for="(instance, i) in evaluateInstance" :value="instance.instanceType" :key="'evaluate_option'+ i">
                    {{ instance.description['ja-JP'] }}
                  </option>
                </select>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div class="button-area">
        <button class="button cancel" @click="$emit('cancel')">Cancel</button>
        <button class="button update" @click="onClickUpdate" :disabled="disabled">Update</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./PipelineChange.ts"></script>
