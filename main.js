const { app, BrowserWindow, Menu, Tray, ipcMain } = require('electron');
const path = require('path');

let mainWindow;
let tray = null;

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    minWidth: 600,
    minHeight: 400,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    frame: false,  // Disable the default frame to add custom controls
  });

  // Load the index.html of the app.
  mainWindow.loadFile('index.html');

  // Open DevTools for debugging
  // mainWindow.webContents.openDevTools();

  // Handle close events
  mainWindow.on('close', (event) => {
    // Prevent closing, hide window to tray instead
    event.preventDefault();
    mainWindow.hide();
  });
}

// Quit when all windows are closed, except for macOS.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Re-create a window when the app is re-activated (macOS).
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  } else {
    mainWindow.show();
  }
});

// This method will be called when Electron has finished initialization.
app.whenReady().then(() => {
  createWindow();

  // Create system tray icon and menu
  tray = new Tray(path.join(__dirname, 'tray-icon.png'));  // Replace with your own icon
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show App', click: () => mainWindow.show() },
    { label: 'Quit', click: () => app.quit() }
  ]);
  tray.setToolTip('My Electron App');
  tray.setContextMenu(contextMenu);

  // Create a menu for the application (optional)
  const menuTemplate = [
    {
      label: 'File',
      submenu: [
        { label: 'Open', click: () => {/* Open logic */} },
        { label: 'Exit', click: () => app.quit() }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'toggledevtools' }
      ]
    }
  ];
  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
});

// Listen to events for window controls
ipcMain.on('minimize-window', () => {
  mainWindow.minimize();
});

ipcMain.on('maximize-window', () => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
});

ipcMain.on('close-window', () => {
  mainWindow.close();
});
