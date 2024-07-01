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

export default class Selection{
    _focused: any
    layers: any

    constructor(layers: any) {
      this._focused = null
      this.layers = layers
    }

    insert(layer: any) {
      layer.select(true)
    }

    focus(layer: any) {
      if (!layer.selected()) {
          this.clear();
      }
      if (this._focused && this._focused !== layer) {
        this._focused.flagAsMain(false);
      }
      this._focused = layer;
      Array.from(arguments).forEach(layer => layer.select(true));
      layer.flagAsMain(true);
    }

    focused() {
      return this._focused
    }

    remove(layer: any) {
      if (this._focused === layer) {
          layer.flagAsMain(false);
          this._focused = null;
      }
      layer.select(false);
    }

    clear() {
      return this.layers.apply((layer: any) => this.remove(layer))
    }

    members() {
      return this.layers.members().filter((layer: any) => layer.selected())
    }

    apply(f: any) {
      return this.members().map(f)
    }
}
