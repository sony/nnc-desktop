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
import Selection from "@/objects/Selection";
import {useSDUUtilsStore} from './editor/sduutils'
import SetSDU from "@/objects/SetSDU";

export const useSelectionStore = defineStore('selection', () => {
  const sduutils_store = useSDUUtilsStore()
  
  const _layer = ref<any>()
  const _link = (() => {
    var _selectedLink: any
    return {
        focus: (_link: any) => {
            _selectedLink = _link;
            _selectedLink.select(true);
        },
        focused: () => _selectedLink,
        remove: (_link: any) => {
            if (_link === _selectedLink && _selectedLink) {
                _selectedLink.select(false);
                _selectedLink = null;
            }
        },
        clear: function() {
            this.remove(_selectedLink);
        },
    };
  })();

  function init(layers: any) {
    _layer.value = new Selection(layers)
  }

  function change(layers: any) {
    const focused = _layer.value.focused();
    _link.clear();
    _layer.value.clear();
    (layers || []).forEach((elem: any) => _layer.value.insert(elem));
    if ((layers || []).includes(focused)) {
      _layer.value.focus(focused);
    }
  }

  function append(layers: any) {
    const focused = _layer.value.focused();
    layers.filter((elem: any) => elem !== focused).forEach((elem: any) => _layer.value.insert(elem));
  }

  // 与えられた layers を全体として、この中で現在選択されていないレイヤーを選択する
  function invert(layers: any) {
    const copied = layers.concat();
    _layer.value.members().forEach((selected: any) => {
        const index = copied.findIndex((layer: any) => layer === selected);
        if (index !== -1) {
            copied.splice(index, 1);
        }
    });
    change(copied);
  }

  // 選択を解除する
  function clear() {
    _layer.value.clear();
    _link.clear();
  }

  function isEmpty() {
    return _layer.value.members().length === 0 && !_link.focused();
  }

  /** 選択されているレイヤーとその間に張られたリンク、あるいは選択されているリンクを列挙する。
   *
   * 複数のレイヤーを選択した場合、表示上はその間に張られたリンクは選択されていないように見えることに注意。
   */
  function members() {
    // 選択されているレイヤーを列挙
    const layers = _layer.value.members()
    // 選択されているレイヤー間に張られたリンクを重複なく列挙するために Set を利用する
    const links = new SetSDU(sduutils_store)
    // 選択されているリンクを列挙
    if (_link.focused()) {
        links.insert(_link.focused());
    }
    // 選択されているレイヤーに接続されているリンクを列挙
    layers.map((layer: any) => layer.allLinks()).reduce((a: string | any[], b: any) => a.concat(b), []).forEach((link: any) => links.insert(link));
    return { nodes: layers, links: links.members(), };
  }

  return { 
    layer: _layer,
    link: _link,
    init,
    change,
    append,
    invert,
    clear,
    isEmpty,
    members
  }
})
