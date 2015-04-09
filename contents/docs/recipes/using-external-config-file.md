# 使用外部的配置文件

这很有好处，因为它使得任务很干净，并且 config.json 可以被其他的任务运行器（例如`grunt`）重复利用。


###### `config.json`

```json
{
  "desktop" : {
    "src" : [
      "dev/desktop/js/**/*.js",
      "!dev/desktop/js/vendor/**"
    ],
    "dest" : "build/desktop/js"
  },
  "mobile" : {
    "src" : [
      "dev/mobile/js/**/*.js",
      "!dev/mobile/js/vendor/**"
    ],
    "dest" : "build/mobile/js"
  }
}
```


###### `gulpfile.js`

```js
// npm install --save-dev gulp gulp-uglify
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var config = require('./config.json');

function doStuff(cfg) {
  return gulp.src(cfg.src)
    .pipe(uglify())
    .pipe(gulp.dest(cfg.dest));
}

gulp.task('dry', function() {
  doStuff(config.desktop);
  doStuff(config.mobile);
});
```
