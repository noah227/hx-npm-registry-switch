var hx = require("hbuilderx");
//该方法将在插件激活的时候调用
function activate(context) {
    require("./_.js").init(context)
}
//该方法将在插件禁用的时候调用（目前是在插件卸载的时候触发）
function deactivate() {

}
module.exports = {
    activate,
    deactivate
}