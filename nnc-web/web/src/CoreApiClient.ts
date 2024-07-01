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

import axios, { AxiosResponse, AxiosError } from 'axios';
import tenant from './store/state/tenant';
import { ICreateSession } from './interfaces/core-response/ISession';
import { IGetTOS } from './interfaces/core-response/ITOS';
import { IInstanceType, IGetInstance, IGetMaintenance, IGetPlan } from './interfaces/core-response/IMisc';
import { IGetClassifiers, IServerSpec, IGetMetrics } from './interfaces/core-response/IClassifiers';
import { ISupportContents, ISupportContent, ISupportContentsRequest } from './interfaces/core-response/IUser';
import { ISupport } from './store/state/dashboard';
import { ISampleDatasetResponse } from './interfaces/core-response/IDataset';
import { IDataSource, IDetailJob, IInstance, IPipeline, IScript, IWorkflow, IWorkflowJob } from './store/state/pipeline';
import {
  IPipelines,
  IWorkflowJobs,
  IDetailJob as ICoreDetailJob,
  IWorkflowJob as ICoreWorkflowJob,
  IWorkflows,
  IGetScripts,
  IScript as ICoreScript,
  IUpdateWorkflowRequest,
  IUpdatePipelineRequest,
  IGetUrlToUploadScriptRequest,
  IGetUrlToUploadScriptResponse,
  IDownloadScript,
  IGenerateUrlToUploadDataSourceResponse,
  IGenerateUrlToUploadDataSourceRequest,
  IUploadDataSource,
  IDownloadResults,
  IDownloadFile
} from './interfaces/core-response/IPipeline';
import { DEFAULT_DOWNLOAD_FILE_NAME, PIPELINE_SCRIPT } from './Const';

export interface IGetUrlToUploadScript {
  scriptId: string;
  fileName: string;
  uploadUrl: string;
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken: string;
}

export interface IGenerateUrlToUploadDataSource {
  name: string;
  uploadUrl: string;
  uploadFileName: string;
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken: string;
}

export interface IDownloadResult {
  name: string;
  url: string;
  error: string;
}

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

declare var CoreDomain: string;
declare var creditLimit: number;

export class CoreApiClient {

  /**
   * Sessionを更新します
   */
  public static updateSession(param: { code: string, state: string, redirectURI: string, provider: string }): Promise<ICreateSession> {
    return new Promise((resolve: (res: ICreateSession) => void, reject: (res: AxiosError) => void) => {
      const url: string = `${CoreDomain}v1/session`;
      const headers: { 'content-type': string } = {
        'content-type': 'application/json'
      };
      axios.put(url, {
        state: param.state,
        authorization_code: param.code,
        redirect_uri: param.redirectURI,
        id_provider: param.provider
      }, { headers, withCredentials: true }).then((res: any) => {
        resolve(res.data);
      }, (res: any) => {
        reject(res);
      });
    });
  }

  /**
   * ToS/PPを取得します
   */
  public static getTOSPP(): Promise<IGetTOS> {
    return new Promise((resolve: (res: IGetTOS) => void, reject: (res: AxiosError) => void) => {
      const url: string = `${CoreDomain}v1/tos_pp_agreements`;
      axios.get(url, { withCredentials: true }).then((res: any) => {
        resolve(res.data);
      }, (res: any) => {
        reject(res);
      });
    });
  }

  /**
   * ToS/PPを更新します
   */
  public static updateTOSPP(param: { hash: string }): Promise<{}> {
    return new Promise((resolve: (res: {}) => void, reject: (res: AxiosError) => void) => {
      const url: string = `${CoreDomain}v1/tos_pp_agreements`;
      const headers: { 'content-type': string } = {
        'content-type': 'application/json'
      };
      axios.put(url, param, { headers, withCredentials: true }).then((res: any) => {
        resolve(res.data);
      }, (res: any) => {
        reject(res);
      });
    });
  }

  /**
   * 指定したプロジェクトを取得します
   * @param userId
   * @param projectId
   */
  public static getProject(userId: string, projectId: string): Promise<any> {
    return new Promise((resolve: (res?: any) => void, reject: (res?: any) => void) => {
      const url: string = `${CoreDomain}v1/users/${userId}/projects/${projectId}`;
      axios.get(url, { withCredentials: true }).then((res: any) => {
        resolve(res.data);
      }, (res: any) => {
        reject(res);
      });
    });
  }

  /**
   * プロジェクトを取得します
   * @param userID
   * @param offset
   * @param limit
   */
  public static getProjects(userID: string, offset?: string, limit?: string, tenantId?: string, keyword?: string, deleted?: boolean, filter?: string, ownerId?: string, sortBy?: string): Promise<any> {
    return new Promise((resolve: (res?: any) => void, reject: (res?: any) => void) => {
      const url: string = `${CoreDomain}v1/users/${userID}/projects`;
      let sort: string | undefined = sortBy;
      if (!sortBy) {
        sort = '-update_datetime';
      }
      const queryParams: any = {
        sort_by: sort,
        limit: limit || '250',
        offset: offset || '0',
        keyword: keyword || '',
        filter : filter,
        owner_user_id: ownerId
      };
      if (tenantId) {
        queryParams.tenant_id = tenantId;
      }
      if (deleted) {
        queryParams.deleted = true;
      }
      const headers: { 'Content-Type': string } = {
        'Content-Type': 'application/json'
      };
      axios.get(url, { params: queryParams, headers, withCredentials: true }).then((res: any) => {
        resolve(res.data);
      }, (res: any) => {
        reject(res);
      });
    });
  }

  /**
   * プロジェクトを作成します
   * @param userID
   * @param offset
   * @param limit
   */
  public static createProject(userID: string, projectName: string, configuration?: string, configurationFormat?: string, tenantId?: string, fileSize?: string): Promise<any> {
    return new Promise((resolve: (res?: any) => void, reject: (res?: any) => void) => {
      const url: string = `${CoreDomain}v1/users/${userID}/projects`;
      const params: any = {
        project_name: projectName,
        configuration: configuration || '',
        configuration_format: configurationFormat,
        tenant_id: tenantId,
        file_size: fileSize
      };
      const headers: { 'Content-Type': string } = {
        'Content-Type': 'application/json'
      };
      axios.post(url, params, { headers, withCredentials: true }).then((res: any) => {
        resolve(res.data);
      }, (res: any) => {
        reject(res);
      });
    });
  }

  /**
   * プロジェクトを削除します
   * @param userID
   * @param offset
   * @param limit
   */
  private static deleteProject(userID: string, projectID: string): any {
    return new Promise((resolve: () => void, reject: (res: any) => void) => {
      const url: string = CoreDomain + 'v1/users/' + userID + '/projects/' + projectID;
      const headers: { 'content-type': string } = {
        'content-type': 'application/json'
      };
      axios.delete(url, { headers, withCredentials: true }).then((res: any) => {
        resolve();
      }, (res: any) => {
        reject(res);
      });
    });
  }

  /**
   * プロジェクトを削除します。
   * @param userID
   * @param projectIDs
   */
  public static deleteProjects(userID: string, projectIDs: string[]): Promise<any> {
    return new Promise((resolve: () => void, reject: (res: any) => void) => {
      const promiseList: any[] = [];

      projectIDs.forEach((projectID: string) => {
        promiseList.push(this.deleteProject(userID, projectID));
      });

      Promise.all(promiseList).then(() => {
        resolve();
      }, (res: any) => {
        reject(res);
      });
    });
  }

