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
import shutil
import csv
from typing import Optional
from conf import settings, consts



class ProjectFile(object):
    project_dir = settings.PROJECTS_DIR

    def __init__(self, file_format: str, project_id: int,
                 job_or_report_id: Optional[int] = None, file_name: str=None):
        """
        :param file_format: 'configuration', 'sdcproj', 'prototxt',
                            'nntxt', 'onnx', 'results', 'reports
        """
        self.file_format = file_format
        self.project_id = str(project_id)
        self.job_or_report_id_str = "project" if job_or_report_id is None else str(job_or_report_id)

        if self.file_format not in ["results", "reports"]:
            self.file_name = f"data.{file_format}"
        else:
            self.file_name = file_name

        self.file_dir_path = self._make_path()

    def _make_path(self):
        if self.file_format in ['configuration', 'sdcproj', 'prototxt', 'nntxt', 'onnx']:
            path = getattr(self, "_config_file_path")
        elif self.file_format == "results":
            path = getattr(self, "_results_file_path")
        elif self.file_format == "reports":
            path = getattr(self, "_reports_file_path")
        else:
            path = ""
        return os.path.join(self.project_dir, path) 

    @property
    def _config_file_path(self):
        return os.path.join(self.project_id, 'configurations', self.job_or_report_id_str)
    
    @property
    def _results_file_path(self):
        return os.path.join(self.project_id, 'results', self.job_or_report_id_str)

    @property
    def _reports_file_path(self):
        return os.path.join(self.project_id, 'reports', self.job_or_report_id_str)

    @property
    def full_path(self):
        return os.path.join(self.file_dir_path, self.file_name)

    def copy(self, dst):
        src_file_path = os.path.join(self.file_dir_path, self.file_name)
        if not os.path.exists(src_file_path):
            return
        if not os.path.exists(dst.file_dir_path):
            os.makedirs(dst.file_dir_path)
        dst_file_path = os.path.join(dst.file_dir_path, self.file_name)

        shutil.copy(src_file_path, dst_file_path)
    
    def write(self, data, mode: str="w"):
        file_path = os.path.join(self.file_dir_path, self.file_name)
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        with open(file_path, mode) as f:
            f.write(data)
        return file_path

    def read(self):
        file_path = os.path.join(self.file_dir_path, self.file_name)
        if not os.path.exists(file_path):
            return
        with open(file_path, "r") as f:
            data = f.read()
        return data

    def exist(self):
        path = os.path.join(self.file_dir_path, self.file_name)
        return os.path.exists(path)

    def remove(self, file_or_dir):
        if file_or_dir is str:
            file_or_dir = [file_or_dir]
        for name in file_or_dir:
            path = os.path.join(self.file_dir_path, name)
            if not os.path.exists(path):
                continue
            if os.path.isdir(path):
                shutil.rmtree(path)
            else:
                os.remove(path)
    
    @property
    def content_length(self):
        path = os.path.join(self.file_dir_path, self.file_name)
        return os.path.getsize(path)


class DatasetFile():
    dataset_dir = settings.DATASETS_DIR
    def __init__(self, tenant_id: str, dataset_id: int, row: int, column: int):
        self.tenant_id = tenant_id
        self.dataset_id = dataset_id
        self.row = row
        self.column = column
        
        self.file_path = self._make_path()

    def _make_path(self):
        name, _ = os.path.splitext(consts.DATASET_OUTPUT_CSV)
        file_name = os.path.join('page', f"{name}_{self.column}_{self.row}.cache.json")
        return os.path.normpath(f"{self.dataset_dir}/{self.tenant_id}/{self.dataset_id}/{file_name}")
    
    def read(self):
        if not os.path.exists(self.file_path):
            return 
        with open(self.file_path, "r") as f:
            data = f.read()
        return data


def format_stock_file(origin: str, stockfile: str):
    def _is_float_str(num_str: str) -> bool:
        try:
            float(num_str)
            return True
        except ValueError:
            return False
        
    def _is_absolute_or_s3(path):
        return os.path.isabs(path) or path.startswith("s3://")

    def _need_change_path(record):
        if not record.find(".") > -1 or _is_absolute_or_s3(record):
            return False

        extension = record.rsplit('.', 1)[1].lower()
        return not _is_float_str(extension) and extension in (consts.CSV_EXTENSION, *consts.DATA_CONTENT_TYPE.keys())
    
    with open(origin, mode="r") as infile, \
        open(stockfile, mode="w", encoding="utf-8", newline="") as outfile:
        
        reader = csv.reader(infile)
        writer = csv.writer(outfile)
        base_path = os.path.dirname(origin)

        # skip header
        header = next(reader)
        writer.writerow(header)

        for row in reader:
            processed_row = [
                os.path.abspath(os.path.join(base_path, cell)) if _need_change_path(cell)
                else cell
                for cell in row
            ]
            writer.writerow(processed_row)