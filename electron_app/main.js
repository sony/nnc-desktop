/* Copyright 2024 Sony Group Corporation. */
/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

//  Module to control application lifecycle and create native browser windows
const { app, BrowserWindow } = require('electron')
const path = require('path')
const fs = require('fs');
const zlib = require('node:zlib')
const tar = require('tar')
const { spawn } = require('child_process')
const { session, ipcMain } = require('electron')
const windowStateKeeper = require('electron-window-state');
const Splashscreen = require('@trodi/electron-splashscreen');
const appInstanceLock = app.requestSingleInstanceLock()

const pythonBundlesPack = 'python_bundles.tar.br'
let pyServerProc = null
let pyServerPort = 5555
let pyConnectorPort = 5556
let pyConnectorProc = null
let pythonExecutable = null
let isWinPlatform = process.platform === 'win32'
const isMacOS = process.platform === 'darwin'

const pythonSourceDir = process.env.NODE_ENV !== "develop" ? path.join(__dirname, '..') : __dirname
pythonExecutable = path.join(pythonSourceDir, 'python_bundles', 'bin', 'python3.10')
if (isWinPlatform) {
  pythonExecutable = path.join(pythonSourceDir, 'python_bundles', 'python.exe')
}
process.env.PYTHON_EXECUTABLE = pythonExecutable
process.env.DESKTOP_SRC_DIR = process.env.NODE_ENV !== "develop" ?  path.dirname(app.getAppPath()) : app.getAppPath()
process.env.PYTHONNOUSERSITE = 1


// Check if a port is being used
const net = require("net")
function setAvailablePort(port) {
  const server = net.createServer()
  return new Promise((resolve, reject) => {
    server.once("error", function (err) {
      if (err.code == "EADDRINUSE") {
        resolve(setAvailablePort(port + 1))
      } else {
        reject(err)
      }
    })
    server.once("listening", function() {
      server.close()
      resolve(port)
    })
    // The host "0.0.0.0" must be the same as the host of web and connect
    server.listen(port, "0.0.0.0")
  })
}

const check_precheck = (res) => {
  if (res.indexOf('precheck ok') !== -1) {
    createServer().then(e => {
        const temp = e.split(':')
        if (temp.length === 5 && temp[3].trim() === 'web server serve at port') {
          createConnector()
          mainWindow.webContents.loadURL(`http://127.0.0.1:${pyServerPort}/#/dashboard`)
        }
      })
  } else {
    console.log(`precheck res: ${res}`)
  }
}

// copy bucket dir
async function precheck() {
  let serverScript = path.join(pythonSourceDir, 'py', 'precheck', 'precheck.py')
  pyServerProc = spawn(pythonExecutable, ['-B', serverScript])
  if (pyServerProc != null) {
    console.log(`start precheck success.`)
  }
  const promise = new Promise((resolve) => {
    pyServerProc.stdout.on("data", (data) => {
      console.log(`log in precheck:${data.toString()}`);
    });
    pyServerProc.stderr.on("data", (err) => {
      check_precheck(err.toString())
      resolve(err.toString())
    });
  });
  return promise
}

// Set avilable port to server and connector
(async() => {
  try {
    pyServerPort = await setAvailablePort(pyServerPort)
    pyConnectorPort = await setAvailablePort(pyServerPort + 1)
    process.env.SERVER_PORT = pyServerPort.toString()
    process.env.RUNNER_PORT = pyConnectorPort.toString()
  } catch (error) {
    console.error(`Error: ${error.message}`)
    app.exit()
  }
})()

let lib_path = path.join(pythonSourceDir, 'python_bundles', "lib")
if (!isWinPlatform) {
  const envVar = isMacOS ? 'DYLD_LIBRARY_PATH' : 'LD_LIBRARY_PATH';
  process.env[envVar] =
    process.env[envVar]
      ? lib_path + ':' + process.env[envVar]
      : lib_path;
}

