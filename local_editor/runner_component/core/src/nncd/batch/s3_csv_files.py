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
from logging import getLogger

from chalicelib.nncd.core.common import s3util, consts
from local_util import consts as local_consts

logger = getLogger(__name__)


class S3File(object):
    def __init__(self, bucket_name, file_name):
        self.bucket_name = bucket_name
        self.file_name = file_name

    @property
    def base_path(self):
        pass

    @property
    def file_name_wo_ext(self):
        base_name, _ = os.path.splitext(self.file_name)
        return base_name

    def get_content_length(self):
        print(f'get_content_length {self.bucket_name}, {self.file_name}')
        return s3util.get_content_length(
            self.bucket_name, f'{self.base_path}/{self.file_name}'
        )

    def get_partial_date(self, offset, limit):
        return s3util.get_object_range(
            self.bucket_name, f'{self.base_path}/{self.file_name}',
            offset, limit
        )

    @property
    def page_path(self):
        return self.base_path + '/page'

    def __str__(self):
        return f'S3File({self.bucket_name}, {self.file_name})'


class LocalFile(object):
    def __init__(self, bucket_name, file_name):
        self.bucket_name = bucket_name
        self.file_name = file_name

    @property
    def base_relative_path(self):
        pass

    @property
    def file_name_wo_ext(self):
        base_name, _ = os.path.splitext(self.file_name)
        return base_name

    def get_content_length(self):
        print(f'get_content_length {self.bucket_name}, {self.file_name}')
        return os.path.getsize(f'{self.bucket_name}/{self.base_relative_path}/{self.file_name}')

    def get_partial_date(self, offset, limit):
        try:
            key = f'{self.bucket_name}/{self.base_relative_path}/{self.file_name}'
            with open(key, 'rb') as f:
                f.seek(offset, 0)
                data = f.read(limit)
        except Exception:
            return
        return data

    @property
    def page_path(self):
        return self.base_relative_path + '/page'

    def __str__(self):
        return f'LocalFile({self.bucket_name}, {self.file_name})'


class IndexCsvFile(S3File):
    def __init__(self, tenant_id, dataset_id):
        super().__init__(s3util.DATASETS_BUCKET_NAME, consts.DATASET_OUTPUT_CSV)
        self.tenant_id = tenant_id
        self.dataset_id = dataset_id

    @property
    def base_path(self):
        output_csv_path = s3util.make_dataset_dir_path(self.tenant_id, self.dataset_id)
        return output_csv_path[:output_csv_path.rindex('/')]

    def __str__(self):
        return f'IndexCsvFile({super().__str__()})'


class OutputResultCsvFile(S3File):
    def __init__(self, project_id, job_id):
        super().__init__(s3util.PROJECTS_BUCKET_NAME, consts.OUTPUT_RESULT_CSV)
        self.project_id = project_id
        self.job_id = job_id

    @property
    def base_path(self):
        return s3util.make_result_dir_path(self.project_id, self.job_id)

    def __str__(self):
        return f'OutputResultCsvFile({super().__str__()})'


class LocalOutputResultCsvFile(LocalFile):
    def __init__(self, project_id, job_id):
        bucket_path = f'{local_consts.LOCAL_MAPPING_DIR}/{local_consts.LOCAL_PROJECTS_BUCKET}'
        super().__init__(bucket_path, consts.OUTPUT_RESULT_CSV)
        self.project_id = project_id
        self.job_id = job_id

    @property
    def base_relative_path(self):
        return f'{self.project_id}/results/{self.job_id}'

    def __str__(self):
        return f'LocalOutputResultCsvFile({super().__str__()})'


class LocalInferResultCsvFile(LocalFile):
    def __init__(self, project_id, job_id):
        bucket_path = f'{local_consts.LOCAL_MAPPING_DIR}/{local_consts.LOCAL_PROJECTS_BUCKET}'
        super().__init__(bucket_path, consts.INFER_RESULT_CSV)
        self.project_id = project_id
        self.job_id = job_id

    @property
    def base_relative_path(self):
        return f'{self.project_id}/results/{self.job_id}'
    
    @property
    def page_path(self):
        return self.base_relative_path + '/infer_page'

    def __str__(self):
        return f'LocalInferResultCsvFile({super().__str__()})'