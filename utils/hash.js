import crypto from 'crypto';

const createHash = (password) => crypto.createHash('sha1').update(password).digest('hex');

module.exports = createHash;
