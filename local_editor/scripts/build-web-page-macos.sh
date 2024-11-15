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

rm -rf console
rm -rf /tmp/nnc-web
mkdir -p /tmp/nnc-web/
cp -r nnc-web/common/ /tmp/nnc-web/common
cp -r nnc-web/web/ /tmp/nnc-web/web
cp -r local_editor/ /tmp/nnc-web/local_editor

pushd /tmp/nnc-web/
pushd local_editor
cp -rf web_component/local_editor_web/* /tmp/nnc-web/web
cp -rf web_component/local_editor_editor/ /tmp/nnc-web/new_editor
cp -rf web_component/local_editor_top/ /tmp/nnc-web/top
bash init_build_macos.sh
popd
cp -r top/dist/assets dist/console/
cp -r top/dist/project dist/console/
cp -r local_editor/resource/docs dist/console/
cp common/favicon.ico dist/console/
rm -rf dist/console/lib/dummy
popd

cp -rf /tmp/nnc-web/dist/console ./
rm -rf /tmp/nnc-web
