/**
 * 判断是否为数字
 * @param {*} value
 */
export function isNum(value) {
  return !Number.isNaN(Number(value));
}

/**
 * 如果value是字符串数字，直接转换成数字
 * @param {*} value
 */
export function wrapNumber(value) {
  if (isNum(value)) {
    return +value;
  }
  return value;
}

/**
 * map 2 url query params
 * @param {*} map
 */
export function urlQueryString(map = {}) {
  return Object.keys(map)
    .map(key => [key, map[key]].join('='))
    .join('&');
}
