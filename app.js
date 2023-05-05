const express = require("express");
const cors = require("cors");
const route = require("./app/routes/index.route");
const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));

route(app);

module.exports = app;
