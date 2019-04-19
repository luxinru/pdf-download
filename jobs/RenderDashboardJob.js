import Job from './Job';
import { STORAGE_ROOT, PAGE_URL_ROOT, CHROMIUM_MODE } from '../env';
import puppeteer from 'puppeteer';
import UploadFileJob from './UploadFileJob';
import path from 'path';

/**
 * 渲染仪表盘
 */
export default class extends Job {
  constructor(accessToken, id, taskId) {
    super();
    this.accessToken = accessToken;
    this.id = id;
    this.taskId = taskId;
  }

  async run() {
    const url = `${PAGE_URL_ROOT}/show.html#/dashboard/token/${
      this.accessToken
    }/id/${this.id}`;

    const options = {
      defaultViewport: {
        width: 1920,
        height: 1080
      }
    };

    // 使用离线下载的Chromium
    if (CHROMIUM_MODE === 'local') {
      options.executablePath = path.resolve(
        __dirname,
        '../chromium/Chromium.app/Contents/MacOS/Chromium'
      );
    }
    const browser = await puppeteer.launch(options);
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
    const filePath = `${STORAGE_ROOT}/${title}-${this.taskId}.pdf`;

    await page.pdf({
      path: filePath,
      printBackground: true,
      // scale: 1,
      width: '1920px',
      height: bodyHeight + 10 + 'px'
    });

    await browser.close();
    Job.dispatch(
      new UploadFileJob(
        this.accessToken,
        path.resolve(__dirname, '../' + filePath),
        this.taskId
      )
    );
  }
}
