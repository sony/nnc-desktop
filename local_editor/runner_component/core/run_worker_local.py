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
import re
import csv
import sys
import json
import time
import shutil
import signal
import psutil
import zipfile
import logging
import hashlib
import requests
import argparse
import traceback
import subprocess
from pathlib import Path
from contextlib import contextmanager

from configparser import ConfigParser
from threading import Thread, Event, Lock
from nnabla.utils.cli.convert import add_convert_command
from nnabla.utils.cli.encode_decode_param import add_decode_param_command 

# for importing chalicelib dir in evaluate_page_files_creator_local
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), "src"))
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from src.job_url_list_local import extract_job_id
from src.confusion_matrix import create_confusion_matrix
from src.infer_result_handle import create_classification_result
from src.evaluate_page_files_creator_local import Content


class Runner(object):
    LOCAL_MAPPING_DIR = os.path.join(os.path.expanduser("~"), 'nncd_bucket')
    LOCAL_PROJECTS_BUCKET = os.path.join(LOCAL_MAPPING_DIR, 'nncd-projects-rdc')
    LOCAL_DATASETS_BUCKET = os.path.join(LOCAL_MAPPING_DIR, 'nncd-datasets-rdc')
    LOCAL_DATASET_CACHE_BUCKET = os.path.join(LOCAL_MAPPING_DIR, 'nncd-dataset-cache-rdc')

    SYNC_LOG = 'rsync_status.log'
    INTERMEDIATE_DIR_NAME = 'outputs'
    INFER_INTERMEDIATE_DIR_NAME = 'infer_outputs'

    LOCAL_UPLOAD_INTERVAL_SEC = 1
    NNABLA_ACTIVE_CHECK_INTERVAL_SEC = 10

    CONVERT_BATCH_SIZE = 1

    # error code
    E_NNABLA_OOM = '50016400'

    # setup
    CONF_SCRIPT_HOME = "/home/nnabla"
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))

    NNABLA_REMOTE_CONF = os.path.join(BASE_DIR, "nnabla_remote.conf")

    TRAIN_NNP = "result_train.nnp"
    TRAIN_BEST_NNP = "result_train_best.nnp"
    TRAIN_LAST_NNP = "result_train_last.nnp"
    EVALUATE_NNP = "result_evaluate.nnp"
    MON_REPORT_YAML = "monitoring_report.yml"
    RESULT_INI = "result.ini"
    FORWARD_RESULT = "output_result.csv"
    INFER_RESULT = "infer_result.csv"
    INFER_INPUTS = "infer_inputs.csv"
    CONFUSION_MATRIX = "confusion_matrix.json"
    PROFILE_RESULT = "profile.csv"
    # MUTATE_SDCPROJ = "data.sdcproj"
    GPU_PARAM_ASSIGN = "gpu_param_assign.csv"
    CPU_PARAM_ASSIGN = "cpu_param_assign.csv"
    GPU_NETWORK_PROTOTXT = "gpu_network.prototxt"
    CPU_NETWORK_PROTOTXT = "cpu_network.prototxt"

    EMPTY_YAML = os.path.join(BASE_DIR, "empty_monitoring_report.yml")

    def __init__(self, args: dict, result_dir: str='/tmp/nncd-local-editor'):
        # args from outside script
        self.task_id = args.get("task_id")
        self.priority = args.get("priority")
        self.instance_group = args.get("instance_group")
        self.nnabla_command = args.get("command")
        self.infer_inputs = args.get("inputs", []) # for inference inputs
        self.infer_header = args.get("infer_header", None) # for inference
        self.parallel_num = args.get("parallel_num")
        self.local_config_file = args.get("config")
        self.local_param_file = args.get("param")
        self.local_dataset_csv = args.get("dataset") # for evaluate/inference "{tenant_id}/{dataset_id}.cache"
        self.local_output_dir = args.get("outdir")
        self.mutate_path = args.get("mutate")
        self.ss_enable = args.get("ss_enable")
        self.ss_attempt_hours = args.get("ss_attempt_hours", 0)
        self.ss_attempt_times = args.get("ss_attempt_times", 0)
        self.multi_mutate_num = args.get("multi_mutate_num", 1)
        self.mutate_base_job_id = args.get("base_job_id")

        # env params
        self.result_dir = result_dir # tmp dir for immediate artifact
        self.WORK_DIR = os.path.join(self.result_dir, "work")
        self.OUTPUT_DIR = os.path.join(self.result_dir, "results")
        for d in [self.WORK_DIR, self.OUTPUT_DIR]:
            shutil.rmtree(d, ignore_errors=True)
            os.makedirs(d, exist_ok=True)

        self.OUTPUT_LOGFILE = f"{self.OUTPUT_DIR}/log.txt"
        self.OUTPUT_STATUSFILE = f"{self.OUTPUT_DIR}/status.json"
        self.OUTPUT_PROGRESS = f"{self.OUTPUT_DIR}/progress.txt"
        self.OUTPUT_RESULT = f"{self.OUTPUT_DIR}/{self.FORWARD_RESULT}"
        self.OUTPUT_PROFILE = f"{self.OUTPUT_DIR}/{self.PROFILE_RESULT}"
        self.INFER_RESULT_PATH = f"{self.OUTPUT_DIR}/{self.INFER_RESULT}"
        self.INFER_INPUTS_PATH = f"{self.OUTPUT_DIR}/{self.INFER_INPUTS}"
        self.WORK_MATRIX = f"{self.WORK_DIR}/{self.CONFUSION_MATRIX}"
        self.OUTPUT_GPU_PARAM_ASSIGN = f"{self.WORK_DIR}/{self.GPU_PARAM_ASSIGN}"
        self.OUTPUT_CPU_PARAM_ASSIGN = f"{self.WORK_DIR}/{self.CPU_PARAM_ASSIGN}"

        self.NNABLA_OOM_CHECKFILE = f"{self.OUTPUT_DIR}/nnabla_oom.txt"

        # Ensure the integrity of json dump file when os kill the main thread
        self.write_json_lock = Lock()
        
        # Avoid errors when calling functions while suspend
        self.sync_train_result_lock = Lock()

    def _init_args(self):
        """Package the following arguments to put inside the block of try exception"""
        self.exit_handler_func = lambda: None
        # set logger config
        self.logger = self._create_logger()

        # check dataset csv
        # TODO: temporarily
        if self.local_dataset_csv:
            os.makedirs(self.result_dir, exist_ok=True)
            self.forward_tenant_id, self.forward_dataset_id =  self.local_dataset_csv.replace('.cache', '').split('/')
            self.local_dataset_csv = f"{self.LOCAL_DATASET_CACHE_BUCKET}/{self.local_dataset_csv}"
        if self.local_dataset_csv and self.local_dataset_csv.endswith(".csv"):
            self.local_dataset_csv = f"{os.path.dirname(self.local_dataset_csv)}.cache"

        # check nnabla_command
        if self.nnabla_command not in ["train", "evaluate", "profile", "inference"]:
            raise ValueError(f"Unknown nnabla command: ${self.nnabla_command}")
        self.job_type = self.nnabla_command
        self.nnabla_command = "forward" if self.nnabla_command in ["evaluate", "inference"] else self.nnabla_command

        self.LOG_FILENAME = f"{self.job_type}_log.txt"
        self.STATUS_FILENAME = f"{self.job_type}_status.json"

        if not self.local_output_dir:
            raise ValueError("Not specified `outdir` parameter.")

        os.makedirs(self.local_output_dir, exist_ok=True)
        self.logger.info(f"mkdir {self.local_output_dir}")

        self.job_id = os.path.basename(self.local_output_dir)
        self.project_id = os.path.basename(
            os.path.dirname(os.path.dirname(self.local_output_dir)))

        # need these args in the subsequent code
        self.sdcproj_file = None
        self.nnabla_command_resume = None
        self.config_file = None
        self.mutate_json = None

        self.threading_event = Event()
        
        # for console_cli and nnabla_cli
        self.console_cli = [sys.executable, "-B", os.path.join(self.BASE_DIR, "console_cli.py")]
        self.console_cli_process = None
        self.nnabla_cli_parser = argparse.ArgumentParser()
        subparser = self.nnabla_cli_parser.add_subparsers()
        add_decode_param_command(subparser)
        add_convert_command(subparser)

        # for nncd_console_cli_util
        self.nncd_console_cwd = os.path.join(self.BASE_DIR, "nncd_console")
        self.nncd_console = "./nncd_console_cli_util"
        if sys.platform == "win32":
            self.nncd_console = os.path.join(self.nncd_console_cwd, "nncd_console_cli_util.exe")
        elif sys.platform == "darwin":
            self.nncd_console = os.path.join(self.nncd_console_cwd, "nncd_console_cli_util_mac")

    def _create_logger(self):
        """create logger and output log file and console."""
        log_level = os.getenv("LOG_LEVEL", "INFO").upper()
        if log_level not in ["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"]:
            log_level = "INFO"

        logger = logging.getLogger("runner")
        
        console_handler = logging.StreamHandler()
        file_handler = logging.FileHandler(self.OUTPUT_LOGFILE, encoding='utf-8')

        fmtter = logging.Formatter('%(asctime)s [worker]: [%(levelname)s]: %(message)s')
        console_handler.setFormatter(fmtter)
        file_handler.setFormatter(fmtter)

        logger.addHandler(console_handler)
        logger.addHandler(file_handler)
        logger.setLevel(log_level)

        return logger

    def _update_status(self, new_status: dict):
        """Update {self.OUTPUT_DIR}/status.json"""
        if not os.path.isfile(self.OUTPUT_STATUSFILE):
            status_json = {}
        else:
            with open(self.OUTPUT_STATUSFILE, "r") as f:
                status_json = json.load(f)

        for k, v in new_status.items():
            if k in status_json and isinstance(v, dict):
                status_json[k].update(v)
            else:
                status_json[k] = v

        # update elapsed
        if "is_update_elapsed" in status_json:
            status_json.pop("is_update_elapsed")
            end_time = status_json.get("end_time", time.time())
            status_json["time"]["elapsed"] = end_time - status_json["start_time"]
        with self.write_json_lock:
            with open(self.OUTPUT_STATUSFILE, "w") as f:
                json.dump(status_json, f)

    def _copy_file(self, src, dst, log=None):
        """copy file and write log.
        :params: log: None, error, info, warning, error or critical
        """
        try:
            shutil.copyfile(src, dst)
            if log is not None:
                func = getattr(self.logger, log)
                func(f"cp '{src}' -> '{dst}'")
        except FileNotFoundError:
            pass

    def _update_settings_conf(self, setting_path, ProcessorType):
        """update settings.ini LocalSDeepProcessorType for gpu/cpu."""
        with open(setting_path, 'r') as f:
            datas = f.readlines()
        with open(setting_path, 'w') as f:
            for i in datas:
                search_data = re.search('LocalSDeepProcessorType=(0|1)\s*', i)
                if search_data:
                    i = i.replace(f'LocalSDeepProcessorType={search_data.group(1)}',
                                f'LocalSDeepProcessorType={ProcessorType}')
                f.write(i)

    def _create_prototxt(self, prototxt_config_file):
        """create *.prototxt config files for gpu and cpu."""

        for param_file, prototxt_file  in prototxt_config_file.items():
            sc_util_cmd = [self.nncd_console, "create_prototxt", '-i', self.sdcproj_file,
                        '-o', prototxt_file, '-p', param_file]
            self.logger.info(' '.join(sc_util_cmd))
            res = subprocess.Popen(sc_util_cmd, stderr=subprocess.PIPE, cwd=self.nncd_console_cwd)
            if res.stderr.read():
                raise RuntimeError(res.stderr.read().decode())
            if not os.path.isfile(prototxt_file):
                raise RuntimeError(f"failed to create file: {prototxt_file}")
            # Expand Dataset URI and Change Dataset Cache Dir
            self._extend_dataset_path(prototxt_file, self.LOCAL_DATASETS_BUCKET, self.LOCAL_DATASET_CACHE_BUCKET)
            self._copy_file(param_file, os.path.join(
                self.local_output_dir, os.path.basename(param_file)))
            self._copy_file(prototxt_file, os.path.join(
                self.local_output_dir, os.path.basename(prototxt_file)))

    def _replace_prototxt_in_nnp(self, nnp_file, new_prototxt):
    # Create a temporary file to store the modified contents of the archive
        temp_zip_path = nnp_file + '.temp'
        with zipfile.ZipFile(nnp_file, 'r') as zip_read:
            with zipfile.ZipFile(temp_zip_path, 'w') as zip_write:
                for item in zip_read.infolist():
                    if item.filename == 'network.prototxt':
                        zip_write.write(new_prototxt, 'network.prototxt')
                    else:
                        zip_write.writestr(item, zip_read.read(item.filename))
        # replace original *.nnp file.
        os.replace(temp_zip_path, nnp_file)
    
    def _extend_dataset_path(self, raw_config_txt, dataset_bucket, dataset_cache_bucket):
        with open(raw_config_txt, "r") as f:
            config_content = f.readlines()
        tenant_id = dataset_id = None
        for i, line in enumerate(config_content):
            no_space_l = line.replace(" ", '')
            # find dataset line and modify uri and cache_dir
            if no_space_l.startswith("uri:"):
                split_list = line.split('"')
                if len(split_list) == 3:
                    tenant_id, dataset_id = split_list[1].split("/")
                if tenant_id and dataset_id:
                    dataset_path = os.path.join(
                        dataset_bucket, tenant_id, dataset_id, "index.csv")
                    config_content[i] = '"'.join(
                        [split_list[0], dataset_path.replace("\\", "\\\\"), split_list[2]])
            if no_space_l.startswith("cache_dir:"):
                split_list = line.split('"')
                if not tenant_id or not dataset_id:
                    cache_path = os.path.join(
                        dataset_cache_bucket, "unknown")
                else:
                    cache_path = os.path.join(
                        dataset_cache_bucket, tenant_id, f"{dataset_id}.cache")
                config_content[i] = '"'.join(
                    [split_list[0], cache_path.replace("\\", "\\\\"), split_list[2]])
                # Ensure Cache Parent Directory
                os.makedirs(os.path.dirname(
                    config_content[i].split('"')[1]), exist_ok=True)
        with open(raw_config_txt, 'w') as f:
            f.writelines(config_content)
        self.logger.debug(
                f"expand dataset cache dir in {raw_config_txt}")

    def _get_current_or_best_nnp(self, prefix, from_dir, else_value=None):
        nnp_list = sorted(
            [i for i in os.listdir(from_dir) if i.startswith(prefix)],
            key=lambda x: int(os.path.splitext(x)[0].split("_")[-1]))
        return nnp_list[0] if nnp_list else else_value 

    def init_log_and_status_file(self):
        """initialize log.txt and status.json."""
        current_timestamp = time.time()
        status_json = {
            "task_id": self.task_id,
            "type": self.job_type,
            "status": "preprocessing",
            "start_time": current_timestamp,
            "update_timestamp": current_timestamp,
            "priority": self.priority,
            "instance_group": self.instance_group
        }
        if self.job_type == "train":
            status_json.update({
                "monitoring_report": {},
                "epoch": {"current": 0, "max": 0},
                "best": {},
                "last": {},
                "time": {"elapsed": 0, "prediction": 0}
            })
        elif self.job_type == "evaluate":
            status_json.update({
                "data": {"current": 0, "max": 0},
                "time": {"elapsed": 0, "prediction": 0}
            })
        elif self.job_type == "inference":
            status_json.update({
                "data": {"current": 0, "max": 0},
                "time": {"elapsed": 0, "prediction": 0}
            })
        self._update_status(status_json)

    def preprocess_exit_handler(self):
        """Process failed."""
        self.threading_event.set()
        self.logger.error("failed to preprocessing.")
        current_timestamp = time.time()
        status_json = {
            "status": "failed",
            "end_time": current_timestamp,
            "update_timestamp": current_timestamp,
            "is_update_elapsed": True
        }
        self._update_status(status_json)

        self._copy_file(self.OUTPUT_STATUSFILE, os.path.join(
            self.local_output_dir, self.STATUS_FILENAME))
        self._copy_file(self.OUTPUT_LOGFILE, os.path.join(
            self.local_output_dir, self.LOG_FILENAME))

    def get_sdcproj(self):
        """neural network configuration
        get sdcproj.
        """

        if self.local_config_file is None:
            return
        config_filename = os.path.basename(self.local_config_file)
        if not config_filename.endswith("sdcproj"):
            return
        self.sdcproj_file = os.path.join(self.WORK_DIR, config_filename)
        if self.mutate_path:
            self.logger.info(
                "Network structure auto searching, mutate .sdcproj")
            mutate_csv = os.path.join(
                self.WORK_DIR, "mutate", "candidates.csv")
            mutate_sdcproj_dir = os.path.join(
                self.WORK_DIR, "mutate", "sdcproj")
            os.makedirs(mutate_sdcproj_dir, exist_ok=True)

            # create csv
            mutate_data_file = os.path.basename(self.mutate_path)
            mutate_dst_path = os.path.join(self.WORK_DIR, mutate_data_file)
            self._copy_file(self.mutate_path, mutate_dst_path, log="debug")
            os.remove(self.mutate_path)
            with open(mutate_dst_path, "r") as f:
                self.mutate_json = json.load(f)
            base_dir = self.mutate_json.get("base_dir")
            mutate_csv_data = []
            mutate_path_list = []
            if base_dir:
                for i in self.mutate_json["candidates"]:
                    mutate_csv_data.append([
                        os.path.join(mutate_sdcproj_dir, f"{i[0]}.sdcproj"),
                        i[2], i[3]])
                    mutate_path_list.append([
                        os.path.join(base_dir, i[1]),
                        os.path.join(mutate_sdcproj_dir, f"{i[0]}.sdcproj")])
            else:
                for i in self.mutate_json["candidates"]:
                    mutate_csv_data.append([
                        os.path.join(mutate_sdcproj_dir,
                                     f"{i['job_id']}.sdcproj"),
                        i["best_valid_error"], i["cost_multiply_add"]])
                    mutate_path_list.append([
                        i["sdcproj_path"],
                        os.path.join(mutate_sdcproj_dir, f"{i['job_id']}.sdcproj")])

            # nncd_console_cli_util can't read 1 LINE CSV FILE
            if len(mutate_csv_data) == 1:
                mutate_csv_data *= 2
            # DOWNLOAD SDCPROJ
            self.logger.info("Download mutate network candidates")
            for src, dst in mutate_path_list:
                self._copy_file(src, dst, log="debug")
                if not (os.path.isfile(dst) and os.path.getsize(dst)):
                    self.logger.warning(
                        f"{src}: empty sdcproj, remove from candidates.")
                    mutate_csv_data = [
                        i for i in mutate_csv_data if i[0] != dst]

            with open(mutate_csv, "w") as f:
                writer = csv.writer(f)
                writer.writerows(mutate_csv_data)
            sc_util_cmd = [self.nncd_console, "structure_search", "-i", mutate_csv, "-o", self.sdcproj_file]
            self.logger.info(' '.join(sc_util_cmd))
            res = subprocess.Popen(sc_util_cmd, stderr=subprocess.PIPE, cwd=self.nncd_console_cwd)
            if res.stderr.read():
                raise RuntimeError(res.stderr.read().decode())
            if not os.path.isfile(self.sdcproj_file):
                raise RuntimeError(f"failed to mutate network: {self.sdcproj_file}")

            self.logger.info(f"Created mutate network: {self.sdcproj_file}")
            # UPLOAD MUTATE NETWORK
            local_sdcproj_path = os.path.join(
                os.path.dirname(self.local_config_file), "data.sdcproj")
            self._copy_file(self.sdcproj_file, local_sdcproj_path, log="debug")
            self.ss_enable = 1
        else:
            self._copy_file(self.local_config_file,
                            self.sdcproj_file, log="debug")
            if not (os.path.isfile(self.sdcproj_file) and os.path.getsize(self.sdcproj_file)):
                raise RuntimeError(f"{self.local_config_file}: sdcproj is empty.")

            if self.ss_enable is None:
                sdcproj = ConfigParser()
                sdcproj.read(self.sdcproj_file)
                self.ss_enable = int(sdcproj['StructureSearch']['Enabled'])
            if self.ss_enable == 1:
                self.logger.info("Structure search setting is True")

    def get_learnd_params(self):
        """GET LEARNED PARAMETER IF EXISTS"""
        latest_nnp = self._get_current_or_best_nnp("results_current_", self.local_output_dir)
        best_nnp = self._get_current_or_best_nnp("results_best_", self.local_output_dir)

        if latest_nnp is None and best_nnp is None:
            if os.path.isfile(os.path.join(self.local_output_dir, "results.nnp")):
                latest_nnp = best_nnp = "results.nnp"

        if latest_nnp:
            # DOWNLOAD ALL NNP FILES
            train_nnp = [self.TRAIN_NNP,
                         self.TRAIN_BEST_NNP, self.TRAIN_LAST_NNP]
            for nnp_file in os.listdir(self.local_output_dir):
                if nnp_file.endswith(".nnp") and nnp_file not in train_nnp:
                    self._copy_file(
                        os.path.join(self.local_output_dir, nnp_file),
                        os.path.join(self.OUTPUT_DIR, nnp_file), log="info")

            # DOWNLOAD ALL PTOTOTXT FILES
            train_prototxt = [self.CPU_NETWORK_PROTOTXT, self.GPU_NETWORK_PROTOTXT]
            for prototxt_file in os.listdir(self.local_output_dir):
                if prototxt_file.endswith(".prototxt") and prototxt_file in train_prototxt:
                    self._copy_file(
                        os.path.join(self.local_output_dir, prototxt_file),
                        os.path.join(self.OUTPUT_DIR, prototxt_file), log="info")

            # DOWNLOAD PARAM ASSIGN FILE IF EXISTS
            if self.instance_group == 2:
                param_assign = os.path.join(
                    self.local_output_dir, self.CPU_PARAM_ASSIGN)
                if os.path.isfile(param_assign):
                    self._copy_file(
                        param_assign, os.path.join(self.WORK_DIR, self.CPU_PARAM_ASSIGN), log='debug')
            else:
                param_assign = os.path.join(
                    self.local_output_dir, self.GPU_PARAM_ASSIGN)
                if os.path.isfile(param_assign):
                    self._copy_file(
                        param_assign, os.path.join(self.WORK_DIR, self.GPU_PARAM_ASSIGN), log='debug')
                    
            # OVERRIDE CONFIG FILE
            if best_nnp and self.nnabla_command == "forward":
                target_nnp_file = best_nnp
            else:
                target_nnp_file = latest_nnp

            if self.local_config_file:
                self.logger.info(
                    f"Use config file: {self.local_output_dir}/{target_nnp_file}, " +
                    f"instead of config file: {self.local_config_file}")
            self.local_config_file = os.path.join(
                self.local_output_dir, target_nnp_file)

            # THIS LOCAL DIRECTORY MUST BE OUTPUT_DIR (FOR console_cli)
            self.config_file = os.path.join(self.OUTPUT_DIR, target_nnp_file)
            if self.instance_group == 2:
                self._replace_prototxt_in_nnp(self.config_file, os.path.join(self.OUTPUT_DIR, self.CPU_NETWORK_PROTOTXT))
            else:
                self._replace_prototxt_in_nnp(self.config_file, os.path.join(self.OUTPUT_DIR, self.GPU_NETWORK_PROTOTXT))

            # RESUME CHECK
            if self.nnabla_command == "train":
                self.logger.info("Resume training.")
                self.nnabla_command_resume = "resume"

                # RESUME train log
                with open(os.path.join(self.local_output_dir, self.LOG_FILENAME)) as f:
                    log_data = f.read()

                with open(self.OUTPUT_LOGFILE, "r+") as f:
                    log_data += f.read()
                    f.seek(0)
                    f.write(log_data)

                # RESUME status.json
                status_file = os.path.join(
                    self.local_output_dir, self.STATUS_FILENAME)
                if os.path.join(status_file) and os.path.getsize(status_file):
                    with open(status_file) as f:
                        status_json = json.load(f)
                else:
                    status_json = {}
                for i in ["status", "task_id", "start_time", "time", "update_timestamp",
                          "priority", "instance_group", "end_time", "storage_used"]:
                    if i in status_json:
                        status_json.pop(i)
                self._update_status(status_json)

    def sync_logs(self):
        """sync update log and status."""
        sync_dir = os.path.join(self.OUTPUT_DIR, "status")

        # log.txt
        with open(os.path.join(sync_dir, self.LOG_FILENAME), 'w') as fw:
            for file_path in [self.OUTPUT_LOGFILE, self.OUTPUT_PROGRESS]:
                if os.path.isfile(file_path):
                    with open(file_path) as fi:
                        fw.write(fi.read())

        # status.json
        with open(self.OUTPUT_STATUSFILE) as f:
            json_str = f.read()
        if json_str:
            status_json = json.loads(json_str)
            end_time = status_json["end_time"] if "end_time" in status_json else time.time()
            if "time" not in status_json:
                status_json["time"] = {}
            status_json["time"].update({"elapsed": end_time - status_json["start_time"]})

            with open(os.path.join(sync_dir, self.STATUS_FILENAME), 'w') as f:
                json.dump(status_json, f)

        for filename in os.listdir(sync_dir):
            self._copy_file(os.path.join(sync_dir, filename),
                            os.path.join(self.local_output_dir, filename))

    def sync_logs_loop(self):
        # log sync start
        os.makedirs(os.path.join(self.OUTPUT_DIR, "status"), exist_ok=True)

        while not self.threading_event.is_set():
            self.sync_logs()
            time.sleep(self.LOCAL_UPLOAD_INTERVAL_SEC)

    def calculate_cost_multiply_add(self):
        """calculate cost_multiply_add by executing nncd_console_cli_util."""
        if self.sdcproj_file is None:
            return

        work_result_ini = os.path.join(self.WORK_DIR, self.RESULT_INI)
        sc_util_cmd = [self.nncd_console, "create_result_ini", '-i', self.sdcproj_file,
                       '-y', self.EMPTY_YAML, '-o', work_result_ini]
        self.logger.info(" ".join(sc_util_cmd))
        res = subprocess.Popen(sc_util_cmd, stderr=subprocess.PIPE, cwd=self.nncd_console_cwd)
        if res.stderr.read():
            raise RuntimeError(res.stderr.read().decode())
        if not os.path.isfile(work_result_ini):
            raise RuntimeError(f"failed to create result.ini: {work_result_ini}")

        result_ini = ConfigParser()
        result_ini.optionxform = str
        result_ini.read(work_result_ini)
        cost_multiply_add = result_ini.get(
            "result", "cost_multiply_add", fallback=None)
        if cost_multiply_add is None:
            raise ValueError("failed to calculate `cost_multiply_add` value")
        if "statistics" not in result_ini.sections():
            raise ValueError("failed to calculate network statistics")

        statistics = dict(result_ini.items("statistics"))
        self._update_status({
            "cost_multiply_add": cost_multiply_add,
            "statistics": statistics})
        self._copy_file(self.EMPTY_YAML, os.path.join(
            self.local_output_dir, self.MON_REPORT_YAML))
        self._copy_file(work_result_ini, os.path.join(
            self.local_output_dir, self.RESULT_INI))

    def convert_config_file(self):
        """
        for first encountered config file
        GET/CONVERT CONFIG FILE
        """
        if self.local_config_file is None or self.config_file:
            return
        if self.sdcproj_file:
            current_script_path = os.path.abspath(__file__)
            current_script_dir = os.path.dirname(current_script_path)
            settings_relative_path = [os.path.normpath(os.path.join(current_script_dir, os.path.normpath('../server/nncd_console/settings/settings.ini'))), 
                                      os.path.normpath(os.path.join(current_script_dir, os.path.normpath('../connector/nncd_console/settings/settings.ini')))]
            ProcessorType = []
            try:
                import nnabla_ext.cuda, nnabla_ext.cudnn
                ProcessorType.extend([0, 1])
                for type in ProcessorType:
                    for setting_path in settings_relative_path:
                        self._update_settings_conf(setting_path, type)
                    if type == 0:
                        prototxt_config_file = {self.OUTPUT_CPU_PARAM_ASSIGN: os.path.join(self.WORK_DIR, self.CPU_NETWORK_PROTOTXT)}
                        self._create_prototxt(prototxt_config_file)
                    else:
                        prototxt_config_file = {self.OUTPUT_GPU_PARAM_ASSIGN: os.path.join(self.WORK_DIR, self.GPU_NETWORK_PROTOTXT)}
                        self._create_prototxt(prototxt_config_file)
            except:
                ProcessorType.extend([0])
                prototxt_config_file = {self.OUTPUT_CPU_PARAM_ASSIGN: os.path.join(self.WORK_DIR, self.CPU_NETWORK_PROTOTXT)}
                self._create_prototxt(prototxt_config_file)
                
            # rename config file for current job's gpu/cpu version.
            if self.instance_group == 2:
                os.rename(os.path.join(self.WORK_DIR, self.CPU_NETWORK_PROTOTXT), os.path.join(self.WORK_DIR, "network.prototxt"))
            else: 
                os.rename(os.path.join(self.WORK_DIR, self.GPU_NETWORK_PROTOTXT), os.path.join(self.WORK_DIR, "network.prototxt"))
            self.config_file = os.path.join(self.WORK_DIR, "network.prototxt")
        else:
            # .nnp/.nntxt/.prototxt
            # if self.sdcproj_file is not provided, .prototxt's dataset uri is adjusted in _extend_dataset_path, .nntxt is not seen, only .nnp left 
            self.config_file = os.path.join(
                self.WORK_DIR, os.path.basename(self.local_config_file))
            self._copy_file(self.local_config_file,
                            self.config_file, log="info")
        

    def check_dataset_cache(self):
        """"""

        if self.job_type == "inference":
            return
        dataset_uri_list = []
        if self.nnabla_command_resume:
            config_zip = zipfile.ZipFile(self.config_file)
            config_zip.extract("network.prototxt", self.WORK_DIR)
            with open(os.path.join(self.WORK_DIR, "network.prototxt"), "r") as f:
                for line in f.readlines():
                    if line.replace(" ", '').startswith("cache_dir:"):
                        dataset_uri_list.append(line.split('"')[1])
        elif self.local_dataset_csv:
            dataset_uri_list.append(self.local_dataset_csv)
        else:
            with open(self.config_file, 'r') as f:
                for line in f.readlines():
                    if line.replace(" ", '').startswith("cache_dir:"):
                        dataset_uri_list.append(line.split('"')[1])
        for dataset_uri in dataset_uri_list:
            dataset_id = os.path.basename(dataset_uri)
            tenant_id = os.path.basename(os.path.dirname(dataset_uri))
            if dataset_id.endswith(".cache"):
                dataset_id = dataset_id.replace(".cache", '')
            if dataset_id == 'unknown':
                continue

            dataset_path_parts = os.path.join(tenant_id, dataset_id)
            cache_path = os.path.join(
                self.LOCAL_DATASET_CACHE_BUCKET, f"{dataset_path_parts}.cache")

            # check cache existence
            if os.path.isfile(os.path.join(cache_path, "cache_index.csv")):
                continue

            origin_csv_path = os.path.join(
                self.LOCAL_DATASETS_BUCKET, dataset_path_parts, 'index.csv')
            if not os.path.isfile(origin_csv_path):
                raise RuntimeError(
                        f"Dataset {dataset_id} index csv file is missing, "
                        f"please check {origin_csv_path}. You may need to re-import this dataset."
                    )
            # trying csv file for evaluation when cache is missing
            self.local_dataset_csv = origin_csv_path if self.local_dataset_csv else None

    def sync_train_results(self):
        """sync result files (log.txt, status.json, and so on.)"""
        snapshot_dirs = sorted(
            [i for i in os.listdir(self.OUTPUT_DIR) if "snapshot" in i],
            key=lambda x: int(x.split("_")[0]))
        if not snapshot_dirs:
            return
        snapshot_path = os.path.join(self.OUTPUT_DIR, snapshot_dirs[-1])
        if os.path.isfile(self.sdcproj_file):
            sc_util_cmd = [
                self.nncd_console, "create_result_ini", '-i', self.sdcproj_file,
                '-y', os.path.join(snapshot_path, self.MON_REPORT_YAML),
                '-o', os.path.join(snapshot_path, self.RESULT_INI)]
            print(" ".join(sc_util_cmd))
            subprocess.Popen(sc_util_cmd, cwd=self.nncd_console_cwd).wait()
        for filename in os.listdir(snapshot_path):
            self._copy_file(os.path.join(snapshot_path, filename),
                            os.path.join(self.local_output_dir, filename))

        for d in snapshot_dirs[:-1]:
            shutil.rmtree(os.path.join(self.OUTPUT_DIR, d), ignore_errors=True)

        # create weight parameter text from results_best_XX.nnp
        results_best_nnp = None
        for filename in os.listdir(self.OUTPUT_DIR):
            if filename == "results.nnp" or filename.startswith("results_best_"):
                results_best_nnp = filename
                break
        if results_best_nnp:
            nnp_path = os.path.join(self.OUTPUT_DIR, results_best_nnp)
            param_output_dir_path = os.path.join(self.OUTPUT_DIR, "weight_param_text")
            args = self.nnabla_cli_parser.parse_args([
                "decode_param", "-p", nnp_path, "-o", param_output_dir_path])
            args.func(args)
            local_param_path = os.path.join(self.local_output_dir, "weight_param_text")
            os.makedirs(local_param_path, exist_ok=True)
            for filename in os.listdir(param_output_dir_path):
                self._copy_file(os.path.join(param_output_dir_path, filename),
                                os.path.join(local_param_path, filename))
            shutil.rmtree(param_output_dir_path, ignore_errors=True)

        # REMOVE OLD NNP (cuurent/best)
        for prefix in ["results_current_", "results_best_"]:
            nnp_list = sorted(
                [i for i in os.listdir(self.local_output_dir) if prefix in i],
                key=lambda x: int(os.path.splitext(x)[0].split("_")[-1]))
            for filename in nnp_list[:-1]:
                os.remove(os.path.join(self.local_output_dir, filename))

    def sync_forward_results(self):
        intermediate_dir_name = self.INTERMEDIATE_DIR_NAME
        if self.job_type == "inference":
            intermediate_dir_name = self.INFER_INTERMEDIATE_DIR_NAME
        outputs_path = os.path.join(self.OUTPUT_DIR, intermediate_dir_name)
        local_outputs_path = os.path.join(self.local_output_dir, intermediate_dir_name)
        if os.path.isdir(outputs_path):
            if os.path.isdir(local_outputs_path):
                shutil.rmtree(local_outputs_path)
            shutil.copytree(outputs_path, local_outputs_path)

    def nnabla_active_check_loop(self):
        comp_progress_sum = ''
        comp_log_sum = ''
        check_cnt = 0
        timeout_min = 15
        # sub process immediately exit when main process exit.
        while not self.threading_event.is_set():
            if not (os.path.isfile(self.OUTPUT_PROGRESS) and os.path.isfile(self.OUTPUT_LOGFILE)):
                time.sleep(1)
                continue

            with open(self.OUTPUT_PROGRESS, "rb") as f:
                new_process_sum = hashlib.md5(f.read()).hexdigest()
            with open(self.OUTPUT_LOGFILE, "rb") as f:
                new_log_sum = hashlib.md5(f.read()).hexdigest()

            if comp_progress_sum == new_process_sum and comp_log_sum == new_log_sum:
                check_cnt += 1
            else:
                check_cnt = 0

            comp_progress_sum = new_process_sum
            comp_log_sum = new_log_sum

            if check_cnt == timeout_min:
                for p in psutil.process_iter():
                    if self.OUTPUT_DIR in ' '.join(p.comline()):
                        p.kill()
                        break
                self.logger.error(
                    "nnabla is not running for ${timeout_min} minutes")
                break
            time.sleep(self.NNABLA_ACTIVE_CHECK_INTERVAL_SEC)

    def nnabla_memory_check_loop(self):
        """start console_cli memory check"""
        free_total = psutil.virtual_memory().free + psutil.swap_memory().free
        # create oom file when used memory exceeds 95%
        omm_check_line = 95
        while not self.threading_event.is_set():
            check_free = psutil.virtual_memory().used + psutil.swap_memory().used
            if (check_free/free_total)*100 <= omm_check_line:
                with open(self.NNABLA_OOM_CHECKFILE, 'w') as f:
                    current_time = time.strftime(
                        "%a %d %b %Y %H:%M:%S %p", time.localtime())
                    f.write(f"{current_time} : nnabla out of memory")
                break
            time.sleep(1)

    def terminate_process(self):
        """stop all subprocess."""
        with self.sync_train_result_lock:
            if self.console_cli_process:
                try:
                    parent = psutil.Process(self.console_cli_process.pid)
                    for child in parent.children(recursive=True):
                        try:
                            child.terminate()
                            child.wait()
                        except psutil.NoSuchProcess:
                            pass
                    parent.terminate()
                    parent.wait()
                except psutil.NoSuchProcess:
                    pass
            self.threading_event.set()
            self.sync_logs()
            self.sync_train_results()

    def sys_handler(self):
        self.terminate_process()

    def execute(self):
        """construct console_cli arguments and run."""
        cmd_args = self.console_cli + [self.nnabla_command]
        if self.nnabla_command_resume:
            cmd_args.append("-r")
        if self.local_config_file:
            cmd_args.extend(["-c", self.config_file])
        if self.local_param_file:
            cmd_args.extend(["-p", self.local_param_file])
        if self.local_output_dir:
            cmd_args.extend(["-o", self.OUTPUT_DIR])
        if self.local_dataset_csv and self.job_type != "inference":
            # When use nnabla-ssh, -d option need change .cache file to .csv file
            if self.local_dataset_csv.endswith('.cache') and self.instance_group != 1 and self.instance_group != 2:
                path_parts = self.local_dataset_csv.replace(
                    ".cache", "").split(os.sep)[-3:]
                cmd_args.extend([
                    "-d", os.path.join(self.LOCAL_DATASETS_BUCKET, *path_parts, "index.csv")])
            else:
                cmd_args.extend(["-d", self.local_dataset_csv])
        if self.job_type == "train" and self.sdcproj_file:
            # SET SDCPROJ FILE
            if self.instance_group == 2:
                cmd_args.extend(["-s", self.sdcproj_file, "-a",
                                self.OUTPUT_CPU_PARAM_ASSIGN])
            else:
                cmd_args.extend(["-s", self.sdcproj_file, "-a",
                                self.OUTPUT_GPU_PARAM_ASSIGN])

            # CHECK JOB ID PARAMS
            try:
                job_url_list_file = os.path.join(self.WORK_DIR, "job_url_list.txt")
                job_url_list = [
                    f"{i}\t"+os.path.join(self.LOCAL_PROJECTS_BUCKET,
                                          self.project_id, "results", i)
                    for i in extract_job_id(self.sdcproj_file)]
                with open(job_url_list_file, "w") as f:
                    f.writelines(job_url_list)
                if job_url_list:
                    cmd_args.extend(["-j", job_url_list_file])
            except:
                self.logger.error(traceback.format_exc)

        if self.nnabla_command == "forward":

            if self.job_type == "inference":
                cmd_args.extend(["--result_outdir", self.INFER_INTERMEDIATE_DIR_NAME])
            else:
                cmd_args.extend(["--result_outdir", self.INTERMEDIATE_DIR_NAME])
        if self.instance_group != 1 and self.instance_group != 2:
            # for nnabla remote, e.g. remoteResG
            cmd_args[2] = self.console_cli[-1].replace("console_cli", "nnabla_cli")
            os.environ["NNABLA_CONFIG_FILE_PATH"] = self.NNABLA_REMOTE_CONF
        else:
            if self.parallel_num != 1:
                cmd_args.extend(["--multi", self.parallel_num])
        if self.job_type == "inference":
            cmd_args.extend(["-f", self.INFER_RESULT])
            cmd_args.extend(["-d", self.INFER_INPUTS_PATH])
        self.logger.info(' '.join(cmd_args))
        # train and write log to console and log file
        self.console_cli_process = subprocess.Popen(
            cmd_args, stdout=subprocess.PIPE, stderr=subprocess.STDOUT,encoding="utf-8", env=os.environ)
        
        @contextmanager
        def temporary_logger():
            original_fmt = self.logger.handlers[0].formatter._fmt
            for handler in self.logger.handlers:
                handler.setFormatter(logging.Formatter("%(message)s"))
            yield
            for handler in self.logger.handlers:
                handler.setFormatter(logging.Formatter(original_fmt))

        with temporary_logger():
            for line in iter(self.console_cli_process.stdout.readline, ''):
                self.logger.info(line.strip())
        
    def results_handling(self):
        """RESULTS HANDLING"""

        with open(self.OUTPUT_LOGFILE, "r") as f:
            content = f.read()
            for i in ["Profile", "Training", "Forward"]:
                if f"[nnabla]: {i} Completed." in content:
                    self.nnabla_result_status = 0
                    break
            else:
                # OVERRIDDEN EXIT STATUS of console_cli
                self.nnabla_result_status = -1
                self.logger.error(f"console_cli command is failed.")

        with open(self.OUTPUT_STATUSFILE, "r") as f:
            last_status = json.load(f).get("status")

        if last_status != "finished" and self.nnabla_result_status == 0:
            self.nnabla_result_status = -1
            self.logger.error(f"console_cli command is unexpected ended.")

        self.logger.info(f"results handling...")

        if self.job_type == "train" and self.ss_enable == 1:
            # STRUCTURE SEARCH
            if self.mutate_json:
                # UPDATE MUTATE STATUS
                mutate_start_time = self.mutate_json.get("start_time")
                mutate_count = int(self.mutate_json.get("count", 0)) + 1
                self.logger.info("Network structure auto searching," +
                                 f"count {mutate_count} done")
            else:
                mutate_start_time = time.time()
                mutate_count = 1
                self.logger.info("Begin network structure auto searching.")

            if not self.mutate_base_job_id:
                self.mutate_base_job_id = self.job_id
            self._update_status({
                "mutate": {
                    "start_time": mutate_start_time,
                    "count": mutate_count,
                    "attempt_hours": self.ss_attempt_hours,
                    "attempt_times": self.ss_attempt_times,
                    "multi_mutate_num": self.multi_mutate_num,
                    "base_job_id": self.mutate_base_job_id
                },
                "update_timestamp": time.time()
            })

        if self.nnabla_result_status != 0:
            # FAILED STATUS SET
            if last_status != "failed":
                current_timestamp = time.time()
                self._update_status({
                    "status": "failed",
                    "end_time": current_timestamp,
                    "update_timestamp": current_timestamp
                })

            # SET ERROR CODE
            if os.path.isfile(self.NNABLA_OOM_CHECKFILE):
                with open(self.OUTPUT_STATUSFILE, "r") as f:
                    last_error = json.load(f).get("last_error", None)
                if not last_error:
                    self._update_status({
                        "last_error": {
                            "code": self.E_NNABLA_OOM,
                            "message": "nnabla out of memory"
                        }
                    })
            return

        # UPLOAD OUTPUT RESULTS
        last_nnp = self._get_current_or_best_nnp(
            "results_current_", self.OUTPUT_DIR, else_value="results.nnp")
        best_nnp = self._get_current_or_best_nnp(
            "results_best_", self.OUTPUT_DIR, else_value="results.nnp")

        if self.nnabla_command == "train":
            # sync final train result
            self.sync_train_results()

            for src, dst in [(best_nnp, self.TRAIN_BEST_NNP), (last_nnp, self.TRAIN_LAST_NNP)]:
                self.logger.info(f"create {dst}")
                self._copy_file(os.path.join(self.OUTPUT_DIR, src),
                                os.path.join(self.local_output_dir, dst))
        elif self.job_type == "evaluate":
            # sync evaluation result
            if os.path.isfile(self.OUTPUT_RESULT):
                self._copy_file(self.OUTPUT_RESULT,
                                os.path.join(self.local_output_dir, self.FORWARD_RESULT), log="info")
                self.logger.info(f"create {self.CONFUSION_MATRIX}")
                confusion_matrix = create_confusion_matrix(self.OUTPUT_RESULT, self.WORK_DIR)
                if confusion_matrix:
                    with open(self.WORK_MATRIX, "w") as f:
                        json.dump(confusion_matrix, f)
                    for filename in os.listdir(self.WORK_DIR):
                        if filename.endswith("_matrix.json") or filename.endswith("_output_result.db"):
                            self.logger.info(f"{filename} created")
                            self._copy_file(os.path.join(self.WORK_DIR, filename),
                                            os.path.join(self.local_output_dir, filename), log="info")
                else:
                    self.logger.warning(f"{self.CONFUSION_MATRIX} can not created")
            self.sync_forward_results()
        
            # WRITE BACK NNP FILES (BECAUSE, MAY BE INCLUDE EVALUATION RESULT)
            for filename in os.listdir(self.OUTPUT_DIR):
                if filename.endswith(".nnp"):
                    self._copy_file(os.path.join(self.OUTPUT_DIR, filename),
                                    os.path.join(self.local_output_dir, filename), log="info")

            # create result_evaluate.nnp
            self.logger.info(f"create {self.EVALUATE_NNP}")
            self._copy_file(os.path.join(self.OUTPUT_DIR, best_nnp),
                            os.path.join(self.local_output_dir, self.EVALUATE_NNP))
            # maybe never execute!!!
            # create result_train_best.nnp, result_train_best.nnp
            for src, dst in [(best_nnp, self.TRAIN_BEST_NNP), (last_nnp, self.TRAIN_LAST_NNP)]:
                if not os.path.isfile(os.path.join(self.local_output_dir, dst)):
                    self.logger.info(f"create because there is no ${dst}")
                    self._copy_file(os.path.join(self.OUTPUT_DIR, src),
                                    os.path.join(self.local_output_dir, dst))
                # unknown command
                # zip -d ${OUTPUT_DIR}/${TRAIN_BEST_NNP} output_result*.zip
        elif self.job_type == "inference":
            self._copy_file(
                self.INFER_RESULT_PATH,
                os.path.join(self.local_output_dir, self.INFER_RESULT), 
                log="info"
            )
            self.logger.info(f"[Inference] create classification result")
            try:
                create_classification_result(self.INFER_RESULT_PATH, self.WORK_DIR)
                for filename in os.listdir(self.WORK_DIR):
                    if filename.endswith("_infer_result.db"):
                        self.logger.info(f"{filename} created")
                        self._copy_file(os.path.join(self.WORK_DIR, filename),
                                        os.path.join(self.local_output_dir, filename), log="info")
            except Exception as e:
                self.logger.warning(f"[Inference] classification result can not created: {str(e)}")
            self.sync_forward_results()
        elif self.nnabla_command == "profile":
            # sync profile result
            if os.path.join(self.OUTPUT_PROFILE):
                self._copy_file(self.OUTPUT_PROFILE, 
                                os.path.join(self.local_output_dir, self.PROFILE_RESULT), log="info")
            else:
                self.logger.warning(f"not found profile result file: {self.OUTPUT_PROFILE}")

        self.sync_logs()
        
        # create nnb, onnx, pb file
        if not os.path.isfile(os.path.join(self.OUTPUT_DIR, best_nnp)):
            return
        for filename in ["result.nnb", "result.onnx", "result.pb"]:
            src = os.path.join(self.OUTPUT_DIR, filename)
            dst = os.path.join(self.local_output_dir, filename)
            if not os.path.isfile(dst):
                self.logger.info(f"create {filename}")
                args = self.nnabla_cli_parser.parse_args([
                    "convert", "-b", str(self.CONVERT_BATCH_SIZE), 
                    os.path.join(self.OUTPUT_DIR, best_nnp), src])
                try:
                    args.func(args)
                except Exception as e:
                    self.logger.error(f"Failed to create {filename}.")
                self._copy_file(src, dst)
        self.sync_logs()

    def count_storage_used(self):
        """COUNT STORAGE USED SIZE"""
        if self.job_type == "inference":
            return
        shutil.rmtree(os.path.join(self.local_output_dir, "page"), ignore_errors=True)

        storage_used = sum(f.stat().st_size for f in Path(
            self.local_output_dir).glob("**/*") if f.is_file())
        self._update_status({
            "storage_used": storage_used,
            "update_timestamp": time.time()
        })

    def create_paging_file(self):
        if self.nnabla_command == "forward" and self.nnabla_result_status == 0:
            try:
                contents = Content(self.project_id, self.job_id, self.forward_tenant_id, self.forward_dataset_id)
                contents.create_page_files(self.job_type)
                self.logger.info("Completed to paging file creator.")
            except Exception:
                self.logger.error("Failed to paging file creator.")

    def prepare_infer_inputs(self):
        if self.job_type == "inference":
            status_json = {
                "infer_header": self.infer_header,
            }
            self._update_status(status_json)
            if len(self.infer_inputs) > 0:
                with open(self.INFER_INPUTS_PATH, "w", newline='') as f:
                    writer = csv.writer(f)
                    writer.writerow(["x:input"])
                    for input in self.infer_inputs:
                        writer.writerow([input])

    def exec(self):
        try:
            self._init_args()
            self.init_log_and_status_file()

            # register runner exit
            self.exit_handler_func = self.preprocess_exit_handler

            self.get_sdcproj()
            self.get_learnd_params()

            Thread(target=self.sync_logs_loop).start()

            self.calculate_cost_multiply_add()
            self.convert_config_file()
            self.check_dataset_cache()
            self.prepare_infer_inputs()

            # start nnabla monitor
            for func in [self.nnabla_memory_check_loop, self.nnabla_active_check_loop]:
                Thread(target=func, daemon=True).start()
            self.exit_handler_func = self.sys_handler
            self.execute()
            self.terminate_process()

            self.results_handling()
            self.count_storage_used()
            self.create_paging_file()

            self.logger.info("worker done")
            self.sync_logs()

        except Exception:
            self.exit_handler_func()
            self.logger.error(traceback.format_exc())


