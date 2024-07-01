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
import text from '../../messages/Text';
import {CONFIGURATION_FORMAT, PAGES, SELECTOPTIONS} from '../../Const';
import {FileUtil} from '../../util/FileUtil';
import {CoreApiClient} from '../../CoreApiClient';
import {SwalUtil} from '../../util/SwalUtil';

@Component({
  name: 'UploadProjectDialog'
})
export default class UploadProjectDialog extends Vue {
  @Prop() public title!: string;
  @Prop() public vueTexts!: any;
  @Prop() public callback!: (format: string, projectName: string, files: any[], projectContent: string, fileSize: string) => void;
  @Prop() public cancelCallback!: () => void;

  public isOnArea: boolean = false;
  public fileName: string = '';
  public files: any[] = [];
  public messageInvalid: string = '';
  public uploadErrorMessage: string = '';
  public format: string = '';
  public fileSize: any;
  public projectContent: string = '';
  public isChecked: boolean = false;
  public isInvalid: boolean = false;
  public isTooShortOrLong = false;
  public newProjectName: string = '';

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
    this.checkFile(this.files);
  }

  public isSdcproj(fileName: string): boolean {
    return fileName.match(/.+\.sdcproj$/) ? true : false;
  }

  private isPrototxt(fileName: string): boolean {
    return fileName.match(/.+\.prototxt$/) ? true : false;
  }

  private isNntxt(fileName: string): boolean {
    return fileName.match(/.+\.nntxt$/) ? true : false;
  }

  private isOnnx(fileName: string): boolean {
    return fileName.match(/.+\.onnx$/) ? true : false;
  }

  private isNnp(fileName: string): boolean {
    return fileName.match(/.+\.nnp$/) ? true : false;
  }

  private isPb(fileName: string): boolean {
    return fileName.match(/.+\.pb$/) ? true : false;
  }

  public checkFile(files: any[]): void {
    const uploader: any = document.getElementById('project-uploader');
    let format: string = '';
    if (files && files[0]) {
      const fileName: string = files[0].name;
      if (this.isSdcproj(fileName)) {
        format = 'sdcproj';
      } else if (this.isPrototxt(fileName)) {
        format = 'prototxt';
      } else if (this.isNntxt(fileName)) {
        format = 'nntxt';
      } else if (this.isOnnx(fileName)) {
        format = 'onnx';
      } else if (this.isNnp(fileName)) {
        format = 'nnp';
      } else if (this.isPb(fileName)) {
        format = 'pb';
      }
      if (!format) {
        // 空なら表示
        this.uploadErrorMessage = text[store.state.common.language].dialogTexts.UPLOAD_FILE_IS_NOT_CORRECT;
        this.isChecked = false;
        return;
      }
      FileUtil.upload(files[0]).then((projectContent: string) => {
        let fileSize: string;
        try {
          if (format === 'sdcproj') {
            const configuration: IConfiguration = importProject(projectContent);
            projectContent = exportProject(configuration, false, true);
          } else if (format === 'onnx' || format === 'nnp' || format === 'pb') {
            fileSize = files[0].size;
            this.fileSize = fileSize;
            projectContent = '';
          }
          this.format = format;
          this.fileName = fileName;
          this.files = files;
          this.projectContent = projectContent;
          this.uploadErrorMessage = '';
          this.messageInvalid = '';
          const regexp: RegExp = new RegExp('/\.' + format + '$/');
          this.newProjectName = fileName.split(regexp)[0];
          this.isChecked = true;
          this.validateProjectName();
        } catch (e) {
          // sdcprojの中身が不正の場合
          this.messageInvalid = text[store.state.common.language].dialogTexts.INVALID_FORMAT;
          this.isChecked = false;
          store.commit('hideLoading', PAGES.PROJECT);
        }
      });
    }
  }

  public offArea(): void {
    this.isOnArea = false;
  }

  public onClickUpload(): void {
    store.commit('hideUploadDialog');
    this.callback(this.format, this.newProjectName, this.files, this.projectContent, this.fileSize);
  }

  public clickInput(): void {
    const inputId: HTMLElement | null = document.getElementById('input-upload-project');
    if (inputId) {
      inputId.click();
    }
  }

  public inputNewName(value: string): void {
    this.newProjectName = value;
    this.validateProjectName();
  }

  public validateProjectName(): void {
    const DEFAULT_MAX_LENGTH: number = 255;
    if (this.newProjectName.length < 1 || this.newProjectName.length > DEFAULT_MAX_LENGTH) {
      this.isTooShortOrLong = true;
    } else {
      this.isTooShortOrLong = false;
    }
    if (this.newProjectName.match(/[^a-zA-Z0-9_ !#$%&\'\()+,\.\-=@\[\]^`{}~]+/g)) {
      this.isInvalid = true;
    } else {
      this.isInvalid = false;
    }
  }

}
