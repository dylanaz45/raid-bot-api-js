const dex = require("../../data/sprites.json")
const levenshtein = require("./levenshtein")

function search(name) {
    if (name in dex) {
        return name
    }
    if (name === "God") {
        return "Bulbasaur"
    }
    let min = Math.pow(10, 1000)
    let opt = ''
    Object.keys(dex).forEach(key => {
        let dis = levenshtein.getEditDistance(name, key)
        if (dis < min) {
            min = dis
            opt = key
        }
    })
    return opt
}

module.exports.search = search
