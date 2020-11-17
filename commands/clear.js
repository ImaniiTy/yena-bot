const music = require('../includes/Music.Class');
const msg = require('../includes/Messages');
const utils = require('../includes/utils');

module.exports = {
    name: 'clear',
    aliases: ['c', 'empty'],
    arguments: false,
    group: 'music',
    description: 'Clears the current queue.',
    async execute(message) {
        // User is on the same channel as the bot
        if (!utils.bot_on_same_channel(message)) return false;

        // Queue is empty.
        if (!music.queue.length) {
            msg.msg_error(message, 'There is currently no song in the queue.');
            return;
        }

        // Clear Queue
        music.queue = [];

        msg.msg_success(message, 'The queue has been cleared.')

        // [FT] update song_message

        return true;
    }
}