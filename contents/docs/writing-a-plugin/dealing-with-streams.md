# 流处理

> 强烈推荐些插件时支持流。这里有一些关于创建支持流的gulp插件的信息。

> Make sure to follow the best practice regarding error handling and add the line that make the gulp plugin re-emit the first error catched during the transformation of the content
> 确保遵循关于错误处理的最佳实践

[写插件](README.md) > 写基于流的插件

## 流处理

让我们实现一个把一些文本插入到文件头部的插件。这个插件支持所有可能形式的file.contents。

	var through = require('through2');
	var gutil = require('gulp-util');
	var PluginError = gutil.PluginError;
	
	// consts
	const PLUGIN_NAME = 'gulp-prefixer';
	
	function prefixStream(prefixText) {
	  var stream = through();
	  stream.write(prefixText);
	  return stream;
	}
	
	// plugin level function (dealing with files)
	function gulpPrefixer(prefixText) {
	  if (!prefixText) {
	    throw new PluginError(PLUGIN_NAME, 'Missing prefix text!');
	  }
	
	  prefixText = new Buffer(prefixText); // allocate ahead of time
	
	  // creating a stream through which each file will pass
	  var stream = through.obj(function(file, enc, cb) {
	    if (file.isBuffer()) {
	      this.emit('error', new PluginError(PLUGIN_NAME, 'Buffers not supported!'));
	      return cb();
	    }
	
	    if (file.isStream()) {
	      // define the streamer that will transform the content
	      var streamer = prefixStream(prefixText);
	      // catch errors from the streamer and emit a gulp plugin error
	      streamer.on('error', this.emit.bind(this, 'error'));
	      // start the transformation
	      file.contents = file.contents.pipe(streamer);
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


上面的插件使用方法如下：
	
	
	var gulp = require('gulp');
	var gulpPrefixer = require('gulp-prefixer');
	
	gulp.src('files/**/*.js', { buffer: false })
	  .pipe(gulpPrefixer('prepended string'))
	  .pipe(gulp.dest('modified-files'));


## 一些使用流的插件

* [gulp-svgicons2svgfont](https://github.com/nfroidure/gulp-svgiconstosvgfont)

