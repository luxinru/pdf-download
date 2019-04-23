# 数据可视化平台 Node 服务

## 使用说明

**Chromium 下载，注意平台架构区分**
[https://download-chromium.appspot.com/?platform=Linux_x64&type=snapshots](https://download-chromium.appspot.com/?platform=Linux_x64&type=snapshots)

> 解压放置 chromium 目录之下

**1.环境配置**

```
cp .env.sample .env

#以下是配置项

API_ROOT=https://dev-api.xlink.cn
PAGE_URL_ROOT=http://localhost:8080
SERVER_PORT=3000
CHROMIUM_URI=chromium/chrome-mac/Chromium.app/Contents/MacOS/Chromium


*API_ROOT 接口根地址
*PAGE_URL_ROOT 数据平台应用根地址
*SERVER_PORT 服务端口
*CHROMIUM_URI chromium内核本地地址，如是linux环境：chromium/chrome-linux/chrome

```

`npm i`

**2.开发**
`npm run dev`

**3.部署**

`npm install -g pm2`

`npm run start`

> 如需要修改 pm2 监控配置，可以修改 pm2.config.json

## 服务内部涉及到的 API

---

1.[XFile 管理-XFile 上传](https://docs.xlink.cn/pages/viewpage.action?pageId=4063397#XFile%E7%AE%A1%E7%90%86-XFile%E4%B8%8A%E4%BC%A0)

2.[数据网关服务（Data-GatewayService）设计文档-4.13.2 任务完成回调接口](https://docs.xlink.cn/pages/viewpage.action?pageId=27246383#id-%E6%95%B0%E6%8D%AE%E7%BD%91%E5%85%B3%E6%9C%8D%E5%8A%A1%EF%BC%88Data-GatewayService%EF%BC%89%E8%AE%BE%E8%AE%A1%E6%96%87%E6%A1%A3-4.13.2%E4%BB%BB%E5%8A%A1%E5%AE%8C%E6%88%90%E5%9B%9E%E8%B0%83%E6%8E%A5%E5%8F%A3)
