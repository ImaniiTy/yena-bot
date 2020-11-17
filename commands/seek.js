const music = require('../includes/Music.Class');
const msg = require('../includes/Messages');
const utils = require('../includes/utils');

module.exports = {
    name: 'seek',
    aliases: false,
    arguments: 'mm:ss',
    group: 'music',
    description: 'Seeks to a specific position in the current song.',
    async execute(message, args) {
                
        // No arguments |music name|
        if (!args.length) {
            msg.msg_error(message, 'Parameters ``mm:ss`` (minutes: seconds) were not provided!');
            return false;
        }
        
        // Connect in voice channel
        const connected = await music.try_connect_channel(message);
        if (!connected) return false;

        // Bot is not playing anything
        if (!music.isPlaying) {
            msg.msg_error(message, 'No sound is currently playing!');
            return false;
        }

        music.reset_timeout();
        try {
            // return time in seconds
            const time = utils.convert_time(args[0]);
            // add the current song to the first position in the queue
            music.queue.unshift(music.currentMusic);
            // Play the music again with 'seek'
            await music.play_next_music(time);
            // Convert seconds to mm:ss
            const time_minutes = new Date(time * 1000).toISOString().substr(14, 5);
            msg.msg_success(message, `Seeked to \`\`${time_minutes}\`\`.`);
        } catch (error) {
            console.log(error);
        }

        return true;
    }
}