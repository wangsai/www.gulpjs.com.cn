# 删除文件和目录

在运行构建系统之前你也许想删除一些文件。既然删除的文件在文件内容上没有用，那么就没有理由使用gulp插件。最好方法是使用一个普遍的node模式。

我们用[`del`](https://github.com/sindresorhus/del)模式作为例子因为它支持多文件和[全局](https://github.com/sindresorhus/multimatch#globbing-patterns):

```sh
$ npm install --save-dev gulp del
```

试想一下文件结构：

```
.
├── dist
│   ├── report.csv
│   ├── desktop
│   └── mobile
│       ├── app.js
│       ├── deploy.json
│       └── index.html
└── src
```

在gulpfile中我们想在运行构建系统之前清除`mobile`文件夹里的内容:

```js
var gulp = require('gulp');
var del = require('del');

gulp.task('clean:mobile', function (cb) {
  del([
    'dist/report.csv',
    // here we use a globbing pattern to match everything inside the `mobile` folder
    'dist/mobile/**',
    // we don't want to clean this file though so we negate the pattern
    '!dist/mobile/deploy.json'
  ], cb);
});

gulp.task('default', ['clean:mobile']);
```
