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

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import {useDefinitionsStore} from '../misc/definitions'
import {useSVGAreaStore} from './svgarea'

export const useConnectorStore = defineStore('connector', () => {
    const definition_store = useDefinitionsStore()

    /** create dragging link edge */
    function mkLinkEdge(group: any, position: { x: any; y: any }) {
        return group.append('circle')
            .attr('cx', position.x)
            .attr('cy', position.y)
            .attr('r', definition_store.Definitions.EDIT.LAYER.CONNECTOR.RADIUS)
            .attr('fill', definition_store.Definitions.EDIT.LINK.FOCUSED.STROKE_COLOR)
            .attr('pointer-events', 'none') // マウスイベントをキャプチャーしないよう設定
            .attr('filter', definition_store.Definitions.EDIT.LINK.FOCUSED_DRAG.FILTER_URL);
    }

    function safeRemoveLinkingConnector(circle: any) {
        if (circle) {
            circle.remove();
            circle = undefined;
        }
    }

    function _mkConnectorCircle(group: any, cx: any, cy: any, color: any) {
        return group.append('circle')
            .attr('cx', cx)
            .attr('cy', cy)
            .attr('r', definition_store.Definitions.EDIT.LAYER.CONNECTOR.RADIUS)
            .attr('fill', color);
    }

    /** create dragging link line */
    function _mkLinkPath(group: any, x: any, y: any) {
        var dlink = definition_store.Definitions.EDIT.LINK;
        return group.append('path')
            .attr('d', 'M' + [x, y] + 'L' + [x, y])
            .attr('stroke-width', dlink.FOCUSED_DRAG.STROKE_WIDTH)
            .attr('stroke', dlink.FOCUSED_DRAG.STROKE_COLOR)
            .attr('fill', 'none')
            .attr('filter', dlink.FOCUSED_DRAG.FILTER_URL);
    }

    return {
        mkLinkEdge,
        safeRemoveLinkingConnector,
        _mkConnectorCircle,
        _mkLinkPath
    }
})
