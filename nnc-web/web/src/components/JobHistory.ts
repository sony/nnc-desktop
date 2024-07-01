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
import { Prop } from 'vue-property-decorator';
import store from '../store/index';
import {DateFormatUtil} from '../util/DateFormatUtil';
import router from '../router/index';
import {FileUtil} from '../util/FileUtil';
import {CoreApiClient} from '../CoreApiClient';
import {ConvertUtil} from '../util/ConvertUtil';
import {ChartUtil} from '../util/ChartUtil';
import {StringUtil} from '../util/StringUtil';
import {MenuResizeUtil} from '../util/MenuResizeUtil';
import {SwalUtil} from '../util/SwalUtil';
import { ITenantObj, IMemberObj } from '../store/state/tenant';
import TenantTabs from '../components/TenantTabs.vue';
import Loading2 from '../components/Loading.vue';
import {PAGES} from '../Const';
import text from '../messages/Text';
import { TextType } from '../interfaces/common';

@Component({
  name: 'JobHistory',
  components: {
    TenantTabs,
    Loading2
  }
})
export default class JobHistory extends Vue {
  @Prop() public language!: string;
  @Prop() public tenantList!: ITenantObj[];
  @Prop() public selectedTenantId!: string;
  @Prop() public hasShareTenant!: boolean;
  @Prop() public onClickTenantTab!: (tenantId: string) => void;
  @Prop() public isLocalTenant!: () => boolean;

  public mounted() {
    store.commit('hideAccountMenu');

    const userID: any = localStorage.getItem('u');
    Promise.all([
      this.getMiscPlans(),
      this.getAllTenantJobs(userID)
    ]);

    store.commit('selectComponent', PAGES.JOB_HISTORY);
    const jobHistoryArea: HTMLElement | null = document.getElementById('job-history-area');
    if (jobHistoryArea) {
      jobHistoryArea.onclick = (e: MouseEvent): void => {
        store.commit('hideAccountMenu');
      };
    }
  }

  public updated() {
    const jobHistories: any[] = this.getJobHistories();

    jobHistories.forEach((jobHistory: any, index: any) => {
      this.drawJobProgressChart(
        index,
        jobHistory.epochCurrent,
        jobHistory.epochMax,
        jobHistory.status,
        jobHistory.type,
        jobHistory.deleted
      );
    });
  }

  public isLoading(): boolean {
    return store.state.jobHistory.jobListLoading[this.selectedTenantId];
  }

  private getTenantJobs(userId: string, tenantId: string): Promise<any> {
    store.commit('showJobListLoading', tenantId);
    return new Promise((resolve: (res?: any) => void, reject: (res?: any) => void) => {
      const sortType: string = store.state.jobHistory.sort[tenantId];
      this.getJobs({userID: userId, tenantId: tenantId, sort_by: sortType}, (jobs: any) => {
        store.commit('clearJobs', tenantId);
        store.commit('addJobs', {tenantId, jobs});
        store.commit('hideJobListLoading', tenantId);
        resolve();
      });
    });
  }

  private getAllTenantJobs(userId: string): Promise<any> {
    const promiseList: Promise<any>[] = [];
    this.tenantList.forEach((tenant: ITenantObj) => {
      promiseList.push(this.getTenantJobs(userId, tenant.tenantId));
    });
    return Promise.all(promiseList);
  }

