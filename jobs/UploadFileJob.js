import Job from './Job';
import { fetch } from '../helper';
import { createReadStream } from 'fs';
import { API_ROOT } from '../env';
import SchedulerCallbackJob from './SchedulerCallbackJob';
import log from '../logs';

export default class extends Job {
  // fileName 路径 + 文件名
  constructor(accessToken, fileName, taskId) {
    super();
    this.accessToken = accessToken;
    this.fileName = fileName;
    this.taskId = taskId;
  }
  async run() {
    const type = this.fileName.split('.').pop();
    const content = {
      type
    };
    const base64Content = new Buffer(JSON.stringify(content)).toString(
      'base64'
    );
    const url = API_ROOT + '/v2/xfile/upload?content=' + base64Content;
    log.info('上传PDF：' + this.fileName, url);
    try {
      const res = await fetch(url, {
        method: 'POST',
        body: createReadStream(this.fileName),
        headers: {
          'Access-Token': this.accessToken
        }
      });

      const { id: xFileId, download_url: filePath } = await res.json();
      Job.dispatch(
        new SchedulerCallbackJob(this.accessToken, this.taskId, xFileId)
      );
      log.info('上传PDF成功:' + filePath);
    } catch (err) {
      log.error('上传PDF失败:', err);
    } finally {
      fs.unlink(this.fileName, err => {
        if (err) {
          log.error('删除PDF失败：', this.fileName, err);
        }
      });
    }
  }
}
