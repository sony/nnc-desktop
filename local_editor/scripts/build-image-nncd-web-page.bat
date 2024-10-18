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
CD %~dp0

CD ..\..
ROBOCOPY nnc-web\common\ tmp\nnc-web\common /E /XD /NFL /NDL .git
ROBOCOPY nnc-web\web\ tmp\nnc-web\web /E /XD /NFL /NDL .git
ROBOCOPY local_editor\ tmp\nnc-web\local_editor /E /XD /NFL /NDL .git

SET ROOT=%cd%

PUSHD .\tmp\nnc-web\local_editor
ROBOCOPY web_component\local_editor_web\ %ROOT%\tmp\nnc-web\web  /E /XD /NFL /NDL .git
ROBOCOPY web_component\local_editor_editor\ %ROOT%\tmp\nnc-web\new_editor  /E /XD /NFL /NDL .git
ROBOCOPY web_component\local_editor_top\ %ROOT%\tmp\nnc-web\top  /E /XD /NFL /NDL .git
Powershell.exe -executionpolicy remotesigned -File .\modify_file.ps1
cmd /c .\init_build.bat

if errorlevel 1 (
    echo init_build.bat failed with exit code %ERRORLEVEL%.
    echo Please check init_build.bat for errors.
    POPD
    CALL rimraf tmp
    exit /b %ERRORLEVEL%
) else (
    echo init_build.bat completed successfully.
)

POPD
if exist %TEMP%\nncd (
    CALL rimraf %TEMP%\nncd
)
mkdir %TEMP%\nncd
PUSHD .\tmp\nnc-web
ROBOCOPY dist\ %TEMP%\nncd\dist  /E /XD /NFL /NDL .git
ROBOCOPY top\dist\assets\ %TEMP%\nncd\dist\console\assets  /E /XD /NFL /NDL .git
ROBOCOPY top\dist\project\ %TEMP%\nncd\dist\console\project  /E /XD /NFL /NDL .git
ROBOCOPY local_editor\resource\docs\ %TEMP%\nncd\dist\console\docs  /E /XD /NFL /NDL .git
ROBOCOPY common %TEMP%\nncd\dist\console favicon.ico /s /XD /NFL /NDL .git
POPD

RMDIR /S/Q %TEMP%\nncd\dist\console\lib\dummy
PUSHD .\electron_app
if exist console (
    CALL rimraf console
)
if exist dist (
    CALL rimraf dist
)
if exist python_bundles (
    CALL rimraf python_bundles
)
ROBOCOPY %TEMP%\nncd\dist\console\ console /E /XD /NFL /NDL .git
POPD
CALL rimraf tmp
CALL rimraf %TEMP%\nncd

:end