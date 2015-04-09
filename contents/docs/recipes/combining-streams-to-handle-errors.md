# 合并分支来处理错误
默认情况下, 一个流中产生的错误会被抛出除非它已经绑定了一个附加了`error`事件的监听器。当你构建了很长的流式管道时事情更加复杂。

使用[multistream](https://github.com/feross/multistream) 你可以把多个流合并成一个流，这意味着你只需要在代码中的一个地方监听`error`事件。

下列是在gulpfile中使用的一个例子:

```
var Multistream = require('multistream');
var uglify = require('gulp-uglify');
var gulp = require('gulp');

gulp.task('test', function() {
  var combined = Multistream([
    gulp.src('bootstrap/js/*.js'),
    uglify(),
    gulp.dest('public/bootstrap')
  ]);

  // any errors in the above streams will get caught
  // by this listener, instead of being thrown:
  combined.on('error', console.error.bind(console));

  return combined;
});
```
