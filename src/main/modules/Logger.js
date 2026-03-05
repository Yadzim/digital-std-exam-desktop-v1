const fs = require('fs');
const path = require('path');

class Logger {
    constructor() {
        this.logDir = path.join(process.env.APPDATA || process.env.HOME || '', 'DigitalStdExam', 'logs');
        this.logFile = path.join(this.logDir, 'agent.log');

        if (this.logDir && !fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir, { recursive: true });
        }
    }

    log(message, data = null) {
        const timestamp = new Date().toISOString();
        let logEntry = `[${timestamp}] ${message}`;
        if (data) {
            logEntry += ` | Data: ${JSON.stringify(data)}`;
        }
        logEntry += '\n';

        console.log(logEntry.trim());

        try {
            if (this.logDir && fs.existsSync(this.logDir)) {
                fs.appendFileSync(this.logFile, logEntry);
            }
        } catch (err) {
            console.error('Failed to write to log file:', err.message);
        }
    }

    error(message, error = null) {
        const timestamp = new Date().toISOString();
        let logEntry = `[${timestamp}] ERROR: ${message}`;
        if (error) {
            logEntry += ` | Error: ${error.message || error}`;
            if (error.stack) {
                logEntry += `\nStack: ${error.stack}`;
            }
        }
        logEntry += '\n';

        console.error(logEntry.trim());

        try {
            if (this.logDir && fs.existsSync(this.logDir)) {
                fs.appendFileSync(this.logFile, logEntry);
            }
        } catch (err) {
            console.error('Failed to write error to log file:', err.message);
        }
    }
}

module.exports = new Logger();
