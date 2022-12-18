require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const path = require("path");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", express.static(path.join(__dirname, "../public")));

const { Map } = require("immutable");

// your API calls

// example API call

app.get("/rover-data/:name", async (req, res) => {
  try {
    const name = req.params.name;
    const data = await fetch(
      `https://api.nasa.gov/mars-photos/api/v1/rovers/${name}/photos?sol=1000&api_key=${process.env.API_KEY}`
    ).then((res) => res.json());
    // console.log(data);
    res.send({ data });
  } catch (err) {
    console.log("error:", err);
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
