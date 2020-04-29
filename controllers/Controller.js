import Validator from "fastest-validator";
import { wrapNumber } from "../utils";
/**
 * 控制器基类，不直接使用
 */
export default class Controller {
  constructor(req, res, next) {
    this.req = req;
    this.res = res;
    this.next = next;
    // 用于缓存参数
    this._requestMap = {};
  }

  // https://www.npmjs.com/package/fastest-validator
  /**
   * 验证参数，如果通过，返回true
   * 如果验证不通过，返回false，会自动响应不同的json内容
   * @param {*} schema
   */
  validator(schema = {}) {
    const keys = Object.keys(schema);
    const map = {};
    keys.forEach((key) => {
      map[key] = this.request(key);
    });

    if (!this._validator) {
      this._validator = new Validator();
    }
    const valid = this._validator.validate(map, schema);

    if (valid !== true) {
      this.resErrJson(0, "参数有误", valid);
      return false;
    }

    return true;
  }

  /**
   * 用来提取参数，包括query，params，body
   */
  request(key, defaultValue) {
    // 缓存参数
    if (this._requestMap[key]) {
      return this._requestMap[key] || defaultValue;
    }
    const params = this.req.params || {};
    const query = this.req.query || {};
    const body = this.req.body || {};
    // 为数字做特殊处理

    const value =
      body[key] || wrapNumber(params[key]) || wrapNumber(query[key]);
    this._requestMap[key] = value;
    return value || defaultValue;
  }

  resErrJson(status = 40001, msg = "Not Found", content = null) {
    this.resCodeJson(content, status, {
      status,
      msg,
    });
  }
  resCodeJson(content = {}, status = 200001, error = null) {
    if (error) {
      content.error = error;
    }

    const httpStatus = (status + "").substr(0, 3);
    this.resJson(content, httpStatus);
  }

  resJson(data = {}, status = 200) {
    this.res.status(status).json(data);
  }
}
