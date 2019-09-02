import Job from './Job';
import { fetch } from '../helper';
import { API_ROOT } from '../env';
import log from '../logs';
/**
 * 回调给服务端
 */
export default class extends Job {
  constructor(accessToken, taskId, xFileId, taskType) {
    super();

    this.accessToken = accessToken;
    this.taskType = taskType
    this.body = {
      task_id: taskId,
      xfile_id: xFileId
    };
  }
  async run() {
    const address = this.taskType ? `/v2/data_platform/${this.taskType}/callback` : `/v2/data_platform/scheduler/callback`
    const url = API_ROOT + address;
    log.info('开始上报导出结果:' + JSON.stringify(this.body));
    try {
      const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(this.body),
        headers: {
          'Content-Type': 'application/json',
          'Access-Token': this.accessToken
        }
      });
      // @SP，该接口只要返回200，表示成功
      if (res.status === 200) {
        log.info('上报导出结果成功:' + this.body);
      }
    } catch (err) {
      log.error('上报导出结果失败:', err);
    }
  }
}
