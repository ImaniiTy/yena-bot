const music = require('../includes/Music.Class');
const utils = require('../includes/utils');
const msg = require('../includes/Messages');

module.exports = {
    name: 'resume',
    aliases: ['continue'],
    arguments: false,
    group: 'music',
    description: 'Resumes the current paused song.',
    execute(message, args) {
        console.log('fffffffff')        // user is the same channel on the bot
        if (!utils.bot_on_same_channel(message)) return false;

        // Queue is empty.
        if (!music.queue.length) {
            msg.msg_error(message, 'There is currently no song in the queue.');
            return false;
        }

        // This index does not exist
        if (music.queue.length < parseInt(args)) {
            msg.msg_error(message, `There\'s no song with index ``${parseInt(args)}`` in the queue.`);
            return false;
        }

        // Remove from queue
        music.queue.splice(parseInt(args) - 1, 1);

        msg.msg_success(message, `Song removed.`);

        return true;
    },
};