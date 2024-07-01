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

/// <reference path="../../@types/index.d.ts" />
import Vue from 'vue';
import { Prop } from 'vue-property-decorator';
import Component from 'vue-class-component';
import { ILabel } from '../../store/state/project';

@Component({
  name: 'LabelDialog'
})
export default class LabelDialog extends Vue {
  @Prop() public title!: string;
  @Prop() public labelList!: string[];
  @Prop() public allLabelList!: ILabel[];
  @Prop() public projectId!: string;
  @Prop() public vueTexts!: any;
  @Prop() public selectOptionLabels!: string[];
  @Prop() public callback!: (labelList: string[]) => void;
  @Prop() public createNewLabelCallback!: (newLabel: string) => void;
  @Prop() public cancelCallback!: () => void;

  private keyword: string = '';
  private allLabelListWithChecked: ILabel[] = this.createAllLabelListWithChecked();
  private filteredLabelList: ILabel[] = this.allLabelListWithChecked;
  private isInvalid: boolean = false;

  public inputKeyword(value: string): void {
    if (value.match(/[^a-zA-Z0-9_ !#$%&\'\()+,\.\-=@\[\]^`{}~]+/g)) {
      this.isInvalid = true;
    } else {
      this.isInvalid = false;
    }
    this.keyword = value;
    const splittedKeywordList: string[] = this.keyword.trim().split(/\s+/);
    let condition: string = '';
    let newKeyword: string = '';
    splittedKeywordList.forEach((_keyword: string) => {
      newKeyword += '(?=.*' + _keyword + ')';
    });
    condition += `${'^' + newKeyword + '.*$'}`;
    const regExp: RegExp = new RegExp(condition, 'i');
    this.filteredLabelList = this.allLabelListWithChecked.filter((label: ILabel) => regExp.test(label.labelName));
  }

  get filteredLabels(): ILabel[] {
    return this.filteredLabelList;
  }

  public onClickUpdate(): void {
    const selectedLabelList: string[] = [];
    this.allLabelListWithChecked.forEach((label: ILabel) => {
      if (label.checked) {
        selectedLabelList.push(label.labelName);
      }
    });
    this.callback(selectedLabelList);
  }

  public createAllLabelListWithChecked(): ILabel[] {
    if (!this.allLabelList) {
      return [];
    }
    this.allLabelList.forEach((label: ILabel) => {
      label.checked = false;
      if (this.labelList.length) {
        label.checked = this.labelList.indexOf(label.labelName) !== -1;
      }
    });
    return this.allLabelList;
  }

  public selectLabel(e: any): void {
    this.filteredLabelList.forEach((label: ILabel) => {
      if (label.labelName === e.target.value) {
        label.checked = !label.checked;
      }
    });
  }

  public createLabels(): void {
    const newLabel: ILabel = {labelName: this.keyword, checked: true};
    const newLabelForSelectOption: string = this.keyword;
    this.allLabelListWithChecked.unshift(newLabel);
    this.inputKeyword('');
    this.keyword = '';
    this.createNewLabelCallback(newLabelForSelectOption);
  }

  public isAlreadyExistLabel(): boolean {
    return this.filteredLabelList.some((label: ILabel) => label.labelName === this.keyword);
  }

}
