const Discord = require("discord.js");
const botModules = require("./modules");
const config = require("./bot_config.json");
const client = new Discord.Client();

client.moongose = require('./mongoose_start')

function loadCommands() {
    client.commands = new Discord.Collection();
    for (const module in botModules) {
        const commands = botModules[module]._getCommands();
        for (const command of commands) {
            client.commands.set(command, botModules[module]);
        }
    }
}

loadCommands();


// this event will only trigger one time after logging in
client.once("ready", () => {
    console.log("Ready!");
});

client.on("message", (message) => {
    // ignore messages without the prefix
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;
    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (!client.commands.has(command)) return;

    try {
        client.commands.get(command)[command](message, args);
    } catch (error) {
        console.error(error);
        message.reply("there was an error trying to execute that command!");
    }
});

// login to Discord with your app's token
module.exports = client;