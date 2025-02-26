"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("electronAPI", {
  openNewWindow: () => electron.ipcRenderer.send("open-new-window")
});
