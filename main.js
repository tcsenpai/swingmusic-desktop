// Modules to control application life and create native browser window
const { app, BrowserWindow, screen } = require('electron')
const path = require('node:path')

let factor = null

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1280 / factor,
    height: 1024 / factor,
    webPreferences: {
      zoomFactor: 1.0 / factor
    }
  })

  mainWindow.loadURL("http://localhost:1970")

}

// Create the browser window
app.whenReady().then(() => {

  factor = screen.getPrimaryDisplay().scaleFactor;
  console.log("factor: ", factor)
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  app.quit()
})

// TODO Avoid launching with the python script: use instead nodejs
