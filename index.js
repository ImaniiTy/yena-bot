require('dotenv').config();
const { readdir } = require('fs');
const { Client, Collection } = require('discord.js');

const client = new Client({ disableMentions: 'everyone' });

readdir('./events/', (error, files) => {
    if (error) return console.error(error);
    console.log('--| Log | Loading \'Events\'...');
    files.forEach((file) => {
      const event = require(`./events/${file}`);
      const eventName = file.split('.')[0];
      client.on(eventName, event.bind(null, client));
    });
    console.log('--| Log | \'Events\' Loaded!!');
    console.log('----------------------------------');
    return true;
});

client.commands = new Collection();

readdir('./commands', (error, files) => {
  if (error) return console.error(error);
  console.log('--| Log | Loading \'Commands\'...');
  files.forEach((file) => {
    if (!file.endsWith('.js')) return;
    const command = require(`./commands/${file}`);
    const commandName = file.split('.')[0];
    client.commands.set(commandName, command);
  });
  console.log('--| Log | \'Commands\' Loaded!!');
  console.log('----------------------------------');
  return true;
});
console.log('----------------------------------');

client.login(process.env.DISCORD_TOKEN);