#!/bin/bash
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
rm -rf dist/console/lib/dummy
popd

cp -rf /tmp/nnc-web/dist/console ./
rm -rf /tmp/nnc-web
