const { BrowserWindow, globalShortcut } = require('electron');
const BaseManager = require('./BaseManager');

class Lockdown extends BaseManager {
    constructor() {
        super('Lockdown');
        this.shortcuts = ['Alt+Tab', 'Alt+F4', 'Alt+Space', 'Ctrl+Shift+Esc'];
    }

    onEnable() {
        const win = BrowserWindow.getAllWindows()[0];
        if (win) {
            win.setAlwaysOnTop(true, 'screen-saver');
            win.setFullScreen(false);
            win.setKiosk(false);
            win.setSize(400, 550);
            win.center();
            win.webContents.send('lockdown-active');
        }

        this.shortcuts.forEach(shortcut => {
            try {
                globalShortcut.register(shortcut, () => {
                    this.log('Blocked key', { shortcut });
                });
            } catch (e) {
                this.log('Failed to block key', { shortcut, error: e.message });
            }
        });
    }

    onDisable() {
        const win = BrowserWindow.getAllWindows()[0];
        if (win) {
            win.setKiosk(false);
            win.setAlwaysOnTop(false);
            win.setSize(1200, 800);
            win.center();
            win.webContents.send('lockdown-disabled');
        }

        globalShortcut.unregisterAll();
    }
}

module.exports = Lockdown;
