import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';

let mainWindow: BrowserWindow;

function createWindow() {
  const width = 1920;
  const height = 1080;
  mainWindow = new BrowserWindow({
    width,
    height,
    minWidth: 1280,
    minHeight: 720,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      nodeIntegration: false,
      
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
  mainWindow.on("will-resize", (event, newBounds) => {
    event.preventDefault();
    let { width: width2, height: height2 } = newBounds;
    let expectedHeight = Math.round(width2 * 9 / 16);
    let expectedWidth = Math.round(height2 * 16 / 9);
    if (Math.abs(height2 - expectedHeight) > Math.abs(width2 - expectedWidth)) {
      mainWindow.setSize(expectedWidth, height2);
    } else {
      mainWindow.setSize(width2, expectedHeight);
    }
  });
  mainWindow.on('closed', () => {
    mainWindow = null!;
  });
}

// Obsługa otwarcia nowego okna
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
    newWindow.loadURL('http://localhost:5173/#new-window');
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