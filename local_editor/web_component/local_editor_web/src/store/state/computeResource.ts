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

import { IInstanceType } from '../../interfaces/core-response/IMisc';

export interface IComputeResourceGroup {
    maxCompResoLength: { [key: string]: number };
    compResoTotal: { [key: string]: number };
    compResoList: { [key: string]: IComputeResource[] };
    keyword: { [key: string]: string };
    allChecked: { [key: string]: boolean };
    shouldShowAddDialog: boolean; // control add dialog popup
    rightWidth: number; //control right column width
    instanceListLoading: { [key: string]: boolean };
    platform: string;
    remoteResGForm: IremoteResGForm;
}

export type IComputeResource= IInstanceType & {
    inputValue?: string;
    deleted?: boolean;
    checked?: boolean;
    shouldShowInput?: boolean;
    name: string;
    // name could be extracted from description, better not allow user to name instance freely
}

export interface IremoteResGForm {
    type: string;
    userId: string;
    cert: string;
    partition: string;
    gpuNumber: number;
}

const computeResourceGroup: IComputeResourceGroup= {
    maxCompResoLength: {},
    compResoTotal: {},
    compResoList: {},
    keyword: {},
    allChecked: {},
    shouldShowAddDialog: false,
    rightWidth: 280,
    instanceListLoading: {},
    platform: '',
    remoteResGForm: {
        type: '',
        userId: '',
        cert: '',
        partition: '',
        gpuNumber: NaN}
};

/* definition for ComputeResourceGroup state */
export default computeResourceGroup;
