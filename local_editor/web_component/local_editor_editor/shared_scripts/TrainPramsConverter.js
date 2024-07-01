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



var convertTrainParams;

var nnc = nnc || {};

(() => {
  convertTrainParams = (params) => { // set global
    var xNum = 1;
    var yNum = 1;
    var rows = 1;
    var colums = 1;
    var maxValue = 0;
    var array = [];
    var splitedParams = params.replace(/\r\n/g, '\n').split('\n');
    var firstLine = splitedParams[0];
    var parsedLine = firstLine.replace(/[\(\)]/g, '').split(',');
    if (parsedLine.length === 2) {
      colums = Number(parsedLine[0]);
      rows = Number(parsedLine[1]);
    } else {
      // 逆さにするときは、0, 1を反対にすればよい。
      xNum = Number(parsedLine[0]);
      yNum = Number(parsedLine[1]);
      rows = Number(parsedLine[2]);
      colums = Number(parsedLine[3]);
    }

    array = new Array(yNum).fill(0);
    for (let y = 0; y < yNum; y++) {
      array[y] = new Array(xNum).fill(0);
      for (let x = 0; x < xNum; x++) {
        array[y][x] = new Array(rows).fill(0);
        for (let row = 0; row < rows; row++) {
          array[y][x][row] = new Array(colums).fill(0);
        }
      }
    }
    // 先頭行はループの対象にしたくないので削除
    splitedParams.shift();
    splitedParams.forEach((line, i) => {
      const lineNum = Number(line);
      if (maxValue < Math.abs(lineNum)) {
        maxValue = Math.abs(lineNum);
      }

      if (parsedLine.length === 2) {
        var row = i % rows;
        var col = Math.floor(i / rows);
        array[0][0][row][col] = lineNum;
      } else {
        var filterNum = rows * colums;
        var outRow = Math.floor(i / (filterNum * xNum));
        var outCol = Math.floor(i / filterNum) % xNum;

        var row = Math.floor(i / colums) % rows;
        var col = i % colums;

        array[outRow][outCol][row][col] = lineNum;
      }
    });
    return {array, maxValue, isLargeWeight: (colums > nnc.Definitions.TRAINING.VISUALIZATION.MAX_WEIGHT || rows > nnc.Definitions.TRAINING.VISUALIZATION.MAX_WEIGHT)};
  };

})();
