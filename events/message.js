require('dotenv').config();
const { DB } = require('../includes/db/DB.Class');

module.exports = async (client, message) => {
    if (message.author.bot || !message.guild) return;
    
    // Sets the guild.prefix
    const guild_data = await new DB(message.guild.id).get_guild_data();
    message.guild.prefix = (guild_data && guild_data.g_prefix) ? guild_data.g_prefix : process.env.PREFIX;

    const music_channel_id = (guild_data && guild_data.g_song_channel_id) ? guild_data.g_song_channel_id : false;
    

    // Returns if the message does not contain the prefix.
    if (message.content.slice(0, message.guild.prefix.length) !== message.guild.prefix) {
        if (message.channel.id === music_channel_id) {
            message.channel.send({
                embed: {
                    title: '**Oops...!**',
                    description: [
                        `Use the prefix \`\`${message.guild.prefix}\`\``,
                    ].join('\n'),
                    color: '#F0463A',
                  },
            }).then((msg) => msg.delete({ timeout: process.env.TIMEOUT })).catch(console.error);
            message.delete({ timeout: 2 });
        }
        return;
    }


    const args = message.content.includes(message.guild.prefix)
        ? message.content.slice(message.guild.prefix.length).trim().split(/ +/)
        : message.content.trim().split(/ +/);

    const commandName = (message.content.includes(message.guild.prefix))
        ? args.shift().toLowerCase()
        : args[0].toLowerCase();

    // Search Command by name, aliases or define "play'
    let command = client.commands.get(commandName)
        || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName))
        || false;

    if (!command) {
        message.channel.send({
            embed: {
                title: '**Oops...!**',
                description: [
                    'The Command you are trying to use does not exist.',
                    'Look at the list of commands with ``"help"``',
                ].join('\n'),
                color: '#F0463A',
              },
        }).then((msg) => msg.delete({ timeout: process.env.TIMEOUT })).catch(console.error);
        return false;
    }

    // Command is part of the group 'music' but was not performed in the music room.
    if (command.group === 'music' && message.channel.id !== music_channel_id) {
        message.channel.send({
            embed: {
                title: '**Oops...!**',
                description: [
                    `This command only works on the "<#${music_channel_id}>" channel! \nCommand: \`\`${
                        message.guild.prefix + command.name
                        }\`\`\n\`\`${command.description}\`\``,
                ].join('\n'),
                color: '#F0463A',
              },
        }).then((msg) => msg.delete({ timeout: process.env.TIMEOUT }))
            .catch(console.error);
        return false;
    }

    // Execute Command
    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message
            .reply('There was an error executing that command.')
            .catch(console.error);
        return false;
    }

    // Delete command messages
    message.delete({ timeout: 2 });
};
