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
import router from '../router/index';
import {FileUtil} from '../util/FileUtil';
import {CoreApiClient} from '../CoreApiClient';
import {ChartUtil} from '../util/ChartUtil';
import {StringUtil} from '../util/StringUtil';
import {MenuResizeUtil} from '../util/MenuResizeUtil';
import {SwalUtil} from '../util/SwalUtil';
import {ResourceInfoUtil} from '../util/ResourceInfoUtil';
import { Watch } from 'vue-property-decorator';
import { ITenantObj, IMemberObj } from '../store/state/tenant';
import { IProjectList, ILabel, IAllLabel, ISampleProjectList } from '../store/state/project';
import Overview from '../components/Overview/Overview.vue';
import LabelDialog from '../components/Dialog/Label.vue';
import UploadProjectDialog from '../components/Dialog/UploadProject.vue';
import Loading2 from '../components/Loading2.vue';
import TenantTabs from '../components/TenantTabs.vue';
import {ADMIN_ROLE, OWNER_ROLE} from '../interfaces/core-response/IServiceSettings';
import {ICoreProjects, IProject, ISampleProject, ICoreConfiguration, ICoreSampleProject} from '../interfaces/core-response/IProject';
import text from '../messages/Text';
import {CONFIGURATION_FORMAT, PAGES, SELECTOPTIONS, STORAGE_UNIT_BORDER} from '../Const';
import { ConvertUtil } from '../util/ConvertUtil';
import { TextType } from '../interfaces/common';

const POLLING_INTERVAL: number = 15 * 1000;
// 一度に取得するプロジェクト数
const GET_PROJECTS_NUM: number = 10;

@Component({
  name: 'Project',
  components: {
    TenantTabs,
    Overview,
    LabelDialog,
    UploadProjectDialog,
    Loading2
  }
})
export default class Project extends Vue {
  @Prop() public language!: string;
  @Prop() public userId!: string;
  @Prop() public tenantList!: ITenantObj[];
  @Prop() public selectedTenantId!: string;
  @Prop() public hasShareTenant!: boolean;
  @Prop() public onClickTenantTab!: (tenantId: string) => void;
  @Prop() public isLocalTenant!: () => boolean;

  private getTenantProjects(userId: string, tenantId: string): Promise<any> {
    store.commit('showProjectListLoading', tenantId);
    return new Promise((resolve: (res?: any) => void, reject: (res?: any) => void) => {
      const limit = String(GET_PROJECTS_NUM);
      this.getProjects({userID: userId, tenantId: tenantId, limit: limit}, (projects: ICoreProjects) => {
        store.commit('setProject', {tenantId, projects});
        const allLabels: string[] = this.createAllLabels(projects.projects);
        store.commit('setAllLabels', {tenantId: tenantId, allLabels: allLabels});
        const filteredTenant: ITenantObj | undefined = store.state.tenant.tenantList.find((tenant: ITenantObj) => tenant.tenantId === tenantId);
        if (filteredTenant) {
          const selectOptionLabels: string[] = this.createSelectOptionLabels(projects.projects, filteredTenant.isLocal);
          store.commit('setSelectOptionlabels', {tenantId: tenantId, selectOptionLabels: selectOptionLabels});
        }
        if (projects.metadata.total > Number(limit)) {
          this.getProjectByParallel(tenantId, projects.metadata.total);
        }
        store.commit('hideProjectListLoading', tenantId);
        resolve();
      });
    });
  }

  private createAllLabels(projects: IProject[]): string[] {
    const allLabels: any[] = [];
    projects.forEach((project: IProject) => {
      project.labels.forEach(label => {
        if (allLabels.findIndex(labelInAll => labelInAll.labelName === label) === -1) {
          allLabels.push({labelName: label, checked: false});
        }
      });
    });
    return allLabels;
  }

  private createSelectOptionLabels(projects: IProject[], isLocal: boolean): string[] {
    const selectOptionLabels: string[] = [];
    selectOptionLabels.push(this.commonVueTexts.ALL);
    projects.forEach((project: IProject) => {
      if (selectOptionLabels.indexOf(project.owner_user_id) === -1 && !isLocal) {
        selectOptionLabels.push(project.owner_user_id);
      }
    });
    projects.forEach((project: IProject) => {
      project.labels.forEach((label) => {
        if (selectOptionLabels.indexOf(label) === -1) {
          selectOptionLabels.push(label);
        }
      });
    });
    return selectOptionLabels;
  }

  private getAllTenantProjects(): Promise<any> {
    const promiseList: Promise<any>[] = [];
    this.tenantList.forEach((tenant: ITenantObj) => {
      promiseList.push(this.getTenantProjects(this.userId, tenant.tenantId));
    });
    return Promise.all(promiseList);
  }

  @Watch('$route')
  public onRouteChange(newValue: any, oldVlaue: any): void {
    const PROJECT_PATH: string = '/project';
    if (oldVlaue.path !== PROJECT_PATH || newValue.path !== PROJECT_PATH) {
      return;
    }
    if (!oldVlaue.query.project_id && newValue.query.project_id) {
      const projectIdInParam: string = newValue.query.project_id;
      if (projectIdInParam) {
        if (this.isSampleProject(projectIdInParam)) {
          const projectName: string = this.findSampleProjectNameByProjectId(projectIdInParam);
          this.onClickSampleProject(projectIdInParam, projectName);
          store.commit('setProjectIdFromUrl', '');
        } else {
          if (this.isNumber(projectIdInParam)) {
            CoreApiClient.getProject(this.userId, projectIdInParam).then((response: any) => {
              const isPublic: boolean = true;
              this.onClickCopy(projectIdInParam, response.project_name, isPublic);
              store.commit('setProjectIdFromUrl', '');
            }, () => {
              this.onInvalidProjectIdError();
            });
          } else {
            this.onInvalidProjectIdError();
          }
        }
      }
    }
  }

  private isNumber(str: string): boolean {
    const regExp: RegExp = /^\d*$/;
    return regExp.test(str);
  }

