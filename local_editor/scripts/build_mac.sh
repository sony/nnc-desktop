#!/bash
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

NNABLA_VERSION=1.33.1
NODE_VERSION=14.19.3
PYTHON_VERSION=3.9.13

# copy python directory and web and runner code
[[ -d electron_app/py/server ]] && rm -rf electron_app/py/server
[[ -d electron_app/py/connector ]] && rm -rf electron_app/py/connector
[[ -d electron_app/py/server ]] && rm -rf electron_app/py/server
[[ -d electron_app/python_bundles ]] && rm -rf electron_app/python_bundles

cp -rf local_editor/python_modules electron_app/py/server 
cp -rf local_editor/runner_component/core electron_app/py/connector
cp -rf local_editor/runner_component/tools/nncd_console electron_app/py/server/
cp -rf local_editor/runner_component/tools/nncd_console electron_app/py/connector/
cp -rf ~/.anyenv/envs/pyenv/versions/3.9.13 electron_app/python_bundles || exit 1

# # copy lib
cp -P /usr/local/opt/gettext/lib/libintl.8.dylib electron_app/python_bundles/bin/ || exit 1
cp -P /usr/local/opt/openssl@1.1/lib/libssl.1.1.dylib electron_app/python_bundles/lib/python3.9/lib-dynload/ || exit 1
cp -P /usr/local/opt/openssl@1.1/lib/libcrypto.1.1.dylib electron_app/python_bundles/lib/python3.9/lib-dynload/ || exit 1

install_name_tool \
    -change /usr/local/opt/gettext/lib/libintl.8.dylib "@executable_path/libintl.8.dylib" \
    electron_app/python_bundles/bin/python3.9 || exit 1
install_name_tool \
    -change /usr/local/opt/openssl@1.1/lib/libssl.1.1.dylib "@loader_path/libssl.1.1.dylib" \
    electron_app/python_bundles/lib/python3.9/lib-dynload/_ssl.cpython-39-darwin.so || exit 1
install_name_tool \
    -change /usr/local/opt/openssl@1.1/lib/libcrypto.1.1.dylib "@loader_path/libcrypto.1.1.dylib" \
    electron_app/python_bundles/lib/python3.9/lib-dynload/_ssl.cpython-39-darwin.so || exit 1
install_name_tool \
    -change /usr/local/Cellar/openssl@1.1/1.1.1q/lib/libcrypto.1.1.dylib "@loader_path/libcrypto.1.1.dylib" \
    electron_app/python_bundles/lib/python3.9/lib-dynload/libssl.1.1.dylib || exit 1

# # pip install
electron_app/python_bundles/bin/python3.9 -m pip install --upgrade pip || exit 1
electron_app/python_bundles/bin/python3.9 -m pip install nnabla==${NNABLA_VERSION} || exit 1
electron_app/python_bundles/bin/python3.9 -m pip install nnabla_converter==${NNABLA_VERSION} || exit 1
electron_app/python_bundles/bin/python3.9 -m pip install -r local_editor/requirements.txt || exit 1
electron_app/python_bundles/bin/python3.9 -m pip install local_editor/runner_component/tools/console_cli/*.whl || exit 1

pushd electron_app > /dev/null
nodenv local ${NODE_VERSION}
npm install -g cross-env || exit 1
npx cross-env ELECTRON_GET_USE_PROXY=true GLOBAL_AGENT_HTTPS_PROXY=$http_proxy npm install || exit 1
npm run mac-dist || exit 1
popd > /dev/null

