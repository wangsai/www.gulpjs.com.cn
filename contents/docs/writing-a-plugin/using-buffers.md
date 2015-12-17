# 使用缓存

> 这里是一些关于创建使用缓存的gulp插件的信息。

[编写插件](README.md) > 使用缓存

## 使用缓存
如果你的插件依赖基于缓存的库，你会选择基于file.contents做为缓存编写插件。让我们实现一个把一些文本插入到文件头部的插件：

	var through = require('through2');
	var gutil = require('gulp-util');
	var PluginError = gutil.PluginError;
	
	// consts
	const PLUGIN_NAME = 'gulp-prefixer';
	
	// plugin level function (dealing with files)
	function gulpPrefixer(prefixText) {
	  if (!prefixText) {
	    throw new PluginError(PLUGIN_NAME, 'Missing prefix text!');
	  }
	
	  prefixText = new Buffer(prefixText); // allocate ahead of time
	
	  // creating a stream through which each file will pass
	  var stream = through.obj(function(file, enc, cb) {
	    if (file.isStream()) {
	      this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
	      return cb();
	    }
	
	    if (file.isBuffer()) {
	      file.contents = Buffer.concat([prefixText, file.contents]);
	    }
	
	    // make sure the file goes through the next gulp plugin
	    this.push(file);
	
	    // tell the stream engine that we are done with this file
	    cb();
	  });
	
	  // returning the file stream
	  return stream;
	};
	
	// exporting the plugin main function
	module.exports = gulpPrefixer;


The above plugin can be used like this:


	var gulp = require('gulp');
	var gulpPrefixer = require('gulp-prefixer');
	
	gulp.src('files/**/*.js')
	  .pipe(gulpPrefixer('prepended string'))
	  .pipe(gulp.dest('modified-files'));


## 流处理

Unfortunately, the above plugin will error when using gulp.src in non-buffered (streaming) mode. You should support streams too if possible. See [Dealing with streams](dealing-with-streams.md) for more information.
不幸的是，上述插件在无缓存（流）模式下使用gulp.src时会出错。如果可能的话你应该同时支持流。

## 一些基于缓存的插件

* [gulp-coffee](https://github.com/wearefractal/gulp-coffee)
* [gulp-svgmin](https://github.com/ben-eb/gulp-svgmin)
* [gulp-marked](https://github.com/lmtm/gulp-marked)
* [gulp-svg2ttf](https://github.com/nfroidure/gulp-svg2ttf)
