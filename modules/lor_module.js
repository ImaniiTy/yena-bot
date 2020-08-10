const axios = require("axios").default;
const { Message, VoiceChannel } = require("discord.js");

// https://americas.api.riotgames.com/lor/ranked/v1/leaderboards?api_key=RGAPI-1dd61f45-65e5-4b49-bb7d-18314254ef0c
const baseURL = "https://americas.api.riotgames.com/lor";
const apiKey = "RGAPI-74dbf32f-fdc6-4fe6-908c-be6f24654f85";

class LorModule {
    /**
     *
     * @param {Message} message
     * @param {*} args
     */
    async lor(message, args) {
        try {
            const result = await axios.get(`${baseURL}/ranked/v1/leaderboards`, {
                params: {
                    api_key: apiKey,
                },
                headers: {
                    "X-Riot-Token": apiKey,
                },
            });

            const playerName = args.join(" ");
            const playerData = result.data.players.filter((value) => value.name === playerName)[0];

            playerData
                ? message.channel.send(`Rank: ${playerData.rank}  LP: ${playerData.lp}`)
                : message.channel.send(`Could not find Player ${playerName}`);
        } catch (error) {
            console.log(error);
        }
    }

    _getCommands() {
        return Object.getOwnPropertyNames(LorModule.prototype).filter(
            (item) => typeof this[item] === "function" && item !== "constructor" && !item.startsWith("_")
        );
    }
}

module.exports = new LorModule();
