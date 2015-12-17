# 编写一个插件

如果你计划常见一个自己的Gulp插件，你需要花时间去阅读完整的说明文档。

* [指南](guidelines.md) (必读)
* [使用缓存](using-buffers.md)
* [处理数据流](dealing-with-streams.md)
* [测试](testing.md)

## 插件是做什么的

### 文件对象流

一个gulp插件在[对象模块](http://nodejs.org/api/stream.html#stream_object_mode)中返回一个数据流进行如下操作:

1. 获取[vinyl文件对象](http://github.com/wearefractal/vinyl)
2. 输出[vinyl文件对象](http://github.com/wearefractal/vinyl)

这些被称为传输流[传输流](http://nodejs.org/api/stream.html#stream_class_stream_transform_1) (又被称作through streams). 传输流是可读可写的并且操作对象是可以通过的。

### 修改文件内容

Vinyl文件对于文件属性可能有三种:

- [数据流](dealing-with-streams.md)
- [缓存](using-buffers.md)
- 空 (什么都没有) - 对于像rimraf，clean或者哪儿不需要内容这一类的是很管用的。

## 有用的资源

* [File object](https://github.com/wearefractal/gulp-util/#new-fileobj)
* [PluginError](https://github.com/gulpjs/gulp-util#new-pluginerrorpluginname-message-options)
* [event-stream](https://github.com/dominictarr/event-stream)
* [BufferStream](https://github.com/nfroidure/BufferStream)
* [gulp-util](https://github.com/wearefractal/gulp-util)


## 插件实例

* [sindresorhus' gulp plugins](https://github.com/search?q=%40sindresorhus+gulp-)
* [Fractal's gulp plugins](https://github.com/search?q=%40wearefractal+gulp-)
* [gulp-replace](https://github.com/lazd/gulp-replace)


## 关于数据流

如果你对数据流不太熟悉，那么你可以熟读以下文章:

* https://github.com/substack/stream-handbook (必读)
* http://nodejs.org/api/stream.html

其它库不通过数据流对文件进行操作，但是可以在npm上作为[gulpfriendly](https://npmjs.org/browse/keyword/gulpfriendly)的附加物一起使用。
