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
import AWS from 'aws-sdk';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import store from '../store/index';
import { MenuResizeUtil } from '../util/MenuResizeUtil';
import { ITenantObj } from '../store/state/tenant';
import { IInstance, IScript } from '../store/state/pipeline';
import { SwalUtil } from '../util/SwalUtil';
import { S3Util } from '../util/S3Util';
import { CoreApiClient, IDownloadResult, IGetUrlToUploadScript } from '../CoreApiClient';
import text from '../messages/Text';
import Overview from '../components/Overview/Overview.vue';
import Loading2 from '../components/Loading2.vue';
import TenantTabs from '../components/TenantTabs.vue';
import PipelineList from '../components/Parts/PipelineList.vue';
import PipelineRightPane from '../components/Parts/PipelineRightPane.vue';
import UploadDataSourceDialog from '../components/Dialog/UploadDataSource.vue';
import PipelineScriptDialog from '../components/Dialog/PipelineScript.vue';
import PipelineChangeDialog from '../components/Dialog/PipelineChange.vue';
import { PAGES } from '../Const';
import { TextType } from '../interfaces/common';
import { IDataSource, IDetailJob, IPipeline, IWorkflow, IWorkflowJob } from '../store/state/pipeline';

const POLLING_INTERVAL: number = 10 * 1000;

const uploadBucketRegion: string = 'us-west-2';

@Component({
  name: 'Pipeline',
  components: {
    PipelineList,
    PipelineRightPane,
    UploadDataSourceDialog,
    PipelineScriptDialog,
    PipelineChangeDialog,
    Overview,
    TenantTabs,
    Loading2
  }
})
export default class Pipeline extends Vue {
  @Prop() public language!: string;
  @Prop() public userId!: string;
  @Prop() public tenantList!: ITenantObj[];
  @Prop() public selectedTenantId!: string;
  @Prop() public hasShareTenant!: boolean;
  @Prop() public onClickTenantTab!: (tenantId: string) => void;
  @Prop() public isLocalTenant!: () => boolean;

  private pollingTimerIdForWorkflowJobs = NaN;
  private pollingTimerIdForWorkflowJob = NaN;
  private selectedWorkflowIdForDialog: string = '';
  public showUploadDataSourceDialog: boolean = false;
  public showPipelineScriptDialog: boolean = false;
  public showChangePipelineDialog: boolean = false;

  private clearAllTimer(): void {
    if (this.pollingTimerIdForWorkflowJobs) {
      clearTimeout(this.pollingTimerIdForWorkflowJobs);
    }
    if (this.pollingTimerIdForWorkflowJob) {
      clearTimeout(this.pollingTimerIdForWorkflowJob);
    }
  }

  public beforeDestroy() {
    this.clearAllTimer();
  }

  public mounted() {
    store.commit('hideAccountMenu');
    store.commit('selectComponent', PAGES.PIPELINE);
    this.tenantList.forEach((tenant: ITenantObj) => {
      store.commit('showPipelineListLoading', tenant.tenantId);
      this.getAll(tenant.tenantId).then(() => {
        store.commit('hidePipelineListLoading', tenant.tenantId);
      }, (error: any) => {
        this.$emit('apierror', error);
      });
    });
  }

  public async getAll(tenantId: string): Promise<void> {
    try {
      await Promise.all([
        this.getWorkflows(tenantId),
        this.getPipelines(tenantId)
      ]);
    } catch (e) {
      this.$emit('apierror', e);
    }
  }

  public async getWorkflows(tenantId: string): Promise<void> {
    const response: {workflows: IWorkflow[], nextPageToken: string}  = await CoreApiClient.getWorkflows(this.userId, tenantId);
    if (!response.workflows.length) {
      return;
    }

    let workflowList: IWorkflow[] = response.workflows.map((workflow: IWorkflow) => {
      return {
        ...this.getWorkflow(tenantId, workflow.id),
        ...workflow
      };
    });

    if (response.nextPageToken) {
      try {
        const nextWorkflowList: IWorkflow[] = await this.getWorkflowsWithNextPageToken(tenantId, response.nextPageToken);
        workflowList = workflowList.concat(nextWorkflowList);
      } catch (e) {
        this.$emit('apierror', e);
      }
    }

    store.commit('setWorkflowList', {tenantId, workflowList});
  }

