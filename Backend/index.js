const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const urlRoutes = require("./routes/urlRoutes");
const Log = require("../LoggingMiddware/logger");

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());
app.use("/", urlRoutes);

app.listen(port, async () => {
  await Log("backend", "info", "service", `Backend started on ${port}`);
  console.log(`Running on http://localhost:${port}`);
});