  public mounted() {
    window.lockedAuthAPI = false;
    store.commit('hideAccountMenu');
    const defaultRightWidth: number = 280;
    store.commit('setProjectRightWidth', defaultRightWidth);
    this.tenantList.forEach((tenant: ITenantObj) => {
      store.commit('setKeyword', {tenantId: tenant.tenantId, keyword: ''});
      store.commit('setSelectedLabel', {tenantId: tenant.tenantId, selectedLabel: this.commonVueTexts.ALL});
      store.commit('setCurrentSort', {tenantId: tenant.tenantId, currentSort: '-create_datetime'});
    });
    Promise.all([
      this.getAllTenantProjects(),
      this.getSampleProjects()
    ]).then(() => {
      this.setPollingForProject(store.state.project.projectList[this.selectedTenantId], this.selectedTenantId);
      const projectIdInParam: string = store.state.common.projectIdFromUrl;
      if (projectIdInParam) {
        if (this.isSampleProject(projectIdInParam)) {
          const projectName: string = this.findSampleProjectNameByProjectId(projectIdInParam);
          this.onClickSampleProject(projectIdInParam, projectName);
          store.commit('setProjectIdFromUrl', '');
        } else {
          if (this.isNumber(projectIdInParam)) {
            CoreApiClient.getProject(this.userId, projectIdInParam).then((response: any) => {
              const isPublic: boolean = true;
              this.onClickCopy(projectIdInParam, response.project_name, isPublic);
              store.commit('setProjectIdFromUrl', '');
            }, () => {
              this.onInvalidProjectIdError();
            });
          } else {
            this.onInvalidProjectIdError();
          }
        }
      }
    }, (error: any) => {
      this.$emit('apierror', error);
    });

    store.commit('selectComponent', PAGES.PROJECT);
    const projectArea: HTMLElement | null = document.getElementById('project-area');
    if (projectArea) {
      projectArea.onclick = (e: MouseEvent): void => {
        e.stopPropagation();
        const actionList: HTMLElement | null = document.getElementById('action-list');
        if (actionList) {
          actionList.style.display = 'none';
        }
        store.commit('hideAccountMenu');
      };
    }

    const actionIcon: HTMLElement | null = document.getElementById('action-icon');
    if (actionIcon) {
      actionIcon.onclick = (e: MouseEvent) => {
        e.stopPropagation();
        const actionList: HTMLElement | null = document.getElementById('action-list');
        const icon: HTMLElement | null = document.getElementById('action-icon');
        if (!actionList || !icon) {
          return;
        }
        actionList.style.display = actionList.style.display !== 'block' ? 'block' : 'none';
        const iconTop = icon.getBoundingClientRect().top;
        const iconLeft = icon.getBoundingClientRect().left;
        const iconHeight = icon.clientHeight;
        const iconWidth = icon.clientWidth;
        actionList.style.top = (iconTop + iconHeight).toString() + 'px';
        const leftMenuWidth: number = (document.getElementById('menu-container') || {clientWidth: 0}).clientWidth;
        actionList.style.left = (iconLeft - leftMenuWidth) + 'px';
      };
    }

  }

  public updated() {
    const input: any = document.getElementById('project-name-input');
    if (input) {
      input.focus();
    }

    const jobHistories: any[] = this.getJobHistories();

    jobHistories.forEach((jobHistory: any, index: any) => {
      this.drawJobProgressChart(
        index,
        jobHistory.epochCurrent,
        jobHistory.epochMax,
        jobHistory.status,
        jobHistory.type
      );
    });

  }

  public isProjectListLoading(): boolean {
    return store.state.project.projectListLoading[this.selectedTenantId];
  }

  public isProjectJobLoading(): boolean {
    return store.state.project.projectJobListLoading[this.selectedTenantId];
  }

  private getSampleProjects(): Promise<any> {
    return new Promise((resolve: (res?: any) => void, reject: (res?: any) => void) => {
      CoreApiClient.getSampleProjects().then((sampleProjects: ICoreSampleProject) => {
        CoreApiClient.getStarredProjects(this.userId).then((starredProjects) => {
          sampleProjects.projects.forEach(sampleProject => {
            if (starredProjects.project_ids.includes(sampleProject.project_id)) {
              sampleProject.starred = true;
            }
          });
          store.commit('setSampleProject', sampleProjects);
          resolve();
        }, (error: any) => {
          this.$emit('apierror', error);
        });
      }, (error: any) => {
        this.$emit('apierror', error);
      });
    });
  }

  private onInvalidProjectIdError(): void {
    store.commit('setProjectIdFromUrl', '');
    const message: string = text[store.state.common.language].dialogTexts.NO_SUCH_PROJECT;
    SwalUtil.alert(message, () => {
      return;
    });
  }

  private findSampleProjectNameByProjectId(projectId: string): string {
    if (store.state.project.sampleProjectList) {
      return store.state.project.sampleProjectList.filter((sampleProject: any) => {
        return sampleProject['project_id'] === projectId;
      })[0].project_name || '';
    }
    return '';
  }

  private isSampleProject(projectIdInParam: string): boolean {
    return store.state.project.sampleProjectList.findIndex((sampleProject: IProjectList) => sampleProject['project_id'] === projectIdInParam) !== -1;
  }

  public beforeDestroy() {
    if (this.pollingProjectTimerId) {
      clearTimeout(this.pollingProjectTimerId);
    }
  }

  private pollingProjectTimerId: number = NaN;

  private resizeRightMenu(e: any): void {
    e.preventDefault();
    MenuResizeUtil.resize('project-job-list', '', 'left-menu-border', false, 10, (width: number) => store.commit('setProjectRightWidth', width));
  }

  private isReadOnlyProject(error: any): boolean {
    return error.response.status === 400 && error.response.data.error === 'NNCD_CONFIGURATION_EDITING';
  }

  private isLimitExceededError(error: any): boolean {
    return error.response.status === 400 && error.response.data.error === 'NNCD_PROJECT_LIMIT_EXCEEDED';
  }

  private isInvalidProjectName(error: any): boolean {
    return error.response.status === 400 && error.response.data.message === 'Invalid body(schema error)';
  }

  private isCopying(error: any): boolean {
    return error.response.status === 400 && error.response.data.message === 'File being used by another process';
  }

  private isUsedByAnotherProcess(error: any): boolean {
    return error.response.status === 400 && error.response.data.message === 'This project is in use by another process';
  }

  private isUserMayBeDeleted(error: any): boolean {
    return error.response.status === 400 && error.response.data.message === 'This user may be deleted.';
  }

  private isProjectIdNotCorrect(error: any): boolean {
    return error.response.status === 400 && error.response.data.message === 'Project id is not correct';
  }

  private onUnexpectedError(apiResponse: any): void {
    store.commit('setHideAllLoading', this.selectedTenantId);
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
    SwalUtil.alert(text[store.state.common.language].dialogTexts.PLEASE_TRY_AGAIN_AFTER_A_WHILE);
  }

  private getLimitExceededErrorMessage(): string {
    let errorMessage: string = text[store.state.common.language].dialogTexts.YOU_CAN_NOT_CREATE_PROJECT;
    if (this.isSupportedCountryForCharged()) {
      errorMessage += text[store.state.common.language].dialogTexts.IF_YOU_ADD_MORE_PROJECTS;
    }
    return errorMessage;
  }

  private getJobHistories(): any[] {
    return store.state.project.jobs[this.selectedTenantId];
  }

  private drawJobProgressChart(index: number, epochCurrent: number, epochMax: number, status: string, type: string) {
    const elementId: string = 'job-history-progress-' + String(index);
    const element: any = document.getElementById(elementId) as HTMLCanvasElement;
    if (!element) {
      return;
    }
    const ctx: CanvasRenderingContext2D = element.getContext('2d');
    ctx.canvas.width = 24;
    ctx.canvas.height = 24;
    ChartUtil.drawJobProgressChart(ctx, epochCurrent, epochMax, status, type);
  }

