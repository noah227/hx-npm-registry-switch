## 关于nrm

### 配置文件构成/操作

* 读取registries时，其数据由两部分构成：内置列表（registries.json）和用户自定义列表（.nrmrc）
* 经过nrm设置的registry会保存在.npmrc中，方便下次读取
    * .npmrc是一个全局的用户配置文件，见 [v9/npmrc](https://nodejs.cn/npm/cli/v9/configuring-npm/npmrc/)
