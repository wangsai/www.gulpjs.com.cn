# gulp CLI 文档 #

## 命令 ##

gulp只有很少的命令需要了解。其它的命令视任务的需求而决定需不要使用。

`-v`或者`--version` 这个会显示本地和global的gulp的版本

`--require <module path>` 在运行gulp文件前会获取一个组件。这对于transpiler来说是很有用的，当然也还有其它的一些应用。你可以使用多个--require命令。

`--gulpfile <gulpfile path>`将手动设置gulp文件的路径。如果你有多个gulp文件的时候是很有用的。这个将会在gulp文件目录上设置CWD。

`--cwd  <dir path>`手动设置CWD。搜索的gulp文件盒相对的一些需求都来自于这里。

`-T` 或者 `--tasks` 会显示下载的gulp文件的任务树。

`--taks-simple` 纯文本显示已经下载的gulp文件任务列表。

`--color` 强制gulp和gulp插件显示颜色，即使是被检测到没有颜色。

`--no-color` 强制gulp和gulp插件不显示颜色，即使是被检测到有颜色。

`--silent` 停止所有的gulp记录。

CLI添加源于cwd原件的process.env.INIT_CWD。

## 任务 ##

任务可以通过运行 `gulp <task> <othertask>`被执行。只运行`gulp`只会执行你注册过的任务，叫做`default`。如果没有`default`任务，gulp将会报错。

## 编译器 ##

你可以从说明文档中找到所支持的语言列表。如果你想添加一个新的语言，就把请求发送到那儿。
