import Job from './Job';
import fetch from 'node-fetch';
import { API_ROOT } from '../env';
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
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  }
}
