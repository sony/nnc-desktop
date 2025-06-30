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
set -eu

protobuf_build() {
    wget -q "https://github.com/protocolbuffers/protobuf/archive/refs/tags/v$1.tar.gz" -O - |tar xzf -

    mkdir build
    pushd build
    cmake -Dprotobuf_BUILD_TESTS=OFF "../protobuf-$1/cmake"
    make -j8
    popd
}

nnabla_build() {
    local protoc_location
    protoc_location=$(readlink -f $2)
    git clone -b v$1 --depth 1 https://github.com/sony/nnabla.git

    python -m venv nnabla-venv
    . nnabla-venv/bin/activate
    python -m pip install -U pip
    sed -ie 's/^Cython$/Cython==3.0.10/g' nnabla/python/requirements.txt
    sed -ie 's/^numpy$/numpy==1.26.4/g' nnabla/python/requirements.txt
    python -m pip install -U -r ./nnabla/python/requirements.txt
    python -m pip install -U -r ./nnabla/python/setup_requirements.txt

    mkdir build
    pushd build
    cmake -DPROTOC_COMMAND=${protoc_location} ../nnabla
    make -j8
    popd
    deactivate
}


NNCD_ROOT=$(dirname $(dirname $(dirname $(readlink -f $0))))
cd $NNCD_ROOT

rm -rf ./build
mkdir ./build
pushd ./build

mkdir ./protobuf
pushd ./protobuf
protobuf_build "21.12"
popd

mkdir ./nnabla
pushd ./nnabla
nnabla_build "1.39.0" "../protobuf/build/protoc"
popd

popd

mv ./build/nnabla/build/dist/nnabla-*.whl ./
mv ./build/nnabla/build/dist/nnabla_converter-*.whl ./

rm -rf ./build
