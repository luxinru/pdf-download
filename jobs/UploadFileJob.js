import Job from './Job';
import fetch from 'node-fetch';
import { createReadStream } from 'fs';
import { API_ROOT } from '../env';
import SchedulerCallbackJob from './SchedulerCallbackJob';

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
        new SchedulerCallbackJob(
          this.accessToken,
          this.taskId,
          xFileId,
          filePath
        )
      );
    } catch (err) {
      console.log(err);
    }
  }
}
