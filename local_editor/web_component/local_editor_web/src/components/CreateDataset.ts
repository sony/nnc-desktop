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

/// <reference path="../@types/index.d.ts" />
import Vue from 'vue';
import store from '../store/index';
import { Prop } from 'vue-property-decorator';
import {SwalUtil} from '../util/SwalUtil';
import Component from 'vue-class-component';
import {CoreApiClient} from '../CoreApiClient';
import { PAGES } from '../Const';
import text from '../messages/Text';

@Component({
  name: 'CreateDataset'
})

export default class CreateDataset extends Vue {

  @Prop() public selectedTenantId!: string;
  @Prop() public getAllTenantDatasets!: (userId: string) => Promise<any>;
  @Prop() public setPollingForDataset!: (datasets: any[], tenantId: string) => void;

  private datasetPath: string = '';
  private isUploading: boolean = false;
  private save_dir: string = '';

  public mounted() {
    const userId: any = localStorage.getItem('u');
    CoreApiClient.getDatasetSaveDir(userId, this.selectedTenantId).then((result: any) => {
      this.save_dir = result;
    })
  }

  public onClickStart(e:any): void {
    e.stopPropagation();

    const userId: any = localStorage.getItem('u');
    store.commit('showDatasetListLoading', this.selectedTenantId);
    this.isUploading = true;

    CoreApiClient.uploadDataset(userId, this.selectedTenantId, this.datasetPath).then((result: any) => {
      if (result["status"] === 'OK') {
        this.getAllTenantDatasets(userId).then(() => {
					this.setPollingForDataset(store.state.dataset.datasetList[this.selectedTenantId], this.selectedTenantId);
        });
        store.commit('hideCopyArea');
        store.commit('hideDatasetListLoading', this.selectedTenantId);
      } else {
        SwalUtil.alert(result["message"], () => {
          this.isUploading = false;
          store.commit('hideDatasetListLoading', this.selectedTenantId);
          return;
        })
      }
      store.commit("hideLoading", PAGES.DATASET);
    }, (error: any) => {
      this.$emit('apierror', error, (errorResponse: any) => {
        SwalUtil.alert(text[store.state.common.language].dialogTexts.AN_UNEXPECTED_ERROR_OCCURED, () => {
          document.location.href = './error.html';
        });
      });
    });
  }

  public close(): void {
    store.commit('hideCopyArea');
  }

}