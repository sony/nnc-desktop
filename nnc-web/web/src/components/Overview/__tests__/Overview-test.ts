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
import OverviewClass from '../Overview';
import { ConfigurationMock } from './ConfigurationMock';
import ProjectClass from '../../Project';

declare global {
  interface Window {
    nNablaCore?: any;
  }
}

describe('Overview.vue', function() {
  let overview: OverviewClass;
  let project: ProjectClass = new ProjectClass;

  beforeEach(() => {
    overview = new OverviewClass();
  });

  function init() {
    overview.configuration = ConfigurationMock.tutorial_basics_01_logistic_regression;
    overview.completedConfiguration = {
      statistics: (project as any).getStatistics(ConfigurationMock.completed_tutorial_basics_01_logistic_regression),
      networks: ConfigurationMock.completed_tutorial_basics_01_logistic_regression.networks
    }
    overview.networkIndex = 0;
    overview.width = 280;
  }

  describe('completedLayers', () => {
    it('empty', () => {
      expect(overview.completedLayers).toEqual([]);
    });

    it('normal', () => {
      init();
      const expected: ILayer[] = ConfigurationMock.completed_tutorial_basics_01_logistic_regression.networks[0].nodes;
      expect(overview.completedLayers).toEqual(expected);
    });
  });

  describe('viewBoxObj', () => {
    it('empty', () => {
      (overview as any).configuration = {};
      const expected: {x: number, y: number} = {
        x: 280,
        y: 280
      }
      expect(overview.viewBoxObj).toEqual(expected);
    });

    it('normal', () => {
      init();
      const expected: {x: number, y: number} = {
        x: 360,
        y: 360
      }
      expect(overview.viewBoxObj).toEqual(expected);
    });
  });

  describe('viewBox', () => {
    it('normal', () => {
      init();
      const expected: string = '0 0 360 360';
      expect(overview.viewBox).toEqual(expected);
    });
  });

  describe('nodes', () => {
    it('normal', () => {
      init();
      const expected: ILayer[] = overview.configuration.networks[0].nodes;
      expect(overview.nodes).toEqual(expected);
    });
    it('empty', () => {
      (overview as any).configuration = {};
      const expected: ILayer[] = [];
      expect(overview.nodes).toEqual(expected);
    });
  });

  describe('links', () => {
    it('normal', () => {
      init();
      const expected: ILink[] = overview.configuration.networks[0].links;
      expect(overview.links).toEqual(expected);
    });
    it('empty', () => {
      (overview as any).configuration = {};
      const expected: ILink[] = [];
      expect(overview.links).toEqual(expected);
    });
  });

  // Array().fill がphantom.jsが対応していない為、テストできない
  // describe('sideConnectorPositions', () => {});

  describe('linkStyle', () => {
    it('normal', () => {
      // TODO undefinedになってしまっている為、修正が必要
      expect(overview.linkStyle).toEqual(`stroke-width: undefined; stroke: rgb(38, 38, 38); fill: none;`);
    });
  });

  describe('isValidLink', () => {
    it('normal', () => {
      init();
      const nodes: any = ConfigurationMock.tutorial_basics_01_logistic_regression.networks[0].nodes;
      const link: any = {
        from_node: 'Affine',
        from_name: null,
        to_node: 'Sigmoid',
        to_name: null
      };
      expect(overview.isValidLink(link, nodes)).toBeTruthy();
    });

    it('invalid links', () => {
      init();
      const nodes: any = ConfigurationMock.tutorial_basics_01_logistic_regression.networks[0].nodes;
      const link: any = {
        from_node: 'Affine',
        from_name: null,
        to_node: 'SoftmaxCrossEntropy',
        to_name: null
      };

      // TODO チェックが不十分な気がする(index が findIndexのindex値が同じかどうか判定した方が良い)
      expect(overview.isValidLink(link, nodes)).toBeFalsy();
    });
  });

  // Array().fill がphantom.jsが対応していない為、テストできない
  // describe('d', () => {});

  describe('getCompletedNode', () => {
    it('normal', () => {
      init();
      const nodes: any = ConfigurationMock.tutorial_basics_01_logistic_regression.networks[0].nodes;
      expect(overview.getCompletedNode(nodes[1])).toEqual(ConfigurationMock.completed_tutorial_basics_01_logistic_regression.networks[0].nodes[1]);
    });

    it('normal', () => {
      init();
      (overview as any).completedConfiguration = {};
      const nodes: any = ConfigurationMock.tutorial_basics_01_logistic_regression.networks[0].nodes;
      expect(overview.getCompletedNode(nodes[1])).toBeUndefined();
    });
  });

});