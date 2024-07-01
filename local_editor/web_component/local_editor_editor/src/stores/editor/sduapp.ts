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

import { defineStore } from 'pinia'
import {useUtilsStore} from '../utils'
import {useDefinitionsStore} from '../misc/definitions'
import {useEditorStore} from '../editor'
import {useHistoryStore} from '../history'
import { useClipboardStore } from './clipboard'
import {useSelectionStore} from '../selection'
import {useSVGAreaStore} from './svgarea'
import {useGraphStore} from '../graph'

export const useSDUAppStore = defineStore('sduapp', () => {
    const definitions_store = useDefinitionsStore()
    const graph_store = useGraphStore()
    const svgarea_store = useSVGAreaStore()
    const clipboard_store = useClipboardStore()
    const editor_store = useEditorStore()
    const history_store = useHistoryStore()
    const selection_store = useSelectionStore()
    const utils_store = useUtilsStore()

    function uop() {
        return utils_store.allowedUserOperation()
    }

    function eta() {
        return utils_store.editTabIsActive()
    }

    function dl() {
        return svgarea_store.draggingLayer()
    }

    function isTriggerFromInput(event: any) {
        return (document.activeElement || {}).tagName === 'INPUT';
    } 

    
    function isModalDisplayed() {
        return editor_store.modal.show === true;
    }

    function init() {
        // Clipboard
        // クリップボードへコピー（マウス操作、キーボード操作）
        document.addEventListener('copy', (e) => {
            if (isTriggerFromInput(e) || isModalDisplayed()) {
                return;
            }
            if (uop() && eta() && !dl() && 0 < selection_store.layer.members().length) {
                clipboard_store._copy(e);
            }
        });

        // NetworkEditorにペーストする（キーボード操作）
        document.addEventListener('paste', (e: any) => {
            if (isTriggerFromInput(e) || isModalDisplayed() || editor_store.readOnly) {
                return;
            }
            if (uop() && eta() && !dl()) {
                clipboard_store.paste(e.clipboardData.getData('text'));
            }
        });

        // クリップボードへコピーして削除する（マウス操作、キーボード操作）
        document.addEventListener('cut', function(e) {
            if (isTriggerFromInput(e) || isModalDisplayed()) {
                return;
            }
            if (uop() && eta() && !dl() && 0 < selection_store.layer.members().length) {
                clipboard_store._copy(e);
                graph_store.deleteSelection('Cut');
            }
        });

        document.addEventListener('keydown', (e) => {
            if (isModalDisplayed() && e.keyCode === definitions_store.Definitions.KEY_CODE.TAB) {
                var $tabbables = $('.' + definitions_store.Definitions.MODAL.TABBABLE_CLASS);
                if (!$tabbables.length) {
                    return;
                }
                var $first = $tabbables.filter(':first');
                var $last = $tabbables.filter(':last');
    
                var $currentFocus = $(':focus');
                if (!$currentFocus.length) {
                    $first.focus();
                    e.preventDefault();
                    return;
                }
    
                if (($currentFocus[0].className.indexOf(definitions_store.Definitions.MODAL.TABBABLE_CLASS) === -1)) {
                    $first.focus();
                    e.preventDefault();
                } else {
                    if (e.target === $last[0] && !e.shiftKey) {
                        $first.focus();
                        e.preventDefault();
                    } else if (e.target === $first[0] && e.shiftKey) {
                        $last.focus();
                        e.preventDefault();
                    }
                }
            }
    
            if (uop() && !dl() && ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey))) {
                switch (e.keyCode) {
                case definitions_store.Definitions.KEY_CODE.S:
                    e.preventDefault();
                    utils_store.save_configuration();
                    break;
                case definitions_store.Definitions.KEY_CODE.Y:
                    if (isModalDisplayed()) {
                        e.preventDefault();
                        return;
                    } else if (isTriggerFromInput(e)) {
                        return;
                    }
                    e.preventDefault();
                    if (eta()) history_store.execute({type: 'redo'});
                    break;
                case definitions_store.Definitions.KEY_CODE.Z:
                    if (isModalDisplayed()) {
                        e.preventDefault();
                        return;
                    } else if (isTriggerFromInput(e)) {
                        return;
                    }
                    e.preventDefault();
                    if (eta()) history_store.execute({type: 'undo'});
                    break;
                }
            }
        });
    
        // Vue.config.keyCodes = Object.assign(Vue.config.keyCodes || {}, {
        //     backspace: definitions_store.Definitions.KEY_CODE.BACKSPACE,
        //     'just-delete': definitions_store.Definitions.KEY_CODE.DEL,
        //     insert:  definitions_store.Definitions.KEY_CODE.INSERT,
        //     a: definitions_store.Definitions.KEY_CODE.A,
        // });
    
        // var svgArea = new sdn.SvgArea();
        $(document).on({
            contextmenu: () => false,
        });
        $('.action-menu-item').on({
            click: (e: any) => {
                // Actionメニューのdisabled項目をクリックされてもメニューを閉じないようにする
                e.preventDefault();
                e.stopPropagation();
            }
        });
    }

    return { 
        init
    }
})
