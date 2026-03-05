const fs = require('fs');
const path = require('path');
const { app } = require('electron');

class EventQueue {
    constructor() {
        this.queuePath = path.join(app.getPath('userData'), 'event_queue.json');
        this.queue = this.loadQueue();
        this.isProcessing = false;
    }

    loadQueue() {
        if (fs.existsSync(this.queuePath)) {
            try {
                return JSON.parse(fs.readFileSync(this.queuePath, 'utf8'));
            } catch (e) {
                console.error('[Queue] Failed to load queue:', e.message);
                return [];
            }
        }
        return [];
    }

    saveQueue() {
        try {
            fs.writeFileSync(this.queuePath, JSON.stringify(this.queue), 'utf8');
        } catch (e) {
            console.error('[Queue] Failed to save queue:', e.message);
        }
    }

    push(event) {
        this.queue.push(event);
        this.saveQueue();
        console.log(`[Queue] Event added. Total: ${this.queue.length}`);
    }

    get() {
        return this.queue;
    }

    clear() {
        this.queue = [];
        this.saveQueue();
    }

    removeFirst() {
        this.queue.shift();
        this.saveQueue();
    }

    get length() {
        return this.queue.length;
    }

    isEmpty() {
        return this.queue.length === 0;
    }

    getBatch(size) {
        return this.queue.slice(0, size);
    }

    remove(event) {
        this.queue = this.queue.filter(e => e.timestamp !== event.timestamp || e.event_type !== event.event_type);
        this.saveQueue();
    }
}

module.exports = new EventQueue();
