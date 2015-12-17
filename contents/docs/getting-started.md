# 开始

#### 1.全局安装gulp

```sh
$ npm install --global gulp
```

#### 2. 在你的项目的 devDependencies 下安装gulp

```sh
$ npm install --save-dev gulp
```

#### 3.在你项目的根目录下创建 `gulpfile.js` 文件

```js
var gulp = require('gulp');

gulp.task('default', function() {
  // place code for your default task here
});
```

#### 4.运行 gulp

```sh
$ gulp
```

这个默认任务将会运行但不会产生任何东西。

运行个别的任务，用 `gulp <task> <othertask>`。

## 我们接下来该做什么

你已经拥有了一个空的gulp文件，环境也已经配置好了。怎么样才是你才是真正的开始了呢？查看指南和文章列表获得更多信息。

## .src、.watch、.dest、.CLI 参数 -这些东西我该怎么使用？ 

对于特定的API文档，你可以查询 [API文档](API.md)。

## 可用插件 

gulp的用户群体正在增长，每天都有新的插件生成。在[主页](http://gulpjs.com/plugins/)上查看完整列表。
