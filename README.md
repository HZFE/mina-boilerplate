# 小程序模板

## 开发环境

### 开发者工具相关

1. 在小程序开发者工具中，导入当前项目时，请 `直接导入根目录`，而非 `dist` 目录。因为已在 `project.config.json` 中配置 `miniprogramRoot` 为 `dist/`。[projectconfig 相关文档](https://developers.weixin.qq.com/miniprogram/dev/devtools/projectconfig.html)。

2. 由于当前使用的 `webpack` 构建工具，会对代码做好所有的编译工作，因此开发者工具中的右上角，“详情” 一栏的 “本地配置”中，`不要勾选` “ES6 转 ES5”，“增强编译”，“上传代码时 xxx” 的选项。

3. 上传体验版时，务必执行 `npm run build` 命令后才上传，而非 `npm run start`。否则代码没有经过压缩处理等。

### 编辑器配置

推荐开发者使用 `vscode` 并安装 `Prettier` 和 `minapp` 插件。项目开发中将由 `.vscode/settings.json` 中的配置进行风格约束。

## 相关项目

[小程序 webpack plugin](https://github.com/HZFE/mina-webpack-plugin)
[小程序 webpack loader](https://github.com/HZFE/wxml-loader)
