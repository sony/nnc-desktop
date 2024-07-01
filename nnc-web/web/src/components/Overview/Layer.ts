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

const activeStatistic: string = 'Output';
const LAYER: any = DEFINITIONS.EDIT.LAYER;

interface IRepeatStart {
  name: string;
  count: string;
  id: string;
  endType: string;
}

interface IRepeatStartDestinationLayers {
  nodes: string[];
  value: string;
}

@Component({
  name: 'Layer'
})
export default class Layer extends Vue {
  @Prop() public layer!: ILayer;
  @Prop() public completedLayer!: ILayer;
  @Prop() public layers!: ILayer[];
  @Prop() public completedLayers!: ILayer[];
  @Prop() public links!: ILink[];
  @Prop() public statistics!: IStatistic[][];
  @Prop() public sideConnectionPositions!: {x: number, y: number}[];
  @Prop() public networkIndex!: number;

  get existNode(): boolean {
    return this.component !== undefined;
  }

  get component(): IComponent {
    return nNablaCore.layers.components.find((component: IComponent) => component.name === this.layer.type);
  }

  get layerTransform(): string {
    return 'translate(' + this.layer.x + ',' + this.layer.y + ')';
  }

  get layerInfo(): {width: number, height: number, style: string} {
    const color: string = this.component.color.substring(2, 8);
    return {
      width: LAYER.RECT_WIDTH,
      height: LAYER.RECT_HEIGHT,
      style: `fill: #${color}; stroke: #${color};`
    };
  }

  get commentLayerInfo(): {width: number, height: number, style: string, text: string, textStyle: string} {
    const color: string = this.component.color.substring(2, 8);
    return {
      width: LAYER.RECT_WIDTH,
      height: LAYER.RECT_HEIGHT,
      style: `fill: ${LAYER.COMMENT.FILL_COLOR}; stroke: #${color};`,
      text: this.layer.properties.Comment || '',
      textStyle: `font-size: ${LAYER.COMMENT.FONT_SIZE}; overflow-wrap: break-word; overflow: hidden; cursor: default: width: 100%; height: 100%;`
    };
  }

  get isCommentLayer(): boolean {
    return this.layer.type === 'Comment';
  }

  get isUnitLayer(): boolean {
    return this.layer.type === 'Unit';
  }

  get unitDropcapInfo(): {x: number, y: number, width: string, height: string, image: string} {
    const UNIT: any = LAYER.UNIT;
    return {
      x: UNIT.OFFSET_X,
      y: UNIT.OFFSET_Y,
      width: UNIT.WIDTH,
      height: UNIT.HEIGHT,
      image: UNIT.IMAGE_SOURCE
    };
  }

  get dropcapInfo(): {x: number, y: number, style: string, text: string} {
    const DROPCAP_CHAR: any = LAYER.DROPCAP_CHAR;
    return {
      x: DROPCAP_CHAR.OFFSET_X,
      y: DROPCAP_CHAR.OFFSET_Y,
      style: `fill: ${DROPCAP_CHAR.FONTCOLOR}; font-size: ${DROPCAP_CHAR.FONTSIZE}; pointer-events: none; text-anchor: middle;`,
      text: this.layer.type.substr(0, 1).toUpperCase()
    };
  }

  get clipPathInfo(): {clipPath: string, transform: string} {
    return {
      clipPath: `url(#${LAYER.CLIP_PATH.ID})`,
      transform: `translate(${LAYER.CLIP_PATH.OFFSET_X}, ${LAYER.CLIP_PATH.OFFSET_Y})`
    };
  }

  get nameLabel(): {x: number, y: number, style: string} {
    const NAME_LABEL: any = LAYER.NAME_LABEL;
    return {
      x: NAME_LABEL.OFFSET_X,
      y: NAME_LABEL.OFFSET_Y,
      style: `pointer-events: none; fill: ${NAME_LABEL.FONTCOLOR}; font-size: ${NAME_LABEL.FONTSIZE}`
    };
  }

  get importantProperty(): {x: number, y: number, style: string, value: string} {
    const PROPERTY_LABEL: any = LAYER.PROPERTY_LABEL;
    return {
      x: PROPERTY_LABEL.OFFSET_X,
      y: PROPERTY_LABEL.OFFSET_Y,
      style: `pointer-events: none; fill: ${PROPERTY_LABEL.FONTCOLOR}; font-size: ${PROPERTY_LABEL.FONTSIZE}`,
      value: this.getImportantValue()
    };
  }

