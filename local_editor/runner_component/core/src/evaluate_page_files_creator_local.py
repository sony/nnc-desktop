#! /usr/bin/env python3.6
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


import sys
import shutil
import os

from logging import getLogger

from chalicelib.nncd.common.errors import CODE
from chalicelib.nncd.common.exceptions import NNcdException
from chalicelib.nncd.common.logger import NNcdLogger
from nncd.batch.csv_reader import CsvReader
from nncd.batch.paging_files import PagingFiles
from nncd.batch.s3_csv_files import LocalOutputResultCsvFile
from nncd.batch.s3_csv_files import LocalInferResultCsvFile
from nncd.batch.url_embedder import UrlEmbedder
from local_util import consts as local_consts
from local_util.consts import PathType

logger = getLogger("evaluate_page_files_creator")

COLUMN_NUM_PER_PAGE = 10
ROW_NUM_PER_PAGE = 10
LOCAL_MAPPING_DIR = local_consts.LOCAL_MAPPING_DIR
LOCAL_PROJECTS_BUCKET = local_consts.LOCAL_PROJECTS_BUCKET


class Content:
    def __init__(self, project_id, job_id, tenant_id, dataset_id):
        self.project_id = project_id
        self.job_id = job_id
        self.tenant_id = tenant_id
        self.dataset_id = dataset_id

    def delete_local_page_files(self, page_full_path):
        print(f'delete all under {page_full_path}')
        if os.path.exists(page_full_path):
            try:
                shutil.rmtree(page_full_path)
                return True
            except Exception:
                raise Exception(f'failed to delete all under {page_full_path}')
        return True

    def create_page_files(self, job_type='evaluate'):
        csv_object = None
        if job_type == 'evaluate':
            csv_object = LocalOutputResultCsvFile(self.project_id, self.job_id)
        if job_type == 'inference':
            csv_object = LocalInferResultCsvFile(self.project_id, self.job_id)
        if not csv_object:
            raise Exception(f'Unsupported type for creating page files: {job_type}')
        # csv_object.bucket_name=f'{local_consts.LOCAL_MAPPING_DIR}/{local_consts.LOCAL_PROJECTS_BUCKET}'
        paging_files = PagingFiles(
            csv_object.bucket_name,
            csv_object.page_path,
            csv_object.file_name_wo_ext,
            COLUMN_NUM_PER_PAGE, ROW_NUM_PER_PAGE,
            PathType.LOCAL
        )
        try:
            page_full_path = f'{csv_object.bucket_name}/{csv_object.page_path}'
            is_delete = self.delete_local_page_files(page_full_path)
            if is_delete:
                os.makedirs(page_full_path)
                csv_reader = CsvReader(csv_object)
                for line in UrlEmbedder.embed(
                        csv_reader, self.project_id, self.job_id,
                        self.tenant_id, self.dataset_id, PathType.LOCAL, job_type
                ):
                    paging_files.write(line)
                NNcdLogger.debug(message='finished read line')
                paging_files.flush()
        except Exception:
                raise
        finally:
            paging_files.finish()


def main(args):
    """
    :return:
    """

    if len(args) != 4:
        Exception('Invalid parameter. Check project id, job id, tenant id and dataset id.')
    
    project_id = args[1]
    job_id = args[2]
    tenant_id = args[3]
    dataset_id = args[4]

    contents = Content(project_id, job_id, tenant_id, dataset_id)
    contents.create_page_files()


if __name__ == '__main__':
    try:
        main(sys.argv)
    except Exception:
        import traceback
        logger.error(traceback.format_exc())
        sys.exit(1)

    sys.exit(0)
