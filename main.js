const { app, BrowserWindow, ipcMain, globalShortcut, screen } = require('electron');
const path = require('path');
const fs = require('fs');
const net = require('net');

let mainWindow;
let tcpServer = null;
let tcpClient = null;

const MOVE_STEP = 40;
const SIZES = {
  mobile: { w: 420, h: 780 },
  tablet: { w: 900, h: 700 }
};

const settingsPath = path.join(app.getPath('userData'), 'settings.json');

const defaultSettings = {
  hotkeys: {
    sizeMobile:  'CommandOrControl+Alt+1',
    sizeTablet:  'CommandOrControl+Alt+2',
    toggleShow:  'CommandOrControl+Alt+H',
    moveUp:      'CommandOrControl+Alt+Up',
    moveDown:    'CommandOrControl+Alt+Down',
    moveLeft:    'CommandOrControl+Alt+Left',
    moveRight:   'CommandOrControl+Alt+Right',
    helpRequest: 'CommandOrControl+Alt+/',
    focusCaption: 'CommandOrControl+Alt+4',
    focusWeb:     'CommandOrControl+Alt+5',
    focusChat:    'CommandOrControl+Alt+6'
  },
  webpages: [
    'https://example.com',
    'https://developer.mozilla.org'
  ]
};

let settings = loadSettings();

function loadSettings() {
  try {
    const raw = fs.readFileSync(settingsPath, 'utf8');
    const parsed = JSON.parse(raw);
    return {
      hotkeys: { ...defaultSettings.hotkeys, ...(parsed.hotkeys || {}) },
      webpages: Array.isArray(parsed.webpages) ? parsed.webpages : defaultSettings.webpages
    };
  } catch {
    return JSON.parse(JSON.stringify(defaultSettings));
  }
}

function saveSettings() {
  try { fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2)); }
  catch (e) { console.error('save settings failed', e); }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      webviewTag: true
    }
  });

  mainWindow.loadFile('renderer/index.html');
}

// ---------- hotkey actions ----------
function setSize(preset) {
  if (!mainWindow) return;
  const { w, h } = SIZES[preset];
  mainWindow.setSize(w, h);
}

function toggleVisibility() {
  if (!mainWindow) return;
  if (mainWindow.isVisible()) mainWindow.hide();
  else { mainWindow.show(); mainWindow.focus(); }
}

function moveWindow(dx, dy) {
  if (!mainWindow) return;
  const [x, y] = mainWindow.getPosition();
  const [w, h] = mainWindow.getSize();
  const disp = screen.getDisplayMatching({ x, y, width: w, height: h }).workArea;
  const nx = dx !== 0 ? Math.max(disp.x, Math.min(x + dx, disp.x + disp.width - w)) : x;
  const ny = dy !== 0 ? Math.max(disp.y, Math.min(y + dy, disp.y + disp.height - h)) : y;
  mainWindow.setPosition(nx, ny);
}

function sendHelpRequest() {
  if (!mainWindow) return;
  mainWindow.webContents.send('hotkey-action', { action: 'helpRequest' });
}

function focusPanel(panel) {
  if (!mainWindow) return;
  mainWindow.webContents.send('hotkey-action', { action: 'focusPanel', panel });
}

const hotkeyActions = {
  sizeMobile:  () => setSize('mobile'),
  sizeTablet:  () => setSize('tablet'),
  toggleShow:  toggleVisibility,
  moveUp:      () => moveWindow(0, -MOVE_STEP),
  moveDown:    () => moveWindow(0,  MOVE_STEP),
  moveLeft:    () => moveWindow(-MOVE_STEP, 0),
  moveRight:    () => moveWindow( MOVE_STEP, 0),
  helpRequest:  sendHelpRequest,
  focusCaption: () => focusPanel('caption'),
  focusWeb:     () => focusPanel('web'),
  focusChat:    () => focusPanel('chat')
};

