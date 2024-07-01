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

<template>
  <div>
    <div><em>{{componentTitle}}</em></div>
    <div class="detail-area">
      <div>
        <img :src="infoImagePath">
      </div>
      <div class="ammount-used-area">
        <div class="ammount"><span v-if="main.shouldShowCurrencyUnit" v-html="currencyUnit" />{{main.text}}</div>
        <div class="used"><span v-if="description.shouldShowCurrencyUnit" v-html="currencyUnit" />{{description.text}}</div>
        <div><a :class="disabled ? 'disabled' : ''" @click="onClick" :tabindex="tabIndex">{{linkText}}</a></div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" src="./ServiceInfo.ts"></script>