  get inputConnector(): {cx: number, cy: number, r: number, fill: string} {
    const CONNECTOR: any = LAYER.CONNECTOR;
    return {
      cx: CONNECTOR.OFFSET_X,
      cy: 0,
      r: CONNECTOR.RADIUS,
      fill: 'rgb(38,38,38)'
    };
  }

  get outputConnector(): {cx: number, cy: number, r: number, fill: string} {
    const CONNECTOR: any = LAYER.CONNECTOR;
    return {
      cx: CONNECTOR.OFFSET_X,
      cy: CONNECTOR.OUTPIN_OFFSET_Y,
      r: CONNECTOR.RADIUS,
      fill: 'rgb(38,38,38)'
    };
  }

  get sideConnector(): {r: number, fill: string, style: string, labelOffset: number, textStyle: string} {
    const CONNECTOR: any = LAYER.CONNECTOR;
    return {
      r: CONNECTOR.SIDE.RADIUS,
      fill: 'gray',
      style: `stroke-width: ${CONNECTOR.STROKE_WIDTH}; opacity: ${CONNECTOR.SIDE.OPACITY};`,
      labelOffset: CONNECTOR.SIDE.LABEL.OFFSET_Y,
      textStyle: `fill: ${CONNECTOR.SIDE.LABEL.FONTCOLOR}; font-size: ${CONNECTOR.SIDE.LABEL.FONTSIZE}; font-weight: ${CONNECTOR.SIDE.LABEL.FONTWEIGHT}; text-anchor: middle; opacity: ${CONNECTOR.SIDE.LABEL.OPACITY};`
    };
  }

  get statisticLabel(): {x: number, y: number, value: string} {
    const STATISTICS: any = LAYER.STATISTICS;
    return {
      x: STATISTICS.LABEL.OFFSET_X,
      y: STATISTICS.LABEL.OFFSET_Y,
      value: this.completedLayer.properties[activeStatistic]
    };
  }

  get statisticBar(): {x: number, y: number, width: number, height: number, style: string} {
    const STATISTICS: any = LAYER.STATISTICS;
    return {
      x: STATISTICS.BAR.OFFSET_X,
      y: STATISTICS.BAR.OFFSET_Y,
      width: this.getStatisticsBar(),
      height: STATISTICS.BAR.HEIGHT,
      style: `fill: ${STATISTICS.BAR.FILL_COLOR}; opacity: 1;`
    };
  }

  get inputSideConnectors(): IInputSideConnector[] {
    if (this.layer.properties && (this.layer.properties.WithBias === 'False' || this.layer.properties.WithBias === false)) {
      return this.component.inputSideConnector.filter((inputSideConnector: IInputSideConnector) => {
        return inputSideConnector.name !== 'b';
      });
    }
    return this.component.inputSideConnector;
  }

  get availableInput(): boolean {
    return this.component.input !== 0;
  }

  get availableOutput(): boolean {
    return this.component.output !== 0;
  }

  get repeatCount(): string {
    if (!this.completedLayers || !this.completedLayers.length) {
      return '';
  }
    const filteredRepeatStartDestinationLayersList = this.repeatStartDestinationLayersList.filter((repeatStartDestinationLayers) => {
        return repeatStartDestinationLayers.nodes.indexOf(this.layer.name) !== -1;
    });
    if (!filteredRepeatStartDestinationLayersList.length) {
        return '';
    }

    let count = 'x';
    filteredRepeatStartDestinationLayersList.forEach((filteredRepeatStartDestinationLayers) => {
        count += filteredRepeatStartDestinationLayers.value + ' ';
    });

    return count;
  }

  get repeatStartList(): IRepeatStart[] {
    if (!this.completedLayers || !this.completedLayers.length) {
      return [];
    }
    const startList: IRepeatStart[] = [];
    this.completedLayers.forEach((node: ILayer) => {
      const name: string = node.name;
      if (node.type === 'RepeatStart') {
        startList.push({
          name: name,
          count: node.properties.Times,
          id: node.properties.ID,
          endType: 'RepeatEnd'
        });
      } else if (node.type === 'RecurrentInput') {
        startList.push({
          name: name,
          count: node.properties.Input.split(',')[node.properties.Axis],
          id: node.properties.ID,
          endType: 'RecurrentOutput'
        });
      }
    });
    return startList;
  }

