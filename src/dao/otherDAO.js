let pipeline = [
    {'$sample': {size: 1} },
    {'$project': {'_id': 0}}
]

class OtherDAO {
    static async getRandomJoke(db) {
        let document = await db.collection("dad_jokes").aggregate(pipeline).toArray()
        return {joke: document[0].joke}
    }

    static async getRandomQuote(db) {
        let document = await db.collection("quotes").aggregate(pipeline).toArray()
        return {text: document[0].quoteText, author: document[0].quoteAuthor}
    }
}

module.exports = OtherDAO
