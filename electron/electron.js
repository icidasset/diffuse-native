const electron = require("electron")
const express = require("express")
const path = require("path")

const { app, dialog, globalShortcut, shell, systemPreferences } = electron
const { BrowserWindow, Menu } = electron
const isDev = (process.env.ENV === "DEV")


// ⛩


app.on("activate", createWindow)
app.on("window-all-closed", app.quit)
app.on("ready", _ => {
  // Create main window
  createWindow()

  // Menu
  Menu.setApplicationMenu(menu)
})



// HTTP SERVER


const http = express()

http.use(express.static(isDev ? "build" : __dirname))
http.listen(44999, () => console.log("HTTP Server running on port 44999"))



// MAIN WINDOW


let win


function createWindow() {
  if (win) return

  // Create new window
  win = new BrowserWindow({
    backgroundColor: "rgb(2, 7, 14)",
    center: true,
    titleBarStyle: "hiddenInset",
    webPreferences: {}
  })

  // Remove window reference when window is closed
  win.on("closed", () => win = null)

  // Workarea
  const workArea = electron.screen.getPrimaryDisplay().workArea

  win.setBounds({
    x: 10,
    y: workArea.y + 10,
    height: workArea.height - 20,
    width: workArea.width - 20,
  })

  // Load application
  win.loadURL("http://127.0.0.1:44999", {
    userAgent: "Chrome"
  })

  // Development stuff
  if (isDev) {
    win.webContents.openDevTools()
    win.webContents.session.clearCache(_ => null)
  }
}



// MENU


const menuTemplate = [
  {
    label: "Edit",
    submenu: [
      { role: "undo" },
      { role: "redo" },
      { type: "separator" },
      { role: "cut" },
      { role: "copy" },
      { role: "paste" },
      { role: "delete" },
      { role: "selectall" }
    ]
  },
  {
    label: "View",
    submenu: [
      { role: "reload" },
      { role: "forcereload" },
      { role: "toggledevtools" },
      { type: "separator" },
      { role: "togglefullscreen" }
    ]
  },
  {
    role: "window",
    submenu: [
      { role: "minimize" },
      { role: "close" },
      { role: "front" }
    ]
  },
  {
    role: "help",
    submenu: [
      {
        label: "Report an issue",
        click() { shell.openExternal("https://github.com/icidasset/diffuse/issues") }
      }
    ]
  }
]


if (process.platform === "darwin") {
   menuTemplate.unshift({
     label: app.getName(),
     submenu: [
       { role: "about" },
       { role: "hide" },
       { role: "unhide" },
       { role: "quit" }
     ]
   })
}


const menu = Menu.buildFromTemplate(menuTemplate)
