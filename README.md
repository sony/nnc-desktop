# NNCD release-v0.1.0
## Quickstart

# Build from source
## Linux platform (ubuntu && rockylinux)
**Make sure you have installed Docker, and checkout submodule correctly**

If you intend to build docker images locally behind a proxy, ensure http_proxy and https_proxy have been correctly set in environment.

### For ubuntu (tested on ubuntu20.04 sucessfully)
Please execute following commands under directory `nnabla-console`:

```
make build-web-page
make build-deb
```

### For Rockylinux8 (tested on rockylinux8.8 sucessfully)
Please execute following commands under directory `nnabla-console`:

```
make build-web-page
make build-rpm
```

If you try to build for other platform, you can refer to the `dockerfile*` file in the `nnabla-console/local_editor/docker/electron/*` directory.

## Windows platform
### Prerequisites

#### Python
Install Python3.9.13 and PIP to C:\Python39 from [Official page](https://www.python.org/downloads/)

#### Node
Download nvm installer from https://github.com/coreybutler/nvm-windows/releases/download/1.1.11/nvm-setup.exe

After nvm installation is complete, execute the following commands in cmd:
```
nvm install 14.21.3
nvm install 20.9.0
```

Then execute following commands in cmd under directory `nnabla-console`: 
```
local_editor\scripts\build-image-nncd-web-page.bat
local_editor\scripts\build_exe.bat "cpu"
```