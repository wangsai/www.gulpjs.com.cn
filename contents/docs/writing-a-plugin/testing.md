# 测试

> 插件测试是保证质量的唯一方法。这让你的用户充满信心并让你的生活更美好。

[编写插件](/docs/writing-a-plugin/README.md) > 测试


## 工具

大多数插件使用 [mocha](https://github.com/visionmedia/mocha),[should](https://github.com/visionmedia/should.js) 和 [event-stream](https://github.com/dominictarr/event-stream) 来帮助他们测试。下列的例子会使用这些工具。


## 测试流模式下的插件

	var assert = require('assert');
	var es = require('event-stream');
	var File = require('vinyl');
	var prefixer = require('../');
	
	describe('gulp-prefixer', function() {
	  describe('in streaming mode', function() {
	
	    it('should prepend text', function(done) {
	
	      // create the fake file
	      var fakeFile = new File({
	        contents: es.readArray(['stream', 'with', 'those', 'contents'])
	      });
	
	      // Create a prefixer plugin stream
	      var myPrefixer = prefixer('prependthis');
	
	      // write the fake file to it
	      myPrefixer.write(fakeFile);
	
	      // wait for the file to come back out
	      myPrefixer.once('data', function(file) {
	        // make sure it came out the same way it went in
	        assert(file.isStream());
	
	        // buffer the contents to make sure it got prepended to
	        file.contents.pipe(es.wait(function(err, data) {
	          // check the contents
	          assert.equal(data, 'prependthisstreamwiththosecontents');
	          done();
	        }));
	      });
	
	    });
	
	  });
	});



## 测试缓冲模式下的插件

	var assert = require('assert');
	var es = require('event-stream');
	var File = require('vinyl');
	var prefixer = require('../');
	
	describe('gulp-prefixer', function() {
	  describe('in buffer mode', function() {
	
	    it('should prepend text', function(done) {
	
	      // create the fake file
	      var fakeFile = new File({
	        contents: new Buffer('abufferwiththiscontent')
	      });
	
	      // Create a prefixer plugin stream
	      var myPrefixer = prefixer('prependthis');
	
	      // write the fake file to it
	      myPrefixer.write(fakeFile);
	
	      // wait for the file to come back out
	      myPrefixer.once('data', function(file) {
	        // make sure it came out the same way it went in
	        assert(file.isBuffer());
	
	        // check the contents
	        assert.equal(file.contents.toString('utf8'), 'prependthisabufferwiththiscontent');
	        done();
	      });
	
	    });
	
	  });
	});

 
## 通过高质量测试的一些插件

* [gulp-cat](https://github.com/ben-eb/gulp-cat/blob/master/test.js)
* [gulp-concat](https://github.com/wearefractal/gulp-concat/blob/master/test/main.js)
