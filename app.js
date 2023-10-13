const express = require("express");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Cross Origin
app.use(require("cors")());

//Routes
app.use("/user", require("./src/routes/user"));
app.use("/room", require("./src/routes/room"));
app.use("/board", require("./src/routes/board"));

module.exports = app;
