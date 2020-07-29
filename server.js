// const express = require("express");
// const app = express();
process.env.DISCORD_TOKEN || require('dotenv').config();
const client = require("./bot");

process.on('unhandledRejection', error => console.error('Uncaught Promise Rejection', error));

// app.get("/", (req, res) => {
//   res.send("Ping");
// });

// app.listen(process.env.PORT, () =>
//   console.log(`listening on  ${process.env.PORT}`)
// );

client.moongose.init();
client.login(process.env.DISCORD_TOKEN);