# gulp API文档 #

## gulp.src(globs[,options]) ##

发出文件匹配提供的glob或者一个glob数组。返回一个可以传输到插件的Vinyl文件流。

	gulp.src('client/templates/*.jade')
	  .pipe(jade())
	  .pipe(minify())
	  .pipe(gulp.dest('build/minified_templates'));

glob指的是 node-glob语法或者可以是一个文件的绝对路径。

### globs ###

类型：string 或者 array

显示glob或者globs数组。

### options ###

类型：object

通过glob-stream传送到node-glob的对象。

gulp除了有node-glob和glob-stream支持的选项之外还额外增加了两个选项：

### options.buffer ###

类型：boolean  
默认值：true

当把这属性设置成false时，返回的file.contents会是一个数据流而不是缓冲文件。当在文件非常大时，这个属性非常有用。**注意：** 插件可能没有实现对数据流的支持。

### options.read ###

类型：boolean 默认值：true

当把这个属性设置成false时，file.contents会返回null并且不能读取文件。

### options.base ###

类型：string 默认值：glob启动前的所有内容（看 glob2base）

例如，看 clien/js/somedir中的somefile.js文件：

	gulp.src('client/js/**/*.js') // Matches 'client/js/somedir/somefile.js' and resolves `base` to `client/js/`
	  .pipe(minify())
	  .pipe(gulp.dest('build'));  // Writes 'build/somedir/somefile.js'
	
	gulp.src('client/js/**/*.js', { base: 'client' })
	  .pipe(minify())
	  .pipe(gulp.dest('build'));  // Writes 'build/js/somedir/somefile.js'

## gulp.dest(path[,options]) ##

可以被传输并且会生成文件。反复发出数据给它，所以你可以传输多个文件夹。不存在的文件夹会被创建。

	gulp.src('./client/templates/*.jade')
	  .pipe(jade())
	  .pipe(gulp.dest('./build/templates'))
	  .pipe(minify())
	  .pipe(gulp.dest('./build/minified_templates'));

书写路径是计算添加文件的相对路径到目标目录。相对路径是在文件的基础路径的基础上计算的。查看以上的gulp.sec获取更多信息。

### path ###

类型：string或者function

所需要生成文件的路径（输出路径）。或者是返回一个function，function会提供一个vinyl文件实例。

### options ###

类型：object

### options.cwd ###

类型：string 默认值：process.cwd()

cwd是输出文件夹，只有提供的输出文件夹是相对的才有效。

### options.mode ###

类型：string 默认值：0777

任何一个文件夹的八进制字符说明mode都需要作为输出文件夹。

## gulp.task(name[,deps],fn) ##

定义一个任务使用Orchestrator。

	gulp.task('somename', function() {
	  // Do stuff
	});

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