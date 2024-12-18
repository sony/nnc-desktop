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

#
# upload dataset and convert dataset cache and page data

import os
import sys
import csv
import json
import shutil
import traceback
import subprocess
from datetime import datetime, timezone
from retrying import retry
from subprocess import Popen, PIPE

from utils.consts import consts
from utils import dataset_check_util
from utils.logger import Logger, Code, BaseError
from utils.sqlite3db import Datasets, db

sys.path.append(consts.EXTEND_MODULE_DIR_NAME)
from nncd.batch.csv_reader import CsvReader
from nncd.batch.paging_files import PagingFiles
from nncd.batch.url_embedder import UrlEmbedder
from nncd.batch.s3_csv_files import UserFile
from local_util.consts import PathType

PROCESS_BLOCK = 2
SLEEP_INTERVAL_SEC = 5
COLUMN_NUM_PER_PAGE = 10
ROW_NUM_PER_PAGE = 10
EXTRACT_COMPLATED = 100.0

logger = Logger()


def _delete_page_files(page_full_path):
    logger.info(f"[delete all under {page_full_path}]")
    if os.path.exists(page_full_path):
        try:
            shutil.rmtree(page_full_path)
            return True
        except Exception:
            raise Exception(f"failed to delete all under {page_full_path}")
    return True


def _get_folder_size(folder_path: str, size=0):
    for root, _, files in os.walk(folder_path):
        for filename in files:
            size += os.path.getsize(os.path.join(root, filename))
    return size


class ConvertStatus:

    def __init__(self, destination: str):

        paths = destination.split(os.sep)
        self.tenant_id = paths[-2]
        self.dataset_id = paths[-1]

        self.status = Datasets._meta.EXTRACTING
        self.copy_status = Datasets._meta.NONE
        self.cache_status = Datasets._meta.NONE
        self.cache_progress = 0

        self.csv_header = None
        self.csv_columns = 0
        self.csv_records = 0

        self.uploaded_size = 0

        self.progress = 0
        self.finished = False

        self.error_code = None
        self.message = None

    def update(self, uploaded_obj: dict):
        if self.finished:
            raise BaseError("inconsistent operation", Code.E_NNCD_STATUS_ERROR)

        if "size" in uploaded_obj:
            self.uploaded_size += uploaded_obj["size"]

        if "csv_header" in uploaded_obj:
            self.csv_header = uploaded_obj["csv_header"]
            self.csv_columns = uploaded_obj["csv_columns"]
            self.csv_records = uploaded_obj["csv_records"]

        if "cache_status" in uploaded_obj:
            self.cache_status = uploaded_obj["cache_status"]
            self.cache_progress = uploaded_obj["cache_progress"]

    def update_error(self, error_code: str, message: str):
        self.error_code = error_code
        self.message = message

    @retry(stop_max_attempt_number=consts.MAX_RETRY_CNT)
    def write(self, progress: int = None):
        if self.finished:
            raise BaseError("inconsistent operation", Code.E_NNCD_STATUS_ERROR)

        if progress:
            self.progress = progress

        update_data = {
            "status": self.status,
            "copy_status": self.copy_status,
            "cache_status": self.cache_status,
            "cache_progress": self.cache_progress,
            "header": self.csv_header,
            "column_num": self.csv_columns,
            "data_num": self.csv_records,
            "extract_progress": self.progress,
            "storage_used": self.uploaded_size,
        }

        if self.error_code:
            update_data["error_code"] = self.error_code

        res = (
            Datasets.update(update_data)
            .where(Datasets.dataset_id == self.dataset_id, Datasets.deleted == False)
            .execute()
        )
        if not res:
            logger.error("failed to write the Datasets table.")

        self.finished = self.status in ["completed", "failed"]

    def check(self):
        return True if self.csv_header else False

    def complete(self):
        if self.finished:
            raise BaseError("inconsistent operation", Code.E_NNCD_STATUS_ERROR)
        self.status = "completed"
        self.end_time = datetime.now(timezone.utc).isoformat()

    def failed(self):
        if self.finished:
            raise BaseError("inconsistent operation", Code.E_NNCD_STATUS_ERROR)
        self.status = "failed"
        self.uploaded_size = 0
        self.end_time = datetime.now(timezone.utc).isoformat()


def _get_status_from_csv(filename: str):
    # check dataset
    last_error = dict()
    try:
        dataset_check_util.check_csv_data(filename)
    except BaseError as e:
        last_error["last_error"] = {"code": e.code, "message": str(e)}
    if last_error:
        return last_error

    # read csv file
    with open(filename, "r") as f:
        reader = csv.reader(f)
        header = next(reader)
        column_num = len(header)
        line_num = 0
        for line in reader:
            if line:
                line_num += 1

    return {
        "csv_header": ",".join(header),
        "csv_columns": column_num,
        "csv_records": line_num,
    }


