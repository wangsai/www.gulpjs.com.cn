# 指南

> 虽然指南只是仅供参考的，但是我们 **强烈**要求每个人都得遵照。没有人想用一个差劲的插件。这些指南给你的插件在gulp内运行提供了保障。

[编写一个插件](README.md) > 指南

1. 你的插件不应该是完成一些node模块就能轻松完成的一些事情。
  - 例如: 删除一个gulp插件中不需要的文件. 使用一个像[del](https://github.com/sindresorhus/del)的模块代替一个任务.
  - 包装一切可能包装的东西只会给系统带来污染，同样的低质量的插件对于gulp范式来说是没有任何意义的。
  - gulp插件是基于文件运作的！如果你发现你自己将一整个进程硬塞进数据流中，那么还是使用一个node模块代替吧。
  - 一个好的gulp插件就好比是gulp咖啡。咖啡脚本是在盒外的，并且不使用Vinyl运作的，所以我们通过给它添加功能和抽象来避免痛点，这样可以使其更好的在gulp中运作。
1. 你的插件只需要做 **一件事**,并且做好它。
  - 避免配置选项并且使你的插件能完成不同的任务。
  - 例如：一个JS的压缩插件不需要选项，只需要添加一个头部就行了。
1. 你的插件不需要做别的插件已经负责了的事情。
  - 不需要合并, [gulp-concat](https://github.com/wearefractal/gulp-concat) 可以做到。
  - 不需要添加头部, [gulp-header](https://github.com/godaddy/gulp-header) 可以做到。
  - 不需要添加尾部, [gulp-footer](https://github.com/godaddy/gulp-footer) 可以做到。
  - 如果你的插件作为一个公共的但是可选的使用案例，文档常常被其它插件调用。
  - 在你的插件中调用其它的插件！这样将会减少你的代码量，并且能够确保一个稳定的系统。
1. 你的插件 **必须测试**
  - 测试一个gulp插件非常容易，你甚至都不需要gulp去测试它。
  - 看看其它的插件作为案例。
1. 将`gulpplugin`作为一个关键词添加到`package.json`中，这样可以在我们的搜索中显示你的插件。
1. 不要在一个数据流中剔除错误
  - 反而，你需要将错误作为一个错误事件。
  - 如果你在数据流之外碰到了一个错误，例如在创建数据流时碰到了无效配置，那么你可以剔除它。
1. 在每一个错误前边加上你的插件名。
  - 例如: `gulp-replace: 不能使用正则表达式代替数据流`
  - 使用 gulp-util's [PluginError](https://github.com/gulpjs/gulp-util#new-pluginerrorpluginname-message-options) 类可以让这项工作更加轻松。
1. `file.contents` 输出的类型需要和获取的类型保持一致。
  - 如果file.contents是null（不可读），那么忽略这个文件直接通过就行了。
  - 如果file.contents一个你不支持的数据流，那么将它作为错误发布。
    - 不要缓存一个数据流硬塞进你的插件中去与其它数据流一起工作。这样会导致很可怕的事情发生。
1.  在你完成前，不要通过`file`对象下游。
1. 当你在一个文件上克隆一个文件或者创建一个新文件时，使用[`file.clone()`](https://github.com/wearefractal/vinyl#clone) 。
1. 使用我们[recommended modules page](recommended-modules.md)中的模块，让你更加轻松。
1. 在你的插件中不要将gulp作为一个dependency或者peerDependency。
  - 使用gulp去测试或者自动化你的插件的工作流程是非常酷的，这仅仅只能保证你的插件是作为一个devDependency。
  - 将gulp作为你插件的dependency意味着不管是谁安装你的插件都需要安装一个新的gulp，这是个完整的dependency树。
  - 在你实际的插件代码中没有任何理由需要你使用gulp。如果你觉得你这么做会导致问题，那么我们帮你解决。

## 为什么这些指南这么苛刻?

gulo旨在让用户得到更简易的体验。为了避免苛刻的指南，我们尽量给大家提供一个一致的并且高质量的系统。虽然这样给插件的开发者带来一些额外的工作量和想法，但是在以后的道路上避免了很多麻烦。

### What happens if I don't follow them?

npm是对每一个人都开放的，所以你们可以做任何你们想做的事情，但是这些指南是作为一个规范。后边将会在插件搜索中加入接受测试。如果你的插件不符合插件指南，那么将会被发布到一个可见的/可分类的打分系统上。人们都希望使用的插件能符合gulp原则。

### 一个好的插件是什么样的?

	// through2 is a thin wrapper around node transform streams
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
	    if (file.isNull()) {
	       // do nothing if no contents
	    }
	
	    if (file.isBuffer()) {
	        file.contents = Buffer.concat([prefixText, file.contents]);
	    }
	
	    if (file.isStream()) {
	        file.contents = file.contents.pipe(prefixStream(prefixText));
	    }
	
	    this.push(file);
	
	    return cb();
	  });
	
	  // returning the file stream
	  return stream;
	};
	
	// exporting the plugin main function
	module.exports = gulpPrefixer;
