const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("mochi", {
  onCornerChange(callback) {
    ipcRenderer.on("corner-change", (_event, corner) => callback(corner));
  },
  onMuteChange(callback) {
    ipcRenderer.on("mute-change", (_event, muted) => callback(muted));
  },
});
