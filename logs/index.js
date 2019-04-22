import bunyan from 'bunyan';
import path from 'path';

import { LOG_PATH } from '../env';
const log = bunyan.createLogger({
  name: 'default',
  streams: [
    {
      level: 'info',
      path: path.resolve(__dirname, '../' + LOG_PATH + '/info.log')
    },
    {
      level: 'error',
      path: path.resolve(__dirname, '../' + LOG_PATH + '/error.log')
    },
    {
      level: 'debug',
      path: path.resolve(__dirname, '../' + LOG_PATH + '/debug.log')
    }
  ]
});

export function accessLogMiddleware(req, res, next) {
  log.info({
    method: req.method,
    url: req.url,
    headers: req.headers
  });
  next();
}

export default log;
