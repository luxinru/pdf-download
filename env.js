import fs from 'fs';
const ENV_MAP = parseEnv();

export const TOKEN = env('TOKEN', 'token');

export const PAGE_URL_ROOT = env('PAGE_URL_ROOT', 'http://localhost:8080');

export const STORAGE_ROOT = env('STORAGE', 'storage');

export const API_ROOT = env('API_ROOT', 'https://dev-api.xlink.cn');

export const CHROMIUM_MODE = env('CHROMIUM_MODE', 'node_modules'); // or local

/**
 * 获取环境变量
 * @param {*} key
 * @param {*} defaultValue
 */
function env(key, defaultValue) {
  return ENV_MAP[key] || defaultValue;
}

export default env;

/**
 * 解析.env配置
 */
function parseEnv() {
  const text = fs.readFileSync('./.env').toString();
  const row = text.split('\n');
  const map = {};
  row.forEach(item => {
    // 去掉注释
    if (item[0] !== '#') {
      const [key, ...value] = item.split('=');
      map[key] = value.join('=');
    }
  });

  return map;
}
