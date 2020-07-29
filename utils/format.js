const { inlineLists } = require("common-tags");
const Entitites = require("html-entities").AllHtmlEntities;
const { Message } = require("discord.js");

const entitites = new Entitites();

class Format {
    /**
     *
     * @param {Message} message
     * @param {*} results
     */
    static searchEmbed(message, results) {
        const resultsString = results.map((videoInfo, index) =>
            entitites.decode(`**${index + 1}. [${videoInfo.title}](${videoInfo.url})**\n`)
        );

        const author = message.author.username;
        const authorIcon = message.author.avatarURL();

        return {
            title: "**Type the song number to select it**",
            description: inlineLists`${resultsString}`,
            author: {
                name: author,
                icon_url: authorIcon,
            },
        };
    }
}

module.exports = Format;
