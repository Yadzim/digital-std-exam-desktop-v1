const BaseManager = require('./BaseManager');
const { exec } = require('child_process');

class NetworkMonitor extends BaseManager {
    constructor() {
        super('NetworkMonitor');
        this.timer = null;
    }

    onEnable() {
        this.timer = setInterval(() => this.check(), 10000);
        this.check();
    }

    onDisable() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    async check() {
        try {
            await this.detectProxy();
            await this.detectSuspiciousConnections();
        } catch (error) {
            this.log('Check error', error);
        }
    }

    async detectProxy() {
        const proxyVars = ['HTTP_PROXY', 'HTTPS_PROXY', 'ALL_PROXY', 'http_proxy', 'https_proxy'];
        const detectedVars = proxyVars.filter(v => process.env[v]);

        if (detectedVars.length > 0) {
            this.emit('security-alert', {
                type: 'proxy_detected',
                detail: `Environment proxy detected: ${detectedVars.join(',')}`
            });
        }

        if (process.platform === 'win32') {
            exec('reg query "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings" /v ProxyEnable', (err, stdout) => {
                if (!err && stdout && stdout.includes('0x1')) {
                    this.emit('security-alert', {
                        type: 'proxy_detected',
                        detail: 'System proxy is enabled in registry'
                    });
                }
            });
        }
    }

    async detectSuspiciousConnections() {
        exec('tasklist', (err, stdout) => {
            if (!err && stdout) {
                const suspicious = ['ngrok.exe', 'frpc.exe', 'frps.exe', 'proxifier.exe'];
                const detected = suspicious.filter(s => stdout.toLowerCase().includes(s));
                if (detected.length > 0) {
                    this.emit('security-alert', {
                        type: 'tunnel_detected',
                        detail: `Suspicious network tool: ${detected.join(',')}`
                    });
                }
            }
        });
    }
}

module.exports = NetworkMonitor;
