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

/**
 * 日付フォーマット用のクラスです
 */
export class DateFormatUtil {

  /**
   * ゼロパディングを行います
   * @param source ゼロパディング対象の文字列
   * @param length ゼロパディング後の文字長(デフォルトは2)
   * @return ゼロパディングした文字列
   */
  public static addZeroPadding(source: string, length?: number): string {
    if (!source) {
      return '';
    }

    // lengthが指定されていない場合のデフォルト値は2
    let l: number = 2;
    if (length !== null && length !== undefined) {
      l = length;
    }

    const sourceLength: number = source.length;

    if (l > sourceLength) {
      return (new Array((l - sourceLength) + 1).join('0')) + source;
    } else {
      return source;
    }
  }

  /**
   * yyyy-MM-dd HH:mmの形式でフォーマットします
   * @param dateString 日付文字列
   * @return yyyy-MM-dd HH:mm の形式の文字列
   */
  public static formatYYYYMMDDHHmmJoinHyphenAndColon(dateString: string): string {
    const date: Date = new Date(dateString);
    return date.getFullYear() + '-' + this.addZeroPadding((date.getMonth() + 1).toString()) + '-' + this.addZeroPadding(date.getDate().toString()) + ' ' +
           this.addZeroPadding(date.getHours().toString()) + ':' + this.addZeroPadding(date.getMinutes().toString());
  }

  /**
   * 経過時間を取得します
   * フォーマット: HH:mm:ss
   * @param elapsedTimeStr
   */
  public static getElapsedTime(elapsedTimeStr: string): string {

    const elapsedTime = Number(elapsedTimeStr);
    if (!elapsedTime) {
      return '00:00:00';
    }

    const elapsedHour: number = Math.floor(elapsedTime / 3600);
    const elapsedMin: number = Math.floor((elapsedTime % 3600) / 60);
    const elapsedSec: number = elapsedTime % 60;

    return this.createElapsedTimeString(elapsedHour, elapsedMin, elapsedSec);
  }

  private static createElapsedTimeString(hour: number, min: number, sec: number): string {
    const hourString: string = this.addZeroPadding(String(hour));
    const minString: string = this.addZeroPadding(String(min));
    const secString: string = this.addZeroPadding(String(sec));
    return hourString + ':' + minString + ':' + secString;
  }

}
