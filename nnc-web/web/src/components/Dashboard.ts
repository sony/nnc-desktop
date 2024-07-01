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
import Component from 'vue-class-component';
import store from '../store/index';
import router from '../router/index';
import { CoreApiClient } from '../CoreApiClient';
import Chart from 'chart.js';
import { ChartUtil } from '../util/ChartUtil';
import { ConvertUtil } from '../util/ConvertUtil';
import { DateFormatUtil } from '../util/DateFormatUtil';
import { StringUtil } from '../util/StringUtil';
import { MenuResizeUtil } from '../util/MenuResizeUtil';
import { SwalUtil } from '../util/SwalUtil';
import { IProjectList } from '../store/state/project';
import Loading from '../components/Loading.vue';
import {PAGES} from '../Const';
import text from '../messages/Text';
import { ISupport } from '../store/state/dashboard';
import { Prop } from 'vue-property-decorator';
import { TextType } from '../interfaces/common';

@Component({
  name: 'Dashboard',
  components: {
    Loading
  }
})
export default class Dashboard extends Vue {
  @Prop() public language!: string;

  public updated() {
    this.jobList.forEach((job: any, index: any) => {
      this.drawJobProgressChart(index, job.epochCurrent, job.epochMax, job.status, job.type, job.deleted);
    });
  }

  public mounted() {
    window.lockedAuthAPI = false;
    store.commit('hideAccountMenu');
    store.commit('showLoading', PAGES.DASHBOARD);

    const userID: any = localStorage.getItem('u');

    if (!store.state.dashboard.isInitSupportContents) {
      this.getInformation({ whatText: 'announce', locale: store.state.common.locale }, (infoText: { text: string }) => {
        CoreApiClient.getSupportContents(userID).then((supportContents: ISupport[]) => {
          store.commit('setSupportContents', {
            contents: supportContents,
            index: Math.floor(Math.random() * supportContents.length)
          });

          store.commit('setInfoContent', infoText.text);
        });
      });
    } else {
      const supportContentsIndex: number = store.state.dashboard.supportContentsIndex;
      const maxIndex: number = store.state.dashboard.supportContents.length - 1;
      const nextIndex: number = supportContentsIndex === maxIndex ? 0 : supportContentsIndex + 1;
      store.commit('setSupportContentsIndex', nextIndex);
    }

    Promise.all([
      this.getProjectList({ userID }),
      this.getJobHistory({ userID })
    ]).then(() => {
      store.commit('hideLoading', PAGES.DASHBOARD);
    });

    store.commit('selectComponent', PAGES.DASHBOARD);
    const dashboardArea: HTMLElement | null = document.getElementById('dashboard-area');
    if (dashboardArea) {
      dashboardArea.onclick = (e: MouseEvent): void => {
        store.commit('hideAccountMenu');
      };
    }
  }

  public isLoading(): boolean {
    return store.state.common.isLoading[PAGES.DASHBOARD];
  }

  private isInfoNotFoundError(error: any): boolean {
    return error.response.data && error.response.data.error === 'NNCD_MISC_INFO_NOT_FOUND';
  }

  private onUnexpectedError(apiResponse: any): void {
    store.commit('setHideAllLoading');
    const pageUrl: string = location.href;
    let apiUrl: string;
    let method: string;
    let error: string;
    let message: string;
    if (apiResponse.response === undefined) {
      apiUrl  = apiResponse.config.url;
      method = apiResponse.config.method;
      error = 'ERROR';
      message = apiResponse.message;
    } else {
      apiUrl = apiResponse.response.config.url;
      method = apiResponse.response.config.method;
      error = apiResponse.response.data.error;
      message = apiResponse.response.data.message;
    }
    const userID: string = localStorage.getItem('u') || '';
    CoreApiClient.postLog(pageUrl, apiUrl, method, error, message, userID);
    SwalUtil.alert(text[store.state.common.language].dialogTexts.PLEASE_TRY_AGAIN_AFTER_A_WHILE);
  }

  private getInformation(param: { whatText: string, locale: string }, successCallback: (response: any) => void): void {
    CoreApiClient.getInformation(param.whatText, param.locale).then((response: any) => {
      successCallback(response);
    }, (error: any) => {
      this.$emit('apierror', error, (errorResponse: any) => {
        if (this.isInfoNotFoundError(errorResponse)) {
          // information is none. Do nothing.
          const defaultObject: {} = { text: `<div style="font-size:1.3rem;font-family:SSTUI-Roman, sans-serif;color:#8C8C8C">There is nothing to display yet.</div>` };
          successCallback(defaultObject);
        } else {
          this.onUnexpectedError(errorResponse);
        }
      });
    });
  }

