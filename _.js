const {
	getRegistries,
	getCurrentRegistry,
	readFile,
	writeFile
} = require("nrm/helpers")
const {NPMRC} = require("nrm/constants")
const hx = require("hbuilderx")
const fs = require("fs")

async function getRegistryName() {
	const registry = await getCurrentRegistry()
	const registries = await getRegistries()
	const registryMatch = Object.entries(registries).find(([k, data]) => {
		return data.registry === registry
	})
	return registryMatch ? registryMatch[0] : null
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
		console.log(Object.keys(barItem))
		this.barItem = barItem
		return barItem
	},
	async updateBarItem(registry) {
		this.barItem.text = "$(npm):" + (registry || await getRegistryName())
	},
	async updateRegistries(registries, registry){
		const npmrc = await readFile(NPMRC)
		await writeFile(NPMRC, Object.assign(npmrc, registries[registry]))
	},
	async registerCommand(context) {
		context.subscriptions.push(
			hx.commands.registerCommand(SHOW_COMMAND, async () => {
				if (!this.barItem) await this.initBarItem()
				console.log("EXECUTE")
				const registries = await getRegistries()
				// 怎么调用内置的contextmenu创建，我母鸡啊
				hx.window.showQuickPick(Object.keys(registries).map(k => ({
					label: k,
					description: registries[k].registry
				}))).then(data => {
					const {label: registry} = data
					console.log("选择了：", registry)
					this.updateRegistries(registries, registry)
					this.updateBarItem(registry)
				})
			})
		)
	},
	/**
	 * 监听外部变动同步（仅nrm全局模式）
	 */
	startWatch(){
		fs.watchFile(NPMRC, async (curr, prev) => {
			// 实际从npm配置取的
			const registry = await getRegistryName()
			if(registry !== this.barItem.text) this.updateBarItem()
		})
	},
	/**
	 * 随着主进程销毁而销毁？
	 */
	releaseWatch(){
		
	},
	async init(context) {
		console.log(await getRegistryName())
		await this.initBarItem()
		await this.registerCommand(context)
		this.startWatch()
	}
}