const { promisify } = require("util")
const client = require("redis").createClient(process.env.REDIS_URL);
const getAsync = promisify(client.get).bind(client);
const dex = require("../common/pokemonSearch")

Object.size = function(obj) {
    let size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

class PokemonDAO {
    static async getDenInfo(db, denNum) {
        let res = await getAsync(denNum);
        if (res) {
            return JSON.parse(res)
        }

        let document = await db.collection("den_info").findOne({
            den: denNum
        })
        if (!document) {
            return null
        } else {
            let ret = {
                "den": denNum,
                "ability": document.ability
            }
            await client.set(denNum, JSON.stringify(ret), "EX", 60 * 20)
            return ret
        }
    }

    static async getPokemonInfo(db, name) {
        let res = await getAsync(name + "-den");
        if (res) {
            return JSON.parse(res)
        }

        let document = await db.collection("den_poke").findOne({
            name: name
        })
        if (!document) {
            return null
        } else {
            let ret = {
                "name": document.name,
                "id": document.id,
                "swsh": document.swsh,
                "sword": document.sword,
                "shield": document.shield
            }
            await client.set(name + "-den", JSON.stringify(ret), "EX", 60 * 20)
            return ret
        }
    }

    static async getSprite(db, name) {
        let res = await getAsync(name + "-sprite");
        if (res) {
            return JSON.parse(res)
        }

        name = dex.search(name)
        let document = await db.collection("catch").findOne({
            name: name
        })
        if (!document) {
            return null
        } else {
            let ret = {
                id: document.id
            }
            await client.set(name + "-sprite", JSON.stringify(ret), "EX", 60 * 20)
            return ret
        }
    }

    static async getRandomSet(db, userInput) {
        let pipeline = [
            {'$sample': {'size': 1} },
            {'$project': {'_id': 0} }
        ]

        let set = await db.collection("gen" + userInput.gen + userInput.tier).aggregate(pipeline).toArray();
        return set[0]
    }

    static async getSetByName(db, userInput) {
        let res = await getAsync(userInput.name + "-sets" + userInput.gen + userInput.tier)
        if (res) {
            res = JSON.parse(res)
            if (userInput.all) {
                return res
            }
            let keys = Object.keys(res)
            return res[keys[keys.length * Math.random() << 0]]
        }

        let pipeline = [
            {'$match': {'name': userInput.name} },
            {'$project': {'_id': 0} }
        ]

        let sets = await db.collection("gen" + userInput.gen + userInput.tier).aggregate(pipeline).toArray();
        if (sets.length > 0) {
            let ret = {}
            sets.forEach((item, index) => {
                ret[index + 1] = item;
            })

            await client.set(userInput.name + '-sets' + userInput.gen + userInput.tier, JSON.stringify(ret), "EX", 60 * 60)
            if (userInput.all) {
                return ret
            }
            let keys = Object.keys(ret)
            return ret[keys[keys.length * Math.random() << 0]]
        } else {
            return null
        }
    }

    static async insertSets(db, sets) {
        await db.collection("gen8").insertMany(sets)
        for (const item of sets) {
            let res = await getAsync(item['name'] + '-sets8')
            if (res) {
                res = JSON.parse(res)
                res[Object.size(res) + 1 ] = item

                await client.set(item['name'] + '-sets8', JSON.stringify(res), "EX", 60 * 60)
            }
        }
        return sets.length
    }

    static async searchSets(db, userInput) {

    }

    static async getRandomTeam(db, userInput) {
        let pokes = [];
        let items = [];
        let sets = [];

        let sample = [
            {'$sample': {'size': 1}},
            {'$project': {'_id': 0}}
        ]
        let pipeline = [
            {'$match': {
                '$and': [
                    {'name': {'$nin': pokes}},
                    {'item': {'$nin': items}}
                ]}
            },
            {'$sample': {'size': 1}},
            {'$project': {'_id': 0}}
        ]

        let coll = await db.collection("gen8" + userInput.tier)
        let document = await coll.aggregate(sample).toArray();
        sets.push(document[0])
        pokes.push(document[0]['name'])
        items.push(document[0]['item'])

        for (let i = 0; i < 5; i++) {
            document = await coll.aggregate(pipeline).toArray()
            sets.push(document[0])
            pokes.push(document[0]['name'])
            items.push(document[0]['item'])
        }
        return sets
    }

    static async getRandomTRTeam(db, userInput) {
        let pokes = [];
        let items = [];
        let sets = [];

        let sample = [
            {'$match': {
                    '$and': [
                        {'ivs.spe': {'$exists': true}},
                        {'evs.spe': {'$exists': false}}
                    ]}
            },
            {'$sample': {'size': 1}},
            {'$project': {'_id': 0}}
        ]
        let pipeline = [
            {'$match': {
                    '$and': [
                        {'name': {'$nin': pokes}},
                        {'item': {'$nin': items}},
                        {'ivs.spe': {'$exists': true}},
                        {'evs.spe': {'$exists': false}}
                    ]}
            },
            {'$sample': {'size': 1}},
            {'$project': {'_id': 0}}
        ]

        let coll = await db.collection("gen8" + userInput.tier)
        let document = await coll.aggregate(sample).toArray();
        sets.push(document[0])
        pokes.push(document[0]['name'])
        items.push(document[0]['item'])

        for (let i = 0; i < 6; i++) {
            document = await coll.aggregate(pipeline).toArray()
            sets.push(document[0])
            pokes.push(document[0]['name'])
            items.push(document[0]['item'])
        }
        return sets
    }

    static async getPokemonStats(db, userInput) {
        let res = await getAsync(userInput.name + "-tier" + userInput.tier)
        if (res) {
            return JSON.parse(res)
        }

        let pipeline = [
            {'$match': {'name': userInput.name} },
            {'$project': {'_id': 0} }
        ]

        let stats = await db.collection("statsgen8" + userInput.tier).aggregate(pipeline).toArray()
        if (stats.length === 1) {
            await client.set(userInput.name + '-tier' + userInput.tier, JSON.stringify(stats[0]), "EX", 60 * 60)
            return stats[0]
        } else {
            return null
        }
    }

    static async searchStats(db, userInput) {

    }

    static async getRankX(db, userInput) {
        let res = await getAsync("-tier" + userInput.tier)
        if (res) {
            res = JSON.parse(res)
            if (userInput.rank > res.length) {
                return res[res.length - 1]
            }
            return res[userInput.rank - 1]
        }

        let pipeline = [
            {'$sort': {'usage': -1}},
            {'$project': {'_id': 0}}
        ]
        let ranking = await db.collection("statsgen8" + userInput.tier).aggregate(pipeline).toArray();
        await client.set("-tier" + userInput.tier, JSON.stringify(ranking), "EX", 60 * 60)
        if (userInput.rank > ranking.length) {
            return ranking[ranking.length - 1]
        }
        return ranking[userInput.rank - 1]
    }

    static async getRankings(db, userInput) {
        let res = await getAsync("-tier" + userInput.tier)
        if (res) {
            return JSON.parse(res)
        }

        let pipeline = [
            {'$sort': {'usage': -1}},
            {'$project': {'_id': 0}}
        ]
        let ranking = await db.collection("statsgen8" + userInput.tier).aggregate(pipeline).toArray();
        await client.set("-tier" + userInput.tier, JSON.stringify(ranking), "EX", 60 * 60)
        return ranking
    }
}

module.exports = PokemonDAO
