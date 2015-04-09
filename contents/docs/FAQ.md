# 常见问题

## 为什么选择gulp？ 为什么不是 ____？

看【gulp介绍幻灯片】了解gulp概要。

## 是"gulp"还是"Gulp"?

gulp总是小写的。唯一例外是gulp的logo中gulp是大写的。

## 我能在哪里找到gulp插件列表?

gulp插件总是包含 `gulpplugin` 关键字. [搜索gulp插件][search-gulp-plugins] 或 [查看所有插件][npm plugin search]。

## 我想编写一个gulp插件，从哪开始?

查看 [编写gulp插件]wiki页面上的指南和例子来开始。

## 我插件的功能是 ____， 它是否过头了?

显然。问一下自己:

1. 我的插件是不是做了一些其他插件已经做的事情?
  - 如果是, 这一部分的功能应该被单独做成一个插件。 [查看是否它已经在npm中][npm plugin search]。
1. 如果我的插件做了两件事, 完全不同的事情基于一个配置选项?
  - 如果是, 把它们分成两个独立的插件也许更好。
  - 如果两个任务是不同的，但是相关度很高，这也是ok的。

## 如果在插件的输出结果中表示换行?

总是使用`\n`来防止操作系统之间的差异。

## 我在哪里能获取到gulp最新资讯?

gulp的最新资讯可以在以下的twitter中找到:

- [@wearefractal](https://twitter.com/wearefractal)
- [@eschoff](https://twitter.com/eschoff)
- [@gulpjs](https://twitter.com/gulpjs)

## gulp是否有IRC频道?

有, 在[Freenode]上用#gulpjs交流。

[编写gulp插件]: /docs/writing-a-plugin/README.md
[gulp介绍幻灯片]: http://slid.es/contra/gulp
[Freenode]: http://freenode.net/
[search-gulp-plugins]: http://gulpjs.com/plugins/
[npm plugin search]: https://npmjs.org/browse/keyword/gulpplugin
