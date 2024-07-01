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

import re
from logging import getLogger

from chalicelib.nncd.common.exceptions import NNcdException
from chalicelib.nncd.core.common import consts, s3util
from nncd.batch import local_path_adaptor
from local_util.cache_json_data_convert import CacheJsonData
from local_util import consts as local_consts
from local_util.consts import PathType

logger = getLogger(__name__)


class UrlEmbedder(object):
    def __init__(self):
        pass

    @classmethod
    def embed(cls, csv_reader, project_id, job_id, tenant_id, dataset_id,
              path_type=PathType.AWS, job_type='evaluate'):
        # CSVに含まれれている画像もしくCSVのパスに対して、それらを画像にしたもの(BASE64エンコードしたもの)を埋め込む。
        # また、列をリスト形式にして行単位で返すイテラブルなオブジェクトを返す
        data_types = None
        for columns in csv_reader.read_rows(skip_header=True):
            if data_types is None:
                data_types = cls._get_data_type(columns)

            yield cls.handle_line(data_types, columns, project_id, job_id, tenant_id, dataset_id, path_type, job_type)
        return

    @classmethod
    def handle_line(cls, data_types, columns, project_id, job_id, tenant_id, dataset_id, path_type, job_type):
        new_columns = []
        for col_num, data_type in enumerate(data_types):
            col_data = dict()
            mime_type = consts.DATA_CONTENT_TYPE.get(data_type)
            if data_type == consts.CSV_EXTENSION:
                mime_type = consts.CSV_EXTENSION
            # 画像 or CSVは,S3パスを生成
            if data_type in consts.DATA_CONTENT_TYPE.keys() or data_type == consts.CSV_EXTENSION:
                if re.match(r"(\.[/\\])*data[/\\].*", columns[col_num]):
                    # ./dataで始まるパスは入力データ
                    if path_type == PathType.AWS:
                        key = s3util.make_s3_dataset_path(columns[col_num], tenant_id, dataset_id)
                        bucket_name = consts.DATASETS_BUCKET_NAME
                    else:
                        key = local_path_adaptor.make_local_dataset_path(
                            columns[col_num], tenant_id, dataset_id)
                        bucket_name = local_consts.LOCAL_DATASETS_BUCKET
                else:
                    # ./output(./data始まり以外)で始まるパスは出力データ
                    if path_type == PathType.AWS:
                        key = s3util.make_s3_project_file_path(columns[col_num], project_id, job_id)
                        bucket_name = consts.PROJECTS_BUCKET_NAME
                    else:
                        key = local_path_adaptor.make_local_project_file_path(
                            columns[col_num], project_id, job_id)
                        bucket_name = local_consts.LOCAL_PROJECTS_BUCKET
                try:
                    if path_type == PathType.AWS:
                        col_data['data'] = f's3://{bucket_name}/{key}'
                    else:
                        if job_type == 'evaluate':
                            col_data['data'] = f'{local_consts.LOCAL_MAPPING_DIR}/{bucket_name}/{key}'
                        else:
                            if col_num == 0:
                                col_data['path'] = columns[col_num]
                                col_data['data'] = columns[col_num]
                            else:
                                col_data['data'] = f'{local_consts.LOCAL_MAPPING_DIR}/{bucket_name}/{key}'
                        encodedData = CacheJsonData(col_data['data']).to_base64()
                        if encodedData:
                            col_data['data'] = encodedData
                            mime_type = 'image/png'
                        # 转换data 并替换type为 image/png
                except NNcdException as e:
                    print(f'download failed({key}) = {e}')
                    col_data['data'] = ""
            else:
                # 画像,CSV以外はテキストとして扱う(変換なし)
                mime_type = 'text/plain'
                col_data['data'] = columns[col_num]

            col_data['type'] = mime_type
            new_columns.append(col_data)
        return new_columns

    @classmethod
    def _get_data_type(cls, record):
        # CSV1レコードの各カラムのデータタイプを格納
        data_type = []
        for column in record:
            # 拡張子(.)の有無をチェック
            if column.find(".") > -1:
                extension = column.rsplit('.', 1)[1]
                if not cls._is_float_str(extension.lower()):
                    # 拡張子(.)以降が文字列のものはリストに登録
                    data_type.append(extension)
                else:
                    # 該当しないものはテキストとしてリストに登録
                    data_type.append('text')
            else:
                # 拡張子(.)が無いものはテキストとしてリストに登録
                data_type.append('text')
        return data_type

    @classmethod
    def _is_float_str(cls, num_str: str) -> bool:
        try:
            # 対象データが数字かチェック
            float(num_str)
            return True
        except ValueError:
            return False
