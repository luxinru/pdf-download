/**
 * 该文件定义的导出的静态变量，均要求支持.env配置
 */
import fs from 'fs';
const ENV_MAP = parseEnv();

export const TOKEN = env('TOKEN', 'token');

// 数据平台页面根地址
export const PAGE_URL_ROOT = env('PAGE_URL_ROOT', 'http://localhost:8080');

// 本地临时缓存地址
export const STORAGE_ROOT = env('STORAGE', 'storage');

//接口根地址
export const API_ROOT = env('API_ROOT', 'https://dev-api.xlink.cn');

// Chrome
export const CHROMIUM_URI = env(
  'CHROMIUM_URI',
  'chromium/chrome-mac/Chromium.app/Contents/MacOS/Chromium'
); // or chromium/chrome-linux/chrome

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
