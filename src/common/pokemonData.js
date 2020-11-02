const abilities = require("../../data/abilities");
const items = require("../../data/items");
const moves = require("../../data/moves");
const dex = require("../../data/pokedex");

function getData(name) {
    if (name in abilities.BattleAbilities) {
        let ability = abilities.BattleAbilities[name]
        return {
            dataType: "ability",
            name: ability.name,
            desc: typeof ability.desc == 'undefined' ? ability.shortDesc : ability.desc,
            rating: ability.rating
        }
    } else if (name in items.BattleItems) {
        let item = items.BattleItems[name]
        return {
            dataType: "item",
            name: item.name,
            desc: item.desc
        }
    } else if (name in moves.BattleMovedex) {
        let move = moves.BattleMovedex[name]
        return {
            dataType: "move",
            name: move.name,
            shortDesc: move.shortDesc,
            category: move.category,
            power: move.basePower,
            accuracy: move.accuracy,
            type: move.type,
            priority: move.priority,
            desc: move.desc !== 'undefined' ? move.desc : undefined
        }
    } else if (name in dex.BattlePokedex) {
        let poke = dex.BattlePokedex[name]
        return {
            dataType: "pokemon",
            num: poke.num,
            species: poke.species,
            types: poke.types,
            stats: poke.baseStats,
            abilities: poke.abilities,
            otherForms: poke.otherFormes !== 'undefined' ? poke.otherFormes : undefined
        }
    } else {
        return undefined
    }
}

module.exports.getData = getData
