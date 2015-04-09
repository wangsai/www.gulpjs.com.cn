# 使用watchify加速browserify的构建

要扩展[browserify](http://github.com/substack/node-browserify)项目, 绑定它的时间变得越来越长。开始时也许是1秒，构建一个特定的大型项目也许会让你等上30秒。

这就是为什么[substack](http://github.com/substack)编写了 [watchify](http://github.com/substack/watchify), 一个稳定的 browserify bundler来检测文件改变和*only rebuilds what it needs to*. 通过这个方式，第一次构建也许还是需要30,秒，但随后的构建可以保持在100毫秒内 - 这是一个巨大的提升。

Watchify没有gulp插件，它本身也不需要:你可以使用[vinyl-source-stream](http://github.com/hughsk/vinyl-source-stream)来流处理bundle流到你的gulp流管道中。

``` javascript
var gulp = require('gulp');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var watchify = require('watchify');
var browserify = require('browserify');

gulp.task('watch', function() {
  var bundler = watchify(browserify('./src/index.js', watchify.args));

  // Optionally, you can apply transforms
  // and other configuration options on the
  // bundler just as you would with browserify
  bundler.transform('brfs');

  bundler.on('update', rebundle);

  function rebundle() {
    return bundler.bundle()
      // log errors if they happen
      .on('error', gutil.log.bind(gutil, 'Browserify Error'))
      .pipe(source('bundle.js'))
      .pipe(gulp.dest('./dist'));
  }

  return rebundle();
});
```