  private async getWorkflowsWithNextPageToken(tenantId: string, nextPageToken: string, workflowList: IWorkflow[] = []): Promise<IWorkflow[]> {
    const response: {workflows: IWorkflow[], nextPageToken: string} = await CoreApiClient.getWorkflows(this.userId, tenantId, nextPageToken);

    workflowList = workflowList.concat(response.workflows.map((workflow: IWorkflow) => {
      return {
        ...this.getWorkflow(tenantId, workflow.id),
        ...workflow
      };
    }));

    if (response.nextPageToken) {
      return await this.getWorkflowsWithNextPageToken(tenantId, response.nextPageToken, workflowList);
    } else {
      return workflowList;
    }
  }

  public async getPipelines(tenantId: string): Promise<void> {
    const response: {pipelines: IPipeline[], nextPageToken: string}  = await CoreApiClient.getPipelines(this.userId, tenantId);
    if (!response.pipelines.length) {
      return;
    }

    let pipelineList: IPipeline[] = response.pipelines.map((pipeline: IPipeline) => {
      return {
        ...this.getPipeline(tenantId, pipeline.id),
        ...pipeline
      };
    });

    if (response.nextPageToken) {
      try {
        const nextPipelineList: IPipeline[] = await this.getPipelinesWithNextPageToken(tenantId, response.nextPageToken);
        pipelineList = pipelineList.concat(nextPipelineList);
      } catch (e) {
        this.$emit('apierror', e);
      }
    }

    store.commit('setPipelineList', {tenantId, pipelineList});
  }

  public async getPipelinesWithNextPageToken(tenantId: string, nextPageToken: string, pipelineList: IPipeline[] = []): Promise<IPipeline[]> {
    const response: {pipelines: IPipeline[], nextPageToken: string}  = await CoreApiClient.getPipelines(this.userId, tenantId, nextPageToken);

    pipelineList = pipelineList.concat(response.pipelines.map((pipeline: IPipeline) => {
      return {
        ...this.getPipeline(tenantId, pipeline.id),
        ...pipeline
      };
    }));

    if (response.nextPageToken) {
      return await this.getPipelinesWithNextPageToken(tenantId, response.nextPageToken, pipelineList);
    } else {
      return pipelineList;
    }
  }

  public async showDetail(workflowJob: IWorkflowJob): Promise<void> {
    const tenantId: string = this.selectedTenantId;
    const {workflowId, jobId} = workflowJob;
    if (this.selectedWorkflowJobId !== jobId) {
      // 詳細の初期化
      store.commit('setDetailWorkflowJob', {tenantId, detailWorkflowJob: {}});
      if (this.pollingTimerIdForWorkflowJob) {
        clearTimeout(this.pollingTimerIdForWorkflowJob);
      }
    }
    try {
      store.commit('showPipelineRightPaneLoading', tenantId);
      store.commit('selectWorkflowJobId', {tenantId, workflowJobId: jobId});
      await this.getWorkflowJob(tenantId, workflowId, jobId);
      this.setPollingForWorkflowJob();
    } catch (e) {
      this.$emit('apierror', e);
    } finally {
      store.commit('hidePipelineRightPaneLoading', tenantId);
    }
  }

  private setPollingForWorkflowJob(): void {
    const tenantId: string = this.selectedTenantId;
    const workflowId: string = this.selectedWorkflowId;
    const jobId: string = this.selectedWorkflowJobId;
    if (this.isRunningJob()) {
      if (this.pollingTimerIdForWorkflowJob) {
        clearTimeout(this.pollingTimerIdForWorkflowJob);
      }
      this.pollingTimerIdForWorkflowJob = setTimeout(async () => {
        try {
          await this.getWorkflowJob(tenantId, workflowId, jobId);
        } catch (e) {
          // do nothing
        }
        this.setPollingForWorkflowJob();
      }, POLLING_INTERVAL);
    }
  }

