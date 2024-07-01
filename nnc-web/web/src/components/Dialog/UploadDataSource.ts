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
import Radio from '../Parts/Radio.vue';
import Loading2 from '../Loading2.vue';
import FileUpload from '../Parts/FileUpload.vue';
import { CoreApiClient, IGenerateUrlToUploadDataSource } from '../../CoreApiClient';
import { S3Util } from '../../util/S3Util';
import AWS from 'aws-sdk';
import { SwalUtil } from '../../util/SwalUtil';

const uploadBucketRegion: string = 'us-west-2';

@Component({
  name: 'UploadDataSourceDialog',
  components: {
    FileUpload,
    Loading2,
    Radio
  }
})
export default class UploadDataSourceDialog extends Vue {
  @Prop() public dataSourceList!: {name: string, trigger: boolean}[];
  @Prop() public selectedTenantId!: string;
  @Prop() public userId!: string;
  @Prop() public workflowId!: string;

  private isSuspend: boolean = false;

  public title = {
    upload: this.dialogTexts.UPLOAD_TITLE,
    change: this.dialogTexts.CHANGE_TITLE
  };

  public operationType: string = 'upload';
  public dataSourceName: string = '';
  public file: File = {} as File;
  public inputtedFileName: string = '';

  public copiedDataSourceList: {name: string, trigger: boolean}[] = [];

  public isUploading = false;
  public isUploadApiCall = false;
  public progress: number = 0;

  public mounted() {
    if (this.dataSourceList.length) {
      this.dataSourceName = this.dataSourceList[0].name;
      this.copiedDataSourceList = JSON.parse(JSON.stringify(this.dataSourceList));
    }
  }

  public onChangeOperationType(value: string) {
    this.operationType = value;
  }

  public onChangeDataSourceName(e: any): void {
    this.dataSourceName = e.currentTarget.value;
  }

  public onSelectFile(file: File): void {
    this.file = file;
    this.inputtedFileName = this.file.name;
  }

  public async onClickUpload() {
    const fileSize: number = this.file.size;
    const tenantId: string = this.selectedTenantId;
    store.commit('showDatasetListLoading', tenantId);
    if (!fileSize) {
      return;
    }

    this.isUploadApiCall = true;

    let accessKeyId: string = '';
    let secretAccessKey: string = '';
    let sessionToken: string = '';
    let uploadPath: string = '';
    let fileName: string = '';
    try {
      const response: IGenerateUrlToUploadDataSource = await CoreApiClient.generateUrlToUploadDataSource(this.userId, tenantId, this.workflowId, this.dataSourceName, this.inputtedFileName);
      accessKeyId = response.accessKeyId;
      secretAccessKey = response.secretAccessKey;
      sessionToken = response.sessionToken;
      uploadPath = response.uploadUrl;
      fileName = response.uploadFileName;
    } catch (error) {
      this.isUploadApiCall = false;
      this.$emit('apierror', error);
      return;
    }

    this.isUploadApiCall = false;
    this.isUploading = true;

    // upload_pathからbucket名とKeyを取得
    const reg: RegExp = new RegExp('\s3://(.+?)$');
    const bucketAndKey: string = (uploadPath.match(reg) as string[])[1];
    const index: number = bucketAndKey.indexOf('/');
    const bucketName: string = bucketAndKey.substr(0, index);
    const key: string = bucketAndKey.substr(index + 1);

    const s3: AWS.S3 = new AWS.S3({
      accessKeyId,
      secretAccessKey,
      sessionToken,
      region: uploadBucketRegion
    });

    const s3Params: AWS.S3.Types.CreateMultipartUploadRequest = {
      Bucket: bucketName,
      Key: key,
      ContentType : this.file.type
    };
    S3Util.uploadMultiPart(s3, s3Params, this.file, (progress: number) => {
      this.progress = Math.floor(progress * 10) / 10;
    }, () => {
      const successMessage: string = this.dialogTexts.UPLOAD_COMPLETED;
      this.onFinish(successMessage);
    }, () => {
      this.isUploading = false;
      const errorMessage: string = this.dialogTexts.UPLOAD_FAILED;
      SwalUtil.alert(errorMessage);
    }, () => {
      const message: string = this.dialogTexts.UPLOAD_CANCELED;
      this.onFinish(message);
    }, () => {
      return this.isSuspend;
    });
  }

  private onFinish(message: string) {
    SwalUtil.alert(message);
    this.isUploading = false;
    this.file = {} as File;
    this.progress = 0;
    this.inputtedFileName = '';
    this.isUploadApiCall = false;
    this.isSuspend = false;
  }

  public onClickCancel() {
    if (!this.isUploading) {
      this.$emit('cancel');
      return;
    }

    const message: string = this.dialogTexts.CANCEL_MESSAGE;
    SwalUtil.confirm(message, () => {
      this.isUploadApiCall = true;
      this.isSuspend = true;
    });
  }

  public onClickUpdate() {
    this.$emit('update-trigger', this.copiedDataSourceList);
  }

  public onClickTrigger(index: number, value: boolean) {
    this.copiedDataSourceList[index].trigger = value;
  }

  public isUpload(): boolean {
    return this.operationType === 'upload';
  }

  get vueTexts(): {[key: string]: string} {
    return text[store.state.common.language].vueTexts.pipeline;
  }

  get dialogTexts(): {[key: string]: string} {
    return text[store.state.common.language].dialogTexts.UPLOAD_DATA_SOURCE;
  }

  get commonDialogTexts(): {[key: string]: string} {
    return text[store.state.common.language].dialogTexts;
  }

  private isTar(fileName: string): boolean {
    return fileName.match(/.+\.tar$/) ? true : false;
  }

  private isTooShortOrLong(name: string): boolean {
    const DEFAULT_MAX_LENGTH: number = 255;
    if (name.length < 1 || name.length > DEFAULT_MAX_LENGTH) {
      return true;
    } else {
      return false;
    }
  }

  private isInvalidName(name: string): boolean {
    if (name.match(/[^a-zA-Z0-9_ !#$%&\'\()+,\.\-=@\[\]^`{}~]+/g)) {
      return true;
    } else {
      return false;
    }
  }

  get showFileNameInput(): boolean {
    const fileName: string = this.file.name;
    if (!fileName) {
      return false;
    }
    return this.isTooShortOrLong(fileName) || this.isInvalidName(fileName);
  }

  get inputFileError(): string {
    if (this.inputtedFileName === '.tar' || this.isTooShortOrLong(this.inputtedFileName)) {
      return this.commonDialogTexts.NAME_IS_TOO_SHORT_OR_LONG;
    } else if (this.isInvalidName(this.inputtedFileName)) {
      return this.commonDialogTexts.INVALID_CHARACTER_INCLUDED;
    } else if (!this.isTar(this.inputtedFileName)) {
      return this.dialogTexts.INVALID_EXTENSION;
    }
    return '';
  }

  get uploadErrorMessage(): string {
    const fileName = this.file.name || '';
    if (!fileName) {
      return '';
    }

    return this.isTar(fileName) ? '' : this.dialogTexts.INVALID_FORMAT;
  }

  get disabledUploadButton(): boolean {
    return this.isUploading || this.isUploadApiCall || !this.file.size || !!this.uploadErrorMessage || !!this.inputFileError;
  }

  get hasChecked(): boolean {
    return this.copiedDataSourceList.some((data: {name: string, trigger: boolean}) => data.trigger);
  }
}
