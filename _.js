const _nrm = require("./_nrm")
const hx = require("hbuilderx")
const fs = require("fs")
const {
    execSync
} = require("child_process")

async function getRegistryName() {
    // 这是一个网络地址（实际的源）
    let registry = await _nrm.getCurrentRegistry()
    // 如果.npmrc不存在，那么nrm获取registry返回为空
    // 此时，尝试以传统模式获取npm配置的源
    if (!registry) {
        console.log("没有获取到registry，尝试以传统配置模式获取")
        registry = getRegistryNameClassic()
        if (registry) console.log(`传统配置模式获取成功：${registry}`)
    }
    /**
     * @type {{[p: string]: {home?: string, registry: string}}}
     * @example
     * {npm: {home: "", registry: ""}, ...}
     */
    const registries = await _nrm.getRegistries()
    const registryMatch = Object.entries(registries).find(([k, data]) => {
        return data.registry === registry
    })
    return registryMatch ? registryMatch[0] : null
}

// 传统方式获取注册源
function getRegistryNameClassic() {
    const registry = execSync("npm config --global get registry").toString("utf8")
    return registry.replace(/\n$/, "")
}

const SHOW_COMMAND = "ny.show-nrm"
module.exports = {
    barItem: null,
    async initBarItem(text, priority = 0) {
        text = text || await getRegistryName()
        const barItem = hx.window.createStatusBarItem(
            hx.StatusBarAlignment.Right, priority
        )
        barItem.text = "$(npm):" + text
        barItem.command = SHOW_COMMAND
        barItem.hide()
        barItem.show()
        // console.log(Object.keys(barItem))
        this.barItem = barItem
        return barItem
    },
    async updateBarItem(registry) {
        this.barItem.text = "$(npm):" + (registry || await getRegistryName())
    },
    async updateRegistries(registries, registry) {
        const npmrc = await _nrm.readFile(_nrm.NPMRC)
        await _nrm.writeFile(_nrm.NPMRC, Object.assign(npmrc, registries[registry]))
    },
    async registerCommand(context) {
        context.subscriptions.push(
            hx.commands.registerCommand(SHOW_COMMAND, async () => {
                if (!this.barItem) await this.initBarItem()
                // console.log("EXECUTE")
                const registries = await _nrm.getRegistries()
                // 怎么调用内置的contextmenu创建，我母鸡啊
                hx.window.showQuickPick(Object.keys(registries).map(k => ({
                    label: k,
                    description: registries[k].registry
                }))).then(data => {
                    const {
                        label: registry
                    } = data
                    // console.log("选择了：", registry)
                    this.updateRegistries(registries, registry)
                    this.updateBarItem(registry)
                })
            })
        )
    },
    /**
     * 监听外部变动同步（仅nrm全局模式）
     */
    startWatch() {
        fs.watchFile(_nrm.NPMRC, async (curr, prev) => {
            // 实际从npm配置取的
            const registry = await getRegistryName()
            if (registry !== this.barItem.text) this.updateBarItem()
        })
    },
    /**
     * 随着主进程销毁而销毁？
     */
    releaseWatch() {

    },
    async init(context) {
        // console.log(await getRegistryName())
        await this.initBarItem()
        await this.registerCommand(context)
        this.startWatch()
    }
}