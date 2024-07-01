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

# -*- coding: utf-8 -*-
import os

PROJECTS_BUCKET_NAME = os.environ.get('')
DATASETS_BUCKET_NAME = os.environ.get('')

OBJECT_RANGE_SIZE = int(os.environ.get('CSV_READ_RANGE', 99999))
INFER_RESULT_CSV = 'infer_result.csv'
OUTPUT_RESULT_CSV = 'output_result.csv'
DATASET_OUTPUT_CSV = 'index.csv'
CONFUSION_MATRIX = 'confusion_matrix.json'
REPORT_FILE = 'monitoring_report.yml'
NNP_FILE = 'result.nnp'
DATA_CONTENT_TYPE = {
    'bmp': 'image/bmp',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'tif': 'image/tiff',
    'tiff': 'image/tiff',
    'dcm': 'image/dicom',
    'wav': 'audio/wav'
}
CSV_EXTENSION = 'csv'

DEFAULT_RETRY_COUNT = 3
RETRY_DELAY_SEC = 1
