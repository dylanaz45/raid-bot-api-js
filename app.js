require('dotenv').config();

const app = require("express")();
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

app.use('/', index);
app.use('/start', start);
app.use('/end', end);
app.use('/active', active);
app.use('/sprite', sprite);
app.use('/den_info', den_info);
app.use('/den_poke', den_poke);
app.use('/dadjoke', dadjoke);
app.use('/quote', quote);
app.use('/login', login);
app.use('/data', data);
app.use('/set', set);

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log("Listening on port " + port)
})

module.exports = app;