  /**
   * プロジェクトをコピーします。
   * @param userID
   * @param projectID
   * @param projectName
   */
  public static copyProject(userID: string, projectID: string, projectName: string, tenantId?: string) {
    return new Promise((resolve: (res?: any) => void, reject: (res?: any) => void) => {
      const url: string = `${CoreDomain}v1/users/${userID}/projects/${projectID}/copy`;
      const params: { project_name: string, tenant_id?: string} = {
        project_name: projectName,
        tenant_id: tenantId
      };
      const headers: { 'Content-Type': string } = {
        'Content-Type': 'application/json'
      };
      axios.post(url, params, { headers, withCredentials: true }).then((res: any) => {
        resolve(res.data);
      }, (res: any) => {
        reject(res);
      });
    });
  }

  /**
   * サンプルプロジェクトを取得します
   */
  public static getSampleProjects(): Promise<any> {
    return new Promise((resolve: (res?: any) => void, reject: (res?: any) => void) => {
      const url: string = `${CoreDomain}v1/misc/sample_projects`;
      const headers: { 'Content-Type': string } = {
        'Content-Type': 'application/json'
      };
      axios.get(url, { headers, withCredentials: true }).then((res: any) => {
        resolve(res.data);
      }, (res: any) => {
        reject(res);
      });
    });
  }

  /**
   * プロジェクトのJobを取得します。
   * @param userID
   * @param projectID
   * @param offset
   */
  public static getProjectJobs(userID: string, projectID: string, offset?: string) {
    return new Promise((resolve: (res?: any) => void, reject: (res?: any) => void) => {
      const url: string = `${CoreDomain}v1/users/${userID}/projects/${projectID}/jobs`;
      const queryParams: any = {
        limit: '10',
        offset: offset || '0'
      };
      const headers: { 'Content-Type': string } = {
        'Content-Type': 'application/json'
      };
      axios.get(url, { params: queryParams, headers, withCredentials: true }).then((res: any) => {
        resolve(res.data);
      }, (res: any) => {
        reject(res);
      });
    });
  }

  /**
   * ジョブを削除します
   * @param userId
   * @param projectId
   * @param jobId
   */
  public static deleteJob(userId: string, projectId: string, jobId: string): any {
    return new Promise((resolve: () => void, reject: (res: any) => void) => {
      const url: string = CoreDomain + `v1/users/${userId}/projects/${projectId}/jobs/${jobId}`;
      const headers: { 'content-type': string } = {
        'content-type': 'application/json'
      };
      axios.delete(url, { headers, withCredentials: true }).then((res: any) => {
        resolve();
      }, (res: any) => {
        reject(res);
      });
    });
  }

  /**
   * プロジェクトのConfigurationを取得します。
   * @param userID
   * @param projectID
   */
  public static getConfiguration(userID: string, projectID: string, configurationFormat: string): Promise<any> {
    return new Promise((resolve: (res?: any) => void, reject: (res?: any) => void) => {
      const url: string = `${CoreDomain}v1/users/${userID}/projects/${projectID}/configuration?configuration_format=${configurationFormat}`;
      axios.get(url, { withCredentials: true }).then((res: any) => {
        resolve(res.data);
      }, (res: any) => {
        reject(res);
      });
    });
  }

  /**
   * statisticsを取得します
   * @param sdcproj
   */
  public static getStatistics(sdcproj: string) {
    return new Promise((resolve: (res?: any) => void, reject: (res?: any) => void) => {
      const url: string = `${CoreDomain}v1/misc/nnablambda`;
      const params: { command: string, data: string, options: null} = {
        command: 'complete',
        data: sdcproj,
        options: null
      };
      const headers: { 'Content-Type': string } = {
        'Content-Type': 'application/json'
      };
      axios.post(url, params, { headers, withCredentials: true }).then((res: any) => {
        resolve(res.data);
      }, (res: any) => {
        reject(res);
      });
    });
  }

  /**
   * プロジェクト名を変更します
   * @param userID
   * @param projectID
   * @param projectName
   */
  public static updateProjectName(userID: string, projectID: string, projectName: string): Promise<any> {
    return new Promise((resolve: (res?: any) => void, reject: (res?: any) => void) => {
      const url: string = `${CoreDomain}v1/users/${userID}/projects/${projectID}/project_name`;
      const params: any = {
        project_name: projectName
      };
      const headers: { 'Content-Type': string } = {
        'Content-Type': 'application/json'
      };
      axios.put(url, params, { headers, withCredentials: true }).then((res: any) => {
        resolve();
      }, (res: any) => {
        reject(res);
      });
    });
  }

  /**
   * ワークスペース情報を取得します
   * @param userId
   * @param tenantId
   */
  public static getTenantWorkspaceInfo(userId: string, tenantId: string): Promise<any> {
    return new Promise((resolve: (res?: any) => void, reject: (res?: any) => void) => {
      const url: string = `${CoreDomain}v1/users/${userId}/tenants/${tenantId}/workspace`;
      const headers: { 'Content-Type': string } = {
        'Content-Type': 'application/json'
      };
      axios.get(url, { headers, withCredentials: true }).then((res: any) => {
        resolve(res.data);
      }, (res: any) => {
        reject(res);
      });
    });
  }

  /**
   * ユーザー処理リソース情報を取得します
   * @param userID
   */
  public static getResourceInfo(userID: string): Promise<any> {
    return new Promise((resolve: (res?: any) => void, reject: (res?: any) => void) => {
      const url: string = `${CoreDomain}v1/users/${userID}/account/process_resource`;
      const headers: { 'Content-Type': string } = {
        'Content-Type': 'application/json'
      };
      axios.get(url, { headers, withCredentials: true }).then((res: any) => {
        resolve(res.data);
      }, (res: any) => {
        reject(res);
      });
    });
  }

  /**
   * ジョブ履歴を取得します
   * @param userID
   */
  public static getJobHistory(userID: string, tenantId?: string, keyword: string = '', sortBy: string = '+update_datetime', limit: number = 10, offset: number = 0): Promise<any> {
    return new Promise((resolve: (res?: any) => void, reject: (res?: any) => void) => {
      const url: string = `${CoreDomain}v1/users/${userID}/all_jobs`;
      const queryParams: any = {
        sort_by: sortBy,
        limit: limit,
        offset: offset
      };
      if (tenantId) {
        queryParams.tenant_id = tenantId;
      }

      if (keyword) {
        queryParams.keyword = keyword;
      }
      const headers: { 'Content-Type': string } = {
        'Content-Type': 'application/json'
      };
      axios.get(url, { params: queryParams, headers, withCredentials: true }).then((res: any) => {
        resolve(res.data);
      }, (res: any) => {
        reject(res);
      });
    });
  }

