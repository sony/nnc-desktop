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
import os
import copy
import json
import base64
from schema import Use, Regex
from flask import request, url_for

from conf import consts, settings
from utils.logger import NNcdLogger
from utils import common, xss_saftstring
from utils.file_utils import ProjectFile
from utils.exception import NNcdException, CODE
from utils.request_runner import start_running_plugin
from sqlite3db.models import Plugins, Tasks, Jobs

PLUGIN_PARAMETER_SELECT = Regex(r'\A[0-9]+,[0-9]+\Z')
PLUGIN_PARAMETER_PATH = Regex(r'\A[a-zA-Z0-9_ !#$%&\'\()+,\.\-=@\[\]^`{}~]{1,64}\Z', flags=re.ASCII)
PLUGIN_PARAMETER_INT = Use(int)
PLUGIN_PARAMETER_STR = Regex(r'\A[a-zA-Z0-9_ !#$%&\'\()+,\.\-=@\[\]^`{}~]{1,128}\Z')
PLUGIN_PARAMETER_BOOL = Regex(r'\A(true|false)\Z', flags=re.IGNORECASE)
PLUGIN_LOG_FILENAME = 'plugin_log.txt'
SERVICE_LAMBDA = 'lambda'
SERVICE_FARGATE = 'fargate'
DICOM_EXT = ('.dcm', '.DCM', '.dicom', '.DICOM')


def execute_plugin(user_id: str, project_id: int, job_id: int, plugin_id: str):
    """ execute plugin """
    user_id=1
    parameters = request.json.get("parameters")

    # get job and last task
    job = common.find_job_with_validation(project_id, job_id)
    last_task = Tasks.select().where(
            Tasks.job_id == job.job_id, Tasks.type == Jobs._meta.EVALUATE
        ).order_by(Tasks.create_datetime.desc()).first()
    if last_task is None:
        raise NNcdException(CODE.NNCD_BAD_REQUEST, 'This Job had not been executed evaluation')

    plugin = Plugins.select().where(
            Plugins.owner_tenant_id == consts.SAMPLE_TENANT_ID, Plugins.plugin_id == plugin_id
        ).first()
    if not plugin:
        plugin = Plugins.select().where(
                Plugins.owner_tenant_id == job.tenant_id, Plugins.plugin_id == plugin_id
            ).first()
    if not plugin:
        raise NNcdException(CODE.NNCD_BAD_REQUEST, 'This plugin is not found')

    # Complement request parameters with DB information
    # ex {'name': 'a', 'value': 'b'}
    # -> {'name': 'a', 'value': 'b', 'format': 'str', 'direction': 'input'}
    _complete_parameters(parameters, plugin.parameters)

    # Copy to the parameter for Plugin and work
    nnabla_params = copy.deepcopy(parameters)
    # Check the value of the parameter value with format
    # Make an exception if there is a problem
    _verify_value_for_input_parameters(nnabla_params)
    
    # Convert the value of the input parameter
    # ex. path is converted to path
    _convert_value_for_input_parameters(
        nnabla_params, project_id, job_id,
        max_row_num=last_task.data_num,
        max_column_num=last_task.column_num
    )

    # Convert the value of the output parameter
    # ex. path is converted to path
    _convert_value_for_output(
        nnabla_params, plugin.parameters, project_id, job_id, plugin_id
    )

    # Erase the parameter
    # present the default value to the user according to the original plugin specification
    # The default value passed to the plugin may not match.
    # if the value received from the user matches default and is not a required parameter
    # Don't pass that parameter to the plugin.
    # For example, the definition of variable2_eval of cross_tabulation is as follows 
    # parser.add_argument('-v2e', '--variable2_eval', help="variable name indicating the evaluation result (variable) default=y'")
    # Display variable2_eval = y'to the user, but if the parameter is actually omitted and executed, the value will not be set.
    # BUT in lime the default value must be required
    # _remove_parameters_when_value_matches_default(nnabla_params, plugin.parameters)
    
    # Convert to Plugin parameter format 
    # {"name": "variable"} -> {"name": "--variable"}
    _convert_plugin_argument_names(nnabla_params)
    NNcdLogger.debug(message=f'nnabla_params={nnabla_params}, parameters={parameters}')

    # Place empty or initial log files and result files
    plugin_log_obj = _put_object_as_plugin_log(project_id, job_id, plugin_id, parameters)
    _put_object_as_plugin_result(nnabla_params)

    # Not need select computing service in local server
    service = _choose_suitable_computing_service_for_plugin(plugin, nnabla_params)
    start_running_plugin(json.dumps({
        'script_path': os.path.normpath(plugin.plugin_file),
        'log_file_path': plugin_log_obj.full_path,
        'parameters': nnabla_params
    }))
    return {
        'log_url': _get_plugin_log_url(user_id, project_id, job_id, plugin_log_obj)
    }