  private async getWorkflowJob(tenantId: string, workflowId: string, jobId: string): Promise<void> {
    const response: IDetailJob  = await CoreApiClient.getWorkflowJob(this.userId, tenantId, workflowId, jobId);
    if (workflowId === this.selectedWorkflowId && jobId === this.selectedWorkflowJobId) {
      store.commit('setDetailWorkflowJob', {tenantId, detailWorkflowJob: response});
    }
  }

  public onClickPage(): void {
    const actionList: HTMLElement | null = document.getElementById('action-list');
    if (actionList) {
      actionList.style.display = 'none';
    }
    store.commit('hideAccountMenu');
  }

  public onClickAction(): void {
    const actionList: HTMLElement | null = document.getElementById('action-list');
    const textElement: HTMLElement | null = document.getElementById('action-text');
    if (!actionList || !textElement) {
      return;
    }
    actionList.style.display = actionList.style.display !== 'block' ? 'block' : 'none';
    const textTop = textElement.getBoundingClientRect().top;
    const textLeft = textElement.getBoundingClientRect().left;
    const textHeight = textElement.clientHeight;
    actionList.style.top = (textTop + textHeight).toString() + 'px';
    const leftMenuWidth: number = (document.getElementById('menu-container') || {clientWidth: 0}).clientWidth;
    actionList.style.left = (textLeft - leftMenuWidth) + 'px';
  }

  public onChangeTab(tenantId: string): void {
    this.clearAllTimer();
    this.onClickTenantTab(tenantId);
    Vue.nextTick(() => {
      this.setPollingForWorkflowJobs();
      this.setPollingForWorkflowJob();
    });
  }

  public resizeRightMenu(): void {
    MenuResizeUtil.resize('pipeline-details', '', 'left-menu-border', false);
  }

  public selectCheckbox(checkInfo: {id: string, checked: boolean}): void {
    store.commit('setCheckedForPipeline', {...checkInfo, tenantId: this.selectedTenantId});
  }

  public selectCheckboxAll(checked: boolean): void {
    store.commit('setAllCheckedForPipeline', {checked, tenantId: this.selectedTenantId});
  }

  public async select(workflowId: string): Promise<void> {
    const tenantId: string = this.selectedTenantId;
    if (this.selectedWorkflowId !== workflowId) {
      // 右ペインの初期化
      store.commit('setWorkflowJobs', {tenantId, workflowJobList: []});
      store.commit('selectWorkflowJobId', {tenantId, workflowJobId: ''});
      store.commit('setDetailWorkflowJob', {tenantId, detailWorkflowJob: {}});
      this.clearAllTimer();
    }
    store.commit('selectWorkflow', {tenantId, workflowId});
    store.commit('showPipelineRightPaneLoading', tenantId);
    try {
      await this.getWorkflowJobs(tenantId, workflowId);
      this.setPollingForWorkflowJobs();
    } catch (e) {
      this.$emit('apierror', e);
    } finally {
      store.commit('hidePipelineRightPaneLoading', tenantId);
    }
  }

  private isRunningJobs(): boolean {
    return this.workflowJobList.some((workflowJob: IWorkflowJob) => (workflowJob.status !== 'finished') && (workflowJob.status !== 'failed') && (workflowJob.status !== 'suspended'));
  }

  private isRunningJob(): boolean {
    if (this.isRunningJobs()) {
      return !!this.selectedWorkflowJobId;
    } else {
      const workflowJob: IWorkflowJob | undefined = this.workflowJobList.find((_workflowJob: IWorkflowJob) => _workflowJob.jobId === this.selectedWorkflowJobId);
      if (workflowJob) {
        return (workflowJob.status !== 'finished') && (workflowJob.status !== 'failed') && (workflowJob.status !== 'suspended');
      } else {
        return false;
      }
    }
  }

  private setPollingForWorkflowJobs(): void {
    const tenantId: string = this.selectedTenantId;
    const workflowId: string = this.selectedWorkflowId;
    if (this.isRunningJobs()) {
      if (this.pollingTimerIdForWorkflowJobs) {
        clearTimeout(this.pollingTimerIdForWorkflowJobs);
      }
      this.pollingTimerIdForWorkflowJobs = setTimeout(async () => {
        try {
          await this.getWorkflowJobs(tenantId, workflowId);
        } catch (e) {
          // do nothing.
        }
        this.setPollingForWorkflowJobs();
      }, POLLING_INTERVAL);
    }
  }

