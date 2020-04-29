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
    });
    if (!url || !valid) return;

    Job.dispatch(new GeneratePdfJop(url, this.res));
  }
}
