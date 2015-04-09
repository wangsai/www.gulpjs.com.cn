# 从缓存创建流（内存内容）

有时候你需要创建一个内容存储在一个变量而不是物理文件的文件流。换句话说，如果不用`gulp.src()`创建一个`gulp`流。

让我们举个例子，我们有一个目录包含js库文件和另一个目录包含一些模块版本的文件。每次构建都会对每个版本生成一个js文件，包括了所有的库和有联系的模块版本。

通常我们会分隔成下列几个步骤：

* 载入包文件
* 连接包文件内容
* 载入版本文件
* 对于每个版本文件，连接包内容和版本文件内容
* 对于每个版本文件，把结果输出到一个文件中

试想一下这个文件的架构:

```sh
├── libs
│   ├── lib1.js
│   └── lib2.js
└── versions
    ├── version.1.js
    └── version.2.js
```

你将得到:

```sh
└── output
    ├── version.1.complete.js # lib1.js + lib2.js + version.1.js
    └── version.2.complete.js # lib1.js + lib2.js + version.1.js
```

对这个问题的一种简洁而模块化的方法如下：

```js
var gulp = require('gulp');
var runSequence = require('run-sequence');
var source = require('vinyl-source-stream');
var vinylBuffer = require('vinyl-buffer');
var tap = require('gulp-tap');
var concat = require('gulp-concat');
var size = require('gulp-size');
var path = require('path');
var es = require('event-stream');

var memory = {}; // we'll keep our assets in memory

// task of loading the files' contents in memory
gulp.task('load-lib-files', function() {
  // read the lib files from the disk
  return gulp.src('src/libs/*.js')
  // concatenate all lib files into one
  .pipe(concat('libs.concat.js'))
  // tap into the stream to get each file's data
  .pipe(tap(function(file) {
    // save the file contents in memory
    memory[path.basename(file.path)] = file.contents.toString();
  }));
});

gulp.task('load-versions', function() {
  memory.versions = {};
  // read the lib files from the disk
  return gulp.src('src/versions/version.*.js')
  // tap into the stream to get each file's data
  .pipe( tap(function(file) {
    // save the file contents in the assets
    memory.versions[path.basename(file.path)] = file.contents.toString();
  }));
});

gulp.task('write-versions', function() {
  // we store all the different version file names in an array
  var availableVersions = Object.keys(memory.versions);
  // we make an array to store all the stream promises
  var streams = [];

  availableVersions.forEach(function(v) {
    // make a new stream with fake file name
    var stream = source('final.' + v);
    // we load the data from the concatenated libs
    var fileContents = memory['libs.concat.js'] +
      // we add the version's data
      '\n' + memory.versions[v];

    streams.push(stream);

    // write the file contents to the stream
    stream.write(fileContents);

    process.nextTick(function() {
      // in the next process cycle, end the stream
      stream.end();
    });

    stream
    // transform the raw data into the stream, into a vinyl object/file
    .pipe(vinylBuffer())
    //.pipe(tap(function(file) { /* do something with the file contents here */ }))
    .pipe(gulp.dest('output'));
  });

  return es.merge.apply(this, streams);
});

//============================================ our main task
gulp.task('default', function(taskDone) {
  runSequence(
    ['load-lib-files', 'load-versions'],  // load the files in parallel
    'write-versions',  // ready to write once all resources are in memory
    taskDone           // done
  );
});

//============================================ our watcher task
// only watch after having run 'default' once so that all resources
// are already in memory
gulp.task('watch', ['default'], function() {
  gulp.watch('./src/libs/*.js', function() {
    runSequence(
      'load-lib-files',  // we only have to load the changed files
      'write-versions'
    );
  });

  gulp.watch('./src/versions/*.js', function() {
    runSequence(
      'load-versions',  // we only have to load the changed files
      'write-versions'
    );
  });
});
```
