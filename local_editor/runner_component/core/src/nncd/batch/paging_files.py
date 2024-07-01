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

import json
import os
from retrying import retry

from chalicelib.nncd.common.logger import NNcdLogger
from chalicelib.nncd.core.common import s3util
from nncd.batch.multithread_executor import MultiThreadExecutor, Runner
from local_util.consts import PathType

UPDATING_DURATION = 600
MAX_WAIT_TIME = 600
MAX_RETRY_CNT = 3


class PageFileUploader(Runner):
    def __init__(self, page_file, path_type=PathType.AWS):
        self.page_file = page_file
        self.path_type = path_type

    def run(self):
        if self.path_type == PathType.AWS:
            self.page_file.upload_to_s3()
        else:
            self.page_file.upload_to_localdir()

    def on_success(self):
        pass

    def on_failure(self, exception):
        NNcdLogger.debug(message=f'Failed to update {self.page_file}')


class PageFile(object):
    def __init__(self, bucket, page_path, name, data):
        self.bucket = bucket
        self.page_path = page_path
        self.name = name
        self.data = data

    def _make_cache_json_key(self):
        return f'{self.page_path}/{self.name}.cache.json'

    @retry(stop_max_attempt_number=MAX_RETRY_CNT)
    def upload_to_s3(self):
        key = self._make_cache_json_key()
        s3util.put_object(self.bucket, key, json.dumps(self.data))

    def upload_to_localdir(self):
        key = self._make_cache_json_key()
        key = f'{self.bucket}/{key}'
        dirname = os.path.dirname(key)
        if not os.path.exists(dirname):
            os.makedirs(dirname)
        try:
            with open(key, 'w') as f:
                f.write(json.dumps(self.data))
        except Exception:
            print('failed to write page file to local dir')
            raise

    def __str__(self):
        return f'PageFile {self.bucket}, {self.page_path}, {self.name}'


class PagingFiles(object):
    def __init__(self, bucket_name, page_path, prefix_name, num_columns, num_rows,
                 path_type=PathType.AWS):
        self.bucket_name = bucket_name
        self.page_path = page_path
        self.page_file_ext = '.json'
        self.prefix_name = prefix_name
        self.num_columns = num_columns
        self.num_rows = num_rows
        self.path_type = path_type
        self.pages = None
        self.row = 0
        self.export_file_num = 0
        self.previous_check_time = None
        self.multi_thread_executor = MultiThreadExecutor(10)

    def write(self, line):
        row_each_page = self.divide_page(line)
        if len(row_each_page) == 0:
            return

        if self.pages is None:
            self.pages = [[] for _ in range(len(row_each_page))]

        self.append_pages(row_each_page)

        if self._is_full_row():
            self._export()
            self.pages = None

    def divide_page(self, line):
        return [line[x:x + self.num_columns] for x in range(0, len(line), self.num_columns)]

    def append_pages(self, new_line):
        for i, page in enumerate(new_line):
            self.pages[i].append(page)

    def _is_full_row(self):
        return len(self.pages[0]) >= self.num_rows

    def _export(self):
        if self.pages is None:
            return
        for i, page in enumerate(self.pages):
            column = i * self.num_columns
            page_file = PageFile(
                self.bucket_name, self.page_path,
                f'{self.prefix_name}_{column}_{self.row}', page
            )
            self.multi_thread_executor.execute(
                PageFileUploader(page_file, self.path_type)
            )
        self.row += self.num_rows

    def flush(self):
        NNcdLogger.debug(message='FLUSH')
        self._export()
        self.multi_thread_executor.join()

    def finish(self):
        NNcdLogger.debug(message='FINISH')
        self.multi_thread_executor.shutdown()
        if self.multi_thread_executor.failed:
            raise Exception('Failed to execute async s3 uploading')

    def exists_page(self):
        key = f'{self.page_path}'
        return s3util.object_exists(self.bucket_name, key)

    def delete_page_files(self):
        s3util.delete_all(self.bucket_name, self.page_path)
