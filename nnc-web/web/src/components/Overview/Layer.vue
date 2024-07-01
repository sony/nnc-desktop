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

<!-- src/components/Layer.vue -->
<template>
  <g :transform="layerTransform" v-if="existNode">
    <g v-if="isCommentLayer">
      <rect :width="commentLayerInfo.width" :height="commentLayerInfo.height" :style="commentLayerInfo.style"></rect>
      <foreignObject :width="commentLayerInfo.width" :height="commentLayerInfo.height">
        <div :style="commentLayerInfo.textStyle">{{commentLayerInfo.text}}</div>
      </foreignObject>
    </g>
    <g v-else>
      <rect :width="layerInfo.width" :height="layerInfo.height" :style="layerInfo.style"></rect>
      <image v-if="isUnitLayer" :href="unitDropcapInfo.image" :x="unitDropcapInfo.x" :y="unitDropcapInfo.y" :width="unitDropcapInfo.width" :height="unitDropcapInfo.height" />
      <text v-else :x="dropcapInfo.x" :y="dropcapInfo.y" :style="dropcapInfo.style">{{dropcapInfo.text}}</text>
      <g :clip-path="clipPathInfo.clipPath" :transform="clipPathInfo.transform">
        <text :x="nameLabel.x" :y="nameLabel.y" :style="nameLabel.style">{{layer.name}}</text>
        <text :x="importantProperty.x" :y="importantProperty.y" :style="importantProperty.style">{{importantProperty.value}}</text>
      </g>
      <circle v-if="availableInput" :r="inputConnector.r" :fill="inputConnector.fill" :cx="inputConnector.cx" :cy="inputConnector.cy" />
      <circle v-if="availableOutput" :r="outputConnector.r" :fill="outputConnector.fill" :cx="outputConnector.cx" :cy="outputConnector.cy" />
      <g v-for="(inputSideConnector, i) in inputSideConnectors" :key="'connector' + i">
        <circle :r="sideConnector.r" :fill="sideConnector.fill" :style="sideConnector.style" :cx="getSideConnectionPosition(i, 'x')" :cy="getSideConnectionPosition(i, 'y')"></circle>
        <text :x="getSideConnectionPosition(i, 'x')" :y="getSideConnectionPosition(i, 'y') + sideConnector.labelOffset" :style="sideConnector.textStyle">{{inputSideConnector.shortName || inputSideConnector.name.substr(0, 1)}}</text>
      </g>
      <text :x="statisticLabel.x" :y="statisticLabel.y">{{statisticLabel.value}}</text>
      <rect :x="statisticBar.x" :y="statisticBar.y" :width="statisticBar.width" :height="statisticBar.height" :style="statisticBar.style" />
      <g v-if="orderList.length">
        <text v-for="(order, i) in orderList" :key="'order' + i" :x="orderInfo.x" :y="orderInfo.y" :fill="orderInfo.fill" :font-size="orderInfo.fontSize">{{order}}</text>
      </g>
      <g v-if="repeatCount">
        <text :x="repeatInfo.x" :y="repeatInfo.y" :fill="repeatInfo.fill" :font-size="repeatInfo.fontSize">{{repeatCount}}</text>
      </g>
    </g>
  </g>
</template>

<script lang="ts" src="./Layer.ts"></script>