function registerHotkeys() {
  globalShortcut.unregisterAll();
  for (const [key, accel] of Object.entries(settings.hotkeys)) {
    if (!accel) continue;
    const fn = hotkeyActions[key];
    if (!fn) continue;
    try { globalShortcut.register(accel, fn); }
    catch (e) { console.error('hotkey register failed', key, accel, e.message); }
  }
}

app.whenReady().then(() => {
  createWindow();
  registerHotkeys();
});

app.on('will-quit', () => globalShortcut.unregisterAll());

app.on('window-all-closed', () => {
  if (tcpServer) tcpServer.close();
  if (tcpClient) tcpClient.destroy();
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// ---------- hotkey suspend/resume for settings ----------
ipcMain.handle('suspend-hotkeys', () => { globalShortcut.unregisterAll(); });
ipcMain.handle('resume-hotkeys', () => { registerHotkeys(); });

// ---------- settings IPC ----------
ipcMain.handle('get-settings', () => settings);

ipcMain.handle('set-settings', (_e, next) => {
  if (next.hotkeys) settings.hotkeys = { ...settings.hotkeys, ...next.hotkeys };
  if (Array.isArray(next.webpages)) settings.webpages = next.webpages;
  saveSettings();
  registerHotkeys();
  return settings;
});

// ---------- Interviewer: start TCP server ----------
ipcMain.handle('start-server', (event, port) => {
  return new Promise((resolve, reject) => {
    if (tcpServer) {
      resolve({ ok: true, port });
      return;
    }
    tcpServer = net.createServer((socket) => {
      socket.setEncoding('utf8');
      let buffer = '';
      socket.on('data', (chunk) => {
        buffer += chunk;
        let idx;
        while ((idx = buffer.indexOf('\n')) >= 0) {
          const line = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 1);
          if (!line) continue;
          try {
            const msg = JSON.parse(line);
            mainWindow.webContents.send('chat-message', msg);
          } catch (e) { /* ignore bad line */ }
        }
      });
      socket.on('error', () => {});
      mainWindow.webContents.send('peer-status', { connected: true });
      socket.on('close', () => {
        mainWindow.webContents.send('peer-status', { connected: false });
      });
      tcpServer._socket = socket;
    });
    tcpServer.on('error', (err) => reject(err.message));
    tcpServer.listen(port, () => resolve({ ok: true, port }));
  });
});

// ---------- Support: connect to interviewer ----------
ipcMain.handle('connect', (event, { host, port }) => {
  return new Promise((resolve, reject) => {
    if (tcpClient) {
      tcpClient.destroy();
      tcpClient = null;
    }
    tcpClient = net.createConnection({ host, port }, () => {
      mainWindow.webContents.send('peer-status', { connected: true });
      resolve({ ok: true });
    });
    tcpClient.setEncoding('utf8');
    let buffer = '';
    tcpClient.on('data', (chunk) => {
      buffer += chunk;
      let idx;
      while ((idx = buffer.indexOf('\n')) >= 0) {
        const line = buffer.slice(0, idx);
        buffer = buffer.slice(idx + 1);
        if (!line) continue;
        try {
          const msg = JSON.parse(line);
          mainWindow.webContents.send('chat-message', msg);
        } catch (e) { /* ignore */ }
      }
    });
    tcpClient.on('error', (err) => {
      mainWindow.webContents.send('peer-status', { connected: false, error: err.message });
      reject(err.message);
    });
    tcpClient.on('close', () => {
      mainWindow.webContents.send('peer-status', { connected: false });
    });
  });
});

ipcMain.handle('disconnect', () => {
  if (tcpClient) {
    tcpClient.destroy();
    tcpClient = null;
  }
  return { ok: true };
});

// ---------- Send message ----------
ipcMain.handle('send-message', (event, payload) => {
  const line = JSON.stringify(payload) + '\n';
  if (tcpClient && !tcpClient.destroyed) {
    tcpClient.write(line);
    return { ok: true };
  }
  if (tcpServer && tcpServer._socket && !tcpServer._socket.destroyed) {
    tcpServer._socket.write(line);
    return { ok: true };
  }
  return { ok: false, error: 'Not connected' };
});
