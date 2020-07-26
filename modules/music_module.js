const { Message } = require("discord.js");
const ytdl = require("ytdl-core-discord");

class MusicModule {
    constructor() {
        this.playlist = [];
    }
    /**
     *
     * @param {Message} message
     * @param {*} args
     */
    async play(message, args) {
        const channel = message.member.voice.channel;

        if (channel) {
            const connection = await channel.join();

            const stream = connection.play(await ytdl(args[0], { filter: "audioonly" }), {
                type: "opus",
                volume: 0.05,
            });

            stream.on("finish", () => {
                connection.disconnect();
            });

            stream.on("error", (e) => {
                console.log(e);
            });
        }
    }

    _getCommands() {
        return Object.getOwnPropertyNames(MusicModule.prototype).filter(
            (item) => typeof this[item] === "function" && item !== "constructor" && !item.startsWith("_")
        );
    }
}

module.exports = new MusicModule();
