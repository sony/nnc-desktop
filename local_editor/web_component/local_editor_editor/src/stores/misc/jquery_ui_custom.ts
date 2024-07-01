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
import { useEditorStore } from '@/stores/editor'

export const useJqueryUICustomStore = defineStore('jquery_ui_custom', () => {
    const editor_store = useEditorStore()
    
    function init() {
        $.ui.plugin.add("resizable", "alsoResizeReverse", {
            start: function() {
                var that = $(this).resizable( "instance" ),
                    o = that.options;
        
                $(o.alsoResizeReverse).each(function () {
                    var el = $(this);
                    el.data("ui-resizable-alsoresizeReverse", {
                        width: parseInt(el.width(), 10), height: parseInt(el.height(), 10),
                        left: parseInt(el.css("left"), 10), top: parseInt(el.css("top"), 10)
                    });
                });
            },
        
            resize: function(event: any, ui: any) {
                var that = $(this).resizable( "instance" ),
                    o = that.options,
                    os = that.originalSize,
                    op = that.originalPosition,
                    delta: any = {
                        height: (that.size.height - os.height) || 0,
                        width: (that.size.width - os.width) || 0,
                        top: (that.position.top - op.top) || 0,
                        left: (that.position.left - op.left) || 0
                    };
        
                $(o.alsoResizeReverse).each(function () {
                    var el = $(this), start = $(this).data("ui-resizable-alsoresize-reverse"), style: any = {},
                        css = el.parents(ui.originalElement[0]).length ?
                            [ "width", "height" ] :
                            [ "width", "height", "top", "left" ];
                    $.each(css, function(i: any, prop: any) {
                        if (delta[prop]) {
                            let sum = (start[prop] || 0) - delta[prop];
        
                            if (sum && sum >= 0) {
                                style[prop] = sum;
                            }
                        }
                    });
                    el.css(style);
                });
                editor_store.rightWidth = $('#right-content').width();
            },
        
            stop: function() {
                $(this).removeData("resizable-alsoresize-reverse");
            }
        });
    }

    return { 
        init
    }
})
