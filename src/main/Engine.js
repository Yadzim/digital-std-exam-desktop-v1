const { EventEmitter } = require('events');
const axios = require('axios');
const { machineIdSync } = require('node-machine-id');

const SecurityManager = require('./modules/SecurityManager');
const eventQueue = require('./modules/EventQueue');
const Lockdown = require('./modules/Lockdown');
const ProcessMonitor = require('./modules/ProcessMonitor');
const VMDetection = require('./modules/VMDetection');
const ScreenCapture = require('./modules/ScreenCapture');
const NetworkMonitor = require('./modules/NetworkMonitor');
const AntiTamper = require('./modules/AntiTamper');
const WindowMonitor = require('./modules/WindowMonitor');
const DisplayMonitor = require('./modules/DisplayMonitor');
const Logger = require('./modules/Logger');

class Engine extends EventEmitter {
    constructor(baseUrl, security) {
        super();
        this.baseUrl = baseUrl;
        this.security = security;
        this.sessionToken = null;
        this.securityProfile = null;
        this.heartbeatTimer = null;
        this.isInitialized = false;
        this.isTestMode = false;

        this.managers = {
            lockdown: new Lockdown(),
            process: new ProcessMonitor(),
            vm: new VMDetection(),
            screen: new ScreenCapture(),
            network: new NetworkMonitor(),
            tamper: new AntiTamper(),
            window: new WindowMonitor(),
            display: new DisplayMonitor()
        };

        this.setupManagerEvents();
    }

    async init(launchToken) {
        if (this.isInitialized) return;

        console.log('🚀 Engine initializing...');
        this.emit('handshake-started');

        try {
            const success = await this.performHandshake(launchToken);
            if (success) {
                this.isInitialized = true;
                Logger.log('Engine initialized with profile', this.securityProfile);
                this.applySecurityProfile();
                this.startHeartbeat();
                this.startQueueProcessor();
                this.emit('handshake-success', this.securityProfile);
            }
        } catch (error) {
            Logger.error('Engine Init Error', error);
            this.emit('handshake-error', error.message);
        }
    }

    startTestMode(mockProfile = null) {
        if (this.isInitialized) return;

        console.log('🧪 Starting Engine in TEST MODE...');
        this.isTestMode = true;
        this.isInitialized = true;
        this.sessionToken = 'test-session-' + Date.now();

        this.securityProfile = mockProfile || {
            lockdown_mode_enabled: true,
            process_monitoring_enabled: true,
            forbidden_processes: ['Taskmgr.exe', 'ProcessHacker.exe', 'obs64.exe'],
            screenshot_enabled: true,
            screenshot_interval_seconds: 30,
            vm_detection_enabled: true,
            multi_monitor_detection_enabled: true,
            face_detection_enabled: true,
            heartbeat_interval_seconds: 5
        };

        this.applySecurityProfile();
        this.emit('handshake-success', this.securityProfile);
    }

    async performHandshake(launchToken) {
        const payload = JSON.stringify({
            launch_token: launchToken,
            machine_id: machineIdSync(),
            timestamp: new Date().toISOString()
        });

        const encryptedData = this.security.encrypt(payload);
        const response = await axios.post(`${this.baseUrl}/agent/handshake`, {
            payload: encryptedData
        });

        const decryptedResponse = this.security.decrypt(response.data.payload);
        const data = JSON.parse(decryptedResponse);

        if (data.status === 'success' || data.success) {
            this.sessionToken = data.agent_session_token;
            this.securityProfile = data.security_profile;
            return true;
        }
        throw new Error(data.message || 'Handshake failed');
    }

    applySecurityProfile() {
        const p = this.securityProfile;
        if (!p) return;

        console.log('🛠️ Applying security profile...');

        if (p.lockdown_mode_enabled) {
            this.managers.lockdown.enable();
        } else {
            this.managers.lockdown.disable();
        }

        if (p.process_monitoring_enabled) {
            this.managers.process.enable();
            this.managers.process.configure({
                forbidden: p.forbidden_processes || [],
                interval: 5000
            });
        } else {
            this.managers.process.disable();
        }

        if (p.lockdown_mode_enabled) {
            this.managers.window.enable();
        } else {
            this.managers.window.disable();
        }

        if (p.vm_detection_enabled) {
            this.managers.vm.enable();
        } else {
            this.managers.vm.disable();
        }

        if (p.screenshot_enabled) {
            this.managers.screen.enable();
            this.managers.screen.configure({
                interval: p.screenshot_interval_seconds || 60
            });
        } else {
            this.managers.screen.disable();
        }

        this.managers.network.enable();
        this.managers.tamper.enable();

        if (p.multi_monitor_detection_enabled) {
            this.managers.display.enable();
        } else {
            this.managers.display.disable();
        }

        this.setupManagerEvents();
    }