  /**
   * データセットの一覧を取得します
   * @param userID
   * @param offset
   * @param limit
   */
  public static getDatasetList(userID: string, tenantIds: string, offset?: string, limit?: string, keyword?: string): Promise<any> {
    return new Promise((resolve: (res?: any) => void, reject: (res?: any) => void) => {
      const url: string = `${CoreDomain}v1/users/${userID}/datasets`;
      const queryParams: any = {
        tenant_ids: tenantIds,
        sort_by: '-update_datetime',
        limit: limit || '50',
        offset: offset || '0',
        keyword: keyword || ''
      };
      const headers: { 'Content-Type': string } = {
        'Content-Type': 'application/json'
      };
      axios.get(url, { params: queryParams, headers, withCredentials: true }).then((res: any) => {
        resolve(res.data);
      }, (res: any) => {
        reject(res);
      });
    });
  }

  /**
   * データセット名を変更します
   * @param userID
   * @param datasetID
   * @param datasetName
   */
  public static updateDatasetName(userId: string, datasetId: string, datasetName: string): Promise<any> {
    return new Promise((resolve: (res?: any) => void, reject: (res?: any) => void) => {
      const url: string = `${CoreDomain}v1/users/${userId}/datasets/${datasetId}/dataset_name`;
      const params: any = {
        dataset_name: datasetName
      };
      const headers: { 'Content-Type': string } = {
        'Content-Type': 'application/json'
      };
      axios.put(url, params, { headers, withCredentials: true }).then((res: any) => {
        resolve();
      }, (res: any) => {
        reject(res);
      });
    });
  }

  /**
   * データセットをコピーします。
   * (非同期でコピー処理が進む)
   * @param userId
   * @param datasetId
   * @param datasetName
   * @param tenantId
   * @return Promiseオブジェクト
   */
  public static copyDataset(userId: string, datasetId: string, datasetName: string, tenantId?: string): Promise<any> {
    return new Promise((resolve: (res?: any) => void, reject: (res?: any) => void) => {
      const url: string = `${CoreDomain}v1/users/${userId}/datasets/${datasetId}/copy`;
      const params: { dataset_name: string, tenant_id?: string} = {
        dataset_name: datasetName,
        tenant_id: tenantId
      };
      const headers: { 'Content-Type': string } = {
        'Content-Type': 'application/json'
      };
      axios.post(url, params, { headers, withCredentials: true }).then((res: any) => {
        resolve(res.data);
      }, (res: any) => {
        reject(res);
      });
    });
  }

  /**
   * データセットを削除します
   * @param userID
   * @param datasetID
   */
  private static deleteDataset(userID: string, datasetID: string): any {
    return new Promise((resolve: () => void, reject: (res: any) => void) => {
      const url: string = CoreDomain + 'v1/users/' + userID + '/datasets/' + datasetID;
      const headers: { 'content-type': string } = {
        'content-type': 'application/json'
      };
      axios.delete(url, { headers, withCredentials: true }).then((res: any) => {
        resolve();
      }, (res: any) => {
        reject(res);
      });
    });
  }

  /**
   * データセットを削除します。
   * @param userID
   * @param datasetIDs
   */
  public static deleteDatasets(userID: string, datasetIDs: string[]) {
    return new Promise((resolve: () => void, reject: (res: any) => void) => {
      const promiseList: any[] = [];

      datasetIDs.forEach((datasetID: string) => {
        promiseList.push(this.deleteDataset(userID, datasetID));
      });

      Promise.all(promiseList).then(() => {
        resolve();
      }, (res: any) => {
        reject(res);
      });
    });
  }

  /**
   * サンプルデータセットを取得します
   */
  public static async getSampleDatasets(userId: string, tenantId: string): Promise<ISampleDatasetResponse> {
    const url: string = `${CoreDomain}v1/users/${userId}/datasets`;
    const queryParams: {tenant_ids: string, sort_by: string} = {
      tenant_ids: tenantId,
      sort_by: '-update_datetime'
    };
    const response: AxiosResponse<ISampleDatasetResponse> = await axios.get(url, { params: queryParams, withCredentials: true });
    return response.data;
  }

  /**
   * データセットのデータ一覧を取得します
   * @param userID
   * @param datasetID
   * @param offset
   * @param limit
   */
  public static getPreviewDataList(userID: string, datasetID: string, param: any): Promise<any> {
    return new Promise((resolve: (res?: any) => void, reject: (res?: any) => void) => {
      const url: string = `${CoreDomain}v1/users/${userID}/datasets/${datasetID}`;
      const queryParams: any = {
        row: param.row || '10',
        column: param.column || '10',
        numrows: param.numrows || '10',
        numcolumns: param.numcolumns || '10'
      };
      const headers: { 'Content-Type': string } = {
        'Content-Type': 'application/json'
      };
      axios.get(url, { params: queryParams, headers, withCredentials: true }).then((res: any) => {
        resolve(res.data);
      }, (res: any) => {
        reject(res);
      });
    });
  }

  /**
   * データセット作成のために必要なトークンを取得します
   * @param userID
   */
  public static getToken(userId: string, tenantId?: string): Promise<any> {
    return new Promise((resolve: (res?: any) => void, reject: (res?: any) => void) => {
      const url: string = `${CoreDomain}v1/users/${userId}/datasets/create`;
      const headers: { 'Content-Type': string } = {
        'Content-Type': 'application/json'
      };
      const queryParams: any = {
        tenant_id: tenantId
      };
      axios.get(url, {params: queryParams, headers, withCredentials: true }).then((res: any) => {
        resolve(res.data);
      }, (res: any) => {
        reject(res);
      });
    });
  }

  /**
   * サインアウトを行います。
   */
  public static signout(invalidSession?: boolean): Promise<undefined> {
    return new Promise((resolve: () => void, reject: (res: AxiosError) => void) => {
      const url: string = `${CoreDomain}v1/session`;
      const headers: { 'Content-Type': string, 'invalid-session': boolean } = {
        'Content-Type': 'application/json',
        'invalid-session': invalidSession || false
      };
      axios.delete(url, { headers, withCredentials: true }).then((res: any) => {
        resolve();
      }, (res: any) => {
        reject(res);
      });
    });
  }

  /**
   * サインイン状態か確認します。
   * @param userID
   */
  public static checkSignin(userID: string): Promise<ICreateSession> {
    return new Promise((resolve: (res: ICreateSession) => void, reject: (res: AxiosError) => void) => {
      const url: string = `${CoreDomain}v1/session/${userID}/check`;
      const headers: { 'Content-Type': string } = {
        'Content-Type': 'application/json'
      };
      axios.post(url, {}, { headers, withCredentials: true }).then((res: any) => {
        resolve(res.data);
      }, (res: any) => {
        reject(res);
      });
    });
  }

  /**
   * 退会処理を行います。
   */
  public static deactivate(userID: string): Promise<any> {
    return new Promise((resolve: (res?: any) => void, reject: (res?: any) => void) => {
      const url: string = `${CoreDomain}v1/users/${userID}/account/deactive`;
      const headers: { 'Content-Type': string } = {
        'Content-Type': 'application/json'
      };
      axios.post(url, {}, { headers, withCredentials: true }).then((res: any) => {
        resolve();
      }, (res: any) => {
        reject(res);
      });
    });
  }

