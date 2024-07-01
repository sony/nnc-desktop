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
import store from '../../store';

const limitDatasetSize: number = 5497558138880; // 5TB

@Component({
  name: 'UploadDatasetDialog'
})
export default class UploadDatasetDialog extends Vue {
  @Prop() public title!: string;
  @Prop() public vueTexts!: any;
  @Prop() public dialogTexts!: any;
  @Prop() public callback!: (datasetName: string, files: File[], fileSize: number) => void;
  @Prop() public cancelCallback!: () => void;

  public isOnArea: boolean = false;
  public fileName: string = '';
  private files: File[] = [];
  public messageInvalid: string = '';
  public uploadErrorMessage: string = '';
  private fileSize: number = 0;
  public isChecked: boolean = false;
  public isInvalid: boolean = false;
  public isTooShortOrLong = false;
  public newDatasetName: string = '';

  public onArea(): void {
     this.isOnArea = true;
  }

  public dropFile(e: any): void {
    this.isOnArea = false;
    if (e.target.files) {
      this.fileName = e.target.files[0].name;
      this.files = e.target.files;
    } else if (e.dataTransfer.files) {
      this.fileName = e.dataTransfer.files[0].name;
      this.files = e.dataTransfer.files;
    }
    this.isChecked = false;
    this.isInvalid = false;
    this.isTooShortOrLong = false;
    this.uploadErrorMessage = '';
    this.checkFile(this.files);
  }

  private excludeExtension(fileName: string): string {
    if (this.isZip(fileName)) {
      return fileName.replace(/\.zip$/, '');
    } else if (this.isTarGz(fileName)) {
      return fileName.replace(/\.tar\.gz$/, '');
    } else if (this.isTar(fileName)) {
      return fileName.replace(/\.tar$/, '');
    } else if (this.isGz(fileName)) {
      return fileName.replace(/\.gz$/, '');
    }
    return fileName;
  }

  private isZip(fileName: string): boolean {
    return fileName.match(/.+\.zip$/) ? true : false;
  }

  private isTarGz(fileName: string): boolean {
    return fileName.match(/.+\.tar.gz$/) ? true : false;
  }

  private isTar(fileName: string): boolean {
    return fileName.match(/.+\.tar$/) ? true : false;
  }

  private isGz(fileName: string): boolean {
    return fileName.match(/.+\.gz$/) ? true : false;
  }

  private checkFile(files: File[]): void {
    let format: string = '';
    if (files && files[0]) {
      const fileName: string = files[0].name;
      if (this.isZip(fileName)) {
        format = 'zip';
      } else if (this.isTar(fileName)) {
        format = 'tar';
      } else if (this.isGz(fileName)) {
        format = 'gz';
      }
      if (!format) {
        // 空なら表示
        this.uploadErrorMessage = this.dialogTexts.UPLOAD_DATASET_FILE_IS_NOT_CORRECT;
        this.isChecked = false;
        return;
      }

      this.fileSize = files[0].size;
      this.files = files;
      this.messageInvalid = '';
      this.newDatasetName = this.excludeExtension(fileName);
      this.isChecked = true;
      this.validateDatasetName();
    }
  }

  public isExceededDatasetLimitSize(): boolean {
    return this.fileSize >= limitDatasetSize ? true : false;
  }

  public offArea(): void {
    this.isOnArea = false;
  }

  public onClickUpload(): void {
    store.commit('hideUploadDialogForDataset');
    this.callback(this.newDatasetName, this.files, this.fileSize);
  }

  public clickInput(): void {
    const inputId: HTMLElement | null = document.getElementById('input-upload-dataset');
    if (inputId) {
      inputId.click();
    }
  }

  public inputNewName(value: string): void {
    this.newDatasetName = value;
    this.validateDatasetName();
  }

  private validateDatasetName(): void {
    const DEFAULT_MAX_LENGTH: number = 255;
    if (this.newDatasetName.length < 1 || this.newDatasetName.length > DEFAULT_MAX_LENGTH) {
      this.isTooShortOrLong = true;
    } else {
      this.isTooShortOrLong = false;
    }
    if (this.newDatasetName.match(/[^a-zA-Z0-9_ !#$%&\'\()+,\.\-=@\[\]^`{}~]+/g)) {
      this.isInvalid = true;
    } else {
      this.isInvalid = false;
    }
  }

}