  private async getWorkflowJobs(tenantId: string, workflowId: string): Promise<void> {
    const response: {jobs: IWorkflowJob[], nextPageToken: string} = await CoreApiClient.getWorkflowJobs(this.userId, tenantId, workflowId);

    let jobs: IWorkflowJob[] = response.jobs;

    if (response.nextPageToken) {
      try {
        const nextJobs: IWorkflowJob[] = await this.getWorkflowJobsWithNextPageToken(tenantId, workflowId, response.nextPageToken);
        jobs = jobs.concat(nextJobs);
      } catch (e) {
        this.$emit('apierror', e);
      }
    }
    if (workflowId === this.selectedWorkflowId) {
      // 選択されていない場合のみセットする
      store.commit('setWorkflowJobs', {tenantId, workflowJobList: response.jobs});
    }
  }

  private async getWorkflowJobsWithNextPageToken(tenantId: string, workflowId: string, nextPageToken: string, jobs: IWorkflowJob[] = []): Promise<IWorkflowJob[]> {
    const response: {jobs: IWorkflowJob[], nextPageToken: string} = await CoreApiClient.getWorkflowJobs(this.userId, tenantId, workflowId, nextPageToken);

    jobs = jobs.concat(response.jobs);

    if (response.nextPageToken) {
      return await this.getWorkflowJobsWithNextPageToken(tenantId, workflowId, response.nextPageToken, jobs);
    } else {
      return jobs;
    }
  }

  public async updateTrigger(dataSourceList: IDataSource[]): Promise<void> {
    const currentTriggerList: boolean[] = this.dataSourceList.map((_data: IDataSource) => _data.trigger);
    const afterTriggerList: boolean[] = dataSourceList.map((_data: IDataSource) => _data.trigger);
    this.showUploadDataSourceDialog = false;

    // 変更がなかった場合
    if (currentTriggerList.toString() === afterTriggerList.toString()) {
      this.selectedWorkflowIdForDialog = '';
      return;
    }
    const tenantId: string = this.selectedTenantId;
    const workflow: IWorkflow = this.getWorkflow(tenantId, this.selectedWorkflowIdForDialog);
    const newWorkflow: IWorkflow = {
      ...workflow,
      dataSources: dataSourceList
    };
    try {
      store.commit('showPipelineListLoading', tenantId);
      await CoreApiClient.updateWorkflow(this.userId, tenantId, newWorkflow);
      store.commit('updateWorkflow', {tenantId, workflow: newWorkflow});
    } catch (e) {
      this.$emit('apierror', e);
    } finally {
      store.commit('hidePipelineListLoading', tenantId);
      this.selectedWorkflowIdForDialog = '';
    }
  }

  public showErrorMsg(errorDetails: {cause: string, message: string}): void {
    const message: string = `cause:\n${errorDetails.cause}\n\nmessage:\n${errorDetails.message}`;
    SwalUtil.alert(message);
  }

  public async suspend(): Promise<void> {
    const tenantId: string = this.selectedTenantId;
    const workflowId: string = this.selectedWorkflowId;
    const jobId: string = this.selectedWorkflowJobId;
    store.commit('showPipelineRightPaneLoading', tenantId);
    try {
      await CoreApiClient.suspendWorkflowJob(this.userId, tenantId, workflowId, jobId);
      await this.getWorkflowJobs(tenantId, workflowId);
      await this.getWorkflowJob(tenantId, workflowId, jobId);
      this.setPollingForWorkflowJobs();
      this.setPollingForWorkflowJob();
    } catch (e) {
      this.$emit('apierror', e);
    } finally {
      store.commit('hidePipelineRightPaneLoading', tenantId);
    }
  }

