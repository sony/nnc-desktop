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

export default class JobCostAndErrors{
    stat: any
    valid_error: any
    type: any

    constructor(job: any, graph_cost_type: any, cost_type?: any) {
        this.stat = job.train_status || {};
        this.valid_error = (this.stat.last || {}).valid_error;
        this.type = this.defaultIfUndefined(cost_type, graph_cost_type);
    }

    defaultIfUndefined(value: any, defValue: any) {
        return value !== undefined ? value : defValue
    }

    cost(defValue: any) {
        return this.defaultIfUndefined(
            (this.stat.statistics || {})[this.type], 
            (this.type === 'CostMultiplyAdd' && this.stat.cost_multiply_add) ? this.stat.cost_multiply_add : defValue
        )
    }

    training(defValue: any) {
        return this.defaultIfUndefined((this.stat.last || {}).train_error, defValue)
    }

    validation(defValue: any) {
        return this.defaultIfUndefined(this.valid_error, defValue)
    }

    validationBest(defValue: any) {
        return this.defaultIfUndefined(
            (this.stat.best || {}).valid_error,
            this.defaultIfUndefined(this.valid_error, defValue)
        ) // XXX for Day1
    }

    output(defValue: any) {
        return this.defaultIfUndefined((this.stat.statistics || {}).Output, defValue)
    }

    costParameter(defValue: any) {
        return this.defaultIfUndefined((this.stat.statistics || {}).CostParameter, defValue)
    }

    costAdd(defValue: any) {
        return this.defaultIfUndefined((this.stat.statistics || {}).CostAdd, defValue)
    }

    costMultiply(defValue: any) {
        return this.defaultIfUndefined((this.stat.statistics || {}).CostMultiply, defValue)
    }

    costMultiplyAdd(defValue: any) {
        return this.defaultIfUndefined(
            (this.stat.statistics || {}).CostMultiplyAdd, 
            this.stat.cost_multiply_add ? this.stat.cost_multiply_add : defValue
        )
    }

    costDivision(defValue: any) {
        return this.defaultIfUndefined((this.stat.statistics || {}).CostDivision, defValue)
    }

    costExp(defValue: any) {
        return this.defaultIfUndefined((this.stat.statistics || {}).CostExp, defValue)
    }

    costIf(defValue: any) {
        return this.defaultIfUndefined((this.stat.statistics || {}).CostIf, defValue)
    }
}
