# NNCD release-v0.1.0
## Quickstart

# Build from source
## Linux platform (ubuntu && rockylinux)
**Make sure you have installed Docker, and checkout submodule correctly**

If you intend to build docker images locally behind a proxy, ensure http_proxy and https_proxy have been correctly set in environment.

### For ubuntu (tested on ubuntu20.04 sucessfully)
Please execute following commands under directory `nnc-desktop`:

```
make build-web-page
make build-deb
```

### For Rockylinux8 (tested on rockylinux8.8 sucessfully) (experimental)
Please execute following commands under directory `nnc-desktop`:

```
make build-web-page
make build-rpm
```

If you try to build for other platform, you can refer to the `dockerfile*` file in the `nnc-desktop/local_editor/docker/electron/*` directory.

## Windows platform
### Prerequisites

#### Python
Install Python3.10.8 and PIP to C:\Python310 from [Official page](https://www.python.org/downloads/)

#### Node
Download nvm installer from https://github.com/coreybutler/nvm-windows/releases/download/1.1.11/nvm-setup.exe

After nvm installation is complete, execute the following commands in cmd:
```
nvm install 20.15.0
```

Then execute following commands in cmd under directory `nnc-desktop`:
```
local_editor\scripts\build-image-nncd-web-page.bat
local_editor\scripts\build_exe.bat "cpu"
```

## macOS Apple Silicon platform (experimental)
### Prerequisites

#### Python && Node
We use anyenv, pyenv and nodenv for version managing in our test, please ensure all above version managers have been correctly installed in your environment.

You can test by executing:
```bash
pyenv install --list
nodenv install -L
```

Install Python3.10.14 and PIP by:
```bash
pyenv install 3.10.14
```

Install Node 20.15.0 by:
```bash
nvm install 20.15.0
```

Then execute following commands in cmd under directory `nnc-desktop`:
```
bash local_editor\scripts\build_mac_applesilicon.sh
```

You can find the installer under `electron_app/dist` directory after building process finished.