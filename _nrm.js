const {
    getRegistries,
    getCurrentRegistry,
    readFile,
    writeFile
} = require("nrm/dist/helpers")

const {
    NPMRC
} = require("nrm/dist/constants")


module.exports = {
    getRegistries,
    getCurrentRegistry,
    readFile,
    writeFile,
    NPMRC
}