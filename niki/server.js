const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
const bodyParser = require("body-parser");
const handlePromise = require("./traverse");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cors());
let latestOutput = [];
app.get("/ping", (req, res) => {
  res.json(latestOutput);
});

app.post("/postjson", async (req, res) => {
  const input = req.body;
  const output = await handlePromise(input);
  latestOutput = output;
  res.send(output);
});

app.listen(port, () => console.log("Server running on port " + port));
