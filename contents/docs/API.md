## gulp API 文档

### gulp.src(globs[, options])

Emits files matching provided glob or an array of globs. 
Returns a [stream](http://nodejs.org/api/stream.html) of [Vinyl files](https://github.com/wearefractal/vinyl-fs) 
that can be [piped](http://nodejs.org/api/stream.html#stream_readable_pipe_destination_options) 
to plugins.

```javascript
gulp.src('client/templates/*.jade')
  .pipe(jade())
  .pipe(minify())
  .pipe(gulp.dest('build/minified_templates'));
```

`glob` 可以是 [node-glob 语法](https://github.com/isaacs/node-glob) 或者也可以直接就是一个路径。

#### globs

类型：`String` 或者 `Array`

单个 glob 或者 glob 数组。

#### options

类型：`Object`

通过 [glob-stream] 传送到 [node-glob] 的参数对象。

gulp 除了支持 [node-glob 支持的参数][node-glob documentation] 和 [glob-stream] 支持的参数外，还额外增加了一些参数：

#### options.buffer
类型：`Boolean`
默认值：`true`

当把这属性设置成 `false` 时，返回的 `file.contents` 将是一个数据流而不是缓冲文件。当在文件非常大时，这个属性非常有用。**注意：** 某些插件可能没有实现对数据流的支持。

#### options.read
Type: `Boolean`
Default: `true`

当把这个属性设置成 `false` 时，`file.contents` 返回的将是 null 并且根本不去读取文件。

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

### gulp.dest(path[, options])

可以作为管道（pipe）传输或者写入生成。将传输进来的数据重新发出（emit）出去就可以通过管道（pipe）输出到多个文件夹。不存在的文件夹会被创建。

```javascript
gulp.src('./client/templates/*.jade')
  .pipe(jade())
  .pipe(gulp.dest('./build/templates'))
  .pipe(minify())
  .pipe(gulp.dest('./build/minified_templates'));
```

文件路径是将给定的目标目录和文件相对路径合并后计出的新路径。相对路径是在文件的基础路径的基础上计算得到的。查看上面的 `gulp.src` 以获取更多信息。

#### path
Type: `String` 或者 `Function`

输出文件的目标路径（或目录）。或者是一个 function 返回的路径，function 将接收一个 [vinyl 文件实例](https://github.com/wearefractal/vinyl) 作为参数。

#### options
Type: `Object`

#### options.cwd
Type: `String`
Default: `process.cwd()`

`cwd` 用于计算输出目录的，只有提供的输出目录是相对路径时此参数才有用。

#### options.mode
Type: `String`
Default: `0777`

8进制数字组成的字符串，用于为创建的输出目录指定权限。

### gulp.task(name[, deps], fn)

定义一个使用 [Orchestrator] 的任务。

```js
gulp.task('somename', function() {
  // Do stuff
});
```

### name ###

任务的名字。你想从命令行运行的任务中间不应该存在空格。

### deps ###

类型：array

一个包含了在你的任务运行前即将实行和完成的任务数组。

	gulp.task('mytask', ['array', 'of', 'task', 'names'], function() {
	  // Do stuff
	});

**注意：** 在从属任务完整前，你的任务是否有运行？确认你的从属任务是否正确使用异步，运行提示：接收一个回调函数或者返回一个promise或者事件流。

### fn ###

执行任务运算的功能。一般来说，形式是gulp.src().pipe(someplugin())。

### Async task support ###

如果fn是以下中的一个，那么任务可以被设置成异步的：

#### 接收一个回调函数 ####

	// run a command in a shell
	var exec = require('child_process').exec;
	gulp.task('jekyll', function(cb) {
	  // build Jekyll
	  exec('jekyll build', function(err) {
	    if (err) return cb(err); // return error
	    cb(); // finished task
	  });
	});

#### 返回一个流 ####

	gulp.task('somename', function() {
	  var stream = gulp.src('client/**/*.js')
	    .pipe(minify())
	    .pipe(gulp.dest('build'));
	  return stream;
	});

#### 返回一个promise ####

	var Q = require('q');
	
	gulp.task('somename', function() {
	  var deferred = Q.defer();
	
	  // do async stuff
	  setTimeout(function() {
	    deferred.resolve();
	  }, 1);
	
	  return deferred.promise;
	});

**注意：** 默认情况下，是在最大的并发情况下运行任务的--例如，它在最开始的时候就发起了所有的任务不再等待其它的。如果你想将任务按照一个特定的顺序进行，你需要做两件事情：

1.当任务完成时给它一个提示。

2.给它一个提示告诉它这个任务是依赖于另外一个任务的。

对于这些例子，我们假定你有两个任务，“1”和“2”，你特别想按照以下的顺序执行：

1.在任务“1”中，你添加一个提示在任务完成时告诉它。或者是当完成的时候接收一个回调函数或者一个promise或者事件流，然后引擎将等待分开完成或者结束。

2.任务“2”你添加一个提示告诉引擎，该因素决定于第一个任务的结束时间。

所以这个例子将会是以下所示：

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

## gulp.watch(glob [,opts],tasks) or gulp.watch(glob [,opts,cb]) ##

查看和编辑文件。这个常常会返回一个事件触发器用来发出改变的事件。

## gulp.watch(glob[,opts],tasks) ##

### glob ###

类型：string 或者 array

查看和编辑的单一的glob或者glob数组。

### opts ###

类型：object

选项，传递给gaze

### tascks ###

类型：array

文件改变所需要运行的任务名称，和gulp.tack()一同加载。

	var watcher = gulp.watch('js/**/*.js', ['uglify','reload']);
	watcher.on('change', function(event) {
	  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
	});

## hulp.watch(glob[,opts,cb]) ##

### glob ###

类型：string 或者array

查看和编辑的单一的glob或者glob数组。

### opts ###

类型：object

选项，传递给gaze

### cb(event) ###

类型：function

在每一个变化中会被获取的回调函数。
	
	gulp.watch('js/**/*.js', function(event) {
	  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
	});

一个对象会传递一个回调函数，event描述了改变的内容：

#### event.type ####

类型：string

发生改变的类型，不管是添加，改变或是删除。

#### event.path ####

类型：string

触发事件的文件路径。