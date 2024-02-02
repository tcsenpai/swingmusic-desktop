// Modules to control application life and create native browser window
const { app, BrowserWindow, screen } = require('electron')
const path = require('node:path')
require('dotenv').config()
const { spawn } = require('child_process');

console.log(process.env)
const server_url = process.env.SERVER_URL

let factor = null

var server = null
function launchServer() {
  server = spawn('swingmusic_bin/swingmusic');
  server.stdout.on('data', (data) => {
    console.log(`[SERVER]: ${data}`);
  });
  server.stderr.on('data', (data) => {
    console.error(`[SERVER ERROR]: ${data}`);
  })
  server.on('error', (error) => {
    console.error(`[SERVER error]: ${error.message}`);
  });
  server.on('close', (code) => {
    console.log(`[SERVER EXITED] child process exited with code ${code}`);
  });
  
}

if (process.env.START_SERVER == "true") {
  console.log("Launching server")
  launchServer()
} else {
  console.log("Server not launched")
}

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    icon:  "assets/favicon.ico",
    title: "SwingMusic",
    center: true,
    width: process.env.GEOM_X / factor,
    height: process.env.GEOM_Y / factor,
    webPreferences: {
      zoomFactor: 1.0 / factor,
      nodeIntegration: true,
    }
  })

  // Testing some env variables
  mainWindow.setMenuBarVisibility(false)
  mainWindow.loadURL(server_url, {userAgent: 'swingmusic-desktop'})

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

app.on("before-quit", function() {
  server.kill() // Killing the server if started
})

app.on('window-all-closed', function () {
  app.quit()
})

// TODO Avoid launching with the python script: use instead nodejs
