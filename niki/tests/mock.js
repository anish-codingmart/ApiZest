const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true
  })
);

app.get("/first", (req, res) => {
  res.json({ id: Number(req.query.id) + 1 });
});

app.get("/second/:id", (req, res) => {
  res.json({ id: Number(req.params.id) + 1 });
});

app.post("/third", (req, res) => {
  res.json({ id: Number(req.body.id) + 1 });
});

app.listen(3001, () => {
  console.log("Server Running !");
});
