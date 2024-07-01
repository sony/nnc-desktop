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

import { ref } from 'vue'
import { defineStore } from 'pinia'


export const useSDNEditorStore = defineStore('sdneditor', () => {
    const _stockedLayer =  ref<any>()
    const _touchingConnector =  ref<any>()

    function stockLayer(layer: any) {
        _stockedLayer.value = layer
    }

    function stockedLayer() {
        return _stockedLayer.value
    }

    function touchConnector(connector: any) {
        _touchingConnector.value = connector
    }

    function touchingConnector() {
        return _touchingConnector.value
    }

    return {
        stockLayer,
        stockedLayer,
        touchConnector,
        touchingConnector
    }
})
