const dex = require("../../data/sprites.json")
const den_poke = require("../../data/den_poke.json")
const stats_poke = require("../../data/stats_poke.json")
const levenshtein = require("./levenshtein")

function search(name, num) {
    let db;
    if (num === 1) {
        db = dex
    } else if (num === 2) {
        db = den_poke
    } else {
        db = stats_poke
    }
    if (name in db) {
        return name
    }
    if (name === "God") {
        return "Bulbasaur"
    }
    let min = Math.pow(10, 1000)
    let opt = ''
    Object.keys(db).forEach(key => {
        let dis = levenshtein.getEditDistance(name, key)
        if (dis < min) {
            min = dis
            opt = key
        }
    })
    return opt
}

module.exports.search = search
