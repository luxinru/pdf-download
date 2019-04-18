var express = require('express');
var router = express.Router();
// route to controller
const { r2c } = require('./helper');

router.get(
  '/dashbord-export/task/:taskId/dashboard/:id',
  r2c('ExportController', 'index')
);

module.exports = router;
