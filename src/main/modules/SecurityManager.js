const crypto = require('crypto');
const fs = require('fs');

class SecurityManager {
    constructor(secretKey) {
        this.algorithm = 'aes-256-gcm';
        this.key = crypto.createHash('sha256').update(secretKey + '-salt').digest();
    }

    encrypt(text) {
        const iv = crypto.randomBytes(12);
        const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);

        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        const authTag = cipher.getAuthTag().toString('hex');

        return `${iv.toString('hex')}:${authTag}:${encrypted}`;
    }

    decrypt(packet) {
        try {
            const [ivHex, authTagHex, encryptedData] = packet.split(':');

            const iv = Buffer.from(ivHex, 'hex');
            const authTag = Buffer.from(authTagHex, 'hex');
            const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);

            decipher.setAuthTag(authTag);

            let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
            decrypted += decipher.final('utf8');

            return decrypted;
        } catch (err) {
            console.error('[Security] Decryption failed:', err.message);
            return null;
        }
    }

    async calculateFileHash(filePath) {
        return new Promise((resolve, reject) => {
            const hash = crypto.createHash('sha256');
            const stream = fs.createReadStream(filePath);

            stream.on('data', (data) => hash.update(data));
            stream.on('end', () => resolve(hash.digest('hex')));
            stream.on('error', (err) => reject(err));
        });
    }

    async verifyAgentIntegrity(appPath) {
        try {
            const currentHash = await this.calculateFileHash(appPath);
            console.log(`[Integrity] Current Agent Hash: ${currentHash}`);
            return currentHash;
        } catch (err) {
            console.error('[Integrity] Verification failed:', err.message);
            return null;
        }
    }
}

module.exports = SecurityManager;
