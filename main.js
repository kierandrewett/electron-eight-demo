// Modules to control application life and create native browser window
const {app, BrowserWindow,BrowserView,nativeImage} = require('electron')
const path = require('path');

const { ipcMain } = require("electron");

// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

ipcMain.on('load-url', (event, url) => {
    BrowserView.getAllViews()[0].webContents.loadURL(url);
})

ipcMain.on('v-nav', (event, nav) => {
  if(nav == 'back') {
    BrowserView.getAllViews()[0].webContents.goBack()
  } else {
    BrowserView.getAllViews()[0].webContents.goForward()
  }
})

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1380,
    height: 820,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }
  })


  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  process.view = new BrowserView({ webPreferences: {
    preload: path.join(__dirname, 'preload.js')
  }})
  mainWindow.setBrowserView(process.view)
  process.view.setBounds({ x: 0, y: 0, width: mainWindow.getBounds().width-16, height: mainWindow.getBounds().height-80 })

  process.view.webContents.loadURL('https://electronjs.org')

  process.view.webContents.on('page-title-updated', (event, title) => {
    mainWindow.setTitle(title);
  })

  process.view.webContents.on('page-favicon-updated', (event, favicons) => {
    var request = require('request').defaults({ encoding: null });
    request.get(favicons[0], function (err, res, body) {
      const icon = nativeImage.createFromBuffer(body);
      mainWindow.setIcon(icon)
    });

    
  })

  mainWindow.on('resize', () => {
    process.view.setBounds({ x: 0, y: 0, width: mainWindow.getBounds().width-16, height: mainWindow.getBounds().height-80 })
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