  /**
   * タイプを指定してメッセージを取得します。
   * @param whatText: メッセージ種別文字列 例："announce"
   * @param locale: 言語情報文字列 例："ja-JP"
   */
  public static getInformation(whatText: string, locale?: string, country?: string): Promise<IGetMaintenance> {
    return new Promise((resolve: (res: IGetMaintenance) => void, reject: (res: AxiosError) => void) => {
      const url: string = `${CoreDomain}v1/misc/info`;
      const headers: { 'Content-Type': string } = {
        'Content-Type': 'application/json'
      };
      const queryParams: any = {
        what_text: whatText,
        locale: locale,
        country: country
      };
      axios.get(url, { params: queryParams, headers, withCredentials: true }).then((res: any) => {
        resolve(res.data);
      }, (res: any) => {
        reject(res);
      });
    });
  }

  /**
   * 課金額を請求月で降順にソートした値を返す。最初のデータは当月の金額になる。
   * @param userId: userId
   * @param tenantId: tenantId
   *
   */
  public static getTenantBillings(userId: string, tenantId: string, year?: string): Promise<any> {
    return new Promise((resolve: (res?: any) => void, reject: (res?: any) => void) => {
      const url: string = `${CoreDomain}v1/users/${userId}/tenants/${tenantId}/billings`;
      const headers: { 'Content-Type': string } = {
        'Content-Type': 'application/json'
      };
      const queryParams: any = {
        year: year
      };
      axios.get(url, { params: queryParams, headers, withCredentials: true }).then((res: any) => {
        resolve(res.data);
      }, (res: any) => {
        reject(res);
      });
    });
  }

  /**
   * テナントメンバーのインスタンス使用時間を降順にソートした値を返す。最初のデータは当月の金額になる。
   * @param userId: userId
   * @param tenantId: tenantId
   * @param year: year
   */
  public static getProcessResource(userId: string, tenantId: string, year: string): Promise<any> {
    return new Promise((resolve: (res?: any) => void, reject: (res?: any) => void) => {
      const url: string = `${CoreDomain}v1/users/${userId}/tenants/${tenantId}/process_resource`;
      const headers: { 'Content-Type': string } = {
        'Content-Type': 'application/json'
      };
      const queryParams: any = {
        year: year
      };

      axios.get(url, { params: queryParams, headers, withCredentials: true }).then((res: any) => {
        resolve(res.data);
      }, (res: any) => {
        reject(res);
      });
    });
  }

  /**
   * 現在、選択しているプランを取得する。無料プランの場合ではbudgetを除く値を返す。
   * @param userId: userId
   */
  public static getTenantPlan(userId: string, tenantId: string): Promise<any> {
    return new Promise((resolve: (res?: any) => void, reject: (res?: any) => void) => {
      const url: string = `${CoreDomain}v1/users/${userId}/tenants/${tenantId}/plan`;
      const headers: { 'Content-Type': string } = {
        'Content-Type': 'application/json'
      };
      const queryParams: any = {};

      axios.get(url, { params: queryParams, headers, withCredentials: true }).then((res: any) => {
        resolve(res.data);
      }, (res: any) => {
        reject(res);
      });
    });
  }

  /**
   * 現在、選択しているプランを取得する。無料プランの場合ではbudgetを除く値を返す。
   * @param userId: userId
   */
  public static updateTenantPlan(userId: string, tenantId: string, workspaceQuota: number, budget: number): Promise<any> {
    return new Promise((resolve: (res?: any) => void, reject: (res?: any) => void) => {
      const url: string = `${CoreDomain}v1/users/${userId}/tenants/${tenantId}/plan`;
      const headers: { 'Content-Type': string } = {
        'Content-Type': 'application/json'
      };
      const params: any = {
        workspace_gb: workspaceQuota,
        budget: budget
      };

      axios.put(url, params, { headers, withCredentials: true }).then((res: any) => {
        resolve(res.data);
      }, (res: any) => {
        reject(res);
      });
    });
  }

  /**
   * 現時点のプラン一覧を取得する。
   *
   */
  public static getMiscPlans(): Promise<IGetPlan> {
    return new Promise((resolve: (res: IGetPlan) => void, reject: (res: AxiosError) => void) => {
      const url: string = `${CoreDomain}v1/misc/plans`;
      const headers: { 'Content-Type': string } = {
        'Content-Type': 'application/json'
      };
      const queryParams: any = {};

      axios.get(url, { params: queryParams, headers, withCredentials: true }).then((res: any) => {
        resolve(res.data);
      }, (res: any) => {
        reject(res);
      });
    });
  }

  /**
   * カード情報を取得します。
   * @param userID userID
   */
  public static getCreditCardInfo(userID: string): Promise<any> {
    return new Promise((resolve: (res?: any) => void, reject: (res?: any) => void) => {
      const url: string = `${CoreDomain}v1/users/${userID}/account/credit_cards`;
      const headers: { 'Content-Type': string } = {
        'Content-Type': 'application/json'
      };
      const queryParams: any = {};

      axios.get(url, { params: queryParams, headers, withCredentials: true }).then((res: any) => {
        resolve(res.data);
      }, (res: any) => {
        reject(res);
      });
    });
  }

  /**
   * カード情報を登録します
   * @param userId userId
   * @param token トークン
   */
  public static setCreditCardInfo(userId: string, token: string): Promise<any> {
    return new Promise((resolve: (res?: any) => void, reject: (res?: any) => void) => {
      const url: string = `${CoreDomain}v1/users/${userId}/account/credit_cards`;
      const headers: { 'Content-Type': string } = {
        'Content-Type': 'application/json'
      };
      const params: any = {
        params: {
          servicer: '',
          token: token
        }
      };
      axios.post(url, params, { headers, withCredentials: true }).then((res: any) => {
        resolve(res.data);
      }, (res: any) => {
        reject(res);
      });
    });
  }

  /**
   * カード情報を更新します
   * @param userId userId
   * @param token トークン
   * @param cardId カードID
   */
  public static updateCreditCardInfo(userId: string, token: string, cardId: number): Promise<any> {
    return new Promise((resolve: (res?: any) => void, reject: (res?: any) => void) => {
      const url: string = `${CoreDomain}v1/users/${userId}/account/credit_cards/${cardId}`;
      const headers: { 'Content-Type': string } = {
        'Content-Type': 'application/json'
      };
      const params: any = {
        params: {
          token: token
        }
      };
      axios.put(url, params, { headers, withCredentials: true }).then((res: any) => {
        resolve(res.data);
      }, (res: any) => {
        reject(res);
      });
    });
  }

  /**
   * テナント一覧を取得します
   * @param userId
   */
  public static getTenants(userId: string): Promise<any> {
    return new Promise((resolve: (res?: any) => void, reject: (res?: any) => void) => {
      const url: string = `${CoreDomain}v1/users/${userId}/tenants`;
      axios.get(url, { withCredentials: true }).then((res: any) => {
        resolve(res.data);
      }, (res: any) => {
        reject(res);
      });
    });
  }

  /**
   * テナントに所属しているメンバー一覧を取得します
   * @param userId
   * @param tenantId
   */
  public static getTenantMembers(userId: string, tenantId: string): Promise<any> {
    return new Promise((resolve: (res?: any) => void, reject: (res?: any) => void) => {
      const url: string = `${CoreDomain}v1/users/${userId}/tenants/${tenantId}/members`;
      axios.get(url, { withCredentials: true }).then((res: any) => {
        resolve(res.data);
      }, (res: any) => {
        reject(res);
      });
    });
  }

