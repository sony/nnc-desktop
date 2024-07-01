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

export const useSDUUtilsStore = defineStore('sduutils', () => {

  const _timeoutIds = ref<any>({})
  const _id = ref<number>(0)
  const _idManager = ref<any>(new WeakMap())

  function _getId(obj: object) {
    if (!_idManager.value.has(obj)) {
        _idManager.value.set(obj, _id.value++)
    }
    return _idManager.value.get(obj)
  }

  /**
   * 秒を基に日時を取得する
   * @param _sec
   * @returns {string}
   * @memberOf sdu.Utils
   */
  function calcSecToDayHourMinSec (_sec: number) {
    if(_sec == 0) return "--:--:--:--"

    var MINUTE = 60
    var HOUR = 60 * MINUTE
    var DAY = 24 * HOUR

    var days = Math.floor(_sec / DAY)
    if (days >= 1) {
        _sec -= days * DAY
    }

    var hours = Math.floor(_sec / HOUR)
    if (hours >= 1) {
        _sec -= hours * HOUR
    }

    var minutes = Math.floor(_sec / MINUTE)
    if (minutes >= 1) {
        _sec -= minutes * MINUTE
    }

    return zerofill(days) + ':' + zerofill(hours) + ':' + zerofill(minutes) + ':' + zerofill(Math.floor(_sec))
  }

  /**
   * 0埋めする
   * @param value
   * @param length
   * @returns {string}
   * @memberOf sdu.Utils
   */
  function zerofill(value: string | number, length=2): string {
    for (var i = String(value).length; i < length; i++) {
        value = '0' + value
    }
    return String(value).slice(-length)
  }

  /**
   * "yyyy/MM/dd-hh:mm:ss"形式の時間を"yyyyMMdd_hhmmss"に変換する
   * @param strDateTime
   * @returns {string}
   * @memberOf sdu.Utils
   */
  function convertModifiedDataTimeToResultTitle(strDateTime: string): string {
    var aryDateTime = strDateTime.split('-')
    var ymd = aryDateTime[0].split('/')
    var hms = aryDateTime[1].split(':')
    return ymd[0] + ymd[1] + ymd[2] + '_' + hms[0] + hms[1] + hms[2]
  }

  /**
   * 0以外の値を取得する. ない場合、0を返す
   * @param strArray
   * @returns {number}
   * @memberOf sdu.Utils
   */
  function getNotZeroValue(strArray: any[]) {
    if (strArray.length === 0) return -1
    var reversed = strArray.map(Number).filter(function(x: number) {
        return x !== 0
    }).reverse()
    return reversed.length > 0 ? reversed[0] : 0
  }

  /**
   * 指定した桁数にする
   * @param num round対象の数値
   * @param [few=2] {number} 少数第何位まで表示するか
   * @memberOf sdu.Utils
   */
  function round(num: number, few: number | null): number {
    few = few != null ? few : 2
    var factor = Math.pow(10, few)
    return Math.round(num * factor) / factor
  }

  /*
    * key に関連付けた callback を timeout 後に設定する。
    * すでに key に callback が関連付けられていたら先にこれをキャンセルする。
    * callback を指定しなければキャンセルのみを実行する。
    * @param key callback を管理するためのキー
    * @param callback timeout 後に呼び出すコールバック関数
    * @param timeout callback 呼び出しの遅延時間。指定しなければ 2500ms
    */
  function setTimeoutSDU(key: any, callback: any, timeout=2500) {
    var timeoutId = _timeoutIds.value[key]
    if (timeoutId) {
        clearTimeout(timeoutId)
        delete _timeoutIds.value[key]
    }
    if (callback) {
        _timeoutIds.value[key] = setTimeout(function() {
            delete _timeoutIds.value[key as keyof typeof _timeoutIds.value]
            callback()
        }, timeout)
    }
  }

  return{
    calcSecToDayHourMinSec,
    zerofill,
    convertModifiedDataTimeToResultTitle,
    getNotZeroValue,
    round,
    getId: _getId,
    setTimeoutSDU
  }
})