def _get_parameter(name, parameters: list):
    for parameter in parameters:
        if parameter['name'] == name:
            return parameter
    return None


def _complete_parameters(req_parameters: list, plugin_parameters: list):
    for req_param in req_parameters:
        plugin_param = _get_parameter(req_param['name'], plugin_parameters)
        if plugin_param is None:
            raise NNcdException(
                CODE.NNCD_BAD_REQUEST, "Not found parameter name ({})".format(
                    xss_saftstring.escapejs(req_param['name'])
                )
            )
        req_param['format'] = plugin_param['format']
        req_param['direction'] = plugin_param['direction']
    
    for plugin_param in plugin_parameters:
        req_param = _get_parameter(plugin_param['name'], req_parameters)
        if req_param:
            continue
        if 'default' not in plugin_param:
            raise NNcdException(
                CODE.NNCD_BAD_REQUEST, 'Not found required parameters {}'.format(
                    xss_saftstring.escapejs(plugin_param['name'])
                )
            )
        req_parameters.append({
            'name': plugin_param['name'],
            'value': plugin_param['value'],
            'format': plugin_param['format'],
            'direction': plugin_param['direction']
        })


def _verify_value_for_input_parameters(req_parameters: list):
    schema_map = {
        'select': PLUGIN_PARAMETER_SELECT,
        'path': PLUGIN_PARAMETER_PATH,
        'int': PLUGIN_PARAMETER_INT,
        'str': PLUGIN_PARAMETER_STR,
        'bool': PLUGIN_PARAMETER_BOOL
    }
    for parameter in req_parameters:
        try:
            if parameter['format'] in schema_map:
                schema_map[parameter['format']].validate(parameter['value'])
        except Exception:
            raise NNcdException(CODE.NNCD_BAD_REQUEST, 'invalid {}'.format(parameter['name']))


def _convert_value_for_input_parameters(req_parameters: list, project_id: int, job_id: int,
                                        max_row_num: int, max_column_num: int):
    """Convert from the position (row, column) of the selected item 
       contained in the parameter to a value
    """
    for parameter in req_parameters:
        if parameter['direction'] != 'input':
            continue
        if parameter['format'] == 'select':
            row, column = list(map(int, parameter['value'].split(',')))
            if not (0 <= row < max_row_num and 0 <= column < max_column_num):
                raise NNcdException(CODE.NNCD_INDEX_OUT_OF_RANGE, 'Invalid select item')
            parameter['value'] = _get_data_from_row_and_column_of_evaluation_result(
                project_id, job_id, row, column
            )
        elif parameter['format']  == 'path':
            parameter['value'] = ProjectFile(
                'results', project_id, job_id, parameter['value']).full_path


def _get_data_from_row_and_column_of_evaluation_result(project_id: int, job_id: int, row: int, column: int):
    file_row = int(row / 10) * 10
    file_column = int(column / 10) * 10
    index_row = row % 10
    index_column = column % 10
    
    name, _ = os.path.splitext(consts.OUTPUT_RESULT_CSV)
    file_name = os.path.join('page', f"{name}_{file_column}_{file_row}.cache.json")
    file_obj = ProjectFile('results', project_id, job_id, file_name)
    cached_json = json.loads(file_obj.read())
    cell = cached_json[index_row][index_column]
    data = cell['data'] if 'original_data' not in cell else cell['original_data']
    data_type = cell['type']

    # from base64 to image
    ext = [i[0] for i in consts.DATA_CONTENT_TYPE.items() if i[1] == data_type][0]
    image_obj = ProjectFile(
        'results', project_id, job_id, os.path.join('plugins', f"plugin_{row}_{column}.{ext}"))

    image_obj.write(base64.b64decode(data), mode='wb')
    return image_obj.full_path


