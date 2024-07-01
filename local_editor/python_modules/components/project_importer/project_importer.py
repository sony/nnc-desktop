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
import json
import zipfile
import tempfile
import traceback

from conf import settings
from utils import path_util
from conf.consts import IMPORT_TMP_NNP, IMPORT_TMP_NNP_WITH_WEIGHT, ImportStatus
from components.project_importer import file_util
from components.project_importer.base_task import BaseTask
from components.project_importer.console_cli import ConsoleCli
from components.project_importer.exceptions import ImportProjectError
from components.project_importer.sdcproj_updater import SdcprojUpdater
from components.project_importer.nncd_console_cli import NNcdConsoleCli


class ProjectImporter(BaseTask):
    def __init__(self, project_id: int, configuration_format: str, src_file_path:str,
                 dst_configuration_file_path: str, dst_nnp_dir_path: str) -> None:
        super(ProjectImporter, self).__init__()
        self.project_id = project_id
        self.configuration_format = configuration_format
        self.src_file_path = src_file_path
        self.dst_configuration_file_path = dst_configuration_file_path
        self.dst_nnp_dir_path = dst_nnp_dir_path
    
    def exec(self):
        import_file_path = os.path.join(self.dst_nnp_dir_path, f'original.{self.configuration_format}')
        file_util.copy(self.src_file_path, import_file_path)
        # Converts the specified file to an NNTXT file
        nnp_file_path = os.path.join(self.dst_nnp_dir_path, 'network.nnp')
        nntxt_file_path = os.path.join(self.dst_nnp_dir_path, 'network.nntxt')
        sdcproj_file_path = os.path.join(self.dst_nnp_dir_path, 'network.sdcproj')
        
        if self.configuration_format == 'prototxt':
            # caffe's prototxt is a special process 
            # because nnabla_cli's convert cannot be used
            # Convert from PROTOTXT to SDCPORJ
            NNcdConsoleCli.import_caffe(import_file_path, sdcproj_file_path)
            # Create NNP file, In the subsequent processing, 
            # the weight (parameter.protobuf) included in the NNP file is referenced.
            # Create a dummy empty nnp file because weight information is not included in prototxt
            file_util.create_empty_nnp(nnp_file_path)
        else:
            # Convert specified file to NNP and extract NNTXT inside
            ConsoleCli.convert(import_file_path, nnp_file_path)
            file_util.extract_nntxt(nnp_file_path, 'network.nntxt', self.dst_nnp_dir_path)
            # Convert NNTXT to SDCPORJ
            NNcdConsoleCli.import_nntxt(nntxt_file_path, sdcproj_file_path)
        
        # Check whether the learning result is included
        output_nnp_file_path = f'{self.dst_nnp_dir_path}/{IMPORT_TMP_NNP}'
        with zipfile.ZipFile(nnp_file_path) as zf:
            info = zf.getinfo("parameter.protobuf")
            if info.file_size != 0:
                output_nnp_file_path = f'{self.dst_nnp_dir_path}/{IMPORT_TMP_NNP_WITH_WEIGHT}'

        file_util.copy(sdcproj_file_path, self.dst_configuration_file_path)
        file_util.copy(nnp_file_path, output_nnp_file_path)

    def do(self):
        self._update_status(ImportStatus.PROCESSING)
        self.exec()
        self._update_status(ImportStatus.COMPLETED)

    def on_failure(self, error: Exception):
        msg = error.msg if isinstance(error, ImportProjectError) else 'Internal Server Error.'
        self._update_status(ImportStatus.FAILED, error_msg=msg)

    def _update_status(self, status, error_msg=None):
        new_status = {'import_status': status, 'import_error_msg': error_msg}
        status_file_path = path_util.make_import_status_json_path(self.project_id)
        if os.path.exists(status_file_path):
            status = json.load(open(status_file_path, 'r'))
            status.update(new_status)
            json.dump(status, open(status_file_path, 'w'))
        else:
            json.dump(new_status, open(status_file_path, 'w'))


def handle(project_id: int, configuration_format: str, src_file_path: str,
           dst_configuration_file_path: str, dst_nnp_dir_path: str):
    ProjectImporter(
        project_id, configuration_format, src_file_path,
        dst_configuration_file_path, dst_nnp_dir_path
    ).run()
    SdcprojUpdater(project_id, dst_nnp_dir_path).run()
