const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  startServer: (port) => ipcRenderer.invoke('start-server', port),
  connect: (host, port) => ipcRenderer.invoke('connect', { host, port }),
  disconnect: () => ipcRenderer.invoke('disconnect'),
  sendMessage: (payload) => ipcRenderer.invoke('send-message', payload),
  getSettings: () => ipcRenderer.invoke('get-settings'),
  setSettings: (s) => ipcRenderer.invoke('set-settings', s),
  suspendHotkeys: () => ipcRenderer.invoke('suspend-hotkeys'),
  resumeHotkeys: () => ipcRenderer.invoke('resume-hotkeys'),
  onChatMessage: (cb) => ipcRenderer.on('chat-message', (_e, msg) => cb(msg)),
  onPeerStatus: (cb) => ipcRenderer.on('peer-status', (_e, s) => cb(s)),
  onHotkeyAction: (cb) => ipcRenderer.on('hotkey-action', (_e, a) => cb(a)),
  startCaption: () => ipcRenderer.invoke('start-caption'),
  stopCaption: () => ipcRenderer.invoke('stop-caption'),
  onCaptionSegment: (cb) => ipcRenderer.on('caption-segment', (_e, seg) => cb(seg))
});
