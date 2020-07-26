const { Message } = require("discord.js");
const ytdl = require("ytdl-core-discord");

class MusicModule {
    constructor() {
        this.playlist = [];
        this.isPlaying = false;
        this.connection;
        this.currentStream;
        this.currentMusic;
    }

    /**
     *
     * @param {Message} message
     * @param {*} args
     */
    async play(message, args) {
        const channel = message.member.voice.channel;

        if (channel) {
            this.playlist.push(args[0]);

            if (this.isPlaying) {
                return;
            }

            if (!this.connection) {
                this.connection = await channel.join();
            }

            this.isPlaying = true;

            await this._playNextMusic();
        }
    }

    async skip(message, args) {
        await this._playNextMusic();
    }

    async debug(message, args) {
        console.log(this.playlist);
        console.log(this.currentMusic);
        console.log(this.currentStream);

    }

    async _playNextMusic() {
        this.currentMusic = this.playlist.shift();

        const audioPipe = await this._getCurrentMusicPipe();
        this.currentStream = this.connection
            .play(audioPipe, {
                type: "opus",
                volume: 0.05,
            })
            .on("finish", async () => {
                console.log("music finished");
                console.log(this.playlist);
                if (this.playlist.length) {
                    await this._playNextMusic();
                } else {
                    this.isPlaying = false;
                    this.connection.disconnect();
                }
            })
            .on("error", (e) => {
                console.log(e);
            }).on("debug", (info) => {
                console.log("info");
            }).on("unpipe", (src) => {
                console.log(src);
            });
    }

    _getCurrentMusicPipe() {
        return ytdl(this.currentMusic, { filter: "audioonly", quality: "highestaudio" });
    }

    _getCommands() {
        return Object.getOwnPropertyNames(MusicModule.prototype).filter(
            (item) => typeof this[item] === "function" && item !== "constructor" && !item.startsWith("_")
        );
    }
}

module.exports = new MusicModule();
