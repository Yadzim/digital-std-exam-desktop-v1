const { EventEmitter } = require('events');
const Logger = require('./Logger');

class BaseManager extends EventEmitter {
    constructor(name) {
        super();
        this.name = name;
        this.isEnabled = false;
        this.config = {};
    }

    /**
     * Initialize manager with dynamic config
     * @param {Object} config 
     */
    configure(config) {
        this.config = config || {};
        Logger.log(`[${this.name}] Configured`, this.config);
    }

    /**
     * Start the manager's activity
     */
    enable() {
        if (this.isEnabled) return;
        this.isEnabled = true;
        Logger.log(`[${this.name}] Enabled`);
        this.onEnable();
    }

    /**
     * Stop the manager's activity
     */
    disable() {
        if (!this.isEnabled) return;
        this.isEnabled = false;
        Logger.log(`[${this.name}] Disabled`);
        this.onDisable();
    }

    // Abstract-like methods to be overridden
    onEnable() {}
    onDisable() {}

    log(message, data = null) {
        Logger.log(`[${this.name}] ${message}`, data);
    }
}

module.exports = BaseManager;
