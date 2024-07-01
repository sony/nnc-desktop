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


import os

class UdtcapConsts():
    EXTEND_MODULE_DIR_NAME = os.path.join(
        os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),"src")

    LOCAL_DIR_NAME = os.path.join(os.path.expanduser("~"), "nncd_bucket")
    DB_PATH = os.path.join(LOCAL_DIR_NAME, "db", 'nncd.db')
    DATASETS_DIR_NAME = os.path.join(LOCAL_DIR_NAME, "nncd-datasets-rdc")
    CACHE_DIR_NAME = os.path.join(LOCAL_DIR_NAME, "nncd-dataset-cache-rdc")
    DATASET_OUTPUT_CSV = 'index.csv'

    MAX_RETRY_CNT = 3
    POOL_PROCESSES = 5
    CACHE_FILE_SIZE = 25
    META_FILE_NUM = 4

    IMAGE_CONTENT_TYPE = ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.tif', '.tiff', '.dcm']
    AUDIO_CONTENT_TYPE = ['.wav']
    PLOT_CONTENT_TYPE = ['.csv']

consts = UdtcapConsts()