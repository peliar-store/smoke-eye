const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  // Window controls
  winCtrl: (cmd) => ipcRenderer.send('win-ctrl', cmd),
  winIsMaximized: () => ipcRenderer.invoke('win-is-maximized'),
  winOpacity: (v) => ipcRenderer.send('win-opacity', v),
  winContentProtection: (on) => ipcRenderer.send('win-content-protection', on),
  winSetResizable: (on) => ipcRenderer.send('win-set-resizable', on),
  winGetSize: () => ipcRenderer.invoke('win-get-size'),
  winSetSize: (w, h) => ipcRenderer.send('win-set-size', { w, h }),
  onWinState: (cb) => ipcRenderer.on('win-state', (_e, s) => cb(s)),
  onProtectionState: (cb) => ipcRenderer.on('protection-state', (_e, v) => cb(v)),

  // Connection
  startServer: (port) => ipcRenderer.invoke('start-server', port),
  connect: (host, port) => ipcRenderer.invoke('connect', { host, port }),
  disconnect: () => ipcRenderer.invoke('disconnect'),
  sendMessage: (payload) => ipcRenderer.invoke('send-message', payload),

  // Settings
  getSettings: () => ipcRenderer.invoke('get-settings'),
  setSettings: (s) => ipcRenderer.invoke('set-settings', s),
  suspendHotkeys: () => ipcRenderer.invoke('suspend-hotkeys'),
  resumeHotkeys: () => ipcRenderer.invoke('resume-hotkeys'),

  // Files
  openFileDialog: () => ipcRenderer.invoke('open-file-dialog'),
  readFile: (p) => ipcRenderer.invoke('read-file', p),
  saveFile: (f) => ipcRenderer.invoke('save-file', f),

  // Capture
  captureArea: () => ipcRenderer.invoke('capture-area'),
  captureDone: (rect) => ipcRenderer.send('capture-done', rect),

  // Sticky
  showSticky: (note) => ipcRenderer.invoke('show-sticky', note),
  hideSticky: () => ipcRenderer.invoke('hide-sticky'),
  closeSticky: () => ipcRenderer.send('close-sticky'),
  stickyNav: (dir) => ipcRenderer.send('sticky-nav', dir),

  // Events
  onChatMessage: (cb) => ipcRenderer.on('chat-message', (_e, m) => cb(m)),
  onPeerStatus: (cb) => ipcRenderer.on('peer-status', (_e, s) => cb(s)),
  onHotkeyAction: (cb) => ipcRenderer.on('hotkey-action', (_e, a) => cb(a)),
  onStickyData: (cb) => ipcRenderer.on('sticky-data', (_e, d) => cb(d)),
  onCaptureInit: (cb) => ipcRenderer.on('capture-init', (_e, d) => cb(d))
});
