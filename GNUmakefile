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

########################################################################################################################
# Suppress most of make message.
.SILENT:

NNCD_DIRECTORY ?= $(shell pwd)
NNCD_VERSION ?= $(shell cat $(NNCD_DIRECTORY)/VERSION.txt)

DOCKER_BUILD_ARGS = --build-arg http_proxy=${http_proxy} --build-arg https_proxy=${https_proxy}

NNCD_DOCKER_RUN_OPTS +=--rm
NNCD_DOCKER_RUN_OPTS +=--entrypoint=
NNCD_DOCKER_RUN_OPTS += -v $$(pwd):$$(pwd)
NNCD_DOCKER_RUN_OPTS += -w $$(pwd)
NNCD_DOCKER_RUN_OPTS += -u $$(id -u):$$(id -g)

# create web console directory for electron app
ELECTRON_TAG=$(shell find ./local_editor/ -type f -exec md5sum {} \; | md5sum |cut -d \  -f 1)
DOCKER_IMAGE_NNCD_WEB_PAGE_BUILD=sony/nnc-desktop-web-page-build:${ELECTRON_TAG}
DOCKER_IMAGE_NNCD_DEB_BUILD=sony/nnc-desktop-deb-build:${ELECTRON_TAG}
DOCKER_IMAGE_NNCD_RPM_BUILD=sony/nnc-desktop-rpm-build:${ELECTRON_TAG}

docker-image-nncd-web-page:
	docker build \
		-f local_editor/docker/web/Dockerfile.webserver $(DOCKER_BUILD_ARGS) \
		-t $(DOCKER_IMAGE_NNCD_WEB_PAGE_BUILD) $(NNCD_DIRECTORY)

docker-image-nncd-cpu-deb-build:
	docker build \
		-f local_editor/docker/electron/Dockerfile.deb $(DOCKER_BUILD_ARGS) --build-arg BUILD_TYPE=cpu \
		-t $(DOCKER_IMAGE_NNCD_DEB_BUILD) $(NNCD_DIRECTORY)

docker-image-nncd-deb-build:
	docker build \
		-f local_editor/docker/electron/Dockerfile.deb $(DOCKER_BUILD_ARGS) --build-arg BUILD_TYPE=gpu \
		-t $(DOCKER_IMAGE_NNCD_DEB_BUILD) $(NNCD_DIRECTORY)

docker-image-nncd-rpm-build:
	docker build \
		-f local_editor/docker/electron/Dockerfile.rpm $(DOCKER_BUILD_ARGS) \
		-t $(DOCKER_IMAGE_NNCD_RPM_BUILD) $(NNCD_DIRECTORY)

.PHONY: build-web-page
build-web-page: docker-image-nncd-web-page
	docker run --rm -v $$(pwd):$$(pwd) -w $$(pwd) --entrypoint= $(DOCKER_IMAGE_NNCD_WEB_PAGE_BUILD) \
		bash -c "cp -r /opt/dist/console ./ && chown -R $$(id -u):$$(id -g) console"

.PHONY: build-cpu-deb
build-cpu-deb: docker-image-nncd-cpu-deb-build
	docker run --rm -v $$(pwd):$$(pwd) -w $$(pwd)  $(DOCKER_IMAGE_NNCD_DEB_BUILD) \
		bash -c "cp -r /tmp/electron_app/dist ./ && chown -R $$(id -u):$$(id -g) dist"

.PHONY: build-deb
build-deb: docker-image-nncd-deb-build
	docker run --rm -v $$(pwd):$$(pwd) -w $$(pwd)  $(DOCKER_IMAGE_NNCD_DEB_BUILD) \
		bash -c "cp -r /tmp/electron_app/dist ./ && chown -R $$(id -u):$$(id -g) dist"

.PHONY: build-rpm
build-rpm: docker-image-nncd-rpm-build
	docker run --rm -v $$(pwd):$$(pwd) -w $$(pwd)  $(DOCKER_IMAGE_NNCD_RPM_BUILD) \
		bash -c "cp -r /tmp/electron_app/dist ./ && chown -R $$(id -u):$$(id -g) dist"