@contextmanager
def process_manager(runner: Runner, app_port):
    def check_suspend():
        """When click the suspend button."""
        task_name = os.path.basename(runner.result_dir)
        try:
            while True:
                res = requests.get(
                    f"http://localhost:{app_port}/runner/get_status", 
                    proxies={"http": None}, params={"task_name": task_name}, timeout=1)
                if res.status_code == 200 and not res.json()["result"]:
                    break
                time.sleep(1)
        except requests.exceptions.ReadTimeout:
            # when runner server is killed by Ctrl+C, raise timeout exception
            ...
        finally:
            runner.exit_handler_func()
            with runner.write_json_lock:
                os.kill(os.getpid(), signal.SIGTERM)

    def process_end():
        """When the runner worker process is finished naturally."""
        runner_name = os.path.basename(runner.result_dir)
        job_type, job_id = runner_name.split("_")[-2:]
        try:
            requests.post(f"http://localhost:{app_port}/stop_running_job", 
                          proxies={"http": None}, timeout=2, 
                          json={"job_type": job_type, "job_id": job_id})
        except requests.exceptions.ReadTimeout:
            # For Ctrl+C to runner server
            pass

    t = Thread(target=check_suspend, daemon=True)
    t.start()
    yield
    process_end()
    t.join()


def main():
    app_port = sys.argv[3]
    r = Runner(json.loads(sys.argv[1]), sys.argv[2])
    with process_manager(r, app_port):
        r.exec()


if __name__ == '__main__':
    main()
