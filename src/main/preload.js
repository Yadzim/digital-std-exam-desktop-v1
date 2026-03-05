const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  startProctoring: (launchToken) => ipcRenderer.send('start-proctoring', launchToken),
  stopProctoring: () => ipcRenderer.send('stop-test-mode'),
  startTestMode: () => ipcRenderer.send('start-test-mode'),
  stopTestMode: () => ipcRenderer.send('stop-test-mode'),
  sendProctoringEvent: (type, data) => ipcRenderer.send('proctoring-event', { type, data }),
  onSecurityEvent: (callback) => {
    const handler = (event, payload) => callback(payload);
    ipcRenderer.on('security-event', handler);
    return () => ipcRenderer.removeListener('security-event', handler);
  },
  onHandshakeSuccess: (callback) => {
    const handler = (event, payload) => callback(payload);
    ipcRenderer.on('handshake-success', handler);
    return () => ipcRenderer.removeListener('handshake-success', handler);
  },
  onHandshakeError: (callback) => {
    const handler = (event, error) => callback(error);
    ipcRenderer.on('handshake-error', handler);
    return () => ipcRenderer.removeListener('handshake-error', handler);
  },
  onSessionTerminated: (callback) => {
    const handler = () => callback();
    ipcRenderer.on('session-terminated', handler);
    return () => ipcRenderer.removeListener('session-terminated', handler);
  },
  onLockdownActive: (callback) => {
    const handler = () => callback();
    ipcRenderer.on('lockdown-active', handler);
    return () => ipcRenderer.removeListener('lockdown-active', handler);
  },
  onLockdownDisabled: (callback) => {
    const handler = () => callback();
    ipcRenderer.on('lockdown-disabled', handler);
    return () => ipcRenderer.removeListener('lockdown-disabled', handler);
  },
  rendererReady: () => ipcRenderer.send('renderer-ready'),
  isElectron: true,
});
