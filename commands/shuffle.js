const music = require('../includes/Music.Class');
const utils = require('../includes/utils');
const msg = require('../includes/Messages');

module.exports = {
    name: 'shuffle',
    aliases: ['sh'],
    arguments: false,
    group: 'all',
    description: 'Shuffle the queue.',
    async execute(message, args) {
        
        // User is on the same channel as the bot
        if (!utils.bot_on_same_channel(message)) {
            msg.msg_error(message, 'You need to be on the same voice channel as the bot to use this command.');
            return false;
        }

        // Queue is empty.
        if (!music.queue.length) {
            msg.msg_error(message, 'There is currently no song in the queue.');
            return false;
        }

        // Queue is empty.
        if (music.queue.length < 3) {
            msg.msg_error(message, 'Need at least ``3`` songs in the queue to shuffle.');
            return false;
        }

        
        let current_index = music.queue.length;
        let temporary_value;
        let random_index;

        while (current_index !== 0) {
            random_index = Math.floor(Math.random() * current_index);
            current_index -= 1;

            temporary_value = music.queue[current_index];
            music.queue[current_index] = music.queue[random_index];
            music.queue[random_index] = temporary_value;
        }

        return true;
    },
};
