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

from enum import Enum

# sample project's user_id
SAMPLE_USER_ID = 3
SAMPLE_TENANT_ID = 'ccbf15a0-bcb6-4ba6-b10e-27fc877c4348'

STATUS_FILE_SUFFIX = "_status.json"
LOG_FILE_SUFFIX = "_log.txt"

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

# tenant plan for free trail
MAX_PROJECT_NUM = 100
FREE_WROKSPACE_GB = 10
SERVICE_FREE = 1

# the result file formats after training
NNP_FILENAME_PREFIX = 'result'
NNP_FORMAT_NNP = 'nnp'
NNP_FORMAT_NNB = 'nnb'
NNP_FORMAT_ONNX = 'onnx'
NNP_FORMAT_PB = 'pb'
NNP_FORMAT_NNP_RESULT = 'nnp_result'
NNP_FORMAT_LEGACY = 'nnp_legacy'
NNP_FORMAT_NNP_LAST = 'nnp_last'
NNP_FORMAT_NNP_BEST = 'nnp_best'

NETWORK_CONFIGURATION_FORMATS = [
    {
        'file_name': 'result_train.nnp',
        'name': NNP_FORMAT_NNP,
        'description': {
            'en-US': 'NNP(Neural Network Libraries file format)',
            'ja-JP': 'NNP(Neural Network Libraries file format)'
        }
    },
    {
        'file_name': 'result_evaluate.nnp',
        'name': NNP_FORMAT_NNP_RESULT,
        'description': {
            'en-US': 'NNP + Evaluation result',
            'ja-JP': 'NNP + Evaluation result'
        }
    },
    {
        'file_name': 'result.nnb',
        'name': NNP_FORMAT_NNB,
        'description': {
            'en-US': 'NNB(NNabla C Runtime file format)',
            'ja-JP': 'NNB(NNabla C Runtime file format)'
        }
    },
    {
        'file_name': 'result.onnx',
        'name': NNP_FORMAT_ONNX,
        'description': {
            'en-US': 'ONNX',
            'ja-JP': 'ONNX'
        }
    },
    {
        'file_name': 'result.nnp',
        'name': NNP_FORMAT_LEGACY,
        'description': {
            'en-US': 'NNP(Neural Network Libraries file format)',
            'ja-JP': 'NNP(Neural Network Libraries file format)'
        }
    },
    {
        'file_name': 'result_train_best.nnp',
        'name': NNP_FORMAT_NNP_BEST,
        'description': {
            'en-US': 'NNP of the best epoch',
            'ja-JP': 'NNP of the best epoch'
        }
    },
    {
        'file_name': 'result_train_last.nnp',
        'name': NNP_FORMAT_NNP_LAST,
        'description': {
            'en-US': 'NNP of the last epoch',
            'ja-JP': 'NNP of the last epoch'
        }
    },
    {
        'file_name': 'result.pb',
        'name': NNP_FORMAT_PB,
        'description': {
            'en-US': 'Tensorflow frozen graph',
            'ja-JP': 'Tensorflow frozen graph'
        }
    }
]

# configuration update interval 30s
LOCK_DURATION_SEC = 30

UPDATE_CONFIG_STATUS_LOCKED = "locked"
UPDATE_CONFIG_STATUS_OK = "ok"

# metadata name
class MetadataName(Enum):
    OUTPUT_ACCURACY = 'output_accuracy'
    OUTPUT_AVG_PRECISION = 'output_avg_precision'
    OUTPUT_AVG_RECALL = 'output_avg_recall'
    OUTPUT_AVG_F_MEASURES = 'output_avg_f_measures'
    OWNER_NICKNAME = 'nickname'


# System-defined numeric metadata name
NUMERIC_METADATA_NAMES = [
    'project_id', 'dataset_id', 'dataset_number', 'parent_project_id',
    'network_statistics_output', 'network_statistics_cost_parameter', 'network_statistics_cost_add',
    'network_statistics_cost_multiply', 'network_statistics_cost_multiply_add', 'network_statistics_cost_division',
    'network_statistics_cost_exp', 'network_statistics_cost_if', 'output_accuracy', 'output_avg_precision',
    'output_avg_recall', 'output_avg_f_measures'
]

# System-defined metadata namer
SYSTEM_METADATA_NAMES = NUMERIC_METADATA_NAMES + [
    'dataset_type', 'dataset_shape', 'name', 'access_scope', 'description',
    MetadataName.OWNER_NICKNAME.value, 'copy_count'
]

class InstanceType(Enum):
    CPU = 0x00000001
    KEPER_GPU_1 = 0x00000002
    VOLTA_GPU_1 = 0x00000003
    VOLTA_GPU_4 = 0x00000004
    VOLTA_GPU_8 = 0x00000005
INSTANCE_TYPE_MASK = 0x0000FFFF

BASE_JOB_NAME_FOR_IMPORT_PROJECT = 'This job is for pre-trained weight'

# import project
IMPORT_PROJECT_NAME = 'project.data'
IMPORT_TMP_NNP = 'import.nnp'
IMPORT_TMP_NNP_WITH_WEIGHT = 'import_with_weight.nnp'


class ImportStatus():
    READY = 'ready'
    PROCESSING = 'processing'
    FAILED = 'failed'
    COMPLETED = 'completed'


# PLUGIN
MAX_SUM_OF_INPUT_FILES_FOR_LAMBDA_PLUGIN = 100 * 1024 * 1024

# remoteResG info
remoteResG_SSH_HOST = 'remoteResG'