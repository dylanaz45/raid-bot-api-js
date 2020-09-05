require('dotenv').config();
const Promise = require("bluebird")
const logger = require("./src/common/log")
const { MongoClient } = require("mongodb");

const server = require("express")();
const bodyParser = require("body-parser");
const index = require("./src/api/index")
const user = require("./src/api/users.route")
const raids = require("./src/api/raids.route")
const pokemon = require("./src/api/pokemon.route")
const other = require("./src/api/other.route")

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: true}))

server.use('/api', index);
server.use('/api/user', user);
server.use('/api/raids', raids);
server.use('/api/pokemon', pokemon);
server.use('/api/other', other)

const port = process.env.PORT || 3000
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    promiseLibrary: Promise
}

MongoClient.connect(process.env.MONGO_URI, options, (err, db) => {
    if (err) {
        logger.warn("Failed to connect to database ${err.stack}")
    }

    server.locals.db = db.db("discord")
    server.listen(port, () => {
        console.log("Listening on port " + port)
    })
})
