var puppeteer = require("puppeteer-core");
var { CHROMIUM_URI } = require("./env");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var { accessLogMiddleware } = require("./logs/index");

var index = require("./routes/index");

var app = express();

// 设置允许跨域访问该服务.
app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  next();
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(accessLogMiddleware);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", index);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// 全局浏览器
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

module.exports = app;
