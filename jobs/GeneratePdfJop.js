import Job from "./Job";
import { CACHE_PATH, PAGE_URL_ROOT, CHROMIUM_URI } from "../env";
import path from "path";
var puppeteer = require("puppeteer-core");
import fs, { createReadStream } from "fs";
import mimeType from "mime-types";

/**
 * 渲染仪表盘
 */
export default class extends Job {
  constructor(url, domId, res) {
    super();
    this.url = url;
    this.domId = domId;
    this.res = res;
  }

  async run() {
    console.log('进入方法:', new Date())
    const self = this

    if (!global.browser) {
      puppeteer
        .launch({
          defaultViewport: {
            width: 1920,
            height: 1080,
          },
          args: ["--no-sandbox", "--disable-setuid-sandbox", "--lang=zh-CN"],
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
    const { bodyWeight, bodyHeight } = await page.evaluate(() => {
      if (self.domId && document.getElementById("tableId")) {
        const el = document.getElementById("tableId");
        return {
          bodyHeight: document.body.clientHeight,
          bodyWeight: el.firstChild.scrollWidth
        };
      } else {
        return {
          bodyHeight: document.body.clientHeight,
          bodyWeight: document.body.scrollWidth,
        };
      }
    });

    await page.setViewport({
      width: (bodyWeight && bodyWeight > 1920) ? bodyWeight + 20 : 1920,
      height: (bodyHeight && bodyHeight > 1080) ? bodyHeight + 10 : 1080,
    });

    // 构建文件名称
    const filePath = `${CACHE_PATH}/temp.pdf`;
    
    await page.pdf({
      path: filePath,
      printBackground: true,
      // scale: 1,
      width: bodyWeight + 'px',
      height: bodyHeight + 'px',
    });

    page.close();
    
    console.log("时间:" + new Date())
    console.log("PDF地址:" + filePath);

    const filePaths = path.resolve(filePath);
    let data = fs.readFileSync(filePaths);
    data = Buffer.from(data).toString("base64");
    const base64 = "data:" + mimeType.lookup(filePath) + ";base64," + data;

    this.res.send(base64);

    fs.unlink(filePath, (err) => {
      if (err) {
        console.log("删除失败");
      }
    });
  }
}
