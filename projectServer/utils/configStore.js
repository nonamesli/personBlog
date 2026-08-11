const crypto = require('crypto');
const connection = require('../mysql/connect');
const { getSystemConfig, getSystemConfigByKey, updateSystemConfig } = require('../mysql/sql');

const ENCRYPT_KEY = process.env.CONFIG_ENCRYPT_KEY || '';

function getKey() {
  const key = ENCRYPT_KEY.padEnd(32, '0').slice(0, 32);
  return Buffer.from(key);
}

function encrypt(text) {
  if (!text) return text;
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', getKey(), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

function decrypt(text) {
  if (!text || !text.includes(':')) return text;
  try {
    const [ivHex, encryptedHex] = text.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', getKey(), iv);
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (e) {
    console.error('配置解密失败:', e.message);
    return '';
  }
}

let configCache = {};

function loadConfig() {
  return new Promise((resolve, reject) => {
    connection.query(getSystemConfig, (err, results) => {
      if (err) {
        reject(err);
        return;
      }
      const map = {};
      results.forEach(row => {
        let value = row.config_value || '';
        if (row.is_secret && value) {
          value = decrypt(value);
        }
        map[row.config_key] = value;
      });
      configCache = map;
      resolve(map);
    });
  });
}

function getConfig(key) {
  return configCache[key] || process.env[key] || '';
}

function getAllConfig() {
  return { ...configCache };
}

function setConfig(key, value, isSecret = 0, description = '') {
  return new Promise((resolve, reject) => {
    let storeValue = value;
    if (isSecret && value) {
      storeValue = encrypt(value);
    }
    connection.query(updateSystemConfig, [storeValue, isSecret, description, key], (err) => {
      if (err) {
        reject(err);
        return;
      }
      configCache[key] = value;
      resolve();
    });
  });
}

function maskSecret(value) {
  if (!value || value.length <= 8) return value ? '********' : '';
  return value.slice(0, 4) + '****' + value.slice(-4);
}

module.exports = {
  loadConfig,
  getConfig,
  getAllConfig,
  setConfig,
  maskSecret
};