  private getProjectList(param: { userID: string }): Promise<any> {
    return new Promise((resolve: (res?: any) => void, reject: (res?: any) => void) => {
      CoreApiClient.getProjects(param.userID, '', '3', '', '', true).then((response: any) => {
        store.commit('setProjectForDashboard', response);
        resolve();
      }, (error: any) => {
        this.$emit('apierror', error);
      });
    });
  }

  private getJobHistory(param: { userID: string }): Promise<any> {
    return new Promise((resolve: (res?: any) => void, reject: (res?: any) => void) => {
      CoreApiClient.getJobHistory(param.userID, '', '', '-update_datetime', 3, 0).then((response: any) => {
        store.commit('setJobs', response);
        resolve();
      }, (error: any) => {
        this.$emit('apierror', error);
      });
    });
  }

  private drawJobProgressChart(index: number, epochCurrent: number, epochMax: number, status: string, type: string, deleted: boolean) {
    const elementId: string = 'job-history-progress-' + String(index);
    const element: any = document.getElementById(elementId) as HTMLCanvasElement;
    if (!element) {
      return;
    }
    const ctx: CanvasRenderingContext2D = element.getContext('2d');
    ctx.canvas.width = 24;
    ctx.canvas.height = 24;
    ChartUtil.drawJobProgressChart(ctx, epochCurrent, epochMax, status, type, deleted);
  }

  private getProjectLink(projectObj: any): string {
    const projectID: string = projectObj.project_id;
    return `./editor?project_id=${projectID}`;
  }

  private getJobLink(jobObj: any): string {
    let tab: string;
    if (jobObj.type) {
      tab = jobObj.type === 'evaluate' ? 'evaluation' : 'training';
    } else {
      tab = 'training';
    }
    const projectID: string = jobObj.projectId;
    const jobID: string = jobObj.jobId;
    return `./editor?tab=${tab}&project_id=${projectID}&job_id=${jobID}`;
  }

  private capitalize(str: string): string {
    switch (str) {
      case 'profile':
        return this.commonVueTexts.PROFILE;
      case 'train':
        return this.commonVueTexts.TRAIN;
      case 'evaluate':
        return this.commonVueTexts.EVALUATE;
      case 'queued':
        return this.commonVueTexts.jobStatus.QUEUED;
      case 'preprocessing':
        return this.commonVueTexts.jobStatus.PREPROCESSING;
      case 'processing':
        return this.commonVueTexts.jobStatus.PROCESSING;
      case 'finished':
        return this.commonVueTexts.jobStatus.FINISHED;
      case 'suspended':
        return this.commonVueTexts.jobStatus.SUSPENDED;
      case 'failed':
        return this.commonVueTexts.jobStatus.FAILED;
      default:
        return StringUtil.toUpperFirstLetter(str) || '-';
    }
  }

  private isExistsJobs(): boolean {
    if (!store.state.dashboard.jobs || store.state.dashboard.jobs.length <= 0) {
      return false;
    }
    return true;
  }

  private isExistsProjects(): boolean {
    if (!store.state.dashboard.projectList || store.state.dashboard.projectList.length <= 0) {
      return false;
    }
    return true;
  }

  get jobList(): {}[] {
    return store.state.dashboard.jobs.slice(0, 3);
  }

  get projectList(): any[] {
    return store.state.dashboard.projectList.slice(0, 3);
  }

  get infoText(): string {
    return store.state.dashboard.infoContent;
  }

  get supportContents(): ISupport[] {
    return store.state.dashboard.supportContents;
  }

  get supportContent(): string {
    const supportContents: ISupport[] = store.state.dashboard.supportContents;
    const supportContentsIndex: number = store.state.dashboard.supportContentsIndex;
    if (supportContents.length) {
      return supportContents[supportContentsIndex].text;
    } else {
      return '';
    }
  }

  get vueTexts(): TextType {
    return text[this.language].vueTexts.dashboard;
  }

  get commonVueTexts(): TextType {
    return text[this.language].vueTexts.common;
  }

  private resizeRightMenu(e: any): void {
    e.preventDefault();
    MenuResizeUtil.resize('right-menu-area', '', 'left-menu-border', false);
  }

  public isFailed(project: IProjectList): boolean {
    return project.status === 'failed' || project.import_status === 'failed' || project.import_sdcproj_status === 'failed';
  }

  public isImporting(project: IProjectList): boolean {
    return (
      project.import_status === 'ready' || project.import_status === 'processing' ||
      project.import_sdcproj_status === 'ready' || project.import_sdcproj_status === 'processing'
    );
  }

}
