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
import en from '@/languages/en'
import ja from '@/languages/ja'
import tooltip_en from '@/languages/tooltip_en'
import tooltip_ja from '@/languages/tooltip_ja'
type LangType = 'EN' | 'JA'

export const useLanguageStore = defineStore('language', () => {
    const currentLang = ref<LangType>('EN')
    const languages = ref<any>({
        'EN': en,
        'JA': ja
    })
    const tooltips =  ref<any>({
        'EN': tooltip_en,
        'JA': tooltip_ja
    })

    const setCurrentLang = computed((lang: LangType) => {currentLang.value = lang})
    const language = computed(() => {return languages.value[currentLang.value]})
    const tooltip = computed(() => {return tooltips.value[currentLang.value]})

    return { 
        currentLang, 
        setCurrentLang, 
        language, 
        tooltip }
})
