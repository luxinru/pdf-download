import Controller from "./Controller";
import Job from "../jobs/Job";
import RenderDashboardJob from "../jobs/RenderDashboardJob";
import SchedulerCallbackJob from "../jobs/SchedulerCallbackJob";
import RenderComponentJob from "../jobs/RenderComponentJob";

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
    const accessToken = this.req.get("Access-Token");
    const valid = this.validator({
      task_id: { type: "string" },
      object_id: { type: "string" },
      object_type: { type: "enum", values: ["dashboard", "component"] },
      project_id: { type: "string" }
    });
    if (!valid) return;

    const taskId = this.request("task_id");
    const objectId = this.request("object_id");
    const objectType = this.request("object_type");
    const projectId = this.request("project_id");
    const taskType = this.request("task_type");
    if (objectType === "dashboard") {
      Job.dispatch(new RenderDashboardJob(accessToken, objectId, taskId));
      this.resCodeJson({ msg: "导出任务提交成功", code: 1 });
    } else if (objectType === "component") {
      Job.dispatch(
        new RenderComponentJob(
          accessToken,
          objectId,
          taskId,
          projectId,
          taskType
        )
      );
      this.resCodeJson({ msg: "导出任务提交成功", code: 1 });
    } else {
      this.resErrJson(400001, `object_type: ${objectType} 尚未支持`);
    }
  }

  test() {
    const accessToken = this.req.get("Access-Token");
    Job.dispatch(new SchedulerCallbackJob(accessToken, 234234423, 23434223));
    this.resCodeJson({ msg: "导出任务提交成功", code: 1 });
  }
}
