## gulp API 文档

<a name="gulp.src"></a>
### gulp.src(globs[, options])

分发（emit）匹配 glob（模式匹配） 或 glob 数组的文件。
返回一个 [Vinyl files](https://github.com/wearefractal/vinyl-fs) 类型的 [stream](http://nodejs.org/api/stream.html)，可以通过 [管道（pipe）](http://nodejs.org/api/stream.html#stream_readable_pipe_destination_options) 传递给插件。

```javascript
gulp.src('client/templates/*.jade')
  .pipe(jade())
  .pipe(minify())
  .pipe(gulp.dest('build/minified_templates'));
```

`glob` 可以是 [node-glob 语法](https://github.com/isaacs/node-glob) 或者也可以直接就是一个路径。

<a name="gulp.src-globs"></a>
#### globs

类型：`String` 或者 `Array`

单个 glob 或者 glob 数组。

<a name="gulp.src-options"></a>
#### options

类型：`Object`

通过 [glob-stream] 传送到 [node-glob] 的参数对象。

gulp 除了支持 [node-glob 支持的参数][node-glob documentation] 和 [glob-stream] 支持的参数外，还额外增加了一些参数：

<a name="gulp.src-options.buffer"></a>
#### options.buffer
类型：`Boolean`
默认值：`true`

当把这属性设置成 `false` 时，返回的 `file.contents` 将是一个数据流而不是缓冲文件。当在文件非常大时，这个属性非常有用。**注意：** 某些插件可能没有实现对数据流的支持。

<a name="gulp.src-options.read"></a>
#### options.read
Type: `Boolean`
Default: `true`

当把这个属性设置成 `false` 时，`file.contents` 返回的将是 null 并且根本不去读取文件。

<a name="gulp.src-options.base"></a>
#### options.base
Type: `String`
默认值：glob 模式匹配串之前的所有内容（见 [glob2base]）

例如，`client/js/somedir` 目录中的 `somefile.js` ：

```js
gulp.src('client/js/**/*.js') // 匹配 'client/js/somedir/somefile.js' ，并且将 `base` 设置为 `client/js/`
  .pipe(minify())
  .pipe(gulp.dest('build'));  // 写入文件 'build/somedir/somefile.js'

gulp.src('client/js/**/*.js', { base: 'client' })
  .pipe(minify())
  .pipe(gulp.dest('build'));  // 写入文件 'build/js/somedir/somefile.js'
```

<a name="gulp.dest"></a>
### gulp.dest(path[, options])

可以作为管道（pipe）传输或者写入生成。将传输进来的数据重新发出（emit）出去就可以通过管道（pipe）输出到多个文件夹。不存在的文件夹会被创建。

```js
gulp.src('./client/templates/*.jade')
  .pipe(jade())
  .pipe(gulp.dest('./build/templates'))
  .pipe(minify())
  .pipe(gulp.dest('./build/minified_templates'));
```

文件路径是将给定的目标目录和文件相对路径合并后计出的新路径。相对路径是在文件的基础路径的基础上计算得到的。查看上面的 `gulp.src` 以获取更多信息。

<a name="gulp.dest-path"></a>
#### path
类型：`String` 或者 `Function`

输出文件的目标路径（或目录）。或者是一个 function 返回的路径，function 将接收一个 [vinyl 文件实例](https://github.com/wearefractal/vinyl) 作为参数。

<a name="gulp.dest-options"></a>
#### options
Type: `Object`

<a name="gulp.dest-options.cwd"></a>
#### options.cwd
Type: `String`
Default: `process.cwd()`

`cwd` 用于计算输出目录的，只有提供的输出目录是相对路径时此参数才有用。

<a name="gulp.dest-options.mode"></a>
#### options.mode
Type: `String`
Default: `0777`

8进制数字组成的字符串，用于为创建的输出目录指定权限。

<a name="gulp.task"></a>
### gulp.task(name[, deps], fn)

定义一个使用 [Orchestrator] 的任务。

```js
gulp.task('somename', function() {
  // Do stuff
});
```

<a name="gulp.task-name"></a>
#### name

任务的名字。从命令行运行任务时，任务名的中间不能存在空格。

<a name="gulp.task-deps"></a>
#### deps
类型：`Array`

此数组中列出的所有从属任务将在你的任务执行前执行并执行完毕。

```js
gulp.task('mytask', ['array', 'of', 'task', 'names'], function() {
  // Do stuff
});
```

**注意：** 在从属任务完整前，你的任务是否提前执行完毕了？请确保你所依赖的任务是否正确的实现了异步：接收一个回调函数或者返回一个 promise 对象或者事件流（event stream）。

<a name="gulp.task-fn"></a>
#### fn

此函数用于执行任务。一般形式是 `gulp.src().pipe(someplugin())`。

#### 对异步任务的支持

如果 `fn` 函数是以下形式中的一种，那么此任务可以被设置成异步的：

##### 接收一个回调函数

```js
// run a command in a shell
var exec = require('child_process').exec;
gulp.task('jekyll', function(cb) {
  // build Jekyll
  exec('jekyll build', function(err) {
    if (err) return cb(err); // return error
    cb(); // finished task
  });
});
```

##### 返回一个数据流（stream）

```js
gulp.task('somename', function() {
  var stream = gulp.src('client/**/*.js')
    .pipe(minify())
    .pipe(gulp.dest('build'));
  return stream;
});
```

##### 返回一个 promise 对象

```js
var Q = require('q');

gulp.task('somename', function() {
  var deferred = Q.defer();

  // do async stuff
  setTimeout(function() {
    deferred.resolve();
  }, 1);

  return deferred.promise;
});
```

**注意：** 默认情况下，任务将被最大限度的并发执行 -- 例如，所有任务同时被启动执行并且不做任何等待。如果你想让任务按照一个特定的顺序执行，你需要做以下两件事：

- 当任务完成时给 gulp 一个提示。
- 给 gulp 一个提示告诉 gulp 这个任务是依赖于另外一个任务的。

举个例子，我们假定你有两个任务，"one" 和 "two"，你希望他们按照以下的顺序执行：

1. 在任务 "one" 中添加一个提示告诉 gulp 此任务何时完成。可以选择接收一个回调函数并在任务执行完毕后调用此回调函数；也可以返回一个 promise 对象或者一个数据流（stream），然后由 gulp 等待 promise 被处理（resolve）或者数据流（stream）结束。

2. 为任务 "two" 添加一个提示，告诉 gulp 该任务须在第一个任务执行完毕后才能执行。

上述实例实现代码如下：

```js
var gulp = require('gulp');

// takes in a callback so the engine knows when it'll be done
gulp.task('one', function(cb) {
    // do stuff -- async or otherwise
    cb(err); // if err is not null and not undefined, the run will stop, and note that it failed
});

// identifies a dependent task must be complete before this one begins
gulp.task('two', ['one'], function() {
    // task 'one' is done now
});

gulp.task('default', ['one', 'two']);
```

<a name="gulp.watch-or-gulp.watch"></a>
### gulp.watch(glob [, opts], tasks) 或者 gulp.watch(glob [, opts, cb])

如果被监视的文件发生了改变就执行某些动作。此方法永远返回一个可以发出 `change` 事件的 EventEmitter 对象。

<a name="gulp.watch1"></a>
### gulp.watch(glob[, opts], tasks)

<a name="gulp.watch1-glob"></a>
#### glob
类型：`String` 或 `Array`

单个 glob 或 一组 glob，用于匹配需要监视的文件。

<a name="gulp.watch1-opts"></a>
#### opts
类型：`Object`

此参数将被传递给 [`gaze`](https://github.com/shama/gaze)。

<a name="gulp.watch1-tasks"></a>
#### tasks
类型：`Array`

当文件改变时所需要运行的任务的名称（可以是多个任务），通过 `gulp.task()` 添加。

```js
var watcher = gulp.watch('js/**/*.js', ['uglify','reload']);
watcher.on('change', function(event) {
  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
});
```

<a name="gulp.watch2"></a>
### gulp.watch(glob[, opts, cb])

<a name="gulp.watch2-glob"></a>
#### glob
类型：`String` 或 `Array`

单个 glob 或 一组 glob，用于匹配需要监视的文件。

<a name="gulp.watch2-opts"></a>
#### opts
类型：`Object`

此参数将被传递给 [`gaze`](https://github.com/shama/gaze)。

<a name="gulp.watch2-cb"></a>
#### cb(event)
类型：`Function`

当文件每次变化时都会调用此回调函数。
	
```js
gulp.watch('js/**/*.js', function(event) {
  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
});
```

此回调函数接收一个对象类型的参数 -- `event`，它包含了此次文件改变所对应的信息：

<a name="gulp.watch2-cb-event.type"></a>
##### event.type
类型：string

已经发生的改变所对应的类型，可以是 `added`、`changed` 或 `deleted`。

<a name="gulp.watch2-cb-event.path"></a>
##### event.path
类型：`String`

此路径指向触发事件的文件。


[node-glob documentation](https://github.com/isaacs/node-glob#options)  
[node-glob](https://github.com/isaacs/node-glob)  
[glob-stream](https://github.com/wearefractal/glob-stream)  
[gulp-if](https://github.com/robrich/gulp-if)  
[Orchestrator](https://github.com/robrich/orchestrator)  
[glob2base](https://github.com/wearefractal/glob2base)  
