@REM Copyright 2024 Sony Group Corporation.
@REM
@REM Licensed under the Apache License, Version 2.0 (the "License");
@REM you may not use this file except in compliance with the License.
@REM You may obtain a copy of the License at
@REM
@REM     http://www.apache.org/licenses/LICENSE-2.0
@REM
@REM Unless required by applicable law or agreed to in writing, software
@REM distributed under the License is distributed on an "AS IS" BASIS,
@REM WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
@REM See the License for the specific language governing permissions and
@REM limitations under the License.

@ECHO ON

set NNABLA_VER=1.39.0
set PYTHON_VERSION_MAJOR_MINOR=310

MKDIR electron_app\python_bundles
ROBOCOPY C:\Python%PYTHON_VERSION_MAJOR_MINOR% electron_app\python_bundles /E /XD /NFL /NDL .git

electron_app\python_bundles\python.exe -m pip install -U pip || GOTO :error_pip

electron_app\python_bundles\python.exe -m pip install nnabla==%NNABLA_VER% || GOTO :error_pip
electron_app\python_bundles\python.exe -m pip install nnabla_converter==%NNABLA_VER% || GOTO :error_pip

electron_app\python_bundles\python.exe -m pip install -r local_editor\requirements.txt || GOTO :error_pip
electron_app\python_bundles\python.exe -m pip install local_editor\runner_component\tools\console_cli\nnabla_console-10.2.0-py3-none-any.whl || GOTO :error_pip

IF %1 == "gpu" (
    electron_app\python_bundles\python.exe -m pip install https://nnabla.org/whl/nnabla_ext_cuda_alllib/nnabla_ext_cuda_alllib-%NNABLA_VER%-cp%PYTHON_VERSION_MAJOR_MINOR%-cp%PYTHON_VERSION_MAJOR_MINOR%-win_amd64.whl || GOTO :error_pip
)

ROBOCOPY local_editor\python_modules electron_app\py\server /E /XD /NFL /NDL .git
ROBOCOPY local_editor\runner_component\core electron_app\py\connector /E /XD /NFL /NDL .git
ROBOCOPY local_editor\runner_component\tools\nncd_console electron_app\py\server\nncd_console /E /XD /NFL /NDL .git
ROBOCOPY local_editor\runner_component\tools\nncd_console electron_app\py\connector\nncd_console /E /XD /NFL /NDL .git

PUSHD electron_app

set "file_path=./opt-ex.zip"
set "expected_hash=363c93b4cc77060543fb74dbd7d071c6ff23d52dd5fbbcfd54f5b9c8d35d96c7"

for /f %%H in ('powershell -Command "(Get-FileHash -Algorithm SHA256 '%file_path%' | Select-Object -ExpandProperty Hash).ToLower()"') do (
    set "actual_hash=%%H"
)

if "%actual_hash%"=="%expected_hash%" (
    echo opt-ex.zip verify sucessfully.
) else (
    echo opt-ex.zip verify failed.
)

@REM compress python_bundles
SET source_folder=python_bundles
SET br_file=%source_folder%.tar.br
CALL tar -cf - %source_folder% | brotli.exe -9 > %br_file% || GOTO :error_pack
rmdir /s /q %source_folder%

CALL npm list -g cross-env || CALL npm install cross-env || GOTO :error
CALL npx cross-env ELECTRON_GET_USE_PROXY=true GLOBAL_AGENT_HTTPS_PROXY=%http_proxy% npm install || GOTO :error

IF %1 == "gpu" (
    CALL npm run win-gpu-dist || GOTO :error  
) ELSE (
    CALL npm run win-cpu-dist || GOTO :error
)

DEL %br_file% 2>nul

GOTO :end

:error
POPD
ECHO An error occured when npm install or npm run
EXIT /b 255

:error_pip
POPD
ECHO An error occured when pip install
EXIT /b 255

:error_pack
POPD
ECHO An error occured when compress python_bundles
EXIT /b 255

:end
POPD