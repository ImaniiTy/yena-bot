const express = require("express");
const client = require("./bot");
const app = express();
process.env.DISCORD_TOKEN || require('dotenv').config();

require('dotenv').config()

app.get("/", (req, res) => {
  res.send("Ping");
});

app.listen(process.env.PORT, () =>
  console.log(`listening on  ${process.env.PORT}`)
);

// client.login(process.env.DISCORD_TOKEN);
client.login(process.env.DISCORD_TOKEN);