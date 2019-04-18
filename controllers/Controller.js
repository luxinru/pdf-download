/**
 * 控制器基类，不直接使用
 */
export default class Controller {
  constructor(req, res, next) {
    this.req = req;
    this.res = res;
    this.next = next;
  }

  request(key, defaultValue) {
    const params = this.req.params || {};
    const query = this.req.query || {};
    const body = this.req.body || {};
    return body[key] || params[key] || query[key] || defaultValue;
  }
}
