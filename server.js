require('dotenv').config();
const Promise = require("bluebird")
const logger = require("./common/log")
const { MongoClient } = require("mongodb");

const server = require("express")();
const index = require("./routes/index");
const start = require("./routes/start");
const end = require("./routes/end");
const active = require("./routes/active");
const sprite = require("./routes/sprite");
const den_info = require("./routes/den_info");
const den_poke = require("./routes/den_poke");
const dadjoke = require("./routes/dadjoke");
const quote = require("./routes/quote");
const login = require("./routes/login");
const data = require("./routes/data");
const set = require("./routes/set");
const stats = require("./routes/stats");
const bodyParser = require("body-parser");

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: true}))
server.use('/api', index);
server.use('/api/start', start);
server.use('/api/end', end);
server.use('/api/active', active);
server.use('/api/sprite', sprite);
server.use('/api/den_info', den_info);
server.use('/api/den_poke', den_poke);
server.use('/api/dadjoke', dadjoke);
server.use('/api/quote', quote);
server.use('/api/login', login);
server.use('/api/data', data);
server.use('/api/set', set);
server.use('/api/stats', stats);

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
