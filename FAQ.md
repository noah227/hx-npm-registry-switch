## 为什么插件显示的registry列表和用户全局执行 `nrm ls` 所显示的条目数/内容不一样？

* nrm得到的registry列表显示的内容由两部分构成：nrm自带配置 ~~`registries.json`~~ `constants.REGISTRIES` 和 用户全局自定义配置文件 `.nrmrc`
* 由于插件本身自带安装了nrm，和用户全局安装的是独立存在的，所以当二者版本不一样时，加载的列表也就有可能不一样
* 本插件原则上会保持内置较新版本的nrm
