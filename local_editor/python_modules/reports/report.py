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
import configparser
import re
import html
from tempfile import TemporaryDirectory
from reports.nncd_console_cli import NNcdConsleCli
from reports import export_html


class Report:
    def __init__(self, config, num_network):
        self.config = config
        self.num_network = num_network

    @classmethod
    def load_from_sdcproj(cls, file_path):
        with TemporaryDirectory() as temp:
            output_of_complete = os.path.join(temp, "complete.sdcproj")
            NNcdConsleCli().complete(file_path, output_of_complete)
            config = configparser.ConfigParser()
            config.optionxform = str
            config.read(output_of_complete)

            # If there is only one network, add Global because it is deleted
            if 'Global' not in config:
                config['Global'] = {}
                num_network = 1
            else:
                num_network = int(config["Global"]["NumNetwork"])  
        return Report(config, num_network)          
    
    def set_project_name(self, project_name: str):
        self.config['Global']['ProjectName'] = project_name
    
    def get_network_names(self):
        for n in range(self.num_network):
            network = self.config['Global'].get(f'Network_{n}')
            if network is None:
                if n == 0:
                    network = ''
                else:
                    raise Exception("Invalid report fole format")
            yield network

    def make_network_image_path(self, base_path: str):
        for n, network_name in enumerate(self.get_network_names()):
            if network_name:
                network_name += "_"
            section_name = "{}Network_Global".format(network_name)
            file_path = os.path.join(base_path, f'network_{n}.png')
            self.config[section_name]['Image'] = file_path

    def make_result_section(self, base_path: str, confusion_matrix_paths: []):
        if not confusion_matrix_paths:
            confusion_matrix_paths = []
        learning_curve_path = os.path.join(base_path, "learning_curve.png")
        self.config['Result'] = {
            "LearningCurve_Image": learning_curve_path,
            "NumConfusionMatrix": len(confusion_matrix_paths)
        }
        for i, path in enumerate(confusion_matrix_paths):
            self.config['Result'][f"ConfusionMatrix_{i}"] = path
    
    def clear_result_section(self):
        if "Result" in self.config:
            del self.config['Result']
    
    def set_references(self, references: dict):
        self.config["Reference"] = {
            "NumReference": len(references)
        }
        for i, reference in enumerate(references):
            self.config["Reference"][f"ReferenceLayer_{i}"] = html.escape(reference['ReferenceLayer'])
            self.config["Reference"][f"Reference_{i}"] = html.escape(reference['Reference'])

    def write_ini_file(self, output_file: str):
        with open(output_file, "w") as f:
            self.config.write(f, space_around_delimiters=False)

    def export_html(self, input_path: str, output_path: str,
                    nickname: str=None, import_url: str=None):
        class Args:
            pass
        args = Args()
        args.input = input_path
        args.output = output_path
        args.nickname = nickname
        args.import_url = import_url
        export_html.create_html_report(args)


    def find_dataset_ids_of_datasets(self):
        if "Dataset" not in self.config:
            return
        num_dataset = int(self.config['Dataset']['Num'])
        for i in range(num_dataset):
            dataset_config = self.config[f'Dataset_{i}']
            dataset_uri = dataset_config["URI"]
            if not dataset_uri:
                continue
            dataset_id = self._get_dataset_id_from_uri(dataset_uri)
            if dataset_id:
                yield dataset_id
            
    @classmethod
    def _get_dataset_id_from_uri(cls, uri: str):
        m = re.match('[a-z0-9]{8}(?:-[a-z0-9]{4}){3}-[a-z0-9]{12}/(.*)', uri)
        if m:
            return m.group(1)
        return None
