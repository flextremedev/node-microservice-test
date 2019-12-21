const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const port = process.argv.slice(2)[0];
const app = express();
app.use(bodyParser.json());
const powers = require("./data/powers.js");
const heroes = require("./data/heroes.js");

app.get("/heroes", (req, res) => {
  console.log("Returning heroes list");
  res.send(heroes);
});

app.get("/powers", (req, res) => {
  console.log("Returning powers list");
  res.send(powers);
});
app.post("/hero/**", (req, res) => {
  const heroId = parseInt(req.params[0]);
  const foundHero = heroes.find(hero => hero.id === heroId);
  if (foundHero) {
    for (let attribute in foundHero) {
      if (req.body[attribute]) {
        foundHero[attribute] = req.body[attribute];
        console.log(
          `Set ${attribute} to ${req.body[attribute]} in hero: ${heroId}`
        );
      }
    }
    res
      .status(202)
      .header({ Location: `http://localhost:${port}/hero/${foundHero.id}` })
      .send(foundHero);
  } else {
    console.log("Hero not found");
    res.status(404).send();
  }
});
app.use("/img", express.static(path.join(__dirname, "img")));
app.listen(port);
console.log(`Heroes service listening on port ${port}`);
