import Job from './Job'
import { CACHE_PATH, PAGE_URL_ROOT, CHROMIUM_URI } from '../env'
import UploadFileJob from './UploadFileJob'
import path from 'path'
import log from '../logs'

/**
 * 渲染仪表盘
 */
export default class extends Job {
  constructor(accessToken, id, taskId) {
    super()
    this.accessToken = accessToken
    this.id = id
    this.taskId = taskId
  }

  async run() {
    const url = `${PAGE_URL_ROOT}/show.html#/dashboard/token/${this.accessToken}/id/${this.id}`

    log.info('导出页面:' + url)

    if (!global.browser) {
      puppeteer
        .launch({
          defaultViewport: {
            width: 1920,
            height: 1080
          },
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
          executablePath: path.resolve(__dirname, './' + CHROMIUM_URI)
        })
        .then(res => {
          global.browser = res
        })
    }

    const browser = global.browser
    const page = await browser.newPage()

    await page.goto(url, {
      waitUntil: ['networkidle0']
    })

    // 获取页面高度，用于动态设置pdf高度
    const { bodyHeight } = await page.evaluate(() => {
      return {
        bodyHeight: document.body.clientHeight
      }
    })
    // 构建文件名称
    const filePath = `${CACHE_PATH}/${Date.now()}-${this.taskId}.pdf`

    await page.pdf({
      path: filePath,
      printBackground: true,
      // scale: 1,
      width: '1920px',
      height: bodyHeight + 10 + 'px'
    })

    await page.close()

    log.info('PDF地址:' + filePath)
    const fileName =
      CACHE_PATH[0] === '/'
        ? path.resolve(filePath)
        : path.resolve(__dirname, '../' + filePath)

    Job.dispatch(new UploadFileJob(this.accessToken, fileName, this.taskId))
  }
}
