const music = require('../includes/Music.Class');
const msg = require('../includes/Messages');
const search = require('./search');

module.exports = {
    name: 'play',
    aliases: ['p'],
    arguments: '<song name/url>',
    group: 'music',
    description: 'Plays a song.',
    async execute(message, args) {

        // No arguments |music name|
        if (!args.length) {
            msg.msg_error(message, 'No song name or url provided!');
            return false;
        }
        
        const connected = await music.try_connect_channel(message);
        if (!connected) return false;
   
        let insert_in_queue = await music.queue_constructor(args);
    
        if (!insert_in_queue) {
            msg.msg_error(message, 'it was not possible to insert the song in the queue!\nError: 8005');
            return false;
        }

        if (insert_in_queue === 'search') {
            try {
                await search.execute(message, args)
                return true;
            } catch (error) {
                console.error(error);
                msg.msg_error(message, error.message);
                return false;
            }
        }

        if (music.isPlaying) {
            // [FT] Update msg   |  music.update_song_message(message)
            return true;
        }
        
        try {
            await music.play_next_music();
        } catch (error) {
            console.log(error);
        }

        return true;        
    }
}