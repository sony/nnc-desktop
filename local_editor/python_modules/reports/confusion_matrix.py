# Copyright 2024 Sony Group Corporation.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import csv
import json
import os
import re

VARIABLE_PATTERN = '([^\s]+) - .+'
ACCURACY = "Accuracy"
AVG_PRECISION = 'Avg.Precision'
AVG_RECALL = "Avg.Recall"
AVG_F_MEASURES = "Avg.F-Measures"
CSV_FILE_NAME = 'confusion_matrix_{}.csv'


class ConfusionMatrix:
    """
    Convert confusion_matrix.json to csv format for summary creation
    """
    def __init__(self, variable_name: str, accuracy: [],
                avg_precision: [], avg_recall: [], avg_f_measures: []):
        self.variable_name = variable_name
        self.accuracy = accuracy
        self.avg_precision = avg_precision
        self.avg_recall = avg_recall
        self.avg_f_measures = avg_f_measures

    @classmethod
    def load_json(cls, file_data_json: str):
        cm_json = json.loads(file_data_json, parse_float=str)
        for k, rows in cm_json.items():
            variable = re.match(VARIABLE_PATTERN, k).groups()[0]
            # Extract only items used for summaries
            yield ConfusionMatrix(
                variable,
                cls._get_value(ACCURACY, rows),
                cls._get_value(AVG_PRECISION, rows),
                cls._get_value(AVG_RECALL, rows),
                cls._get_value(AVG_F_MEASURES, rows)
            )
    
    @classmethod
    def _get_value(cls, item_name: str, rows: dict):
        for row in rows:
            if row[0] == item_name:
                return row
        raise Exception("Unexpected confusion matrix format")

    def write_file(self, outpout_dir=None):
        file_name = CSV_FILE_NAME.format(self.variable_name)
        output_file = os.path.join(outpout_dir or ".", file_name)
        with open(output_file, "w") as f:
            writer = csv.writer(f, lineterminator="\n")
            writer.writerow(self.accuracy)
            writer.writerow(self.avg_precision)
            writer.writerow(self.avg_recall)
            writer.writerow(self.avg_f_measures)
        return output_file