  /**
   * メンバーをテナントに招待します
   * @param myUserId
   * @param tenantId
   * @param inviteUserId
   */
  public static inviteMember(myUserId: string, tenantId: string, inviteUserId: string): Promise<any> {
    return new Promise((resolve: (res?: any) => void, reject: (res?: any) => void) => {
      const url: string = `${CoreDomain}v1/users/${myUserId}/tenants/${tenantId}/members/invite`;
      const headers: { 'Content-Type': string } = {
        'Content-Type': 'application/json'
      };
      const params: any = {
        user_id: inviteUserId
      };
      axios.post(url, params, { headers, withCredentials: true }).then((res: any) => {
        resolve(res.data);
      }, (res: any) => {
        reject(res);
      });
    });
  }

  /**
   * 指定されたテナントに所属しているメンバーを削除します
   * @param myUserId
   * @param tenantId
   * @param deletedUserId
   */
  public static deleteTenantMember(myUserId: string, tenantId: string, deletedUserId: string): any {
    return new Promise((resolve: () => void, reject: (res: any) => void) => {
      const url: string = `${CoreDomain}v1/users/${myUserId}/tenants/${tenantId}/members/${deletedUserId}`;
      const headers: { 'content-type': string } = {
        'content-type': 'application/json'
      };
      axios.delete(url, { headers, withCredentials: true }).then((res: any) => {
        resolve();
      }, (res: any) => {
        reject(res);
      });
    });
  }

  /**
   * 指定されたテナントに所属しているメンバーを削除します
   * @param myUserId
   * @param tenantId
   * @param deletedUserIds
   */
  public static deleteTenantMembers(myUserId: string, tenantId: string, deletedUserIds: string[]): any {
    return new Promise((resolve: () => void, reject: (res: any) => void) => {
      const promiseList: any[] = [];
      deletedUserIds.forEach((deletedUserId: string) => {
        promiseList.push(this.deleteTenantMember(myUserId, tenantId, deletedUserId));
      });
      Promise.all(promiseList).then(() => {
        resolve();
      }, (res: any) => {
        reject(res);
      });
    });
  }

  /**
   * memberのロールを更新します
   * @param myUserId
   * @param tenantId
   * @param userId
   * @param role
   */
  public static updateRole(myUserId: string, tenantId: string, userId: string, role: string): Promise<any> {
    return new Promise((resolve: (res?: any) => void, reject: (res?: any) => void) => {
      const url: string = `${CoreDomain}v1/users/${myUserId}/tenants/${tenantId}/members/${userId}/role`;
      const params: any = {
        role: role
      };
      const headers: { 'Content-Type': string } = {
        'Content-Type': 'application/json'
      };
      axios.put(url, params, { headers, withCredentials: true }).then((res: any) => {
        resolve();
      }, (res: any) => {
        reject(res);
      });
    });
  }

  /**
   * nicknameを取得します
   * @param userId
   */
  public static getNickname(userId: string): Promise<any> {
    return new Promise((resolve: (res?: any) => void, reject: (res?: any) => void) => {
      const url: string = `${CoreDomain}v1/users/${userId}/account/nickname`;
      axios.get(url, { withCredentials: true }).then((res: any) => {
        resolve(res.data);
      }, (res: any) => {
        reject(res);
      });
    });
  }

  /**
   * nicknameを更新します
   * @param userId
   * @param nickname
   */
  public static updateNickname(userId: string, nickname: string): Promise<any> {
    return new Promise((resolve: (res?: any) => void, reject: (res?: any) => void) => {
      const url: string = `${CoreDomain}v1/users/${userId}/account/nickname`;
      const params: any = {
        nickname: nickname
      };
      const headers: { 'Content-Type': string } = {
        'Content-Type': 'application/json'
      };
      axios.put(url, params, { headers, withCredentials: true }).then((res: any) => {
        resolve();
      }, (res: any) => {
        reject(res);
      });
    });
  }

  public static postLog(pageUrl: string, apiUrl: string, method: string, error: string, message: string, userId: string): Promise<any> {
    return new Promise((resolve: (res?: any) => void, reject: (res?: any) => void) => {
      const url: string = `${CoreDomain}v1/misc/log`;
      const headers: { 'Content-Type': string } = {
        'Content-Type': 'application/json'
      };
      const params: any = {
        page_url: pageUrl,
        error: error,
        message: message,
        user_id: userId
      };
      if (apiUrl !== '' && method !== '') {
          params.api_url = apiUrl;
          params.method = method;
      }
      axios.post(url, params, { headers, withCredentials: true }).then((res: any) => {
        resolve(res.data);
      }, (res: any) => {
        reject(res);
      });
    });
  }

  // s3にonnx,nnp,pbファイルをアップロードします
  public static uploadFileToS3(s3Url: string, file: any) {
    return new Promise((resolve: (res?: any) => void, reject: (res?: any) => void) => {
      const url: string = s3Url;
      const config = {
        headers: {
          'content-type': file.type
        }
      };
      axios.put(url, file, config).then((res: any) => {
        resolve();
      }, (res: any) => {
        reject(res);
      });
    });
  }

  // 選択されたラベルを指定プロジェクトに付与します。
  public static putLabelToProject(userId: string, projectId: string, selectedLabel: string[]): Promise<any> {
    return new Promise((resolve: (res?: any) => void, reject: (res?: any) => void) => {
      const url: string = `${CoreDomain}v1/users/${userId}/projects/${projectId}/metadata/labels`;
      const headers: { 'Content-Type': string } = {
        'Content-Type': 'application/json'
      };
      const params: any = {
        values: selectedLabel
      };
      axios.put(url, params, { headers, withCredentials: true }).then((res: any) => {
        resolve(res.data);
      }, (res: any) => {
        reject(res);
      });
    });
  }

  // 選択されたプロジェクトのラベルを取得します。
  public static getProjectLabels(userId: string, projectId: string): Promise<any> {
    return new Promise((resolve: (res?: any) => void, reject: (res?: any) => void) => {
      const url: string = `${CoreDomain}v1/users/${userId}/projects/${projectId}`;
      const headers: { 'Content-Type': string } = {
        'Content-Type': 'application/json'
      };
      axios.get(url, { headers, withCredentials: true }).then((res: any) => {
        resolve(res.data);
      }, (res: any) => {
        reject(res);
      });
    });
  }

  // 選択されたラベルを指定データセットに付与します。
  public static putLabelToDataset(userId: string, datasetId: string, selectedLabel: string[]): Promise<any> {
    return new Promise((resolve: (res?: any) => void, reject: (res?: any) => void) => {
      const url: string = `${CoreDomain}v1/users/${userId}/datasets/${datasetId}/metadata/labels`;
      const headers: { 'Content-Type': string } = {
        'Content-Type': 'application/json'
      };
      const params: any = {
        values: selectedLabel
      };
      axios.put(url, params, { headers, withCredentials: true }).then((res: any) => {
        resolve(res.data);
      }, (res: any) => {
        reject(res);
      });
    });
  }

  // 選択されたデータセットのラベルを取得します。
  public static getDatasetLabels(userId: string, datasetId: string): Promise<any> {
    return new Promise((resolve: (res?: any) => void, reject: (res?: any) => void) => {
      const url: string = `${CoreDomain}v1/users/${userId}/datasets/${datasetId}/metadata`;
      const headers: { 'Content-Type': string } = {
        'Content-Type': 'application/json'
      };
      axios.get(url, { headers, withCredentials: true }).then((res: any) => {
        resolve(res.data);
      }, (res: any) => {
        reject(res);
      });
    });
  }

