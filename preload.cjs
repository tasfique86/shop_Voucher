const { contextBridge, ipcRenderer } = require('electron');

// Preload script for Electron window security and API bridging
window.addEventListener('DOMContentLoaded', () => {
  // Preload code can go here if needed
});

contextBridge.exposeInMainWorld('electronAPI', {
  savePdf: (arrayBuffer, fileName) => ipcRenderer.invoke('save-pdf', arrayBuffer, fileName),
  isElectron: true
});
