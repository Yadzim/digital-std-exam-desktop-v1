const psList = require('ps-list');
const BaseManager = require('./BaseManager');

class ProcessMonitor extends BaseManager {
    constructor() {
        super('ProcessMonitor');
        this.timer = null;
    }

    onEnable() {
        const interval = this.config.interval || 5000;
        this.timer = setInterval(() => this.check(), interval);
    }

    onDisable() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    async check() {
        try {
            const forbidden = (this.config.forbidden || []).map(f => f.toLowerCase());
            const processes = await psList();
            const detected = processes.filter(p => {
                const name = p.name.toLowerCase();
                const cleanName = name.replace(/\.exe$/, '');
                return forbidden.some(f => {
                    const cleanF = f.toLowerCase();
                    return name.includes(cleanF) || cleanName.includes(cleanF);
                });
            });

            this.emit('status-update', detected);

            if (detected.length > 0) {
                this.log('Forbidden process detected', { names: detected.map(d => d.name) });
                this.emit('forbidden-detected', detected);
            }
        } catch (error) {
            this.log('Check error', error);
        }
    }
}

module.exports = ProcessMonitor;
