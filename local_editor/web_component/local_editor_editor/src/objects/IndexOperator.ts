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

export default class IndexOperator{
  canMoveNext: boolean
  canMovePrev: boolean
  next: any
  prev: any

  constructor(array: any, value: any) {
    let index = array.indexOf(value);
    if (index < 0) {
        for (let i in array) {
            if (value >= array[i]) index = Number(i);
        }
        this.canMoveNext = index !== array.length - 1;
        this.canMovePrev = index !== -1;
        this.next = this.canMoveNext ? array[index + 1] : array[array.length - 1];
        this.prev = this.canMovePrev? array[index] : array[0];
    } else {
        this.canMoveNext = index !== array.length - 1;
        this.canMovePrev = index !== 0;
        this.next = array[index + 1];
        this.prev = array[index - 1];
    }
  }
  
}
