import bunyan from 'bunyan';
import path from 'path';

import { LOG_PATH, ENV } from '../env';

const prePath =
  LOG_PATH[0] === '/' ? LOG_PATH : path.resolve(__dirname, '../' + LOG_PATH);

const streams = [
  {
    type: 'rotating-file',
    level: 'info',
    path: prePath + '/info.log',
    count: 10,
    period: '1d'
  },
  {
    level: 'error',
    path: prePath + '/error.log'
  }
];
if (ENV === 'dev') {
  streams.push({
    type: 'rotating-file',
    level: 'debug',
    path: prePath + '/debug.log',
    count: 3,
    period: '1d'
  });
}
const log = bunyan.createLogger({
  name: 'default',
  streams
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
