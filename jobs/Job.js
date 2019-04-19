/**
 * Job
 * 子类需要实现构造和run方法
 */
export default class Job {
  static dispatch(job) {
    setTimeout(() => {
      job.run();
    });
  }
  constructor() {}
  run() {}
}
