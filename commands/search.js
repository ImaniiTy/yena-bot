const { YoutubeSearch } = require('../includes/Youtube/YoutubeSearch.Class');
const music = require('../includes/Music.Class');
const msg = require('../includes/Messages');

module.exports = {
    name: 'search',
    aliases: ['s'],
    arguments: '<song name>',
    group: 'music',
    description: 'Plays a song.',
    async execute(message, args) {

        // No arguments |music name|
        if (!args.length) {
            msg.msg_error(message, 'No song name provided!');
            return false;
        }

        const connected = await music.try_connect_channel(message);
        if (!connected) return false;

        const video_found = await new YoutubeSearch().search(message, args);

        if (!video_found) {
            // error msg
            return false;
        }

        // Insert in queue
        const video_inserted = await music.queue_constructor([video_found]);

        if (music.isPlaying) {
            // [FT] Update msg   |  music.update_song_message(message)
            return false;
        }

        // try play music
        if (video_inserted) {
            try {
                await music.play_next_music();
            } catch (error) {
                console.log(error);
            }            
        }

        return true;
    }
}