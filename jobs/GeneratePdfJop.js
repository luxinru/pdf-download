import Job from "./Job";
import { CACHE_PATH, PAGE_URL_ROOT, CHROMIUM_URI } from "../env";
import path from "path";
var puppeteer = require("puppeteer-core");
import fs, { createReadStream } from "fs";

/**
 * 渲染仪表盘
 */
export default class extends Job {
  constructor(url, res) {
    super();
    this.url = url;
    this.res = res;
  }

  async run() {
    if (!global.browser) {
      puppeteer
        .launch({
          defaultViewport: {
            width: 1920,
            height: 1080,
          },
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
          executablePath: path.resolve(__dirname, "./" + CHROMIUM_URI),
        })
        .then((res) => {
          global.browser = res;
        });
    }

    const browser = global.browser;

    // 使用离线下载的Chromium
    let page = await browser.newPage();
    await page.goto(this.url, {
      waitUntil: ["networkidle0"],
    });

    // 获取页面宽度 高度，用于动态设置pdf高度
    const { bodyWeight, bodyHeight, title } = await page.evaluate(() => {
      return {
        bodyHeight: document.body.clientHeight,
        title: window._title,
        bodyWeight: document.body.scrollWidth,
      };
    });

    if (bodyWeight && bodyWeight > 1920) {
      await page.setViewport({
        width: bodyWeight + 20,
        height: bodyHeight,
      });
    }

    const _id = Number(
      Math.random().toString().substr(3, 36) + Date.now()
    ).toString(36);

    // 构建文件名称
    const filePath = `${CACHE_PATH}/${_id}.pdf`;

    await page.pdf({
      path: filePath,
      printBackground: true,
      // scale: 1,
      width: bodyWeight && bodyWeight > 1920 ? bodyWeight + "px" : 1920 + "px",
      height: bodyHeight + 10 + "px",
    });

    await page.close();

    console.log("PDF地址:" + filePath);

    this.res.header("Content-Type", "application/pdf");

    const readStream = createReadStream(filePath, {
      encoding: "utf-8",
    });

    readStream.pipe(this.res);

    // fs.unlink(filePath, (err) => {
    //   if (err) {
    //     console.log("删除失败");
    //   }
    // });
  }
}
