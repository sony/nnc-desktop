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

import Chart from 'chart.js';

export class ChartUtil {

  public static drawJobProgressChart(
    ctx: CanvasRenderingContext2D,
    current: number,
    max: number,
    status: string,
    type?: string,
    deleted?: boolean
  ): void {

    if (!ctx) {
      return;
    }

    let progressColor: string = '#006699';
    let remainingColor: string = '#c2d9e5';

    if (status === 'suspended' || status === 'failed') {
      remainingColor = '#D8D8D8';
    }

    if (deleted) {
      progressColor = '#D8D8D8';
    }

    let progress: number = 0;
    let chartType: string = 'doughnut';
    if ((status === 'finished' && type === 'evaluate') || deleted) {
      progress = 100;
      chartType = 'pie';
    } else {
      if (max > 0) {
        progress = Math.round((current / max) * 100);
      }
    }

    const remaining: number = 100 - progress;

    const chart: Chart = new Chart(ctx, {
      type: chartType,
      data: {
        labels: ['progress', 'remaining'],
        datasets: [{
          backgroundColor: [progressColor, remainingColor],
          data: [progress, remaining]
          }
        ]
      },
      options: {
        events: [],
        animation: {
          duration: 0
        },
        elements: {
          arc: {
            borderWidth: 0
          }
        },
        tooltips: { enabled: false },
        responsive: false,
        legend: { display: false }
      }
    });
    if ((status === 'finished' && type === 'evaluate') || deleted) {
      const evaluatedIcon: HTMLImageElement = new Image();
      evaluatedIcon.onload = () => {
        ctx.drawImage(evaluatedIcon, 0, 0, 24, 24);
      };
      evaluatedIcon.src = deleted ? '/console/image/RemoveWhite.svg' : '/console/image/CheckWhite.svg';
    }
  }

  public static drawResourceUtilizationChart(
    ctx: CanvasRenderingContext2D,
    used: number,
    max: number
  ): Chart {

    const remaining: number = max - used;
    return new Chart(ctx, {
      type: 'doughnut',
      data: {
        datasets: [{
          backgroundColor: ['#006699', '#D8D8D8'],
          data: [used, remaining]
        }]
      },
      options: {
        tooltips: {
          enabled: false
        },
        cutoutPercentage: 98,
        elements: {
          arc: {
            borderWidth: 0
          }
        },
        responsive: false,
        legend: { display: false }
      }
    });
  }

  private static calcWeekDate(): string[] {
    const today: Date = new Date();
    const dates: string[] = [];
    const RANGE: number = 6;
    for (let i: number = 0; i <= RANGE; i++) {
      dates.unshift(`${today.getMonth() + 1}/${today.getDate()}`);
      today.setDate(today.getDate() - 1);
    }
    return dates;
  }

}
