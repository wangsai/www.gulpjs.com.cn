# 在多文件中分割任务

如果你的 `gulpfile.js` 开始变得太大。你可以使用[require-dir](https://github.com/aseemk/requireDir)模块把任务分割中独立文件。

试想下列目录结构：

```sh
gulpfile.js
tasks/
├── dev.js
├── release.js
└── test.js
```

安装`require-dir`模块：

```sh
npm install --save-dev require-dir
```

把下列的行添加到你的`gulpfile.js`文件中。

```js
var requireDir = require('require-dir');
var dir = requireDir('./tasks');
```
