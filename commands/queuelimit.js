const { DB } = require('../includes/db/DB.Class');
const { msg_success } = require('../includes/Messages');
const msg = require('../includes/Messages');

module.exports = {
    name: 'queuelimit',
    aliases: ['ql'],
    arguments: '<limit>',
    group: 'music',
    description: 'Show the song limit for the queue. | Set the song limit for the queue.',
    async execute(message, args) {

        const guild_id = message.channel.guild.id;
        const guild_data = await new DB(guild_id).get_guild_data();

        // Show Current Limit
        if (!args.length) {
            if (!guild_data.g_queuelimit) {
                msg_success(message, `Queue limit: \`\`${process.env.QUEUE_LIMIT}\`\``)
                return true;
            }

            msg.msg_success(message, `Queue limit: \`\`${guild_data.g_queuelimit}\`\``)
            return true;
        }

        // User is not Admin
        if(!message.member.hasPermission('MANAGE_GUILD')) {
            msg.msg_error(message, 'You don\'t have permission to use that.')
            return false;
        }

        if ( isNaN( parseInt(args.join('')) ) ) {
            msg.msg_error(message, 'Enter a number.');
            return false;
        }

        
        try {
            const insert = new DB(guild_id).update_guild_data('g_queuelimit', parseInt(args.join('')) );
            if (insert) {
                msg.msg_success(message, 'QueueLimit updated successfully.');
                return true;
            }
        } catch (error) {
            msg.msg_error(message, 'It was not possible to update your QueueLimit.\nContact the administrator.');
            return false;
        }

        return true;
    }
}