def _convert_value_for_output(req_parameters: list, plugins_parameters: list, 
                                project_id: int, job_id: int, plugin_id: str):
    extension = None
    for parameter in plugins_parameters:
        if parameter in plugins_parameters:
            if parameter['direction'] != 'output':
                continue
            extension = parameter.get('extension')

    for parameter in req_parameters:
        if parameter['direction'] != 'output':
            continue
        output_name = parameter['value']
        file_name = output_name
        if extension:
            file_name += f'.{extension}'
        plugin_result_path = ProjectFile('results', project_id, job_id,
            os.path.normpath(f"plugins/{plugin_id}/{output_name}/{file_name}")).full_path
        parameter['value'] = plugin_result_path
    

def _remove_parameters_when_value_matches_default(req_parameters: list, plugin_parameters: list):
    for parameter in req_parameters.copy():
        plugin_parameter = _get_parameter(parameter['name'], plugin_parameters)
        if plugin_parameter is None:
            raise NNcdException(CODE.NNCD_BAD_REQUEST, 'Not found parameter name')
        if parameter['value'] == plugin_parameter.get('default') and not plugin_parameter.get("required", False):
            req_parameters.remove(parameter)


def _convert_plugin_argument_names(req_parameters: list):
    for parameter in req_parameters:
        parameter['name'] = '--{}'.format(parameter['name'])


def _put_object_as_plugin_log(project_id: int, job_id: int, plugin_id: str, parameters: []):
    for parameter in parameters:
        if parameter['direction'] == 'output':
            plugin_log_obj = ProjectFile("results", project_id, job_id,
                os.path.normpath(f'plugins/{plugin_id}/{parameter["value"]}/{PLUGIN_LOG_FILENAME}'))
            plugin_log_obj.write('Accepted a plugin request')
            return plugin_log_obj
    raise NNcdException(CODE.NNCD_BAD_REQUEST, 'Not found output in parameters')


def _put_object_as_plugin_result(parameters: list):
    ext = None
    for parameter in parameters:
        if not (parameter['direction'] == 'input' and 
            parameter['value'].startswith(settings.RESULT_DIR)):
            continue
        ext = os.path.splitext(parameter['value'])[1]
    if ext in DICOM_EXT:
        ext = '.png'

    for parameter in parameters:
        if parameter['direction'] == 'output':
            os.makedirs(os.path.dirname(parameter['value']), exist_ok=True)
            parameter['value'] = parameter['value'] + ext
            with open(parameter['value'], 'wb') as f:
                f.write(b"")
            return
    raise NNcdException(CODE.NNCD_BAD_REQUEST, 'Not found output in parameters')


def _choose_suitable_computing_service_for_plugin(plugin: Plugins, req_parameters: list):
    if plugin.computing_service:
        if plugin.computing_service == 'lambda':
            return SERVICE_LAMBDA
        elif plugin.computing_service == 'fargate':
            return SERVICE_FARGATE
    # When DICOM images are included, Lambda's nnabla cannot handle them.
    # Handle on the Fargate 
    if _exist_dicom_in_parameters(req_parameters):
        return SERVICE_FARGATE
    
    # Get the required file size to select the Plugin execution environment
    required_size = _get_required_file_size_to_execute_plugin(req_parameters)
    if required_size < consts.MAX_SUM_OF_INPUT_FILES_FOR_LAMBDA_PLUGIN:
        return SERVICE_LAMBDA
    return SERVICE_FARGATE


def _exist_dicom_in_parameters(req_parameters: list):
    for parameter in req_parameters:
        if not isinstance(parameter['value'], str):
            continue
        if (parameter['value'].startswith(settings.RESULT_DIR) and
            parameter['value'].endswith('.dcm')):
            return True
    return False


def _get_required_file_size_to_execute_plugin(req_parameters: list):
    required_size = 0
    for parameter in req_parameters:
        if parameter['direction'] != 'input':
            continue
        value = parameter['value']
        if not isinstance(value, str):
            continue
        if value.startswith(settings.RESULT_DIR):
            if not os.path.exists(value):
                NNcdLogger.output(message=f"Not found required file = {value}")
                raise NNcdException(CODE.NNCD_BAD_REQUEST, "Not found required file")
            required_size += os.path.getsize(value)
    return required_size


def _get_plugin_log_url(user_id: int, project_id: int, job_id: int, 
                        plugin_log_obj: ProjectFile):
    return url_for(
        endpoint="job.get_log", user_id=user_id, project_id=project_id,
        job_id=job_id, log_type="plugin", _external=True
    ) + f"?ext_path={plugin_log_obj.file_name}"
