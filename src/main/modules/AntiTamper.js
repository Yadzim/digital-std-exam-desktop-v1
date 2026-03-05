const { BrowserWindow } = require('electron');
const BaseManager = require('./BaseManager');

class AntiTamper extends BaseManager {
    constructor() {
        super('AntiTamper');
        this.timer = null;
    }

    onEnable() {
        this.timer = setInterval(() => this.check(), 5000);
        this.check();
    }

    onDisable() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    check() {
        const wins = BrowserWindow.getAllWindows();
        wins.forEach(win => {
            if (win.webContents.isDevToolsOpened()) {
                this.log('DevTools detected!');
                this.emit('security-alert', {
                    type: 'devtools_detected',
                    detail: 'Developer Tools are open'
                });
            }
        });

        if (typeof global.v8debug !== 'undefined' || /--inspect/.test(process.execArgv.join(' '))) {
            this.emit('security-alert', {
                type: 'debugger_attached',
                detail: 'External debugger or inspector detected'
            });
        }
    }
}

module.exports = AntiTamper;
