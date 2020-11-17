const { MessageEmbed } = require('discord.js');
const { DB } = require('../includes/db/DB.Class');

module.exports = {
    name: 'help',
    aliases: ['h'],
    group: 'all',
    description: 'Display all commands and descriptions',
    async execute(message) {

        const guild_data = await new DB(message.channel.guild.id).get_guild_data();
        const prefix = (guild_data.g_prefix) ? guild_data.g_prefix : process.env.PREFIX;

        
        const list = [];
        const commands = message.client.commands.array();
        commands.forEach((cmd) => {
            list.push( `\`\`${prefix}${cmd.name} ${cmd.arguments ? ` ${cmd.arguments}` : ''} ${cmd.aliases ? `| ${cmd.aliases}` : ''}\`\`\n${cmd.description}\n`,);
        });

        const helpEmbed = new MessageEmbed()
            .setTitle('--= Help =--')
            .setColor('#C14BF7')
            .addField('\u200B', list.join(''));

        message.channel.send(helpEmbed).then((msg) => msg.delete({ timeout: process.env.TIMEOUT })).catch(console.error);
        
        return true;
    },
};
