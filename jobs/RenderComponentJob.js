import Job from './Job';
import { CACHE_PATH, PAGE_URL_ROOT, CHROMIUM_URI } from '../env';
import puppeteer from 'puppeteer-core';
import UploadFileJob from './UploadFileJob';
import path from 'path';
import log from '../logs';

/**
 * 渲染仪表盘
 */
export default class extends Job {
  constructor(accessToken, id, taskId, taskType) {
    super();
    this.accessToken = accessToken;
    this.id = id;
    this.taskId = taskId;
    this.taskType = taskType
  }

  async run() {
    const url = `${PAGE_URL_ROOT}/show.html#/component/token/${
      this.accessToken
    }/id/${this.id}`;

    log.info('导出页面:' + url);

    const options = {
      defaultViewport: {
        width: 1920,
        height: 1080
      },
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ]
    };

    // 使用离线下载的Chromium
    options.executablePath = path.resolve(__dirname, '../' + CHROMIUM_URI);
    let browser = await puppeteer.launch(options);
    let page = await browser.newPage();
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

    // 获取页面高度，用于动态设置pdf高度
    const contentWidth = await page.evaluate(() => {
      const el = document.getElementById('tableId')
      if (el) {
        return el.firstChild.scrollWidth
      } else {
        return 1920
      }
    });

    if (contentWidth && contentWidth > 1920) {
      await browser.close()
      browser = await puppeteer.launch({
        defaultViewport: {
          width: contentWidth + 20,
          height: bodyHeight
        },
        executablePath: path.resolve(__dirname, '../' + CHROMIUM_URI)
      })
      page = await browser.newPage();
      await page.goto(url, {
        waitUntil: ['networkidle0']
      });
    }
    
    // 构建文件名称
    const filePath = `${CACHE_PATH}/${title}-${this.taskId}.pdf`;
    
    await page.pdf({
      path: filePath,
      printBackground: true,
      // scale: 1,
      width: contentWidth && contentWidth > 1920 ? contentWidth + 'px' : 1920 + 'px',
      height: bodyHeight + 10 + 'px'
    });

    await browser.close();
    log.info('PDF地址:' + filePath);

    Job.dispatch(
      new UploadFileJob(
        this.accessToken,
        path.resolve(__dirname, '../' + filePath),
        this.taskId,
        this.taskType,
      )
    );
  }
}
