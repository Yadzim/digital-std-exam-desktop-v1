const si = require('systeminformation');
const BaseManager = require('./BaseManager');

class VMDetection extends BaseManager {
    constructor() {
        super('VMDetection');
    }

    onEnable() {
        this.check();
    }

    async check() {
        try {
            const system = await si.system();
            const manufacturer = system.manufacturer.toLowerCase();
            const model = system.model.toLowerCase();

            const vmKeywords = ['virtualbox', 'vmware', 'qemu', 'hyper-v', 'parallels', 'virtual'];

            const isVM = vmKeywords.some(kw =>
                manufacturer.includes(kw) || model.includes(kw)
            );

            if (isVM) {
                this.log('VM Detected', { manufacturer, model });
                this.emit('vm-detected', { manufacturer, model });
                return true;
            }
            return false;
        } catch (error) {
            this.log('VM Check error', error);
            return false;
        }
    }
}

module.exports = VMDetection;
