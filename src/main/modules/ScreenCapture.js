const screenshot = require('screenshot-desktop');
const path = require('path');
const fs = require('fs');
const BaseManager = require('./BaseManager');

class ScreenCapture extends BaseManager {
    constructor() {
        super('ScreenCapture');
        this.timer = null;
        this.savePath = path.join(process.env.APPDATA || process.env.HOME || '', 'DigitalStdExam', 'evidence');

        if (this.savePath && !fs.existsSync(this.savePath)) {
            fs.mkdirSync(this.savePath, { recursive: true });
        }
    }

    onEnable() {
        const interval = (this.config.interval || 60) * 1000;
        this.timer = setInterval(() => this.capture(), interval);
        this.log('Capture started', { interval: interval / 1000 });
    }

    onDisable() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    async capture() {
        try {
            const filename = `screenshot_${Date.now()}.jpg`;
            const fullPath = path.join(this.savePath, filename);

            await screenshot({ filename: fullPath });

            const base64 = fs.readFileSync(fullPath, { encoding: 'base64' });
            this.emit('captured', {
                path: fullPath,
                filename,
                image: `data:image/jpeg;base64,${base64}`
            });
        } catch (error) {
            this.log('Capture error', error);
        }
    }
}

module.exports = ScreenCapture;
