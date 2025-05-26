#!/bin/bash
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

set -eu

if [ $# -ne 2 ]; then
    echo "$0 [python directory] [run command]"
    exit 1
fi

PYTHON_DIR=$1
COMMAND=$2

rm -rf ./dist
rm -rf ./build
mkdir ./build
cp -r ./electron_app ./build/
wget -q https://nnabla.org/pkg/nncd-opt-ex.zip -O ./build/electron_app/opt-ex.zip || true
cp -r ./console ./build/electron_app/
cp -r ./local_editor/python_modules ./build/electron_app/py/server
cp -r ./local_editor/runner_component/core ./build/electron_app/py/connector
cp -r ./local_editor/runner_component/tools/nncd_console ./build/electron_app/py/server/
cp -r ./local_editor/runner_component/tools/nncd_console ./build/electron_app/py/connector/
cp -r ${PYTHON_DIR} ./build/electron_app/python_bundles
rm -f ./build/electron_app/python_bundles/Python-3.*.tgz
chmod 666 ./build/electron_app/py/server/nncd_console/settings/settings.ini
chmod 666 ./build/electron_app/py/connector/nncd_console/settings/settings.ini

pushd ./build/electron_app
npm ci
npm run ${COMMAND}
popd

mv ./build/electron_app/dist ./
rm -rf ./build
