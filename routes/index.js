var express = require("express");
var router = express.Router();
// route to controller
const { r2c } = require("./helper");

router.get(
  "/v1/export/pdf/:task_id/:object_type/:object_id",
  r2c("ExportController", "index")
);

router.post("/pdf-download", r2c("PdfController", "index"));

// router.get('/test', r2c('ExportController', 'test'));

router.post("/v2/data_platform/headless/pdf", r2c("ExportController", "index"));

module.exports = router;
