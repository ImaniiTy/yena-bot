const { DB } = require('../includes/db/DB.Class');
const msg = require('../includes/Messages');

module.exports = {
    name: 'prefix',
    aliases: false,
    arguments: false,
    group: 'all',
    description: 'Show the current prefix./Set a new prefix.',
    async execute(message, args) {

        // Show Current Prefix
        if (!args.length) {
            msg.msg_success(message, `Prefix for this server is: \`\`${message.guild.prefix}\`\``, '**Prefix**')
            return true;
        }

        // User is not Admin
        if(!message.member.hasPermission('MANAGE_GUILD')) {
            msg.msg_error(message, 'You don\'t have permission to use that.')
            return false;
        }

        // Prefix too long
        if (args.join('') > 4) {
            msg.msg_error(message, 'Your new prefix must be under \`4\` characters!');
            return false;
        }


        const new_prefix = args.join('').toLowerCase().replace(/([\$\%\/\*\(\)\&\¨\@\"\{\}\[\]\´\`\^'])/g,'');

        
        if (!new_prefix) {
            msg.msg_error(message, 'You have provided some character not allowed.')
            return false
        }

        const guild_id = message.channel.guild.id;

        // Set in DB
        try {
            const insert = await new DB(guild_id).update_guild_data('g_prefix', new_prefix);
            if (insert) {
                msg.msg_success(message, 'Prefix updated successfully.');
                return true;
            }
        } catch (error) {
            msg.msg_error(message, 'It was not possible to update your prefix.\nContact the administrator.');
            return false;
        }

        return false;
    }
}