async function createServer() {
  let serverScript = path.join(pythonSourceDir, 'py', 'server', 'server.py')
  pyServerProc = spawn(pythonExecutable, ['-B', serverScript, '-d', '-p', pyServerPort])
  if (pyServerProc != null) {
    console.log(`start server success ${pyServerProc.pid}`)
  }
  const promise = new Promise((resolve) => {
    pyServerProc.stdout.on("data", (data) => {
      console.log(`log in server:${data.toString()}`);
    });
    pyServerProc.stderr.on("data", (err) => {
      resolve(err.toString())
      console.log(`err in server: ${err.toString()}`);
    });
  });
  return promise
}

async function createConnector() {
  let connectorScript = path.join(pythonSourceDir, 'py', 'connector', 'runner_server.py')
  console.error(`${pythonExecutable}\n${connectorScript}`)
  pyConnectorProc = spawn(pythonExecutable, ['-B', connectorScript, '-p', pyConnectorPort])
  pyConnectorProc.on('error', (err) => {
    console.error(err);
  })
  if (pyConnectorProc != null) {
    console.log(`start connector success ${pyConnectorProc.pid}`)
    console.log(`connector is running on http://127.0.0.1:${pyConnectorPort}`)
  }
  const promise = new Promise((resolve) => {
    pyConnectorProc.stdout.on("data", (data) => {
      console.log(`log in connector:${data.toString()}`);
    });
    pyConnectorProc.stderr.on("data", (err) => {
      console.log(`err in connector: ${err.toString()}`);
    });
  });
  await promise
}

const exitBackend = (event) => {
  event.preventDefault();
  const killAndAwaitExit = (proc) => {
    if (proc) {
      proc.kill();
      console.log(proc.dirname);
      return new Promise(resolve => proc.on('exit', resolve));
    } else {
      return Promise.resolve();
    }
  }
  Promise.all([
    killAndAwaitExit(pyConnectorProc),
    killAndAwaitExit(pyServerProc)
  ]).then(() => {
    pyServerProc = null
    pyServerPort = null
    pyConnectorPort = null
    pyConnectorProc = null
    process.exit(0);
  });
}

app.on('will-quit', exitBackend)

