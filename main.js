const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false, // Temporarily disabled for localhost API calls
      allowRunningInsecureContent: false,
      preload: path.join(__dirname, 'preload.js')
    }
  });
  
  // Load the React build
  const indexPath = path.join(__dirname, 'src', 'build', 'index.html');
  console.log('Index path:', indexPath);

  // In development prefer the React dev server so changes appear immediately.
  // Try loading `http://localhost:3000` (or the URL in ELECTRON_START_URL)
  const devUrl = process.env.ELECTRON_START_URL || 'http://localhost:3000';
  const isDev = process.env.NODE_ENV === 'development' || process.env.ELECTRON_START_URL || process.defaultApp;

  if (isDev) {
    console.log('Running in development mode, attempting to load:', devUrl);
    win.loadURL(devUrl).catch((err) => {
      console.warn('Failed to load dev server, falling back to built file:', err?.message || err);
      win.loadFile(indexPath).catch((e) => console.error('Failed to load file fallback:', e));
    });
  } else {
    console.log('Running in production mode, loading file:', indexPath);
    win.loadFile(indexPath).catch((e) => console.error('Failed to load index file:', e));
  }
  
  // Log any load errors
  win.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.log('Failed to load:', errorCode, errorDescription);
  });
  
  // Log console messages from renderer
  win.webContents.on('console-message', (event, level, message) => {
    console.log('Renderer Console:', level, message);
  });
  
  // Prevent the window from closing on errors
  win.on('unresponsive', () => {
    console.log('Window became unresponsive');
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