  public async resume(): Promise<void> {
    const tenantId: string = this.selectedTenantId;
    const workflowId: string = this.selectedWorkflowId;
    const jobId: string = this.selectedWorkflowJobId;
    store.commit('showPipelineRightPaneLoading', tenantId);
    try {
      await CoreApiClient.resumeWorkflowJob(this.userId, tenantId, workflowId, jobId);
      await this.getWorkflowJobs(tenantId, workflowId);
      await this.getWorkflowJob(tenantId, workflowId, jobId);
      this.setPollingForWorkflowJobs();
      this.setPollingForWorkflowJob();
    } catch (e) {
      this.$emit('apierror', e);
    } finally {
      store.commit('hidePipelineRightPaneLoading', tenantId);
    }
  }

  public async download(): Promise<void> {
    const tenantId: string = this.selectedTenantId;
    const workflowId: string = this.selectedWorkflowId;
    const workflowJobId: string = this.selectedWorkflowJobId;
    try {
      store.commit('showPipelineRightPaneLoading', tenantId);
      const response: {files: IDownloadResult[]} = await CoreApiClient.downloadResults(this.userId, tenantId, workflowId, workflowJobId);
      response.files.filter((file: IDownloadResult) => !file.error).forEach((file: IDownloadResult) => {
        window.open(file.url, '_blank');
      });

      const errorResults: IDownloadResult[] = response.files.filter((file: IDownloadResult) => !!file.error);
      if (errorResults.length) {
        this.showDownloadResultError(errorResults);
      }
    } catch (e) {
      this.$emit('apierror', e);
    } finally {
      store.commit('hidePipelineRightPaneLoading', tenantId);
    }
  }

  private showDownloadResultError(errorDetails: IDownloadResult[]): void {
    let message: string = `${this.vueTexts.DOWNLOAD_FAILED}\n\n`;
    errorDetails.forEach((errorDetail: IDownloadResult) => {
      message += `${this.vueTexts.FILE_NAME}: ${errorDetail.name}\n${this.vueTexts.ERROR}: ${errorDetail.error}\n\n`;
    });
    SwalUtil.alert(message);
  }

  public async downloadScript(scriptId: string): Promise<void> {
    const tenantId: string = this.selectedTenantId;
    try {
      const response: {downloadUrl: string} = await CoreApiClient.downloadScript(this.userId, tenantId, scriptId);
      window.open(response.downloadUrl, '_blank');
    } catch (e) {
      this.$emit('apierror', e);
    }
  }

  public async onClickRenameIcon(workflowId: string): Promise<void> {
    const tenantId: string = this.selectedTenantId;
    try {
      this.selectedWorkflowIdForDialog = workflowId;
      store.commit('showPipelineListLoading', tenantId);
      if (!this.trainInstance.length || !this.evaluateInstance.length) {
        const response: {train: IInstance[], evaluate: IInstance[]} = await CoreApiClient.getAvailableInstance(this.userId, tenantId);
        store.commit('setAvailableInstance', {
          tenantId,
          ...response
        });
      }
    } catch (e) {
      this.$emit('apierror', e);
      store.commit('hidePipelineListLoading', tenantId);
      return;
    }
    store.commit('hidePipelineListLoading', tenantId);
    this.showChangePipelineDialog = true;
  }

  public async changePipeline(params: {name: string, isSendMail: boolean, trainInstance: number, evaluateInstance: number}): Promise<void> {
    const tenantId: string = this.selectedTenantId;
    const promiseList: Promise<void>[] = [];
    this.showChangePipelineDialog = false;
    store.commit('showPipelineListLoading', tenantId);
    const workflow: IWorkflow = this.getWorkflow(tenantId, this.selectedWorkflowIdForDialog);
    const newWorkflow: IWorkflow = {
      ...workflow,
        name: params.name,
        isSendMail: params.isSendMail
    };
    if (params.name !== workflow.name || params.isSendMail !== workflow.isSendMail) {
      promiseList.push(CoreApiClient.updateWorkflow(this.userId, tenantId, newWorkflow));
    }
    const pipelineInfo: IPipeline = this.getPipeline(this.selectedTenantId, workflow.pipelineIds[0]);
    const newPipelineInfo: IPipeline = {
      ...pipelineInfo,
      name: params.name,
      trainInstance: params.trainInstance,
      evaluateInstance: params.evaluateInstance
    };
    if (params.name !== pipelineInfo.name || params.trainInstance !== pipelineInfo.trainInstance || params.evaluateInstance !== pipelineInfo.evaluateInstance) {
      promiseList.push(CoreApiClient.updatePipeline(this.userId, tenantId, newPipelineInfo));
    }
    try {
      await Promise.all(promiseList);

      store.commit('updatePipeline', {tenantId, pipeline: newPipelineInfo});
      store.commit('updateWorkflow', {tenantId, workflow: newWorkflow});
    } catch (e) {
      this.$emit('apierror', e);
    } finally {
      store.commit('hidePipelineListLoading', tenantId);
      this.selectedWorkflowIdForDialog = '';
    }

  }

