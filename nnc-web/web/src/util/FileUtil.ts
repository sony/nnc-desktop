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
export class FileUtil {

  /**
   * ファイルをダウンロードします
   * @param content 内容
   * @param fileName ファイル名
   */
  public static download(content: string, fileName: string): void {
    const blob: Blob = new Blob([content]);
    const blobURL: string = window.URL.createObjectURL(blob);
    const a: any = document.createElement('a');
    a.download = fileName;
    a.href = blobURL;
    a.click();
  }

  /**
   * ファイルをアップロードします
   * @param file ファイル
   */
  public static upload(file: any): Promise<any> {
    return new Promise((resolve: (res: any) => void, reject: (res: any) => void) => {
      if (file.name.match(/.+\.onnx$/) || file.name.match(/.+\.nnp$/) || file.name.match(/.+\.pb$/)) {
        resolve('');
      }
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        resolve(e.target.result);
      };
      reader.readAsText(file);
    });
  }

}
