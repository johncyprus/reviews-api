const dotenv = require("dotenv").config({ path: __dirname + "/.env" });
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const router = require("./router");

if (dotenv.error) {
  throw dotenv.error;
}

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Testing route for loader.io
app.get("/loaderio-74e1a52a61f54b9c5d4f5146b36b98d5", (req, res) => {
  res.sendStatus(200);
});

app.use("/", router);

const port = 3000;
app.listen(port, () => console.log(`App listening on port ${port}!`));
