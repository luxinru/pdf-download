import Job from './Job';
import { fetch } from '../helper';
import { API_ROOT } from '../env';
import log from '../logs';
/**
 * 回调给服务端
 */
export default class extends Job {
  constructor(accessToken, taskId, xFileId, filePath) {
    super();

    this.accessToken = accessToken;
    this.body = {
      task_id: taskId,
      xfile_id: xFileId,
      file_path: filePath
    };
  }
  async run() {
    const url = API_ROOT + `/v2/data_platform/scheduler/callback`;

    try {
      const res = await fetch(url, {
        method: 'POST',
        body: this.body,
        headers: {
          'Access-Token': this.accessToken
        }
      });
      log.info('上报导出结果成功:' + JSON.stringify(await res.json()));
    } catch (err) {
      log.error('上报导出结果失败:' + JSON.stringify(await err.json()));
    }
  }
}