  get projectList(): {}[] {
    const currentSort: string = store.state.project.currentSort[this.selectedTenantId];
    const projectList: IProjectList[] = store.state.project.projectList[this.selectedTenantId].filter((_project: IProjectList) => !_project.deleted);
    const sampleProjectList: ISampleProjectList[] = store.state.project.filteredSampleProjectList[this.selectedTenantId];
    sampleProjectList.sort((a: ISampleProjectList, b: ISampleProjectList) => {
      if (currentSort === '-create_datetime' || undefined) {
        return (a.create_datetime > b.create_datetime ? 1 : -1);
      } else if (currentSort === '-copy_count') {
        if (a.copy_count < b.copy_count) { return 1; }
        if (a.copy_count > b.copy_count) { return -1; }
        if (a.create_datetime > b.create_datetime) { return 1; }
        if (a.create_datetime < b.create_datetime) { return -1; }
        return 0;
      } else if (currentSort === '-star_count') {
        if (a.star_count < b.star_count) { return 1; }
        if (a.star_count > b.star_count) { return -1; }
        if (a.create_datetime > b.create_datetime) { return 1; }
        if (a.create_datetime < b.create_datetime) { return -1; }
        return 0;
      } else {
        return 0;
      }
    });
    const keyword: string = store.state.project.keyword[this.selectedTenantId];
    const selectedLabel: string = store.state.project.selectedLabel[this.selectedTenantId];
    const splittedKeywordList: string[] = keyword.trim().split(/\s+/);
    const allProjectList: IProjectList[] = ([] as IProjectList[]).concat(projectList).concat(sampleProjectList as IProjectList[]);
    let condition: string = '';
    let newKeyword: string = '';
    splittedKeywordList.forEach((_keyword: string) => {
      newKeyword += '(?=.*' + _keyword + ')';
    });
    condition += `${'^' + newKeyword + '.*$'}`;
    const regExp: RegExp = new RegExp(condition, 'i');
    const filteredProjectListByKeyword: IProjectList[] = allProjectList.filter((project: any) => regExp.test(project.project_name));
    if (selectedLabel === this.commonVueTexts.ALL || selectedLabel === undefined) {
      return filteredProjectListByKeyword;
    }
    return filteredProjectListByKeyword.filter((project: IProjectList) => this.isMatched(project));
  }

  public isMatched(project: IProjectList): boolean {
    const selectedLabel: string = store.state.project.selectedLabel[this.selectedTenantId];
    if (project.isSample) {
      return false;
    } else {
      if (project.owner_user_id !== selectedLabel && (project.labels.indexOf(selectedLabel) === -1)) {
        return false;
      }
    }
    return true;
  }

  public convertToNickName(optionLabel: string): string {
    if (!optionLabel) {
      return '';
    }
    const memberList: IMemberObj[] = store.state.tenant.memberList[this.selectedTenantId];
    if (!memberList.length) {
      return optionLabel;
    }
    const member: IMemberObj | undefined = memberList.find((_member: IMemberObj) => _member.userId === optionLabel);
    if (!member) {
      // 画面表示後に追加されたユーザー/退会したユーザー
      return optionLabel;
    }
    const nickname: string = member.nickname;
    const userId: string = member.userId;
    if (member.deleted) {
      if (nickname) {
        return `${nickname} / Missing user (${userId})`;
      } else {
        return `Missing user (${userId})`;
      }
    } else {
      if (nickname) {
        return `${nickname} (${userId})`;
      } else {
        return userId;
      }
    }
  }

  private getProjectTotal(tenantId: string): number {
    return store.state.project.projectTotal[tenantId] - this.getDeletedProjectNum(tenantId);
  }

  private getDeletedProjectNum(tenantId: string): number {
    return store.state.project.projectList[tenantId].filter((_project: IProjectList) => _project.deleted).length;
  }

  get allChecked(): boolean {
    return store.state.project.allChecked[this.selectedTenantId];
  }

  get jobs(): {}[] {
    return store.state.project.jobs[this.selectedTenantId];
  }

  get jobTotal(): number {
    return store.state.project.jobTotal[this.selectedTenantId];
  }

  get keyword(): string {
    return store.state.project.keyword[this.selectedTenantId];
  }