  // プロジェクトにスターをつけます
  public static putStarToProject(userId: string, projectId: string): Promise<any> {
    return new Promise((resolve: (res?: any) => void, reject: (res?: any) => void) => {
      const url: string = `${CoreDomain}v1/users/${userId}/stars/projects/${projectId}`;
      const headers: { 'Content-Type': string } = {
        'Content-Type': 'application/json'
      };
      const params: any = {
      };
      axios.put(url, params, { headers, withCredentials: true }).then((res: any) => {
        resolve(res.data);
      }, (res: any) => {
        reject(res);
      });
    });
  }

  // プロジェクトのスターを外します
  public static deleteStarOfProject(userId: string, projectId: string): Promise<any> {
    return new Promise((resolve: (res?: any) => void, reject: (res?: any) => void) => {
      const url: string = `${CoreDomain}v1/users/${userId}/stars/projects/${projectId}`;
      const headers: { 'Content-Type': string } = {
        'Content-Type': 'application/json'
      };
      axios.delete(url, { headers, withCredentials: true }).then((res: any) => {
        resolve(res.data);
      }, (res: any) => {
        reject(res);
      });
    });
  }

  // ユーザーがスターをつけたプロジェクトを取得します
  public static getStarredProjects(userId: string): Promise<any> {
    return new Promise((resolve: (res?: any) => void, reject: (res?: any) => void) => {
      const url: string = `${CoreDomain}v1/users/${userId}/stars/projects`;
      const headers: { 'Content-Type': string } = {
        'Content-Type': 'application/json'
      };
      axios.get(url, { headers, withCredentials: true }).then((res: any) => {
        resolve(res.data);
      }, (res: any) => {
        reject(res);
      });
    });
  }

  // 指定したプロジェクトのスター数を取得します
  public static getStarCount(userId: string, projectId: string): Promise<any> {
    return new Promise((resolve: (res?: any) => void, reject: (res?: any) => void) => {
      const url: string = `${CoreDomain}v1/users/${userId}/stars/projects/${projectId}`;
      const headers: { 'Content-Type': string } = {
        'Content-Type': 'application/json'
      };
      axios.get(url, { headers, withCredentials: true }).then((res: any) => {
        resolve(res.data);
      }, (res: any) => {
        reject(res);
      });
    });
  }

  // データセットアップロードエラー内容を取得します
  public static getUploadErrorMessage(uploadErrorCode: number): Promise<any> {
    return new Promise((resolve: (res?: any) => void, reject: (res?: any) => void) => {
      const url: string = `/console/error/dataset/${uploadErrorCode}.json`;
      axios.get(url, { withCredentials: true }).then((res: any) => {
        resolve(res.data);
      }, (res: any) => {
        reject(res);
      });
    });
  }

  // データセットのオリジナルファイルを取得します
  public static getOriginalFile(userId: string, datasetId: string, row: string, column: string): Promise<any> {
    return new Promise((resolve: (res?: any) => void, reject: (res?: any) => void) => {
      const url: string = `${CoreDomain}v1/users/${userId}/datasets/${datasetId}/original?row=${row}&column=${column}`;
      const headers: { 'Content-Type': string } = {
        'Content-Type': 'application/json'
      };
      axios.get(url, { headers, withCredentials: true }).then((res: any) => {
        resolve(res.data);
      }, (res: any) => {
        reject(res);
      });
    });
  }

  // テナント名を変更します
  public static updateTenantName(userId: string, tenantId: string, nickname: string): Promise<any> {
    return new Promise((resolve: (res?: any) => void, reject: (res?: any) => void) => {
      const url: string = `${CoreDomain}v1/users/${userId}/tenants/${tenantId}/nickname`;
      const params: any = {
        nickname: nickname
      };
      const headers: { 'Content-Type': string } = {
        'Content-Type': 'application/json'
      };
      axios.put(url, params, { headers, withCredentials: true }).then((res: any) => {
        resolve();
      }, (res: any) => {
        reject(res);
      });
    });
  }

  public static getAPIList(userId: string, tenantId: string, limit: string, nextPageToken?: string): Promise<IGetClassifiers> {
    return new Promise((resolve: (res?: any) => void, reject: (res?: any) => void) => {
      const url: string = `${CoreDomain}v1/users/${userId}/classifiers`;
      const headers: { 'Content-Type': string } = {
        'Content-Type': 'application/json'
      };
      const queryParams: any = {
        tenant_id: tenantId,
        limit: limit
      };
      if (nextPageToken) {
        queryParams.next_page_token = nextPageToken;
      }
      axios.get(url, { params: queryParams, headers, withCredentials: true }).then((res: any) => {
        resolve(res.data);
      }, (res: any) => {
        reject(res);
      });
    });
  }

  public static getCredentials(encryptedText: string, datasetName: string, datasetSize: number): Promise<any> {
    return new Promise((resolve: (res?: any) => void, reject: (res?: any) => void) => {
      const url: string = `${CoreDomain}v1/misc/credential`;
      const headers: { 'Content-Type': string } = {
        'Content-Type': 'application/json'
      };
      const queryParams: any = {
        encrypted_text: encryptedText,
        dataset_name: datasetName,
        dataset_size: datasetSize
      };
      axios.get(url, { params: queryParams, headers, withCredentials: true }).then((res: any) => {
        resolve(res.data);
      }, (res: any) => {
        reject(res);
      });
    });
  }

  public static updatePublishStatus(userId: string, classifierId: string, isPublic: boolean): Promise<{}> {
    return new Promise((resolve: (res: {}) => void, reject: (res: AxiosError) => void) => {
      const url: string = `${CoreDomain}v1/users/${userId}/classifiers/${classifierId}/api`;
      const headers: { 'content-type': string } = {
        'content-type': 'application/json'
      };
      const params: any = {
        public: isPublic
      };
      axios.put(url, params, {  headers, withCredentials: true }).then((res: any) => {
        resolve(res.data);
      }, (res: any) => {
        reject(res);
      });
    });
  }

  public static updateApi(userId: string, classifierId: string, projectId: string, jobId: number, serverSpec: IServerSpec): Promise<{}> {
    return new Promise((resolve: (res: {}) => void, reject: (res: AxiosError) => void) => {
      const url: string = `${CoreDomain}v1/users/${userId}/classifiers/${classifierId}`;
      const headers: { 'content-type': string } = {
        'content-type': 'application/json'
      };
      const params: any = {
        project_id: projectId,
        job_id: jobId,
        server_spec: serverSpec
      };
      axios.put(url, params, { headers, withCredentials: true }).then((res: any) => {
        resolve(res.data);
      }, (res: any) => {
        reject(res);
      });
    });
  }

  public static getAPIMetrics(userId: string, classifierId: string, startTime: number, endTime: number, period: number, name?: string): Promise<IGetMetrics> {
    return new Promise((resolve: (res?: any) => void, reject: (res?: any) => void) => {
      const url: string = `${CoreDomain}v1/users/${userId}/classifiers/${classifierId}/metrics`;
      const headers: { 'Content-Type': string } = {
        'Content-Type': 'application/json'
      };
      const queryParams: any = {
        start_time: startTime,
        end_time: endTime,
        period: period
      };
      if (name) {
        queryParams.name = name;
      }
      axios.get(url, { params: queryParams, headers, withCredentials: true }).then((res: any) => {
        resolve(res.data);
      }, (res: any) => {
        reject(res);
      });
    });
  }

