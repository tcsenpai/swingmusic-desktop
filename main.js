// Modules to control application life and create native browser window
const { app, BrowserWindow, screen } = require('electron')
const path = require('node:path')
require('dotenv').config({path: path.join(__dirname, '.env')})
const { spawn } = require('child_process');

let factor = null
let server = null
let server_url = null

// Debug line
console.log(process.env)

// Allow launching a local server quickly
function launchServer() {
  server = spawn('swingmusic_bin/swingmusic', ["--host", "127.0.0.1", "--port", "1970"]); // Defaults to 1970 port
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

function determineServer() {
  // Settings for either local or remote server support
  server_url = process.env.SERVER_URL
  if (process.env.START_SERVER == "true") {
    console.log("Launching server")
    // Supports lazy syntax for local server
    if (!server_url || server_url==="") {
      server_url = "http://localhost:1970"
    }
    launchServer()
  } else {
    console.log("Server not launched")
  }

  // Mandatory: we need a server_url here
  if (!server_url || server_url==="") {
    console.log("[FATAL] Server URL is not defined")
    process.exit(-1)
  }
}

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    icon:  "assets/icon.png",
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

  // Determining the server
  determineServer()
  console.log("Server is: " + server_url)

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