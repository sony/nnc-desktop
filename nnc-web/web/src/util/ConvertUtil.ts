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

export class ConvertUtil {

  public static convertByteToGB(byte: number, isFirstDecimalPlace: boolean): number {
    if (typeof byte !== 'number') {
      return 0;
    }
    return isFirstDecimalPlace ? this.floorFirstDecimalPlace(byte / Math.pow(1024, 3)) : Math.floor(byte / Math.pow(1024, 3));
  }

  public static convertMinutesToHours(minutes: number, isFirstDecimalPlace: boolean): number {
    if (typeof minutes !== 'number') {
      return 0;
    }
    return isFirstDecimalPlace ? this.floorFirstDecimalPlace(minutes / 60) : Math.floor(minutes / 60);
  }

  private static floorFirstDecimalPlace(num: number): number {
    return Math.floor(num * 10) / 10;
  }

  private static ceilFirstDecimalPlace(num: number): number {
    return Math.ceil(num * 10) / 10;
  }

  public static calcStorage(storage: number): number {
    if (!storage) {
      return 0;
    }
    return Math.ceil((storage / Math.pow(2, 30)) * 100) / 100;
  }

  public static calcMBStorage(storage: number): number {
    if (!storage) {
      return 0;
    }
    return Math.ceil((storage / Math.pow(2, 20)) * 100) / 100;
  }

  /**
   * 価格にレートをかけて、実際に表示する際の価格に変更します。
   * @param price 価格
   * @param currencyRate レート
   * @param locale ロケール
   */
  public static convertPriceToDispPrice(price: number, currencyRate: number, locale: string): string {
    if (!price || !currencyRate) {
      return '0';
    }
    return this.ceilFirstDecimalPlace(price * currencyRate).toLocaleString(locale);
  }

}