  public hideChangePipelineDialog(): void {
    this.showChangePipelineDialog = false;
  }

  public inputWorkflowName(renameInfo: {id: string, value: string}): void {
    store.commit('inputWorkflowName', {
      tenantId: this.selectedTenantId,
      id: renameInfo.id,
      name: renameInfo.value
    });
  }

  public onClickDatasource(workflowId: string): void {
    this.selectedWorkflowIdForDialog = workflowId;
    this.showUploadDataSourceDialog = true;
  }

  public async onClickScript(workflowId: string): Promise<void> {
    this.selectedWorkflowIdForDialog = workflowId;
    const tenantId: string = this.selectedTenantId;
    try {
      store.commit('showPipelineListLoading', tenantId);
      await this.getScripts(tenantId);
      this.showPipelineScriptDialog = true;
    } catch (e) {
      this.$emit('apierror', e);
    } finally {
      store.commit('hidePipelineListLoading', tenantId);
    }
  }

  private async getScripts(tenantId: string): Promise<void> {
    const response: {scripts: IScript[], nextPageToken: string} = await CoreApiClient.getScripts(this.userId, tenantId);

    let scripts: IScript[] = response.scripts;

    if (response.nextPageToken) {
      try {
        const nextScripts: IScript[] = await this.getScriptsWithNextPageToken(tenantId, response.nextPageToken);
        scripts = scripts.concat(nextScripts);
      } catch (e) {
        this.$emit('apierror', e);
      }
    }

    store.commit('setScripts', response.scripts);
  }

  private async getScriptsWithNextPageToken(tenantId: string, nextPageToken: string, scripts: IScript[] = []): Promise<IScript[]> {
    const response: {scripts: IScript[], nextPageToken: string} = await CoreApiClient.getScripts(this.userId, tenantId, nextPageToken);

    scripts = scripts.concat(response.scripts);

    if (response.nextPageToken) {
      return await this.getScriptsWithNextPageToken(tenantId, response.nextPageToken, scripts);
    } else {
      return scripts;
    }
  }

  public deleteWorkflow(workflowId: string): void {
    const tenantId: string = this.selectedTenantId;
    const workflow: IWorkflow = this.getWorkflow(tenantId, workflowId);
    if (!workflow.id) {
      return;
    }
    const message: string = workflow.name + this.dialogTexts.WILL_BE_DELETE;
    SwalUtil.confirm(message, () => {
      this.executeDelete([workflowId]);
    });
  }

  public deleteAll(): void {
    if (!this.checked()) {
      return;
    }
    const message: string =  this.dialogTexts.DELETE_ALL_WORKFLOW;
    SwalUtil.confirm(message, () => {
      const classifierIdList: string[] = this.workflowList.filter((_workflow: IWorkflow) => _workflow.checked).map((_workflow: IWorkflow) => _workflow.id);
      this.executeDelete(classifierIdList);
    });
  }

