const Discord = require('discord.js');
const client = new Discord.Client();
client.commands = new Discord.Collection()

const commands = require('./commands')


const prefix = "..";

// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
    // ignore messages without the prefix
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/)
    const command = args.shift().toLowerCase();

    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);

        // set a new item in the Collection
        // with the key as the command name and the value as the exported module
        client.commands.set(command.name, command);
    }
    
    message.channel.send(command);
    if(message.content === `${prefix}ping`) {
        message.channel.send('Pong.')
        message.channel.send(`${client.emojis.cache.get('662838179438788619')}`)
    }
})

// login to Discord with your app's token
module.exports = client;