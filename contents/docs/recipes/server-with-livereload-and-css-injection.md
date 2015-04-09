# 有实时刷新和CSS注入的服务器

通过 [BrowserSync](http://browsersync.io)和gulp，你可以轻松创建一个服务器开发环境可以在同WiFi中的任何设备上访问。BrowserSync同时内置了实时刷新，所以不需要再配置其他东西。

首先安装模块：

```sh
$ npm install --save-dev browser-sync
```

然后试想一下下列文件结构...

```
gulpfile.js
app/
  styles/
    main.css
  scripts/
    main.js
  index.html
```

...你可以很容易给`app`目录的文件创建一个服务并且当其中的任何一个改变时候刷新所有浏览器：

```
var browserSync = require('browser-sync');
var reload = browserSync.reload;

// watch files for changes and reload
gulp.task('serve', function() {
  browserSync({
    server: {
      baseDir: 'app'
    }
  });

  gulp.watch(['*.html', 'styles/**/*.css', 'scripts/**/*.js'], {cwd: 'app'}, reload);
});

```


## + CSS 预处理器

一个普遍的使用案例是重新加载CSS文件当它们被预处理后。用Sass作为例子，通过这个方式你可以让浏览器重新加载CSS而不用刷新整个页面。

```
var sass = require('gulp-ruby-sass');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

gulp.task('sass', function() {
  return gulp.src('scss/styles.scss')
    .pipe(sass())
    .pipe(gulp.dest('css'))
    .pipe(reload({ stream:true }));
});

// watch files for changes and reload
gulp.task('serve', function() {
  browserSync({
    server: {
      baseDir: 'app'
    }
  });

  gulp.watch('scss/*.scss', ['sass']);
});
```


## 扩展

- Live reload, CSS 注入 and scroll/form syncing works seamlessly inside of [BrowserStack](http://www.browserstack.com/) virtual machines.
- 设置 `tunnel: true` 来在公开URL上浏览本地站点(由所有BrowserSync特性完成)。