  private async executeDelete(workflowIdList: string[]): Promise<void> {
    const tenantId: string =  this.selectedTenantId;
    const pipelineIds: string[] = workflowIdList.map((workflowId: string) => {
      const workflow: IWorkflow = this.getWorkflow(tenantId, workflowId);
      return workflow.pipelineIds ? workflow.pipelineIds[0] : '';
    }).filter((pipelineId: string) => !!pipelineId);
    const promiseList: Promise<void>[] = [];
    workflowIdList.forEach((workflowId: string) => {
      promiseList.push(CoreApiClient.deleteWorkflow(this.userId, tenantId, workflowId));
    });
    pipelineIds.forEach((pipelineId: string) => {
      promiseList.push(CoreApiClient.deletePipeline(this.userId, tenantId, pipelineId));
    });
    try {
      store.commit('showPipelineListLoading', tenantId);
      await Promise.all(promiseList);
      await this.getAll(tenantId);
    } catch (error) {
      this.$emit('apierror', error);
    } finally {
      store.commit('hidePipelineListLoading', tenantId);
    }
  }

  public checked(): boolean {
    return this.workflowList.some((_workflow: IWorkflow) => !!_workflow.checked);
  }

  public hideUploadDataSourceDialog(): void {
    this.selectedWorkflowIdForDialog = '';
    this.showUploadDataSourceDialog = false;
  }

