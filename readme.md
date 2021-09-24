# PDF 生成 Node 服务

**该服务用于实现页面导出 PDF（离线导出）等功能**

> 基于 Express 4 开发的一个（RC）Router-Controller 项目

## 使用说明

**1.环境安装**

安装 [Node](http://nodejs.cn/download/)（版本：8+）

**2.应用配置**

`cp .env.sample .env`

`vim .env`

```
#以下是配置项

API_ROOT=https://dev-api.xlink.cn
PAGE_URL_ROOT=http://localhost:8080
SERVER_PORT=3000
CHROMIUM_URI=chromium/chrome-mac/Chromium.app/Contents/MacOS/Chromium
CACHE_PATH=storage/cache
LOG_PATH=storage/logs

*API_ROOT 接口根地址
*PAGE_URL_ROOT 平台应用根地址
*SERVER_PORT 服务端口
*CHROMIUM_URI chromium内核本地地址，如是linux环境：chromium/chrome-linux/chrome, 支持绝对路径，以/开头
*LOG_PATH 日志目录，支持绝对路径，以/开头
*CACHE_PATH 日志目录，支持绝对路径，以/开头


```

**Chromium 下载，注意平台架构区分**
[https://download-chromium.appspot.com/?platform=Linux_x64&type=snapshots](https://download-chromium.appspot.com/?platform=Linux_x64&type=snapshots)

> 解压到相对目录或者绝对目录下。
> 关于 CHROMIUM_URI 配置：Linux 下指向 chrome-linux/chrome，Mac 下指向 chrome-mac/Chromium.app/Contents/MacOS/Chromium

_可能需要安装的依赖：_

```
yum install libX11 libXcomposite libXcursor libXdamage libXext libXfixes libXi libXrender libXtst cups-libs libXScrnSaver libXrandr alsa-lib atk gtk3
```

**3.开发调试**

`npm i`

`npm run dev`

**4.生产部署**

`npm i`

`npm install -g pm2`

`npm run start`

> 如需要修改 pm2 监控配置，可以修改 pm2.config.json
