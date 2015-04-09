# 和流工厂共享流

如果你在多个任务中使用了相同的插件，你也许会发现自己很渴望事情变得清晰。这个方法使得你可以创建工厂来分隔你常用的数据流链。

我们将使用[lazypipe](https://github.com/OverZealous/lazypipe) 来完成这个工作。

这是我们的样例文件:

```js
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var coffee = require('gulp-coffee');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');

gulp.task('bootstrap', function() {
  return gulp.src('bootstrap/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(uglify())
    .pipe(gulp.dest('public/bootstrap'));
});

gulp.task('coffee', function() {
  return gulp.src('lib/js/*.coffee')
    .pipe(coffee())
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(uglify())
    .pipe(gulp.dest('public/js'));
});
```

使用lazypipe后我们的文件内容如下：

```js
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var coffee = require('gulp-coffee');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var lazypipe = require('lazypipe');

// give lazypipe
var jsTransform = lazypipe()
  .pipe(jshint)
  .pipe(jshint.reporter, stylish)
  .pipe(uglify);

gulp.task('bootstrap', function() {
  return gulp.src('bootstrap/js/*.js')
    .pipe(jsTransform())
    .pipe(gulp.dest('public/bootstrap'));
});

gulp.task('coffee', function() {
  return gulp.src('lib/js/*.coffee')
    .pipe(coffee())
    .pipe(jsTransform())
    .pipe(gulp.dest('public/js'));
});
```

可以看到我们把我们的Javascript管道(JSHint + Uglify)分割成一个工厂从而在多个文件中复用。这个工厂可以在许多任务中被复用。你也可以嵌套或者链接工厂来取得更多效果。分隔每个共享的管道也让你在想要改变工作流时有一个核心的方法来改变。
