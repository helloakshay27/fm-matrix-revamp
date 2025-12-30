const { app, BrowserWindow } = require("electron");
const path = require("path");
const isDev = !app.isPackaged;

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.cjs"),
      webSecurity: true,
    },
    icon: path.join(__dirname, "../public/icon.png"),
  });

  // Override CSP in Electron for better compatibility with API calls
  mainWindow.webContents.session.webRequest.onHeadersReceived(
    (details, callback) => {
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          "Content-Security-Policy": [
            "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: file:; connect-src 'self' https://live-api.gophygital.work https://uat.lockated.com https://*.gophygital.work https://*.lockated.com wss://*.gophygital.work wss://*.lockated.com; img-src 'self' data: https: http: file: blob:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com;",
          ],
        },
      });
    }
  );

  // Load the app
  if (isDev) {
    // Try multiple ports as Vite may use a different one
    const devUrl = process.env.VITE_DEV_SERVER_URL || "http://localhost:5173";
    mainWindow.loadURL(devUrl).catch(() => {
      // Try alternative ports if default fails
      mainWindow.loadURL("http://localhost:5174").catch(() => {
        mainWindow.loadURL("http://localhost:5176");
      });
    });
  } else {
    // In production, files are in app.asar
    const indexPath = path.join(__dirname, "../dist/index.html");
    mainWindow.loadFile(indexPath);
  }

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    require("electron").shell.openExternal(url);
    return { action: "deny" };
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
