# 指定一个新的cwd (当前工作目录)

这对于嵌套的目录结构很有帮助，例如：

```
/project
  /layer1
  /layer2
```

你可以用gulp CLI选项 `--cwd`.

在 `project/` 目录中:

```sh
gulp --cwd layer1
```

如果你只需要对一个特定部分申明cwd，你可以在[glob-stream](https://github.com/wearefractal/glob-stream)上使用`cwd`参数选项:

```js
gulp.src('./some/dir/**/*.js', { cwd: 'public' });
```
