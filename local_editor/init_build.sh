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

set -e
ROOT=$(dirname $(pwd))
DIR_DASHBOARD="web"
DIR_NEW_EDITOR="new_editor"
DIR_DIST="dist"
DIR_DIST_CONSOLE="dist/console"
DIR_TOP="top"
ENV="prod"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

cd ${ROOT}/
echo "cd ${ROOT}/"

nvm use 14.21.3
##############################
###  install package       ###
##############################


echo "cd ${DIR_DASHBOARD}"
pushd ${DIR_DASHBOARD}
echo "npm install"
rm -rf node_modules/
npm install
popd

##############################
###  build dist            ###
##############################
echo "env=${ENV}"
if [ -d ${DIR_DIST} ]; then
    echo "rm -r ${DIR_DIST}/*"
    rm -rf ${DIR_DIST}
    mkdir ${DIR_DIST}
else
    mkdir ${DIR_DIST}
    echo "mkdir ${DIR_DIST}"
fi


## build dashboard
echo "cd ${DIR_DASHBOARD}"
pushd ${DIR_DASHBOARD}
echo "npm run ${ENV}-build"
npm run ${ENV}-build
popd


nvm use 20.9.0
##############################
### install & build new editor ###
##############################

echo "cd ${DIR_TOP}"
pushd ${DIR_TOP}
echo "npm install"
rm -rf node_modules/
npm install
echo "npm run build"
npm run build
popd

pushd ${DIR_NEW_EDITOR}
echo "npm install"
rm -rf node_modules/
npm install
if [ ${ENV} == "local" ]; then
    echo "Build new editor with local env do nothing."
else
    echo "npm run build"
    npm run ${ENV}-build
fi
popd