  private async uploadScript(accessKeyId: string, secretAccessKey: string, sessionToken: string, uploadPath: string, file: File, isPreProcess: boolean): Promise<{}> {
    return new Promise((resolve: () => void, reject: () => void) => {
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
        ContentType : file.type
      };

      S3Util.uploadMultiPart(s3, s3Params, file, (_progress: number) => {
        // do nothing.
      }, resolve, reject);

    });
  }

  public async updateScript(event: {preProcess: File, postProcess: File, preProcessScriptId: string, postProcessScriptId: string, fileName: string[]}): Promise<void> {
    let {preProcessScriptId, postProcessScriptId} = event;
    const {preProcess, postProcess, fileName} = event;
    const tenantId: string = this.selectedTenantId;

    this.showPipelineScriptDialog = false;
    store.commit('showPipelineListLoading', tenantId);
    const promiseList: Promise<{}>[] = [];
    if (preProcess.size) {
      let response: IGetUrlToUploadScript;
      try {
        if (preProcessScriptId) {
          response = await CoreApiClient.updateScript(this.userId, tenantId, preProcessScriptId);
        } else {
          response = await CoreApiClient.createScript(this.userId, tenantId, true);
        }
        preProcessScriptId = response.scriptId;
        promiseList.push(this.uploadScript(response.accessKeyId, response.secretAccessKey, response.sessionToken, response.uploadUrl, preProcess, true));
      } catch (e) {
        this.$emit('apierror', e);
        store.commit('hidePipelineListLoading', tenantId);
      }
    }

    if (postProcess.size) {
      let response: IGetUrlToUploadScript;
      try {
        if (postProcessScriptId) {
          response = await CoreApiClient.updateScript(this.userId, tenantId, postProcessScriptId);
        } else {
          response = await CoreApiClient.createScript(this.userId, tenantId, false);
        }
        postProcessScriptId = response.scriptId;
        promiseList.push(this.uploadScript(response.accessKeyId, response.secretAccessKey, response.sessionToken, response.uploadUrl, postProcess, false));
      } catch (e) {
        this.$emit('apierror', e);
        store.commit('hidePipelineListLoading', tenantId);
      }
    }

    try {
      await Promise.all(promiseList);
    } catch (e) {
      SwalUtil.alert(this.dialogTexts.SCRIPT_UPLOAD_FAILED);
      store.commit('hidePipelineListLoading', tenantId);
      return;
    }

    if (
      this.pipeline.resultFiles.toString() !== fileName.toString() ||
      this.pipeline.preProcessScriptId !== preProcessScriptId ||
      this.pipeline.postProcessScriptId !== postProcessScriptId
    ) {
      try {
        const newPipelineInfo: IPipeline = {
          ...this.pipeline,
          resultFiles: fileName,
          preProcessScriptId,
          postProcessScriptId
        };
        await CoreApiClient.updatePipeline(this.userId, tenantId, newPipelineInfo);
        store.commit('updatePipeline', {tenantId, pipeline: newPipelineInfo});
      } catch (e) {
        this.$emit('apierror', e);
      }
    }
    store.commit('hidePipelineListLoading', tenantId);
    this.selectedWorkflowIdForDialog = '';
  }

  public hidePipelineScriptDialog(): void {
    this.selectedWorkflowIdForDialog = '';
    this.showPipelineScriptDialog = false;
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
    CoreApiClient.postLog(pageUrl, apiUrl, method, error, message, this.userId);
    SwalUtil.alert(text[this.language].dialogTexts.AN_UNEXPECTED_ERROR_OCCURED);
  }

  private getWorkflow(tenantId: string, id: string): IWorkflow {
    return store.state.pipeline.workflowList[tenantId].find((workflow: IWorkflow) => workflow.id === id) || {} as IWorkflow;
  }

  private getPipeline(tenantId: string, id: string): IPipeline {
    return store.state.pipeline.pipelineList[tenantId].find((pipeline: IPipeline) => pipeline.id === id) || {} as IPipeline;
  }

  get workflowList(): IWorkflow[] {
    return store.state.pipeline.workflowList[this.selectedTenantId];
  }

  get pipelineList(): IPipeline[] {
    return store.state.pipeline.pipelineList[this.selectedTenantId];
  }

  get dataSourceList(): IDataSource[] {
    return this.getWorkflow(this.selectedTenantId, this.selectedWorkflowIdForDialog).dataSources || [];
  }

  get workflowInfo(): {name: string, trainInstanceType: number, evaluateInstanceType: number, isSendMail: boolean, pipelineId: string} {
    const tenantId: string = this.selectedTenantId;
    const workflow: IWorkflow = this.getWorkflow(tenantId, this.selectedWorkflowIdForDialog);
    const pipelineId: string = workflow.pipelineIds[0];
    const pipeline: IPipeline = this.getPipeline(tenantId, pipelineId);

    return {
      name: pipeline.name,
      trainInstanceType: pipeline.trainInstance,
      evaluateInstanceType: pipeline.evaluateInstance,
      isSendMail: workflow.isSendMail,
      pipelineId
    };
  }

  get pipeline(): IPipeline {
    const tenantId: string = this.selectedTenantId;
    const workflow: IWorkflow = this.getWorkflow(tenantId, this.selectedWorkflowIdForDialog);
    const pipelineId: string = workflow.pipelineIds ? workflow.pipelineIds[0] : '';
    return this.getPipeline(tenantId, pipelineId);
  }

  get workflowJobList(): IWorkflowJob[] {
    return store.state.pipeline.workflowJobList[this.selectedTenantId];
  }

  get detailWorkflowJob(): IDetailJob & {jobsStatus: string} {
    const detailWorkflowJob: IDetailJob = store.state.pipeline.detailWorkflowJob[this.selectedTenantId];
    const workflowJob: IWorkflowJob | undefined = this.workflowJobList.find((_workflowJob: IWorkflowJob) => _workflowJob.jobId === this.selectedWorkflowJobId);
    return {
      ...detailWorkflowJob,
      jobsStatus: workflowJob ? workflowJob.status : ''
    };
  }

  get selectedWorkflowId(): string {
    return store.state.pipeline.selectedWorkflowId[this.selectedTenantId];
  }

  get selectedWorkflowJobId(): string {
    return store.state.pipeline.selectedWorkflowJobId[this.selectedTenantId];
  }

  get resultFiles(): string[] {
    return this.pipeline.resultFiles;
  }

  get scripts(): IScript[] {
    return store.state.pipeline.scripts;
  }

  get vueTexts(): TextType {
    return text[this.language].vueTexts.pipeline;
  }

  get dialogTexts(): TextType {
    return text[this.language].dialogTexts;
  }

  get isPipelineListLoading(): boolean {
    return store.state.pipeline.isLoading[this.selectedTenantId];
  }

  get isLoadingRightPane(): boolean {
    return store.state.pipeline.isLoadingRightPane[this.selectedTenantId];
  }

  get trainInstance(): IInstance[] {
    return store.state.pipeline.trainAvailableInstance[this.selectedTenantId];
  }

  get evaluateInstance(): IInstance[] {
    return store.state.pipeline.evaluateAvailableInstance[this.selectedTenantId];
  }

}
