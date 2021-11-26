'use strict'

import { app, protocol, BrowserWindow, ipcMain, dialog } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import path from 'path';
import { zipMail } from './tools/index';


const isDevelopment = process.env.NODE_ENV !== 'production'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {

      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
      preload: path.join(__dirname, 'preload.js'),
      devTools: !app.isPackaged,
    },
    frame: false,
    show: !app.isPackaged,
  })
  // Showing the window gracefully
  if (app.isPackaged) {
    win.once('ready-to-show', () => {
      win.show()
    })
  }

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  // if (isDevelopment && !process.env.IS_TEST) {
  //   // Install Vue Devtools
  //   try {
  //     await installExtension(VUEJS_DEVTOOLS)
  //   } catch (e) {
  //     console.error('Vue Devtools failed to install:', e.toString())
  //   }
  // }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}



// 
// ipc
// 

// open folder
ipcMain.handle('get-folder-dir', async (event, data) => {
  try {
    const result = await dialog.showOpenDialog({ properties: ['openDirectory'] })
    return result
  } catch (error) {
    console.log(error)
  }
})


// compress attachments and send email
ipcMain.handle('send-email', async (event, data) => {
  try {
    await zipMail(data.emailConfig, data.attachments)
    return { status: 'success' }
  } catch (error) {
    console.log(error)
    if (error.code==='ESOCKET') {
      return {error:`请关闭TLS加密后再试  原始错误信息：${error}`}
    }
    return { error }
  }
})

ipcMain.on('win-close', (event) => {
    app.quit()
})
ipcMain.on('win-minimize', (event) => {
  let browserWindow = BrowserWindow.fromWebContents(event.sender)
  browserWindow.minimize()
})
ipcMain.on('win-maximize', (event) => {
  let browserWindow = BrowserWindow.fromWebContents(event.sender)
  if (browserWindow.isMaximized()) {
    browserWindow.unmaximize()
  }
  else {
    browserWindow.maximize()
  }
})