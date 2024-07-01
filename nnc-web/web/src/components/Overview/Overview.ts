/* Copyright 2024 Sony Group Corporation. */
/**
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
*/

/// <reference path="../../@types/index.d.ts" />
import Vue from 'vue';
import { Prop } from 'vue-property-decorator';
import Component from 'vue-class-component';
import {DEFINITIONS} from '../../Const';
import Layer from './Layer.vue';

const LAYER: any = DEFINITIONS.EDIT.LAYER;
const LINK: any = DEFINITIONS.EDIT.LINK;

@Component({
  name: 'Overview',
  components: {
    Layer
  }
})
export default class Overview extends Vue {
  @Prop() public configuration!: IConfiguration;
  @Prop() public completedConfiguration!: ICompletedConfiguration;
  @Prop() public networkIndex!: number;
  @Prop() public width!: number;

  get completedLayers(): ILayer[] {
    if (!this.completedConfiguration || !this.completedConfiguration.networks || !this.completedConfiguration.networks[this.networkIndex]) {
      return [];
    }
    return this.completedConfiguration.networks[this.networkIndex].nodes;
  }

  get viewBoxObj(): {x: number, y: number} {
    const DEFAULT_WIDTH: number = 280;
    const DEFAULT_HEIGHT: number = 280;
    if (!this.configuration.networks) {
      return {
          x: DEFAULT_WIDTH,
          y: DEFAULT_HEIGHT
      };
    }
    const nodes: ILayer[] = this.configuration.networks[this.networkIndex].nodes;
    if (!nodes.length) {
        return {
            x: DEFAULT_WIDTH,
            y: DEFAULT_HEIGHT
        };
    }
    const LINK_CURVE_HEIGHT: number = 20;
    const paddingRight: number = 80;
    const paddingTop: number = 20;
    const xArray: number[] = nodes.map(node => node.x);
    const yArray: number[] = nodes.map(node => node.y);
    const maxX: number = Math.max.apply(this, xArray);
    const maxY: number = Math.max.apply(this, yArray) + LINK_CURVE_HEIGHT;
    const x: number = Math.max(maxX, 0) + LAYER.RECT_WIDTH + LAYER.STATISTICS.BAR.MAXWIDTH + paddingRight;
    const y: number = Math.max(maxY, 0) + LAYER.RECT_HEIGHT + paddingTop;

    const svgWidth: number = this.width;
    const svgHeight: number = 280;

    if (x <= svgWidth && y <= svgHeight) {
        return {
            x: svgWidth,
            y: svgHeight
        };
    }

    const rateX: number = x / svgWidth;
    const rateY: number = y / svgHeight;

    let viewBox_X: number = svgWidth;
    let viewBox_Y: number = svgHeight;
    if (x > svgWidth && y <= svgHeight) {
        viewBox_X = svgWidth * rateX;
        viewBox_Y = svgHeight * rateX;
    } else if (y > svgHeight && x <= svgWidth) {
        viewBox_Y = svgHeight * rateY;
        viewBox_X = svgWidth * rateY;
    } else {
        viewBox_Y = svgHeight * Math.max(rateX, rateY);
        viewBox_X = svgWidth * Math.max(rateX, rateY);
    }
    return {
        x: viewBox_X,
        y: viewBox_Y
    };
  }

  get viewBox(): string {
    return `0 0 ${this.viewBoxObj.x} ${this.viewBoxObj.y}`;
  }

  get nodes(): ILayer[] {
    if (this.configuration.networks) {
      return this.configuration.networks[this.networkIndex].nodes;
    }
    return [];
  }

  get links(): ILink[] {
    if (this.configuration.networks) {
      return this.configuration.networks[this.networkIndex].links;
    }
    return [];
  }

