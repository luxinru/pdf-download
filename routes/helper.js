import pathToRegexp from 'path-to-regexp';
import path from 'path';

/**
 * route to controller
 */
export function r2c(className, methodName) {
  return function(req, res, next) {
    const fileName = path.resolve(__dirname, '../controllers/' + className);

    const clazz = require(fileName).default;

    const cls = new clazz(req, res, next);

    const resKeys = [];

    pathToRegexp(req.route.path, resKeys).exec(req.path);

    const params = resKeys.map(({ name }) => req.params[name]);

    cls[methodName](...params);
  };
}
