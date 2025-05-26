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

rm -rf ./build
mkdir ./build
cp -r nnc-web/common ./build/
cp -r nnc-web/web ./build/
cp -r local_editor ./build/
cp -rf ./build/local_editor/web_component/local_editor_web/* ./build/web/
cp -rf ./build/local_editor/web_component/local_editor_editor ./build/new_editor
cp -rf ./build/local_editor/web_component/local_editor_top ./build/top

pushd ./build/local_editor
bash init_build.sh
popd

cp -r ./build/top/dist/assets ./build/dist/console/
cp -r ./build/top/dist/project ./build/dist/console/
cp -r ./build/local_editor/resource/docs ./build/dist/console/
cp ./build/common/favicon.ico ./build/dist/console/
rm -rf ./build/dist/console/lib/dummy
mv ./build/dist/console ./
rm -rf ./build
