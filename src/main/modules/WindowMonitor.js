const { exec } = require('child_process');
const path = require('path');
const BaseManager = require('./BaseManager');

class WindowMonitor extends BaseManager {
    constructor() {
        super('WindowMonitor');
        this.timer = null;
        this.lastAppName = null;
        this.lastTitle = null;
        this.scriptPath = path.join(__dirname, 'getActiveWindow.ps1');
        this.wasSafe = true;
        this.isChecking = false;
    }

    onEnable() {
        this.timer = setInterval(() => this.check(), 1000);
    }

    onDisable() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    check() {
        if (this.isChecking) return;
        this.isChecking = true;

        exec(`powershell -ExecutionPolicy Bypass -File "${this.scriptPath}"`, (error, stdout, stderr) => {
            this.isChecking = false;
            if (error) return;
            try {
                const result = JSON.parse(stdout);
                if (result) {
                    const currentApp = (result.processName || '').toLowerCase();
                    const currentTitle = (result.title || '').toLowerCase();

                    const isAgentApp = currentApp.includes('electron') || currentApp.includes('guard') || currentApp.includes('digital');
                    const isExamWindow = currentTitle.includes('exam_core') ||
                        currentTitle.includes('examcore') ||
                        currentTitle.includes('imtihon') ||
                        currentTitle.includes('digital') ||
                        currentTitle.includes('tsul');

                    const isCurrentlySafe = isAgentApp || isExamWindow;

                    if (this.wasSafe && !isCurrentlySafe) {
                        this.log('Switched away', { app: result.processName, title: result.title });
                        this.emit('tab-switch', {
                            app: result.processName,
                            title: result.title
                        });
                        this.wasSafe = false;
                        this.lastAppName = currentApp;
                        this.lastTitle = currentTitle;
                    } else if (!this.wasSafe && isCurrentlySafe) {
                        this.log('Switched back to safe window');
                        this.emit('security-cleared');
                        this.wasSafe = true;
                        this.lastAppName = null;
                        this.lastTitle = null;
                    } else if (!isCurrentlySafe && (currentApp !== this.lastAppName || currentTitle !== this.lastTitle)) {
                        this.lastAppName = currentApp;
                        this.lastTitle = currentTitle;
                    }
                }
            } catch (pErr) {}
        });
    }
}

module.exports = WindowMonitor;
