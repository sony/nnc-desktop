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

$DIR_DASHBOARD='web'
$DIR_NEW_EDITOR='new_editor'

echo cd ../$DIR_DASHBOARD
cd ../$DIR_DASHBOARD

Function Save-JsonToFile($json, $filePath) {
    $jsonStr = ConvertTo-Json $json | % { $_ -replace '\\u0026', '&' -replace '\\u0027', "'" -replace '\\u003c', '<' -replace '\\u003e', '>' }
    $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
    $currentDirectory = Get-Location
    $absolutePath = Join-Path $currentDirectory $filePath

    $sw = New-Object System.IO.StreamWriter($absolutePath, $false, $utf8NoBom)
    try {
        $sw.Write($jsonStr)
        Write-Host "File written successfully to $filePath"
    } catch {
        Write-Error "Failed to write file: $_"
    } finally {
        $sw.close()
    }
}


$json = Get-Content './package.json' | Out-String | ConvertFrom-Json
echo mod windows bactch scripts
$json.scripts.'copy-error' = "suppress-exit-code robocopy .\src\error ..\dist\console\error\ /E /XD /NFL /NDL .git"
$json.scripts.'copy-html' = "copy /Y .\src\*.html ..\dist\console\ "
$json.scripts.'copy-image' = "suppress-exit-code robocopy .\src\image ..\dist\console\image /E /XD /NFL /NDL .git"
$json.scripts.'copy-css' =  "suppress-exit-code robocopy .\\src\\css ..\\dist\\console\\css  /E /XD /NFL /NDL .git  && suppress-exit-code robocopy .\\node_modules\\sweetalert2\\dist ..\\dist\\console\\lib\\css sweetalert2.min.css  /E /XD /NFL /NDL .git && suppress-exit-code robocopy .\\node_modules\\vue2-timepicker\\dist ..\\dist\\console\\lib\\css VueTimepicker.css   /E /XD /NFL /NDL .git"
$json.scripts.'copy-browser' = "suppress-exit-code robocopy .\src\browser\ ..\dist\console\browser\ /E /XD /NFL /NDL .git"
$json.scripts.'copy-project-converter-js' = "suppress-exit-code robocopy ..\new_editor\shared_scripts\ ..\dist\console\js\ ProjectConverter.js /s /XD /NFL /NDL .git"
$json.scripts.'copy-empty-configuration-js' = "suppress-exit-code robocopy ..\new_editor\shared_scripts\ ..\dist\console\js\ EmptyConfiguration.js /s /XD /NFL /NDL .git"
$json.scripts.'copy-nnabla-corelib-defs-js' = "suppress-exit-code robocopy ..\new_editor\shared_scripts\ ..\dist\console\js\ nnabla-corelib-defs.js /s /XD /NFL /NDL .git"
$json.scripts.'copy-auth-js' = "suppress-exit-code robocopy ..\common\dist\ ..\dist\console\js\ auth.js /E /XD /NFL /NDL .git"
$json.scripts.'local-build' = "npm run lint && npm run create-directory && suppress-exit-code robocopy ..\common\env\ ..\dist\console\js\ local.js /E /XD /NFL /NDL .git &&move ..\dist\console\js\local.js ..\dist\console\js\environment.js && webpack -d && npm run copy-resource && npm run copy-misc-js"
$json.scripts.'dev-build' = "npm run lint && npm run create-directory && suppress-exit-code robocopy ..\common\env\ ..\dist\console\js\ dev.js /E /XD /NFL /NDL .git &&move ..\dist\console\js\dev.js ..\dist\console\js\environment.js && webpack -d && npm run copy-resource && npm run copy-misc-js"
$json.scripts.'qa-build' = "npm run create-directory && suppress-exit-code robocopy ..\common\env\ ..\dist\console\js\ qa.js /E /XD /NFL /NDL .git && move ..\dist\console\js\qa.js ..\dist\console\js\environment.js && webpack && npm run copy-resource && npm run copy-misc-js"
$json.scripts.'stage-build' = "npm run create-directory && suppress-exit-code robocopy ..\common\env\ ..\dist\console\js\ stg.js /E /XD /NFL /NDL .git && move ..\dist\console\js\stg.js ..\dist\console\js\environment.js && webpack && npm run copy-resource && npm run copy-misc-js"
$json.scripts.'prod-build' = "npm run create-directory && suppress-exit-code robocopy ..\common\env\ ..\dist\console\js\ prod.js /E /XD /NFL /NDL .git && move ..\dist\console\js\prod.js ..\dist\console\js\environment.js && webpack && npm run copy-resource && npm run copy-misc-js"
Save-JsonToFile -json $json -filePath '.\package.json'



# modify new editor package.json
echo "cd ../${DIR_NEW_EDITOR}"
cd ../${DIR_NEW_EDITOR}
$json = Get-Content './package.json' | Out-String | ConvertFrom-Json
$json.scripts.'prod-build' = "vite build && copy dist\index.html ..\dist\console\editor && suppress-exit-code robocopy dist\editor_assets ..\dist\console\editor_assets /E /XD .git /NFL /NDL  && suppress-exit-code robocopy .\error ..\dist\console\error /E /NFL /NDL && suppress-exit-code robocopy .\lib ..\dist\console\lib /E /NFL /NDL &&  suppress-exit-code robocopy shared_scripts ..\dist\console\js /E /XD .git /NFL /NDL"
Save-JsonToFile -json $json -filePath '.\package.json'
