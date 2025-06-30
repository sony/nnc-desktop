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

Param(
    [parameter(mandatory=$true)]$PYTHON_DIR,
    [parameter(mandatory=$true)]$COMMAND
)

New-Item -Path ".\build" -ItemType "Directory"
Copy-Item -Recurse ".\electron_app" ".\build\"
$ErrorActionPreference = "Continue"
Invoke-WebRequest -Uri "https://nnabla.org/pkg/nncd-opt-ex.zip" -OutFile ".\build\electron_app\opt-ex.zip"
$ErrorActionPreference = "Stop"
Copy-Item -Recurse ".\console" ".\build\electron_app\"
Copy-Item -Recurse ".\local_editor\python_modules" ".\build\electron_app\py\server"
Copy-Item -Recurse ".\local_editor\runner_component\core" ".\build\electron_app\py\connector"
Copy-Item -Recurse ".\local_editor\runner_component\tools\nncd_console" ".\build\electron_app\py\server\"
Copy-Item -Recurse ".\local_editor\runner_component\tools\nncd_console" ".\build\electron_app\py\connector\"
Copy-Item -Recurse "$PYTHON_DIR" ".\build\electron_app\python_bundles"
Remove-Item ".\build\electron_app\python_bundles\python-3.*-amd64.exe"

cd .\build\electron_app
echo tar.exe -czf python_bundles.tgz python_bundles
echo Remove-Item -Recurse ".\python_bundles"
npm ci
npm run $COMMAND
cd ..\..

Move-Item -Path ".\build\electron_app\dist" ".\"
Remove-Item -Recurse ".\build"
