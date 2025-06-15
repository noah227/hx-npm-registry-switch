const cozip = require("cozip")

const pack = () => {
    cozip(`${require("./package.json").id}.zip`, [
		["./fonts/iconfont.ttf"],
        ["./_.js"],
        ["./_nrm.js"],
        ["./node_modules", true],
        ["./extension.js"], 
        ["./package.json"]
    ])
}

pack()
