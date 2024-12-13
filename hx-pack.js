const cozip = require("cozip")

const pack = () => {
    cozip(`${require("./package.json").id}.zip`, [
		["./fonts", true],
        ["./_.js"],
        ["./node_modules", true],
        ["./extension.js"], 
        ["./package.json"]
    ])
}

pack()