  private getJobHistories(): any[] {
    return store.state.jobHistory.jobs[this.selectedTenantId];
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

  get jobs(): {}[] {
    return store.state.jobHistory.jobs[this.selectedTenantId];
  }

  get total(): number {
    return store.state.jobHistory.total[this.selectedTenantId];
  }

  private getElapsedTime(elapsedTimeStr: string): string {
    return DateFormatUtil.getElapsedTime(elapsedTimeStr);
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

  private getJobs(param: {userID: string, offset?: number, limit?: number, tenantId: string, keyword?: string, sort_by?: string}, successCallback: (response: any) => void): void {
    CoreApiClient.getJobHistory(param.userID, param.tenantId, param.keyword, param.sort_by, param.limit, param.offset).then((response: any) => {
      successCallback(response);
    }, (error: any) => {
      this.$emit('apierror', error);
    });
  }

  private getMiscPlans(): Promise<any> {
    return new Promise((resolve: (res?: any) => void, reject: (res?: any) => void) => {
      if (store.state.jobHistory.plans.instances.length) {
        // Misc Planは一回しか叩かない
        resolve();
        return;
      }
      CoreApiClient.getMiscPlans().then((response: any) => {
        store.commit('setMiscPlans', response);
        resolve();
      }, (error: any) => {
        this.$emit('apierror', error);
      });
    });
  }

  private getProcessorTypeString(processorType: number): string {
    if (!processorType) {
      return '';
    }

    const locale: string = store.state.common.locale;
    const instances: any[] = store.state.jobHistory.plans.instances;
    for (let i: number = 0; i < instances.length; i++) {
      const instance: any = instances[i];
      if (processorType === instance.instanceType) {
        return instance.description[locale];
      }
    }
    return '';
  }

  /**
   * Price部に表示する文字列を取得します。
   * <br>
   * 無課金ユーザーの場合は "{その国の通貨記号} 0" を返却します。
   * 何らかの原因により計算できなかった場合は"N/A"を返却します。
   * Train中等、まだ経過時間等のデータがない場合は空文字を返却します。
   * @param processorType processorType値
   * @param elapsedTime 経過(使用)秒
   */
  private getPrice(processorType: number, elapsedTime: number): string {

    if (processorType === undefined || elapsedTime === undefined) {
      // Train中等、まだ情報がない場合
      return '';
    }

    const currencySymbol: string = this.getCurrencySymbol();
    const errorText: string = 'N/A';

    if (!currencySymbol) {
      // 基本ないはずだが通貨記号が取得できない場合
      return errorText;
    }

    if (!store.state.serviceSettings.charged[this.selectedTenantId]) {
      // 無課金ユーザーの場合
      return '0';
    }

    const locale: string = store.state.common.locale;
    const currencyRate: number = store.state.jobHistory.plans.currencyRate[locale];
    if (currencyRate === undefined) {
      // 通貨レートが取得できない場合
      return errorText;
    }

    const instances: any[] = store.state.jobHistory.plans.instances;
    for (let i: number = 0; i < instances.length; i++) {
      const instance: any = instances[i];
      if (processorType === instance.instanceType) {
        const instancePrice: number = instance.price;
        const price: number = this.calcPrice(elapsedTime, instancePrice);
        return ConvertUtil.convertPriceToDispPrice(price, currencyRate, locale);
      }
    }

    // マッチするインスタンスタイプの情報がない場合
    return errorText;
  }

  private shouldShowCurrencySymbol(processorType: number, elapsedTime: number): boolean {
    if (processorType === undefined || elapsedTime === undefined) {
      // Train中等、まだ情報がない場合
      return false;
    }

    const currencySymbol: string = this.getCurrencySymbol();

    if (!currencySymbol) {
      return false;
    }

    if (!store.state.serviceSettings.charged) {
      // 無課金ユーザーの場合
      return true;
    }

    const locale: string = store.state.common.locale;
    const currencyRate: number = store.state.jobHistory.plans.currencyRate[locale];
    if (currencyRate === undefined) {
      return false;
    }

    const instances: any[] = store.state.jobHistory.plans.instances;
    return instances.filter((instance: any) => (instance || {}).instanceType === processorType).length ? true : false;
  }

  /**
   * 入力値をもとに価格を算出します。
   * また、その際小数は切り上げます。
   * @param elapsedTime 経過(使用)秒
   * @param pricePerHour 時間当たりの価格
   */
  private calcPrice(elapsedTime: number, pricePerHour: number): number {
    return Math.ceil((elapsedTime / 3600) * pricePerHour);
  }

  private loadMoreJob(e: any): void {
    const scrollHeight: number = e.target.scrollHeight;
    const scrollTop: number = e.target.scrollTop;
    const scrollPosition: number = e.target.offsetHeight + scrollTop;

    const tenantId: string = this.selectedTenantId;
    const jobLength: number = store.state.jobHistory.jobs[tenantId].length;
    const jobTotal: number = store.state.jobHistory.total[tenantId];
    if ((scrollHeight - scrollPosition) / scrollHeight <= 0 && jobLength !== jobTotal) {
      const userID: string = store.state.common.userId;
      const offset: number = jobLength;
      const sortType: string = store.state.jobHistory.sort[tenantId];
      store.commit('showJobListLoading', tenantId);
      this.getJobs({userID, offset, sort_by: sortType, tenantId: tenantId}, (res: any) => {
        store.commit('addJobs', {tenantId: tenantId, jobs: res});
        store.commit('hideJobListLoading', tenantId);
      });
    }
  }

  private onChangeTab(tenantId: string): void {
    const JobHistoryScroll: any = document.getElementById('job-histroy-scroll');
    JobHistoryScroll.scrollTop = 0;
    this.onClickTenantTab(tenantId);
  }

  public capitalize(str: string): string {
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

  private getMember(ownerUserId: string): IMemberObj | undefined {
    if (!ownerUserId) {
      return;
    }
    const memberList: IMemberObj[] = store.state.tenant.memberList[this.selectedTenantId];
    if (!memberList.length) {
      return;
    }
    return memberList.find((member: IMemberObj) => member.userId === ownerUserId);
  }

  public isDeletedMember(ownerUserId: string): boolean {
    const member: IMemberObj | undefined = this.getMember(ownerUserId);
    if (!member) {
      return true;
    }
    return member.deleted;
  }

  public getOwnerName(ownerUserId: string): string {
    const member: IMemberObj | undefined = this.getMember(ownerUserId);
    if (!member) {
      return '';
    }
    return member.nickname || '';
  }

  /**
   * countryCodeに応じた通貨記号を返します。
   */
  private getCurrencySymbol(): string {
    const countryCode = store.state.common.countryCode;
    let currencyUnit: string = '';
    switch (countryCode) {
      case 'JP':
        currencyUnit = '&yen;';
        break;
      case 'US':
        currencyUnit = '$';
        break;
    }
    return currencyUnit;
  }

  public shouldShowIcon(icon: string, selected: boolean): boolean {
    if (!icon) {
      return false;
    }

    let order: string = '';
    let type: string = '';

    if (icon.indexOf('-') !== -1) {
      order = '-';
      type = icon.substr(1);
    } else {
      order = '+';
      type = icon.substr(1);
    }

    const sort: string = store.state.jobHistory.sort[this.selectedTenantId];
    const sortType = sort.substr(1);

    if (type === sortType) {
      return (icon === sort) && selected;
    } else {
      return order === '-' && !selected;
    }
  }

  public onClickSort(icon: string): void {
    if (!icon) {
      return;
    }

    let order: string = '';
    let type: string = '';

    if (icon.indexOf('-') !== -1) {
      order = '-';
      type = icon.substr(1);
    } else {
      order = '+';
      type = icon.substr(1);
    }

    const tenantId: string = this.selectedTenantId;

    const sort: string = store.state.jobHistory.sort[tenantId];

    if (icon === sort) {
      const nextOrder = order === '-' ? '+' : '-';
      store.commit('setSortType', {
        tenantId: tenantId,
        sortType: nextOrder + type
      });
    } else {
      store.commit('setSortType', {
        tenantId: tenantId,
        sortType: '-' + type
      });
    }

    if (!store.state.jobHistory.jobs[tenantId].length) {
      return;
    }

    const userId: string = store.state.common.userId;
    const sortType: string = store.state.jobHistory.sort[tenantId];

    store.commit('showJobListLoading', tenantId);
    this.getJobs({userID: userId, tenantId: tenantId, sort_by: sortType}, (jobs: any) => {
      store.commit('clearJobs', tenantId);
      store.commit('addJobs', {tenantId, jobs});
      store.commit('hideJobListLoading', tenantId);
    });
  }

  get vueTexts(): TextType {
    return text[this.language].vueTexts.jobHistory;
  }

  get commonVueTexts(): TextType {
    return text[this.language].vueTexts.common;
  }
}
