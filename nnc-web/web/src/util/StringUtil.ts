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

export class StringUtil {

  /**
   * 先頭一文字を大文字に変換します
   * @param {string} str 文字列
   */
  public static toUpperFirstLetter(str: string): string {
    if (!str) {
      return str;
    }

    return str.replace(/^[a-z]/g, (val: string) => {
      return val.toUpperCase();
    });
  }

  public static parseQueryString(key: string): string {
    const regex: RegExp = new RegExp('[\\?&]' + key + '=([^&#]*)');
    const qs: RegExpExecArray | null = regex.exec(window.location.href);
    return qs ? qs[1] : '';
  }

  /**
   * 指定された書式と引数を使ってフォーマットされた文字列を返します。
   * <br>
   * 使用方法 : <br>
   *    format("%@1足す%@2は%@3%@4", 1, 2, 3, "です");
   *    => "1足す2は3です"
   * <br>
   * 特記事項 : %@1が最初です(%@0は使用できません)
   * @param  format  書式文字列
   * @param  ...args 書式文字列の書式指示子により参照される引数
   * @return フォーマットされた文字列
   */
  public static format(format: string, ...args: any[]): string {

    const replaceFunction: any = (m: any, k: any) => {
       return args[ parseInt(k, 10) - 1];
    };

    return format.replace( /\%@(\d+)/g, replaceFunction);
  }

  /**
   * 長さが2の文字列配列を返します
   * <br />message内に"%@1"がある場合、messageを"%@1"で区切り配列で返します
   * <br />"%@1"がない場合、配列の0番目にmessageを代入し、返します
   * @param message stringResource
   * @return string[] "%@1"で区切られた配列
   */
  public static splitMessage(message: string): string[] {
    let messageArray: string[] = ['', ''];

    if (!message) {
      return messageArray;
    }

    // 配列の0番目と1番目が必要な為、"%@1"が含まれているかどうかの判定を行う
    if (message.indexOf('%@1') !== -1) {
      messageArray = message.split('%@1');
    } else {
      messageArray[0] = message;
    }

    return messageArray;
  }

}
