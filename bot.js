const Discord = require("discord.js");
const client = new Discord.Client();

const commands = require("./commands");

const prefix = "..";

client.commands = new Discord.Collection(commands);

// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once("ready", () => {
    console.log("Ready!");
});

client.on("message", (message) => {
    // ignore messages without the prefix
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (!client.commands.has(command)) return;

    try {
        client.commands.get(command).execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply("there was an error trying to execute that command!");
    }
});

// login to Discord with your app's token
module.exports = client;
