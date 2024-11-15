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

# currently nnabla does not provide macox build officially for latest branch
# we will build nnabla whl manually
set -eux

NNCD_ROOT=$(dirname $(dirname $(dirname $(readlink -f $0))))
cd $NNCD_ROOT

mkdir nnabla-workdir
pushd nnabla-workdir

if [ ! -e protobuf-build/protoc ]
then
    rm -rf protobuf-21.12
    rm -rf protobuf-build
    wget https://github.com/protocolbuffers/protobuf/archive/refs/tags/v21.12.tar.gz -O - |tar xzf -
    mkdir protobuf-build
    pushd protobuf-build
    cmake -Dprotobuf_BUILD_TESTS=OFF ../protobuf-21.12/cmake
    make -j8
    popd
fi

if [ ! -e nnabla-build/dist/nnabla*arm64.whl -o ! -e nnabla-build/dist/nnabla_converter*.whl ]
then
    rm -rf nnabla
    rm -rf nnabla-build
    pyenv local 3.10.14
    git clone https://github.com/sony/nnabla.git
    mkdir nnabla-build
    pushd nnabla-build
    python -m venv nnabla-venv
    source nnabla-venv/bin/activate
    python -m pip install -U pip
    # master branch has Cython issue
    perl -i -pe 's/^Cython$/Cython==3.0.10/g' ../nnabla/python/requirements.txt
    perl -i -pe 's/^numpy$/numpy==1.26.4/g' ../nnabla/python/requirements.txt
    python -m pip install -U -r ../nnabla/python/requirements.txt
    python -m pip install -U -r ../nnabla/python/setup_requirements.txt
    cmake -DPROTOC_COMMAND=$(readlink -f ../protobuf-build/protoc) ../nnabla
    make -j8
    deactivate
    popd
fi

NNABLA_WHL=$(readlink -f nnabla-build/dist/nnabla*arm64.whl)
NNABLA_CONVERTER_WHL=$(readlink -f nnabla-build/dist/nnabla_converter*.whl)

echo ${NNABLA_WHL}
echo ${NNABLA_CONVERTER_WHL}
popd

pyenv local 3.10.14
nodenv local 20.15.0

. local_editor/scripts/build-web-page-macos.sh
rm -rf electron_app/console
mv console electron_app/
wget https://nnabla.org/pkg/nncd-opt-ex.zip -O electron_app/opt-ex.zip

# copy python directory and web and runner code
[[ -d electron_app/dist ]] && rm -rf electron_app/dist
[[ -d electron_app/py/connector ]] && rm -rf electron_app/py/connector
[[ -d electron_app/py/server ]] && rm -rf electron_app/py/server
[[ -d electron_app/python_bundles ]] && rm -rf electron_app/python_bundles

cp -rf local_editor/python_modules electron_app/py/server 
cp -rf local_editor/runner_component/core electron_app/py/connector
cp -rf local_editor/runner_component/tools/nncd_console electron_app/py/server/
cp -rf local_editor/runner_component/tools/nncd_console electron_app/py/connector/
cp -rf ~/.anyenv/envs/pyenv/versions/3.10.14 electron_app/python_bundles

# # copy lib
libs=(
  "/opt/homebrew/lib/libintl.8.dylib"
  "/opt/homebrew/lib/libssl.3.dylib"
  "/opt/homebrew/lib/libcrypto.3.dylib"
  "/opt/homebrew/opt/readline/lib/libreadline.8.dylib"
  "/opt/homebrew/opt/ncurses/lib/libncursesw.6.dylib"
  "/opt/homebrew/opt/ncurses/lib/libpanelw.6.dylib"
  "/opt/homebrew/opt/xz/lib/liblzma.5.dylib"
)

for lib in "${libs[@]}"; do
  cp -L "$lib" electron_app/python_bundles/lib/ || exit 1
done


# # pip install
electron_app/python_bundles/bin/python3.10 -m pip install --upgrade pip || exit 1
electron_app/python_bundles/bin/python3.10 -m pip install ${NNABLA_WHL} || exit 1
electron_app/python_bundles/bin/python3.10 -m pip install ${NNABLA_CONVERTER_WHL} || exit 1
electron_app/python_bundles/bin/python3.10 -m pip install -r local_editor/requirements.txt || exit 1
electron_app/python_bundles/bin/python3.10 -m pip install local_editor/runner_component/tools/console_cli/*.whl || exit 1
# electron_app/python_bundles/bin/python3.10 -m pip install local_editor/runner_component/tools/nnabla_ssh/*.whl || exit 1

pushd electron_app > /dev/null
npm install -g cross-env || exit 1
npx cross-env ELECTRON_GET_USE_PROXY=true GLOBAL_AGENT_HTTPS_PROXY=${http_proxy:-} npm install || exit 1
npm run mac-dist || exit 1
popd > /dev/null