let mainWindow = null
function createWindow () {
  let mainWindowState = windowStateKeeper({
    file: 'nncd_winstate.json',
    defaultWidth: 1300,
    defaultHeight: 900,
    maximize: false
  });

  const mainOpts = {
    'x': mainWindowState.x,
    'y': mainWindowState.y,
    'width': mainWindowState.width,
    'height': mainWindowState.height,
    icon: path.join(__dirname, 'asset', 'icon', '256x256.png'),
    autoHideMenuBar: true,
    webPreferences: {
      // preload: path.join(__dirname, 'preload.js'),
      spellcheck: false
    },
    show: false
  };

  const splash_screen_config = {
    windowOpts: mainOpts,
    templateUrl: path.join(pythonSourceDir, 'splash_screen.html'),
    delay: 0,
    minVisible: 1500,
    splashScreenOpts: {
      webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true,
        contextIsolation: false
      },
      width: 680,
      height: 300,
      icon: path.join(__dirname, 'asset', 'icon', '256x256.png'),
      transparent: true,
      resizable: false,
    }
  };

  ret = Splashscreen.initDynamicSplashScreen(splash_screen_config);
  mainWindow = ret.main;
  mainWindowState.manage(mainWindow);

  const handleRedirect = (e, u) => {
    // if(url != webContents.getURL()) {
    //   e.preventDefault()
    //   require('electron').shell.openExternal(url)
    // }
    const url = new URL(u)
    if (url.pathname.indexOf(`${__dirname}/console/editor`) !== -1) {
      console.log('editor page loaded.')
      mainWindow.webContents.loadURL(`http://127.0.0.1:${pyServerPort}/editor${url.search}`)
    }
    console.log('Navigate:', url)
  }

  mainWindow.webContents.on('will-navigate', handleRedirect)

  // doc window setting
  let aboutWindow = null;
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith(`http://127.0.0.1:${pyServerPort}/docs/about.html`)) {
      if (aboutWindow) {
        aboutWindow.show();
      } else {
        aboutWindow = new BrowserWindow({
          resizable: false,
          minimizable: false,
          maximizable: false,
          alwaysOnTop: true,
          scrollBounce: false,
          action: 'allow',
          width: 400,
          height: 200,
          autoHideMenuBar: true
        });

        aboutWindow.loadURL(url);

        aboutWindow.on('closed', () => {
          aboutWindow = null;
        });
      }

      return { action: 'deny' }; // Default window opening is not allowed
    } else if (url.startsWith(`http://127.0.0.1:${pyServerPort}/docs/`)) {
      return {
        action: 'allow',
        overrideBrowserWindowOptions: {
          width: 1200,
          height: 800,
          autoHideMenuBar: true
        }
      }
    }
    return { action: 'allow' }
  })

  ipcMain.on('splash_screen_ready', (event, success) => {
    // compressed python bundle only in win package
    const python_bundle_compressed = path.join(pythonSourceDir, pythonBundlesPack)
    const win_first_launch = python_bundle_compressed && fs.existsSync(python_bundle_compressed)
    if(success) {
      if(win_first_launch) {
        ret.splashScreen.webContents.send("splash_status", "Extracting python bundles...");
        try{
          const stats = fs.statSync(python_bundle_compressed)
          const totalSize = stats.size
          let currentSize = 0
          const readStream = fs.createReadStream(python_bundle_compressed)
          readStream.on('data', (chunk) => {
            currentSize += chunk.length;
            const progress = currentSize / totalSize * 100
            ret.splashScreen.webContents.send("extract_percent", progress.toFixed(2));
          })
          .pipe(zlib.createBrotliDecompress())
          .pipe(tar.x({ C: pythonSourceDir }))
          .on('finish', () => {
            fs.unlink(python_bundle_compressed, err => console.error(`delete ${python_bundle_compressed} error:${err}`))
            ret.splashScreen.webContents.send("splash_status", "Extracting complete. Launching...")
            precheck()
          });
        }catch(ex) {
          console.error('Extracting extensions environment cache error: ', ex);
          ret.splashScreen.webContents.send("splash_status", `Extracting failed: ${ex}`);
        }
      } else {
        ret.splashScreen.webContents.send("splash_status", "Launching...");
        precheck()
      }
    }
  })

  // open devtools
  // mainWindow.webContents.openDevTools()
}



if (!appInstanceLock) {
  // To have only one window
  console.log("May have Initialized local storage NNCD.")
  console.log("If there is no NNCD window, stop the NNCD process from the background.");
  app.quit()
} else {
  app.on("second-instance", (event, commandLine, workingDirectory) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })
  app.whenReady().then(() => {
    createWindow()

    // deal with the signal of Ctrl+C
    process.on("SIGINT", () => {
      app.quit()
    })

    const filter = {
      // urls: ['file:///console/*', `file://${__dirname}/console/editor*`]
      urls: ['file:///console/*', 'file:///docs/*']
    }
    session.defaultSession.webRequest.onBeforeRequest(filter, (details, callback) => {

      const url = new URL(details.url);
      if (url.pathname.startsWith('/docs')) {
        if (url.pathname.endsWith('html/')) {
          callback({
            redirectURL: `file://${__dirname}/console${url.pathname}`.slice(0, -1)
          });
        } else {
          callback({
            redirectURL: `file://${__dirname}/console${url.pathname}`
          });
        }
      } else {
        callback({
          redirectURL: `file://${__dirname}${url.pathname}`
        });
      }
    });

    app.on('activate', function () {
       // Typically on macOS, when the application icon in the dock is clicked
       // if there are no other open windows, the program will create a new window.
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })
}


// Except for macOS, the program will quit when all windows are closed.
// Therefore, it is generally necessary for the program and its icon in the taskbar to remain active until the user quits using Cmd + Q.
// temporarily disable this for right click quit doesn't work
// app.on('window-all-closed', function () {
//   if (process.platform !== 'darwin') app.quit()
// })

// In this file, you can include the code for all the remaining parts of the application,
// or you can split it into several files and import it using require.
