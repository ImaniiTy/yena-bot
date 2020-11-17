const music = require('../includes/Music.Class');
const utils = require('../includes/utils');

module.exports = {
    name: 'resume',
    aliases: ['continue'],
    arguments: false,
    group: 'music',
    description: 'Resumes the current paused song.',
    execute(message) {
        
        // user is the same channel on the bot
        if (!utils.bot_on_same_channel(message)) return false;

        // Is not play anything
        if (!music.isPlaying) return false;

        // Resume audio
        music.currentStream.resume();

        return true;
    },
};