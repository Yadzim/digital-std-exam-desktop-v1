const { screen } = require('electron');
const BaseManager = require('./BaseManager');

class DisplayMonitor extends BaseManager {
    constructor() {
        super('DisplayMonitor');
        this.timer = null;
        this.lastCount = 1;
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
        try {
            const displays = screen.getAllDisplays();
            const count = displays.length;

            if (count > 1 && count !== this.lastCount) {
                this.log('Multiple displays detected', { count });
                this.emit('multi-display-detected', { count });
            } else if (count === 1 && this.lastCount > 1) {
                this.emit('security-cleared');
            }
            this.lastCount = count;
        } catch (error) {
            this.log('Display check error', error);
        }
    }
}

module.exports = DisplayMonitor;
