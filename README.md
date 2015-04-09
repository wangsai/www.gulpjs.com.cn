## 编译静态网站

0. 进入项目目录。
1. 执行 `npm install` 下载依赖包。
2. 执行 `node index` 生成静态网站，即 `_site` 目录。

## 文件用途

1. `contents` 目录包含了所有 gulp 文档。
2. `templates` 目录包含了编译用到的模板文件。
3. `assets` 目录包含了 css、js、image 等静态资源文件。
4. `public` 目录是 gulpjs.com 网站的原始文件，目前没有任何用处。

## 编译系统

我们采用了 [Metalsmith](http://www.metalsmith.io/) 作为生成静态网站的工具。详细使用方式请查看 Metalsmith 文档。


