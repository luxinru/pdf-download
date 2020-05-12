import Controller from "./Controller";
import Job from "../jobs/Job";
import GeneratePdfJop from "../jobs/GeneratePdfJop";

/**
 * 导出仪表盘
 */
export default class PdfController extends Controller {
  /**
   * call by route
   * @param {*} taskId
   * @param {*} dashboardId
   */
  async index() {
    const { url } = this.req.body;

    const valid = this.validator({
      url: { type: "string" },
      domId: { type: "string" }
    });
    if (!url) {
      this.res.send('url is a required parameter')
      return
    };

    if (!valid) {
      this.res.send('Parameter (url or domId) value invalid, expect (string)')
      return
    };

    if (url.indexOf('http') === -1) {
      this.res.send('Url is incorrect. Please confirm that the url can be opened in the browser.')
      return
    }

    Job.dispatch(new GeneratePdfJop(url, domId, this.res));
  }
}
