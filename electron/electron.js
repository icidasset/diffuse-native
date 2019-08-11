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

  // Accessibility
  setupAccessibilityStuff()

  // Keyboard shortcuts
  bindKeyboardShortcuts()
})



// ACCESSIBILITY
// ---
// Thanks to https://github.com/LenKagamine/lyra/blob/2f16a913efed6e4aacd569088ff1a58358d39eb3/src/main/accessibility.js


function setupAccessibilityStuff() {
  // The app needs to be a trusted accessibility client
  // so we can use the media keys.
  if (process.platform !== "darwin") return

  // Already trusted?
  const isTrusted = systemPreferences.isTrustedAccessibilityClient(false)
  if (isTrusted) return

  // Show dialog
  dialog.showMessageBox({
    type: "warning",
    message: "Turn on accessibility",
    detail: "To control playback using media keys on your keyboard, select the Diffuse checkbox in Security & Privacy > Accessibility.\n\nYou will have to restart Diffuse after enabling access.",
    defaultId: 1,
    cancelId: 0,
    buttons: ["Not Now", "Turn On Accessibility"]

  }).then(result => {
    if (result.response === 1) {
      systemPreferences.isTrustedAccessibilityClient(true)
    }

  })
}



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
  win.loadURL("http://127.0.0.1:44999")

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



// SHORTCUTS


function bindKeyboardShortcuts() {
  globalShortcut.register("MediaNextTrack", _ => {
    if (!win) return

    win.webContents.executeJavaScript(`
      document.dispatchEvent(new Event("MediaNext"))
    `)
  })

  globalShortcut.register("MediaPlayPause", _ => {
    if (!win) return

    win.webContents.executeJavaScript(`
      document.dispatchEvent(new Event("MediaPlayPause"))
    `)
  })

  globalShortcut.register("MediaPreviousTrack", _ => {
    if (!win) return

    win.webContents.executeJavaScript(`
      document.dispatchEvent(new Event("MediaPrev"))
    `)
  })

  globalShortcut.register("MediaStop", _ => {
    if (!win) return

    win.webContents.executeJavaScript(`
      document.dispatchEvent(new Event("MediaStop"))
    `)
  })
}


app.on("will-quit", () => {
  globalShortcut.unregisterAll()
})