@retry(stop_max_attempt_number=consts.MAX_RETRY_CNT)
def init_status(cache_dir: str, index_file_path: str):
    logger.info('[BEGIN] "Initinalize cache file {}"'.format(cache_dir))

    status = ConvertStatus(cache_dir)
    status.write(progress=0)
    try:
        index_csv_path = index_file_path

        result = _get_status_from_csv(index_csv_path)
        if "last_error" in result:
            last_error = result["last_error"]
            raise BaseError(last_error["message"], last_error["code"])
        status.update(result)

        if not status.check():
            raise BaseError("Dataset not found.", Code.E_DATASET_NOT_FOUND)
        status.update(
            {
                "copy_status": Datasets._meta.COMPLETED,
                "cache_status": Datasets._meta.READY,
                "cache_progress": 50,
            }
        )
        status.write(progress=30)
    except Exception as e:
        if isinstance(e, BaseError):
            status.update_error(getattr(e, "code"), str(e))
        status.failed()
        status.write()
        raise

    logger.info(f'[EXTRACT] "extract csv file({index_csv_path})"')

    return status


def create_dataset_cache(status, cache_dir, index_file_path):
    logger.info("[Create dataset cache] {}".format(cache_dir))

    # chack cache_dir exists
    os.makedirs(cache_dir, exist_ok=True)

    try:
        console_cli_path = os.path.join(
            os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
            "console_cli.py",
        )
        cmd = [
            sys.executable,
            console_cli_path,
            "conv_dataset",
            "-F",
            index_file_path,
            cache_dir,
        ]
        p = subprocess.Popen(cmd, stderr=subprocess.PIPE)

        stderr = p.stderr.read()
        if "Exception" in str(stderr):
            raise BaseError(stderr, Code.E_NNCD_NNABLA_ERROR)
    except:
        status.update_error(
            Code.E_NNCD_NNABLA_ERROR.value, f"Failed to create dataset cache."
        )
        status.failed()
        status.write()
        raise
    finally:
        status.update(
            {
                "size": _get_folder_size(cache_dir),
                "cache_status": Datasets._meta.COMPLETED,
                "cache_progress": 100,
            }
        )

        status.write(progress=60)


def create_dataset_page_data(status, index_file_path):
    logger.info(
        "[Create page files for dataset] '{}/{}'".format(
            status.tenant_id, status.dataset_id
        )
    )

    csv_object = UserFile(index_file_path)
    page_path = os.path.join(status.tenant_id, status.dataset_id, "page")
    # create page data
    paging_files = PagingFiles(
        consts.DATASETS_DIR_NAME,
        page_path,
        os.path.splitext(consts.DATASET_OUTPUT_CSV)[0],
        COLUMN_NUM_PER_PAGE,
        ROW_NUM_PER_PAGE,
        PathType.LOCAL,
    )

    try:
        page_full_path = os.path.join(consts.DATASETS_DIR_NAME, page_path)
        is_delete = _delete_page_files(page_full_path)
        if is_delete:
            os.makedirs(page_full_path)
            csv_reader = CsvReader(csv_object)
            for line in UrlEmbedder.embed(
                csv_reader,
                None,
                None,
                status.tenant_id,
                status.dataset_id,
                PathType.LOCAL,
            ):
                paging_files.write(line)
            logger.info("finished read line.")
            paging_files.flush()

            # add END file
            with open(os.path.join(page_full_path, "END"), "w") as f:
                f.write(f"{ROW_NUM_PER_PAGE} x {COLUMN_NUM_PER_PAGE}")
    except:
        status.update_error(Code.E_NNCD_NNABLA_ERROR.value, f"Failed to create pages.")
        status.failed()
        status.write()
        raise
    finally:
        paging_files.finish()

        status.update({"size": _get_folder_size(page_full_path)})
        status.complete()
        status.write(progress=100)
        if status is not None and not status.finished:
            logger.error("failed to write final status.")


def main(argv: list):
    logger.start_request()
    try:
        args = json.loads(argv[1])
        dataset_id = args.get("dataset_id")
        tenant_id = args.get("tenant_id")
        index_file_path = args.get("index_file_path")
        if not dataset_id or not tenant_id:
            raise BaseError(
                "Not `dataset_id` or `tenant_id` arg.", Code.E_NNCD_ARGS_ERROR
            )

        cache_dir = os.path.join(consts.CACHE_DIR_NAME, tenant_id, str(dataset_id))

        # init status
        status = init_status(cache_dir, index_file_path)

        # create dataset cache
        create_dataset_cache(status, cache_dir, index_file_path)

        # create page file
        create_dataset_page_data(status, index_file_path)

        logger.info(f'[FINISH] "work done."')

    except BaseError as e:
        logger.error(traceback.format_exc(), code=e.code)
    except:
        logger.error(traceback.format_exc())


if __name__ == "__main__":
    main(sys.argv)