  get sideConnectorPositions(): {x: number, y: number}[] {
    const MARGIN_X: number = DEFINITIONS.EDIT.LAYER.CONNECTOR.SIDE.MARGIN_X;
    const MARGIN_Y: number = DEFINITIONS.EDIT.LAYER.CONNECTOR.SIDE.MARGIN_Y;
    const START_OFFSET_X: number = DEFINITIONS.EDIT.LAYER.CONNECTOR.SIDE.START_OFFSET_X;
    const START_OFFSET_Y: number = DEFINITIONS.EDIT.LAYER.CONNECTOR.SIDE.START_OFFSET_Y;
    const maxConnectors: number = Math.max.apply(null, nNablaCore.layers.components.map(comp => comp.inputSideConnector.length));
    const x: () => number = (() => { let _x: number = START_OFFSET_X, _; return () => ([_x, _] = [_x - MARGIN_X, _x])[1]; })();
    const y: () => number = (() => { let _y: number = START_OFFSET_Y, _ = _y - MARGIN_Y; return () => ([_y, _] = [_, _y])[1]; })();
    return Array(maxConnectors).fill(null).map(_ => {
      return { x: x(), y: y() };
    });
  }

  get linkStyle(): string {
      return `stroke-width: ${LINK.STROKE_WIDTH}; stroke: ${LINK.STROKE_COLOR}; fill: none;`;
  }

  public isValidLink(link: ILink, nodes: ILayer[]): boolean {
    const from = link.from_node;
    const to = link.to_node;
    return nodes.findIndex(node => node.name === from) !== -1 && this.nodes.findIndex(node => node.name === to) !== -1;
  }

  public d(link: ILink, positions: {x: number, y: number}[]): string {
    const from_node: ILayer | undefined = this.nodes.find(node => node.name === link.from_node);
    const to_node: ILayer | undefined = this.nodes.find(node => node.name === link.to_node);
    if (!from_node || !to_node) {
        return '';
    }
    const from_position: {x: number, y: number} = {
        x: from_node.x + (LAYER.RECT_WIDTH / 2),
        y: from_node.y + LAYER.RECT_HEIGHT
    };
    let to_position: {x: number, y: number} = {
        x: to_node.x + (LAYER.RECT_WIDTH / 2),
        y: to_node.y
    };
    if (link.to_name) {
        const inputSideConnector: any = nNablaCore.layers.components.find(component => component.name === to_node.type).inputSideConnector;
        const order: number = inputSideConnector.findIndex((_inputSideConnector: any) => _inputSideConnector.name === link.to_name);
        to_position = {
            x: to_node.x + positions.slice(0, inputSideConnector.length).reverse()[order].x,
            y: to_node.y + positions.slice(0, inputSideConnector.length).reverse()[order].y
        };
    }
    if (from_position.y <= to_position.y) {
        return 'M ' + from_position.x + ',' + from_position.y + ' L ' + to_position.x + ',' + to_position.y;
    } else {
        const GRID: number = DEFINITIONS.EDIT.GRID.SIZE;
        const RAD: number = GRID / 2;
        // 接続先のノードの位置 + ノードの幅 + statisticの領域
        const targetRight: number = to_node.x + LAYER.RECT_WIDTH + LAYER.STATISTICS.BAR.MAXWIDTH;
        return 'M ' + from_position.x + ',' + from_position.y +
              ' v ' + GRID +
              ' a ' + (RAD) + ',' + (RAD) + ' 0 0,0 ' + ( RAD) + ',' + ( RAD) +
              ' H ' + Math.max(from_position.x + GRID * 7.5, to_position.x + GRID * 2.5, targetRight) +
              ' a ' + (RAD) + ',' + (RAD) + ' 0 0,0 ' + ( RAD) + ',' + (-RAD) +
              ' V ' + (to_position.y - GRID) +
              ' a ' + (RAD) + ',' + (RAD) + ' 0 0,0 ' + (-RAD) + ',' + (-RAD) +
              ' H ' + (to_position.x + RAD) +
              ' a ' + (RAD) + ',' + (RAD) + ' 0 0,0 ' + (-RAD) + ',' + ( RAD) +
              ' V ' + to_position.y;
    }
  }

  public getCompletedNode(layer: ILayer): ILayer | undefined {
    if (!this.completedConfiguration.networks || !this.completedConfiguration.networks[this.networkIndex] || !this.completedConfiguration.networks[this.networkIndex].nodes) {
        return;
    }
    return this.completedConfiguration.networks[this.networkIndex].nodes.find(node => node.name === layer.name);
  }

}
