const { app, BrowserWindow, ipcMain, globalShortcut } = require('electron');
const path = require('path');
const fs = require('fs');

const SecurityManager = require('./modules/SecurityManager');
const Engine = require('./Engine');
const Logger = require('./modules/Logger');

const security = new SecurityManager('exam-core-secret-2026');
const BASE_URL = process.env.EXAMCORE_API_URL || 'http://localhost:8000/api/v1';
const engine = new Engine(BASE_URL, security);

if (require('electron-squirrel-startup')) {
    app.quit();
}

let mainWindow;
let isRendererReady = false;
let pendingLaunchToken = null;

const isDev = !app.isPackaged && (process.env.ELECTRON_DEV === '1' || !fs.existsSync(path.join(__dirname, '../../dist/index.html')));

async function checkIntegrity() {
    if (isDev) {
        Logger.log('Dev mode: skipping integrity check');
        return;
    }
    Logger.log('Running Agent Integrity Check...');
    const appPath = process.execPath;
    const hash = await security.verifyAgentIntegrity(appPath);
    if (!hash) {
        Logger.error('Integrity Check FAILED. Tampering detected.');
        app.quit();
    } else {
        Logger.log('Integrity Check Passed', { hash });
    }
}

app.commandLine.appendSwitch('enable-features', 'WebRtcHideLocalIpsWithMdns');
app.commandLine.appendSwitch('enable-media-stream-high-frequency');
app.commandLine.appendSwitch('use-fake-ui-for-media-stream');
app.commandLine.appendSwitch('allow-loopback-in-peer-connection');
app.commandLine.appendSwitch('enable-media-foundation-video-capture');
app.commandLine.appendSwitch('disable-features', 'PreloadMediaEngagementData,AutoplayIgnoreWebAudio');

if (!process.defaultApp) {
    app.setAsDefaultProtocolClient('examcoreguard');
}

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 800,
        minHeight: 600,
        frame: true,
        resizable: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    if (isDev) {
        mainWindow.loadURL('http://localhost:5173');
        mainWindow.webContents.openDevTools({ mode: 'detach' });
    } else {
        mainWindow.loadFile(path.join(__dirname, '../../dist/index.html'));
    }

    global.mainWindow = mainWindow;

    mainWindow.webContents.session.setPermissionRequestHandler((webContents, permission, callback) => {
        const allowed = ['media', 'mediaKeySystem', 'geolocation', 'notifications'];
        callback(allowed.includes(permission));
    });

    globalShortcut.register('CommandOrControl+Shift+I', () => {
        if (mainWindow) mainWindow.webContents.openDevTools({ mode: 'detach' });
    });

    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.send('electron-ready');
    });
};

app.on('second-instance', (event, commandLine) => {
    if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.focus();
    }
    const url = commandLine.find(arg => arg.startsWith('examcoreguard://'));
    if (url) handleDeepLink(url);
});

async function handleDeepLink(url) {
    if (!url || !url.startsWith('examcoreguard://')) return;
    try {
        const params = new URL(url).searchParams;
        const launchToken = params.get('token');
        if (launchToken) {
            if (isRendererReady) {
                engine.init(launchToken);
            } else {
                pendingLaunchToken = launchToken;
            }
        }
    } catch (e) {
        Logger.error('Failed to parse deep link', e);
    }
}

ipcMain.on('renderer-ready', () => {
    isRendererReady = true;
    if (pendingLaunchToken) {
        engine.init(pendingLaunchToken);
        pendingLaunchToken = null;
    }
});

engine.on('handshake-started', () => {
    if (mainWindow) mainWindow.webContents.send('handshake-started');
});
engine.on('handshake-success', (profile) => {
    if (mainWindow) mainWindow.webContents.send('handshake-success', { security_profile: profile });
});
engine.on('handshake-error', (error) => {
    if (mainWindow) mainWindow.webContents.send('handshake-error', error);
});
engine.on('terminated', () => {
    if (mainWindow) mainWindow.webContents.send('session-terminated');
});
engine.on('security-event', (event) => {
    if (mainWindow) mainWindow.webContents.send('security-event', event);
});

ipcMain.on('proctoring-event', (event, data) => {
    if (data.type === 'face_ok' || data.type === 'security_cleared') {
        if (mainWindow) mainWindow.webContents.send('security-event', data);
    } else {
        engine.sendEvent(data.type, data);
    }
});

ipcMain.on('start-proctoring', (event, launchToken) => {
    if (launchToken) {
        engine.init(launchToken);
    } else {
        engine.startTestMode();
    }
});

ipcMain.on('start-test-mode', () => {
    engine.startTestMode();
});

ipcMain.on('stop-test-mode', () => {
    engine.stop();
});

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
    app.quit();
} else {
    app.whenReady().then(async () => {
        await checkIntegrity();
        createWindow();
        if (process.platform === 'win32' && process.argv.length > 1) {
            const url = process.argv.find(arg => arg.startsWith('examcoreguard://'));
            if (url) handleDeepLink(url);
        }
    });
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
