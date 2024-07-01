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
 * 要素を重複なく格納できる集合（Set）実装。
 */
export default class SetSDU{
    _set: any
    sduutils_store: any

    constructor(_sduutils_store: any) {
        this._set = {}
        this.sduutils_store = _sduutils_store
    }

    insert(obj: object) {
        this._set[this.sduutils_store.getId(obj)] = obj
    }

    remove(obj: object) {
        delete this._set[this.sduutils_store.getId(obj)]
    }

    clear() {
        this._set = {}
    }

    members() {
        return this.apply((x: any) => x)
    }

    contains(obj: object) {
        return this.sduutils_store.getId(obj) in this._set
    }

    // apply function 'f' for each elements in selection.
    // returns application result of f as array.
    apply(f: (arg0: any) => any) {
        // console.log("APPLY: ", f, this._set)
        var results = []
        for (var key in this._set) {
            var object = this._set[key]
            var value = f(object)
            results.push(value)
        }
        return results
    }

}