const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const request = require("request");

const port = process.argv.slice(2)[0];
const app = express();

app.use(bodyParser.json());

const heroesService = "http://localhost:8081";

const threats = require("./data/threats.js");
app.get("/threats", (req, res) => {
  console.log("Returning threats list");
  res.send(threats);
});

app.post("/assignment", (req, res) => {
  request.post(
    {
      headers: { "content-type": "application/json" },
      url: `${heroesService}/hero/${req.body.heroId}`,
      body: `{
              "busy": true
          }`
    },
    (err, heroResponse, body) => {
      if (!err) {
        console.log(req.body);
        const threatId = parseInt(req.body.threatId);
        const threat = threats.find(threat => threat.id === threatId);
        threat.assignedHero = req.body.heroId;
        res.status(202).send(threat);
      } else {
        res
          .status(400)
          .send({ problem: `Hero Service responded with issue ${err}` });
      }
    }
  );
});
app.use("/img", express.static(path.join(__dirname, "img")));

app.listen(port);
console.log(`Threats service listening on port ${port}`);
