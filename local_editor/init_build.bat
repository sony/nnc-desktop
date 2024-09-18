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

set ROOT=%cd%
set DIR_DASHBOARD=web
set DIR_NEW_EDITOR=new_editor
set DIR_DIST=dist
set DIR_DIST_CONSOLE=dist\console
set DIR_TOP=top
set ENV=prod

node -v
if errorlevel 1 goto node_error

CALL npm install -g rimraf suppress-exit-code

PUSHD ..\%DIR_DASHBOARD%
if exist node_modules\ (
    CALL rimraf node_modules 
)
CALL npm install
POPD

echo "env=%ENV%"

PUSHD %ROOT%\..
echo "PUSHD %ROOT%\.."
if exist dist\ (
    CALL rimraf dist 
)

mkdir %DIR_DIST%
echo "mkdir %DIR_DIST%"
POPD

@REM build dashboard
echo "PUSHD ..\%DIR_DASHBOARD%"
PUSHD ..\%DIR_DASHBOARD%
echo "npm run %ENV%-build"
CALL npm run %ENV%-build

if errorlevel 1 (
    call :build_error "Build failed in %DIR_DASHBOARD%"
    goto build_failed
)
POPD


@REM build new top
echo "PUSHD %DIR_TOP%"
PUSHD ..\%DIR_TOP%
echo "npm install"
if exist node_modules\ (
  CALL rimraf node_modules 
)
CALL npm install
echo "npm run build"
CALL npm run build
if errorlevel 1 (
    call :build_error "Build failed in %DIR_TOP%"
    goto build_failed
)
POPD

@REM build new editor
echo "PUSHD %DIR_NEW_EDITOR%"
PUSHD ..\%DIR_NEW_EDITOR%
echo "npm install"
if exist node_modules\ (
  CALL rimraf node_modules 
)
CALL npm install
echo "npm run build"
CALL npm run %ENV%-build
if errorlevel 1 (
    call :build_error "Build failed in %DIR_NEW_EDITOR%"
    goto build_failed
)
POPD

echo Bundles successfully!
goto end

:node_error
echo Error: Failed to execute node commands. Please check if Node.js 20.15.0 is installed and set properly.
exit /b 1

:build_error
set "ERROR_MSG=%~1"
echo Error: %ERROR_MSG%
exit /b

:build_failed
POPD
exit /b 1

:end