import fs from 'fs';
const ENV_MAP = parseEnv();

export const TOKEN = env('TOKEN', 'token');

export const PAGE_URL_ROOT = env('PAGE_URL_ROOT', 'http://localhost:8080');

export const STORAGE_ROOT = env('storage', 'storage');

function env(key, defaultValue) {
  return ENV_MAP[key] || defaultValue;
}

export default env;

function parseEnv() {
  const text = fs.readFileSync('./.env').toString();
  const row = text.split('\n');
  const map = {};
  row.forEach(item => {
    // 去掉注释
    if (item[0] !== '#') {
      const [key, value] = item.split('=');
      map[key] = value;
    }
  });
  return map;
}
