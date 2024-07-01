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

/// <reference path="../../../@types/index.d.ts" />
import { polyfill } from 'es6-promise';
polyfill();
import Layer from '../Layer';
import { ConfigurationMock } from './ConfigurationMock';
import ProjectClass from '../../Project';

declare global {
  interface Window {
    nNablaCore?: any;
  }
}

describe('layer.vue', function() {
  let layer: Layer;

  beforeEach(() => {
    layer = new Layer();
  });

  function init() {
    layer.layer = ConfigurationMock.tutorial_basics_01_logistic_regression.networks[0].nodes[0];
    layer.completedLayer = ConfigurationMock.completed_tutorial_basics_01_logistic_regression.networks[0].nodes[0];
    layer.layers = ConfigurationMock.tutorial_basics_01_logistic_regression.networks[0].nodes;
    layer.completedLayers = ConfigurationMock.completed_tutorial_basics_01_logistic_regression.networks[0].nodes;
    layer.links = ConfigurationMock.tutorial_basics_01_logistic_regression.networks[0].links;
    layer.statistics = ConfigurationMock.completed_tutorial_basics_01_logistic_regression.statistics;
    layer.sideConnectionPositions = [
      { x: 186, y: 26 },
      { x: 170, y: 13 },
      { x: 154, y: 26 },
      { x: 138, y: 13 },
      { x: 122, y: 26 },
      { x: 106, y: 13 },
      { x: 90, y: 26 },
      { x: 74, y: 13 },
      { x: 58, y: 26 },
      { x: 42, y: 13 },
    ];
    layer.networkIndex = 0;
  }

  describe('existNode', () => {
    it('normal', () => {
      init();
      expect(layer.existNode).toBeTruthy();
    });
  });

  describe('layerTransform', () => {
    it('normal', () => {
      init();
      const expected: string = 'translate(20,20)';
      expect(layer.layerTransform).toEqual(expected);
    });
  });

  describe('layerInfo', () => {
    it('normal', () => {
      init();
      const expected: {width: number, height: number, style: string} = {
        width: 200,
        height: 40,
        style: 'fill: #262626; stroke: #262626;'
      };
      expect(layer.layerInfo).toEqual(expected);
    });
  });

  describe('commentLayerInfo', () => {
    it('normal', () => {
      init();
      layer.layer = {
        name: 'Comment',
        properties: {
          Comment: 'This net is for learning labeled data'
        },
        type: 'Comment',
        x: 380,
        y: 20
      };

      const expected: {width: number, height: number, style: string, text: string, textStyle: string} = {
        width: 200,
        height: 40,
        style: 'fill: rgb(255, 255, 255); stroke: #b2b2b2;',
        text: 'This net is for learning labeled data',
        textStyle: 'font-size: 14px; overflow-wrap: break-word; overflow: hidden; cursor: default: width: 100%; height: 100%;'
      };
      expect(layer.commentLayerInfo).toEqual(expected);
    });
  });

  describe('isCommentLayer', () => {
    it('true', () => {
      init();
      layer.layer = {
        name: 'Comment',
        properties: {
          Comment: 'This net is for learning labeled data'
        },
        type: 'Comment',
        x: 380,
        y: 20
      };

      expect(layer.isCommentLayer).toBeTruthy();
    });

    it('false', () => {
      init();
      expect(layer.isCommentLayer).toBeFalsy();
    });
  });

  describe('isCommentLayer', () => {
    it('true', () => {
      init();
      layer.layer = {
        name: 'Unit',
        properties: {
          Network: 'test',
          ParameterScope: '*Name',
          'Affine.W.File': '',
          'Affine.W.InitializerMultiplier': '1',
          'Affine.W.LRateMultiplier': '1',
          'Affine.b.File': '',
          'Affine.b.InitializerMultiplier': '0',
          'Affine.b.LRateMultiplier': '1',
          'Convolution.W.File': '',
          'Convolution.W.InitializerMultiplier': '1',
          'Convolution.W.LRateMultiplier': '1',
          'Convolution.b.File': '',
          'Convolution.b.InitializerMultiplier': '0',
          'Convolution.b.LRateMultiplier': '1'
        },
        type: 'Unit',
        x: 380,
        y: 20
      };

      expect(layer.isUnitLayer).toBeTruthy();
    });

    it('false', () => {
      init();
      expect(layer.isUnitLayer).toBeFalsy();
    });
  });

  describe('unitDropcapInfo', () => {
    it('normal', () => {
      init();
      // TODO unitDropcapInfoの型が不正(width, heightはnumber型)
      const expected: any = {
        x: 4,
        y: 4,
        width: 32,
        height: 32,
        image: '/console/image/UnitWhite.svg'
      };

      expect(layer.unitDropcapInfo).toEqual(expected);
    });
  });

  describe('dropcapInfo', () => {
    it('normal', () => {
      init();
      const expected: any = {
        x: 20,
        y: 32,
        style: 'fill: white; font-size: 32px; pointer-events: none; text-anchor: middle;',
        text: 'I'
      };

      expect(layer.dropcapInfo).toEqual(expected);
    });
  });

  describe('clipPathInfo', () => {
    it('normal', () => {
      init();
      const expected: {clipPath: string, transform: string} = {
        clipPath: 'url(#nnc-layer-text-clipper)',
        transform: 'translate(40, 4)'
      };

      expect(layer.clipPathInfo).toEqual(expected);
    });
  });

  describe('nameLabel', () => {
    it('normal', () => {
      init();
      const expected: {x: number, y: number, style: string} = {
        x: 0,
        y: 12,
        style: 'pointer-events: none; fill: white; font-size: 12px'
      };

      expect(layer.nameLabel).toEqual(expected);
    });
  });

  describe('importantProperty', () => {
    it('normal', () => {
      init();
      const expected: {x: number, y: number, style: string, value: string} = {
        x: 0,
        y: 28,
        style: 'pointer-events: none; fill: white; font-size: 11px',
        value: 'Dataset : x'
      };

      expect(layer.importantProperty).toEqual(expected);
    });
  });

  describe('inputConnector', () => {
    it('normal', () => {
      init();
      const expected: {cx: number, cy: number, r: number, fill: string} = {
        cx: 100,
        cy: 0,
        r: 4,
        fill: 'rgb(38,38,38)'
      };

      expect(layer.inputConnector).toEqual(expected);
    });
  });

  describe('outputConnector', () => {
    it('normal', () => {
      init();
      const expected: {cx: number, cy: number, r: number, fill: string} = {
        cx: 100,
        cy: 40,
        r: 4,
        fill: 'rgb(38,38,38)'
      };

      expect(layer.outputConnector).toEqual(expected);
    });
  });

  describe('sideConnector', () => {
    it('normal', () => {
      init();
      const expected: {r: number, fill: string, style: string, labelOffset: number, textStyle: string} = {
        r: 10,
        fill: 'gray',
        style: 'stroke-width: 2; opacity: 0.5;',
        labelOffset: 3,
        textStyle: 'fill: white; font-size: 9px; font-weight: bold; text-anchor: middle; opacity: 0.75;'
      };

      expect(layer.sideConnector).toEqual(expected);
    });
  });

  describe('statisticLabel', () => {
    it('normal', () => {
      init();
      const expected: {x: number, y: number, value: string} = {
        x: 204,
        y: 32,
        value: '1,28,28'
      };

      expect(layer.statisticLabel).toEqual(expected);
    });
  });

  describe('statisticBar', () => {
    it('normal', () => {
      init();
      const expected: {x: number, y: number, width: number, height: number, style: string} = {
        x: 204,
        y: 36,
        width: 60,
        height: 4,
        style: 'fill: rgb(132, 132, 132); opacity: 1;'
      };

      expect(layer.statisticBar).toEqual(expected);
    });
  });

  describe('inputSideConnectors', () => {
    it('normal', () => {
      init();
      const expected: IInputSideConnector[] = [];

      expect(layer.inputSideConnectors).toEqual(expected);
    });
  });

  describe('availableInput', () => {
    it('normal', () => {
      init();
      expect(layer.availableInput).toBeFalsy();
    });
  });

  describe('availableOutput', () => {
    it('normal', () => {
      init();
      expect(layer.availableOutput).toBeTruthy();
    });
  });

  describe('repeatInfo', () => {
    it('normal', () => {
      init();
      const expected: {x: number, y: number, fill: string, fontSize: string} = {
        x: 204,
        y: 15,
        fill: 'rgb(38, 38, 38)',
        fontSize: '12px'
      };
      expect(layer.repeatInfo).toEqual(expected);
    });
  });

  describe('orderInfo', () => {
    it('normal', () => {
      init();
      const expected: {x: number, y: number, fill: string, fontSize: string} = {
        x: 105,
        y: 55,
        fill: 'rgb(38, 38, 38)',
        fontSize: '12px'
      };
      expect(layer.orderInfo).toEqual(expected);
    });
  });

});