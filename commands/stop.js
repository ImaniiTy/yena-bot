const music = require('../includes/Music.Class');
const msg = require('../includes/Messages');
const utils = require('../includes/utils');

module.exports = {
    name: 'stop',
    aliases: ['leave', 'dc', 'disconnect'],
    arguments: false,
    group: 'music',
    description: 'Stops the player and clear the queue.',
    execute(message, args) {
        
        // User is on the same channel as the bot
        if (!utils.bot_on_same_channel(message)) {
            msg.msg_error(message, 'You need to be on the same voice channel as the bot to use this command.');
            return false;
        }

        music.stop();

        msg.msg_success(message, 'Music stopped & queue cleared.');
        
        return true;
    },
};
