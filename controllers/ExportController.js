import Controller from './controller';
import { TOKEN, PAGE_URL_ROOT, STORAGE_ROOT } from '../env';
import puppeteer from 'puppeteer';

/**
 * 导出仪表盘
 */
export default class ExportController extends Controller {
  /**
   * call by route
   * @param {*} taskId
   * @param {*} dashboardId
   */
  async index() {
    const valid = this.validator({
      task_id: { type: 'string' },
      object_id: { type: 'string' },
      object_type: { type: 'enum', values: ['dashboard'] }
    });
    if (!valid) return;

    const taskId = this.request('task_id');
    const objectId = this.request('object_id');
    const objectType = this.request('object_type');

    if (objectType === 'dashboard') {
      this.resCodeJson({ msg: '导出任务提交成功', code: 1 });
      const fileName = await this._renderDashboard(objectId, taskId);
      this._callback(fileName);
    } else {
      this.resErrJson(400001, `object_type: ${objectType} 尚未支持`);
    }
  }

  _callback(fileName) {
    console.log('send', fileName);
  }

  /**
   * 根据仪表盘ID生成pdf
   * @param {*} id 仪表盘ID
   * @param {*} taskId
   */
  async _renderDashboard(id, taskId) {
    const url = `${PAGE_URL_ROOT}/show.html#/dashboard/token/${TOKEN}/id/${id}`;

    const browser = await puppeteer.launch({
      defaultViewport: {
        width: 1920,
        height: 1080
      }
    });
    const page = await browser.newPage();

    await page.goto(url, {
      waitUntil: ['networkidle0']
    });

    // 获取页面高度，用于动态设置pdf高度
    const { bodyHeight, title } = await page.evaluate(() => {
      return {
        bodyHeight: document.body.clientHeight,
        title: window._title
      };
    });
    // 构建文件名称
    const path = `${STORAGE_ROOT}/${title}-${taskId}.pdf`;

    await page.pdf({
      path,
      printBackground: true,
      // scale: 1,
      width: '1920px',
      height: bodyHeight + 10 + 'px'
    });

    await browser.close();
    return path;
  }
}
