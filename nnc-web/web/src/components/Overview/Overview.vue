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

<!-- src/components/Overview.vue -->
<template>
  <svg id="overview" :viewBox="viewBox">
    <g>
      <Layer
        v-for="(node, i) in nodes"
        :key="'layer' + i"
        :layer="node"
        :layers="nodes"
        :completedLayer="getCompletedNode(node)"
        :completedLayers="completedLayers"
        :links="links"
        :statistics="completedConfiguration.statistics"
        :sideConnectionPositions="sideConnectorPositions"
        :networkIndex="networkIndex"
      />
      <g v-for="(link, j) in links" :key="'link' + j">
          <path
            v-if="isValidLink(link, nodes)"
            :d="d(link, sideConnectorPositions)"
            :style="linkStyle"
          />
      </g>
    </g>
  </svg>
</template>

<script lang="ts" src="./Overview.ts"></script>
