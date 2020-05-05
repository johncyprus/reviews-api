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
app.get("/loaderio-113d7d969e742b7e561408700d75471f", (req, res) => {
  res.send("loaderio-113d7d969e742b7e561408700d75471f");
});

app.use("/", router);

const port = 3000;
app.listen(port, () => console.log(`App listening on port ${port}!`));
