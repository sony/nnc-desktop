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

import './css/editor.css'
import { useEditorStore } from '@/stores/editor'
import { useSDUAppStore } from '@/stores/editor/sduapp'
import { useGraphStore } from '@/stores/graph'
import { useResultStore } from '@/stores/result'
import { useProjConvertStore } from '@/stores/project_converter'
import { useLRCurveGraphForHtmlStore } from '@/stores/training_graph/learning_curve_for_html'
import { useLRCurveGraphStore } from '@/stores/training_graph/learning_curve_graph'
import { useTradeOffGraphStore } from '@/stores/training_graph/trade_off_graph'
import { useJqueryUICustomStore } from '@/stores/misc/jquery_ui_custom'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from "./Editor.vue"
import router from './router'

const app = createApp(App)
const pinia = createPinia();
app.use(pinia)
const editor_store = useEditorStore()
const result_store = useResultStore()
const graph_store = useGraphStore()
const project_converter_store = useProjConvertStore()
const jquery_ui_custom_store = useJqueryUICustomStore()
const sduapp_store = useSDUAppStore()
const learning_curve_for_html_store = useLRCurveGraphForHtmlStore()
const learning_curve_graph_store = useLRCurveGraphStore()
const trade_off_graph_store = useTradeOffGraphStore()
editor_store.init()
graph_store.init()
jquery_ui_custom_store.init()
sduapp_store.init()
project_converter_store.init()
result_store.init()
learning_curve_for_html_store.init()
learning_curve_graph_store.init()
trade_off_graph_store.init()

// app.use(router)

app.mount('#editor')
