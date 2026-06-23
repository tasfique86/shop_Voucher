const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 850,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs')
    },
    autoHideMenuBar: true,
    title: "সোনালী পেপার এন্ড স্টেশনারী - ক্যাশ মেমো জেনারেটর",
  });

  // Load the built index.html from Vite dist folder
  win.loadFile(path.join(__dirname, 'dist', 'index.html')).catch((err) => {
    console.error("Failed to load index.html. Did you run 'npm run build' first?", err);
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
