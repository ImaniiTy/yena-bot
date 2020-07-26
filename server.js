const express = require("express");
const client = require("./bot");
const app = express();

app.get("/", (req, res) => {
  res.send("Ping");
});

app.listen(process.env.PORT, () =>
  console.log(`listening on  ${process.env.PORT}`)
);

// client.login(process.env.DISCORD_TOKEN);
client.login("NzM2NzI5OTk0NTI4Njg2MTAw.XxzDRg.LZpWygXTgXy19j10sOwtAW9p_L8");