  public static deleteApi(userId: string, classifierId: string): Promise<void> {
    return new Promise((resolve: () => void, reject: (res: any) => void) => {
      const url: string = `${CoreDomain}v1/users/${userId}/classifiers/${classifierId}`;
      const headers: { 'content-type': string } = {
        'content-type': 'application/json'
      };
      axios.delete(url, { headers, withCredentials: true }).then((res: any) => {
        resolve();
      }, (res: any) => {
        reject(res);
      });
    });
  }

  public static getSupportContents(userId: string): Promise<ISupport[]> {
    return new Promise((resolve: (res: ISupport[]) => void, reject: (res: AxiosError) => void) => {
      const url: string = `${CoreDomain}v1/users/${userId}/info/support_contents`;
      const headers: { 'Content-Type': string } = {
        'Content-Type': 'application/json'
      };
      const queryParams: ISupportContentsRequest = {
        locale: 'ja-JP'
      };
      axios.get(url, { params: queryParams, headers, withCredentials: true }).then((res: AxiosResponse<ISupportContents>) => {
        const contentsList: ISupport[] = [];
        res.data.support_contents.forEach((supportContent: ISupportContent) => {
          supportContent.text.forEach((_text: string) => {
            contentsList.push({
              contentType: supportContent.content_type,
              text: _text
            });
          });
        });
        resolve(contentsList);
        return;
      }, (res: AxiosError) => {
        reject(res);
      });
    });
  }

  public static async getAvailableInstance(userId: string, tenantId: string): Promise<{train: IInstance[], evaluate: IInstance[]}> {
    const url: string = `${CoreDomain}v1/users/${userId}/tenants/${tenantId}/instance`;
    const response: AxiosResponse<IGetInstance> = await axios.get(url, { withCredentials: true });
    return {
      train: response.data.instance_type.train.filter((instance: IInstanceType) => instance.available && !instance.deprecated).map((instance: IInstanceType) => {
        return {
          ...instance,
          instanceType: instance.instance_type
        };
      }),
      evaluate: response.data.instance_type.evaluate.filter((instance: IInstanceType) => instance.available && !instance.deprecated).map((instance: IInstanceType) => {
        return {
          ...instance,
          instanceType: instance.instance_type
        };
      })
    };
  }

  public static async getWorkflows(userId: string, tenantId: string, nextPageToken?: string): Promise<{nextPageToken: string, workflows: IWorkflow[]}> {
    const url: string = `${CoreDomain}v1/users/${userId}/tenants/${tenantId}/workflows`;
    const queryParams: {next_page_token?: string} = {
      next_page_token: nextPageToken
    };
    const response: AxiosResponse<IWorkflows> = await axios.get(url, { params: queryParams, withCredentials: true });
    return {
      nextPageToken: response.data.pagination ? response.data.pagination.next_page_token : '',
      workflows: response.data.workflows.map(workflow => {
        return {
          id: workflow.workflow_id,
          name: workflow.name,
          pipelineIds: workflow.pipeline_ids,
          dataSources: workflow.data_sources.map(data => {
            return {
              name: data.name,
              trigger: !!data.trigger
            };
          }),
          updateDatetime: workflow.update_at,
          isSendMail: workflow.email_notification
        };
      })
    };
  }

  public static async getPipelines(userId: string, tenantId: string, nextPageToken?: string): Promise<{pipelines: IPipeline[], nextPageToken: string}> {
    const url: string = `${CoreDomain}v1/users/${userId}/tenants/${tenantId}/pipelines`;
    const queryParams: {next_page_token?: string} = {
      next_page_token: nextPageToken
    };
    const response: AxiosResponse<IPipelines> = await axios.get(url, { params: queryParams, withCredentials: true });
    return {
      pipelines: response.data.pipelines.map(pipeline => {
        return {
          id: pipeline.pipeline_id,
          name: pipeline.pipeline_name,
          projectId: pipeline.project_id,
          trainInstance: pipeline.train_instance_type,
          evaluateInstance: pipeline.evaluate_instance_type,
          preProcessScriptId: pipeline.pre_process_script_id || '',
          postProcessScriptId: pipeline.post_process_script_id || '',
          resultFiles: pipeline.result_files.filter((file: string) => file !== DEFAULT_DOWNLOAD_FILE_NAME)
        };
      }),
      nextPageToken: response.data.pagination ? response.data.pagination.next_page_token || '' : ''
    };
  }

  public static async getWorkflowJobs(userId: string, tenantId: string, workflowId: string, nextPageToken?: string): Promise<{jobs: IWorkflowJob[], nextPageToken: string}> {
    const url: string = `${CoreDomain}v1/users/${userId}/tenants/${tenantId}/workflows/${workflowId}/jobs`;
    const queryParams: {next_page_token?: string} = {
      next_page_token: nextPageToken
    };
    const response: AxiosResponse<IWorkflowJobs> = await axios.get(url, { params: queryParams, withCredentials: true });
    return {
      jobs: response.data.jobs.map(job => {
        return {
          workflowId: job.workflow_id,
          jobId: job.job_id,
          jobName: job.job_name,
          status: job.status,
          startAt: job.start_at,
          endAt: job.end_at
        };
      }),
      nextPageToken: response.data.pagination ? response.data.pagination.next_page_token || '' : ''
    };
  }

  public static async getWorkflowJob(userId: string, tenantId: string, workflowId: string, jobId: string): Promise<IDetailJob> {
    const url: string = `${CoreDomain}v1/users/${userId}/tenants/${tenantId}/workflows/${workflowId}/jobs/${jobId}`;
    const response: AxiosResponse<ICoreWorkflowJob> = await axios.get(url, { withCredentials: true });
    const executions: ICoreDetailJob[] = response.data.executions;
    if (executions.length) {
      return {
        jobId: executions[0].job_id,
        pipelineId: executions[0].pipeline_id,
        executionId: executions[0].execution_id,
        status: executions[0].status,
        lastTask: executions[0].last_task || '',
        startAt: executions[0].start_at,
        endAt: executions[0].end_at || 0,
        tasks: executions[0].tasks.map(_task => {
          return {
            name: _task.task_name,
            status: _task.status,
            startAt: _task.start_at,
            endAt: _task.end_at || 0
          };
        }).sort((a: {name: string, status: string, startAt: number, endAt: number}, b: {name: string, status: string, startAt: number, endAt: number}) => {
          return a.startAt - b.startAt;
        }),
        errorDetails: response.data.error
      };
    } else {
      return {} as IDetailJob;
    }
  }

  public static async suspendWorkflowJob(userId: string, tenantId: string, workflowId: string, jobId: string): Promise<void> {
    const url: string = `${CoreDomain}v1/users/${userId}/tenants/${tenantId}/workflows/${workflowId}/jobs/${jobId}/suspend`;
    const headers: { 'content-type': string } = {
      'content-type': 'application/json'
    };
    const params: {} = {};
    await axios.post(url, params, { headers, withCredentials: true });
  }

