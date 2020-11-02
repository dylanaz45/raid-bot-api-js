const { promisify } = require("util")
const client = require("redis").createClient(process.env.REDIS_URL);
const getAsync = promisify(client.get).bind(client);
const dex = require("../common/pokemonSearch")

class UsageDAO {
    static async getStats(db, params) {
        let redisKey = "stats-" + params.year + params.month + params.tier + params.tier_rank + params.pokemon
        let res = await getAsync(redisKey);
        if (res) {
            return JSON.parse(res)
        }

        let name = dex.search(params.pokemon, 3)
        let filter = {
            'year': params.year,
            'month': params.month,
            'tier': params.tier,
            'tier_rank': params.tier_rank,
            'name': name
        };
        let projection = {
            '_id': 0
        };
        let sort = {
            'rank': 1
        };
        let document = await db.find(filter, { projection: projection, sort: sort }).toArray()
        if (!document[0]) {
            return null
        } else {
            await client.set(redisKey, JSON.stringify(document[0]), "EX", 60 * 60)
            return document[0]
        }
    }

    static async getRankings(db, params) {
        let redisKey = "rankings-" + params.year + params.month + params.tier + params.tier_rank
        let res = await getAsync(redisKey);
        if (res) {
            return JSON.parse(res)
        }

        let filter = {
            'year': params.year,
            'month': params.month,
            'tier': params.tier,
            'tier_rank': params.tier_rank
        };
        let projection = {
            '_id': 0,
            'name': 1,
            'rank': 1,
            'usage': 1
        };
        let sort = {
            'rank': 1
        };
        let document = await db.find(filter, { projection: projection, sort: sort }).toArray()
        if (document.length === 0) {
            return null
        } else {
            await client.set(redisKey, JSON.stringify(document), "EX", 60 * 60)
            return document
        }
    }
}

module.exports = UsageDAO
