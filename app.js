const express = require("express");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Cross Origin
app.use(require("cors")());

//Model imports
require("./src/models/User");
require("./src/models/Board");
require("./src/models/Room");
require("./src/models/Board");

//Routes
app.use("/room", require("./src/routes/room"));
app.use("/user", require("./src/routes/user"));
app.use("/board", require("./src/routes/board"));

module.exports = app;
