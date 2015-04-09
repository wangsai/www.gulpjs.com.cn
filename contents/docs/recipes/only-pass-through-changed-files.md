# 只允许发生改变的文件通过

默认的文件在每次运行的时候再整个管道链上通过。使用[gulp-changed](https://github.com/sindresorhus/gulp-changed)，只有发生改变的文件能通过。相当意义上这能加速连续运行过程。


```js
// npm install --save-dev gulp gulp-changed gulp-jscs gulp-uglify

var gulp = require('gulp');
var changed = require('gulp-changed');
var jscs = require('gulp-jscs');
var uglify = require('gulp-uglify');

// we define some constants here so they can be reused
var SRC = 'src/*.js';
var DEST = 'dist';

gulp.task('default', function() {
	return gulp.src(SRC)
		// the `changed` task needs to know the destination directory
		// upfront to be able to figure out which files changed
		.pipe(changed(DEST))
		// only files that has changed will pass through here
		.pipe(jscs())
		.pipe(uglify())
		.pipe(gulp.dest(DEST));
});
```
