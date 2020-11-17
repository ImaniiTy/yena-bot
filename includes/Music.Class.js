const { Youtube } = require('./Youtube/Youtube.Class');
const { YoutubePlaylist } = require('./Youtube/YoutubePlaylist.Class');
const ytdl = require('ytdl-core');
const axios = require('axios').default;
const msg = require('../includes/Messages');
const utils = require('../includes/utils');

class Music {
    constructor() {
        this.queue = [];
        this.isPlaying = false;
        this.loop = false;
        this.connection;
        this.messageChannel;
        this.musicTimeout;
        this.currentStream;
        this.radioInterval;        
    }

    
    async try_connect_channel(message) {
        const { channel } = message.member.voice;
        
        // User is not in any voice room
        if (!channel) {
            msg.msg_error(message, 'You need to join a voice channel first!');
            return false;
        }

        // Bot does NOT have 'Connect' or 'Speak' permissions
        if (!utils.have_connect_or_speak_permission(message)) {
            msg.msg_error(message, '``Cannot Connect or Speak`` on this voice channel!');
            return false;
        }
        
        
        // Bot is already on some channel
        if (!utils.bot_on_same_channel(message)) {
            msg.msg_error(message, 'Bot is already on some channel!');
            return false;
        }

        // [FT] already on some channel 
        
        if (!this.connection) {
            this.connection = await channel.join();
            this.messageChannel = message.channel;
            await this.connection.voice.setSelfDeaf(true);
        }
        return true;
    }

    async queue_constructor(args) {
        const source_s = this.source_site(args);

        let song = false;

        switch (source_s) {
            // Youtube Link
            case 'youtube':
                const music_data = await new Youtube().get_video_data(args[0]);
                song = {
                    title: music_data.title,
                    url: music_data.url,
                    thumbnail: music_data.thumbnail,
                };
                this.queue.push(song);
                break;
            
            // Youtube Playlist Link
            case 'youtube_playlist':
                const youtube_playlist = await new YoutubePlaylist().get_playlist_data(args[0]);
                if (!youtube_playlist) return false;

                youtube_playlist.forEach( (video) => {
                    song = {
                        title: video.name,
                        url: `https://youtu.be/${video.id}`,
                        thumbnail: false,
                    };
                    this.queue.push(song);
                });
                break;
            
            // Spotify Link
            case 'spotify':
                break;
            
            // Spotify Playlist Link
            case 'spotify_playlist':
                break;
            
            // Search in Youtube
            default: 
                return 'search';
        }

        return true;        
    }
    
    queue_page() {
        const queue_paged = [];
        let page_number = 0;

        for (let index = 0; index < this.queue.length; index += 1) {
            // Limit of items on the page reached. Add +1 page
            if (queue_paged[page_number] && queue_paged[page_number].length === 15) {
            page_number += 1;
            }
            // Page does not exist, create array
            if (!queue_paged[page_number]) {
            queue_paged[page_number] = [];
            }

            if (page_number === 0 && !queue_paged[page_number].length && this.currentMusic !== undefined) {
            queue_paged[page_number].push(`**PLAYING -** [${this.currentMusic.title}](${this.currentMusic.url})\n`);
            }

            queue_paged[page_number].push(`${(index + 1)}. [${this.queue[index].title}](${this.queue[index].url})\n`);
        }
        return queue_paged;          
    }

    
    source_site(args) {
        const is_youtube_url = /^(https?:\/\/)?(www\.)?(m\.)?(youtu\.be\/|youtube\.com\/)(?!.*(&list=)).+$/gi.test(args[0]);
        const is_youtube_playlist = /^.*(list=)([^#\&\?]*).*/gi.test(args[0]);

        const is_spotify_url = /^(spotify:track|https:\/\/[a-z]+\.spotify\.com\/track)/.test(args[0]);
        const is_spotify_playlist = /^(https:\/\/open.spotify.com\/user\/([a-zA-Z0-9]+)\/playlist\/|spotify:user:([a-zA-Z0-9]+):playlist:)([a-zA-Z0-9]+)(.*)$/.test(args[0]);

        if (is_youtube_url) {
            return 'youtube';
        } else if (is_youtube_playlist) {
            return 'youtube_playlist';
        } else if (is_spotify_url) {
            return 'spotify';
        } else if (is_spotify_playlist) {
            return 'spotify_playlist';
        }   
    }    


    async play_next_music(seek = 0) {
        clearTimeout(this.musicTimeout);
        this.currentMusic = this.queue.shift();
        
        const audio_pipe = ytdl(this.currentMusic.url, {filter : 'audioonly', quality: "highestaudio"});

        // [FT] await this.song_msg.edit

        this.isPlaying = true;

        const stream_options = { seek: seek, volume: 1.0, highWaterMark: 1 << 25 };

        this.currentStream = this.connection.play(audio_pipe, stream_options)
        .on('finish', () => {
            if (this.queue.length) {
                this.play_next_music();
            } else {
                this.isPlaying = false;

                // Disconnects the bot after X seconds, if nothing is playing.
                this.reset_timeout();
            }
        })
        .on('error', (e) => {
            console.log(e);
            this.stop();
        });

    }

    reset_timeout() {
        // Clear
        clearTimeout(this.musicTimeout);

        // Set Again
        this.musicTimeout = setTimeout(
            () => this._stop_after_time(),
            300000, // 300000 = 5min
        );

    }



    stop() {
        this.queue = [];
        this.isPlaying = false;
        this.currentStream && this.currentStream.destroy();
        this.connection && this.connection.disconnect();
        this.connection = null;
        clearInterval(this.radioInterval);
        this.radioInterval = null;
    }

    _stop_after_time() {
        console.log('_stop_after_time....');
        if (!this.isPlaying && this.queue.length === 0) {
            this.stop();
            return true;
        }
        return false;
    }



    async play_radio({ url, name }, message, currentTries = 0) {
        if (!utils.someone_on_the_channel(message)) {
            this.stop();
            return false;
        }

        const response = await axios({
            method: 'get',
            url,
            responseType: 'stream',
        }).catch((e) => {
            this._try_radio_again({ url, name }, message, currentTries);
        });

        if (response != null) {
            
            // [FT] Edit song channel msg
            // parseStream(response.data, { mimeType: 'audio/ogg' }).then ...

            this.currentStream && this.currentStream.destroy();
            this.currentStream = this.connection
            .play(response.data, {
                type: 'ogg/opus',
                volume: 1.0,
            })
            .on('error', (e) => {
                console.log(e);
            })
            .once('start', () => {

            });

        } else {
            this._try_radio_again({ url, name }, message, currentTries);
        }

        return true;
    }

    async _try_radio_again({ url, name }, message, currentTries) {
        if (currentTries < this.maxTries) {
            // [FT] Edit song channel msg
            setTimeout(
                () => this.play_radio({ url, name }, message, currentTries + 1),
                2000,
            );
        } else {
            // [FT] Edit song channel msg
            msg.msg_error(message, 'Can\'t connnect to radio stream, try again later', '**Oops...!**');
        }
    }

    _reset_radio_interval({ url, name }, message) {
        clearInterval(this.radioInterval);
        this.radioInterval = setInterval(() => {
            if (!this.currentStream.writableLength && !this.isLoading) {
                this.play_radio({ url, name }, message);
            }
        }, 1000);
    }
}

module.exports = new Music();