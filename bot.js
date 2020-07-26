const Discord = require("discord.js");
const client = new Discord.Client();
client.commands = new Discord.Collection()

const prefix = "..";

const commandFiles = require('./commands');

for (const file of commandFiles) {

    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    client.commands.set(command.name, command);
}

client.on("message", (message) => {
    // ignore messages without the prefix
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'ping') {
        client.commands.get('ping').execute(message, args)
    }
});

// login to Discord with your app's token
module.exports = client;