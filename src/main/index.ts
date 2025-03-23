import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';

let mainWindow: BrowserWindow;

let resizing = false; 

function createWindow() {
  const width = 1920;
  const height = 1080;

  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    minWidth: 1280,
    minHeight: 720,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../../dist/renderer/index.html'));
  }

  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  // Always keep the aspect ratio
  mainWindow.on('will-resize', (event, newBounds) => {
    if (resizing) return; 

    resizing = true;  

    event.preventDefault();

    let { width, height } = newBounds;
    let expectedHeight = Math.round((width * 9) / 16);
    let expectedWidth = Math.round((height * 16) / 9);

    if (Math.abs(height - expectedHeight) > Math.abs(width - expectedWidth)) {
      mainWindow.setSize(expectedWidth, height);
    } else {
      mainWindow.setSize(width, expectedHeight);
    }

    resizing = false; 
  });

  mainWindow.on('closed', () => {
    mainWindow = null!;
  });
}

ipcMain.on('open-new-window', () => {
  const newWindow = new BrowserWindow({
    width: 600,
    height: 400,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (process.env.NODE_ENV === 'development') {
    newWindow.loadURL('http://localhost:5173/new-window');
  } else {
    newWindow.loadFile(path.join(__dirname, '../../dist/renderer/index.html'));
  }
});

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
