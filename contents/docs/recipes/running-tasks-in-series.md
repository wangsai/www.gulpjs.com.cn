# 连续执行任务, 即任务依赖

默认的，任务通常最大并发执行 -- 例如一次性发生所有任务而不做等待。如果你想要创建一系列的任务并按特定顺序执行，你需要做两件事：

- 给它一个提示来告诉它任务完成了,
- 然后给它一个提示如果一个任务要等另一个完成。

对于这样的例子，假设你有两个任务，“任务一”和“任务二”你想要按如下顺序执行：

1. 在任务“一”中你添加一个提示来告诉它任务完成了。不管是在完成时添加一个返回值还是返回一个确认值或流。In task "one" you add a hint to tell it when the task is done. Either take in a callback and call it when you're done or return a promise or stream that the engine should wait to resolve or end respectively.

2. 在任务“二”中你添加一个提示来告诉引擎任务二需要在任务一完成的基础上执行。

所以这个例子看起来如下：

```js
var gulp = require('gulp');

// takes in a callback so the engine knows when it'll be done
gulp.task('one', function(cb) {
    // do stuff -- async or otherwise
    cb(err); // if err is not null and not undefined, the orchestration will stop, and 'two' will not run
});

// identifies a dependent task must be complete before this one begins
gulp.task('two', ['one'], function() {
    // task 'one' is done now
});

gulp.task('default', ['one', 'two']);
// alternatively: gulp.task('default', ['two']);
```

另一个例子，返回的是流而不是使用一个回调函数：

```js
var gulp = require('gulp');
var del = require('del'); // rm -rf

gulp.task('clean', function(cb) {
    del(['output'], cb);
});

gulp.task('templates', ['clean'], function() {
    var stream = gulp.src(['src/templates/*.hbs'])
        // do some concatenation, minification, etc.
        .pipe(gulp.dest('output/templates/'));
    return stream; // return the stream as the completion hint

});

gulp.task('styles', ['clean'], function() {
    var stream = gulp.src(['src/styles/app.less'])
        // do some hinting, minification, etc.
        .pipe(gulp.dest('output/css/app.css'));
    return stream;
});

gulp.task('build', ['templates', 'styles']);

// templates and styles will be processed in parallel.
// clean will be guaranteed to complete before either start.
// clean will not be run twice, even though it is called as a dependency twice.

gulp.task('default', ['build']);
```