  public getTypeAndStatus(jobObj: any): string {
    const type: string = this.capitalize(jobObj.type);
    const status: string = this.capitalize(jobObj.status);
    return type + ' ' + '/' + ' ' + status;
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

  public getJobLink(jobObj: any): string {
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

  public isImporting(project: IProjectList): boolean {
    const importStatus: string = project.import_status;
    const importSdcprojStatus: string = project.import_sdcproj_status;
    return (importStatus === 'ready' || importStatus === 'processing' || importSdcprojStatus === 'ready' || importSdcprojStatus === 'processing') && (
      importStatus !== 'failed' && importSdcprojStatus !== 'failed'
    );
  }

  public isImportFailed(project: IProjectList): boolean {
    const importStatus: string = project.import_status;
    const importSdcprojStatus: string = project.import_sdcproj_status;
    return importStatus === 'failed' || importSdcprojStatus === 'failed';
  }

  public isSaving(projects: any[]): boolean {
    return projects.some((project) => (project.status === 'ready' || project.status === 'processing' || this.isImporting(project)));
  }

  public setPollingForProject(projects: any[], tenantId: string): void {
    if (this.isSaving(projects)) {
      if (this.pollingProjectTimerId) {
        clearTimeout(this.pollingProjectTimerId);
      }
      this.pollingProjectTimerId = setTimeout(() => {
        const promiseList: Promise<ICoreProjects>[] = [];
        for (let i = 0; i < Math.floor(this.getProjectTotal(tenantId)); i += GET_PROJECTS_NUM) {
          promiseList.push(CoreApiClient.getProjects(this.userId, String(i), String(GET_PROJECTS_NUM), tenantId, '', false));
        }
        Promise.all(promiseList).then((responses: ICoreProjects[]) => {
          const _projects: IProject[] = [];
          responses.forEach((response: ICoreProjects) => {
            _projects.push.apply(_projects, response.projects);
          });
          const res: ICoreProjects = {
            metadata: responses[0].metadata,
            projects: _projects.map((_project: IProject) => {
              return {
                ...this.getTargetProject(_project.project_id),
                ..._project
              };
            })
          };
          store.commit('setProject', {tenantId: tenantId, projects: res});
          this.setPollingForProject(res.projects, tenantId);
        });
      }, POLLING_INTERVAL);
    }
  }

  public getProjects(param: {userID: string, offset?: string, limit?: string, keyword?: string, tenantId: string}, successCallback: (response: ICoreProjects) => void): void {
    CoreApiClient.getProjects(param.userID, param.offset, param.limit, param.tenantId, param.keyword).then((response: ICoreProjects) => {
      successCallback(response);
    }, (error: any) => {
      this.$emit('apierror', error);
    });
  }

  public getProjectByParallel(tenantId: string, projectTotal: number): void {
    const promiseList: Promise<ICoreProjects>[] = [];
    const limit: string = String(GET_PROJECTS_NUM);
    if (projectTotal === 0) {
      promiseList.push(CoreApiClient.getProjects(this.userId, String(0), limit, tenantId, '', false));
    } else {
      for (let i = 0; i < projectTotal; i += Number(limit)) {
        promiseList.push(CoreApiClient.getProjects(this.userId, String(i), limit, tenantId, '', false));
      }
    }

    Promise.all(promiseList).then((responses: ICoreProjects[]) => {
      const projects: IProject[] = [];
      responses.forEach((response: ICoreProjects) => {
        projects.push.apply(projects, response.projects);
      });
      const res: ICoreProjects = {
        metadata: responses[0].metadata,
        projects: projects.map((_project: IProject) => {
          return {
            ...this.getTargetProject(_project.project_id),
            ..._project
          };
        })
      };
      store.commit('setProject', {tenantId: tenantId, projects: res});
      const allLabels: string[] = this.createAllLabels(res.projects);
      store.commit('setAllLabels', {tenantId: tenantId, allLabels: allLabels});
      const filteredTenant: ITenantObj | undefined = store.state.tenant.tenantList.find((tenant: ITenantObj) => tenant.tenantId === tenantId);
      if (filteredTenant) {
        const selectOptionLabels: string[] = this.createSelectOptionLabels(res.projects, filteredTenant.isLocal);
        store.commit('setSelectOptionlabels', {tenantId: tenantId, selectOptionLabels: selectOptionLabels});
      }
      this.setPollingForProject(res.projects, tenantId);
      store.commit('hideProjectListLoading', tenantId);
    });
  }

  public onClickSampleProject(projectId: string, projectName: string): void {
    const info: {message: string, defaultText: string} = {
      message: text[store.state.common.language].dialogTexts.CREATE_NEW_PROJECT,
      defaultText: projectName
    };
    SwalUtil.inputName(info, (_projectName: string) => {
      const newNameMessage: string = text[store.state.common.language].dialogTexts.ENTER_NEW_PROJECT_NAME;
      const invalidMessage: string = text[store.state.common.language].dialogTexts.INVALID_CHARACTER_INCLUDED;
      if (!_projectName) {
        SwalUtil.alert(newNameMessage);
        return;
      }
      const tenantId: string = this.selectedTenantId;
      store.commit('showProjectListLoading', tenantId);
      CoreApiClient.copyProject(this.userId, projectId, _projectName, tenantId).then(() => {
        const projectTotal: number = Math.floor(this.getProjectTotal(tenantId) + 1);
        this.getProjectByParallel(tenantId, projectTotal);
        const projectListContainer: HTMLCollection = document.getElementsByClassName('project-list-container');
        projectListContainer[0].scrollTo(0, 0);
        store.commit('setKeyword', {tenantId: tenantId, keyword: ''});
        store.commit('setSelectedLabel', {tenantId: tenantId, selectedLabel: this.commonVueTexts.ALL});
        store.commit('setCurrentSort', {tenantId: tenantId, currentSort: '-create_datetime'});
        this.getSampleProjects()
      }, (error: any) => {
        this.$emit('apierror', error, (errorResponse: any) => {
          if (this.isLimitExceededError(errorResponse)) {
            SwalUtil.alert(this.getLimitExceededErrorMessage(), () => {
              store.commit('hideProjectListLoading', tenantId);
            });
          } else if (this.isInvalidProjectName(errorResponse)) {
            SwalUtil.alert(invalidMessage, () => {
              store.commit('hideProjectListLoading', tenantId);
            });
          } else {
            this.onUnexpectedError(errorResponse);
          }
        });
      });
    });

  }

  private parseConfiguration(response: ICoreConfiguration): {configuration: {}, sdcproj: string, hasNode: boolean} {
    let sdcproj: string;
    let configuration: any;
    if (response.configuration_format === CONFIGURATION_FORMAT.SDCPROJ) {
      sdcproj = response.configuration;
      configuration = importProject(sdcproj);
    } else {
      configuration = JSON.parse(response.configuration);
      sdcproj = exportProject(configuration, false);
    }

    const hasNode: boolean = !(!configuration.networks || !configuration.networks[0] || !configuration.networks[0].nodes || !configuration.networks[0].nodes.length);
    return {
      configuration: configuration,
      sdcproj: sdcproj,
      hasNode: hasNode
    };
  }

  private parseStatisticsObj(statisticsObj: any, index: number, key: string) {
    return statisticsObj['Statistics_' + index + '_' + key];
  }

  private getStatistics(statisticsResponse: string): IStatistic[][] {
    try {
      const configuration: IConfiguration = importProject(statisticsResponse);
      const parsedObj: any = nnc.parseIni(statisticsResponse);

      if (configuration.networks.length === 1) {
        const statisticsObj: any = parsedObj.Statistics;
        const statisticList: any[] = [];
        for (let i = 0; i < statisticsObj.NumStatistics; i++) {
          statisticList.push({
            name: this.parseStatisticsObj(statisticsObj, i, 'Name'),
            max: this.parseStatisticsObj(statisticsObj, i, 'Max'),
            sum: this.parseStatisticsObj(statisticsObj, i, 'Sum')
          });
        }
        return [statisticList];
      }
      return configuration.networks.map((network: any, j: number) => {
        const statisticsObj: any = parsedObj[network.name + '_Statistics'];
        const statisticList: any[] = [];
        for (let i = 0; i < statisticsObj.NumStatistics; i++) {
          statisticList.push({
            name: this.parseStatisticsObj(statisticsObj, i, 'Name'),
            max: this.parseStatisticsObj(statisticsObj, i, 'Max'),
            sum: this.parseStatisticsObj(statisticsObj, i, 'Sum')
          });
        }
        return statisticList;
      });
    } catch (e) {
      return [];
    }
  }

  private async showOverview(projectId: string, tenantId: string): Promise<void> {
    try {
      const response: ICoreConfiguration = await CoreApiClient.getConfiguration(this.userId, projectId, 'sdcproj');
      const parsedConfiguration: {configuration: {}, sdcproj: string, hasNode: boolean} = this.parseConfiguration(response);
      if (parsedConfiguration.hasNode) {
        const statisticsResponse: string = await CoreApiClient.getStatistics(parsedConfiguration.sdcproj);
        if (store.state.project.selectedProjectId[tenantId] !== projectId) {
          // 取得している時に別のprojectを選択された場合などで、フォーカスの当たっているprojectと一致していない場合は何もしない
          return;
        }
        const completedConfiguration: ICompletedConfiguration = {
          networks: importProject(statisticsResponse).networks,
          statistics: this.getStatistics(statisticsResponse)
        };
        store.commit('setNetworkIndex', {tenantId: tenantId, index: 0});
        store.commit('setConfiguration', {tenantId: tenantId, configuration: parsedConfiguration.configuration });
        store.commit('setCompletedConfiguration', {tenantId: tenantId, completedConfiguration: completedConfiguration });
      } else {
        store.commit('setNetworkIndex', {tenantId: tenantId, index: 0});
        store.commit('setConfiguration', {tenantId: tenantId, configuration: parsedConfiguration.configuration });
      }
    } catch (error) {
      this.$emit('apierror', error);
    }
  }

  private async showProjectJob(projectId: string, tenantId: string): Promise<void> {
    try {
      const res: any = await CoreApiClient.getProjectJobs(this.userId, projectId);
      if (store.state.project.selectedProjectId[tenantId] !== projectId) {
        // 取得している時に別のprojectを選択された場合などで、フォーカスの当たっているprojectと一致していない場合は何もしない
        return;
      }
      store.commit('clearProjectJobs', tenantId);
      store.commit('addProjectJobs', {tenantId: tenantId, jobs: res});
    } catch (error) {
      this.$emit('apierror', error);
    }
  }

  public async onClickProject(projectId: string): Promise<void> {
    const tenantId: string = this.selectedTenantId;
    store.commit('showProjectJobListLoading', tenantId);
    store.commit('selectProjectId', {tenantId: tenantId, projectId: projectId});
    await Promise.all([
      this.showOverview(projectId, tenantId),
      this.showProjectJob(projectId, tenantId)
    ]);
    if (store.state.project.selectedProjectId[tenantId] === projectId) {
      store.commit('hideProjectJobListLoading', tenantId);
    }
  }

  public loadMoreJob(e: any): void {
    const projectID: string = e.currentTarget.getAttribute('data-pid');
    const tenantId: string = this.selectedTenantId;
    const offset: string = store.state.project.jobs[tenantId].length.toString();
    store.commit('showProjectJobListLoading', tenantId);
    CoreApiClient.getProjectJobs(this.userId, projectID, offset).then((res: any) => {
      store.commit('addProjectJobs', {tenantId: tenantId, jobs: res});
      store.commit('hideProjectJobListLoading', tenantId);
    }, (error: any) => {
      this.$emit('apierror', error);
    });
  }

  private getEditingUser(projectId: string, tenantId: string): string {
    const projectList: IProjectList[] = store.state.project.projectList[tenantId];
    const project: IProjectList | undefined = projectList.find((_project: IProjectList) => _project.project_id === projectId);
    if (!project) {
      return '';
    }
    if (project.readonly) {
      return project.last_modified_user_id;
    }
    return '';
  }

  public deleteProject(projectId: string, ownerUserId: string): void {
    if (!this.isValidAction(ownerUserId)) {
      const message: string = text[store.state.common.language].dialogTexts.DO_NOT_HAVE_PERMISSION_TO_DELETE;
      SwalUtil.alert(message);
      return;
    }
    const tenantId: string = this.selectedTenantId;
    const editingUser: string = this.getEditingUser(projectId, tenantId);
    if (editingUser) {
      const message: string = StringUtil.format(text[store.state.common.language].dialogTexts.PROJECT_LOCKED_USER_CAN_NOT_DELETE, this.getUserName(editingUser));
      SwalUtil.alert(message);
      return;
    }
    const projectName: string = this.getTargetProject(projectId).project_name;

    if (!projectName) {
      // projectIDからprojectNameを取得できなかった場合
      return;
    }

    const confirmMessage: string = text[store.state.common.language].dialogTexts.WILL_BE_DELETE;
    const lockedMessage: string = text[store.state.common.language].dialogTexts.PROJECT_LOCKED_SOMEONE_CAN_NOT_DELETE;
    SwalUtil.confirm(projectName + confirmMessage, () => {
      store.commit('showProjectListLoading', tenantId);
      CoreApiClient.deleteProjects(this.userId, [projectId]).then(() => {
        store.commit('updateDeleteFlagForProject', { tenantId, projectId });
        ResourceInfoUtil.updateWorkspaceInfo(this.userId, tenantId);
        const projectTotal: number = Math.floor(this.getProjectTotal(tenantId));
        this.getProjectByParallel(tenantId, projectTotal);
        store.commit('hideProjectListLoading', tenantId);
      }, (error: any) => {
        this.$emit('apierror', error, (errorResponse: any) => {
          if (this.isReadOnlyProject(errorResponse)) {
            const message: string = lockedMessage;
            SwalUtil.alert(message, () => {
              store.commit('hideProjectListLoading', tenantId);
            });
          } else if (this.isUsedByAnotherProcess(errorResponse)) {
            const useByAnotherProcessMessage: string = text[store.state.common.language].dialogTexts.USE_BY_ANOTHER_PROCESS;
            SwalUtil.alert(useByAnotherProcessMessage, () => {
              store.commit('hideProjectListLoading', tenantId);
            });
          } else {
            this.onUnexpectedError(errorResponse);
          }
        });
      });
    });
  }

  public deleteAll(e: MouseEvent): void {
    const tenantId: string = this.selectedTenantId;
    const projectList: IProjectList[] = store.state.project.projectList[tenantId];

    const deletedProjectIDs: string[] = projectList.filter((project: IProjectList) => project.checked).map((project: IProjectList) => project.project_id || '');

    if (!deletedProjectIDs.length) {
      e.stopPropagation();
      return;
    }

    let isAllValidAction: boolean = true;
    let isReadOnly: boolean = false;

    deletedProjectIDs.forEach((projectId: string) => {
      const index: number = projectList.findIndex((project: IProjectList) => project.project_id === projectId);
      if (index !== -1) {
        const ownerUserId = projectList[index].owner_user_id || '';
        if (!this.isValidAction(ownerUserId)) {
          isAllValidAction = false;
        }
        if (this.getEditingUser(projectId, tenantId)) {
          isReadOnly = true;
        }
      }
    });

    if (!isAllValidAction) {
      const message: string = text[store.state.common.language].dialogTexts.DO_NOT_HAVE_PERMISSION_TO_DELETE_ONE_OR_MORE;
      SwalUtil.alert(message);
      return;
    }

    if (isReadOnly) {
      const message: string = text[store.state.common.language].dialogTexts.ONE_OR_MORE_PROJECTS_LOCKED;
      SwalUtil.alert(message);
      return;
    }

    const confirmMessage: string = text[store.state.common.language].dialogTexts.ALL_PROJECTS_WILL_BE_DELETED;
    const lockedMessage: string = text[store.state.common.language].dialogTexts.ONE_OR_MORE_PROJECTS_LOCKED;
    SwalUtil.confirm(confirmMessage, () => {
      store.commit('showProjectListLoading', tenantId);
      CoreApiClient.deleteProjects(this.userId, deletedProjectIDs).then(() => {
        ResourceInfoUtil.updateWorkspaceInfo(this.userId, tenantId);
        deletedProjectIDs.forEach((_projectId: string) => {
          store.commit('updateDeleteFlagForProject', { tenantId, projectId: _projectId });
        });
        const projectTotal: number = Math.floor(this.getProjectTotal(tenantId));
        this.getProjectByParallel(tenantId, projectTotal);
        store.commit('hideProjectListLoading', tenantId);
      }, (error: any) => {
        this.$emit('apierror', error, (errorResponse: any) => {
          if (this.isReadOnlyProject(errorResponse)) {
            const message: string = lockedMessage;
            SwalUtil.alert(message, () => {
              store.commit('hideProjectListLoading', tenantId);
            });
          } else if (this.isUsedByAnotherProcess(errorResponse)) {
            const useByAnotherProcessMessage: string = text[store.state.common.language].dialogTexts.ONE_OR_MORE_PROJECTS_USE_BY_ANOTHER_PROCESS;
            SwalUtil.alert(useByAnotherProcessMessage, () => {
              store.commit('hideProjectListLoading', tenantId);
            });
          } else {
            this.onUnexpectedError(errorResponse);
          }
        });
      });
    });
  }

  public deleteJob(jobId: string, jobName: string): void {
    const tenantId: string = this.selectedTenantId;
    const selectedProjectId: string = store.state.project.selectedProjectId[tenantId];
    const projectList: IProjectList[] = store.state.project.projectList[tenantId];
    const index: number = projectList.findIndex((project: IProjectList) => project.project_id === selectedProjectId);
    let ownerUserId: string = '';
    if (index !== -1) {
      ownerUserId = projectList[index].owner_user_id || '';
    }
    if (!this.isValidAction(ownerUserId)) {
      const message: string = text[store.state.common.language].dialogTexts.DO_NOT_HAVE_PERMISSION_TO_DELETE_JOB;
      SwalUtil.alert(message);
      return;
    }
    const editingUser: string = this.getEditingUser(selectedProjectId, tenantId);
    if (editingUser) {
      const message: string = StringUtil.format(text[store.state.common.language].dialogTexts.PROJECT_LOCKED_USER_CAN_NOT_DELETE, this.getUserName(editingUser));
      SwalUtil.alert(message);
      return;
    }
    const confirmMessage: string = text[store.state.common.language].dialogTexts.WILL_BE_DELETE;
    SwalUtil.confirm(jobName + confirmMessage, () => {
      store.commit('showProjectJobListLoading', tenantId);
      CoreApiClient.deleteJob(this.userId, selectedProjectId, jobId).then(() => {
        this.onClickProject(selectedProjectId);
        ResourceInfoUtil.updateWorkspaceInfo(this.userId, tenantId);
        const projectTotal: number = Math.floor(this.getProjectTotal(tenantId));
        this.getProjectByParallel(tenantId, projectTotal);
      }, (error: any) => {
        this.$emit('apierror', error, (errorResponse: any) => {
          if (this.isUserMayBeDeleted(errorResponse)) {
            const message: string = text[store.state.common.language].dialogTexts.THIS_USER_MAY_BE_DELETED;
            SwalUtil.alert(message, () => {
              store.commit('hideProjectJobListLoading', tenantId);
            });
          } else if (this.isProjectIdNotCorrect(errorResponse)) {
            const message: string = text[store.state.common.language].dialogTexts.PROJECT_ID_IS_NOT_CORRECT;
            SwalUtil.alert(message, () => {
              store.commit('hideProjectJobListLoading', tenantId);
            });
          }  else if (this.isUsedByAnotherProcess(errorResponse)) {
            const useByAnotherProcessMessage: string = text[store.state.common.language].dialogTexts.USE_BY_ANOTHER_PROCESS;
            SwalUtil.alert(useByAnotherProcessMessage, () => {
              store.commit('hideProjectJobListLoading', tenantId);
            });
          } else {
            this.onUnexpectedError(errorResponse);
          }
        });
      });
    });
  }

  public select(e: any): void {
    e.stopPropagation();
    e.preventDefault();
    const target: any = e.currentTarget;
    const projectID: string = target.getAttribute('data-pid');
    const input: any = document.getElementById(projectID);
    const checked: boolean = !input.checked;
    store.commit('setChecked', {tenantId: this.selectedTenantId, projectID, checked });
  }

  public selectAll(e: any): void {
    const projectListElement: HTMLElement | null = document.getElementById('project-list');
    if (!projectListElement) {
      return;
    }
    store.commit('selectProjectAll', {tenantId: this.selectedTenantId, checked: e.currentTarget.checked});
  }

  public checked(): boolean {
    const projectList: any = store.state.project.projectList[this.selectedTenantId];
    if (!projectList || !projectList.length) {
      return false;
    }

    let checked: boolean = false;
    for (let i: number = 0; i < projectList.length; i++) {
      if (projectList[i].checked) {
        checked = true;
        break;
      }
    }
    return checked;
  }

  public isValidAction(ownerUserId: string): boolean {
    if (ownerUserId === this.userId) {
      return true;
    }

    const selectedTenant: ITenantObj | undefined = this.tenantList.find((tenant: ITenantObj) => tenant.tenantId === this.selectedTenantId);
    if (!selectedTenant) {
      return false;
    }

    const role: string = selectedTenant.role;
    return role === OWNER_ROLE || role === ADMIN_ROLE;
  }

  public onClickRenameIcon(projectId: string, ownerUserId: string): void {
    const tenantId: string = this.selectedTenantId;
    const project: IProjectList = this.getTargetProject(projectId);
    store.commit('showProjectRenameInput', {tenantId, projectId});
    store.commit('inputProjectName', {
      tenantId,
      projectID: projectId,
      projectName: project.project_name
    });
  }

  get shouldShowDialog(): boolean {
    return store.state.project.shouldShowDialog;
  }

  get shouldShowUploadDialog(): boolean {
    return store.state.project.shouldShowUploadDialog;
  }

  get isShowingDialog(): boolean {
    return store.state.project.shouldShowDialog || store.state.project.shouldShowUploadDialog;
  }

  public getProjectLabelList(): string[] {
    return store.state.project.projectLabels;
  }

  public getAllLabelList(): string[] {
    return store.state.project.allLabels[this.selectedTenantId];
  }

  public onClickLabel(projectId: string): void {
    const project: IProjectList = this.getTargetProject(projectId);
    store.commit('setProjectIdForLabel', projectId);
    store.commit('setProjectLabels', project.labels);
    store.commit('showDialog');
  }

  public onUpdate(labelList: string[]): void {
    const projectId: string = store.state.project.projectIdForLabel;
    const tenantId: string = this.selectedTenantId;
    store.commit('showProjectListLoading', tenantId);
    CoreApiClient.putLabelToProject(this.userId, projectId, labelList).then(() => {
      store.commit('updateProjectLabel', {tenantId, projectId, labels: labelList.sort()});
      store.commit('hideProjectListLoading', tenantId);
      const projectTotal: number = Math.floor(this.getProjectTotal(tenantId));
      this.getProjectByParallel(tenantId, projectTotal);
    }, (error: any) => {
      this.$emit('apierror', error);
    });
    store.commit('hideDialog');
  }

  public onCreateLabel(newLabel: string): void {
    const tenantId: string = this.selectedTenantId;
    const optionLabels: string[] = store.state.project.selectOptionLabels[tenantId];
    optionLabels.push(newLabel);
    store.commit('setSelectOptionlabels', {tenantId: tenantId, selectOptionLabels: optionLabels});
  }

  public onCancel(): void {
    store.commit('hideDialog');
  }

  public onCancelUploadProject(): void {
    store.commit('hideUploadDialog');
  }

  public onClickCopy(projectId: string, projectName: string, isPublic?: boolean): void {
    const newNameMessage: string = text[store.state.common.language].dialogTexts.ENTER_NEW_PROJECT_NAME;
    const messageInvalid: string = text[store.state.common.language].dialogTexts.INVALID_CHARACTER_INCLUDED;
    const isCopyingMessage: string = text[store.state.common.language].dialogTexts.IS_COPYING_PROJECT;
    const info: {message: string, defaultText: string, tenantList: ITenantObj[], isPublic?: boolean} = {
      message: newNameMessage,
      defaultText: projectName + '_copy',
      tenantList: this.tenantList,
      isPublic: isPublic
    };
    SwalUtil.inputName(info, (_projectName: string, tenantId?: string) => {
      const selectedTenantId: string = tenantId ? tenantId : store.state.tenant.tenantList[0].tenantId;
      if (!_projectName) {
        SwalUtil.alert(newNameMessage);
        return;
      }
      this.onChangeTab(selectedTenantId);
      store.commit('showProjectListLoading', selectedTenantId);
      CoreApiClient.copyProject(this.userId, projectId, _projectName, selectedTenantId).then((response: any) => {
        const projectTotal: number = Math.floor(this.getProjectTotal(selectedTenantId) + 1);
        this.getProjectByParallel(selectedTenantId, projectTotal);
        const projectListContainer: HTMLCollection = document.getElementsByClassName('project-list-container');
        projectListContainer[0].scrollTo(0, 0);
        store.commit('setKeyword', {tenantId: selectedTenantId, keyword: ''});
        store.commit('setSelectedLabel', {tenantId: selectedTenantId, selectedLabel: this.commonVueTexts.ALL});
        store.commit('setCurrentSort', {tenantId: selectedTenantId, currentSort: '-create_datetime'});
      }, (error: any) => {
        this.$emit('apierror', error, (errorResponse: any) => {
           if (this.isLimitExceededError(errorResponse)) {
            SwalUtil.alert(this.getLimitExceededErrorMessage(), () => {
              store.commit('hideProjectListLoading', selectedTenantId);
            });
          } else if (this.isInvalidProjectName(errorResponse)) {
            SwalUtil.alert(messageInvalid, () => {
              store.commit('hideProjectListLoading', selectedTenantId);
            });
          } else if (this.isCopying(errorResponse)) {
            SwalUtil.alert(isCopyingMessage, () => {
              store.commit('hideProjectListLoading', selectedTenantId);
            });
          } else {
            this.onUnexpectedError(errorResponse);
          }
        });
      });
    });
  }

  public onKeydownProjectName(e: any): void {
    switch (e.keyCode) {
      case 27: // Esc
      case 13: // Enter
        e.target.blur();
        break;

      default:
        break;
    }
  }

  public inputProjectName(projectID: string, projectName: string): void {
    store.commit('inputProjectName', {tenantId: this.selectedTenantId, projectID, projectName});
  }

  public rename(e: Event, projectId: string): void {
    const currentTarget: any = e.currentTarget;
    if (currentTarget.disabled) {
      return;
    }
    e.stopPropagation();
    currentTarget.disabled = true;
    const tenantId: string = this.selectedTenantId;
    store.commit('showProjectListLoading', tenantId);
    const targetProject: IProjectList | undefined = store.state.project.projectList[this.selectedTenantId].find((_project: IProjectList) => _project.project_id === projectId) || {} as IProjectList;
    const newProjectName: string = targetProject.inputValue || '';
    const oldProjectName: string = targetProject.project_name || '';
    if (!newProjectName || newProjectName === oldProjectName) {
      store.commit('hideProjectRenameInput', {tenantId: tenantId, projectId});
      store.commit('hideProjectListLoading', tenantId);
      return;
    }
    CoreApiClient.updateProjectName(this.userId, projectId, newProjectName).then(() => {
      store.commit('renameProject', {tenantId: tenantId, projectId, projectName: newProjectName});
      store.commit('hideProjectRenameInput', {tenantId: tenantId, projectId});
      store.commit('hideProjectListLoading', tenantId);
      const projectTotal: number = Math.floor(this.getProjectTotal(tenantId));
      this.getProjectByParallel(tenantId, projectTotal);
    }, (error: any) => {
      store.commit('inputProjectName', {tenantId: tenantId, projectID: projectId, projectName: oldProjectName});
      store.commit('hideProjectRenameInput', {tenantId: tenantId, projectId});
      this.$emit('apierror', error, (errorResponse: any) => {
        if (this.isInvalidProjectName(errorResponse)) {
          const message: string = text[store.state.common.language].dialogTexts.INVALID_CHARACTER_INCLUDED;
          SwalUtil.alert(message, () => {
            currentTarget.disabled = false;
            store.commit('hideProjectListLoading', tenantId);
          });
        } else {
          this.onUnexpectedError(errorResponse);
        }
      });
    });
  }

  public download(projectId: string): void {
    const tenantId: string = this.selectedTenantId;
    store.commit('showProjectListLoading', tenantId);
    const projectName: string = this.getTargetProject(projectId).project_name;
    CoreApiClient.getConfiguration(this.userId, projectId, 'sdcproj').then((response: any) => {
      let sdcproj: string = response.configuration;
      if (sdcproj === '') {
        const message: string = text[store.state.common.language].dialogTexts.YOU_CAN_NOT_DOWNLOAD;
        SwalUtil.alert(message, () => {
          store.commit('hideProjectListLoading', tenantId);
        });
        return;
      }
      try {
        const configurationFormat: string = response.configuration_format;
        if (configurationFormat === 'json') {
          sdcproj = exportProject(JSON.parse(sdcproj), false);
        }
        FileUtil.download(sdcproj, projectName + '.sdcproj');
        store.commit('hideProjectListLoading', tenantId);
      } catch (e) {
        const errorMessage: string = text[store.state.common.language].dialogTexts.DOWNLOAD_PROJECT_FAILED;
        SwalUtil.alert(errorMessage, () => {
          store.commit('hideProjectListLoading', tenantId);
        });
        return;
      }
    }, (error: any) => {
      this.$emit('apierror', error);
    });
  }

  public createProject(): void {
    const newNameMessage: string = text[this.language].dialogTexts.ENTER_NEW_PROJECT_NAME;
    const messageInvalid: string = text[this.language].dialogTexts.INVALID_CHARACTER_INCLUDED;
    const tenantId: string = this.selectedTenantId;
    SwalUtil.inputName({message: newNameMessage}, (projectName: string) => {
      if (!projectName) {
        return;
      }
      store.commit('showProjectListLoading', tenantId);
      const configuration: string = exportProject(nnc.emptyConfiguration, false);
      CoreApiClient.createProject(this.userId, projectName, configuration, 'sdcproj', tenantId).then((response: any) => {
        // Project作成後は、エディター画面に遷移する
        document.location.href = './editor?project_id=' + response.project_id;
      }, (error: any) => {
        this.$emit('apierror', error, (errorResponse: any) => {
          if (this.isLimitExceededError(errorResponse)) {
            SwalUtil.alert(this.getLimitExceededErrorMessage(), () => {
              store.commit('hideProjectListLoading', tenantId);
            });
          } else if (this.isInvalidProjectName(errorResponse)) {
            SwalUtil.alert(messageInvalid, () => {
              store.commit('hideProjectListLoading', tenantId);
            });
          } else {
            this.onUnexpectedError(errorResponse);
          }
        });
      });
    });
  }

  public openUploadDialog(): void {
    store.commit('showUploadDialog');
  }

  public uploadProject(format: string, projectName: string, files: any[], projectContent: string, fileSize?: string): void {
    const uploader: any = document.getElementById('project-uploader');
    const messageInvalid: string = text[store.state.common.language].dialogTexts.INVALID_CHARACTER_INCLUDED;
    const warningMessage: string = text[store.state.common.language].dialogTexts.IT_WILL_TAKE_LONG_TIME;
    const readyMessage: string = text[store.state.common.language].dialogTexts.IT_IS_READY_TO_UPLOAD;
    const tenantId: string = this.selectedTenantId;
    store.commit('showProjectListLoading', tenantId);
    CoreApiClient.createProject(this.userId, projectName, projectContent, format, tenantId, fileSize).then((response: any) => {
      if (response.upload_url && fileSize) {
        SwalUtil.alert(warningMessage, () => {
          return;
        });
        CoreApiClient.uploadFileToS3(response.upload_url, files[0]).then(() => {
          SwalUtil.alert(readyMessage, () => {
            return;
          });
        }, (error: any) => {
          this.onUnexpectedError(error);
        });
      }
      uploader.value = '';
      const projectTotal: number = Math.floor(this.getProjectTotal(tenantId));
      this.getProjectByParallel(tenantId, projectTotal);
    }, (error: any) => {
      this.$emit('apierror', error, (errorResponse: any) => {
        if (this.isLimitExceededError(errorResponse)) {
          SwalUtil.alert(this.getLimitExceededErrorMessage(), () => {
            store.commit('hideProjectListLoading', tenantId);
            uploader.value = '';
          });
        } else if (this.isInvalidProjectName(errorResponse)) {
          SwalUtil.alert(messageInvalid, () => {
            store.commit('hideProjectListLoading', tenantId);
            uploader.value = '';
          });
        } else {
          this.onUnexpectedError(errorResponse);
          uploader.value = '';
        }
      });
    });
  }

  private onClickJobList(link: string) {
    document.location.href = link;
  }

  private isSupportedCountryForCharged(): boolean {
    switch (store.state.common.countryCode) {
      case 'JP':
        return true;

      case 'US':
        return false;

      default:
        return false;
    }
  }

  public oninput(value: string): void {
    const keyword: string = store.state.project.keyword[this.selectedTenantId];
    store.commit('setKeyword', {tenantId: this.selectedTenantId, keyword: value});
  }

  public initKeyword(): void {
    const keyword: string = store.state.project.keyword[this.selectedTenantId];
    store.commit('setKeyword', {tenantId: this.selectedTenantId, keyword: ''});
  }

  public onChangeTab(tenantId: string): void {
    this.onClickTenantTab(tenantId);
    Vue.nextTick(() => {
      store.commit('setKeyword', {tenantId: this.selectedTenantId, keyword: store.state.project.keyword[this.selectedTenantId]});
    });
    this.setPollingForProject(store.state.project.projectList[tenantId], tenantId);
  }

  public getUserName(ownerUserId: string): string {
    if (!ownerUserId) {
      return '';
    }
    const memberList: IMemberObj[] = store.state.tenant.memberList[this.selectedTenantId];
    if (!memberList.length) {
      return '';
    }
    const member: IMemberObj | undefined = memberList.find((_member: IMemberObj) => _member.userId === ownerUserId);
    if (!member) {
      // 画面表示後に追加されたユーザー/退会したユーザー
      return `Missing user (${ownerUserId})`;
    }
    const nickname: string = member.nickname;
    const userId: string = member.userId;
    if (member.deleted) {
      if (nickname) {
        return `${nickname} / Missing user (${userId})`;
      } else {
        return `Missing user (${userId})`;
      }
    } else {
      if (nickname) {
        return `${nickname} (${userId})`;
      } else {
        return userId;
      }
    }
  }

  public getWarningList(): {tenantId: string, shouldShowWarning: boolean}[] {
    return this.tenantList.map((tenant: ITenantObj) => {
      const tenantId: string = tenant.tenantId;
      if (ResourceInfoUtil.isCharged(tenantId)) {
        return {
          tenantId: tenantId,
          shouldShowWarning: false
        };
      }
      return {
        tenantId: tenantId,
        shouldShowWarning: ResourceInfoUtil.isCloseToTheLimitProjectNum(tenantId)
      };
    });
  }

  public changeLabel(e: any): void {
    store.commit('setSelectedLabel', {tenantId: this.selectedTenantId, selectedLabel: e.currentTarget.value});
  }

  public getSelectOptionlabels(): string[] {
    return store.state.project.selectOptionLabels[this.selectedTenantId];
  }

  public changeNetwork(e: any): void {
    store.commit('setNetworkIndex', {tenantId: this.selectedTenantId, index: e.currentTarget.value});
  }

  public showImportErrorMsg(importErrorMsg: string): void {
    SwalUtil.alert(importErrorMsg, () => {
      return;
    });
  }

  public addOrDeleteStar(projectId: string, checked: boolean): void {
    if (store.state.project.clickStarFlag) {
      return;
    }
    store.commit('setClickStarFlag', true);
    checked = !checked;
    if (checked) {
      store.commit('setPlusStarCount', projectId);
      CoreApiClient.putStarToProject(this.userId , projectId).then((res) => {
        store.commit('setClickStarFlag', false);
      }, (error: any) => {
        this.onUnexpectedError(error);
      });
    } else {
      store.commit('setMinusStarCount', projectId);
      CoreApiClient.deleteStarOfProject(this.userId , projectId).then((res) => {
        store.commit('setClickStarFlag', false);
      }, (error: any) => {
        this.onUnexpectedError(error);
      });
    }
    store.commit('setStarChecked', {projectId: projectId, checked: checked});
  }

  public onChangeOrder(e: any): void {
    const option: string = e.currentTarget.value;
    store.commit('setCurrentSort', {tenantId: this.selectedTenantId, currentSort: option});
  }

  public calcJobStorage(storage: number): string {
    const mb: number = ConvertUtil.calcMBStorage(storage);
    if (mb >= STORAGE_UNIT_BORDER) {
      return String(ConvertUtil.calcStorage(storage)) + 'GB';
    } else {
      return String(mb) + 'MB';
    }
  }

  private getTargetProject(projectId: string): IProjectList {
    return store.state.project.projectList[this.selectedTenantId].find((_project: IProjectList) => _project.project_id === projectId) || {} as IProjectList;
  }

  get configuration(): IConfiguration {
    return store.state.project.configuration[this.selectedTenantId];
  }

  get networkIndex(): number {
    return store.state.project.networkIndex[this.selectedTenantId];
  }

  get networkList(): string[] {
    const configuration: IConfiguration = store.state.project.configuration[this.selectedTenantId];
    if (!configuration.networks || !configuration.networks.length) {
      return[];
    }
    return configuration.networks.map((network: INetwork) => network.name);
  }

  get labelList(): string[] {
    return store.state.project.selectOptionLabels[this.selectedTenantId];
  }

  get completedConfiguration(): ICompletedConfiguration {
    return store.state.project.completedConfiguration[this.selectedTenantId];
  }

  get rightWidth(): number {
    return store.state.project.rightWidth;
  }

  get vueTexts(): TextType {
    return text[this.language].vueTexts.projects;
  }

  get commonVueTexts(): TextType {
    return text[this.language].vueTexts.common;
  }

  get selectOptions(): { key: {[key: string]: string}, value: string}[] {
    return SELECTOPTIONS;
  }

  public getCurrentSort(): string {
    return store.state.project.currentSort[this.selectedTenantId];
  }

  public getSelectedLabel(): string {
    return store.state.project.selectedLabel[this.selectedTenantId];
  }

  public onFocus(e: any): void {
    if (document.getElementsByClassName('swal2-container').length) {
      e.target.blur();
    }
  }

}