    setupManagerEvents() {
        const wrap = (promise) => promise.catch(err => console.error('[Engine] Event Error:', err));

        Object.values(this.managers).forEach(m => m.removeAllListeners());

        this.managers.process.on('forbidden-detected', (detected) => {
            wrap(this.sendEvent('forbidden_process', { processes: detected }));
        });

        this.managers.vm.on('vm-detected', (details) => {
            wrap(this.sendEvent('vm_detected', details));
        });

        this.managers.screen.on('captured', (data) => {
            wrap(this.sendEvent('screenshot', data));
        });

        this.managers.network.on('security-alert', (alert) => {
            wrap(this.sendEvent(alert.type, alert));
        });

        this.managers.tamper.on('security-alert', (alert) => {
            wrap(this.sendEvent(alert.type, alert));
        });

        this.managers.window.on('tab-switch', (data) => {
            wrap(this.sendEvent('tab_switch', data));
        });

        this.managers.window.on('security-cleared', () => {
            wrap(this.sendEvent('security_cleared', { source: 'window' }));
            if (global.mainWindow) global.mainWindow.webContents.send('security-event', { type: 'security_cleared' });
        });

        this.managers.display.on('multi-display-detected', (data) => {
            wrap(this.sendEvent('multi_display', data));
        });

        this.managers.display.on('security-cleared', () => {
            wrap(this.sendEvent('security_cleared', { source: 'display' }));
            if (global.mainWindow) global.mainWindow.webContents.send('security-event', { type: 'security_cleared' });
        });
    }

    async sendEvent(type, data) {
        if (!this.isInitialized || !this.sessionToken) {
            Logger.log(`Skipping event ${type} - not initialized`);
            return;
        }
        Logger.log(`Security Event: ${type}`, data);
        this.emit('security-event', { type, data });

        if (this.isTestMode) {
            console.log(`[Engine][TestMode] Event recorded locally: ${type}`);
            return;
        }

        const event = {
            agent_session_token: this.sessionToken,
            event_type: type,
            data: data,
            timestamp: new Date().toISOString()
        };

        try {
            const payload = this.security.encrypt(JSON.stringify(event));
            await axios.post(`${this.baseUrl}/agent/event`, { payload });
        } catch (err) {
            console.warn(`[Engine] Failed to send event ${type}. Queuing locally.`);
            eventQueue.push(event);
        }
    }

    startHeartbeat() {
        const interval = (this.securityProfile?.heartbeat_interval_seconds || 10) * 1000;
        this.heartbeatTimer = setInterval(async () => {
            try {
                const payload = this.security.encrypt(JSON.stringify({
                    agent_session_token: this.sessionToken,
                    timestamp: new Date().toISOString()
                }));
                const response = await axios.post(`${this.baseUrl}/agent/heartbeat`, { payload });

                const decrypted = this.security.decrypt(response.data.payload);
                const data = JSON.parse(decrypted);

                if (data.command === 'terminate') {
                    console.log('🛑 Termination command received from server.');
                    this.stop();
                }
            } catch (err) {
                console.warn('[Heartbeat] Failed:', err.message);
            }
        }, interval);
    }

    stop() {
        console.log('🔌 Stopping Engine...');

        if (this.heartbeatTimer) {
            clearInterval(this.heartbeatTimer);
            this.heartbeatTimer = null;
        }

        Object.values(this.managers).forEach(manager => {
            if (typeof manager.disable === 'function') {
                manager.disable();
            }
        });

        this.isInitialized = false;
        this.isTestMode = false;
        this.sessionToken = null;
        this.securityProfile = null;

        this.emit('terminated');
    }

    startQueueProcessor() {
        setInterval(async () => {
            try {
                if (eventQueue.isEmpty() || eventQueue.isProcessing) return;

                eventQueue.isProcessing = true;
                const batch = eventQueue.getBatch(5);

                for (const event of batch) {
                    try {
                        const payload = this.security.encrypt(JSON.stringify(event));
                        await axios.post(`${this.baseUrl}/agent/event`, { payload });
                        eventQueue.remove(event);
                    } catch (err) {
                        console.error('[Queue] Batch failed:', err.message);
                        break;
                    }
                }
            } catch (err) {
                console.error('[Queue] Processor error:', err.message);
            } finally {
                eventQueue.isProcessing = false;
            }
        }, 30000);
    }
}

module.exports = Engine;
