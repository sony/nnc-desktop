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
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import text from '../../messages/Text';
import Loading2 from '../Loading2.vue';
import { TextType } from '../../interfaces/common';
import { IDetailJob, IWorkflowJob, JobStatus } from '../../store/state/pipeline';
import { ChartUtil } from '../../util/ChartUtil';
import { DateFormatUtil } from '../../util/DateFormatUtil';

const SUSPENDABLE_WORKFLOW_STATUS: JobStatus[] = [
  'waiting',
  'copying_data_sources',
  'running',
  'copying_result',
  'notification'
];

@Component({
  name: 'PipelineRightPane',
  components: {
    Loading2
  }
})
export default class PipelineRightPane extends Vue {
  @Prop() public language!: string;
  @Prop() public isLoading!: boolean;
  @Prop() public workflowJobList!: IWorkflowJob[];
  @Prop() public detailWorkflowJob!: IDetailJob & {jobsStatus: JobStatus};
  @Prop() public selectedJobId!: string;

  public updated() {
    this.workflowJobList.forEach((workflowJob: IWorkflowJob, i: number) => {
      this.drawJobProgressChart(i, workflowJob.status);
    });
  }

  public parseTime(unixTime: number): string {
    // unixTimeをミリ秒に変換する必要がある
    const date: Date = new Date(unixTime * 1000);
    const year: number = date.getUTCFullYear();
    const month: string = DateFormatUtil.addZeroPadding(String(date.getUTCMonth() + 1));
    const day: string = DateFormatUtil.addZeroPadding(String(date.getUTCDate()));
    const hour: string = DateFormatUtil.addZeroPadding(String(date.getUTCHours()));
    const minute: string = DateFormatUtil.addZeroPadding(String(date.getUTCMinutes()));
    const second: string = DateFormatUtil.addZeroPadding(String(date.getUTCSeconds()));
    return `${year}-${month}-${day}T${hour}:${minute}:${second}Z`;
  }

  private drawJobProgressChart(index: number, status: string) {
    const elementId: string = 'job-history-progress-' + String(index);
    const element: HTMLCanvasElement = document.getElementById(elementId) as HTMLCanvasElement;
    if (!element) {
      return;
    }
    const ctx: CanvasRenderingContext2D = element.getContext('2d') as CanvasRenderingContext2D;
    ctx.canvas.width = 24;
    ctx.canvas.height = 24;
    const type = status === 'finished' ? 'evaluate' : '';
    ChartUtil.drawJobProgressChart(ctx, 0, 0, status, type);
  }

  get vueTexts(): TextType {
    return text[this.language].vueTexts.pipeline;
  }

  get dialogTexts(): TextType {
    return text[this.language].dialogTexts;
  }

  get suspendable(): boolean {
    return SUSPENDABLE_WORKFLOW_STATUS.includes(this.detailWorkflowJob.jobsStatus);
  }

  get resumable(): boolean {
    return this.detailWorkflowJob.jobsStatus === 'suspended';
  }

  get downloadable(): boolean {
    return this.detailWorkflowJob.status === 'finished' && this.detailWorkflowJob.jobsStatus === 'finished';
  }

}
