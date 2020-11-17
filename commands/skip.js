const music = require('../includes/Music.Class');
const msg = require('../includes/Messages');
const utils = require('../includes/utils');

module.exports = {
    name: 'skip',
    aliases: ['next'],
    arguments: '<trackNumber> (Optional)',
    group: 'music',
    description: 'Lets you skip the current song./Skips to a specific track in the queue.',
    async execute(message, args) {
        
        // User is on the same channel as the bot
        if (!utils.bot_on_same_channel(message)) {
            msg.msg_error(message, 'You need to be on the same voice channel as the bot to use this command.');
            return false;
        }

       
        if (!music.queue.length) {
            music.stop();

            msg.msg_error(message, 'There is currently no song in the queue.');
            return true;
        }

        const skip_to = (args) ? parseInt(args) : 1;

        for (let i = 0; i < skip_to - 1; i += 1) {
            await music.queue.shift();
        }

        music.play_next_music();
        
        msg.msg_success(message, 'Skipped the current song.');
    
        return true;
    },
};