  public static async resumeWorkflowJob(userId: string, tenantId: string, workflowId: string, jobId: string): Promise<void> {
    const url: string = `${CoreDomain}v1/users/${userId}/tenants/${tenantId}/workflows/${workflowId}/jobs/${jobId}/resume`;
    const headers: { 'content-type': string } = {
      'content-type': 'application/json'
    };
    const params: {} = {};
    await axios.post(url, params, { headers, withCredentials: true });
  }

  public static async updatePipeline(userId: string, tenantId: string, pipeline: IPipeline): Promise<void> {
    const url: string = `${CoreDomain}v1/users/${userId}/tenants/${tenantId}/pipelines/${pipeline.id}`;
    const headers: { 'content-type': string } = {
      'content-type': 'application/json'
    };
    const resultFiles: string[] = JSON.parse(JSON.stringify(pipeline.resultFiles));
    resultFiles.push(DEFAULT_DOWNLOAD_FILE_NAME);
    const params: IUpdatePipelineRequest = {
      pipeline_name: pipeline.name,
      project_id: pipeline.projectId,
      train_instance_type: pipeline.trainInstance,
      evaluate_instance_type: pipeline.evaluateInstance,
      pre_process_script_id: pipeline.preProcessScriptId ? pipeline.preProcessScriptId : undefined,
      post_process_script_id: pipeline.postProcessScriptId ? pipeline.postProcessScriptId : undefined,
      result_files: resultFiles
    };
    await axios.put(url, params, { headers, withCredentials: true });
  }

  public static async updateWorkflow(userId: string, tenantId: string, workflow: IWorkflow): Promise<void> {
    const url: string = `${CoreDomain}v1/users/${userId}/tenants/${tenantId}/workflows/${workflow.id}`;
    const headers: { 'content-type': string } = {
      'content-type': 'application/json'
    };
    const params: IUpdateWorkflowRequest = {
      name: workflow.name,
      pipeline_ids: workflow.pipelineIds,
      data_sources: workflow.dataSources,
      email_notification: workflow.isSendMail
    };
    await axios.put(url, params, { headers, withCredentials: true });
  }

  public static async deleteWorkflow(userId: string, tenantId: string, workflowId: string): Promise<void> {
    const url: string = `${CoreDomain}v1/users/${userId}/tenants/${tenantId}/workflows/${workflowId}`;
    const headers: { 'content-type': string } = {
      'content-type': 'application/json'
    };
    await axios.delete(url, { headers, withCredentials: true });
  }

  public static async deletePipeline(userId: string, tenantId: string, pipelineId: string): Promise<void> {
    const url: string = `${CoreDomain}v1/users/${userId}/tenants/${tenantId}/pipelines/${pipelineId}`;
    const headers: { 'content-type': string } = {
      'content-type': 'application/json'
    };
    await axios.delete(url, { headers, withCredentials: true });
  }

  public static async getScripts(userId: string, tenantId: string, nextPageToken?: string): Promise<{scripts: IScript[], nextPageToken: string}> {
    const url: string = `${CoreDomain}v1/users/${userId}/tenants/${tenantId}/pipeline_scripts`;
    const queryParams: {next_page_token?: string} = {
      next_page_token: nextPageToken
    };
    const response: AxiosResponse<IGetScripts> = await axios.get(url, { params: queryParams, withCredentials: true });
    return {
      scripts: response.data.scripts.map((script: ICoreScript) => {
        return {
          fileName: script.file_name,
          scriptId: script.script_id,
          status: script.status,
          updateDatetime: script.update_at
        };
      }),
      nextPageToken: response.data.pagination ? response.data.pagination.next_page_token : ''
    };
  }

  public static async createScript(userId: string, tenantId: string, isPreprocess: boolean): Promise<IGetUrlToUploadScript> {
    const url: string = `${CoreDomain}v1/users/${userId}/tenants/${tenantId}/pipeline_scripts`;
    const headers: { 'content-type': string } = {
      'content-type': 'application/json'
    };
    const params: IGetUrlToUploadScriptRequest = {
      file_name: isPreprocess ? PIPELINE_SCRIPT.PRE_PROCESS : PIPELINE_SCRIPT.POST_PROCESS
    };
    const response: AxiosResponse<IGetUrlToUploadScriptResponse> = await axios.post(url, params, { headers, withCredentials: true });
    return {
      scriptId: response.data.script_id,
      fileName: response.data.file_name,
      uploadUrl: response.data.upload_url,
      accessKeyId: response.data.access_key_id,
      secretAccessKey: response.data.secret_access_key,
      sessionToken: response.data.session_token
    };
  }

  public static async updateScript(userId: string, tenantId: string, scriptId: string): Promise<IGetUrlToUploadScript> {
    const url: string = `${CoreDomain}v1/users/${userId}/tenants/${tenantId}/pipeline_scripts/${scriptId}`;
    const headers: { 'content-type': string } = {
      'content-type': 'application/json'
    };
    const response: AxiosResponse<IGetUrlToUploadScriptResponse> = await axios.put(url, {}, { headers, withCredentials: true });
    return {
      scriptId: response.data.script_id,
      fileName: response.data.file_name,
      uploadUrl: response.data.upload_url,
      accessKeyId: response.data.access_key_id,
      secretAccessKey: response.data.secret_access_key,
      sessionToken: response.data.session_token
    };
  }

  public static async downloadScript(userId: string, tenantId: string, scriptId: string): Promise<{downloadUrl: string}> {
    const url: string = `${CoreDomain}v1/users/${userId}/tenants/${tenantId}/pipeline_scripts/${scriptId}/download`;
    const response: AxiosResponse<IDownloadScript> = await axios.get(url, { withCredentials: true });
    return {
      downloadUrl: response.data.download_url
    };
  }

  public static async generateUrlToUploadDataSource(userId: string, tenantId: string, workflowId: string, name: string, fileName: string): Promise<IGenerateUrlToUploadDataSource> {
    const url: string = `${CoreDomain}v1/users/${userId}/tenants/${tenantId}/workflows/${workflowId}/data_sources`;
    const params: IGenerateUrlToUploadDataSourceRequest = {
      data_sources: [{
        name,
        upload_filename: fileName
      }]
    };
    const headers: { 'Content-Type': string } = {
      'Content-Type': 'application/json'
    };
    const response: AxiosResponse<IGenerateUrlToUploadDataSourceResponse> = await axios.post(url, params, { headers, withCredentials: true });
    const _data: IUploadDataSource = response.data.data_sources[0];
    return {
      name: _data.name,
      uploadUrl: _data.upload_url,
      uploadFileName: _data.upload_filename,
      accessKeyId: _data.access_key_id,
      secretAccessKey: _data.secret_access_key,
      sessionToken: _data.session_token
    };
  }

  public static async downloadResults(userId: string, tenantId: string, workflowId: string, jobId: string): Promise<{files: IDownloadResult[]}> {
    const url: string = `${CoreDomain}v1/users/${userId}/tenants/${tenantId}/workflows/${workflowId}/jobs/${jobId}/download`;
    const response: AxiosResponse<{results: IDownloadResults[]}> = await axios.get(url, { withCredentials: true });
    return {
      files: response.data.results[0].files.map((file: IDownloadFile) => {
        return {
          name: file.name,
          url: file.download_url,
          error: file.error
        };
      })
    };
  }
}
