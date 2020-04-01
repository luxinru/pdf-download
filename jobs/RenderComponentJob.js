import Job from "./Job";
import { CACHE_PATH, PAGE_URL_ROOT, CHROMIUM_URI } from "../env";
import UploadFileJob from "./UploadFileJob";
import path from "path";
import log from "../logs";
var puppeteer = require("puppeteer-core");

/**
 * 渲染仪表盘
 */
export default class extends Job {
  constructor(accessToken, id, taskId, projectId, taskType) {
    super();
    this.accessToken = accessToken;
    this.id = id;
    this.taskId = taskId;
    this.projectId = projectId;
    this.taskType = taskType;
  }

  async run() {
    const url =
      this.projectId && this.projectId !== "null"
        ? `${PAGE_URL_ROOT}/show.html#/component/token/${this.accessToken}/id/${this.id}?projectId=${this.projectId}`
        : `${PAGE_URL_ROOT}/show.html#/component/token/${this.accessToken}/id/${this.id}`;

    log.info("导出页面:" + url);
    console.log("导出页面:" + url);

    if (!global.browser) {
      puppeteer
        .launch({
          defaultViewport: {
            width: 1920,
            height: 1080
          },
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
          executablePath: path.resolve(__dirname, "./" + CHROMIUM_URI)
        })
        .then(res => {
          global.browser = res;
        });
    }

    const browser = global.browser;

    // 使用离线下载的Chromium
    let page = await browser.newPage();
    await page.goto(url, {
      waitUntil: ["networkidle0"]
    });

    // 获取页面宽度 高度，用于动态设置pdf高度
    const { bodyWeight, bodyHeight, title } = await page.evaluate(() => {
      const el = document.getElementById("tableId");
      return {
        bodyHeight: document.body.clientHeight,
        title: window._title,
        bodyWeight: el.firstChild.scrollWidth
      };
    });

    if (bodyWeight && bodyWeight > 1920) {
      await page.setViewport({
        width: bodyWeight + 20,
        height: bodyHeight
      });
    }

    // 构建文件名称
    const filePath = `${CACHE_PATH}/${title}-${this.taskId}.pdf`;

    await page.pdf({
      path: filePath,
      printBackground: true,
      // scale: 1,
      width: bodyWeight && bodyWeight > 1920 ? bodyWeight + "px" : 1920 + "px",
      height: bodyHeight + 10 + "px"
    });

    await page.close();
    log.info("PDF地址:" + filePath);

    Job.dispatch(
      new UploadFileJob(
        this.accessToken,
        path.resolve(__dirname, "../" + filePath),
        this.taskId,
        this.taskType
      )
    );
  }
}