  get repeatStartDestinationLayersList(): IRepeatStartDestinationLayers[] {
    if (!this.repeatStartList.length) {
      return [];
    }
    const repeatStartDestinationLayersList: IRepeatStartDestinationLayers[] = [];
    this.repeatStartList.forEach((repeatStart: IRepeatStart, i: number) => {
      const destinationLayers: string[] = [];
      const list: string[] = [];
      const toLinks: (layerName: string) => ILink[] = (layerName: string): ILink[] => {
        return this.links.filter((link: ILink) => link.from_node === layerName);
      };
      const getType: (layerName: string) => string = (layerName: string): string => {
        return (this.completedLayers.find((layer: ILayer) => layer.name === layerName) || {type: ''}).type;
      };
      const getId: (layerName: string) => string = (layerName: string): string => {
        const layer: ILayer | undefined = this.completedLayers.find((_layer: ILayer) => _layer.name === layerName);
        return layer ? layer.properties.ID : '';
      };
      const repeat: (layerName: string, endType: string, repeatId: string) => void = (layerName: string, endType: string, repeatId: string): void => {
        if (list.indexOf(layerName) !== -1 || (getType(layerName) === endType && getId(layerName) === repeatId)) {
          return;
        }
        destinationLayers.push(layerName);
        list.push(layerName);

        const _toLinks: ILink[] = toLinks(layerName);
        if (!_toLinks.length) {
          return;
        }

        _toLinks.forEach((toLink: ILink) => {
          repeat(toLink.to_node, endType, repeatId);
        });
      };
      repeat(repeatStart.name, repeatStart.endType, repeatStart.id);
      repeatStartDestinationLayersList[i] = {
        nodes: destinationLayers,
        value: this.repeatStartList[i].count
      };
    });
    return repeatStartDestinationLayersList;
  }

  get repeatInfo(): {x: number, y: number, fill: string, fontSize: string} {
    const REPEAT: any = LAYER.REPEAT;
    return {
      fill: REPEAT.FONTCOLOR,
      fontSize: REPEAT.FONTSIZE,
      x: REPEAT.OFFSET_X,
      y: REPEAT.OFFSET_Y
    };
  }

  get orderList(): number[] {
    const appendList: number[] = [];
    const destLinks: ILink[] = this.links.filter((link: ILink) => link.from_node === this.layer.name);
    destLinks.forEach((destLink: ILink) => {
      const destNodeName: string = destLink.to_node;
      const targetLinks: ILink[] = this.links.filter((link: ILink) => link.to_node === destNodeName);
      if (targetLinks.length > 1) {
        // indexと表示用でずれる為1を足す
        appendList.push(targetLinks.findIndex((link: ILink) => link.from_node === this.layer.name) + 1);
      }
    });
    return appendList;
  }

  get orderInfo(): {x: number, y: number, fill: string, fontSize: string} {
    const ORDER: any = LAYER.ORDER;
    return {
      fill: ORDER.FONTCOLOR,
      fontSize: ORDER.FONTSIZE,
      x: ORDER.OFFSET_X,
      y: ORDER.OFFSET_Y
    };
  }

  private getImportantValue(): string {
    const links: ILink[] = this.links.filter((link: ILink) => link.to_node === this.layer.name);
    return this.component.property.filter((property: any) => property.important).map((property: any) => {
      const name: string = property.name;
      return (property.shortName || name) + ' : ' + this.completedLayer.properties[name];
    }).filter((property: string) => links.findIndex((link: ILink) => (link.to_node === this.layer.name && !!link.to_name && property.startsWith(link.to_name))) === -1).join(', ');
  }

  private getStatisticsBar(): number {
    const product: (value: string) => number = _value => (_value || '0').split(',').map(x => Number(x) || 0).reduce((a, b) => a * b, 1);
    const properties: {[key: string]: string} = this.completedLayer.properties;
    const value: number = product(properties[activeStatistic]);
    if (!value) {
        return 0;
    }
    const statistic: IStatistic | undefined = this.statistics[this.networkIndex].find(_statistic => _statistic.name === activeStatistic);
    if (!statistic) {
      return 0;
    }
    return (value / Number(statistic.max)) * DEFINITIONS.EDIT.LAYER.STATISTICS.BAR.MAXWIDTH;
  }

  public getSideConnectionPosition(index: number, axis: string): number {
    return this.sideConnectionPositions.slice(0, this.inputSideConnectors.length).reverse()[index][axis];
  }

}
