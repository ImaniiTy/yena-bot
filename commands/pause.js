const music = require('../includes/Music.Class');
const utils = require('../includes/utils');

module.exports = {
    name: 'pause',
    aliases: ['break'],
    arguments: false,
    group: 'music',
    description: 'Pauses the current playing song.',
    execute(message) {
        // user is the same channel on the bot
        if (!utils.bot_on_same_channel(message)) return false;

        // Is not play anything
        if (!music.isPlaying) return false;

        // Pause audio
        music.currentStream.pause();

        return true;
    },
};
