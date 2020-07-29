const { inlineLists } = require("common-tags");
const { Message } = require("discord.js");

class Format {
    /**
     *
     * @param {Message} message
     * @param {*} results
     */
    static searchEmbed(message, results) {
        const resultsString = results.map(
            (videoInfo, index) =>
                `**${index + 1}. [${videoInfo.getTitleClamped(65)}](${videoInfo.url}) (${videoInfo.getConvertedDuration()})**\n`
        );

        const author = message.author.username;
        const authorIcon = message.author.avatarURL();
        console.log(resultsString[3]);

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
