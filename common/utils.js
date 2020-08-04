require('dotenv').config();
const {MongoClient} = require("mongodb");

/**
 * Class that connects to the MongoDB database and returns the database instance
 */
class MongoConnection {
    static async connectToMongo() {
        if (this.db) return this.db
        const client = await MongoClient.connect(this.uri, this.options)
        this.db = client.db("discord")
        return this.db
    }
}
MongoConnection.db = null;
MongoConnection.uri = process.env.MONGO_URI;
MongoConnection.options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

module.exports = {MongoConnection}