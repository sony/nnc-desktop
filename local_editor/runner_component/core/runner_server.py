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
import sys
import json
import uuid
import shutil
import signal
import tempfile
import subprocess
import argparse
import paramiko
from flask import Flask, request

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# todo: modify opt/bucket
REMOTE_CONFIG_FILE = "/opt/bucket/remote_config/config.json"

app = Flask(__name__)
task_dict = dict() 
username = uuid.uuid4().hex


def run_task(task_name, task_cmd, env=None):
    """Run the task and add the process to the task_dict.
    
    task_name    as process unique identifer 
    task_cmd     use subprocess.popen to run the command
    """
    res = subprocess.Popen(task_cmd, env=env)
    task_dict[task_name] = {"process": res, "status": True}


def stop_task(task_name):
    """kill process and del task

    task_name    process unique identifer 
    """
    if task_name in task_dict:
        process = task_dict.get(task_name).get("process")
        task_dict[task_name]["status"] = False
        if task_name.startswith(f"{username}_"):
            process.wait()
            temp_dir = os.path.join(tempfile.gettempdir(), task_name)
            shutil.rmtree(temp_dir, ignore_errors=True)
        else:
            process.terminate()
            process.wait()
        task_dict.pop(task_name)


def _get_job_result_file_name(job_id: int, job_type: str):
    return f'{username}_{job_type}_{job_id}'


def _get_remote_env(args, envs):
    """Return remote env params."""
    env = os.environ.copy()
    args_dict = json.loads(args)
    env_dict = json.loads(envs)
    instance_group = args_dict.get('instance_group')
    if instance_group == 1 or instance_group == 2:
        return env

    if env_dict:
        env.update({str(k): str(v) for k, v in env_dict.items()})
    else:
        with open(REMOTE_CONFIG_FILE, 'r') as f:
            remote_config = json.load(f)

        for instance_name in remote_config:
            if remote_config[instance_name]['INSTANCE_TYPE'] == instance_group:
                env.update({str(k): str(v) for k, v in remote_config[instance_name].items()})
    return env

def _set_ssh_config(envs):
    pass

@app.route("/start_running_job", methods=["POST"])
def start_running_job():
    """start or resume job"""
    job_id = request.json.get("job_id")
    job_type = request.json.get("job_type")
    args = request.json.get("args")
    envs = request.json.get("envs")

    # runner_name is dir name ,as well as task name
    runner_name = _get_job_result_file_name(job_id, job_type)

    temp_dir = os.path.join(tempfile.gettempdir(), runner_name)
    if os.path.isdir(temp_dir):
        shutil.rmtree(temp_dir, ignore_errors=True)
    os.makedirs(temp_dir, exist_ok=True)

    # add remote config
    env = _get_remote_env(args, envs)
    _set_ssh_config(envs)

    # run job by command: bash run_worker_local.sh args file_path
    cmd = [sys.executable, "-B", os.path.join(BASE_DIR, "run_worker_local.py"),
           args, temp_dir, request.environ['SERVER_PORT']]
    app.logger.error(cmd)
    run_task(runner_name, cmd, env=env)
    return  {'status': True}


@app.route("/stop_running_job", methods=["POST"])
def stop_running_job():
    """stop and del running job"""
    job_id = request.json.get("job_id")
    job_type = request.json.get("job_type")
    
    runner_name = _get_job_result_file_name(job_id, job_type)
    stop_task(runner_name)
    return  {'status': True}


@app.route("/runner/get_status", methods=["GET"])
def get_status_by_runner():
    """Runner get current status. 
    """
    task_name = request.args.get("task_name")
    status = True if task_name in task_dict and task_dict[task_name]["status"] else False
    return {"result": status}


@app.route("/start_uploading_dataset", methods=["POST"])
def start_uploading_dataset():
    """run script that uploading dataset."""
    dataset_id = request.json.get("dataset_id")
    args = request.json.get("args")
    cmd = [sys.executable, "-B", os.path.join(BASE_DIR, 'upload_dataset', 'main.py'), args]
    run_task(f'upload_dataset_{dataset_id}', cmd)
    return  {'status': True}


@app.route("/stop_uploading_dataset", methods=['POST'])
def stop_uploading_dataset():
    """suspend uploading dataset."""
    dataset_id = request.json.get("dataset_id")
    stop_task(f'upload_dataset_{dataset_id}')
    return {'status': True}


@app.route("/run_console_cli", methods=['POST'])
def run_console_cli():
    """individual run console_cli."""
    cmd_list = request.json.get("cmd", [])
    cmd_list[0] = os.path.join(BASE_DIR, "console_cli.py")
    cmd_list.insert(0, sys.executable)
    res = subprocess.Popen(cmd_list, stderr=subprocess.PIPE, stdout=subprocess.PIPE)
    stderr = res.stderr.read().decode()
    stdout = res.stdout.read().decode()
    if not stderr:
        return {
            "status": True,
            'result': stdout
        }
    else:
        return {
            "status": False,
            "result": stderr
        } 

@app.route("/start_running_plugin", methods=["POST"])
def start_running_plugin():
    """Running plugin in the nnabla environment."""
    event = request.json.get('event')
    cmd = [sys.executable, "-B", os.path.join(BASE_DIR, 'plugin_executor', 'main.py'), event]
    run_task(str(uuid.uuid4()), cmd)
    return  {'status': True}


@app.errorhandler(Exception)
def handle_exception(e):
    response = e.get_response()
    response.data = json.dumps({
        'status': False,
        'result': e.description
    })
    response.content_type = "application/json"
    return response


def exit_handler(sig, frame):
    print("Connector exit.")
    for task_name in list(task_dict):
        stop_task(task_name)    
    os._exit(0)


def main(port):
    signal.signal(signal.SIGINT, signal.SIG_IGN)
    signal.signal(signal.SIGTERM, exit_handler)
    app.run("0.0.0.0", port)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('-p', '--port', default=5556, type=int)
    args = parser.parse_args()

    main(args.port)
