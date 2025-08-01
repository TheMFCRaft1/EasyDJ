const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  const win = new BrowserWindow({
    fullscreen: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  win.loadFile('./renderer/index.html');
}

ipcMain.handle('get-music-files', async () => {
  const musicDir = path.join(__dirname, 'Musik');
  if (!fs.existsSync(musicDir)) return [];

  const files = fs.readdirSync(musicDir).filter(f =>
    f.match(/\.(mp3|wav|ogg)$/i)
  );

  return files;
});

app.whenReady().then(createWindow);
