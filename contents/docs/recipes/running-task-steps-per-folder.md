# 每个目录生成一个文件

如果你有一系列目录，想要在每个目录上运行一系列任务，例如...

```
/scripts
/scripts/jquery/*.js
/scripts/angularjs/*.js
```

...想要通过以下命令结束...

```
/scripts
/scripts/jquery.min.js
/scripts/angularjs.min.js
```

...你需要做一些类似下列事情...

``` javascript
var fs = require('fs');
var path = require('path');
var merge = require('merge-stream');
var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

var scriptsPath = 'src/scripts';

function getFolders(dir) {
    return fs.readdirSync(dir)
      .filter(function(file) {
        return fs.statSync(path.join(dir, file)).isDirectory();
      });
}

gulp.task('scripts', function() {
   var folders = getFolders(scriptsPath);

   var tasks = folders.map(function(folder) {
      // concat into foldername.js
      // write to output
      // minify
      // rename to folder.min.js
      // write to output again
      return gulp.src(path.join(scriptsPath, folder, '/*.js'))
        .pipe(concat(folder + '.js'))
        .pipe(gulp.dest(scriptsPath))
        .pipe(uglify())
        .pipe(rename(folder + '.min.js'))
        .pipe(gulp.dest(scriptsPath));
   });

   return merge(tasks);
});
```

一些提示：

- `folders.map` - 每个目录执行一次函数，返回异步的流
- `es.concat` - 合并流并且只在所有流结束时完成
