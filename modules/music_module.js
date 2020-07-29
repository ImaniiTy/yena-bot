const { Message, VoiceChannel } = require("discord.js");
const Youtube = require("../utils/youtube");
const Format = require("../utils/format");
const ytdl = require("ytdl-core-discord");
const mm = require("music-metadata");
const axios = require("axios").default;

class MusicModule {
    constructor() {
        this.playlist = [];
        this.isPlaying = false;
        this.isLoading = false;
        this.maxTries = 3;
        this.messageChannel;
        this.radioInterval;
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
        this.playlist.push(args[0]);

        if (this.isPlaying) {
            return;
        }

        await this._tryConnectChannel(message);

        this.isPlaying = true;

        await this._playNextMusic();
    }

    /**
     *
     * @param {Message} message
     * @param {*} args
     */
    async search(message, args) {
        const query = args.join(" ");
        const results = await Youtube.search(query);

        const filter = (res) => {
            return !isNaN(res.content) && parseInt(res.content) > 0 && parseInt(res.content) <= results.length;
        };
        message.channel.send({ embed: Format.searchEmbed(message, results) }).then((sendedMessage) => {
            message.channel
                .awaitMessages(filter, { max: 1, time: 20000, errors: ["max"] })
                .then((collected) => {
                    const value = parseInt(collected.first().content);
                    this.play(message, [results[value - 1].url]);
                })
                .catch((collected) => {
                    console.log("error" + collected);
                });
        });
    }

    async skip(message, args) {
        await this._playNextMusic();
    }

    stop(message, args) {
        this.playlist = [];
        this.isPlaying = false;
        this.currentStream && this.currentStream.destroy();
        this.connection && this.connection.disconnect();
        clearInterval(this.radioInterval);
        this.radioInterval = null;
        this.connection = null;
    }

    /**
     *
     * @param {Message} message
     * @param {*} args
     */
    async radio(message, args) {
        const types = {
            kpop: "https://listen.moe/kpop/opus",
            jpop: "https://listen.moe/opus",
        };
        const url = types[args[0]];

        if (url) {
            await this._tryConnectChannel(message);
            await this._playRadio(url);
            this._setupRadioInterval(url);
        }
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
            .on("finish", () => {
                if (this.playlist.length) {
                    this._playNextMusic();
                } else {
                    this.isPlaying = false;
                    this.connection.disconnect();
                }
            })
            .on("error", (e) => {
                console.log(e);
            });
    }

    async _playRadio(url, currentTries = 0) {
        this.isLoading = true;
        const response = await axios({
            method: "get",
            url: url,
            responseType: "stream",
        }).catch((e) => {
            if (currentTries < this.maxTries) {
                this.messageChannel.send("Error trying to connect to radio stream, trying again...");
                setTimeout(() => this._playRadio(url, currentTries + 1), 2000);
            } else {
                this.messageChannel.send("Can't connnect to radio stream, try again later");
            }
        });

        mm.parseStream(response.data, { mimeType: "audio/ogg" }).then((metadata) => {
            this.messageChannel.send(`Current Playing: ${metadata.common.title} by ${metadata.common.artist}`);
        });

        this.currentStream && this.currentStream.destroy();
        this.currentStream = this.connection
            .play(response.data, {
                type: "ogg/opus",
                volume: 0.8,
            })
            .on("error", (e) => {
                console.log(e);
            })
            .once("start", () => {
                this.isLoading = false;
            });
    }

    /**
     *
     * @param {Message} message
     */
    async _tryConnectChannel(message) {
        const channel = message.member.voice.channel;
        if (!this.connection) {
            this.connection = await channel.join();
            this.messageChannel = message.channel;
        }
    }

    _setupRadioInterval(url) {
        clearInterval(this.radioInterval);
        this.radioInterval = setInterval(() => {
            if (!this.currentStream.writableLength && !this.isLoading) {
                this._playRadio(url);
            }
        }, 1000);
    }

    _getCurrentMusicPipe() {
        return ytdl(this.currentMusic, { filter: "audioonly", quality: "highestaudio", highWaterMark: 1 << 25 });
    }

    _getCommands() {
        return Object.getOwnPropertyNames(MusicModule.prototype).filter(
            (item) => typeof this[item] === "function" && item !== "constructor" && !item.startsWith("_")
        );
    }
}

module.exports = new MusicModule();
